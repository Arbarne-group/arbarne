import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../store/useStore';
import {
  BarChart3,
  Calendar,
  Download,
  TrendingUp,
  ShieldCheck,
  Cpu,
  Store,
  Layers,
  ArrowRight,
  ArrowUpRight,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';

export const ReportsPage: React.FC = () => {
  const { user, assessment, setScreen, showNotification } = useAppStore();
  const [timeRange, setTimeRange] = useState<'6m' | 'ytd' | '12m'>('6m');

  const latest = assessment.latestResult;
  const ffmiScore = latest ? latest.ffmi_score : user.ffmi_score || 13.8;
  const normalizedScore = Math.min(100, Math.round((ffmiScore / 24) * 100));

  // Executive Trajectory Data
  const trajectoryData = [
    { month: 'Jan', score: 55, ffmi: 13.2, benchmark: 52 },
    { month: 'Feb', score: 58, ffmi: 13.9, benchmark: 54 },
    { month: 'Mar', score: 62, ffmi: 14.8, benchmark: 57 },
    { month: 'Apr', score: 65, ffmi: 15.6, benchmark: 60 },
    { month: 'May', score: 71, ffmi: 17.0, benchmark: 63 },
    { month: 'Jun', score: normalizedScore, ffmi: Number(ffmiScore.toFixed(1)), benchmark: 65 },
  ];

  // 8-Pillar Radar Data
  const radarData = [
    { pillar: 'Smart Farming', score: latest?.pillar_scores?.[1] ? Math.round(latest.pillar_scores[1] * 100) : 70, fullMark: 100 },
    { pillar: 'Renewable Energy', score: latest?.pillar_scores?.[2] ? Math.round(latest.pillar_scores[2] * 100) : 45, fullMark: 100 },
    { pillar: 'Food Safety', score: latest?.pillar_scores?.[3] ? Math.round(latest.pillar_scores[3] * 100) : 85, fullMark: 100 },
    { pillar: 'Indigenous & Soil', score: latest?.pillar_scores?.[4] ? Math.round(latest.pillar_scores[4] * 100) : 60, fullMark: 100 },
    { pillar: 'Farm Business', score: latest?.pillar_scores?.[5] ? Math.round(latest.pillar_scores[5] * 100) : 55, fullMark: 100 },
    { pillar: 'Human Capital', score: latest?.pillar_scores?.[6] ? Math.round(latest.pillar_scores[6] * 100) : 80, fullMark: 100 },
    { pillar: 'Market Access', score: latest?.pillar_scores?.[7] ? Math.round(latest.pillar_scores[7] * 100) : 75, fullMark: 100 },
    { pillar: 'Investment', score: latest?.pillar_scores?.[8] ? Math.round(latest.pillar_scores[8] * 100) : 50, fullMark: 100 },
  ];

  const handleExport = () => {
    showNotification('Preparing executive report export...', 'info');
    setTimeout(() => {
      const assessmentId = latest?.assessment_id;
      if (assessmentId) {
        window.open(`/api/assessments/${assessmentId}/pdf`, '_blank');
      } else {
        setScreen('screen-history');
      }
      showNotification('Executive PDF Scorecard download ready.', 'success');
    }, 800);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* ─── 1. Header & Time Filter ───────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#045D61]/15 text-[#045D61] border border-[#045D61]/30 text-xs font-bold uppercase tracking-wider mb-2">
            <BarChart3 className="w-4 h-4 text-[#009924]" />
            <span>Farm Analytics &amp; Benchmarks</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-slate-900">
            Reports &amp; Insights
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Comprehensive analysis of your farm's maturity trajectory, regional benchmarks, and 8-pillar performance.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Time Range Selector */}
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
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* ─── 2. Top Row: Executive Summary Chart + Regional Benchmarking ─ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Executive Summary Chart (Spans 8 cols) */}
        <div className="lg:col-span-8 p-6 sm:p-7 rounded-3xl glass-panel border border-[#045D61]/15 shadow-sm space-y-6 flex flex-col justify-between">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#045D61]">
                Performance Trajectory
              </span>
              <h2 className="font-serif text-lg sm:text-xl font-bold text-slate-900">
                Executive Summary: Overall FFF Score
              </h2>
              <p className="text-xs text-slate-500">
                Maturity growth trajectory over the selected period.
              </p>
            </div>
            <div className="bg-[#009924]/10 text-[#009924] border border-[#009924]/20 px-3 py-1 rounded-full text-xs font-extrabold flex items-center gap-1.5 shadow-xs">
              <TrendingUp className="w-4 h-4" />
              <span>+12% Seasonal Growth</span>
            </div>
          </div>

          {/* Area Chart Container */}
          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trajectoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#045D61" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#045D61" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="benchmarkGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FB8C00" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#FB8C00" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="month"
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
                          <p className="font-bold text-[#FFD700]">{data.month} 2026</p>
                          <p className="flex justify-between gap-4">
                            <span className="text-slate-300">Normalized Score:</span>
                            <span className="font-bold text-white">{data.score} / 100</span>
                          </p>
                          <p className="flex justify-between gap-4">
                            <span className="text-slate-300">Raw FFMI:</span>
                            <span className="font-bold text-[#009924]">{data.ffmi} pts</span>
                          </p>
                          <p className="flex justify-between gap-4 text-[11px] text-slate-400">
                            <span>Regional Avg:</span>
                            <span>{data.benchmark}</span>
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
                <Area
                  type="monotone"
                  dataKey="benchmark"
                  stroke="#FB8C00"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  fillOpacity={1}
                  fill="url(#benchmarkGradient)"
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-3 h-3 rounded-full bg-[#045D61]" /> Your Farm Trajectory
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-3 h-1 rounded-full bg-[#FB8C00]" /> Regional Benchmark
              </span>
            </div>
            <span className="font-bold text-slate-700">Baseline Gain: +23.0 pts</span>
          </div>
        </div>

        {/* Regional Benchmarking Card (Spans 4 cols) */}
        <div className="lg:col-span-4 p-6 sm:p-7 rounded-3xl glass-panel border border-[#045D61]/15 shadow-sm space-y-6 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#B88917]">
              Peer Analysis
            </span>
            <h2 className="font-serif text-lg sm:text-xl font-bold text-slate-900">
              Regional Benchmarking
            </h2>
            <p className="text-xs text-slate-500">
              {user.farm_region || 'Nairobi Region'} Agro-Zone Comparison
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

            {/* Regional Average Bar */}
            <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl w-full mt-6 flex justify-between items-center shadow-xs">
              <span className="text-xs font-bold text-slate-600">Regional Average</span>
              <div className="text-right">
                <span className="font-serif text-lg font-bold text-slate-900">65</span>
                <span className="text-xs text-slate-400"> / 100</span>
              </div>
            </div>

            <p className="mt-4 text-xs font-bold text-[#009924] flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>Top 15% in {user.farm_region || 'Nairobi Region'}</span>
            </p>
          </div>
        </div>
      </div>

      {/* ─── 3. Bottom Row: Pillar Radar + Milestones ───────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Pillar Performance Radar (Spans 6 cols) */}
        <div className="lg:col-span-6 p-6 sm:p-7 rounded-3xl glass-panel border border-[#045D61]/15 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#009924]">
                8-Pillar Framework
              </span>
              <h2 className="font-serif text-lg sm:text-xl font-bold text-slate-900">
                Pillar Performance Comparison
              </h2>
              <p className="text-xs text-slate-500">
                Capability audit score distribution across all 8 domains.
              </p>
            </div>
            <button
              onClick={() => setScreen('screen-assessment-choice')}
              className="text-xs font-bold text-[#045D61] hover:text-[#009924] flex items-center gap-1 transition-colors"
            >
              <span>Audit Pillars</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="h-[340px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} outerRadius="75%">
                <PolarGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                <PolarAngleAxis
                  dataKey="pillar"
                  tick={{ fill: '#334155', fontSize: 11, fontWeight: 600 }}
                />
                <PolarRadiusAxis
                  angle={30}
                  domain={[0, 100]}
                  tick={{ fill: '#94a3b8', fontSize: 10 }}
                  stroke="#cbd5e1"
                />
                <Radar
                  name="Current Score"
                  dataKey="score"
                  stroke="#045D61"
                  fill="#045D61"
                  fillOpacity={0.25}
                  strokeWidth={2}
                  dot={{ r: 3, fill: '#009924', stroke: '#fff', strokeWidth: 1.5 }}
                />
                <Tooltip
                  formatter={(val: any) => [`${val}%`, 'Maturity Score']}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '0.75rem',
                    border: 'none',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Milestones Achieved (Spans 6 cols) - Designed exactly like Dashboard Cards */}
        <div className="lg:col-span-6 p-6 sm:p-7 rounded-3xl glass-panel border border-[#045D61]/15 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#009924]">
                Capability Trajectory
              </span>
              <h2 className="font-serif text-lg sm:text-xl font-bold text-slate-900">
                Recent Milestones Achieved
              </h2>
              <p className="text-xs text-slate-500">
                Verified capability upgrades and system transitions.
              </p>
            </div>
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#009924]/10 text-[#009924] border border-[#009924]/20 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>3 Verified</span>
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3.5 pt-1">
            {/* Milestone 1: Soil Health (Pillar 4) */}
            <motion.div
              whileHover={{ y: -2 }}
              onClick={() => setScreen('screen-journey')}
              className="p-4 rounded-2xl glass-panel border border-slate-200/80 hover:border-slate-300 shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-between border-l-4 border-l-[#2E7D32] group"
            >
              <div className="flex items-start gap-3.5 flex-1 pr-2">
                <div className="w-10 h-10 rounded-xl bg-[#2E7D32]/10 text-[#2E7D32] flex items-center justify-center font-bold flex-shrink-0 group-hover:scale-105 transition-transform mt-0.5">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div className="space-y-1 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#2E7D32]/10 text-[#2E7D32]">
                      Pillar 4: Indigenous &amp; Soil
                    </span>
                    <span className="text-[10px] font-medium text-slate-400">
                      2 weeks ago
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#045D61] transition-colors leading-snug">
                    Soil Health &amp; Carbon Promoted
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                    Moved from Basic to Developing maturity level with certified organic compost practices and biochar enrichment.
                  </p>
                </div>
              </div>

              <div className="flex-shrink-0">
                <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-[#045D61] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </div>
            </motion.div>

            {/* Milestone 2: Smart Sensors (Pillar 1) */}
            <motion.div
              whileHover={{ y: -2 }}
              onClick={() => setScreen('screen-journey')}
              className="p-4 rounded-2xl glass-panel border border-slate-200/80 hover:border-slate-300 shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-between border-l-4 border-l-[#1E88E5] group"
            >
              <div className="flex items-start gap-3.5 flex-1 pr-2">
                <div className="w-10 h-10 rounded-xl bg-[#1E88E5]/10 text-[#1E88E5] flex items-center justify-center font-bold flex-shrink-0 group-hover:scale-105 transition-transform mt-0.5">
                  <Cpu className="w-5 h-5" />
                </div>
                <div className="space-y-1 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#1E88E5]/10 text-[#1E88E5]">
                      Pillar 1: Smart Farming
                    </span>
                    <span className="text-[10px] font-medium text-slate-400">
                      1 month ago
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#045D61] transition-colors leading-snug">
                    Smart Sensors Deployed
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                    Successfully integrated Phase 1 IoT moisture sensors and automated telemetry for precision root-zone irrigation.
                  </p>
                </div>
              </div>

              <div className="flex-shrink-0">
                <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-[#045D61] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </div>
            </motion.div>

            {/* Milestone 3: Offtake Agreement (Pillar 7) */}
            <motion.div
              whileHover={{ y: -2 }}
              onClick={() => setScreen('screen-journey')}
              className="p-4 rounded-2xl glass-panel border border-slate-200/80 hover:border-slate-300 shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-between border-l-4 border-l-[#FB8C00] group"
            >
              <div className="flex items-start gap-3.5 flex-1 pr-2">
                <div className="w-10 h-10 rounded-xl bg-[#FB8C00]/10 text-[#FB8C00] flex items-center justify-center font-bold flex-shrink-0 group-hover:scale-105 transition-transform mt-0.5">
                  <Store className="w-5 h-5" />
                </div>
                <div className="space-y-1 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FB8C00]/10 text-[#FB8C00]">
                      Pillar 7: Market Access
                    </span>
                    <span className="text-[10px] font-medium text-slate-400">
                      2 months ago
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#045D61] transition-colors leading-snug">
                    New Offtake Agreement
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                    Secured guaranteed pricing contract with regional fresh-produce distributor and verified cold-chain protocol.
                  </p>
                </div>
              </div>

              <div className="flex-shrink-0">
                <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-[#045D61] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </div>
            </motion.div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => setScreen('screen-journey')}
              className="w-full py-2.5 rounded-xl bg-[#045D61] hover:bg-[#023c3f] text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <span>Explore Complete Action Roadmap</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
