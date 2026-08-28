import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useAppStore } from '../../store/useStore';
import {
  Menu,
  Award,
  Flame,
  WifiOff,
  PanelLeft,
  Search,
  X,
  Home,
  PlayCircle,
  BarChart3,
  History,
  Sparkles,
  GraduationCap,
  Wrench,
  Trophy,
  User,
  Settings,
  CreditCard,
  Compass,
  ArrowRight,
  Zap,
  Bell,
  CheckCircle2,
  AlertCircle,
  Clock,
  CheckCheck,
  ChevronRight,
  LogOut,
  LogIn,
  Sliders,
  Shield,
} from 'lucide-react';
import { ScreenId } from '../../types';

// ─── Screen Title Map ────────────────────────────────────────────────────────
const SCREEN_TITLES: Record<ScreenId, string> = {
  'screen-dashboard': 'Dashboard Overview',
  'screen-journey': 'Transformation Journey & Badges',
  'screen-assessment-choice': 'Start Assessment',
  'screen-question': 'Live Capability Assessment',
  'screen-result': 'Assessment Scorecard & Roadmap',
  'screen-pillar-detail': 'Pillar Detail & Action Plan',
  'screen-history': 'Assessment History & Benchmarks',
  'screen-reports': 'Reports & Insights',
  'screen-services': 'Services Portal',
  'screen-learning': 'Learning Academy',
  'screen-profile': 'Farm Enterprise Profile',
  'screen-settings': 'Platform & Security Settings',
  'screen-pricing': 'Pricing & Plans',
  'screen-checkout': 'Secure Assessment Checkout',
  'screen-onboarding': 'Onboarding Flow',
  'screen-simulator': 'Scenario Simulator',
  'screen-auth': 'Platform Authentication',
};

// ─── Nav group → section breadcrumb mapping ──────────────────────────────────
const SCREEN_SECTION: Partial<Record<ScreenId, string>> = {
  'screen-dashboard': 'Home',
  'screen-onboarding': 'Home',
  'screen-assessment-choice': 'Diagnostics',
  'screen-question': 'Diagnostics',
  'screen-result': 'Diagnostics',
  'screen-pillar-detail': 'Diagnostics',
  'screen-reports': 'Diagnostics',
  'screen-history': 'Diagnostics',
  'screen-simulator': 'Diagnostics',
  'screen-learning': 'Growth & Resources',
  'screen-services': 'Growth & Resources',
  'screen-journey': 'My Farm',
  'screen-profile': 'My Farm',
  'screen-settings': 'My Farm',
  'screen-pricing': 'My Farm',
  'screen-checkout': 'My Farm',
};

// ─── Searchable Items ─────────────────────────────────────────────────────────
interface SearchResult {
  id: ScreenId;
  label: string;
  description: string;
  section: string;
  icon: React.ReactNode;
  keywords: string[];
}

const SEARCH_INDEX: SearchResult[] = [
  {
    id: 'screen-dashboard',
    label: 'Dashboard',
    description: 'Farm overview, KPIs, and quick actions',
    section: 'Home',
    icon: <Home className="w-4 h-4" />,
    keywords: ['home', 'overview', 'main', 'kpi'],
  },
  {
    id: 'screen-onboarding',
    label: 'Onboarding Flow',
    description: 'Guided enterprise onboarding, GPS mapping & baseline setup',
    section: 'Home',
    icon: <Compass className="w-4 h-4 text-[#009924]" />,
    keywords: ['onboarding', 'flow', 'setup', 'guide', 'wizard', 'location', 'map', 'gps'],
  },
  {
    id: 'screen-assessment-choice',
    label: 'Start Assessment',
    description: 'Launch an 8-pillar or single-pillar diagnostic',
    section: 'Diagnostics',
    icon: <PlayCircle className="w-4 h-4 text-[#009924]" />,
    keywords: ['assessment', 'start', 'audit', 'pillar', 'diagnostic', 'questionnaire'],
  },
  {
    id: 'screen-reports',
    label: 'Reports & Insights',
    description: 'AI-generated farm performance analytics',
    section: 'Diagnostics',
    icon: <BarChart3 className="w-4 h-4 text-[#1E88E5]" />,
    keywords: ['reports', 'analytics', 'insights', 'charts', 'performance'],
  },
  {
    id: 'screen-history',
    label: 'History & Compare',
    description: 'Past assessments and score trend comparison',
    section: 'Diagnostics',
    icon: <History className="w-4 h-4 text-[#8E24AA]" />,
    keywords: ['history', 'compare', 'past', 'trend', 'previous'],
  },
  {
    id: 'screen-simulator',
    label: 'Scenario Simulator',
    description: 'Model outcomes from operational changes',
    section: 'Diagnostics',
    icon: <Sparkles className="w-4 h-4 text-[#FDD835]" />,
    keywords: ['simulator', 'scenario', 'what-if', 'model', 'forecast'],
  },
  {
    id: 'screen-learning',
    label: 'Learning Academy',
    description: 'Courses, training modules, and certifications',
    section: 'Growth & Resources',
    icon: <GraduationCap className="w-4 h-4 text-[#43A047]" />,
    keywords: ['learning', 'courses', 'training', 'certifications', 'academy', 'education'],
  },
  {
    id: 'screen-services',
    label: 'Services Portal',
    description: 'Vetted agro-service providers by pillar',
    section: 'Growth & Resources',
    icon: <Wrench className="w-4 h-4 text-[#FB8C00]" />,
    keywords: ['services', 'providers', 'vendors', 'agro', 'marketplace'],
  },
  {
    id: 'screen-journey',
    label: 'Transformation Journey',
    description: 'Badges, quests, XP, and maturity roadmap',
    section: 'My Farm',
    icon: <Trophy className="w-4 h-4 text-[#FFD700]" />,
    keywords: ['journey', 'badges', 'xp', 'streak', 'gamification', 'quests'],
  },
  {
    id: 'screen-profile',
    label: 'Farm Profile',
    description: 'Farm details, contact info, and verification',
    section: 'My Farm',
    icon: <User className="w-4 h-4" />,
    keywords: ['profile', 'farm', 'account', 'edit', 'details', 'info'],
  },
  {
    id: 'screen-pricing',
    label: 'Pricing & Plans',
    description: 'Subscription tiers and assessment packages',
    section: 'My Farm',
    icon: <CreditCard className="w-4 h-4 text-[#009924]" />,
    keywords: ['pricing', 'plans', 'billing', 'subscription', 'upgrade', 'packages'],
  },
  {
    id: 'screen-settings',
    label: 'Platform Settings',
    description: 'App preferences, security, and notifications',
    section: 'My Farm',
    icon: <Settings className="w-4 h-4" />,
    keywords: ['settings', 'preferences', 'security', 'notifications', 'config'],
  },
];

// ─── Initial Notifications ────────────────────────────────────────────────────
interface AppNotice {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'assessment' | 'opportunity' | 'quest' | 'system';
  targetScreen: ScreenId;
  read: boolean;
}

const INITIAL_NOTICES: AppNotice[] = [
  {
    id: 'notice-1',
    title: 'Diagnostic Baseline Active',
    message: 'Your 8-Pillar baseline diagnostic is ready to resume.',
    timestamp: '10m ago',
    type: 'assessment',
    targetScreen: 'screen-assessment-choice',
    read: false,
  },
  {
    id: 'notice-2',
    title: 'Solar Irrigation Grant Matched',
    message: 'Eligible for KES 45,000 PURE renewable energy subsidy.',
    timestamp: '2h ago',
    type: 'opportunity',
    targetScreen: 'screen-services',
    read: false,
  },
  {
    id: 'notice-3',
    title: 'Transformation Streak +50 XP',
    message: 'Day streak active! Complete a daily check-in to level up.',
    timestamp: '1d ago',
    type: 'quest',
    targetScreen: 'screen-journey',
    read: false,
  },
];

// ─── Search Palette Component ─────────────────────────────────────────────────
const CommandPalette: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  setScreen: (id: ScreenId) => void;
}> = ({ isOpen, onClose, setScreen }) => {
  const [query, setQuery] = useState('');
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const results = query.trim()
    ? SEARCH_INDEX.filter((item) => {
        const q = query.toLowerCase();
        return (
          item.label.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.keywords.some((k) => k.includes(q))
        );
      })
    : SEARCH_INDEX.slice(0, 6);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setActiveIdx(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    setActiveIdx(0);
  }, [query]);

  const handleSelect = (id: ScreenId) => {
    setScreen(id);
    onClose();
    setQuery('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[activeIdx]) handleSelect(results[activeIdx].id);
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-idx="${activeIdx}"]`);
    el?.scrollIntoView({ block: 'nearest' });
  }, [activeIdx]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-start justify-center pt-16 sm:pt-24 px-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div
        className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100">
          <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search pages, features, settings…"
            className="flex-1 text-sm text-slate-900 placeholder-slate-400 outline-none bg-transparent"
            autoComplete="off"
            spellCheck={false}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold text-slate-400 bg-slate-100 border border-slate-200">
            esc
          </kbd>
        </div>

        <div ref={listRef} className="max-h-80 overflow-y-auto py-2">
          {results.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-slate-400">
              No results for &ldquo;{query}&rdquo;
            </div>
          ) : (
            <>
              {!query && (
                <div className="px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Suggested Pages
                </div>
              )}
              {results.map((item, idx) => {
                const isActive = idx === activeIdx;
                return (
                  <button
                    key={item.id}
                    data-idx={idx}
                    onClick={() => handleSelect(item.id)}
                    onMouseEnter={() => setActiveIdx(idx)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                      isActive
                        ? 'bg-[#004447]/8 text-[#004447]'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        isActive
                          ? 'bg-[#004447]/10 text-[#004447]'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {item.icon}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold leading-tight truncate">{item.label}</div>
                      <div className="text-[11px] text-slate-400 truncate">{item.description}</div>
                    </div>

                    <span className="text-[9px] font-extrabold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-md whitespace-nowrap flex-shrink-0">
                      {item.section}
                    </span>

                    {isActive && (
                      <ArrowRight className="w-3.5 h-3.5 text-[#004447] flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </>
          )}
        </div>

        <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 rounded bg-white border border-slate-200 font-bold text-[9px]">↑↓</kbd>
              navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 rounded bg-white border border-slate-200 font-bold text-[9px]">↵</kbd>
              open
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 rounded bg-white border border-slate-200 font-bold text-[9px]">esc</kbd>
              close
            </span>
          </div>
          <div className="flex items-center gap-1 font-semibold">
            <Zap className="w-3 h-3 text-[#FFD700]" />
            <span>FFF Quick Search</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── AppTopbar ────────────────────────────────────────────────────────────────
export const AppTopbar: React.FC = () => {
  const {
    activeScreen,
    setScreen,
    gamification,
    toggleSidebar,
    toggleSidebarCollapsed,
    sidebarCollapsed,
    token,
    user,
    logout,
  } = useAppStore();

  const [isOnline, setIsOnline] = React.useState(navigator.onLine);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [notices, setNotices] = useState<AppNotice[]>(INITIAL_NOTICES);

  const notifRef = useRef<HTMLDivElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Global Ctrl+K / Cmd+K shortcut & outside click handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      } else if (e.key === 'Escape') {
        setNotifOpen(false);
        setSettingsOpen(false);
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
      if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) {
        setSettingsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const unreadCount = notices.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotices((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleNoticeClick = (notice: AppNotice) => {
    setNotices((prev) =>
      prev.map((n) => (n.id === notice.id ? { ...n, read: true } : n))
    );
    setScreen(notice.targetScreen);
    setNotifOpen(false);
  };

  const span = Math.max(1, gamification.next_level_xp - gamification.current_level_min_xp);
  const pct = Math.max(
    5,
    Math.min(
      100,
      ((gamification.total_xp - gamification.current_level_min_xp) / span) * 100
    )
  );

  const section = SCREEN_SECTION[activeScreen];
  const pageTitle = SCREEN_TITLES[activeScreen] || 'Dashboard';

  return (
    <>
      {/* Command Palette */}
      <CommandPalette
        isOpen={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        setScreen={setScreen}
      />

      <header className="sticky top-0 z-30 h-16 bg-[#045D61]/95 backdrop-blur-md border-b border-[#009924]/25 px-4 lg:px-6 flex items-center justify-between shadow-lg gap-3">
        {/* ─── Left: Toggle + Breadcrumb ─────────────────────────────── */}
        <div className="flex items-center gap-2 min-w-0">
          {/* Mobile hamburger */}
          <button
            onClick={() => toggleSidebar(true)}
            className="lg:hidden p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors flex-shrink-0 cursor-pointer"
            aria-label="Open Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Desktop sidebar toggle */}
          <button
            onClick={toggleSidebarCollapsed}
            className="hidden lg:flex p-2 rounded-lg bg-white/10 text-white/80 hover:text-white hover:bg-white/20 transition-colors flex-shrink-0 cursor-pointer"
            title={sidebarCollapsed ? 'Expand Sidebar (Ctrl+B)' : 'Collapse Sidebar (Ctrl+B)'}
            aria-label="Toggle Sidebar"
          >
            <PanelLeft className="w-4 h-4" />
          </button>

          {/* Breadcrumb: Section / Page */}
          <div className="flex items-center gap-1.5 text-sm font-medium min-w-0">
            {section && (
              <>
                <span className="text-white/55 hidden sm:inline truncate">{section}</span>
                <span className="text-white/35 hidden sm:inline">/</span>
              </>
            )}
            <span className="text-white font-serif font-bold text-sm tracking-tight truncate max-w-[160px] sm:max-w-[220px] lg:max-w-none">
              {pageTitle}
            </span>
          </div>
        </div>

        {/* ─── Center: Search Bar ─────────────────────────────────────── */}
        <div className="hidden md:flex flex-1 max-w-sm mx-2">
          <button
            onClick={() => setPaletteOpen(true)}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 hover:border-white/30 transition-all text-white/60 hover:text-white/80 group cursor-pointer"
            title="Search (Ctrl+K)"
          >
            <Search className="w-3.5 h-3.5 flex-shrink-0 group-hover:text-white/90 transition-colors" />
            <span className="flex-1 text-left text-xs">Search pages, features…</span>
            <div className="flex items-center gap-0.5 flex-shrink-0">
              <kbd className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-white/10 border border-white/20 text-white/50">
                ⌘K
              </kbd>
            </div>
          </button>
        </div>

        {/* Mobile search icon */}
        <button
          onClick={() => setPaletteOpen(true)}
          className="md:hidden p-2 rounded-lg bg-white/10 text-white/80 hover:bg-white/20 hover:text-white transition-colors flex-shrink-0 cursor-pointer"
          title="Search (Ctrl+K)"
          aria-label="Open search"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* ─── Right: Gamification HUD + Notifications + Settings ────── */}
        <div className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0">
          {!isOnline && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#EF6C00]/20 border border-[#EF6C00]/40 text-[#FFD700] text-xs font-bold animate-pulse">
              <WifiOff className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Offline</span>
            </div>
          )}

          {/* XP / Level / Streak Pill */}
          <div
            onClick={() => setScreen('screen-journey')}
            className="flex items-center gap-2 sm:gap-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-full bg-white/10 border border-white/20 hover:border-[#FFD700]/50 cursor-pointer transition-all shadow-md group"
            title="View Transformation Journey & Badges"
          >
            {/* Level Badge */}
            <div className="flex items-center gap-1 text-xs font-bold text-[#FFD700]">
              <Award className="w-4 h-4 text-[#FFD700] group-hover:rotate-12 transition-transform" />
              <span className="hidden md:inline">Lvl {gamification.level}</span>
            </div>

            {/* XP Track Bar */}
            <div className="hidden sm:flex flex-col gap-0.5 w-16 md:w-24">
              <div className="w-full h-1.5 rounded-full bg-black/40 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#009924] to-[#FFD700] transition-all duration-500 rounded-full"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <div className="text-[9px] text-white/80 font-semibold text-right">
                {(gamification?.total_xp ?? 0).toLocaleString()} /{' '}
                {(gamification?.next_level_xp ?? 1000).toLocaleString()} XP
              </div>
            </div>

            {/* Streak Flame */}
            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-[#EF6C00]/25 text-[#FFD700] text-xs font-extrabold border border-[#FFD700]/30">
              <Flame className="w-3.5 h-3.5 text-[#FFD700] animate-bounce" />
              <span>{gamification.streak_days}d</span>
            </div>
          </div>

          {/* ─── Notification Bell Popover ───────────────────────────── */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => {
                setNotifOpen((v) => !v);
                setSettingsOpen(false);
              }}
              className={`p-2 rounded-xl border transition-all relative flex items-center justify-center cursor-pointer ${
                notifOpen
                  ? 'bg-white text-[#004447] border-white shadow-md'
                  : 'bg-white/10 hover:bg-white/20 text-white/90 border-white/15'
              }`}
              title="Notifications & Action Alerts"
              aria-label="Open notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#EF6C00] text-white text-[9px] font-extrabold flex items-center justify-center shadow-md animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown Menu */}
            {notifOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden text-slate-800 animate-in fade-in slide-in-from-top-2 duration-150">
                {/* Header */}
                <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-serif font-bold text-sm text-[#004447]">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="px-1.5 py-0.2 rounded-full bg-emerald-100 text-[#007519] text-[10px] font-bold">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      className="text-[11px] font-semibold text-[#009924] hover:text-[#007a1c] flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      <span>Mark all read</span>
                    </button>
                  )}
                </div>

                {/* Notification Items List */}
                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                  {notices.map((notice) => (
                    <div
                      key={notice.id}
                      onClick={() => handleNoticeClick(notice)}
                      className={`p-3.5 transition-colors cursor-pointer flex items-start gap-3 hover:bg-slate-50 ${
                        !notice.read ? 'bg-emerald-50/40' : ''
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                          notice.type === 'assessment'
                            ? 'bg-[#004447]/10 text-[#004447]'
                            : notice.type === 'opportunity'
                            ? 'bg-[#EF6C00]/10 text-[#EF6C00]'
                            : 'bg-[#FFD700]/20 text-[#b28900]'
                        }`}
                      >
                        {notice.type === 'assessment' ? (
                          <PlayCircle className="w-4 h-4" />
                        ) : notice.type === 'opportunity' ? (
                          <Zap className="w-4 h-4" />
                        ) : (
                          <Trophy className="w-4 h-4" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <h4 className="text-xs font-bold text-slate-900 truncate">
                            {notice.title}
                          </h4>
                          <span className="text-[10px] text-slate-400 shrink-0">
                            {notice.timestamp}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-2">
                          {notice.message}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer Link */}
                <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-center">
                  <button
                    onClick={() => {
                      setScreen('screen-settings');
                      setNotifOpen(false);
                    }}
                    className="text-xs font-bold text-[#004447] hover:text-[#023c3f] transition-colors cursor-pointer"
                  >
                    Notification Preferences &amp; History ➔
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ─── Settings Quick Menu Popover ─────────────────────────── */}
          <div className="relative" ref={settingsRef}>
            <button
              onClick={() => {
                setSettingsOpen((v) => !v);
                setNotifOpen(false);
              }}
              className={`p-2 rounded-xl border transition-all relative flex items-center justify-center cursor-pointer ${
                settingsOpen
                  ? 'bg-white text-[#004447] border-white shadow-md'
                  : 'bg-white/10 hover:bg-white/20 text-white/90 border-white/15'
              }`}
              title="Platform Settings & Account"
              aria-label="Open settings menu"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Settings Dropdown Menu */}
            {settingsOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden text-slate-800 animate-in fade-in slide-in-from-top-2 duration-150">
                {/* User Header */}
                <div className="p-3.5 bg-gradient-to-r from-[#023c3f] to-[#045D61] text-white">
                  <div className="text-xs font-bold truncate">{user.name || 'Agro-Enterprise'}</div>
                  <div className="flex items-center gap-1.5 text-[10px] text-white/80 mt-0.5">
                    <span className="truncate">{user.farm_name || 'My Farm'}</span>
                    <span>•</span>
                    <span className="px-1.5 py-0.2 rounded-full bg-[#1E88E5]/30 text-[8px] font-extrabold border border-[#1E88E5]/40 text-white">
                      Tier {user.tier || 3}
                    </span>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="p-1.5 space-y-0.5 text-xs font-medium">
                  <button
                    onClick={() => {
                      setScreen('screen-settings');
                      setSettingsOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100 hover:text-[#004447] transition-colors text-left cursor-pointer"
                  >
                    <Sliders className="w-4 h-4 text-slate-400" />
                    <span className="flex-1">Platform Settings</span>
                  </button>

                  <button
                    onClick={() => {
                      setScreen('screen-profile');
                      setSettingsOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100 hover:text-[#004447] transition-colors text-left cursor-pointer"
                  >
                    <User className="w-4 h-4 text-slate-400" />
                    <span className="flex-1">Farm Profile</span>
                  </button>

                  <button
                    onClick={() => {
                      setScreen('screen-pricing');
                      setSettingsOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100 hover:text-[#004447] transition-colors text-left cursor-pointer"
                  >
                    <CreditCard className="w-4 h-4 text-slate-400" />
                    <span className="flex-1">Pricing &amp; Subscriptions</span>
                  </button>

                  <button
                    onClick={() => {
                      setScreen('screen-onboarding');
                      setSettingsOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100 hover:text-[#004447] transition-colors text-left cursor-pointer"
                  >
                    <Compass className="w-4 h-4 text-slate-400" />
                    <span className="flex-1">Onboarding Setup Wizard</span>
                  </button>
                </div>

                {/* Footer Auth Button */}
                <div className="p-1.5 bg-slate-50 border-t border-slate-100">
                  {token ? (
                    <button
                      onClick={() => {
                        logout();
                        setSettingsOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 text-xs font-bold transition-colors cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setScreen('screen-auth');
                        setSettingsOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-[#004447] hover:bg-[#004447]/10 text-xs font-bold transition-colors cursor-pointer"
                    >
                      <LogIn className="w-3.5 h-3.5" />
                      <span>Sign In</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
};
