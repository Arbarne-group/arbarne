import React from 'react';
import { useAppStore } from '../store/useStore';
import { RadarChart } from '../components/charts/RadarChart';
import {
  Download,
  ArrowRight,
  Award,
  CheckCircle2,
  AlertCircle,
  FileText,
  Sparkles,
} from 'lucide-react';

export const ResultScorecardPage: React.FC = () => {
  const { assessment, user, setScreen, showNotification } = useAppStore();
  const result = assessment.latestResult;

  if (!result) {
    return (
      <div className="text-center py-20 space-y-4">
        <h2 className="text-xl font-bold text-pine-950">No recent assessment result</h2>
        <button
          onClick={() => setScreen('screen-assessment-choice')}
          className="px-5 py-2.5 rounded-xl bg-emerald-500 text-pine-950 font-bold text-xs"
        >
          Start New Assessment
        </button>
      </div>
    );
  }

  const pdfUrl = `/assessments/${result.assessment_id}/report/pdf`;

  const handleDownloadPdf = () => {
    showNotification('Generating and downloading official PDF scorecard...', 'info', 3500, 'Report Export');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* ─── Scorecard Header Banner ─────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#022c24] via-[#03362c] to-[#011913] border border-emerald-500/30 p-8 sm:p-12 text-white shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-sprout-300 text-xs font-bold uppercase tracking-wider">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Official Verification Certificate</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
              Farm Capability Scorecard
            </h1>
            <p className="text-xs sm:text-sm text-white/70">
              Enterprise: <span className="font-semibold text-white">{user.farm_name}</span> • Region: {user.farm_region}
            </p>
          </div>

          <div className="flex flex-col items-center sm:items-end gap-2">
            <div className="p-4 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md text-center">
              <span className="text-[10px] uppercase font-bold tracking-wider text-sprout-300">
                Official FFMI Score
              </span>
              <div className="text-3xl font-extrabold text-white">
                {result.ffmi_score.toFixed(2)}{' '}
                <span className="text-xs font-normal text-white/60">/ 24.00</span>
              </div>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500 text-pine-950 mt-1 inline-block">
                Tier {result.tier}: {result.tier_name}
              </span>
            </div>
          </div>
        </div>

        {/* PDF Download and CTAs */}
        <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-white/10">
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleDownloadPdf}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-pine-950 font-bold text-xs shadow-lg transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Download Official PDF Scorecard</span>
          </a>
          <button
            onClick={() => setScreen('screen-services')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/15 transition-all"
          >
            <span>Explore Matched Services</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ─── Radar Chart & Gap Analysis ──────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl glass-panel border border-emerald-900/10 shadow-sm space-y-4">
          <h3 className="font-serif text-lg font-bold text-pine-950">
            8-Pillar Scorecard Spider Profile
          </h3>
          <RadarChart pillarScores={result.pillar_scores} />
        </div>

        <div className="p-6 rounded-3xl glass-panel border border-emerald-900/10 shadow-sm space-y-4">
          <h3 className="font-serif text-lg font-bold text-pine-950">
            Transformation Strengths &amp; Gaps
          </h3>

          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200/70 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-emerald-900">
                  Strongest Capability Pillar
                </span>
                <p className="text-xs text-emerald-800 mt-0.5">
                  {result.strongest_pillar?.name || 'Smart Farming & Digital Transformation'} (Score:{' '}
                  {((result.strongest_pillar?.score || 0.72) * 100).toFixed(0)}%)
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/70 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-amber-900">
                  Priority Improvement Area
                </span>
                <p className="text-xs text-amber-800 mt-0.5">
                  {result.priority_gap_pillar?.name || 'Productive Use of Renewable Energy'} (Score:{' '}
                  {((result.priority_gap_pillar?.score || 0.45) * 100).toFixed(0)}%)
                </p>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => setScreen('screen-simulator')}
              className="w-full py-2.5 rounded-xl bg-pine-900 hover:bg-pine-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Simulate Next Tier Advancement ROI</span>
            </button>
          </div>
        </div>
      </div>

      {/* ─── Structured Action Roadmap ───────────────────────────────── */}
      <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-emerald-900/10 shadow-sm space-y-6">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-600">
            5-Field Empirical Action Plan
          </span>
          <h3 className="font-serif text-xl font-bold text-pine-950">
            Recommended Transformation Steps
          </h3>
        </div>

        <div className="space-y-4">
          {result.recommendations.map((rec, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold">
                    {rec.pillar_name}
                  </span>
                  <span className="text-xs font-semibold text-slate-700">
                    {rec.capability_name}
                  </span>
                </div>
                <span
                  className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                    rec.priority === 'CRITICAL'
                      ? 'bg-red-100 text-red-800 border border-red-200'
                      : rec.priority === 'HIGH'
                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {rec.priority} PRIORITY
                </span>
              </div>

              <p className="text-sm font-bold text-pine-950">{rec.action_text}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600 pt-1">
                {rec.why_it_matters && (
                  <div>
                    <span className="font-semibold text-slate-900">Why it matters: </span>
                    {rec.why_it_matters}
                  </div>
                )}
                {rec.quick_win && (
                  <div className="text-emerald-800">
                    <span className="font-semibold">Quick win: </span>
                    {rec.quick_win}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
