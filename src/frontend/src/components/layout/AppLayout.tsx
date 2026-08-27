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
                  alt="Arbarne"
                  className="h-7 w-auto object-contain"
                />
                <span className="font-serif font-bold text-lg text-white">
                  Arbarne Agriculture
                </span>
              </div>
              <p className="text-xs text-white/60 leading-relaxed">
                Accelerating 100,000 future-ready smallholder farms with verifiable capability metrics, climate-smart agronomy, and enterprise market linkages.
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold text-sprout-400 uppercase tracking-wider mb-3">
                Platform Portals
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <button
                    onClick={() => setScreen('screen-dashboard')}
                    className="hover:text-white transition-colors"
                  >
                    Farmer Hub
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setScreen('screen-journey')}
                    className="hover:text-white transition-colors"
                  >
                    Transformation Roadmap
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setScreen('screen-assessment-choice')}
                    className="hover:text-white transition-colors"
                  >
                    8-Pillar Diagnostics
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setScreen('screen-services')}
                    className="hover:text-white transition-colors"
                  >
                    Vetted Agro-Services
                  </button>
                </li>
              </ul>
            </div>

            <div className="md:col-span-2">
              <h4 className="text-xs font-bold text-sprout-400 uppercase tracking-wider mb-3">
                Transformation Pillars (FFF)
              </h4>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-white/60">
                <span>1. Smart Farming & Digital</span>
                <span>2. Renewable Energy</span>
                <span>3. Food Safety, Quality & Compliance</span>
                <span>4. Climate Resilience</span>
                <span>5. Farm Business Performance</span>
                <span>6. Human Capital & Leadership</span>
                <span>7. Market Access & Value</span>
                <span>8. Investment Readiness</span>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto border-t border-white/10 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-white/50">
            <div>
              © 2026 Arbarne Agriculture Group. All rights reserved. Future Farms Framework (FFF).
            </div>
            <div className="flex gap-4">
              <span>Enterprise Data Sovereignty</span>
              <span>•</span>
              <span>Off-Grid Ready PWA</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};
