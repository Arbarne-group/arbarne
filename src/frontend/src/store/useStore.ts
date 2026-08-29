import { create } from 'zustand';
import {
  ScreenId,
  User,
  Pillar,
  Question,
  AssessmentResult,
  AssessmentHistoryItem,
  DashboardSummary,
  GamificationState,
  AppNotification,
  InboxItem,
} from '../types';
import { portalApi } from '../services/api';
import confetti from 'canvas-confetti';

export function isJwtExpired(token: string | null): boolean {
  if (!token) return true;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return true;
    const payload = JSON.parse(atob(parts[1]));
    if (!payload.exp) return false;
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

const DEFAULT_USER: User = {
  name: 'Grace Wanjiru',
  phone: '+254 700 123 456',
  email: 'farmer@arbarne.org',
  farm_name: 'Kakamega Demonstration Farm',
  farm_region: 'Western Kenya',
  farm_crop_type: 'Maize, Dairy & Vegetables',
  farm_size_acres: 5.0,
  tier: 3,
  tier_name: 'Structured Farm',
  ffmi_score: 13.8,
};

// Evict stale gamification cache if it's missing the badges array
// (saved before the icon field existed). Forces a fresh backend fetch.
const cachedGamification = localStorage.getItem('fff_gamification');
if (cachedGamification) {
  try {
    const parsed = JSON.parse(cachedGamification);
    if (!Array.isArray(parsed.badges) || parsed.badges.some((b: any) => !b.icon)) {
      localStorage.removeItem('fff_gamification');
    }
  } catch {
    localStorage.removeItem('fff_gamification');
  }
}

const DEFAULT_GAMIFICATION: GamificationState = {
  total_xp: 620,
  level: 3,
  level_name: 'Resilient Steward',
  current_level_min_xp: 500,
  next_level_xp: 1000,
  streak_days: 3,
  unlocked_badge_keys: ['soil_guardian', 'quick_learner', 'future_ready_100k'],
  completed_quest_ids: ['quest_soil_baseline'],
  claimed_quest_ids: [],
};

const CANONICAL_PILLARS: Pillar[] = [
  { id: 1, code: 'P1', name: 'Smart Farming & Digital Transformation', description: 'Digital records, telemetry & data-driven decision making' },
  { id: 2, code: 'P2', name: 'Productive Use of Renewable Energy', description: 'Solar irrigation, biogas, cold storage & clean energy' },
  { id: 3, code: 'P3', name: 'Food Safety, Quality & Compliance', description: 'Traceability, chemical handling, hygiene & certifications' },
  { id: 4, code: 'P4', name: 'Indigenous Knowledge & Climate Resilience', description: 'Drought-tolerant varieties, heritage soil practices & biodiversity' },
  { id: 5, code: 'P5', name: 'Farm Business Performance & Growth', description: 'Enterprise budgeting, unit economics, gross margins & cash flow' },
  { id: 6, code: 'P6', name: 'Human Capital, Leadership & Farm Operations', description: 'Fair labor, safety standards, skill building & operational workflows' },
  { id: 7, code: 'P7', name: 'Market Access, Customer Value & Competitiveness', description: 'Offtake agreements, value addition, direct aggregation & pricing power' },
  { id: 8, code: 'P8', name: 'Investment Readiness & Enterprise Development', description: 'Financial statements, bankability, collateral management & equity readiness' },
];

function getInitialToken(): string | null {
  const token = localStorage.getItem('fff_token');
  if (token && !isJwtExpired(token)) {
    return token;
  }
  if (token && isJwtExpired(token)) {
    localStorage.removeItem('fff_token');
  }
  return null;
}

interface AppState {
  token: string | null;
  user: User;
  gamification: GamificationState;
  dashboardSummary: DashboardSummary | null;
  activeScreen: ScreenId;
  pillars: Pillar[];
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  toasts: AppNotification[];
  inbox: InboxItem[];

  // Share achievement overlay (set when an assessment is completed or shared manually)
  shareResult: AssessmentResult | null;
  openShare: (result: AssessmentResult) => void;
  closeShare: () => void;

  // Active Assessment Flow
  assessment: {
    id: number | string | null;
    scope: 'full' | 'pillar';
    targetPillarId: number | null;
    questions: Question[];
    currentIndex: number;
    answers: Record<string, 'yes' | 'no'>;
    latestResult: AssessmentResult | null;
  };

  // Checkout State
  checkoutItem: {
    scope: 'full' | 'pillar';
    pillarId?: number | null;
    title: string;
    description: string;
    priceUsd: number;
    priceKes: number;
  };
  setCheckoutItem: (item: {
    scope: 'full' | 'pillar';
    pillarId?: number | null;
    title: string;
    description: string;
    priceUsd: number;
    priceKes: number;
  }) => void;

  // Pillar Detail Selection
  selectedPillarDetailId: number;
  setSelectedPillarDetailId: (id: number) => void;

  // Actions
  setScreen: (screen: ScreenId) => void;
  toggleSidebar: (open?: boolean) => void;
  toggleSidebarCollapsed: () => void;
  setToken: (token: string | null) => void;
  setUser: (user: Partial<User>) => void;
  setDashboardSummary: (summary: DashboardSummary | null) => void;
  setGamification: (state: Partial<GamificationState>) => void;
  setPillars: (pillars: Pillar[]) => void;
  logout: () => void;
  awardXp: (amount: number, label?: string) => void;
  unlockBadge: (badgeKey: string) => void;
  claimQuest: (questId: string, rewardXp: number) => void;
  addToast: (toast: Omit<AppNotification, 'id'> & { id?: string }) => void;
  removeToast: (id: string) => void;
  showNotification: (
    message: string,
    type?: 'success' | 'error' | 'info' | 'warning',
    durationMs?: number,
    title?: string
  ) => void;
  clearNotification: () => void;

  // Inbox (persistent notification bell items)
  addInboxItem: (item: Omit<InboxItem, 'id' | 'createdAt' | 'read'>) => void;
  markAllInboxRead: () => void;
  dismissInboxItem: (id: string) => void;
  clearInbox: () => void;

  // Assessment Actions
  startAssessment: (
    id: number | string,
    scope: 'full' | 'pillar',
    questions: Question[],
    targetPillarId?: number | null
  ) => void;
  setAnswer: (questionId: string, answer: 'yes' | 'no') => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  setAssessmentResult: (result: AssessmentResult) => void;
  // Hydrate the latest result into state WITHOUT navigating to the result screen
  // (used when loading existing history on app start / dashboard refresh).
  setLatestResult: (result: AssessmentResult) => void;
}


function getInitialScreen(): ScreenId {
  const token = getInitialToken();
  if (!token) return 'screen-auth';
  const savedScreen = localStorage.getItem('fff_active_screen') as ScreenId;
  const transientScreens: ScreenId[] = [
    'screen-result',
    'screen-question',
    'screen-checkout',
    'screen-auth',
  ];
  if (!savedScreen || transientScreens.includes(savedScreen)) {
    return 'screen-dashboard';
  }
  return savedScreen;
}

export const useAppStore = create<AppState>((set, get) => ({
  token: getInitialToken(),
  user: JSON.parse(localStorage.getItem('fff_user') || 'null') || DEFAULT_USER,
  gamification:
    JSON.parse(localStorage.getItem('fff_gamification') || 'null') ||
    DEFAULT_GAMIFICATION,
  activeScreen: getInitialScreen(),
  pillars: CANONICAL_PILLARS,
  sidebarOpen: false,
  sidebarCollapsed: localStorage.getItem('fff_sidebar_collapsed') === 'true',
  toasts: [],
  dashboardSummary: null,
  inbox: ((): InboxItem[] => {
    try {
      return JSON.parse(localStorage.getItem('fff_inbox') || '[]');
    } catch {
      return [];
    }
  })(),

  shareResult: null,

  setDashboardSummary: (summary) => {
    set({ dashboardSummary: summary });
  },

  setGamification: (updated) => {
    const nextGamification = { ...get().gamification, ...updated };
    localStorage.setItem('fff_gamification', JSON.stringify(nextGamification));
    set({ gamification: nextGamification });
  },

  setPillars: (live) => {
    const base = get().pillars;
    const merged = base.map((p) => {
      const l = live.find((x) => x.id === p.id);
      return l ? { ...p, name: l.name } : p;
    });
    set({ pillars: merged });
  },

  assessment: {
    id: null,
    scope: 'full',
    targetPillarId: null,
    questions: [],
    currentIndex: 0,
    answers: {},
    latestResult: null,
  },

  checkoutItem: {
    scope: 'full',
    pillarId: null,
    title: 'Full Future Farm Assessment',
    description: 'Comprehensive data analysis & yield prediction report across 8 Pillars & 40 Capabilities.',
    priceUsd: 10,
    priceKes: 1300,
  },

  selectedPillarDetailId: 2,
  setSelectedPillarDetailId: (id) => {
    set({ selectedPillarDetailId: id });
  },

  setCheckoutItem: (item) => {
    set({ checkoutItem: item });
  },

  setScreen: (screen) => {
    localStorage.setItem('fff_active_screen', screen);
    set({ activeScreen: screen, sidebarOpen: false });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  toggleSidebar: (open) => {
    set((state) => ({
      sidebarOpen: open !== undefined ? open : !state.sidebarOpen,
    }));
  },

  toggleSidebarCollapsed: () => {
    set((state) => {
      const next = !state.sidebarCollapsed;
      localStorage.setItem('fff_sidebar_collapsed', String(next));
      return { sidebarCollapsed: next };
    });
  },

  setToken: (token) => {
    if (token) {
      localStorage.setItem('fff_token', token);
    } else {
      localStorage.removeItem('fff_token');
    }
    set({ token });
  },

  setUser: (updated) => {
    const newUser = { ...get().user, ...updated };
    localStorage.setItem('fff_user', JSON.stringify(newUser));
    set({ user: newUser });
  },

  logout: () => {
    // Best-effort server-side revocation (blocklists the token's jti).
    const currentToken = get().token;
    if (currentToken) {
      fetch('/api/auth/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${currentToken}` },
      }).catch(() => {});
    }
    localStorage.removeItem('fff_token');
    localStorage.removeItem('fff_user');
    localStorage.removeItem('fff_active_screen');
    set({
      token: null,
      user: {
        name: '',
        phone: '',
        email: '',
        farm_name: '',
        farm_region: '',
        farm_crop_type: '',
        farm_size_acres: 0,
        tier: 1,
        tier_name: 'Informal Farm',
        ffmi_score: 0,
      },
      dashboardSummary: null,
      assessment: {
        id: null,
        scope: 'full',
        targetPillarId: null,
        questions: [],
        currentIndex: 0,
        answers: {},
        latestResult: null,
      },
      activeScreen: 'screen-auth',
      sidebarOpen: false,
    });
    get().showNotification('You have signed out.', 'info', 3000, 'Session Closed');
  },

  addToast: (toast) => {
    const id = toast.id || `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const duration = toast.durationMs ?? 4000;
    const newToast: AppNotification = {
      id,
      title: toast.title,
      message: toast.message,
      type: toast.type || 'info',
      durationMs: duration,
    };

    set((state) => ({
      toasts: [...state.toasts.filter((t) => t.id !== id), newToast].slice(-5), // Keep latest 5 max
    }));

    if (duration > 0) {
      setTimeout(() => {
        get().removeToast(id);
      }, duration);
    }
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },

  showNotification: (message, type = 'info', durationMs = 4000, title) => {
    get().addToast({ message, type, durationMs, title });
  },

  clearNotification: () => {
    set({ toasts: [] });
  },

  // ── Inbox actions ────────────────────────────────────────────────────────
  addInboxItem: (item) => {
    const newItem: InboxItem = {
      ...item,
      id: `inbox-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      createdAt: Date.now(),
      read: false,
    };
    set((state) => {
      // Keep at most 50 items, newest first
      const next = [newItem, ...state.inbox].slice(0, 50);
      localStorage.setItem('fff_inbox', JSON.stringify(next));
      return { inbox: next };
    });
  },

  markAllInboxRead: () => {
    set((state) => {
      const next = state.inbox.map((n) => ({ ...n, read: true }));
      localStorage.setItem('fff_inbox', JSON.stringify(next));
      return { inbox: next };
    });
  },

  dismissInboxItem: (id) => {
    set((state) => {
      const next = state.inbox.filter((n) => n.id !== id);
      localStorage.setItem('fff_inbox', JSON.stringify(next));
      return { inbox: next };
    });
  },

  clearInbox: () => {
    localStorage.removeItem('fff_inbox');
    set({ inbox: [] });
  },

  awardXp: (amount, label) => {
    const g = get().gamification;
    const newTotal = g.total_xp + amount;

    // Thresholds
    const levels = [
      [1, 0, 200, 'Seedling Pioneer'],
      [2, 200, 500, 'Green Sprout'],
      [3, 500, 1000, 'Resilient Steward'],
      [4, 1000, 2000, 'Agro Vanguard'],
      [5, 2000, 5000, 'Commercial Champion'],
      [6, 5000, 10000, 'Lighthouse Luminary'],
    ] as const;

    let currentLvl = 1;
    let lvlName = 'Seedling Pioneer';
    let minX = 0;
    let maxX = 200;

    for (const [lvl, min, max, name] of levels) {
      if (newTotal >= min) {
        currentLvl = lvl;
        lvlName = name;
        minX = min;
        maxX = max;
      }
    }

    const updatedGamification: GamificationState = {
      ...g,
      total_xp: newTotal,
      level: currentLvl,
      level_name: lvlName,
      current_level_min_xp: minX,
      next_level_xp: maxX,
    };

    localStorage.setItem(
      'fff_gamification',
      JSON.stringify(updatedGamification)
    );
    set({ gamification: updatedGamification });

    // Trigger celebration if leveled up
    if (currentLvl > g.level) {
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
        get().showNotification(
          `🎉 Level Up! You reached Level ${currentLvl}: ${lvlName}!`,
          'success'
        );
        get().addInboxItem({
          category: 'xp',
          title: `Level Up! 🎉`,
          body: `You reached Level ${currentLvl}: ${lvlName}!`,
        });
      } catch {}
    } else if (label) {
      get().addInboxItem({
        category: 'xp',
        title: `+${amount} XP Earned`,
        body: label,
      });
    }
  },

  unlockBadge: (badgeKey) => {
    const g = get().gamification;
    if (!g.unlocked_badge_keys.includes(badgeKey)) {
      const updated: GamificationState = {
        ...g,
        unlocked_badge_keys: [...g.unlocked_badge_keys, badgeKey],
      };
      localStorage.setItem('fff_gamification', JSON.stringify(updated));
      set({ gamification: updated });
      try {
        confetti({ particleCount: 60, spread: 60 });
        get().showNotification(`🏆 New Trophy Unlocked!`, 'success');
        get().addInboxItem({
          category: 'xp',
          title: '🏆 Badge Unlocked!',
          body: `You earned a new badge: ${badgeKey.replace(/_/g, ' ')}.`,
        });
      } catch {}
    }
  },

  claimQuest: (questId, rewardXp) => {
    const g = get().gamification;
    if (g.claimed_quest_ids.includes(questId)) return;

    // Optimistic local update
    const optimistic: GamificationState = {
      ...g,
      claimed_quest_ids: [...g.claimed_quest_ids, questId],
    };
    localStorage.setItem('fff_gamification', JSON.stringify(optimistic));
    set({ gamification: optimistic });
    get().showNotification(`✅ Quest Completed! +${rewardXp} XP Earned!`, 'success');
    get().addInboxItem({
      category: 'success',
      title: 'Quest Completed! ✅',
      body: `+${rewardXp} XP earned from quest: ${questId.replace(/_/g, ' ')}.`,
    });

    // Persist server-side
    portalApi
      .claimQuest(questId)
      .then((res) => {
        const updatedGamification: GamificationState = {
          ...get().gamification,
          total_xp: res.new_total_xp,
          level: res.new_level,
          level_name: res.new_level_name,
        };
        localStorage.setItem('fff_gamification', JSON.stringify(updatedGamification));
        set({ gamification: updatedGamification });
        if (res.level_up) {
          try {
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
            get().showNotification(
              `🎉 Level Up! You reached Level ${res.new_level}: ${res.new_level_name}!`,
              'success'
            );
            get().addInboxItem({
              category: 'xp',
              title: 'Level Up! 🎉',
              body: `You reached Level ${res.new_level}: ${res.new_level_name}!`,
            });
          } catch {}
        }
      })
      .catch((err) => {
        console.warn('Quest claim sync notice:', err);
      });
  },

  startAssessment: (id, scope, questions, targetPillarId = null) => {
    set({
      assessment: {
        id,
        scope,
        targetPillarId,
        questions,
        currentIndex: 0,
        answers: {},
        latestResult: null,
      },
      activeScreen: 'screen-question',
    });
    localStorage.setItem('fff_active_screen', 'screen-question');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  setAnswer: (questionId, answer) => {
    set((state) => ({
      assessment: {
        ...state.assessment,
        answers: {
          ...state.assessment.answers,
          [questionId]: answer,
        },
      },
    }));
  },

  nextQuestion: () => {
    set((state) => ({
      assessment: {
        ...state.assessment,
        currentIndex: Math.min(
          state.assessment.questions.length - 1,
          state.assessment.currentIndex + 1
        ),
      },
    }));
  },

  prevQuestion: () => {
    set((state) => ({
      assessment: {
        ...state.assessment,
        currentIndex: Math.max(0, state.assessment.currentIndex - 1),
      },
    }));
  },

  setAssessmentResult: (result) => {
    const prevPillars = get().assessment.latestResult?.pillar_scores ?? {};
    const updatedPillarScores = {
      ...prevPillars,
      ...result.pillar_scores,
    };

    const isSinglePillar = Object.keys(result.pillar_scores ?? {}).length === 1;

    let newFfmiScore = result.ffmi_score;
    let newTier = result.tier;
    let newTierName = result.tier_classification;

    if (isSinglePillar) {
      // For single-pillar assessments, cumulative farm FFMI is the sum of all reviewed pillars' scores * 3.0
      const totalFfmi = Object.values(updatedPillarScores).reduce((acc, score) => {
        const normalized = score <= 1.0 ? score : score / 3.0;
        return acc + normalized * 3.0;
      }, 0);
      newFfmiScore = Math.round(totalFfmi * 100) / 100;

      if (newFfmiScore >= 21) {
        newTier = 5;
        newTierName = 'Future Ready Farm';
      } else if (newFfmiScore >= 16) {
        newTier = 4;
        newTierName = 'Investment Ready Farm';
      } else if (newFfmiScore >= 10) {
        newTier = 3;
        newTierName = 'Structured Farm';
      } else if (newFfmiScore >= 5) {
        newTier = 2;
        newTierName = 'Emerging Agribusiness';
      } else {
        newTier = 1;
        newTierName = 'Informal Farm';
      }
    }

    const nextUser = {
      ...get().user,
      ffmi_score: newFfmiScore,
      tier: newTier,
      tier_name: newTierName,
    };
    try {
      localStorage.setItem('fff_user', JSON.stringify(nextUser));
    } catch {}

    set((state) => ({
      assessment: {
        ...state.assessment,
        id: null,
        scope: 'full',
        targetPillarId: null,
        questions: [],
        answers: {},
        currentIndex: 0,
        latestResult: {
          ...result,
          pillar_scores: updatedPillarScores,
        },
      },
      user: nextUser,
      activeScreen: 'screen-result',
    }));
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Add inbox item for assessment completion
    get().addInboxItem({
      category: 'success',
      title: 'Assessment Complete ✅',
      body: isSinglePillar
        ? `Pillar audit complete. Farm FFMI is now ${newFfmiScore.toFixed(1)} / 24.0 (${newTierName}).`
        : `Assessment complete. Your FFMI score is ${newFfmiScore.toFixed(1)} / 24.0 (${newTierName}).`,
    });
  },

  openShare: (result) => {
    set({ shareResult: result });
  },

  closeShare: () => {
    set({ shareResult: null });
  },

  setLatestResult: (result) => {
    const prevPillars = get().assessment.latestResult?.pillar_scores ?? {};
    const updatedPillarScores = {
      ...prevPillars,
      ...result.pillar_scores,
    };

    const isSinglePillar = Object.keys(result.pillar_scores ?? {}).length === 1;

    let newFfmiScore = result.ffmi_score;
    let newTier = result.tier;
    let newTierName = result.tier_classification;

    if (isSinglePillar) {
      const totalFfmi = Object.values(updatedPillarScores).reduce((acc, score) => {
        const normalized = score <= 1.0 ? score : score / 3.0;
        return acc + normalized * 3.0;
      }, 0);
      newFfmiScore = Math.round(totalFfmi * 100) / 100;

      if (newFfmiScore >= 21) {
        newTier = 5;
        newTierName = 'Future Ready Farm';
      } else if (newFfmiScore >= 16) {
        newTier = 4;
        newTierName = 'Investment Ready Farm';
      } else if (newFfmiScore >= 10) {
        newTier = 3;
        newTierName = 'Structured Farm';
      } else if (newFfmiScore >= 5) {
        newTier = 2;
        newTierName = 'Emerging Agribusiness';
      } else {
        newTier = 1;
        newTierName = 'Informal Farm';
      }
    }

    const nextUser = {
      ...get().user,
      ffmi_score: newFfmiScore,
      tier: newTier,
      tier_name: newTierName,
    };
    try {
      localStorage.setItem('fff_user', JSON.stringify(nextUser));
    } catch {}

    set((state) => ({
      assessment: {
        ...state.assessment,
        latestResult: {
          ...result,
          pillar_scores: updatedPillarScores,
        },
      },
      user: nextUser,
    }));
  },
}));
