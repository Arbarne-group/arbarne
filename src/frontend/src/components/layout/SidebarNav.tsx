import React, { useEffect } from 'react';
import { useAppStore } from '../../store/useStore';
import { ScreenId } from '../../types';
import {
  Home,
  PlayCircle,
  BarChart3,
  TrendingUp,
  GraduationCap,
  Wrench,
  User,
  Settings,
  LogOut,
  LogIn,
  X,
  PanelLeftClose,
  PanelLeftOpen,
  ChevronRight,
  Compass,
  CreditCard,
} from 'lucide-react';

interface NavItem {
  id: ScreenId;
  label: string;
  icon: React.ReactNode;
}

export const SidebarNav: React.FC = () => {
  const {
    activeScreen,
    setScreen,
    user,
    token,
    logout,
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
      title: 'Main',
      items: [
        { id: 'screen-dashboard', label: 'Home', icon: <Home className="w-4 h-4" /> },
        {
          id: 'screen-assessment-choice',
          label: 'Check My Farm',
          icon: <PlayCircle className="w-4 h-4" />,
        },
        { id: 'screen-result', label: 'My Results', icon: <BarChart3 className="w-4 h-4" /> },
        {
          id: 'screen-journey',
          label: 'My Progress',
          icon: <TrendingUp className="w-4 h-4" />,
        },
        {
          id: 'screen-learning',
          label: 'Learn',
          icon: <GraduationCap className="w-4 h-4" />,
        },
        { id: 'screen-services', label: 'Get Help', icon: <Wrench className="w-4 h-4" /> },
      ],
    },
    {
      title: 'More',
      items: [
        { id: 'screen-profile', label: 'My Farm', icon: <User className="w-4 h-4" /> },
        { id: 'screen-onboarding', label: 'First-Time Setup', icon: <Compass className="w-4 h-4" /> },
        { id: 'screen-pricing', label: 'Plans & Billing', icon: <CreditCard className="w-4 h-4" /> },
        { id: 'screen-settings', label: 'Account', icon: <Settings className="w-4 h-4" /> },
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
            title="Future Farms"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#009924]/30 to-[#045D61] border border-[#009924]/40 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform backdrop-blur-md flex-shrink-0">
              <img
                src="/assets/arbarne-emblem-white.png"
                alt="Future Farms"
                className="h-6 w-auto object-contain drop-shadow"
              />
            </div>

            {!sidebarCollapsed && (
              <div className="overflow-hidden whitespace-nowrap">
                <h1 className="font-serif text-base font-bold text-white tracking-tight">
                  Future Farms
                </h1>
              </div>
            )}
          </div>

          {/* Desktop Collapse / Expand Button */}
          {!sidebarCollapsed ? (
            <button
              onClick={toggleSidebarCollapsed}
              className="hidden lg:flex p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              title="Hide menu (Ctrl+B)"
              aria-label="Hide menu"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          ) : null}

          {/* Mobile Close Button */}
          <button
            className="lg:hidden p-1.5 text-white/70 hover:text-white rounded-lg hover:bg-white/10"
            onClick={() => toggleSidebar(false)}
            aria-label="Close menu"
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
              title="Show menu (Ctrl+B)"
              aria-label="Show menu"
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
                {user.farm_name || 'My Farm'}
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-white/80">
                <span className="truncate">{user.farm_region || 'Western Kenya'}</span>
                <span className="px-1.5 py-0.2 rounded-full bg-[#1E88E5]/30 text-[8px] font-extrabold text-white border border-[#1E88E5]/40">
                  Stage {user.tier || 3}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div
            className="hidden lg:flex justify-center my-2.5 cursor-pointer"
            onClick={() => setScreen('screen-profile')}
            title={`${user.farm_name || 'My Farm'} (Stage ${user.tier || 3})`}
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
        <nav className="flex-1 px-2.5 py-2 space-y-5" aria-label="Main navigation">
          {navGroups.map((group) => (
            <div key={group.title}>
              {/* Group Label */}
              {!sidebarCollapsed ? (
                <div className="px-2.5 mb-1.5 flex items-center gap-2">
                  <span className="text-[9px] font-extrabold tracking-widest text-white/45 uppercase">
                    {group.title}
                  </span>
                  <div className="flex-1 h-px bg-white/10" />
                </div>
              ) : (
                <div className="w-5 h-px bg-white/15 mx-auto my-2" />
              )}

              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive = activeScreen === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setScreen(item.id);
                        toggleSidebar(false);
                      }}
                      title={sidebarCollapsed ? item.label : undefined}
                      aria-current={isActive ? 'page' : undefined}
                      className={`w-full flex items-center rounded-xl text-xs font-medium transition-all group relative ${
                        sidebarCollapsed
                          ? 'justify-center p-2.5 h-10 w-10 mx-auto'
                          : 'gap-3 px-3 py-2.5 text-sm'
                      } ${
                        isActive
                          ? 'bg-gradient-to-r from-[#009924]/35 to-[#009924]/10 text-white font-bold border border-[#009924]/35 shadow-inner'
                          : 'text-white/70 hover:text-white hover:bg-white/8 active:scale-[0.99]'
                      }`}
                    >
                      {/* Active left-edge accent bar */}
                      {isActive && !sidebarCollapsed && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-[#FFD700] rounded-r-full" />
                      )}

                      <span
                        className={`flex-shrink-0 transition-colors ${
                          isActive ? 'text-[#FFD700]' : 'text-white/60 group-hover:text-white'
                        }`}
                      >
                        {item.icon}
                      </span>

                      {!sidebarCollapsed && (
                        <>
                          <span className="flex-1 text-left truncate">{item.label}</span>

                          {/* Chevron on active item */}
                          {isActive && (
                            <ChevronRight className="w-3.5 h-3.5 text-white/30 flex-shrink-0" />
                          )}
                        </>
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
                  Stage {user.tier || 3} • {user.farm_region || 'Kenya'}
                </div>
              </div>
            </div>
          ) : (
            <div
              className="hidden lg:flex justify-center py-1 cursor-pointer"
              onClick={() => setScreen('screen-profile')}
              title={`${user.name} - My Farm`}
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
