import React, { useEffect } from 'react';
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
  PanelLeftClose,
  PanelLeftOpen,
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
    sidebarCollapsed,
    toggleSidebar,
    toggleSidebarCollapsed,
  } = useAppStore();

  // Keyboard shortcut listener: Ctrl+B or Cmd+B to toggle collapse
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        toggleSidebarCollapsed();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleSidebarCollapsed]);

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
        className={`fixed top-0 left-0 bottom-0 z-50 flex flex-col bg-gradient-to-b from-[#023c3f] via-[#045D61] to-[#012527] border-r border-[#009924]/25 shadow-2xl transition-all duration-300 ease-in-out overflow-x-hidden overflow-y-auto ${
          sidebarOpen ? 'translate-x-0 w-[270px]' : '-translate-x-full lg:translate-x-0'
        } ${sidebarCollapsed ? 'lg:w-[78px]' : 'lg:w-[264px]'}`}
      >
        {/* ─── Header Branding & Collapse Toggle ───────────────────────── */}
        <div
          className={`p-3.5 border-b border-white/10 flex items-center ${
            sidebarCollapsed ? 'justify-center' : 'justify-between'
          }`}
        >
          {/* Logo & Brand Info */}
          <div
            className={`flex items-center gap-2.5 cursor-pointer group ${
              sidebarCollapsed ? 'justify-center' : ''
            }`}
            onClick={() => setScreen('screen-dashboard')}
            title="Future Farms Framework"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#009924]/30 to-[#045D61] border border-[#009924]/40 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform backdrop-blur-md flex-shrink-0 glow-cyan">
              <img
                src="/assets/arbarne-emblem-white.png"
                alt="FFF"
                className="h-6 w-auto object-contain drop-shadow"
              />
            </div>

            {!sidebarCollapsed && (
              <div className="overflow-hidden whitespace-nowrap">
                <span className="text-[9px] font-extrabold text-[#009924] tracking-wider uppercase block">
                  Future Farms
                </span>
                <h1 className="font-serif text-base font-bold text-white tracking-tight">
                  Framework
                </h1>
              </div>
            )}
          </div>

          {/* Desktop Collapse / Expand Button */}
          {!sidebarCollapsed ? (
            <button
              onClick={toggleSidebarCollapsed}
              className="hidden lg:flex p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              title="Collapse sidebar (Ctrl+B)"
              aria-label="Collapse sidebar"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          ) : null}

          {/* Mobile Close Button */}
          <button
            className="lg:hidden p-1.5 text-white/70 hover:text-white rounded-lg hover:bg-white/10"
            onClick={() => toggleSidebar(false)}
            aria-label="Close Sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Floating Expand Trigger when Collapsed on Desktop */}
        {sidebarCollapsed && (
          <div className="hidden lg:flex justify-center py-2 border-b border-white/5">
            <button
              onClick={toggleSidebarCollapsed}
              className="p-1.5 rounded-lg text-[#009924] hover:text-white hover:bg-white/10 transition-colors"
              title="Expand sidebar (Ctrl+B)"
              aria-label="Expand sidebar"
            >
              <PanelLeftOpen className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ─── Farm Identity Badge ───────────────────────────────────── */}
        {!sidebarCollapsed ? (
          <div className="mx-3.5 my-3 p-2.5 rounded-xl bg-white/10 border border-white/15 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#009924]/20 border border-[#009924]/30 flex items-center justify-center text-sm flex-shrink-0">
              🌾
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-white truncate">
                {user.farm_name || 'Demonstration Farm'}
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-white/80">
                <span className="truncate">{user.farm_region || 'Western Kenya'}</span>
                <span className="px-1.5 py-0.2 rounded-full bg-[#1E88E5]/30 text-[8px] font-extrabold text-white border border-[#1E88E5]/40">
                  Tier {user.tier || 3}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div
            className="hidden lg:flex justify-center my-2.5 cursor-pointer"
            onClick={() => setScreen('screen-profile')}
            title={`${user.farm_name || 'Demonstration Farm'} (Tier ${user.tier || 3})`}
          >
            <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-sm relative">
              <span>🌾</span>
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#1E88E5] text-[8px] font-extrabold text-white flex items-center justify-center">
                {user.tier || 3}
              </span>
            </div>
          </div>
        )}

        {/* ─── Navigation Links ──────────────────────────────────────── */}
        <nav className="flex-1 px-2.5 py-2 space-y-4">
          {navGroups.map((group) => (
            <div key={group.title}>
              {!sidebarCollapsed ? (
                <div className="px-2.5 mb-1 text-[9px] font-extrabold tracking-wider text-white/60 uppercase">
                  {group.title}
                </div>
              ) : (
                <div className="w-6 h-px bg-white/10 mx-auto my-2" />
              )}

              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive = activeScreen === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setScreen(item.id)}
                      title={sidebarCollapsed ? item.label : undefined}
                      className={`w-full flex items-center rounded-xl text-xs font-medium transition-all group relative ${
                        sidebarCollapsed
                          ? 'justify-center p-2.5 h-10 w-10 mx-auto'
                          : 'gap-3 px-3 py-2 text-sm'
                      } ${
                        isActive
                          ? 'bg-gradient-to-r from-[#009924]/35 to-[#009924]/15 text-white font-bold border border-[#009924]/40 shadow-inner'
                          : 'text-white/75 hover:text-white hover:bg-white/10 hover:translate-x-0.5'
                      }`}
                    >
                      <span
                        className={`flex-shrink-0 ${
                          isActive ? 'text-[#FFD700]' : 'text-white/70 group-hover:text-white'
                        }`}
                      >
                        {item.icon}
                      </span>

                      {!sidebarCollapsed && (
                        <>
                          <span className="flex-1 text-left truncate">{item.label}</span>
                          {item.pill && (
                            <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full bg-[#EF6C00]/25 border border-[#FFD700]/40 text-[#FFD700]">
                              {item.pill}
                            </span>
                          )}
                        </>
                      )}

                      {/* Small notification dot when collapsed if pill exists */}
                      {sidebarCollapsed && item.pill && (
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#FFD700] animate-pulse" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* ─── Footer Identity & Auth ────────────────────────────────── */}
        <div className="p-2.5 border-t border-white/10 bg-[#012527]/80 space-y-2">
          {!sidebarCollapsed ? (
            <div
              className="flex items-center gap-2 p-1.5 rounded-xl bg-white/5 border border-white/10 hover:border-[#009924]/40 cursor-pointer transition-colors"
              onClick={() => setScreen('screen-profile')}
            >
              <div className="text-lg flex-shrink-0">🧑‍🌾</div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-white truncate">{user.name}</div>
                <div className="text-[9px] text-white/70 truncate">
                  Tier {user.tier || 3} • {user.farm_region || 'Kenya'}
                </div>
              </div>
            </div>
          ) : (
            <div
              className="hidden lg:flex justify-center py-1 cursor-pointer"
              onClick={() => setScreen('screen-profile')}
              title={`${user.name} - Profile Settings`}
            >
              <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-sm hover:bg-white/20 transition-colors">
                🧑‍🌾
              </div>
            </div>
          )}

          <button
            onClick={handleAuthClick}
            title={sidebarCollapsed ? (token ? 'Sign Out' : 'Sign In') : undefined}
            className={`w-full flex items-center justify-center rounded-xl text-xs font-bold transition-colors ${
              sidebarCollapsed
                ? 'p-2.5 h-10 w-10 mx-auto bg-white/10 hover:bg-red-500/20 text-white hover:text-red-300'
                : 'gap-2 py-2 px-3 bg-white/10 hover:bg-red-500/20 text-white hover:text-red-300 border border-white/10 hover:border-red-400/40'
            }`}
          >
            {token ? (
              <>
                <LogOut className="w-3.5 h-3.5 flex-shrink-0" />
                {!sidebarCollapsed && <span>Sign Out</span>}
              </>
            ) : (
              <>
                <LogIn className="w-3.5 h-3.5 flex-shrink-0" />
                {!sidebarCollapsed && <span>Sign In</span>}
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
};
