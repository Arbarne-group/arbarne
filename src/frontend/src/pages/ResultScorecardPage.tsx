import React from 'react';
import { useAppStore } from '../store/useStore';
import { RadarChart } from '../components/charts/RadarChart';
import {
  Download,
  ArrowRight,
  Award,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { PILLAR_BRAND_COLORS, TIER_CLASSIFICATION_COLORS, MATURITY_STATUS_COLORS } from '../types';

const STATUS_KEY: Record<string, keyof typeof MATURITY_STATUS_COLORS> = {
  non_existent: 'nonExistent',
  emerging: 'emerging',
  basic: 'basic',
  developing: 'developing',
  established: 'established',
  advanced: 'advanced',
};

const PILLAR_BAND_COLORS: Record<string, string> = {
  'Critical Weakness': '#D32F2F',
  'Developing Area': '#F57C00',
  Progressing: '#FBC02D',
  'Core Strength': '#388E3C',
  'Strategic Advantage': '#1B5E20',
};

const PRIORITY_META: Record<string, { label: string; cls: string }> = {
  quick_win: {
    label: 'QUICK WIN',
    cls: 'bg-[#009924]/15 text-[#009924] border border-[#009924]/30',
  },
  medium_term: {
    label: 'MEDIUM TERM',
    cls: 'bg-[#1E88E5]/15 text-[#1E88E5] border border-[#1E88E5]/30',
  },
  strategic: {
    label: 'STRATEGIC',
    cls: 'bg-[#FB8C00]/15 text-[#FB8C00] border border-[#FB8C00]/30',
  },
};

function pillarName(fallback: string, pillarId?: number | null): string {
  if (pillarId == null) return fallback;
  return PILLAR_BRAND_COLORS[pillarId]?.name || fallback;
}

export const ResultScorecardPage: React.FC = () => {
  const { assessment, user, setScreen, showNotification } = useAppStore();
  const result = assessment.latestResult;

  if (!result) {
    return (
      <div className="text-center py-20 space-y-4">
        <h2 className="text-xl font-bold text-slate-900">No recent assessment result</h2>
        <button
          onClick={() => setScreen('screen-assessment-choice')}
          className="px-5 py-2.5 rounded-xl bg-[#009924] text-white font-bold text-xs shadow-md"
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

  const tierMeta = TIER_CLASSIFICATION_COLORS[result.tier] || {
    tier: result.tier,
    name: result.tier_classification,
    hex: '#045D61',
  };

  const strongestId = result.strongest_pillar_id;
  const gapId = result.priority_gap_pillar_id;
  const strongestName = pillarName('Smart Farming & Digital Transformation', strongestId);
  const strongestScore = strongestId != null ? result.pillar_scores[strongestId] ?? 0.72 : 0.72;
  const gapName = pillarName('Productive Use of Renewable Energy', gapId);
  const gapScore = gapId != null ? result.pillar_scores[gapId] ?? 0.45 : 0.45;

  const pillars = [1, 2, 3, 4, 5, 6, 7, 8];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* ─── Scorecard Header Banner ─────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#023c3f] via-[#045D61] to-[#012527] border border-[#045D61]/30 p-8 sm:p-12 text-white shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/20 text-[#FFD700] text-xs font-bold uppercase tracking-wider">
              <Award className="w-4 h-4 text-[#FFD700]" />
              <span>Future Farms Verification (FFV) Certificate</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
              Farm Capability Scorecard
            </h1>
            <p className="text-xs sm:text-sm text-white/80">
              Enterprise: <span className="font-semibold text-white">{user.farm_name}</span> • Region: {user.farm_region}
            </p>
          </div>

          <div className="flex flex-col items-center sm:items-end gap-2">
            <div className="p-4 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md text-center">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#FFD700]">
                Official FFMI Score
              </span>
              <div className="text-3xl font-extrabold text-white">
                {result.ffmi_score.toFixed(2)}{' '}
                <span className="text-xs font-normal text-white/70">/ 24.00</span>
              </div>
              <span
                className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full text-white mt-1 inline-block shadow-sm"
                style={{ backgroundColor: tierMeta.hex }}
              >
                Tier {result.tier}: {result.tier_classification}
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
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#009924] hover:bg-[#007a1c] text-white font-bold text-xs shadow-lg shadow-[#009924]/30 transition-all"
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
        <div className="p-6 rounded-3xl glass-panel border border-[#045D61]/15 shadow-sm space-y-4">
          <h3 className="font-serif text-lg font-bold text-slate-900">
            8-Pillar Scorecard Spider Profile
          </h3>
          <RadarChart pillarScores={result.pillar_scores} />
        </div>

        <div className="p-6 rounded-3xl glass-panel border border-[#045D61]/15 shadow-sm space-y-4">
          <h3 className="font-serif text-lg font-bold text-slate-900">
            Transformation Strengths &amp; Gaps
          </h3>

          <div className="space-y-3">
            {/* Strength */}
            <div className="p-4 rounded-2xl bg-[#009924]/10 border border-[#009924]/25 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#009924] flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-slate-900">
                  Strongest Capability Pillar
                </span>
                <p className="text-xs text-slate-700 mt-0.5">
                  {strongestName} (Score: {((strongestScore || 0) * 100).toFixed(0)}%)
                </p>
              </div>
            </div>

            {/* Gap */}
            <div className="p-4 rounded-2xl bg-[#FB8C00]/10 border border-[#FB8C00]/30 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-[#FB8C00] flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-slate-900">
                  Priority Improvement Area
                </span>
                <p className="text-xs text-slate-700 mt-0.5">
                  {gapName} (Score: {((gapScore || 0) * 100).toFixed(0)}%)
                </p>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => setScreen('screen-simulator')}
              className="w-full py-2.5 rounded-xl bg-[#045D61] hover:bg-[#023c3f] text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-[#FFD700]" />
              <span>Simulate Next Tier Advancement ROI</span>
            </button>
          </div>
        </div>
      </div>

      {/* ─── Pillar Capability Maturity ─────────────────────────────── */}
      <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-[#045D61]/15 shadow-sm space-y-6">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#009924]">
            Per-Capability Guidance
          </span>
          <h3 className="font-serif text-xl font-bold text-slate-900">
            Pillar Capability Maturity
          </h3>
          <p className="text-xs text-slate-600 mt-1">
            Each pillar is assessed across five capabilities. The status reflects the farm's
            current maturity, and the guidance below is drawn from the FFF Recommendation Library.
          </p>
        </div>

        <div className="space-y-5">
          {pillars.map((pid) => {
            const pBrand = PILLAR_BRAND_COLORS[pid] || {
              name: `Pillar ${pid}`,
              bgLight: 'bg-[#045D61]/10',
              borderLight: 'border-[#045D61]/30',
              textClass: 'text-[#045D61]',
              hex: '#045D61',
            };
            const band = result.pillar_status?.[pid] || '';
            const bandColor = PILLAR_BAND_COLORS[band] || '#045D61';
            const caps = [1, 2, 3, 4, 5];

            return (
              <div
                key={pid}
                className={`p-5 rounded-2xl bg-white border ${pBrand.borderLight} shadow-sm space-y-3`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${pBrand.bgLight} ${pBrand.borderLight} ${pBrand.textClass}`}
                    >
                      {pBrand.name}
                    </span>
                  </div>
                  {band && (
                    <span
                      className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full text-white"
                      style={{ backgroundColor: bandColor }}
                    >
                      {band}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {caps.map((n) => {
                    const capId = `P${pid}.${n}`;
                    const status = result.capability_status?.[capId] || 'non_existent';
                    const feedback = result.capability_feedback?.[capId] || '';
                    const capName = result.capability_names?.[capId] || capId;
                    const sk = STATUS_KEY[status] || 'nonExistent';
                    const m = MATURITY_STATUS_COLORS[sk];
                    return (
                      <div
                        key={capId}
                        className="p-3 rounded-xl border border-slate-200/80 bg-slate-50/60 space-y-2"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-xs font-semibold text-slate-800">{capName}</span>
                          <span
                            className="text-[9px] font-extrabold px-2 py-0.5 rounded-full whitespace-nowrap"
                            style={{
                              backgroundColor: `${m.hex}22`,
                              color: m.hex,
                              border: `1px solid ${m.hex}55`,
                            }}
                          >
                            {m.label}
                          </span>
                        </div>
                        {feedback && (
                          <p className="text-[11px] leading-relaxed text-slate-600">{feedback}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── Structured Action Roadmap ───────────────────────────────── */}
      <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-[#045D61]/15 shadow-sm space-y-6">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#009924]">
            5-Field Empirical Action Plan
          </span>
          <h3 className="font-serif text-xl font-bold text-slate-900">
            Recommended Transformation Steps
          </h3>
        </div>

        <div className="space-y-4">
          {result.recommendations.map((rec, i) => {
            const pBrand = PILLAR_BRAND_COLORS[rec.pillar_id ?? 0] || {
              hex: '#045D61',
              textClass: 'text-[#045D61]',
              bgLight: 'bg-[#045D61]/10',
              borderLight: 'border-[#045D61]/30',
            };
            const prio = PRIORITY_META[rec.priority] || PRIORITY_META.medium_term;

            return (
              <div
                key={i}
                className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${pBrand.bgLight} ${pBrand.borderLight} ${pBrand.textClass}`}
                    >
                      {rec.pillar_name}
                    </span>
                    <span className="text-xs font-semibold text-slate-700">
                      {rec.capability_name}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${prio.cls}`}
                  >
                    {prio.label} PRIORITY
                  </span>
                </div>

                <p className="text-sm font-bold text-slate-900">{rec.recommended_action}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600 pt-1">
                  {rec.why_it_matters && (
                    <div>
                      <span className="font-semibold text-slate-900">Why it matters: </span>
                      {rec.why_it_matters}
                    </div>
                  )}
                  {rec.recommended_learning && (
                    <div className="text-[#009924]">
                      <span className="font-bold">Recommended learning: </span>
                      {rec.recommended_learning}
                    </div>
                  )}
                  {rec.potential_service && (
                    <div className="text-[#045D61]">
                      <span className="font-bold">Potential service: </span>
                      {rec.potential_service}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
