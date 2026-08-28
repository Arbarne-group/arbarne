import React, { useState } from 'react';
import { useAppStore } from '../../store/useStore';
import {
  Menu,
  Search,
  Bell,
  Settings,
  ShieldCheck,
  WifiOff,
} from 'lucide-react';

export const AppTopbar: React.FC = () => {
  const {
    activeScreen,
    setScreen,
    toggleSidebar,
    user,
  } = useAppStore();

  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [searchQuery, setSearchQuery] = useState('');

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

  const isProfileActive = activeScreen === 'screen-profile';
  const isDashboardActive = activeScreen === 'screen-dashboard';

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 lg:px-8 flex items-center justify-between shadow-xs">
      {/* Left: Mobile Menu & Brand Navigation */}
      <div className="flex items-center gap-4 lg:gap-8">
        <button
          onClick={() => toggleSidebar(true)}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          aria-label="Open Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Brand Title */}
        <div
          onClick={() => setScreen('screen-dashboard')}
          className="text-base sm:text-lg font-bold text-slate-900 tracking-tight font-sans cursor-pointer whitespace-nowrap hidden sm:block"
        >
          Future Farms Framework
        </div>

        {/* Sub Navigation Tabs */}
        <nav className="flex items-center gap-6 text-sm font-semibold">
          <button
            onClick={() => setScreen('screen-dashboard')}
            className={`py-5 transition-colors border-b-2 font-medium ${
              isDashboardActive
                ? 'text-slate-900 border-[#045D61] font-bold'
                : 'text-slate-500 border-transparent hover:text-slate-900'
            }`}
          >
            Global Dashboard
          </button>

          <button
            onClick={() => setScreen('screen-profile')}
            className={`py-5 transition-colors border-b-2 font-medium ${
              isProfileActive
                ? 'text-slate-900 border-[#045D61] font-bold'
                : 'text-slate-500 border-transparent hover:text-slate-900'
            }`}
          >
            Farm Insights
          </button>
        </nav>
      </div>

      {/* Right: Search, Notifications, Settings, Profile Avatar */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Offline indicator if disconnected */}
        {!isOnline && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold animate-pulse">
            <WifiOff className="w-3.5 h-3.5 text-amber-600" />
            <span className="hidden md:inline">Offline</span>
          </div>
        )}

        {/* Search Bar */}
        <div className="relative hidden md:block w-44 lg:w-64">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-1.5 rounded-full border border-slate-200 bg-slate-50/70 text-xs text-slate-700 placeholder-slate-400 focus:bg-white focus:border-[#045D61] focus:ring-2 focus:ring-[#045D61]/15 outline-none transition-all"
          />
        </div>

        {/* Notifications Icon Button */}
        <button
          onClick={() => setScreen('screen-journey')}
          className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors relative"
          title="Notifications"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5 stroke-[1.8]" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500" />
        </button>

        {/* Settings Icon Button */}
        <button
          onClick={() => setScreen('screen-profile')}
          className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          title="Settings"
          aria-label="Settings"
        >
          <Settings className="w-5 h-5 stroke-[1.8]" />
        </button>

        {/* User Avatar */}
        <div
          onClick={() => setScreen('screen-profile')}
          className="flex items-center gap-2 cursor-pointer group"
          title={`${user.name} - Farm Profile`}
        >
          <div className="w-9 h-9 rounded-full overflow-hidden border border-slate-200 ring-2 ring-emerald-600/20 group-hover:ring-[#045D61] transition-all bg-emerald-50">
            <img
              src="/assets/farmer-avatar.jpg"
              alt={user.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
        </div>
      </div>
    </header>
  );
};
