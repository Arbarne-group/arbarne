import React, { useState } from 'react';
import { useAppStore } from '../../store/useStore';
import {
  Menu,
  PanelLeft,
  Bell,
  Settings,
  User,
  WifiOff,
  Check,
} from 'lucide-react';
import { ScreenId } from '../../types';

const SCREEN_TITLES: Record<ScreenId, string> = {
  'screen-dashboard': 'Farm Insights',
  'screen-journey': 'Transformation Roadmap',
  'screen-assessment-choice': 'Assessment Hub',
  'screen-question': 'Capability Assessment',
  'screen-result': 'Scorecard & Roadmap',
  'screen-history': 'Assessment History',
  'screen-services': 'Agro-Services Portal',
  'screen-learning': 'Learning Academy',
  'screen-profile': 'Farm Profile & Settings',
  'screen-simulator': 'Scenario Simulator',
  'screen-auth': 'Authentication',
};

export const AppTopbar: React.FC = () => {
  const {
    activeScreen,
    setScreen,
    user,
    gamification,
    toggleSidebar,
    toggleSidebarCollapsed,
    sidebarCollapsed,
    token,
  } = useAppStore();

  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showNotifications, setShowNotifications] = useState(false);

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

  const farmerInitial = user.name ? user.name.charAt(0).toUpperCase() : 'F';
  const farmerFirstName = user.name ? user.name.split(' ')[0] : 'Farmer';

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#045D61] backdrop-blur-md border-b border-[#009924]/20 px-4 lg:px-8 flex items-center justify-between shadow-sm">
      {/* Left: Navigation Controls & Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => toggleSidebar(true)}
          className="lg:hidden p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors"
          aria-label="Open Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <button
          onClick={toggleSidebarCollapsed}
          className="hidden lg:flex p-2 rounded-xl bg-white/10 text-white/80 hover:text-white hover:bg-white/20 transition-colors"
          title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          aria-label="Toggle Sidebar"
        >
          <PanelLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2.5">
          <span className="text-white/60 text-xs font-semibold uppercase tracking-wider hidden sm:inline">
            Dashboard
          </span>
          <span className="text-white/30 hidden sm:inline">/</span>
          <h1 className="text-white font-serif font-bold text-base sm:text-lg tracking-tight">
            {activeScreen === 'screen-dashboard' ? 'Farm Insights' : SCREEN_TITLES[activeScreen] || 'Farm Insights'}
          </h1>
        </div>
      </div>

      {/* Right: Notifications, Settings & Farmer Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {!isOnline && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold animate-pulse">
            <WifiOff className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Offline</span>
          </div>
        )}

        {/* 🔔 Notifications Button & Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/90 hover:text-white transition-all relative"
            title="Notifications"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#FFD700] ring-2 ring-[#045D61]" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white text-slate-900 shadow-xl border border-slate-200 p-4 space-y-3 z-50 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Notifications
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#009924]/10 text-[#009924]">
                  2 New
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div
                  onClick={() => {
                    setShowNotifications(false);
                    setScreen('screen-assessment-choice');
                  }}
                  className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer space-y-0.5 border border-slate-100"
                >
                  <p className="font-bold text-[#045D61]">Action Required: Pillar 2 Audit</p>
                  <p className="text-slate-500 text-[11px]">Assess solar water pumping potential to unlock Tier 4 readiness.</p>
                </div>

                <div
                  onClick={() => {
                    setShowNotifications(false);
                    setScreen('screen-journey');
                  }}
                  className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer space-y-0.5 border border-slate-100"
                >
                  <p className="font-bold text-[#009924]">New Badge Unlocked!</p>
                  <p className="text-slate-500 text-[11px]">You achieved Level {gamification.level}: {gamification.level_name}.</p>
                </div>
              </div>

              <button
                onClick={() => setShowNotifications(false)}
                className="w-full py-1.5 text-center text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                Close
              </button>
            </div>
          )}
        </div>

        {/* ⚙️ Settings Icon */}
        <button
          onClick={() => setScreen('screen-profile')}
          className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/90 hover:text-white transition-all"
          title="Farm Settings & Profile"
          aria-label="Settings"
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* 👤 Farmer Profile Avatar Image */}
        <button
          onClick={() => setScreen('screen-profile')}
          className="relative p-0.5 rounded-full ring-2 ring-white/20 hover:ring-[#FFD700] transition-all group"
          title="View Farmer Profile"
          aria-label="Farmer Profile"
        >
          <img
            src="https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?auto=format&fit=crop&q=80&w=120&h=120"
            alt="Farmer Profile"
            className="w-8 h-8 rounded-full object-cover group-hover:scale-105 transition-transform"
          />
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#009924] ring-2 ring-[#045D61]" />
        </button>
      </div>
    </header>
  );
};
