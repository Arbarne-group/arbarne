import React, { useCallback, useEffect, useState } from 'react';
import { useAppStore } from '../store/useStore';
import { mlApi } from '../services/api';
import { Sparkles, Calculator, TrendingUp, RefreshCw, ExternalLink, Loader2 } from 'lucide-react';

interface SimResult {
  ffmi_score: number;
  max_ffmi: number;
  tier: number;
  tier_classification: string;
  strongest_pillar_name: string;
  priority_gap_pillar_name: string;
  trajectory_risk: string;
  recommendations: Array<{
    pillar_id: number;
    gap: string;
    recommended_action: string;
    recommended_learning: string;
    potential_service: string;
    priority: string;
  }>;
}

export const SimulatorPage: React.FC = () => {
  const { user, showNotification } = useAppStore();
  const [solarAdopted, setSolarAdopted] = useState(true);
  const [soilHealthLevel, setSoilHealthLevel] = useState(80);
  const [digitalRecords, setDigitalRecords] = useState(true);
  const [farmAcres, setFarmAcres] = useState(user.farm_size_acres || 5.0);

  const [result, setResult] = useState<SimResult | null>(null);
  const [loadingSim, setLoadingSim] = useState(false);

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

  const runSimulation = useCallback(async () => {
    setLoadingSim(true);
    try {
      // Map the three investment levers onto the 8 FFF pillar score fractions (0..1).
      const pillar_scores: Record<number, number> = {
        1: digitalRecords ? 0.85 : 0.45, // Smart Farming & Digital Transformation
        2: solarAdopted ? 0.85 : 0.4, // Productive Use of Renewable Energy
        3: 0.5,
        4: soilHealthLevel / 100, // Indigenous Knowledge & Climate Resilience
        5: 0.5,
        6: 0.5,
        7: 0.5,
        8: 0.5,
      };
      const res = await mlApi.simulate({
        farm_name: user.farm_name || 'Demo Farm',
        region: user.farm_region || 'Western Kenya',
        crop_type: user.farm_crop_type || 'Maize',
        farm_size: farmAcres,
        pillar_scores,
      });
      setResult(res);
    } catch (err) {
      showNotification(
        'Simulation service unavailable. Showing the last known result.',
        'error',
        4000,
        'Simulation Error'
      );
    } finally {
      setLoadingSim(false);
    }
  }, [digitalRecords, solarAdopted, soilHealthLevel, farmAcres, user, showNotification]);

  // Re-run whenever a lever changes.
  useEffect(() => {
    const t = setTimeout(() => runSimulation(), 250);
    return () => clearTimeout(t);
  }, [runSimulation]);

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
            Model how targeted capital and capability investments across the 8 FFF pillars influence yield trajectories, financial gross margins, and tier advancement — powered by the live backend simulation engine.
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
                {loadingSim && (
                  <Loader2 className="w-3 h-3 inline-block ml-2 animate-spin align-middle" />
                )}
              </span>
              {result && (
                <span className="px-3 py-1 rounded-full bg-[#FFD700] text-[#023c3f] font-extrabold text-[10px] uppercase shadow-sm">
                  Tier {result.tier} {result.tier_classification} Projected
                </span>
              )}
            </div>

            {result ? (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
                  <div className="p-4 rounded-2xl bg-white/10 border border-white/15">
                    <div className="text-[10px] text-white/70 font-bold uppercase">
                      Projected FFMI
                    </div>
                    <div className="text-2xl font-bold text-white mt-1">
                      {result.ffmi_score.toFixed(2)}{' '}
                      <span className="text-xs font-normal text-white/80">/ {result.max_ffmi}</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/10 border border-white/15">
                    <div className="text-[10px] text-white/70 font-bold uppercase">
                      Strongest Pillar
                    </div>
                    <div className="text-lg font-bold text-white mt-1 leading-tight">
                      {result.strongest_pillar_name}
                    </div>
                  </div>

                  <div className="col-span-2 sm:col-span-1 p-4 rounded-2xl bg-[#009924]/20 border border-[#009924]/40">
                    <div className="text-[10px] text-white/80 font-bold uppercase">
                      Priority Gap
                    </div>
                    <div className="text-lg font-extrabold text-[#FFD700] mt-1 leading-tight">
                      {result.priority_gap_pillar_name}
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div className="text-[10px] text-white/70 font-bold uppercase mb-1">
                    Trajectory Risk
                  </div>
                  <div className="text-sm font-semibold text-white/90">
                    {result.trajectory_risk}
                  </div>
                </div>

                {result.recommendations.length > 0 && (
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-white/80 space-y-2 max-h-56 overflow-y-auto">
                    <div className="font-bold text-white flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-[#FFD700]" />
                      <span>Recommended Capability Actions</span>
                    </div>
                    {result.recommendations.slice(0, 5).map((r, i) => (
                      <div key={i} className="border-t border-white/10 pt-2">
                        <div className="text-white/90">{r.recommended_action}</div>
                        <div className="text-white/50 mt-0.5">
                          📚 {r.recommended_learning} · 🛠 {r.potential_service}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center justify-center py-16 text-sm font-semibold text-white/70">
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Running live simulation…
              </div>
            )}
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
