import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../store/useStore';
import { portalApi, assessmentApi, adaptGamification } from '../services/api';
import { FARMER_PROFILE_BY_ID, formatFpAnswer } from '../data/farmerProfile';
import { AssessmentHistoryItem } from '../types';
import { RadarChart } from '../components/charts/RadarChart';
import {
  ArrowRight,
  ClipboardCheck,
  Layers,
  GraduationCap,
  Lightbulb,
  TrendingUp,
  ChevronRight,
  ArrowUpRight,
  UserCircle2,
} from 'lucide-react';

interface PillarVisualMeta {
  id: number;
  number: string;
  name: string;
  shortName: string;
  borderColor: string;
  accentBg: string;
  accentText: string;
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
  },
  {
    id: 2,
    number: 'Pillar 02',
    name: 'Productive Use of Renewable Energy',
    shortName: 'Renewable Energy',
    borderColor: 'border-l-[#FDD835]',
    accentBg: 'bg-[#FDD835]/15',
    accentText: 'text-[#C79100]',
  },
  {
    id: 3,
    number: 'Pillar 03',
    name: 'Food Safety, Quality & Compliance',
    shortName: 'Food Safety & QA',
    borderColor: 'border-l-[#43A047]',
    accentBg: 'bg-[#43A047]/10',
    accentText: 'text-[#2E7D32]',
  },
  {
    id: 4,
    number: 'Pillar 04',
    name: 'Indigenous Knowledge & Climate Resilience',
    shortName: 'Climate Resilience',
    borderColor: 'border-l-[#2E7D32]',
    accentBg: 'bg-[#2E7D32]/10',
    accentText: 'text-[#1B5E20]',
  },
  {
    id: 5,
    number: 'Pillar 05',
    name: 'Farm Business Performance & Growth',
    shortName: 'Business Performance',
    borderColor: 'border-l-[#8E24AA]',
    accentBg: 'bg-[#8E24AA]/10',
    accentText: 'text-[#6A1B9A]',
  },
  {
    id: 6,
    number: 'Pillar 06',
    name: 'Human Capital, Leadership & Farm Operations',
    shortName: 'Human Capital & Ops',
    borderColor: 'border-l-[#3949AB]',
    accentBg: 'bg-[#3949AB]/10',
    accentText: 'text-[#283593]',
  },
  {
    id: 7,
    number: 'Pillar 07',
    name: 'Market Access, Customer Value & Competitiveness',
    shortName: 'Market Access',
    borderColor: 'border-l-[#FB8C00]',
    accentBg: 'bg-[#FB8C00]/10',
    accentText: 'text-[#E65100]',
  },
  {
    id: 8,
    number: 'Pillar 08',
    name: 'Investment Readiness & Enterprise Development',
    shortName: 'Investment Readiness',
    borderColor: 'border-l-[#683C21]',
    accentBg: 'bg-[#683C21]/10',
    accentText: 'text-[#683C21]',
  },
];

export const DashboardPage: React.FC = () => {
  const {
    user,
    setUser,
    setGamification,
    setScreen,
    assessment,
    setLatestResult,
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
          // If latestResult in store is null, fetch the full assessment details for the
          // latest SUBMITTED assessment only (a draft is not a completed farm check).
          const completed = histRes.value.find((h) => h.status === 'submitted');
          if (!assessment.latestResult && completed?.id) {
            try {
              const fullDetails = await assessmentApi.getAssessment(completed.id);
              if (fullDetails && isMounted) {
                // Pre-load result data WITHOUT navigating to the result screen.
                setLatestResult(fullDetails);
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
  const submittedHistory = historyList.filter((h) => h.status === 'submitted');
  const latestHistory = submittedHistory.length > 0 ? submittedHistory[0] : null;

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

  // ── Economic Dividend: derive from real assessment data only
  const economicDividend = latest?.economic_dividend;
  const projectedYieldBags = economicDividend?.projected_yield_bags;
  const currentYieldBags = economicDividend?.current_yield_bags;
  const yieldPctGain =
    projectedYieldBags !== undefined && currentYieldBags !== undefined && currentYieldBags > 0
      ? Math.round(((projectedYieldBags - currentYieldBags) / currentYieldBags) * 100)
      : null;

  const currentRevenueKes = economicDividend?.current_revenue_kes;
  const projectedRevenueKes = economicDividend?.projected_revenue_kes;
  const revenuePctGain =
    currentRevenueKes !== undefined && projectedRevenueKes !== undefined && currentRevenueKes > 0
      ? Math.round(((projectedRevenueKes - currentRevenueKes) / currentRevenueKes) * 100)
      : null;

  // Active in-progress draft (user is currently taking a questionnaire)
  const isDraftInProgress =
    assessment.id !== null &&
    assessment.questions.length > 0 &&
    Object.keys(assessment.answers).length < assessment.questions.length;

  const hasCompletedAssessment = !!latest || !!dashboardSummary?.latest_assessment_id || submittedHistory.length > 0;

  // Active pillar scores from live backend data
  const activePillarScores: Record<string | number, number> = (latest?.pillar_scores || latestHistory?.pillar_scores || {}) as Record<string | number, number>;

  const nonZeroPillars = Object.values(activePillarScores).filter(
    (v) => typeof v === 'number' && v > 0
  ).length;

  // Count how many of the 8 pillars have verified assessment scores
  const assessedPillarsCount = PILLARS_META.filter((p) => {
    const raw = activePillarScores[p.id] ?? activePillarScores[String(p.id)];
    return typeof raw === 'number' && raw > 0;
  }).length;

  // ── Compute Exact Live Metrics for Metric Cards 1 & 2
  let auditBadgeText = 'Not Started';
  let auditBadgeClass = 'bg-slate-100 text-slate-600';
  let totalQuestions = 200;
  let answeredCount = 0;
  let progressPercent = 0;

  let coverageBadgeText = `${assessedPillarsCount} / 8 Pillars`;
  let coverageBadgeClass = 'bg-slate-100 text-slate-600';
  const totalPillarsInScope = 8;

  if (isDraftInProgress) {
    totalQuestions = assessment.questions.length || (assessment.scope === 'pillar' ? 25 : 200);
    answeredCount = Object.keys(assessment.answers).length;
    progressPercent = totalQuestions > 0 ? Math.min(100, Math.round((answeredCount / totalQuestions) * 100)) : 0;
    auditBadgeText = assessment.scope === 'pillar' ? `Pillar ${assessment.targetPillarId || '1'} Draft` : 'Active Draft';
    auditBadgeClass = 'bg-[#FB8C00]/15 text-[#E65100] font-bold';

    coverageBadgeText =
      assessment.scope === 'pillar'
        ? `Pillar ${assessment.targetPillarId || '1'} (${answeredCount}/${totalQuestions} Qs)`
        : `${Math.min(8, Math.ceil((answeredCount / 200) * 8))} / 8 In Progress`;
    coverageBadgeClass = 'bg-[#1565C0]/10 text-[#1565C0] font-bold';
  } else if (hasCompletedAssessment || assessedPillarsCount > 0) {
    totalQuestions = 200;
    answeredCount = assessedPillarsCount * 25;
    progressPercent = Math.min(100, Math.round((assessedPillarsCount / 8) * 100));

    if (assessedPillarsCount >= 8) {
      auditBadgeText = 'Full Coverage (8/8)';
      auditBadgeClass = 'bg-[#009924]/10 text-[#009924] font-bold';
      coverageBadgeText = '8 / 8 Verified';
      coverageBadgeClass = 'bg-[#009924]/10 text-[#009924] font-bold';
    } else {
      auditBadgeText = `${assessedPillarsCount} of 8 Pillars`;
      auditBadgeClass = 'bg-[#1565C0]/10 text-[#1565C0] font-bold';
      coverageBadgeText = `${assessedPillarsCount} / 8 Verified`;
      coverageBadgeClass = 'bg-[#1565C0]/10 text-[#1565C0] font-bold';
    }
  } else {
    // Brand new user with 0 assessments
    totalQuestions = 200;
    answeredCount = 0;
    progressPercent = 0;
    auditBadgeText = 'Not Started';
    auditBadgeClass = 'bg-slate-100 text-slate-600 font-bold';
    coverageBadgeText = '0 / 8 Covered';
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
              title="Future Farms"
            >
              <img
                src="/assets/arbarne-emblem-white.png"
                alt="Future Farms"
                className="h-full w-auto object-contain drop-shadow"
              />
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#009924] animate-ping opacity-75" />
            </motion.div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="h-0.5 w-5 bg-[#009924] rounded-full" />
                  <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest text-[#009924]">
                    Future Farms
                  </span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-serif font-bold text-white tracking-tight">
                  Welcome, {user.name ? user.name.split(' ')[0] : 'Farmer'}.
                </h1>
                <p className="text-xs sm:text-sm text-white/80">
                  Track your progress, take your next check-up, and keep growing.
                </p>
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
                Your Stage
              </div>
              <div className="text-base font-bold text-white">
                Stage {tier} · {tierName}
              </div>
            </motion.div>

            <motion.div
              className="px-5 py-3 rounded-2xl bg-[#FFD700]/15 border border-[#FFD700]/40 backdrop-blur-md cursor-default"
              whileHover={{ y: -4, scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#FFD700]">
                Your Farm Score
              </div>
              <div className="text-xl font-extrabold text-white">
                {ffmiScore.toFixed(1)}{' '}
                <span className="text-xs font-normal text-white/70">/ 24</span>
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
            <span>Start Farm Check</span>
            <ArrowRight className="w-4 h-4" />
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
            <p className="text-xs font-semibold text-slate-500 mb-1">Farm Check Progress</p>
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
            <p className="text-xs font-semibold text-slate-500 mb-1">Areas Checked</p>
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
              Training
            </span>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 mb-1">Training Done</p>
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
              Steps
            </span>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 mb-1">Suggested Steps</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-bold text-slate-900">
                {totalRecommendationsCount}
              </span>
              <span className="text-xs font-medium text-slate-500">Steps</span>
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
              How Developed Your Farm Is
            </span>
            <h3 className="text-base font-serif font-bold text-slate-900">
              Your Farm Stage
            </h3>
          </div>
          <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-[#009924]/10 text-[#009924] rounded-full text-xs font-bold flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                Stage {tier}: {tierName}
              </span>
          </div>
        </div>

        {/* Multi-tier horizontal milestone spectrum */}
        <div className="space-y-2 pt-2">
          <div className="flex justify-between text-[11px] font-semibold text-slate-500">
              <span className={tier === 1 ? 'font-bold text-[#8E99A2] flex items-center gap-1' : ''}>
                1. Just Starting {tier === 1 && '📍'}
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
            <div className={`h-full border-r border-white/60 ${tier >= 1 ? 'bg-[#8E99A2]' : 'bg-slate-200'} w-1/5 relative`} title="Stage 1: Just Starting">
              {tier === 1 && <div className="absolute right-1 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white rounded-full shadow-md animate-pulse" />}
            </div>
            <div className={`h-full border-r border-white/60 ${tier >= 2 ? 'bg-[#FB8C00]' : 'bg-slate-200'} w-1/5 relative`} title="Stage 2: Emerging">
              {tier === 2 && <div className="absolute right-1 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white rounded-full shadow-md animate-pulse" />}
            </div>
            <div className={`h-full border-r border-white/60 ${tier >= 3 ? 'bg-[#009924]' : 'bg-slate-200'} w-1/5 relative`} title="Stage 3: Structured">
              {tier === 3 && <div className="absolute right-1 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white rounded-full shadow-md animate-pulse" />}
            </div>
            <div className={`h-full border-r border-white/60 ${tier >= 4 ? 'bg-[#045D61]' : 'bg-slate-200'} w-1/5 relative`} title="Stage 4: Investment Ready">
              {tier === 4 && <div className="absolute right-1 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white rounded-full shadow-md animate-pulse" />}
            </div>
            <div className={`h-full ${tier >= 5 ? 'bg-[#FFD700]' : 'bg-slate-200'} w-1/5 relative`} title="Stage 5: Future Ready">
              {tier === 5 && <div className="absolute right-1 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white rounded-full shadow-md animate-pulse" />}
            </div>
          </div>

          <p className="text-xs text-slate-500 flex items-center justify-between pt-1">
            <span>Score: <strong className="text-slate-800">{ffmiScore.toFixed(1)} / 24 pts</strong></span>
            {tier < 5 ? (
              <span>Next: <strong className="text-[#045D61]">Stage {nextTier} ({targetScore.toFixed(1)} pts)</strong> • <span className="text-[#009924] font-semibold">+{scoreGap} pts to go</span></span>
            ) : (
              <span className="text-[#B88917] font-bold">✨ You have reached the top stage!</span>
            )}
          </p>
        </div>
      </div>

      {/* ─── 4. Gamification banner intentionally removed for farmer simplicity ─── */}

      {/* ─── 4b. Farmer Profile snapshot ──────────────────────────────────── */}
      {user.farmer_profile && (() => {
        const fp = user.farmer_profile;
        const highlights: { label: string; id: string }[] = [
          { label: 'Role', id: 'job_title' },
          { label: 'Experience', id: 'experience_years' },
          { label: 'Management', id: 'management_ability' },
          { label: 'Decision style', id: 'decision_style' },
          { label: 'Top obstacles', id: 'obstacles' },
          { label: 'Updates', id: 'update_preference' },
        ];
        const items = highlights
          .map((h) => ({ ...h, value: formatFpAnswer(FARMER_PROFILE_BY_ID[h.id], fp) }))
          .filter((h) => h.value);
        if (items.length === 0) return null;
        return (
          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-[#045D61]/15 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <UserCircle2 className="w-5 h-5 text-[#009924]" />
                <h3 className="text-sm font-bold text-[#045D61]">About You</h3>
              </div>
              <button
                onClick={() => setScreen('screen-profile')}
                className="text-xs font-bold text-[#045D61] hover:text-[#009924] flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>View profile</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {items.map((it) => (
                <div key={it.id} className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {it.label}
                  </span>
                  <p className="text-xs font-semibold text-slate-900 mt-0.5 leading-snug line-clamp-2">
                    {it.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {/* ─── 5. Main Dashboard Split: 8 Pillars Grid + Recommended Steps ──── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: 8 Pillars Grid (8 Cols) */}
        <div className="lg:col-span-8 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#009924]">
                What We Check
              </span>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-slate-900">
                Your Farm Areas
              </h3>
              <p className="text-xs text-slate-500">
                These are the 8 areas we check on every farm.
              </p>
            </div>
              <button
                onClick={() => setScreen('screen-assessment-choice')}
                className="text-xs font-bold text-[#045D61] hover:text-[#009924] flex items-center gap-1 transition-colors"
              >
                <span>Check Your Farm</span>
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

              let dynamicStatus = 'Not Checked';
              let dynamicStatusClass = 'bg-slate-100 text-slate-500';

              if (hasScore) {
                if (displayScore >= 80) {
                  dynamicStatus = 'Strong';
                  dynamicStatusClass = 'bg-[#009924]/15 text-[#007a1c]';
                } else if (displayScore >= 55) {
                  dynamicStatus = 'Good';
                  dynamicStatusClass = 'bg-[#388E3C]/15 text-[#1B5E20]';
                } else if (displayScore >= 30) {
                  dynamicStatus = 'Getting There';
                  dynamicStatusClass = 'bg-[#7CB342]/15 text-[#558B2F]';
                } else {
                  dynamicStatus = 'Needs Work';
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
                Next Steps
              </span>
              <h3 className="font-serif text-base font-bold text-slate-900">
                Suggested Next Steps
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
                           ? 'Easy Win'
                           : rec.priority === 'medium_term'
                           ? 'Medium Term'
                           : 'Long Term'}{' '}
                         • {rec.pillar_name || 'Your Farm'}
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
                        Important • Pillar 2
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
                        Easy Win • Get Help
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
                        Training • Pillar 5
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
                        Get Your Farm Checked and Verified
                      </p>
                      <p className="text-[11px] font-semibold text-[#1E88E5] mt-0.5">
                        Long Term • Farm Check
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
                <span>See All Steps</span>
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
              Check
            </span>
          </div>
          <h3 className="font-serif text-lg font-bold text-slate-900">Check Your Farm</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Check how your farm is doing across 8 simple areas. Pick one area or do the full check.
          </p>
          <div className="pt-2">
            <button
              onClick={() => setScreen('screen-assessment-choice')}
              className="w-full py-2 rounded-xl bg-[#009924] hover:bg-[#007a1c] text-white text-xs font-bold transition-colors shadow-sm"
            >
              Start Check
            </button>
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-panel hover:shadow-xl transition-all border border-[#045D61]/15 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-2xl">🛠️</span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#045D61]/15 text-[#045D61] border border-[#045D61]/30">
              Help
            </span>
          </div>
          <h3 className="font-serif text-lg font-bold text-slate-900">Get Help</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Find trusted helpers near you — for tools, solar water pumps, seedlings, and soil testing.
          </p>
          <div className="pt-2">
            <button
              onClick={() => setScreen('screen-services')}
              className="w-full py-2 rounded-xl bg-[#045D61] hover:bg-[#023c3f] text-white text-xs font-bold transition-colors shadow-sm"
            >
              Find Services
            </button>
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-panel hover:shadow-xl transition-all border border-[#045D61]/15 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-2xl">📚</span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#FB8C00]/15 text-[#FB8C00] border border-[#FB8C00]/30">
              Training
            </span>
          </div>
          <h3 className="font-serif text-lg font-bold text-slate-900">Learn</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Short, easy lessons you can listen to — on pests, keeping farm records, and making compost.
          </p>
          <div className="pt-2">
            <button
              onClick={() => setScreen('screen-learning')}
              className="w-full py-2 rounded-xl bg-[#FB8C00] hover:bg-[#e07d00] text-white text-xs font-bold transition-colors shadow-sm"
            >
              Start Learning
            </button>
          </div>
        </div>
      </div>

      {/* ─── 7. Your Plan ─────────────────────────────────────────────── */}
      <div className="p-6 rounded-3xl glass-panel border border-[#045D61]/15 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-serif text-lg font-bold text-slate-900">Your Plan</h3>
          <p className="text-xs text-slate-600 mt-1 max-w-xl">
            You are using the free Farm Check. It includes checking your farm, seeing your results, and simple next steps to improve.
          </p>
        </div>
        <button
          onClick={() => setScreen('screen-profile')}
          className="px-5 py-2.5 rounded-xl bg-[#009924] hover:bg-[#007a1c] text-white text-xs font-bold shadow-sm transition-colors flex-shrink-0"
        >
          My Farm Details
        </button>
      </div>

      {/* ─── 8. Capability Analytics & Economic Dividend ─────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar Profile */}
        <div className="p-6 rounded-3xl glass-panel shadow-sm border border-[#045D61]/15 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#009924]">
                Your Farm vs Nearby Farms
              </span>
              <h3 className="font-serif text-lg font-bold text-slate-900">
                Your Farm Areas
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
              <span>Your Farm</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#1E88E5]" />
              <span>Other Farms Nearby</span>
            </div>
          </div>
        </div>

        {/* Economic Dividend Projections */}
        <div className="p-6 rounded-3xl glass-panel shadow-sm border border-[#045D61]/15 space-y-5">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#009924]">
              Extra Income
            </span>
            <h3 className="font-serif text-lg font-bold text-slate-900">
              Extra Income You Could Earn
            </h3>
            <p className="text-xs text-slate-600">
              Extra money you could earn by improving the weak areas of your farm.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-[#009924]/10 border border-[#009924]/20 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#009924]">
                Expected Harvest
              </span>
              <div className="text-2xl font-bold text-slate-900">
                {projectedYieldBags !== undefined ? (
                  <>
                    {projectedYieldBags.toLocaleString()}{' '}
                    <span className="text-xs font-normal text-slate-600">bags/ac</span>
                  </>
                ) : (
                  <span className="text-base font-normal text-slate-500">—</span>
                )}
              </div>
              {yieldPctGain !== null ? (
                <span className="text-[10px] text-[#009924] font-semibold">
                  +{yieldPctGain}% vs baseline
                </span>
              ) : (
                <span className="text-[10px] text-slate-400 font-medium">
                  Complete a Farm Check to see projections
                </span>
              )}
            </div>

            <div className="p-4 rounded-2xl bg-[#FB8C00]/10 border border-[#FB8C00]/20 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#FB8C00]">
                Extra Income
              </span>
              <div className="text-2xl font-bold text-slate-900">
                KES {(dividendKes || 0).toLocaleString()}
              </div>
              {revenuePctGain !== null ? (
                <span className="text-[10px] text-[#FB8C00] font-semibold">
                  +{revenuePctGain}% profitability dividend
                </span>
              ) : (
                <span className="text-[10px] text-slate-400 font-medium">
                  Complete a Farm Check to see projections
                </span>
              )}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#045D61] text-white space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#FFD700]">Next Target: Stage {nextTier}</span>
              <span className="text-white/80">Investment Ready Farm</span>
            </div>
            <div className="text-xs text-white/90 leading-relaxed">
              Target Score: <span className="font-bold text-white">{targetScore.toFixed(1)} pts</span> • Gap to close: <span className="font-bold text-[#FFD700]">+{scoreGap} pts</span>.
            </div>
            <button
              onClick={() => setScreen('screen-journey')}
              className="w-full mt-2 py-2 rounded-xl bg-[#009924] hover:bg-[#007a1c] text-white font-bold text-xs transition-colors shadow-md"
            >
              See Your Progress
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
