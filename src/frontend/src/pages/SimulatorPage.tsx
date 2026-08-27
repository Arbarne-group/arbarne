import React, { useState } from 'react';
import { useAppStore } from '../store/useStore';
import { Sparkles, Calculator, TrendingUp, RefreshCw, ExternalLink } from 'lucide-react';

export const SimulatorPage: React.FC = () => {
  const { user, showNotification } = useAppStore();
  const [solarAdopted, setSolarAdopted] = useState(true);
  const [soilHealthLevel, setSoilHealthLevel] = useState(80);
  const [digitalRecords, setDigitalRecords] = useState(true);
  const [farmAcres, setFarmAcres] = useState(user.farm_size_acres || 5.0);

  const handleReset = () => {
    setSolarAdopted(false);
    setSoilHealthLevel(50);
    setDigitalRecords(false);
    setFarmAcres(user.farm_size_acres || 5.0);
    showNotification(
      'Simulator reset to standard baseline values.',
      'info',
      3000,
      'Parameters Reset'
    );
  };

  // Dynamic simulation calculations
  const baseYield = 13.2;
  const yieldGainPct =
    (solarAdopted ? 0.25 : 0) +
    (soilHealthLevel / 100) * 0.2 +
    (digitalRecords ? 0.1 : 0);

  const projectedYield = baseYield * (1 + yieldGainPct);
  const totalBags = projectedYield * farmAcres;
  const pricePerBag = 3800; // KES
  const projectedRevenueKes = totalBags * pricePerBag;
  const baselineRevenueKes = baseYield * farmAcres * pricePerBag;
  const netDividendKes = projectedRevenueKes - baselineRevenueKes;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#045D61]/15 text-[#045D61] border border-[#045D61]/30 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4 text-[#009924]" />
            <span>Empirical MLOps Simulation Sandbox</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-slate-900">
            Scenario Simulator &amp; ROI Forecast
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Model how targeted capital and capability investments across the 8 FFF pillars influence yield trajectories, financial gross margins, and tier advancement.
          </p>
        </div>

        <button
          onClick={handleReset}
          className="self-start sm:self-auto flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs shadow-sm transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Baseline</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Simulation Controls */}
        <div className="p-6 rounded-3xl glass-panel border border-[#045D61]/15 shadow-sm space-y-6">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <Calculator className="w-4 h-4 text-[#045D61]" />
            <span>Investment Levers</span>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-slate-800 block mb-1">
                Farm Acreage: <span className="text-[#045D61]">{farmAcres} Acres</span>
              </label>
              <input
                type="range"
                min="1"
                max="50"
                step="0.5"
                value={farmAcres}
                onChange={(e) => setFarmAcres(Number(e.target.value))}
                className="w-full accent-[#045D61] cursor-pointer"
              />
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900">Solar Drip Irrigation</div>
                <div className="text-[11px] text-slate-500">Pillar 2 Clean Energy</div>
              </div>
              <input
                type="checkbox"
                checked={solarAdopted}
                onChange={(e) => setSolarAdopted(e.target.checked)}
                className="w-4 h-4 accent-[#009924] cursor-pointer"
              />
            </div>

            <div>
              <label className="font-bold text-slate-800 block mb-1">
                Soil Health Index: <span className="text-[#045D61]">{soilHealthLevel}%</span>
              </label>
              <input
                type="range"
                min="20"
                max="100"
                value={soilHealthLevel}
                onChange={(e) => setSoilHealthLevel(Number(e.target.value))}
                className="w-full accent-[#045D61] cursor-pointer"
              />
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900">Digital Bookkeeping &amp; Records</div>
                <div className="text-[11px] text-slate-500">Pillar 1 Smart Farming</div>
              </div>
              <input
                type="checkbox"
                checked={digitalRecords}
                onChange={(e) => setDigitalRecords(e.target.checked)}
                className="w-4 h-4 accent-[#009924] cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Projected Financial Return Results */}
        <div className="lg:col-span-2 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#023c3f] via-[#045D61] to-[#012527] border border-[#009924]/40 text-white shadow-2xl space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-[#009924] tracking-wider">
                Simulation Outcome
              </span>
              <span className="px-3 py-1 rounded-full bg-[#FFD700] text-[#023c3f] font-extrabold text-[10px] uppercase shadow-sm">
                Tier 4 Investment Ready Projected
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-white/10 border border-white/15">
                <div className="text-[10px] text-white/70 font-bold uppercase">
                  Projected Yield
                </div>
                <div className="text-2xl font-bold text-white mt-1">
                  {projectedYield.toFixed(1)}{' '}
                  <span className="text-xs font-normal text-white/80">bags/ac</span>
                </div>
                <div className="text-[10px] text-[#009924] font-semibold mt-0.5">
                  +{(yieldGainPct * 100).toFixed(0)}% gain
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/10 border border-white/15">
                <div className="text-[10px] text-white/70 font-bold uppercase">
                  Total Production
                </div>
                <div className="text-2xl font-bold text-white mt-1">
                  {Math.round(totalBags)}{' '}
                  <span className="text-xs font-normal text-white/80">bags</span>
                </div>
                <div className="text-[10px] text-white/70 mt-0.5">
                  across {farmAcres} acres
                </div>
              </div>

              <div className="col-span-2 sm:col-span-1 p-4 rounded-2xl bg-[#009924]/20 border border-[#009924]/40">
                <div className="text-[10px] text-white/80 font-bold uppercase">
                  Net Profit Dividend
                </div>
                <div className="text-2xl font-extrabold text-[#FFD700] mt-1">
                  KES {Math.round(netDividendKes).toLocaleString()}
                </div>
                <div className="text-[10px] text-[#009924] mt-0.5 font-bold">
                  Annual uplift
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-white/80 space-y-2">
            <div className="font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#FFD700]" />
              <span>Gradio ML Interactive Sandbox Link</span>
            </div>
            <p className="text-white/70">
              For complete multi-variable Random Forest feature weighting and Isolation Forest anomaly boundaries, access the live Gradio application:
            </p>
            <a
              href="/ml-demo"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FFD700] hover:text-white underline pt-1"
            >
              <span>Launch Full Gradio Simulation Studio</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
