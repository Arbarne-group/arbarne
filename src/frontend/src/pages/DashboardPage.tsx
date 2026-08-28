import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../store/useStore';
import { portalApi, assessmentApi, adaptGamification } from '../services/api';
import { AssessmentHistoryItem } from '../types';
import { RadarChart } from '../components/charts/RadarChart';
import {
  ArrowRight,
  Award,
  AlertTriangle,
  ClipboardCheck,
  Layers,
  GraduationCap,
  Lightbulb,
  TrendingUp,
  ChevronRight,
  Sparkles,
  Zap,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  CreditCard,
  Users,
  Settings,
  Shield,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';

interface PillarVisualMeta {
  id: number;
  number: string;
  name: string;
  shortName: string;
  borderColor: string;
  accentBg: string;
  accentText: string;
  status: string;
  statusClass: string;
  defaultScore: number;
}

const PILLARS_META: PillarVisualMeta[] = [
  {
    id: 1,
    number: 'Pillar 01',
    name: 'Smart Farming & Digital Transformation',
    shortName: 'Smart Farming',
    borderColor: 'border-l-[#1E88E5]',
    accentBg: 'bg-[#1E88E5]/10',
    accentText: 'text-[#1E88E5]',
    status: 'Developing',
    statusClass: 'bg-[#7CB342]/15 text-[#558B2F]',
    defaultScore: 58,
  },
  {
    id: 2,
    number: 'Pillar 02',
    name: 'Productive Use of Renewable Energy',
    shortName: 'Renewable Energy',
    borderColor: 'border-l-[#FDD835]',
    accentBg: 'bg-[#FDD835]/15',
    accentText: 'text-[#C79100]',
    status: 'Priority Gap',
    statusClass: 'bg-[#D32F2F]/10 text-[#D32F2F]',
    defaultScore: 42,
  },
  {
    id: 3,
    number: 'Pillar 03',
    name: 'Food Safety, Quality & Compliance',
    shortName: 'Food Safety & QA',
    borderColor: 'border-l-[#43A047]',
    accentBg: 'bg-[#43A047]/10',
    accentText: 'text-[#2E7D32]',
    status: 'Established',
    statusClass: 'bg-[#388E3C]/15 text-[#1B5E20]',
    defaultScore: 74,
  },
  {
    id: 4,
    number: 'Pillar 04',
    name: 'Indigenous Knowledge & Climate Resilience',
    shortName: 'Climate Resilience',
    borderColor: 'border-l-[#2E7D32]',
    accentBg: 'bg-[#2E7D32]/10',
    accentText: 'text-[#1B5E20]',
    status: 'Developing',
    statusClass: 'bg-[#7CB342]/15 text-[#558B2F]',
    defaultScore: 61,
  },
  {
    id: 5,
    number: 'Pillar 05',
    name: 'Farm Business Performance & Growth',
    shortName: 'Business Performance',
    borderColor: 'border-l-[#8E24AA]',
    accentBg: 'bg-[#8E24AA]/10',
    accentText: 'text-[#6A1B9A]',
    status: 'Basic',
    statusClass: 'bg-[#FBC02D]/20 text-[#B78103]',
    defaultScore: 49,
  },
  {
    id: 6,
    number: 'Pillar 06',
    name: 'Human Capital, Leadership & Farm Operations',
    shortName: 'Human Capital & Ops',
    borderColor: 'border-l-[#3949AB]',
    accentBg: 'bg-[#3949AB]/10',
    accentText: 'text-[#283593]',
    status: 'Established',
    statusClass: 'bg-[#388E3C]/15 text-[#1B5E20]',
    defaultScore: 68,
  },
  {
    id: 7,
    number: 'Pillar 07',
    name: 'Market Access, Customer Value & Competitiveness',
    shortName: 'Market Access',
    borderColor: 'border-l-[#FB8C00]',
    accentBg: 'bg-[#FB8C00]/10',
    accentText: 'text-[#E65100]',
    status: 'Advanced',
    statusClass: 'bg-[#009924]/15 text-[#007a1c]',
    defaultScore: 82,
  },
  {
    id: 8,
    number: 'Pillar 08',
    name: 'Investment Readiness & Enterprise Development',
    shortName: 'Investment Readiness',
    borderColor: 'border-l-[#683C21]',
    accentBg: 'bg-[#683C21]/10',
    accentText: 'text-[#683C21]',
    status: 'Developing',
    statusClass: 'bg-[#7CB342]/15 text-[#558B2F]',
    defaultScore: 54,
  },
];

export const DashboardPage: React.FC = () => {
  const {
    user,
    setUser,
    gamification,
    setGamification,
    setScreen,
    assessment,
    setAssessmentResult,
    dashboardSummary,
    setDashboardSummary,
  } = useAppStore();

  const [historyList, setHistoryList] = useState<AssessmentHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch live dashboard metrics, assessment history, and gamification on mount
  useEffect(() => {
    let isMounted = true;
    const fetchLiveData = async () => {
      try {
        setLoading(true);
        const [summaryRes, histRes, gamRes] = await Promise.allSettled([
          portalApi.getDashboardSummary(),
          assessmentApi.getHistory(),
          portalApi.getGamification(),
        ]);

        if (summaryRes.status === 'fulfilled' && summaryRes.value) {
          setDashboardSummary(summaryRes.value);
          if (summaryRes.value.ffmi_score !== null && summaryRes.value.ffmi_score !== undefined) {
            setUser({
              ffmi_score: summaryRes.value.ffmi_score,
              tier: summaryRes.value.tier || 3,
              tier_name: summaryRes.value.tier_name || 'Structured Farm',
            });
          }
        }

        if (histRes.status === 'fulfilled' && histRes.value && histRes.value.length > 0) {
          setHistoryList(histRes.value);
          // If latestResult in store is null, fetch the full assessment details for the latest
          if (!assessment.latestResult && histRes.value[0]?.id) {
            try {
              const fullDetails = await assessmentApi.getAssessment(histRes.value[0].id);
              if (fullDetails && isMounted) {
                setAssessmentResult(fullDetails);
              }
            } catch {
              // Graceful fallback
            }
          }
        }

        if (gamRes.status === 'fulfilled' && gamRes.value) {
          setGamification(adaptGamification(gamRes.value));
        }
      } catch (err) {
        console.warn('Live dashboard fetch notice:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchLiveData();
    return () => {
      isMounted = false;
    };
  }, []);

  const latest = assessment.latestResult;
  const latestHistory = historyList.length > 0 ? historyList[0] : null;

  const ffmiScore =
    dashboardSummary?.ffmi_score ??
    latest?.ffmi_score ??
    latestHistory?.ffmi_score ??
    user.ffmi_score ??
    0;

  const tier =
    dashboardSummary?.tier ??
    latest?.tier ??
    latestHistory?.tier ??
    user.tier ??
    1;

  const tierName =
    dashboardSummary?.tier_name ??
    latest?.tier_classification ??
    latestHistory?.tier_classification ??
    user.tier_name ??
    (ffmiScore > 0 ? 'Informal Farm' : 'Not Assessed');

  const dividendKes = latest?.economic_dividend?.dividend_gain_kes ?? (ffmiScore > 0 ? Math.round(ffmiScore * 18000) : 0);

  // Active in-progress draft (user is currently taking a questionnaire)
  const isDraftInProgress =
    assessment.id !== null &&
    assessment.questions.length > 0 &&
    Object.keys(assessment.answers).length < assessment.questions.length;

  const hasCompletedAssessment = !!latest || !!dashboardSummary?.latest_assessment_id || historyList.length > 0;

  // Active pillar scores from live backend data
  const activePillarScores: Record<string | number, number> = (latest?.pillar_scores || latestHistory?.pillar_scores || {}) as Record<string | number, number>;

  const nonZeroPillars = Object.values(activePillarScores).filter(
    (v) => typeof v === 'number' && v > 0
  ).length;

  // ── Compute Exact Live Metrics for Metric Cards 1 & 2
  let auditBadgeText = 'Not Started';
  let auditBadgeClass = 'bg-slate-100 text-slate-600';
  let totalQuestions = 200;
  let answeredCount = 0;
  let progressPercent = 0;

  let coverageBadgeText = '0 / 8 Pillars';
  let coverageBadgeClass = 'bg-slate-100 text-slate-600';
  let assessedPillarsCount = 0;
  let totalPillarsInScope = 8;

  if (isDraftInProgress) {
    totalQuestions = assessment.questions.length || (assessment.scope === 'pillar' ? 25 : 200);
    answeredCount = Object.keys(assessment.answers).length;
    progressPercent = totalQuestions > 0 ? Math.min(100, Math.round((answeredCount / totalQuestions) * 100)) : 0;
    auditBadgeText = assessment.scope === 'pillar' ? 'Pillar Draft' : 'Active Draft';
    auditBadgeClass = 'bg-[#FB8C00]/15 text-[#E65100] font-bold';

    if (assessment.scope === 'pillar') {
      totalPillarsInScope = 1;
      assessedPillarsCount = answeredCount > 0 ? 1 : 0;
      coverageBadgeText = `Pillar ${assessment.targetPillarId || '1'} Scope`;
      coverageBadgeClass = 'bg-[#1565C0]/10 text-[#1565C0] font-bold';
    } else {
      totalPillarsInScope = 8;
      assessedPillarsCount = Math.min(8, Math.ceil((answeredCount / 200) * 8));
      coverageBadgeText = `${assessedPillarsCount} of 8 In Progress`;
      coverageBadgeClass = 'bg-[#1565C0]/10 text-[#1565C0] font-bold';
    }
  } else if (hasCompletedAssessment) {
    const isPillarScope =
      latestHistory?.scope === 'pillar' ||
      (latestHistory?.target_pillar_id !== undefined && latestHistory?.target_pillar_id !== null && !latest?.pillar_scores);

    if (isPillarScope) {
      totalQuestions = 25;
      answeredCount = 25;
      progressPercent = 100;
      auditBadgeText = `Pillar ${latestHistory?.target_pillar_id || ''} Verified`;
      auditBadgeClass = 'bg-[#009924]/10 text-[#009924] font-bold';

      totalPillarsInScope = 8;
      assessedPillarsCount = 1;
      coverageBadgeText = 'Single Pillar';
      coverageBadgeClass = 'bg-[#1565C0]/10 text-[#1565C0] font-bold';
    } else {
      totalQuestions = 200;
      answeredCount = 200;
      progressPercent = 100;
      auditBadgeText = 'Verified';
      auditBadgeClass = 'bg-[#009924]/10 text-[#009924] font-bold';

      totalPillarsInScope = 8;
      assessedPillarsCount = nonZeroPillars > 0 ? nonZeroPillars : 8;
      coverageBadgeText = 'Full Coverage';
      coverageBadgeClass = 'bg-[#1565C0]/10 text-[#1565C0] font-bold';
    }
  } else {
    // Brand new user with 0 assessments
    totalQuestions = 200;
    answeredCount = 0;
    progressPercent = 0;
    auditBadgeText = 'Not Started';
    auditBadgeClass = 'bg-slate-100 text-slate-600 font-bold';

    totalPillarsInScope = 8;
    assessedPillarsCount = 0;
    coverageBadgeText = '0% Covered';
    coverageBadgeClass = 'bg-slate-100 text-slate-600 font-bold';
  }

  const completedCoursesCount = dashboardSummary?.completed_courses_count ?? 0;
  const totalRecommendationsCount =
    dashboardSummary?.gaps_count ??
    (latest?.recommendations?.length || 0);

  const nextTier = Math.min(5, tier + 1);
  const nextThresholds: Record<number, number> = { 2: 5.0, 3: 10.0, 4: 16.0, 5: 21.0 };
  const targetScore = nextThresholds[nextTier] || 24.0;
  const scoreGap = Math.max(0, targetScore - ffmiScore).toFixed(2);

  const handlePillarClick = (_pillarId: number) => {
    setScreen('screen-assessment-choice');
  };

  return (
    <div className="space-y-8">
      {/* ─── 1. Hero Card (Preserved with Animated Logo & Watermark) ─────── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#023c3f] via-[#045D61] to-[#012527] border border-[#045D61]/30 p-6 sm:p-10 shadow-2xl text-white group">
        {/* Animated Background Watermark Logo */}
        <motion.img
          src="/assets/arbarne-emblem-white.png"
          alt=""
          className="absolute right-[-2%] top-1/2 -translate-y-1/2 h-[95%] max-h-[290px] w-auto pointer-events-none select-none z-0 transition-opacity duration-500 group-hover:opacity-20"
          animate={{
            opacity: [0.07, 0.16, 0.07],
            scale: [1, 1.04, 1],
            y: ['-50%', '-52%', '-50%'],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          aria-hidden="true"
        />

        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-[#009924]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4 sm:gap-5">
            {/* Animated Floating Arbarne Emblem Badge */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
              whileHover={{ scale: 1.08, rotate: 2 }}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-[#009924]/30 to-[#045D61] border border-[#009924]/40 p-3 shadow-2xl flex items-center justify-center flex-shrink-0 backdrop-blur-md glow-cyan relative cursor-pointer group/badge"
              title="Future Farms Framework Emblem"
            >
              <img
                src="/assets/arbarne-emblem-white.png"
                alt="FFF"
                className="h-full w-auto object-contain drop-shadow"
              />
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#009924] animate-ping opacity-75" />
            </motion.div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="h-0.5 w-5 bg-[#009924] rounded-full" />
                <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest text-[#009924]">
                  Future Farms Framework • Live Farm Intelligence
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-serif font-bold text-white tracking-tight">
                Karibu, {user.name ? user.name.split(' ')[0] : 'Farmer'}.
                <br />
                <span className="text-[#FFD700] italic">The Great Transition.</span>
              </h1>
              <p className="text-xs sm:text-sm text-white/80 flex flex-wrap items-center gap-2 pt-0.5">
                <span>📍 {user.farm_name || 'My Farm'}</span>
                <span>•</span>
                <span>{user.farm_region || 'Western Kenya'}</span>
                <span>•</span>
                <span>{user.farm_size_acres || 5} Acres</span>
              </p>
            </div>
          </div>

          {/* KPI Snapshot Pills */}
          <div className="flex flex-wrap items-center gap-3">
            <motion.div
              className="px-5 py-3 rounded-2xl bg-[#1E88E5]/20 border border-[#1E88E5]/40 backdrop-blur-md cursor-default"
              whileHover={{ y: -4, scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#90CAF9]">
                Maturity Status
              </div>
              <div className="text-base font-bold text-white">
                Tier {tier} {tierName.split(' ')[0]}
              </div>
            </motion.div>

            <motion.div
              className="px-5 py-3 rounded-2xl bg-[#FFD700]/15 border border-[#FFD700]/40 backdrop-blur-md cursor-default"
              whileHover={{ y: -4, scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#FFD700]">
                FFMI Maturity Index
              </div>
              <div className="text-xl font-extrabold text-white">
                {ffmiScore.toFixed(2)}{' '}
                <span className="text-xs font-normal text-white/70">/ 24.00</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Action CTAs */}
        <div className="relative z-10 flex flex-wrap gap-3 mt-6 pt-6 border-t border-white/10">
          <button
            onClick={() => setScreen('screen-assessment-choice')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#009924] hover:bg-[#007a1c] text-white font-bold text-xs shadow-lg shadow-[#009924]/30 transition-all hover:scale-105"
          >
            <span>Start Capability Assessment</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => setScreen('screen-journey')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/15 transition-all"
          >
            <Award className="w-4 h-4 text-[#FFD700]" />
            <span>Transformation Roadmap &amp; Quests</span>
          </button>
        </div>
      </div>

      {/* ─── 2. Key Metrics Row ──────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Assessment Progress */}
        <motion.div
          whileHover={{ y: -3 }}
          onClick={() => setScreen('screen-assessment-choice')}
          className="p-5 rounded-2xl glass-panel border border-[#045D61]/15 hover:border-[#009924]/50 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#009924]/10 text-[#009924] flex items-center justify-center group-hover:scale-110 transition-transform">
              <ClipboardCheck className="w-5 h-5" />
            </div>
            <span className={`text-[10px] px-2 py-0.5 rounded-full ${auditBadgeClass}`}>
              {auditBadgeText}
            </span>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 mb-1">Assessment Progress</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-bold text-slate-900">{progressPercent}%</span>
              <span className="text-xs font-medium text-slate-500">
                ({answeredCount}/{totalQuestions})
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
              <div
                className="h-full bg-[#009924] rounded-full transition-all duration-700"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </motion.div>

        {/* Metric 2: Pillars Assessed */}
        <motion.div
          whileHover={{ y: -3 }}
          onClick={() => setScreen('screen-assessment-choice')}
          className="p-5 rounded-2xl glass-panel border border-[#045D61]/15 hover:border-[#1565C0]/50 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#1565C0]/10 text-[#1565C0] flex items-center justify-center group-hover:scale-110 transition-transform">
              <Layers className="w-5 h-5" />
            </div>
            <span className={`text-[10px] px-2 py-0.5 rounded-full ${coverageBadgeClass}`}>
              {coverageBadgeText}
            </span>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 mb-1">Pillars Assessed</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-bold text-slate-900">{assessedPillarsCount}</span>
              <span className="text-xs font-medium text-slate-500">/ {totalPillarsInScope} Pillars</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
              <div
                className="h-full bg-[#1565C0] rounded-full transition-all duration-700"
                style={{ width: `${(assessedPillarsCount / totalPillarsInScope) * 100}%` }}
              />
            </div>
          </div>
        </motion.div>

        {/* Metric 3: Learning Progress */}
        <motion.div
          whileHover={{ y: -3 }}
          onClick={() => setScreen('screen-learning')}
          className="p-5 rounded-2xl glass-panel border border-[#045D61]/15 hover:border-[#1E88E5]/50 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#1E88E5]/10 text-[#1E88E5] flex items-center justify-center group-hover:scale-110 transition-transform">
              <GraduationCap className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#1E88E5]/10 text-[#1E88E5]">
              Academy
            </span>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 mb-1">Learning Progress</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-bold text-slate-900">
                {Math.round((completedCoursesCount / 8) * 100)}%
              </span>
              <span className="text-xs font-medium text-slate-500">
                ({completedCoursesCount}/8 Modules)
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
              <div
                className="h-full bg-[#1E88E5] rounded-full transition-all duration-700"
                style={{ width: `${Math.round((completedCoursesCount / 8) * 100)}%` }}
              />
            </div>
          </div>
        </motion.div>

        {/* Metric 4: Recommendations */}
        <motion.div
          whileHover={{ y: -3 }}
          onClick={() => setScreen('screen-journey')}
          className="p-5 rounded-2xl glass-panel border border-[#045D61]/15 hover:border-[#EF6C00]/50 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#EF6C00]/10 text-[#EF6C00] flex items-center justify-center group-hover:scale-110 transition-transform">
              <Lightbulb className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EF6C00]/10 text-[#EF6C00]">
              Action Plan
            </span>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 mb-1">Recommendations</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-bold text-slate-900">
                {totalRecommendationsCount}
              </span>
              <span className="text-xs font-medium text-slate-500">Action Items</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
              <div
                className="h-full bg-[#EF6C00] rounded-full"
                style={{ width: `${Math.min(100, (totalRecommendationsCount / 10) * 100)}%` }}
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* ─── 3. Farm Maturity Pathway Track ─────────────────────────────── */}
      <div className="p-6 rounded-3xl glass-panel border border-[#045D61]/15 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#009924]">
              Five-Tier Maturity Continuum
            </span>
            <h3 className="text-base font-serif font-bold text-slate-900">
              Farm Systems Transformation Stage
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-[#009924]/10 text-[#009924] rounded-full text-xs font-bold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              Tier {tier}: {tierName}
            </span>
          </div>
        </div>

        {/* Multi-tier horizontal milestone spectrum */}
        <div className="space-y-2 pt-2">
          <div className="flex justify-between text-[11px] font-semibold text-slate-500">
            <span className={tier === 1 ? 'font-bold text-[#8E99A2] flex items-center gap-1' : ''}>
              1. Informal {tier === 1 && '📍'}
            </span>
            <span className={tier === 2 ? 'font-bold text-[#FB8C00] flex items-center gap-1' : ''}>
              2. Emerging {tier === 2 && '📍'}
            </span>
            <span className={tier === 3 ? 'font-bold text-[#009924] flex items-center gap-1' : ''}>
              3. Structured {tier === 3 && '📍'}
            </span>
            <span className={tier === 4 ? 'font-bold text-[#045D61] flex items-center gap-1' : ''}>
              4. Investment Ready {tier === 4 && '📍'}
            </span>
            <span className={tier === 5 ? 'font-bold text-[#B88917] flex items-center gap-1' : ''}>
              5. Future Ready {tier === 5 && '📍'}
            </span>
          </div>

          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex relative">
            <div className={`h-full border-r border-white/60 ${tier >= 1 ? 'bg-[#8E99A2]' : 'bg-slate-200'} w-1/5 relative`} title="Tier 1: Informal Farm">
              {tier === 1 && <div className="absolute right-1 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white rounded-full shadow-md animate-pulse" />}
            </div>
            <div className={`h-full border-r border-white/60 ${tier >= 2 ? 'bg-[#FB8C00]' : 'bg-slate-200'} w-1/5 relative`} title="Tier 2: Emerging Agribusiness">
              {tier === 2 && <div className="absolute right-1 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white rounded-full shadow-md animate-pulse" />}
            </div>
            <div className={`h-full border-r border-white/60 ${tier >= 3 ? 'bg-[#009924]' : 'bg-slate-200'} w-1/5 relative`} title="Tier 3: Structured Farm">
              {tier === 3 && <div className="absolute right-1 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white rounded-full shadow-md animate-pulse" />}
            </div>
            <div className={`h-full border-r border-white/60 ${tier >= 4 ? 'bg-[#045D61]' : 'bg-slate-200'} w-1/5 relative`} title="Tier 4: Investment Ready">
              {tier === 4 && <div className="absolute right-1 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white rounded-full shadow-md animate-pulse" />}
            </div>
            <div className={`h-full ${tier >= 5 ? 'bg-[#FFD700]' : 'bg-slate-200'} w-1/5 relative`} title="Tier 5: Future Ready Farm">
              {tier === 5 && <div className="absolute right-1 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white rounded-full shadow-md animate-pulse" />}
            </div>
          </div>

          <p className="text-xs text-slate-500 flex items-center justify-between pt-1">
            <span>Score: <strong className="text-slate-800">{ffmiScore.toFixed(2)} / 24.00 pts</strong></span>
            {tier < 5 ? (
              <span>Next threshold: <strong className="text-[#045D61]">Tier {nextTier} ({targetScore.toFixed(2)} pts)</strong> • <span className="text-[#009924] font-semibold">+{scoreGap} pts to go</span></span>
            ) : (
              <span className="text-[#B88917] font-bold">✨ Top FFF Enterprise Maturity Achieved</span>
            )}
          </p>
        </div>
      </div>

      {/* ─── 4. Active Quest & Gamification Banner ──────────────────────── */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#045D61] to-[#023c3f] border border-[#009924]/30 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#FFD700]/20 border border-[#FFD700]/30 flex items-center justify-center text-xl text-[#FFD700]">
            🏆
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold text-[#FFD700] uppercase tracking-wider">
                Level {gamification.level}: {gamification.level_name}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#EF6C00]/20 border border-[#FFD700]/30 text-[#FFD700] font-bold">
                {gamification.streak_days}-Day Streak 🔥
              </span>
            </div>
            <p className="text-xs text-white/90 mt-0.5">
              Complete the <span className="font-semibold text-[#FFD700]">Smart Farming Baseline Quest</span> to unlock 150 XP and the Digital Pioneer Badge.
            </p>
          </div>
        </div>
        <button
          onClick={() => setScreen('screen-journey')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#EF6C00] hover:bg-[#d85f00] text-white text-xs font-bold shadow-md transition-all whitespace-nowrap"
        >
          <span>Open Quests &amp; Badges</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* ─── 5. Main Dashboard Split: 8 Pillars Grid + Recommended Steps ──── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: 8 Pillars Grid (8 Cols) */}
        <div className="lg:col-span-8 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#009924]">
                Domain Model
              </span>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-slate-900">
                Your Farm's 8 Pillars
              </h3>
              <p className="text-xs text-slate-500">
                Core dimensions of capability, maturity, and systematic transformation.
              </p>
            </div>
            <button
              onClick={() => setScreen('screen-assessment-choice')}
              className="text-xs font-bold text-[#045D61] hover:text-[#009924] flex items-center gap-1 transition-colors"
            >
              <span>View All</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PILLARS_META.map((p) => {
              const rawScore = activePillarScores[p.id] ?? activePillarScores[String(p.id)];
              const hasScore = rawScore !== undefined && rawScore !== null;
              const displayScore = hasScore
                ? Math.round(rawScore <= 1.0 ? rawScore * 100 : (rawScore / 3) * 100)
                : 0;

              let dynamicStatus = hasCompletedAssessment ? 'Not in Scope' : 'Not Assessed';
              let dynamicStatusClass = 'bg-slate-100 text-slate-500';

              if (hasScore) {
                if (displayScore >= 80) {
                  dynamicStatus = 'Strategic Advantage';
                  dynamicStatusClass = 'bg-[#009924]/15 text-[#007a1c]';
                } else if (displayScore >= 60) {
                  dynamicStatus = 'Core Strength';
                  dynamicStatusClass = 'bg-[#388E3C]/15 text-[#1B5E20]';
                } else if (displayScore >= 40) {
                  dynamicStatus = 'Progressing';
                  dynamicStatusClass = 'bg-[#7CB342]/15 text-[#558B2F]';
                } else if (displayScore >= 20) {
                  dynamicStatus = 'Developing Area';
                  dynamicStatusClass = 'bg-[#FBC02D]/20 text-[#B78103]';
                } else {
                  dynamicStatus = 'Critical Weakness';
                  dynamicStatusClass = 'bg-[#D32F2F]/10 text-[#D32F2F]';
                }
              }

              return (
                <motion.div
                  key={p.id}
                  whileHover={{ y: -2 }}
                  onClick={() => handlePillarClick(p.id)}
                  className={`p-4 rounded-2xl glass-panel border border-slate-200/80 hover:border-slate-300 shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-between border-l-4 ${p.borderColor} group`}
                >
                  <div className="space-y-1.5 flex-1 pr-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        {p.number}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${dynamicStatusClass}`}>
                        {dynamicStatus}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#045D61] transition-colors leading-snug line-clamp-1">
                      {p.shortName}
                    </h4>
                    <div className="w-full max-w-[140px] h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#045D61] rounded-full transition-all duration-500"
                        style={{ width: `${displayScore}%` }}
                      />
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0 flex items-center gap-2">
                    <div>
                      <span className="text-lg font-bold text-[#045D61]">{displayScore}</span>
                      <span className="text-[10px] font-medium text-slate-400">/100</span>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-[#045D61] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Recommended Next Steps (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-3xl glass-panel border border-[#045D61]/15 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#EF6C00]">
                  Actionable Next Steps
                </span>
                <h3 className="font-serif text-base font-bold text-slate-900">
                  Recommended Steps
                </h3>
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-[#EF6C00] animate-ping" />
            </div>

            <ul className="space-y-3">
              {latest?.recommendations && latest.recommendations.length > 0 ? (
                latest.recommendations.slice(0, 4).map((rec, idx) => (
                  <li
                    key={idx}
                    onClick={() => {
                      if (rec.priority === 'quick_win') setScreen('screen-services');
                      else if (rec.priority === 'medium_term') setScreen('screen-learning');
                      else setScreen('screen-journey');
                    }}
                    className="p-3.5 rounded-xl bg-white border border-slate-200/90 hover:border-[#009924]/50 shadow-xs hover:shadow-sm transition-all cursor-pointer flex items-start gap-3 group"
                  >
                    <div
                      className={`mt-1 w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                        rec.priority === 'quick_win'
                          ? 'bg-[#009924]'
                          : rec.priority === 'medium_term'
                          ? 'bg-[#FB8C00]'
                          : 'bg-[#1E88E5]'
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-900 group-hover:text-[#045D61] transition-colors leading-snug line-clamp-2">
                        {rec.recommended_action}
                      </p>
                      <p
                        className={`text-[11px] font-semibold mt-0.5 ${
                          rec.priority === 'quick_win'
                            ? 'text-[#009924]'
                            : rec.priority === 'medium_term'
                            ? 'text-[#FB8C00]'
                            : 'text-[#1E88E5]'
                        }`}
                      >
                        {rec.priority === 'quick_win'
                          ? 'Quick Win'
                          : rec.priority === 'medium_term'
                          ? 'Medium Term'
                          : 'Strategic'}{' '}
                        • {rec.pillar_name || 'Agro-Enterprise'}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 transition-colors flex-shrink-0 mt-0.5" />
                  </li>
                ))
              ) : (
                <>
                  {/* Default Step 1 */}
                  <li
                    onClick={() => setScreen('screen-assessment-choice')}
                    className="p-3.5 rounded-xl bg-white border border-slate-200/90 hover:border-[#D32F2F]/50 shadow-xs hover:shadow-sm transition-all cursor-pointer flex items-start gap-3 group"
                  >
                    <div className="mt-1 w-2.5 h-2.5 rounded-full bg-[#D32F2F] flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-900 group-hover:text-[#045D61] transition-colors leading-snug">
                        Complete Renewable Energy Assessment
                      </p>
                      <p className="text-[11px] font-semibold text-[#D32F2F] mt-0.5">
                        High Priority • Pillar 2
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 transition-colors flex-shrink-0 mt-0.5" />
                  </li>

                  {/* Default Step 2 */}
                  <li
                    onClick={() => setScreen('screen-services')}
                    className="p-3.5 rounded-xl bg-white border border-slate-200/90 hover:border-[#009924]/50 shadow-xs hover:shadow-sm transition-all cursor-pointer flex items-start gap-3 group"
                  >
                    <div className="mt-1 w-2.5 h-2.5 rounded-full bg-[#009924] flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-900 group-hover:text-[#045D61] transition-colors leading-snug">
                        Deploy Drip Irrigation &amp; Soil Moisture Telemetry
                      </p>
                      <p className="text-[11px] font-semibold text-[#009924] mt-0.5">
                        Quick Win • Agro-Services
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 transition-colors flex-shrink-0 mt-0.5" />
                  </li>

                  {/* Default Step 3 */}
                  <li
                    onClick={() => setScreen('screen-learning')}
                    className="p-3.5 rounded-xl bg-white border border-slate-200/90 hover:border-[#FB8C00]/50 shadow-xs hover:shadow-sm transition-all cursor-pointer flex items-start gap-3 group"
                  >
                    <div className="mt-1 w-2.5 h-2.5 rounded-full bg-[#FB8C00] flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-900 group-hover:text-[#045D61] transition-colors leading-snug">
                        Adopt Gross-Margin Farm Ledger System
                      </p>
                      <p className="text-[11px] font-semibold text-[#FB8C00] mt-0.5">
                        Learning Academy • Pillar 5
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 transition-colors flex-shrink-0 mt-0.5" />
                  </li>

                  {/* Default Step 4 */}
                  <li
                    onClick={() => setScreen('screen-journey')}
                    className="p-3.5 rounded-xl bg-white border border-slate-200/90 hover:border-[#1E88E5]/50 shadow-xs hover:shadow-sm transition-all cursor-pointer flex items-start gap-3 group"
                  >
                    <div className="mt-1 w-2.5 h-2.5 rounded-full bg-[#1E88E5] flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-900 group-hover:text-[#045D61] transition-colors leading-snug">
                        Prepare Records for FFF Verified Audit
                      </p>
                      <p className="text-[11px] font-semibold text-[#1E88E5] mt-0.5">
                        Strategic Roadmap • FFV
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 transition-colors flex-shrink-0 mt-0.5" />
                  </li>
                </>
              )}
            </ul>

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

      {/* ─── 6. Three Pillar Portals (Assessment, Services, Academy) ─────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl glass-panel hover:shadow-xl transition-all border border-[#045D61]/15 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-2xl">📝</span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#1E88E5]/15 text-[#1E88E5] border border-[#1E88E5]/30">
              Diagnostic Engine
            </span>
          </div>
          <h3 className="font-serif text-lg font-bold text-slate-900">Assessment Hub</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Evaluate your farm readiness across the 8 FFF pillars. Choose a quick Single-Pillar deep dive or a comprehensive baseline.
          </p>
          <div className="pt-2">
            <button
              onClick={() => setScreen('screen-assessment-choice')}
              className="w-full py-2 rounded-xl bg-[#009924] hover:bg-[#007a1c] text-white text-xs font-bold transition-colors shadow-sm"
            >
              Start Audit
            </button>
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-panel hover:shadow-xl transition-all border border-[#045D61]/15 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-2xl">🛠️</span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#045D61]/15 text-[#045D61] border border-[#045D61]/30">
              Inputs &amp; Tech
            </span>
          </div>
          <h3 className="font-serif text-lg font-bold text-slate-900">Services Portal</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Connect with vetted mechanization providers, solar drip irrigation, agroforestry nurseries, and soil test labs matching your capability gaps.
          </p>
          <div className="pt-2">
            <button
              onClick={() => setScreen('screen-services')}
              className="w-full py-2 rounded-xl bg-[#045D61] hover:bg-[#023c3f] text-white text-xs font-bold transition-colors shadow-sm"
            >
              Explore Agro-Services
            </button>
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-panel hover:shadow-xl transition-all border border-[#045D61]/15 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-2xl">📚</span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#FB8C00]/15 text-[#FB8C00] border border-[#FB8C00]/30">
              Agronomic Skills
            </span>
          </div>
          <h3 className="font-serif text-lg font-bold text-slate-900">Learning Academy</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Practical, audio-assisted training modules on regenerative IPM, farm gross-margin ledgers, and organic biochar composting.
          </p>
          <div className="pt-2">
            <button
              onClick={() => setScreen('screen-learning')}
              className="w-full py-2 rounded-xl bg-[#FB8C00] hover:bg-[#e07d00] text-white text-xs font-bold transition-colors shadow-sm"
            >
              Open Learning Modules
            </button>
          </div>
        </div>
      </div>

      {/* ─── 7. Enterprise Subscription & Account Governance (From Settings Design) ─ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Pro Subscription Banner (Spans 8 cols) */}
        <motion.div
          whileHover={{ y: -2 }}
          className="lg:col-span-8 bg-gradient-to-br from-[#003b3d] via-[#045D61] to-[#012527] text-white rounded-3xl p-6 lg:p-7 relative overflow-hidden shadow-lg border border-[#045D61]/50 flex flex-col justify-between"
        >
          {/* Abstract subtle grid pattern */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage:
                'repeating-linear-gradient(45deg, transparent, transparent 10px, #ffffff 10px, #ffffff 20px)',
            }}
          />

          <div className="relative z-10 space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-white/15 border border-white/20 text-[#FFD700] rounded-full text-xs font-extrabold inline-flex items-center gap-1.5 shadow-xs">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Active Enterprise Plan</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#009924]/30 text-emerald-300 text-[10px] font-bold border border-emerald-400/30">
                Tier {tier}: {tierName}
              </span>
            </div>

            <div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight">
                FFF Pro Enterprise Membership
              </h3>
              <p className="text-xs sm:text-sm text-white/80 max-w-xl mt-1 leading-relaxed">
                You are currently on the professional enterprise tier with verified agronomic benchmarking, continuous satellite monitoring, unlimited 8-pillar capability diagnostics, and priority commercial offtake matching.
              </p>
            </div>
          </div>

          <div className="relative z-10 flex flex-wrap items-center gap-3 pt-6 mt-4 border-t border-white/15">
            <button
              onClick={() => setScreen('screen-profile')}
              className="px-5 py-2.5 bg-white hover:bg-slate-100 text-[#045D61] font-bold text-xs rounded-xl shadow-md transition-all hover:scale-102 flex items-center gap-2"
            >
              <CreditCard className="w-4 h-4 text-[#009924]" />
              <span>Manage Plan &amp; Billing</span>
            </button>
            <button
              onClick={() => setScreen('screen-simulator')}
              className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl border border-white/20 transition-all flex items-center gap-2"
            >
              <span>Simulate Tier 4 Expansion</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#FFD700]" />
            </button>
          </div>
        </motion.div>

        {/* Security & Team Access Snippet (Spans 4 cols) */}
        <motion.div
          whileHover={{ y: -2 }}
          className="lg:col-span-4 p-6 rounded-3xl glass-panel border border-[#045D61]/15 shadow-sm flex flex-col justify-between space-y-4"
        >
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#045D61]">
                Farm Governance
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#009924] animate-pulse" />
            </div>
            <h3 className="font-serif text-lg font-bold text-slate-900">
              Account Security &amp; Team
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Enterprise access control and operational staff.
            </p>
          </div>

          <div className="space-y-3">
            {/* 2FA Status */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#009924]/10 text-[#009924] flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Two-Factor (2FA)</h4>
                  <p className="text-[10px] text-slate-500">Protected &amp; Active</p>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#009924]/10 text-[#009924]">
                Enabled
              </span>
            </div>

            {/* Team Access */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#1E88E5]/10 text-[#1E88E5] flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Team Access</h4>
                  <p className="text-[10px] text-slate-500">3 Operators Connected</p>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#1E88E5]/10 text-[#1E88E5]">
                3 Active
              </span>
            </div>
          </div>

          <button
            onClick={() => setScreen('screen-profile')}
            className="w-full py-2.5 rounded-xl bg-[#045D61]/10 hover:bg-[#045D61]/20 text-[#045D61] text-xs font-bold transition-all flex items-center justify-center gap-2"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Manage Enterprise Settings</span>
          </button>
        </motion.div>
      </div>

      {/* ─── 8. Capability Analytics & Economic Dividend ─────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar Profile */}
        <div className="p-6 rounded-3xl glass-panel shadow-sm border border-[#045D61]/15 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#009924]">
                Cross-Pillar Benchmark
              </span>
              <h3 className="font-serif text-lg font-bold text-slate-900">
                8-Pillar Maturity Spider
              </h3>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#045D61]/15 text-[#045D61] border border-[#045D61]/30">
              Interactive Profile
            </span>
          </div>

          <RadarChart pillarScores={latest?.pillar_scores} />

          <div className="flex items-center justify-center gap-6 text-xs text-slate-600 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#009924]" />
              <span>Your Farm Enterprise</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#1E88E5]" />
              <span>Regional Peer Average</span>
            </div>
          </div>
        </div>

        {/* Economic Dividend Projections */}
        <div className="p-6 rounded-3xl glass-panel shadow-sm border border-[#045D61]/15 space-y-5">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#009924]">
              Empirical ROI Projection
            </span>
            <h3 className="font-serif text-lg font-bold text-slate-900">
              Projected Economic Dividend
            </h3>
            <p className="text-xs text-slate-600">
              Financial and agronomic returns from resolving priority capability gaps.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-[#009924]/10 border border-[#009924]/20 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#009924]">
                Projected Yield
              </span>
              <div className="text-2xl font-bold text-slate-900">
                19.2 <span className="text-xs font-normal text-slate-600">bags/ac</span>
              </div>
              <span className="text-[10px] text-[#009924] font-semibold">
                +45% vs baseline
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-[#FB8C00]/10 border border-[#FB8C00]/20 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#FB8C00]">
                Net Annual Gain
              </span>
              <div className="text-2xl font-bold text-slate-900">
                KES {(dividendKes || 0).toLocaleString()}
              </div>
              <span className="text-[10px] text-[#FB8C00] font-semibold">
                +58% profitability dividend
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#045D61] text-white space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#FFD700]">Next Target: Tier 4</span>
              <span className="text-white/80">Investment Ready Farm</span>
            </div>
            <div className="text-xs text-white/90 leading-relaxed">
              Target Score: <span className="font-bold text-white">15.00 pts</span> • Gap to close: <span className="font-bold text-[#FFD700]">+1.20 pts</span>.
            </div>
            <button
              onClick={() => setScreen('screen-simulator')}
              className="w-full mt-2 py-2 rounded-xl bg-[#009924] hover:bg-[#007a1c] text-white font-bold text-xs transition-colors shadow-md"
            >
              Simulate Tier 4 ROI in Scenario Simulator ➔
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
