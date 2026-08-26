import React from 'react';
import { useAppStore } from '../../store/useStore';
import { Menu, Award, Flame, WifiOff } from 'lucide-react';
import { ScreenId } from '../../types';

const SCREEN_TITLES: Record<ScreenId, string> = {
  'screen-dashboard': 'Dashboard Overview',
  'screen-journey': 'Transformation Journey & Badges',
  'screen-assessment-choice': 'Assessment Hub',
  'screen-question': 'Live Capability Assessment',
  'screen-result': 'Assessment Scorecard & Roadmap',
  'screen-history': 'Assessment History & Benchmarks',
  'screen-services': 'Agro-Services Portal',
  'screen-learning': 'Learning Academy',
  'screen-profile': 'Farm Enterprise Profile',
  'screen-simulator': 'Scenario Simulator',
  'screen-auth': 'Platform Authentication',
};

export const AppTopbar: React.FC = () => {
  const { activeScreen, setScreen, gamification, toggleSidebar, token } = useAppStore();
  const [isOnline, setIsOnline] = React.useState(navigator.onLine);

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

  const span = Math.max(
    1,
    gamification.next_level_xp - gamification.current_level_min_xp
  );
  const pct = Math.max(
    5,
    Math.min(
      100,
      ((gamification.total_xp - gamification.current_level_min_xp) / span) * 100
    )
  );

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#022c24]/95 backdrop-blur-md border-b border-emerald-500/20 px-4 lg:px-8 flex items-center justify-between shadow-lg">
      {/* Left: Hamburger & Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => toggleSidebar(true)}
          className="lg:hidden p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
          aria-label="Open Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-sm font-medium">
          <span className="text-white/50 hidden sm:inline">Future Farms</span>
          <span className="text-white/30 hidden sm:inline">/</span>
          <span className="text-white font-serif font-bold text-base tracking-tight truncate max-w-[200px] sm:max-w-none">
            {SCREEN_TITLES[activeScreen] || 'Dashboard'}
          </span>
        </div>
      </div>

      {/* Right: Gamification HUD */}
      <div className="flex items-center gap-3">
        {!isOnline && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold animate-pulse">
            <WifiOff className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Offline Mode</span>
          </div>
        )}

        <div
          onClick={() => setScreen('screen-journey')}
          className="flex items-center gap-2 sm:gap-3 p-1.5 sm:px-3 sm:py-1.5 rounded-full bg-white/10 border border-emerald-400/30 hover:border-emerald-400/60 cursor-pointer transition-all shadow-md group"
          title="Click to view Transformation Journey & Badges"
        >
          {/* Level Badge */}
          <div className="flex items-center gap-1 text-xs font-bold text-amber-300">
            <Award className="w-4 h-4 text-amber-400 group-hover:rotate-12 transition-transform" />
            <span className="hidden md:inline">Lvl {gamification.level}</span>
            <span className="hidden lg:inline">{gamification.level_name}</span>
          </div>

          {/* XP Track Bar */}
          <div className="hidden sm:flex flex-col gap-0.5 w-24 md:w-32">
            <div className="w-full h-1.5 rounded-full bg-black/40 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 to-sprout-400 transition-all duration-500 rounded-full"
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className="text-[9px] text-sprout-300 font-semibold text-right">
              {gamification.total_xp.toLocaleString()} /{' '}
              {gamification.next_level_xp.toLocaleString()} XP
            </div>
          </div>

          {/* Streak Flame */}
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-extrabold border border-amber-400/40">
            <Flame className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
            <span>{gamification.streak_days}d</span>
          </div>
        </div>

        {/* Session Status Pill */}
        {token ? (
          <button
            onClick={() => setScreen('screen-profile')}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-sprout-300 text-xs font-bold hover:bg-emerald-500/30 transition-colors"
            title="Verified Farmer Session Active"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Verified</span>
          </button>
        ) : (
          <button
            onClick={() => setScreen('screen-auth')}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold transition-colors"
            title="Running in Demo / Guest Mode — Click to Sign In"
          >
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>Sign In</span>
          </button>
        )}
      </div>
    </header>
  );
};
