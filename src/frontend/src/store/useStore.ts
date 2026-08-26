import { create } from 'zustand';
import {
  ScreenId,
  User,
  Pillar,
  Question,
  AssessmentResult,
  GamificationState,
  AppNotification,
} from '../types';
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
  name: 'Joseph Ochieng',
  phone: '+254712345678',
  email: 'joseph@example.com',
  farm_name: 'Kakamega Demonstration Farm',
  farm_region: 'Western Kenya',
  farm_crop_type: 'Maize, Dairy & Vegetables',
  farm_size_acres: 5.0,
  tier: 3,
  tier_name: 'Commercializing Farm',
  ffmi_score: 13.8,
};

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
  { id: 3, code: 'P3', name: 'Food Safety & Compliance', description: 'Traceability, chemical handling, hygiene & certifications' },
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
  activeScreen: ScreenId;
  pillars: Pillar[];
  sidebarOpen: boolean;
  toasts: AppNotification[];

  // Active Assessment Flow
  assessment: {
    id: number | string | null;
    scope: 'full' | 'pillar';
    targetPillarId: number | null;
    questions: Question[];
    currentIndex: number;
    answers: Record<number, 'yes' | 'no'>;
    latestResult: AssessmentResult | null;
  };

  // Actions
  setScreen: (screen: ScreenId) => void;
  toggleSidebar: (open?: boolean) => void;
  setToken: (token: string | null) => void;
  setUser: (user: Partial<User>) => void;
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

  // Assessment Actions
  startAssessment: (
    id: number | string,
    scope: 'full' | 'pillar',
    questions: Question[],
    targetPillarId?: number | null
  ) => void;
  setAnswer: (questionId: number, answer: 'yes' | 'no') => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  setAssessmentResult: (result: AssessmentResult) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  token: getInitialToken(),
  user: JSON.parse(localStorage.getItem('fff_user') || 'null') || DEFAULT_USER,
  gamification:
    JSON.parse(localStorage.getItem('fff_gamification') || 'null') ||
    DEFAULT_GAMIFICATION,
  activeScreen: getInitialToken()
    ? (localStorage.getItem('fff_active_screen') as ScreenId) || 'screen-dashboard'
    : 'screen-auth',
  pillars: CANONICAL_PILLARS,
  sidebarOpen: false,
  toasts: [],

  assessment: {
    id: null,
    scope: 'full',
    targetPillarId: null,
    questions: [],
    currentIndex: 0,
    answers: {},
    latestResult: null,
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
    localStorage.removeItem('fff_token');
    localStorage.removeItem('fff_user');
    localStorage.removeItem('fff_active_screen');
    set({
      token: null,
      user: DEFAULT_USER,
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
      } catch {}
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
      } catch {}
    }
  },

  claimQuest: (questId, rewardXp) => {
    const g = get().gamification;
    if (!g.claimed_quest_ids.includes(questId)) {
      const updated: GamificationState = {
        ...g,
        claimed_quest_ids: [...g.claimed_quest_ids, questId],
      };
      localStorage.setItem('fff_gamification', JSON.stringify(updated));
      set({ gamification: updated });
      get().awardXp(rewardXp, `Quest: ${questId}`);
      get().showNotification(`✅ Quest Completed! +${rewardXp} XP Earned!`, 'success');
    }
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
    set((state) => ({
      assessment: {
        ...state.assessment,
        latestResult: result,
      },
      user: {
        ...state.user,
        ffmi_score: result.ffmi_score,
        tier: result.tier,
        tier_name: result.tier_name,
      },
      activeScreen: 'screen-result',
    }));
    localStorage.setItem('fff_active_screen', 'screen-result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },
}));
