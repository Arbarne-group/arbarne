import React, { useEffect, useState } from 'react';
import { useAppStore } from '../store/useStore';
import { RadarChart } from '../components/charts/RadarChart';
import { assessmentApi } from '../services/api';
import { DiagnosisReportSection } from '../components/DiagnosisReportSection';
import { motion } from 'framer-motion';
import {
  Download,
  ArrowRight,
  Award,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Zap,
  Droplets,
  Store,
  Cpu,
  Sun,
  ShieldCheck,
  Trees,
  Truck,
  Users,
  Building2,
  Briefcase,
  ExternalLink,
  Flame,
  Gauge,
  Lightbulb,
  LayoutDashboard,
  ArrowLeft,
  Share2,
} from 'lucide-react';
import { PILLAR_BRAND_COLORS, TIER_CLASSIFICATION_COLORS, MATURITY_STATUS_COLORS, AssessmentHistoryItem } from '../types';

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

// Convert a raw pillar score (0–1 or 0–3 scale) to a 0–100 percentage.
const toPct = (raw?: number): number => {
  if (typeof raw !== 'number') return 0;
  return Math.round(raw <= 1.0 ? raw * 100 : (raw / 3) * 100);
};

interface PillarCardMeta {
  id: number;
  number: string;
  name: string;
  shortName: string;
  icon: React.ReactNode;
  defaultScore: number;
  defaultStatus: string;
  statusType: 'error' | 'basic' | 'developing' | 'advanced';
}

const CANONICAL_PILLAR_CARDS: PillarCardMeta[] = [
  {
    id: 1,
    number: '01',
    name: 'Smart Farming & Digital Transformation',
    shortName: 'Smart Farming',
    icon: <Cpu className="w-5 h-5" />,
    defaultScore: 85,
    defaultStatus: 'Advanced',
    statusType: 'advanced',
  },
  {
    id: 2,
    number: '02',
    name: 'Productive Use of Renewable Energy',
    shortName: 'Renewable Energy',
    icon: <Zap className="w-5 h-5" />,
    defaultScore: 45,
    defaultStatus: 'Needs Attention',
    statusType: 'error',
  },
  {
    id: 3,
    number: '03',
    name: 'Food Safety, Quality & Compliance',
    shortName: 'Food Safety',
    icon: <ShieldCheck className="w-5 h-5" />,
    defaultScore: 65,
    defaultStatus: 'Developing',
    statusType: 'developing',
  },
  {
    id: 4,
    number: '04',
    name: 'Indigenous Knowledge & Climate Resilience',
    shortName: 'Climate Resilience',
    icon: <Trees className="w-5 h-5" />,
    defaultScore: 58,
    defaultStatus: 'Developing',
    statusType: 'developing',
  },
  {
    id: 5,
    number: '05',
    name: 'Market Access & Value Chain Integration',
    shortName: 'Market Access',
    icon: <Store className="w-5 h-5" />,
    defaultScore: 68,
    defaultStatus: 'Basic',
    statusType: 'basic',
  },
  {
    id: 6,
    number: '06',
    name: 'Human Capital & Agronomic Skills',
    shortName: 'Human Capital',
    icon: <Users className="w-5 h-5" />,
    defaultScore: 88,
    defaultStatus: 'Advanced',
    statusType: 'advanced',
  },
  {
    id: 7,
    number: '07',
    name: 'Sustainable Business Management',
    shortName: 'Business Mgmt',
    icon: <Building2 className="w-5 h-5" />,
    defaultScore: 75,
    defaultStatus: 'Developing',
    statusType: 'developing',
  },
  {
    id: 8,
    number: '08',
    name: 'Investment Readiness & Enterprise Development',
    shortName: 'Investment Readiness',
    icon: <Briefcase className="w-5 h-5" />,
    defaultScore: 71,
    defaultStatus: 'Developing',
    statusType: 'developing',
  },
];

function pillarName(fallback: string, pillarId?: number | null): string {
  if (pillarId == null) return fallback;
  return PILLAR_BRAND_COLORS[pillarId]?.name || fallback;
}

export const ResultScorecardPage: React.FC = () => {
  const {
    assessment,
    user,
    setScreen,
    showNotification,
    setSelectedPillarDetailId,
    setAssessmentResult,
    openShare,
  } = useAppStore();
  const result = assessment.latestResult;

  const [historyList, setHistoryList] = useState<AssessmentHistoryItem[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // When arriving at "My Results" with no loaded assessment, surface the user's
  // previous assessments: auto-open the most recent submitted one and list the
  // rest so any of them can be selected.
  useEffect(() => {
    if (result) return;
    let cancelled = false;
    setLoadingHistory(true);
    assessmentApi
      .getHistory()
      .then((res) => {
        if (cancelled) return;
        setHistoryList(res);
        const latest = res.find(
          (h) =>
            h.status === 'submitted' ||
            h.status === 'verified' ||
            h.status === 'completed',
        );
        if (latest && !cancelled) {
          return assessmentApi.getAssessment(latest.id).then((full) => {
            if (!cancelled && full) setAssessmentResult(full);
          });
        }
      })
      .catch(() => {
        if (!cancelled) setHistoryList([]);
      })
      .finally(() => {
        if (!cancelled) setLoadingHistory(false);
      });
    return () => {
      cancelled = true;
    };
  }, [result, setAssessmentResult]);

  const openAssessment = (id: string | number) => {
    assessmentApi
      .getAssessment(id)
      .then((full) => {
        if (full) setAssessmentResult(full);
      })
      .catch(() => showNotification('Could not load that assessment', 'error'));
  };


  if (!result) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 py-12">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-[#045D61]/10 text-[#045D61] mx-auto flex items-center justify-center">
            <Award className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Your Past Farm Checks</h2>
          <p className="text-xs text-slate-500">
            Select one of your previous assessments to view its full scorecard and professional diagnosis.
          </p>
        </div>

        {loadingHistory ? (
          <p className="text-center text-xs text-slate-500">Loading your assessments…</p>
        ) : historyList.length === 0 ? (
          <div className="text-center space-y-4">
            <p className="text-xs text-slate-500">You haven't completed a Farm Check yet.</p>
            <button
              onClick={() => setScreen('screen-assessment-choice')}
              className="px-5 py-2.5 rounded-xl bg-[#009924] hover:bg-[#007a1c] text-white font-bold text-xs shadow-md cursor-pointer"
            >
              Start Assessment
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 border border-slate-200/80 rounded-3xl overflow-hidden">
            {historyList.map((item, idx) => {
              const tierVal = item.tier ?? 3;
              const tierMeta = TIER_CLASSIFICATION_COLORS[tierVal] || { hex: '#045D61' };
              const scoreVal =
                typeof item.ffmi_score === 'number'
                  ? item.ffmi_score
                  : typeof item.score === 'number'
                  ? item.score
                  : null;
              const dateStr = item.completed_at || item.submitted_at || item.started_at;
              const date = dateStr
                ? new Date(dateStr).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })
                : 'Recent';
              const isDone =
                item.status === 'submitted' ||
                item.status === 'verified' ||
                item.status === 'completed';
              return (
                <button
                  key={item.id || idx}
                  onClick={() => openAssessment(item.id)}
                  disabled={!isDone}
                  className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm text-slate-900">
                        {scoreVal !== null ? `Farm Score: ${scoreVal.toFixed(2)}` : 'In Progress'}
                      </span>
                      <span
                        className="px-2.5 py-0.5 rounded-full text-white font-extrabold text-[10px]"
                        style={{ backgroundColor: tierMeta.hex }}
                      >
                        Stage {tierVal}
                      </span>
                      {item.scope === 'pillar' && (
                        <span className="px-2 py-0.5 rounded-full bg-[#1E88E5]/10 text-[#1E88E5] text-[10px] font-bold">
                          {item.target_pillar_name || 'Single Pillar'}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      {date} · {isDone ? 'Completed' : 'In Progress'}
                    </p>
                  </div>
                  <span className="text-[#009924] font-bold text-xs">{isDone ? 'View →' : 'Locked'}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  const pdfUrl = `/api/assessments/${result.assessment_id}/pdf`;

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
  const strongestScorePct = toPct(strongestId != null ? result.pillar_scores[strongestId] : undefined);
  const gapName = pillarName('Productive Use of Renewable Energy', gapId);
  const gapScorePct = toPct(gapId != null ? result.pillar_scores[gapId] : undefined);

  const rawScore100 = Math.round((result.ffmi_score / 24) * 100);
  const overallScore = rawScore100;

  const pillars = [1, 2, 3, 4, 5, 6, 7, 8];

  const handleOpenPillar = (pillarId: number) => {
    setSelectedPillarDetailId(pillarId);
    setScreen('screen-pillar-detail');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* ─── 1. Page Header ───────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#004447] mb-1.5 tracking-tight">
            Assessment Results
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Review your farm's performance across the 8 key pillars of the Future Farms Framework.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => openShare(result)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#0E7C4F] hover:bg-[#0a6a43] text-white rounded-xl font-bold text-xs transition-all shadow-md cursor-pointer"
          >
            <Share2 className="w-4 h-4 text-white" />
            <span>Share achievement</span>
          </button>
          <button
            onClick={() => setScreen('screen-dashboard')}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition-all shadow-xs cursor-pointer"
          >
            <LayoutDashboard className="w-4 h-4 text-slate-600" />
            <span>Dashboard</span>
          </button>
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleDownloadPdf}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#004447] hover:bg-[#023335] text-white rounded-xl font-bold text-xs transition-all shadow-md cursor-pointer"
          >
            <Download className="w-4 h-4 text-white" />
            <span>Download Report</span>
          </a>
        </div>
      </div>

      {/* ─── 1b. Professional Diagnosis (combined assessment + farmer profile) ── */}
      <DiagnosisReportSection assessmentId={result.assessment_id} />

      {/* ─── 2. Top Row: Overall Score & Priority Improvements ────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Overall Farm Score Card (1 col) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="col-span-1 bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow"
        >
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-4 block">
              {Object.keys(result.pillar_scores ?? {}).length === 1
                ? `${pillarName('Pillar', Number(Object.keys(result.pillar_scores)[0]))} Score`
                : 'Overall Farm Score'}
            </span>
            <div className="flex items-end gap-2 mb-4">
              <span className="font-serif text-5xl sm:text-6xl font-bold text-[#004447] leading-none">
                {Object.keys(result.pillar_scores ?? {}).length === 1
                  ? toPct(result.pillar_scores[Number(Object.keys(result.pillar_scores)[0])])
                  : overallScore}
              </span>
              <span className="text-base text-slate-400 font-medium mb-1">/100</span>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-600 font-medium truncate max-w-[170px]">
                Maturity:{' '}
                <strong className="text-[#004447]">
                  {Object.keys(result.pillar_scores ?? {}).length === 1
                    ? result.pillar_status?.[Number(Object.keys(result.pillar_scores)[0])] ||
                      result.tier_classification ||
                      'Verified'
                    : result.tier_classification || 'Developing'}
                </strong>
              </span>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-50 text-[#007519] border border-emerald-200 shrink-0">
                {Object.keys(result.pillar_scores ?? {}).length === 1
                  ? `Pillar ${Object.keys(result.pillar_scores)[0]} Verified`
                  : `Tier ${result.tier} Verified`}
              </span>
            </div>

            {/* Multi-Segment Progress Track */}
            {(() => {
              const displayVal =
                Object.keys(result.pillar_scores ?? {}).length === 1
                  ? toPct(result.pillar_scores[Number(Object.keys(result.pillar_scores)[0])])
                  : overallScore;
              return (
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex relative">
                  <div
                    className="h-full bg-gradient-to-r from-[#ba1a1a] via-[#FB8C00] to-[#009924] rounded-full transition-all duration-700"
                    style={{ width: `${displayVal}%` }}
                  />
                </div>
              );
            })()}

            <div className="flex justify-between font-bold text-[10px] text-slate-400 uppercase tracking-wider">
              <span>Basic</span>
              <span className="text-[#009924]">Developing</span>
              <span>Advanced</span>
            </div>
          </div>
        </motion.div>

        {/* Priority Improvements Card (2 cols) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="col-span-1 lg:col-span-2 bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">
                Priority Improvements
              </span>
              <span className="text-xs font-semibold text-slate-500">
                Top Areas for Highest Yield ROI
              </span>
            </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Gap 1: Energy Access */}
                  <div
                    onClick={() => handleOpenPillar(2)}
                    className="p-4 bg-[#ffdad6]/30 border border-[#ffdad6] rounded-2xl flex flex-col justify-between hover:shadow-sm transition-all cursor-pointer group"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="w-5 h-5 text-[#ba1a1a]" />
                        <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#ba1a1a] transition-colors">
                          Energy Access
                        </h4>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed mb-3">
                        Significant gaps in renewable energy &amp; solar pump utilization.
                      </p>
                    </div>
                    <span className="inline-block px-2 py-1 bg-[#ffdad6] text-[#93000a] text-[10px] font-bold rounded-lg self-start">
                      Needs Attention • Score: {toPct(result.pillar_scores?.[2])}
                    </span>
                  </div>

                  {/* Gap 2: Water Mgmt & Climate Swales */}
                  <div
                    onClick={() => handleOpenPillar(4)}
                    className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col justify-between hover:shadow-sm transition-all cursor-pointer group"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Droplets className="w-5 h-5 text-[#004447]" />
                        <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#004447] transition-colors">
                          Water &amp; Swales
                        </h4>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed mb-3">
                        Irrigation efficiency &amp; rainwater catchment below optimal levels.
                      </p>
                    </div>
                    <span className="inline-block px-2 py-1 bg-slate-200/70 text-slate-700 text-[10px] font-bold rounded-lg self-start">
                      Basic • Score: {toPct(result.pillar_scores?.[4])}
                    </span>
                  </div>

                  {/* Gap 3: Market Access & Forward Contracts */}
                  <div
                    onClick={() => handleOpenPillar(5)}
                    className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col justify-between hover:shadow-sm transition-all cursor-pointer group"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Store className="w-5 h-5 text-[#004447]" />
                        <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#004447] transition-colors">
                          Market Access
                        </h4>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed mb-3">
                        Limited direct-to-market and export off-take channels established.
                      </p>
                    </div>
                    <span className="inline-block px-2 py-1 bg-slate-200/70 text-slate-700 text-[10px] font-bold rounded-lg self-start">
                      Basic • Score: {toPct(result.pillar_scores?.[5])}
                    </span>
                  </div>
                </div>
          </div>
        </motion.div>
      </div>

      {/* ─── 3. Pillar Performance Details (8-Pillar Bento Grid) ──────── */}
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#004447]">
              Pillar Performance Details
            </h3>
            <p className="text-xs text-slate-500">
              Select any pillar to inspect capabilities breakdown, recommendations, and vetted providers.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {CANONICAL_PILLAR_CARDS.map((p) => {
            const dynamicScore = toPct(result.pillar_scores?.[p.id]);
            const isAttention = dynamicScore < 50;
            const isAdvanced = dynamicScore >= 80;
            const isDeveloping = dynamicScore >= 60 && dynamicScore < 80;

            const statusText = isAttention
              ? 'Needs Attention'
              : isAdvanced
              ? 'Advanced'
              : isDeveloping
              ? 'Developing'
              : 'Basic';

            const statusBadgeCls = isAttention
              ? 'bg-[#ffdad6] text-[#93000a] border border-[#ffdad6]'
              : isAdvanced
              ? 'bg-emerald-50 text-[#007519] border border-emerald-200'
              : isDeveloping
              ? 'bg-[#004447]/10 text-[#004447] border border-[#004447]/20'
              : 'bg-slate-100 text-slate-700 border border-slate-200';

            const barColor = isAttention
              ? 'bg-[#ba1a1a]'
              : isAdvanced
              ? 'bg-[#009924]'
              : isDeveloping
              ? 'bg-[#004447]'
              : 'bg-[#8dd2d6]';

            const iconBg = isAttention
              ? 'bg-[#ffdad6] text-[#ba1a1a]'
              : isAdvanced
              ? 'bg-emerald-100 text-[#007519]'
              : 'bg-slate-100 text-[#004447]';

            return (
              <motion.div
                key={p.id}
                whileHover={{ y: -3 }}
                className={`bg-white border rounded-3xl p-5 hover:shadow-lg transition-all flex flex-col justify-between h-full group ${
                  isAttention ? 'border-[#ffdad6]' : 'border-slate-200/90'
                }`}
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${iconBg}`}>
                      {p.icon}
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusBadgeCls}`}>
                      {statusText}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#004447] transition-colors mb-1 line-clamp-1">
                    {p.name}
                  </h4>

                  <div className="flex items-baseline gap-1 mb-4">
                    <span className={`font-serif text-2xl font-bold leading-none ${isAttention ? 'text-[#ba1a1a]' : 'text-[#004447]'}`}>
                      {dynamicScore}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">/100</span>
                  </div>
                </div>

                <div className="space-y-3 mt-auto pt-2">
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full ${barColor} rounded-full`} style={{ width: `${dynamicScore}%` }} />
                  </div>

                  <button
                    onClick={() => handleOpenPillar(p.id)}
                    className={`w-full py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      isAttention
                        ? 'bg-[#ba1a1a] hover:bg-[#93000a] text-white shadow-xs'
                        : 'border border-[#004447] text-[#004447] hover:bg-[#004447] hover:text-white'
                    }`}
                  >
                    <span>View Detailed Insights</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ─── 4. Radar Chart Spider Profile & Gap Insights ──────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
        <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg font-bold text-[#004447]">
              8-Pillar Spider Profile (FFMI Benchmark)
            </h3>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
              Full Baseline
            </span>
          </div>
          <RadarChart pillarScores={result.pillar_scores} />
        </div>

        <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-bold text-[#004447]">
              Transformation Strengths &amp; Gaps
            </h3>

            <div className="space-y-3">
              {/* Strength */}
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#009924] shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-bold text-slate-900">
                    Strongest Capability Pillar
                  </span>
                   <p className="text-xs text-slate-700 mt-0.5">
                     {strongestName} (Score: {strongestScorePct}%)
                   </p>
                </div>
              </div>

              {/* Gap */}
              <div className="p-4 rounded-2xl bg-[#ffdad6]/40 border border-[#ffdad6] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-[#ba1a1a] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold text-slate-900">
                      Priority Improvement Area
                    </span>
                    <p className="text-xs text-slate-700 mt-0.5">
                       {gapName} (Score: {gapScorePct}%)
                     </p>
                  </div>
                </div>
                <button
                  onClick={() => handleOpenPillar(gapId || 2)}
                  className="px-3.5 py-1.5 rounded-lg bg-[#ba1a1a] hover:bg-[#93000a] text-white text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer"
                >
                  Inspect Pillar 0{gapId || 2} Action Plan ➔
                </button>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => setScreen('screen-simulator')}
              className="w-full py-3 rounded-2xl bg-[#004447] hover:bg-[#023c3f] text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#FFD700]" />
              <span>Simulate Next Tier Advancement &amp; ROI</span>
            </button>
          </div>
        </div>
      </div>

      {/* ─── 5. Per-Capability Guidance Breakdown ───────────────────────── */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#009924]">
              Per-Capability Guidance
            </span>
            <h3 className="font-serif text-xl font-bold text-[#004447]">
              Pillar Capability Maturity
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              Each pillar is assessed across five capabilities. Click any pillar to view its actionable recommendations.
            </p>
          </div>
          <button
            onClick={() => handleOpenPillar(2)}
            className="px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#009924] border border-emerald-200 text-xs font-bold transition-all shrink-0 cursor-pointer"
          >
            Open Pillar 02 Detail View ➔
          </button>
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
                className={`p-5 rounded-2xl bg-white border ${pBrand.borderLight} shadow-xs space-y-3`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${pBrand.bgLight} ${pBrand.borderLight} ${pBrand.textClass}`}
                    >
                      {pBrand.name}
                    </span>
                    {band && (
                      <span
                        className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full text-white shadow-xs"
                        style={{ backgroundColor: bandColor }}
                      >
                        {band}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => handleOpenPillar(pid)}
                    className="text-xs font-bold text-[#004447] hover:text-[#009924] flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <span>View Pillar Detail &amp; Action Plan</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
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
                        className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/70 space-y-2"
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

      {/* ─── 6. Structured Action Roadmap ─────────────────────────────── */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-6">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#009924]">
            5-Field Empirical Action Plan
          </span>
          <h3 className="font-serif text-xl font-bold text-[#004447]">
            Recommended Transformation Steps
          </h3>
          <p className="text-xs text-slate-600 mt-1">
            Prioritized actions derived from your assessment diagnostic to propel your farm enterprise to the next maturity tier.
          </p>
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
                className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200/80 shadow-xs space-y-3 hover:bg-white hover:border-[#009924] transition-all"
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
                    className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${prio.cls}`}
                  >
                    {prio.label} PRIORITY
                  </span>
                </div>

                <p className="text-sm font-bold text-slate-900">{rec.recommended_action}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600 pt-1">
                  {rec.why_it_matters && (
                    <div>
                      <span className="font-bold text-slate-900">Why it matters: </span>
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
                    <div className="text-[#004447]">
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
