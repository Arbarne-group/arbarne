import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../store/useStore';
import { assessmentApi, portalApi } from '../services/api';
import { RadarChart } from '../components/charts/RadarChart';
import {
  BarChart3,
  Calendar,
  Download,
  TrendingUp,
  ShieldCheck,
  ArrowRight,
  ArrowUpRight,
  ChevronRight,
} from 'lucide-react';
import { PILLAR_BRAND_COLORS, DashboardSummary } from '../types';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export const ReportsPage: React.FC = () => {
  const { user, assessment, setScreen, showNotification } = useAppStore();
  const [timeRange, setTimeRange] = useState<'6m' | 'ytd' | '12m'>('6m');

  const latest = assessment.latestResult;
  const [history, setHistory] = useState<
    Array<{ id: number | string; ffmi_score?: number | null; completed_at?: string; submitted_at?: string; started_at?: string }>
  >([]);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);

  useEffect(() => {
    let cancelled = false;
    assessmentApi
      .getHistory()
      .then((res) => {
        if (!cancelled) setHistory(res);
      })
      .catch(() => {
        if (!cancelled) setHistory([]);
      });
    portalApi
      .getDashboardSummary()
      .then((res) => {
        if (!cancelled) setSummary(res);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  // ── Real Farm Score (FFMI is on a 0–24 scale) ───────────────────────
  const ffmiScore = latest?.ffmi_score ?? summary?.ffmi_score ?? 0;
  const normalizedScore = Math.min(100, Math.round((ffmiScore / 24) * 100));

  // ── Real trajectory built from assessment history ──────────────────
  const trajectoryData = useMemo(() => {
    return [...history]
      .filter((h) => typeof h.ffmi_score === 'number' && h.ffmi_score !== null)
      .sort((a, b) => {
        const da = new Date(a.completed_at || a.submitted_at || a.started_at || 0).getTime();
        const db = new Date(b.completed_at || b.submitted_at || b.started_at || 0).getTime();
        return da - db;
      })
      .map((h) => {
        const f = h.ffmi_score as number;
        const dstr = h.completed_at || h.submitted_at || h.started_at;
        const label = dstr
          ? new Date(dstr).toLocaleDateString(undefined, {
              month: 'short',
              year: '2-digit',
            })
          : 'Check';
        return {
          label,
          score: Math.round((f / 24) * 100),
          ffmi: Number(f.toFixed(1)),
        };
      });
  }, [history]);

  const hasTrend = trajectoryData.length >= 2;
  const firstPoint = trajectoryData[0];
  const lastPoint = trajectoryData[trajectoryData.length - 1];
  const deltaPoints = hasTrend ? lastPoint.score - firstPoint.score : 0;
  const isRising = hasTrend && lastPoint.ffmi > firstPoint.ffmi;

  // ── Real "How You Compare" facts (no invented benchmark) ────────────
  const tierVal = latest?.tier ?? summary?.tier ?? 0;
  const tierName = latest?.tier_classification ?? summary?.tier_name ?? '';
  const region = summary?.region ?? user.farm_region ?? 'your region';

  const handleExport = () => {
    showNotification('Getting your report ready...', 'info');
    setTimeout(() => {
      const assessmentId = latest?.assessment_id;
      if (assessmentId) {
        window.open(`/api/assessments/${assessmentId}/pdf`, '_blank');
      } else {
        setScreen('screen-history');
      }
      showNotification('Your PDF report is ready to download.', 'success');
    }, 800);
  };

  // ── Real improvement steps from the latest diagnosis ────────────────
  const improvements = latest?.recommendations ?? [];
  const shownImprovements = improvements.slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* ─── 1. Header & Time Filter ───────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#045D61]/15 text-[#045D61] border border-[#045D61]/30 text-xs font-bold uppercase tracking-wider mb-2">
            <BarChart3 className="w-4 h-4 text-[#009924]" />
            <span>My Results</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-slate-900">
            My Results
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            A simple summary of your last Farm Check — your Farm Score, your stage, and the areas to focus on.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Time Period Selector */}
          <div className="flex items-center bg-white border border-slate-200 rounded-xl px-3 py-1.5 shadow-xs">
            <Calendar className="w-4 h-4 text-slate-400 mr-2" />
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="bg-transparent border-none text-xs font-bold text-slate-700 focus:ring-0 cursor-pointer outline-none"
            >
              <option value="6m">Last 6 Months</option>
              <option value="ytd">Year to Date (2026)</option>
              <option value="12m">Last 12 Months</option>
            </select>
          </div>

          {/* Export Button */}
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold text-xs shadow-xs transition-all hover:scale-102"
          >
            <Download className="w-4 h-4 text-[#045D61]" />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {/* ─── 2. Top Row: Farm Score Chart + How You Compare ─ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Farm Score Chart (Spans 8 cols) */}
        <div className="lg:col-span-8 p-6 sm:p-7 rounded-3xl glass-panel border border-[#045D61]/15 shadow-sm space-y-6 flex flex-col justify-between">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#045D61]">
                Your Farm Score Over Time
              </span>
              <h2 className="font-serif text-lg sm:text-xl font-bold text-slate-900">
                Your Farm Score
              </h2>
              <p className="text-xs text-slate-500">
                How your Farm Score has changed over time.
              </p>
            </div>
            <div
              className={`px-3 py-1 rounded-full text-xs font-extrabold flex items-center gap-1.5 shadow-xs ${
                hasTrend && isRising
                  ? 'bg-[#009924]/10 text-[#009924] border border-[#009924]/20'
                  : hasTrend
                  ? 'bg-[#FB8C00]/10 text-[#FB8C00] border border-[#FB8C00]/20'
                  : 'bg-slate-100 text-slate-500 border border-slate-200'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>
                {hasTrend
                  ? isRising
                    ? 'Your score is rising'
                    : 'Your score has dipped'
                  : 'Complete more Farm Checks'}
              </span>
            </div>
          </div>

          {/* Area Chart Container */}
          {hasTrend ? (
            <div className="h-64 sm:h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trajectoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#045D61" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#045D61" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="label"
                    tickLine={false}
                    axisLine={{ stroke: '#e2e8f0' }}
                    tick={{ fontSize: 12, fill: '#64748b', fontWeight: 600 }}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11, fill: '#94a3b8' }}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="p-3 bg-slate-900/95 text-white rounded-xl shadow-xl text-xs space-y-1 backdrop-blur-md border border-slate-700">
                            <p className="font-bold text-[#FFD700]">{data.label}</p>
                            <p className="flex justify-between gap-4">
                              <span className="text-slate-300">Score:</span>
                              <span className="font-bold text-white">{data.score} / 100</span>
                            </p>
                            <p className="flex justify-between gap-4">
                              <span className="text-slate-300">Farm Score:</span>
                              <span className="font-bold text-[#009924]">{data.ffmi} pts</span>
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="#045D61"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#scoreGradient)"
                    dot={{ r: 4, fill: '#045D61', stroke: '#fff', strokeWidth: 2 }}
                    activeDot={{ r: 6, fill: '#009924', stroke: '#fff', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 sm:h-72 w-full flex items-center justify-center rounded-2xl bg-slate-50 border border-slate-100">
              <div className="text-center px-6 max-w-sm">
                <div className="w-14 h-14 rounded-3xl bg-[#045D61]/10 text-[#045D61] flex items-center justify-center mx-auto text-2xl mb-3">
                  🌱
                </div>
                <h4 className="font-serif text-lg font-bold text-slate-900">
                  No progress trend yet
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Complete more Farm Checks to see your progress trend.
                </p>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-3 h-3 rounded-full bg-[#045D61]" /> Your Farm Score
              </span>
            </div>
            {hasTrend ? (
              <span className="font-bold text-slate-700">
                Your score has gone {deltaPoints >= 0 ? 'up' : 'down'} by {Math.abs(deltaPoints)} points
              </span>
            ) : (
              <span className="font-bold text-slate-400">Awaiting more data</span>
            )}
          </div>
        </div>

        {/* How You Compare Card (Spans 4 cols) */}
        <div className="lg:col-span-4 p-6 sm:p-7 rounded-3xl glass-panel border border-[#045D61]/15 shadow-sm space-y-6 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#B88917]">
              Your Farm Stage
            </span>
            <h2 className="font-serif text-lg sm:text-xl font-bold text-slate-900">
              How You Compare
            </h2>
            <p className="text-xs text-slate-500">
              Farms in {region}
            </p>
          </div>

          {/* Radial Score Display */}
          <div className="flex flex-col items-center justify-center my-auto">
            <div className="w-36 h-36 rounded-full border-4 border-[#FFD700] bg-amber-50/40 flex items-center justify-center relative">
              <div className="flex flex-col items-center text-center">
                <span className="font-serif text-4xl font-extrabold text-[#045D61]">
                  {normalizedScore}
                </span>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Your Score
                </span>
              </div>
            </div>

            {/* Real Stage (no invented regional average) */}
            <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl w-full mt-6 flex justify-between items-center shadow-xs">
              <span className="text-xs font-bold text-slate-600">Your Stage</span>
              <div className="text-right">
                <span className="font-serif text-lg font-bold text-slate-900">
                  {tierVal > 0 ? `Stage ${tierVal}` : '—'}
                </span>
              </div>
            </div>

            <p className="mt-4 text-xs font-bold text-[#009924] flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>
                {tierVal > 0
                  ? `You are at Stage ${tierVal} (${tierName}).`
                  : 'Complete a Farm Check to see your stage.'}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* ─── 3. Bottom Row: Scores by Area + Recent Improvements ───── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Scores by Area (Spans 6 cols) */}
        <div className="lg:col-span-6 p-6 sm:p-7 rounded-3xl glass-panel border border-[#045D61]/15 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#009924]">
                By Area
              </span>
              <h2 className="font-serif text-lg sm:text-xl font-bold text-slate-900">
                Your Scores by Area
              </h2>
              <p className="text-xs text-slate-500">
                How your farm scored in each of the 8 areas.
              </p>
            </div>
            <button
              onClick={() => setScreen('screen-assessment-choice')}
              className="text-xs font-bold text-[#045D61] hover:text-[#009924] flex items-center gap-1 transition-colors"
            >
              <span>Do a Farm Check</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="h-[340px] w-full flex items-center justify-center">
            <RadarChart pillarScores={latest?.pillar_scores} />
          </div>
        </div>

        {/* Recent Improvements (Spans 6 cols) */}
        <div className="lg:col-span-6 p-6 sm:p-7 rounded-3xl glass-panel border border-[#045D61]/15 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#009924]">
                Your Progress
              </span>
              <h2 className="font-serif text-lg sm:text-xl font-bold text-slate-900">
                Recent Improvements
              </h2>
              <p className="text-xs text-slate-500">
                Suggested next steps from your last Farm Check.
              </p>
            </div>
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#009924]/10 text-[#009924] border border-[#009924]/20 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{improvements.length} Suggested</span>
            </span>
          </div>

          {shownImprovements.length > 0 ? (
            <div className="grid grid-cols-1 gap-3.5 pt-1">
              {shownImprovements.map((rec, idx) => {
                const hex = PILLAR_BRAND_COLORS[rec.pillar_id ?? 0]?.hex ?? '#045D61';
                const bg = PILLAR_BRAND_COLORS[rec.pillar_id ?? 0]?.bgLight ?? 'bg-[#045D61]/10';
                const txt = PILLAR_BRAND_COLORS[rec.pillar_id ?? 0]?.textClass ?? 'text-[#045D61]';
                return (
                  <motion.div
                    key={idx}
                    whileHover={{ y: -2 }}
                    onClick={() => setScreen('screen-journey')}
                    className="p-4 rounded-2xl glass-panel border border-slate-200/80 hover:border-slate-300 shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-between border-l-4 group"
                    style={{ borderLeftColor: hex }}
                  >
                    <div className="flex items-start gap-3.5 flex-1 pr-2">
                      <div className={`w-10 h-10 rounded-xl ${bg} ${txt} flex items-center justify-center font-bold flex-shrink-0 group-hover:scale-105 transition-transform mt-0.5`}>
                        <TrendingUp className="w-5 h-5" />
                      </div>
                      <div className="space-y-1 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${bg} ${txt}`}>
                            {rec.pillar_name}
                          </span>
                          <span className="text-[10px] font-medium text-slate-400">
                            {rec.priority === 'quick_win'
                              ? 'Quick Win'
                              : rec.priority === 'medium_term'
                              ? 'Medium Term'
                              : 'Strategic'}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#045D61] transition-colors leading-snug">
                          {rec.recommended_action}
                        </h4>
                        {rec.why_it_matters && (
                          <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                            {rec.why_it_matters}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex-shrink-0">
                      <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-[#045D61] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center px-6">
              <div className="w-14 h-14 rounded-3xl bg-[#045D61]/10 text-[#045D61] flex items-center justify-center mx-auto text-2xl mb-3">
                🌱
              </div>
              <h4 className="font-serif text-lg font-bold text-slate-900">
                No steps yet
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Complete a Farm Check to see your suggested next steps.
              </p>
            </div>
          )}

          <div className="pt-2">
            <button
              onClick={() => setScreen('screen-journey')}
              className="w-full py-2.5 rounded-xl bg-[#045D61] hover:bg-[#023c3f] text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <span>See All Suggested Next Steps</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
