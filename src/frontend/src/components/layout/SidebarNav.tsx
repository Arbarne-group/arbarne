import React from 'react';
import { useAppStore } from '../../store/useStore';
import { ScreenId } from '../../types';
import {
  Home,
  Trophy,
  ClipboardList,
  History,
  Sparkles,
  Wrench,
  GraduationCap,
  User,
  LogOut,
  LogIn,
  X,
} from 'lucide-react';

interface NavItem {
  id: ScreenId;
  label: string;
  icon: React.ReactNode;
  pill?: string;
}

export const SidebarNav: React.FC = () => {
  const {
    activeScreen,
    setScreen,
    user,
    token,
    logout,
    gamification,
    sidebarOpen,
    toggleSidebar,
  } = useAppStore();

  const navGroups: Array<{ title: string; items: NavItem[] }> = [
    {
      title: 'OVERVIEW',
      items: [
        { id: 'screen-dashboard', label: 'Dashboard', icon: <Home className="w-4 h-4" /> },
        {
          id: 'screen-journey',
          label: 'Journey & Badges',
          icon: <Trophy className="w-4 h-4" />,
          pill: `🔥 ${gamification.streak_days}d`,
        },
      ],
    },
    {
      title: 'ASSESSMENT & ANALYTICS',
      items: [
        { id: 'screen-assessment-choice', label: 'Assessment Hub', icon: <ClipboardList className="w-4 h-4" /> },
        { id: 'screen-history', label: 'History & Compare', icon: <History className="w-4 h-4" /> },
        { id: 'screen-simulator', label: 'Scenario Simulator', icon: <Sparkles className="w-4 h-4" /> },
      ],
    },
    {
      title: 'ECOSYSTEM & SERVICES',
      items: [
        { id: 'screen-services', label: 'Services Portal', icon: <Wrench className="w-4 h-4" /> },
        { id: 'screen-learning', label: 'Learning Academy', icon: <GraduationCap className="w-4 h-4" /> },
      ],
    },
    {
      title: 'ACCOUNT',
      items: [
        { id: 'screen-profile', label: 'Farm Profile', icon: <User className="w-4 h-4" /> },
      ],
    },
  ];

  const handleAuthClick = () => {
    if (token) {
      logout();
    } else {
      setScreen('screen-auth');
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => toggleSidebar(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 bottom-0 w-[270px] z-50 flex flex-col bg-gradient-to-b from-[#011913] via-[#022c24] to-[#03362c] border-r border-emerald-500/20 shadow-2xl transition-transform duration-300 ease-out overflow-y-auto ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Header Branding */}
        <div className="p-4 flex items-center justify-between border-b border-white/10">
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setScreen('screen-dashboard')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/30 to-pine-900 border border-emerald-400/40 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform backdrop-blur-md">
              <img
                src="/assets/arbarne-emblem-white.png"
                alt="Arbarne Emblem"
                className="h-7 w-auto object-contain drop-shadow"
              />
            </div>
            <div>
              <span className="text-[10px] font-bold text-sprout-400 tracking-wider uppercase block">
                Arbarne Agriculture
              </span>
              <h1 className="font-serif text-lg font-bold text-white tracking-tight">
                Future Farms
              </h1>
            </div>
          </div>
          <button
            className="lg:hidden p-1 text-white/70 hover:text-white"
            onClick={() => toggleSidebar(false)}
            aria-label="Close Sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Farm Identity Badge */}
        <div className="mx-4 my-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-lg">
            🌾
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="text-xs font-bold text-white truncate">
              {user.farm_name || 'Kakamega Demofarm'}
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-sprout-400">
              <span className="truncate">{user.farm_region || 'Western Kenya'}</span>
              <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/30 text-[9px] font-extrabold text-white border border-emerald-400/40">
                Tier {user.tier || 3}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-2 space-y-4">
          {navGroups.map((group) => (
            <div key={group.title}>
              <div className="px-3 mb-1 text-[10px] font-extrabold tracking-wider text-sprout-400/60 uppercase">
                {group.title}
              </div>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive = activeScreen === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setScreen(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-emerald-500/30 to-emerald-500/10 text-white font-bold border border-emerald-400/40 shadow-inner'
                          : 'text-white/70 hover:text-white hover:bg-white/5 hover:translate-x-1'
                      }`}
                    >
                      <span className={isActive ? 'text-sprout-400' : 'text-white/60'}>
                        {item.icon}
                      </span>
                      <span className="flex-1 text-left truncate">{item.label}</span>
                      {item.pill && (
                        <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300">
                          {item.pill}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer Identity & Auth */}
        <div className="p-3 border-t border-white/10 bg-pine-950/60 space-y-2">
          <div
            className="flex items-center gap-2.5 p-2 rounded-xl bg-white/5 border border-white/10 hover:border-emerald-400/30 cursor-pointer transition-colors"
            onClick={() => setScreen('screen-profile')}
          >
            <div className="text-xl">🧑‍🌾</div>
            <div className="flex-1 overflow-hidden">
              <div className="text-xs font-bold text-white truncate">{user.name}</div>
              <div className="text-[10px] text-sprout-400 truncate">
                Tier {user.tier || 3} {user.tier_name || 'Commercializing Farm'}
              </div>
            </div>
          </div>

          <button
            onClick={handleAuthClick}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-red-500/20 text-white hover:text-red-300 border border-white/10 hover:border-red-400/40 transition-colors"
          >
            {token ? (
              <>
                <LogOut className="w-3.5 h-3.5" /> Sign Out
              </>
            ) : (
              <>
                <LogIn className="w-3.5 h-3.5" /> Sign In
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
};
