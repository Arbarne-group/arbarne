import React, { useEffect, useRef, useState } from 'react';
import { useAppStore } from '../../store/useStore';
import {
  Menu,
  WifiOff,
  PanelLeft,
  Bell,
  Settings,
  User,
  LogOut,
  LogIn,
  ChevronRight,
  CreditCard,
  HelpCircle,
  X,
  CheckCircle2,
  AlertTriangle,
  Info,
  Zap,
} from 'lucide-react';
import { InboxItem, ScreenId } from '../../types';

// ─── Screen Title Map ──────────────────────────────────────────────────────────
const SCREEN_TITLES: Record<ScreenId, string> = {
  'screen-dashboard': 'Home',
  'screen-journey': 'My Progress',
  'screen-assessment-choice': 'Check My Farm',
  'screen-question': 'Farm Check',
  'screen-result': 'My Results',
  'screen-pillar-detail': 'Pillar Detail',
  'screen-history': 'My History',
  'screen-reports': 'Reports',
  'screen-simulator': 'Scenario Simulator',
  'screen-services': 'Get Help',
  'screen-learning': 'Learn',
  'screen-profile': 'My Farm',
  'screen-settings': 'Account',
  'screen-pricing': 'Plans',
  'screen-checkout': 'Checkout',
  'screen-onboarding': 'First-Time Setup',
  'screen-auth': 'Sign In',
  'screen-notifications': 'Notifications',
};

// ─── Relative time helper ──────────────────────────────────────────────────────
function relativeTime(epoch: number): string {
  const diff = Math.floor((Date.now() - epoch) / 60_000);
  if (diff < 1) return 'Just now';
  if (diff < 60) return `${diff}m ago`;
  const h = Math.floor(diff / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return d === 1 ? 'Yesterday' : `${d}d ago`;
}

// ─── Per-category icon ─────────────────────────────────────────────────────────
const CategoryIcon: React.FC<{ cat: InboxItem['category'] }> = ({ cat }) => {
  const base = 'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0';
  switch (cat) {
    case 'success':
      return <div className={`${base} bg-emerald-500/20`}><CheckCircle2 className="text-emerald-400" style={{ width: 15, height: 15 }} /></div>;
    case 'warning':
    case 'alert':
      return <div className={`${base} bg-amber-500/20`}><AlertTriangle className="text-amber-400" style={{ width: 15, height: 15 }} /></div>;
    case 'xp':
      return <div className={`${base} bg-purple-500/20`}><Zap className="text-purple-400" style={{ width: 15, height: 15 }} /></div>;
    default:
      return <div className={`${base} bg-sky-500/20`}><Info className="text-sky-400" style={{ width: 15, height: 15 }} /></div>;
  }
};

// ─── useClickOutside hook ──────────────────────────────────────────────────────
function useClickOutside(ref: React.RefObject<HTMLElement | null>, onClose: () => void) {
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [ref, onClose]);
}

// ─── AppTopbar ─────────────────────────────────────────────────────────────────
export const AppTopbar: React.FC = () => {
  const {
    activeScreen,
    setScreen,
    toggleSidebar,
    toggleSidebarCollapsed,
    sidebarCollapsed,
    token,
    user,
    logout,
    inbox,
    markAllInboxRead,
    dismissInboxItem,
  } = useAppStore();

  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [notifOpen, setNotifOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);

  useClickOutside(notifRef, () => setNotifOpen(false));
  useClickOutside(settingsRef, () => setSettingsOpen(false));

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Close one panel when the other opens
  const openNotif = () => { setSettingsOpen(false); setNotifOpen(v => !v); };
  const openSettings = () => { setNotifOpen(false); setSettingsOpen(v => !v); };

  const unreadCount = inbox.filter(n => !n.read).length;

  const navigateTo = (screen: ScreenId) => {
    setSettingsOpen(false);
    setNotifOpen(false);
    setScreen(screen);
  };

  const pageTitle = SCREEN_TITLES[activeScreen] || 'Home';

  // Show at most 5 items in dropdown, newest first
  const previewItems = inbox.slice(0, 5);

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#045D61]/95 backdrop-blur-md border-b border-[#009924]/25 px-4 lg:px-6 flex items-center justify-between shadow-lg gap-3">

      {/* ─── Left: Toggle + Page Title + Farm Name ──────────────────── */}
      <div className="flex items-center gap-2 min-w-0">
        {/* Mobile hamburger */}
        <button
          onClick={() => toggleSidebar(true)}
          className="lg:hidden p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors flex-shrink-0 cursor-pointer"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Desktop sidebar toggle */}
        <button
          onClick={toggleSidebarCollapsed}
          className="hidden lg:flex p-2 rounded-lg bg-white/10 text-white/80 hover:text-white hover:bg-white/20 transition-colors flex-shrink-0 cursor-pointer"
          title={sidebarCollapsed ? 'Show menu (Ctrl+B)' : 'Hide menu (Ctrl+B)'}
          aria-label="Toggle menu"
        >
          <PanelLeft className="w-4 h-4" />
        </button>

        {/* Page Title */}
        <div className="flex items-center gap-1.5 text-sm font-medium min-w-0">
          <span className="text-white font-serif font-bold text-sm tracking-tight truncate max-w-[160px] sm:max-w-[220px] lg:max-w-none">
            {pageTitle}
          </span>
        </div>

        {/* Farm Name */}
        <span className="hidden md:flex items-center gap-1.5 text-white/80 text-xs ml-3 border-l border-white/20 pl-3">
          <span>🌾</span>
          <span className="truncate max-w-[160px]">{user.farm_name || 'My Farm'}</span>
        </span>
      </div>

      {/* ─── Right: Offline + Notifications + Settings ───────────────── */}
      <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
        {!isOnline && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#EF6C00]/20 border border-[#EF6C00]/40 text-[#FFD700] text-xs font-bold animate-pulse">
            <WifiOff className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Offline</span>
          </div>
        )}

        {/* ── Notifications ── */}
        <div className="relative" ref={notifRef}>
          <button
            id="topbar-notifications-btn"
            onClick={openNotif}
            aria-haspopup="true"
            aria-expanded={notifOpen}
            aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
            className="relative p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors border border-white/15 cursor-pointer"
          >
            <Bell style={{ width: 18, height: 18 }} />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white leading-none ring-2 ring-[#045D61]">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Notifications dropdown */}
          {notifOpen && (
            <div
              role="dialog"
              aria-label="Notifications panel"
              className="absolute right-0 top-[calc(100%+10px)] w-80 sm:w-96 rounded-2xl bg-[#03383a] border border-white/10 shadow-2xl overflow-hidden z-50"
              style={{ animation: 'topbarDropdown 0.15s ease-out' }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full bg-red-500 text-[10px] font-bold text-white leading-none">
                      {unreadCount}
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllInboxRead}
                    className="text-xs text-[#009924] hover:text-[#00c42e] font-medium transition-colors cursor-pointer"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              {/* Notification list */}
              <ul className="max-h-72 overflow-y-auto divide-y divide-white/5" role="list">
                {previewItems.length === 0 ? (
                  <li className="px-4 py-8 text-center text-white/40 text-sm">
                    You're all caught up! 🎉
                  </li>
                ) : (
                  previewItems.map(item => (
                    <li
                      key={item.id}
                      className={`flex items-start gap-3 px-4 py-3 transition-colors hover:bg-white/5 ${!item.read ? 'bg-white/[0.03]' : ''}`}
                    >
                      <CategoryIcon cat={item.category} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className={`text-xs font-semibold leading-snug ${!item.read ? 'text-white' : 'text-white/70'}`}>
                            {item.title}
                          </p>
                          <button
                            onClick={() => dismissInboxItem(item.id)}
                            aria-label="Dismiss notification"
                            className="p-0.5 rounded text-white/30 hover:text-white/60 transition-colors flex-shrink-0 cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                        <p className="text-[11px] text-white/50 mt-0.5 leading-snug">{item.body}</p>
                        <p className="text-[10px] text-white/30 mt-1">{relativeTime(item.createdAt)}</p>
                      </div>
                      {!item.read && (
                        <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[#009924] flex-shrink-0" aria-hidden="true" />
                      )}
                    </li>
                  ))
                )}
              </ul>

              {/* Footer — "View all" navigates to full page */}
              <div className="px-4 py-2.5 border-t border-white/10 bg-white/[0.02]">
                <button
                  onClick={() => navigateTo('screen-notifications')}
                  className="w-full text-xs text-center text-[#009924] hover:text-[#00c42e] font-medium transition-colors cursor-pointer py-1"
                >
                  View all notifications →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── Settings ── */}
        <div className="relative" ref={settingsRef}>
          <button
            id="topbar-settings-btn"
            onClick={openSettings}
            aria-haspopup="true"
            aria-expanded={settingsOpen}
            aria-label="Settings"
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors border border-white/15 cursor-pointer"
          >
            <Settings
              style={{ width: 18, height: 18 }}
              className={`transition-transform duration-300 ${settingsOpen ? 'rotate-45' : 'rotate-0'}`}
            />
          </button>

          {/* Settings dropdown */}
          {settingsOpen && (
            <div
              role="dialog"
              aria-label="Settings menu"
              className="absolute right-0 top-[calc(100%+10px)] w-56 rounded-2xl bg-[#03383a] border border-white/10 shadow-2xl overflow-hidden z-50"
              style={{ animation: 'topbarDropdown 0.15s ease-out' }}
            >
              {/* User identity card */}
              <div className="px-4 py-3.5 border-b border-white/10 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#009924]/30 border border-[#009924]/40 flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-[#009924]" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white truncate">{user.name || 'Farmer'}</p>
                  <p className="text-[11px] text-white/50 truncate">{user.email || ''}</p>
                </div>
              </div>

              {/* Menu items */}
              <ul className="py-1.5" role="menu">
                {(
                  [
                    { screen: 'screen-profile' as ScreenId, Icon: User, label: 'My Farm Profile' },
                    { screen: 'screen-settings' as ScreenId, Icon: Settings, label: 'Account Settings' },
                    { screen: 'screen-pricing' as ScreenId, Icon: CreditCard, label: 'Plans & Billing' },
                    { screen: 'screen-services' as ScreenId, Icon: HelpCircle, label: 'Help & Support' },
                  ] as const
                ).map(({ screen, Icon, label }) => (
                  <li key={screen} role="none">
                    <button
                      role="menuitem"
                      onClick={() => navigateTo(screen)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                    >
                      <Icon className="w-4 h-4 flex-shrink-0 text-white/50" />
                      <span className="flex-1 text-left">{label}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-white/30" />
                    </button>
                  </li>
                ))}
              </ul>

              {/* Divider + Sign out / Sign in */}
              <div className="border-t border-white/10 py-1.5">
                {token ? (
                  <button
                    role="menuitem"
                    onClick={() => { setSettingsOpen(false); logout(); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-red-300/80 hover:text-red-200 hover:bg-red-500/10 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 flex-shrink-0" />
                    <span>Sign Out</span>
                  </button>
                ) : (
                  <button
                    role="menuitem"
                    onClick={() => navigateTo('screen-auth')}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-[#009924] hover:text-[#00c42e] hover:bg-[#009924]/10 transition-colors cursor-pointer"
                  >
                    <LogIn className="w-4 h-4 flex-shrink-0" />
                    <span>Sign In</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Dropdown open animation keyframe */}
      <style>{`
        @keyframes topbarDropdown {
          from { opacity: 0; transform: translateY(-6px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </header>
  );
};
