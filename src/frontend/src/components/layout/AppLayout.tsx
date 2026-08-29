import React from 'react';
import { SidebarNav } from './SidebarNav';
import { AppTopbar } from './AppTopbar';
import { ToastNotification } from '../common/ToastNotification';
import { useAppStore } from '../../store/useStore';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { setScreen, sidebarCollapsed } = useAppStore();

  return (
    <div className="flex min-h-screen bg-canvas font-sans relative">
      <SidebarNav />
      <ToastNotification />

      <div
        className={`flex-1 flex flex-col min-h-screen min-w-0 transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? 'lg:ml-[78px]' : 'lg:ml-[264px]'
        }`}
      >
        <AppTopbar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>

        {/* Corporate Footer */}
        <footer className="border-t border-emerald-900/10 bg-[#011913] text-white/80 py-10 px-6 lg:px-12 mt-12">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <img
                  src="/assets/arbarne-emblem-white.png"
                  alt="Future Farms"
                  className="h-7 w-auto object-contain"
                />
                <span className="font-serif font-bold text-lg text-white">
                  Future Farms
                </span>
              </div>
              <p className="text-xs text-white/60 leading-relaxed">
                Helping farmers check and improve their farms.
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold text-sprout-400 uppercase tracking-wider mb-3">
                Quick Links
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <button
                    onClick={() => setScreen('screen-dashboard')}
                    className="hover:text-white transition-colors"
                  >
                    Home
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setScreen('screen-assessment-choice')}
                    className="hover:text-white transition-colors"
                  >
                    Check My Farm
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setScreen('screen-result')}
                    className="hover:text-white transition-colors"
                  >
                    My Results
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setScreen('screen-services')}
                    className="hover:text-white transition-colors"
                  >
                    Get Help
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setScreen('screen-learning')}
                    className="hover:text-white transition-colors"
                  >
                    Learn
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setScreen('screen-profile')}
                    className="hover:text-white transition-colors"
                  >
                    My Farm
                  </button>
                </li>
              </ul>
            </div>

            <div className="md:col-span-2">
              <h4 className="text-xs font-bold text-sprout-400 uppercase tracking-wider mb-3">
                What we check on a farm
              </h4>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-white/60">
                <span>Smart Farming</span>
                <span>Renewable Energy</span>
                <span>Food Safety</span>
                <span>Climate Resilience</span>
                <span>Farm Business</span>
                <span>People & Leadership</span>
                <span>Markets</span>
                <span>Investment Ready</span>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto border-t border-white/10 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-white/50">
            <div>© Future Farms</div>
            <div className="flex gap-4">
              <span>Helping farmers grow better farms</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};
