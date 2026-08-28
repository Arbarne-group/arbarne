import React from 'react';
import { useAppStore } from '../../store/useStore';
import { ScreenId } from '../../types';
import {
  LayoutGrid,
  Tractor,
  ClipboardCheck,
  GraduationCap,
  Handshake,
  BarChart2,
  HelpCircle,
  Bell,
  User,
  Sprout,
  X,
} from 'lucide-react';

interface SidebarItem {
  id: ScreenId;
  label: string;
  icon: React.ReactNode;
}

export const SidebarNav: React.FC = () => {
  const {
    activeScreen,
    setScreen,
    sidebarOpen,
    toggleSidebar,
    showNotification,
  } = useAppStore();

  const mainNavItems: SidebarItem[] = [
    {
      id: 'screen-dashboard',
      label: 'Overview',
      icon: <LayoutGrid className="w-4 h-4 stroke-[2]" />,
    },
    {
      id: 'screen-profile',
      label: 'My Farm',
      icon: <Tractor className="w-4 h-4 stroke-[2]" />,
    },
    {
      id: 'screen-assessment-choice',
      label: 'Assessment',
      icon: <ClipboardCheck className="w-4 h-4 stroke-[2]" />,
    },
    {
      id: 'screen-learning',
      label: 'Learning',
      icon: <GraduationCap className="w-4 h-4 stroke-[2]" />,
    },
    {
      id: 'screen-services',
      label: 'Services',
      icon: <Handshake className="w-4 h-4 stroke-[2]" />,
    },
    {
      id: 'screen-history',
      label: 'Reports',
      icon: <BarChart2 className="w-4 h-4 stroke-[2]" />,
    },
  ];

  const handleUpgradeClick = () => {
    showNotification(
      'FFF Pro Tier provides verified satellite telemetry, ISO audit trail exports & priority agronomist advisory.',
      'info'
    );
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => toggleSidebar(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 flex flex-col bg-white border-r border-slate-200/90 shadow-sm transition-all duration-300 ease-in-out w-[240px] sm:w-[250px] ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* ─── Top Brand Header ────────────────────────────────────────── */}
        <div className="p-5 flex items-center justify-between">
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setScreen('screen-dashboard')}
          >
            {/* Dark teal square with leaf emblem */}
            <div className="w-10 h-10 rounded-xl bg-[#084D45] flex items-center justify-center text-white shadow-sm flex-shrink-0 group-hover:scale-105 transition-transform">
              <Sprout className="w-5 h-5 text-emerald-300 stroke-[2.2]" />
            </div>

            <div>
              <div className="text-base font-black text-slate-900 leading-none">
                FFF
              </div>
              <div className="text-[10px] text-slate-400 font-medium mt-1 whitespace-nowrap">
                Future Farms Framework
              </div>
            </div>
          </div>

          {/* Mobile Close Button */}
          <button
            className="lg:hidden p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
            onClick={() => toggleSidebar(false)}
            aria-label="Close Sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ─── Main Navigation Items ───────────────────────────────────── */}
        <nav className="flex-1 px-3.5 py-4 space-y-1.5 overflow-y-auto">
          {mainNavItems.map((item) => {
            const isActive = activeScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setScreen(item.id);
                  toggleSidebar(false);
                }}
                className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 text-left ${
                  isActive
                    ? 'bg-[#084D45] text-white shadow-sm font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 font-medium'
                }`}
              >
                <span
                  className={isActive ? 'text-white' : 'text-slate-500'}
                >
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* ─── Bottom Section: Upgrade Pro & Utilities ─────────────────── */}
        <div className="p-4 border-t border-slate-100 space-y-3 bg-slate-50/40">
          {/* Upgrade Pro Button */}
          <button
            onClick={handleUpgradeClick}
            className="w-full py-2.5 px-4 rounded-xl bg-[#084D45] hover:bg-[#063B35] active:scale-[0.98] text-white text-xs font-bold shadow-sm transition-all text-center flex items-center justify-center gap-2"
          >
            <span>Upgrade Pro</span>
          </button>

          {/* Divider */}
          <div className="border-t border-slate-200/80 my-2" />

          {/* Utility links */}
          <div className="space-y-1">
            <button
              onClick={() => {
                setScreen('screen-learning');
                toggleSidebar(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors text-left"
            >
              <HelpCircle className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <span>Help</span>
            </button>

            <button
              onClick={() => {
                setScreen('screen-journey');
                toggleSidebar(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors text-left"
            >
              <Bell className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <span>Notifications</span>
            </button>

            <button
              onClick={() => {
                setScreen('screen-profile');
                toggleSidebar(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors text-left"
            >
              <User className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <span>Profile</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
