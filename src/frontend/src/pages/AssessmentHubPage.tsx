import React, { useState } from 'react';
import { useAppStore } from '../store/useStore';
import { assessmentApi } from '../services/api';
import { CheckCircle2, ArrowRight, ShieldCheck, Zap, Loader2 } from 'lucide-react';

export const AssessmentHubPage: React.FC = () => {
  const { pillars, startAssessment, awardXp } = useAppStore();
  const [selectedPillarId, setSelectedPillarId] = useState<number>(1);
  const [loading, setLoading] = useState(false);

  const handleStart = async (scope: 'full' | 'pillar') => {
    setLoading(true);
    try {
      const pId = scope === 'pillar' ? selectedPillarId : null;
      const res = await assessmentApi.startAssessment(scope, pId);
      startAssessment(res.assessment_id, scope, res.questions, pId);
      awardXp(25, 'Started Assessment');
    } catch (e: any) {
      alert(`Could not start assessment: ${e.message || e}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Capability Diagnostic Engine</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-pine-950">
          Choose Your Assessment Pathway
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl mx-auto">
          Evaluate your farm’s operational, agronomic, and commercial readiness against the 8 canonical pillars of the Future Farms Framework.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pathway A: Single Pillar */}
        <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-emerald-900/10 hover:border-emerald-500/30 transition-all flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 flex items-center justify-center text-2xl">
              ⚡
            </div>
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-600">
                Pathway A • Quick Audit
              </span>
              <h2 className="font-serif text-xl font-bold text-pine-950 mt-0.5">
                Single-Pillar Capability Deep Dive
              </h2>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Target a specific operational priority (e.g. Smart Farming, Renewable Energy, or Food Safety) with 25 targeted questions in under 4 minutes.
            </p>

            <div className="space-y-2 pt-2">
              <label className="block text-xs font-bold text-slate-700">
                Select Priority Pillar:
              </label>
              <select
                value={selectedPillarId}
                onChange={(e) => setSelectedPillarId(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                {pillars.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.code} — {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={() => handleStart('pillar')}
            disabled={loading}
            className="w-full py-3 rounded-xl bg-pine-900 hover:bg-pine-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span>Launch Single-Pillar Audit</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        {/* Pathway B: Full 8-Pillar Baseline */}
        <div className="p-6 sm:p-8 rounded-3xl glass-dark border border-emerald-400/30 text-white flex flex-col justify-between space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4">
            <span className="px-3 py-1 rounded-full bg-emerald-500 text-pine-950 font-extrabold text-[10px] uppercase tracking-wider">
              Recommended
            </span>
          </div>

          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 flex items-center justify-center text-2xl">
              🌟
            </div>
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-sprout-400">
                Pathway B • Full Baseline
              </span>
              <h2 className="font-serif text-xl font-bold text-white mt-0.5">
                Comprehensive 8-Pillar Diagnostic
              </h2>
            </div>
            <p className="text-xs text-white/70 leading-relaxed">
              Complete baseline across all 40 capabilities. Calculates your definitive FFMI maturity score, assigns your official Tier (1–5), and unlocks your PDF scorecard.
            </p>

            <ul className="space-y-2 text-xs text-sprout-300/90 pt-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Deterministic FFMI calculation &amp; Tier certificate</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>5-field structured action roadmap</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Earn 250 XP &amp; unlock Master Steward Badges</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => handleStart('full')}
            disabled={loading}
            className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-pine-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30 transition-all hover:scale-105"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span>Start Full 8-Pillar Diagnostic</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
