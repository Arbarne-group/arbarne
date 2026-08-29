import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store/useStore';
import { assessmentApi } from '../services/api';
import {
  Trophy,
  Share2,
  Sparkles,
  Award,
  Star,
  CheckCircle,
  Circle,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Zap,
  Cpu,
  Trees,
  Store,
  Users,
  Building2,
  Briefcase,
  History,
  Lock,
  Layers,
  ChevronRight,
  Download,
} from 'lucide-react';
import {
  AssessmentResult,
  AssessmentHistoryItem,
  Badge,
  PILLAR_BRAND_COLORS,
} from '../types';

// ─── Static Pillar Icon Map ───────────────────────────────────────────────────
const PILLAR_ICONS: Record<number, React.ComponentType<{ className?: string }>> = {
  1: Cpu,
  2: Zap,
  3: ShieldCheck,
  4: Trees,
  5: Store,
  6: Users,
  7: Building2,
  8: Briefcase,
};

// ─── Default Badges Catalogue (All 8 Pillars + Milestones) ───────────────────
const DEFAULT_BADGES: (Badge & { pillarId?: number })[] = [
  {
    key: 'soil_guardian',
    pillarId: 1,
    title: 'Soil Alchemist',
    description: 'Mastered Smart Farming practices, digital recordkeeping & soil testing baseline.',
    icon: '🧪',
    rarity: 'Gold',
    is_unlocked: true,
  },
  {
    key: 'water_steward',
    pillarId: 2,
    title: 'Water & Solar Guardian',
    description: 'Established productive use of renewable energy, solar irrigation & clean power.',
    icon: '⚡',
    rarity: 'Gold',
    is_unlocked: false,
  },
  {
    key: 'biodiversity_hero',
    pillarId: 3,
    title: 'Food Safety & Quality Champion',
    description: 'Enforces food safety protocols, biological crop protection & compliance standards.',
    icon: '🛡️',
    rarity: 'Silver',
    is_unlocked: false,
  },
  {
    key: 'mechanization_pioneer',
    pillarId: 4,
    title: 'Climate Resilience Pioneer',
    description: 'Applies indigenous agronomic knowledge, drought-tolerant varieties & climate adaptation.',
    icon: '🌱',
    rarity: 'Silver',
    is_unlocked: false,
  },
  {
    key: 'market_master',
    pillarId: 5,
    title: 'Farm Business Leader',
    description: 'Maintains digitized enterprise budgeting, gross-margin analysis & cash flow planning.',
    icon: '💳',
    rarity: 'Gold',
    is_unlocked: false,
  },
  {
    key: 'safety_shield',
    pillarId: 6,
    title: 'Human Capital & Safety Shield',
    description: 'Practices fair farm labor, workplace safety protocols & worker skill building.',
    icon: '👥',
    rarity: 'Bronze',
    is_unlocked: false,
  },
  {
    key: 'circular_champion',
    pillarId: 7,
    title: 'Market Access & Circularity Champion',
    description: 'Established structured buyer off-take contracts and agricultural waste upcycling.',
    icon: '♻️',
    rarity: 'Silver',
    is_unlocked: false,
  },
  {
    key: 'governance_pro',
    pillarId: 8,
    title: 'Investment Readiness Pro',
    description: 'Maintains verified governance records, audit trails & investor-ready data.',
    icon: '📈',
    rarity: 'Gold',
    is_unlocked: false,
  },
  {
    key: 'quick_learner',
    title: 'Agro-Knowledge Scholar',
    description: 'Completed essential training modules in the Future Farms learning portal.',
    icon: '📚',
    rarity: 'Silver',
    is_unlocked: true,
  },
  {
    key: 'future_ready_100k',
    title: '100K Future Farms Hero',
    description: 'Joined the premier cohort of 100,000 future-ready farms across East Africa.',
    icon: '🌟',
    rarity: 'Diamond',
    is_unlocked: true,
  },
];

type AchievementFilter = 'all' | 'milestones' | 'pillars' | 'badges';

export const JourneyPage: React.FC = () => {
  const { user, assessment, setScreen, pillars, openShare, gamification } = useAppStore();

  const [activeFilter, setActiveFilter] = useState<AchievementFilter>('all');
  const [historyList, setHistoryList] = useState<AssessmentHistoryItem[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const farmScore = user.ffmi_score ?? 0;
  const stage = user.tier ?? 1;
  const stageName = user.tier_name || 'Informal Farm';

  const pillarScores = assessment.latestResult?.pillar_scores ?? {};
  const recommendations = assessment.latestResult?.recommendations ?? [];
  const reviewedPillars = pillars.filter((p) => typeof pillarScores[p.id] === 'number');

  // Load history for past milestones
  useEffect(() => {
    assessmentApi
      .getHistory()
      .then((items) => {
        if (Array.isArray(items)) setHistoryList(items);
      })
      .catch(() => {});
  }, []);

  // Compute live badges status based on unlocked keys and completed pillar audits
  const userBadges: Badge[] = DEFAULT_BADGES.map((b) => {
    const isPillarReviewed =
      b.pillarId !== undefined && typeof pillarScores[b.pillarId] === 'number';
    const isUnlocked =
      gamification.unlocked_badge_keys.includes(b.key) ||
      isPillarReviewed ||
      b.is_unlocked;

    return {
      key: b.key,
      title: b.title,
      description: b.description,
      icon: b.icon,
      rarity: b.rarity,
      is_unlocked: isUnlocked,
    };
  });

  const unlockedBadgesCount = userBadges.filter((b) => b.is_unlocked).length;
  const totalAchievementsCount = 1 + reviewedPillars.length + unlockedBadgesCount;

  // ─── Handlers to Open Specific Achievement Cards ───────────────────────────

  // 1. Overall Full Assessment Achievement
  const handleOpenOverallAchievement = () => {
    // Populate all 8 pillars so the card accurately renders as the Full 8-Pillar Framework Scorecard
    const fullScores: Record<number, number> = {};
    for (let i = 1; i <= 8; i++) {
      fullScores[i] = pillarScores[i] ?? 0;
    }
    const overallResult: AssessmentResult = {
      assessment_id: assessment.latestResult?.assessment_id || 'overall-milestone',
      ffmi_score: farmScore,
      tier: stage,
      tier_classification: stageName,
      strongest_pillar_id: assessment.latestResult?.strongest_pillar_id ?? 1,
      priority_gap_pillar_id: assessment.latestResult?.priority_gap_pillar_id ?? 2,
      pillar_scores: fullScores,
      pillar_status: assessment.latestResult?.pillar_status || {},
      recommendations: assessment.latestResult?.recommendations || [],
    };
    openShare(overallResult);
  };

  // 2. Individual Pillar Mastery Achievement
  const handleOpenPillarAchievement = (pillarId: number, pillarName: string) => {
    const rawScore = pillarScores[pillarId];
    const scoreVal = typeof rawScore === 'number' ? rawScore : 0.75;
    const scorePct = Math.round(scoreVal <= 1 ? scoreVal * 100 : (scoreVal / 3) * 100);

    const statusLabel =
      scorePct >= 80 ? 'Core Strength' : scorePct >= 50 ? 'Developing Area' : 'Emerging Capability';

    const pillarResult: AssessmentResult = {
      assessment_id: `pillar-${pillarId}`,
      ffmi_score: farmScore || 13.8,
      tier: stage || 3,
      tier_classification: statusLabel,
      pillar_scores: { [pillarId]: scoreVal },
      pillar_status: { [pillarId]: statusLabel },
      recommendations: [],
    };
    openShare(pillarResult);
  };

  // 3. Historical Check Milestone
  const handleOpenHistoryAchievement = async (item: AssessmentHistoryItem) => {
    try {
      const full = await assessmentApi.getAssessment(item.id);
      if (full) {
        openShare(full);
        return;
      }
    } catch {}

    const historyResult: AssessmentResult = {
      assessment_id: item.id,
      ffmi_score: item.ffmi_score ?? item.score ?? 13.8,
      tier: item.tier ?? 3,
      tier_classification: item.tier_classification ?? item.tier_name ?? 'Structured Farm',
      pillar_scores: (item.pillar_scores as Record<number, number>) ?? {},
      recommendations: [],
    };
    openShare(historyResult);
  };

  // 4. Badge Achievement Showcase
  const handleOpenBadgeAchievement = (badge: Badge) => {
    const badgeResult: AssessmentResult = {
      assessment_id: `badge-${badge.key}`,
      ffmi_score: farmScore || 13.8,
      tier: stage || 3,
      tier_classification: `${badge.title} (${badge.rarity} Trophy)`,
      pillar_scores: pillarScores,
      recommendations: [],
    };
    openShare(badgeResult);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* ─── 1. Hero Progress Banner ───────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#023c3f] via-[#045D61] to-[#012527] border border-[#045D61]/30 text-white p-6 sm:p-8 md:p-10 shadow-2xl">
        <img
          src="/assets/arbarne-emblem-white.png"
          alt=""
          className="absolute right-[-4%] top-1/2 -translate-y-1/2 h-[115%] max-h-[300px] w-auto opacity-[0.06] pointer-events-none select-none"
          aria-hidden="true"
        />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#009924]/20 border border-[#009924]/30 text-[#00c42e] text-xs font-bold uppercase tracking-wider">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Verified Farm Progress</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold tracking-tight text-white">
              My Progress & Achievements
            </h1>
            <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
              Celebrate your farm's verified milestones, review all 8 pillar masteries, and view or share official achievement cards.
            </p>
          </div>

          {/* Stats Snapshot */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15 text-center flex-1 sm:flex-initial min-w-[110px] backdrop-blur-md">
              <div className="text-[10px] uppercase font-bold text-white/70">Farm Score</div>
              <div className="text-2xl font-extrabold text-white">{farmScore.toFixed(1)}</div>
              <div className="text-[10px] text-white/60">out of 24.0</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#009924]/25 border border-[#009924]/35 text-center flex-1 sm:flex-initial min-w-[130px] backdrop-blur-md">
              <div className="text-[10px] uppercase font-bold text-[#bfe9c8]">Current Stage</div>
              <div className="text-2xl font-extrabold text-white">Stage {stage}</div>
              <div className="text-[11px] text-white/80 truncate max-w-[120px] mx-auto">{stageName}</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#FFD700]/15 border border-[#FFD700]/30 text-center flex-1 sm:flex-initial min-w-[110px] backdrop-blur-md">
              <div className="text-[10px] uppercase font-bold text-[#FFD700]">Achievements</div>
              <div className="text-2xl font-extrabold text-[#FFD700]">{totalAchievementsCount}</div>
              <div className="text-[10px] text-white/80">Unlocked</div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── 2. Achievements & Milestones Showcase ────────────────────────── */}
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-[#009924]" />
              <h2 className="font-serif text-2xl font-bold text-slate-900">
                Achievements &amp; Milestones
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Click on any verified achievement to view, download, or share its official digital card.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-slate-100 border border-slate-200 self-start sm:self-auto">
            {(
              [
                { id: 'all', label: `All (${totalAchievementsCount})` },
                { id: 'milestones', label: `Milestones (${1 + historyList.length})` },
                { id: 'pillars', label: `Pillars (${reviewedPillars.length}/8)` },
                { id: 'badges', label: `Trophies (${unlockedBadgesCount})` },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeFilter === tab.id
                    ? 'bg-[#045D61] text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* ─── Achievements Cards Grid ─────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* 🌟 1. Primary Full Assessment Milestone Card (Always Visible) */}
          {(activeFilter === 'all' || activeFilter === 'milestones') && (
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#032f33] via-[#044c53] to-[#032f33] border-2 border-[#FFD700]/40 p-5 text-white shadow-lg flex flex-col justify-between group hover:border-[#FFD700] transition-all">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#FFD700]/20 text-[#FFD700] border border-[#FFD700]/40">
                    ★ Primary Milestone
                  </span>
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    Verified
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FFD700]/30 to-[#045D61] border border-[#FFD700]/50 flex items-center justify-center p-2.5 shadow-md flex-shrink-0">
                    <Trophy className="w-full h-full text-[#FFD700]" />
                  </div>
                  <div>
                    <h3 className="font-serif text-base font-bold text-white leading-snug">
                      Full Future Farm Assessment
                    </h3>
                    <p className="text-xs text-white/70 mt-0.5">
                      Stage {stage} · {stageName}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-white/75 leading-relaxed">
                  Verified maturity scorecard across all 8 pillars of the Future Farms Framework with an official FFMI of <strong className="text-[#FFD700]">{farmScore.toFixed(1)}</strong>.
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-white/10 flex items-center gap-2">
                <button
                  onClick={handleOpenOverallAchievement}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-gradient-to-r from-[#FFD700] to-[#E5A800] hover:brightness-105 text-[#032f33] font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  <Trophy className="w-3.5 h-3.5" />
                  <span>View Card</span>
                </button>
                <button
                  onClick={handleOpenOverallAchievement}
                  className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white transition-colors cursor-pointer"
                  title="Share"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* 🏛️ 2. Pillar Mastery Achievements */}
          {(activeFilter === 'all' || activeFilter === 'pillars') &&
            pillars.map((p) => {
              const rawScore = pillarScores[p.id];
              const isReviewed = typeof rawScore === 'number';
              const scorePct = isReviewed
                ? Math.round(rawScore <= 1 ? rawScore * 100 : (rawScore / 3) * 100)
                : 0;

              const brand = PILLAR_BRAND_COLORS[p.id] || {
                hex: '#009924',
                textClass: 'text-[#009924]',
                bgLight: 'bg-[#009924]/10',
                borderLight: 'border-[#009924]/30',
              };
              const PillarIcon = PILLAR_ICONS[p.id] || Award;

              return (
                <div
                  key={`pillar-ach-${p.id}`}
                  className={`rounded-3xl border p-5 flex flex-col justify-between transition-all ${
                    isReviewed
                      ? 'bg-white border-slate-200/90 shadow-sm hover:shadow-md hover:border-[#045D61]/40'
                      : 'bg-slate-50/70 border-slate-200 opacity-75'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span
                        className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider"
                        style={{
                          background: isReviewed ? `${brand.hex}15` : '#e2e8f0',
                          color: isReviewed ? brand.hex : '#64748b',
                          border: `1px solid ${isReviewed ? `${brand.hex}35` : '#cbd5e1'}`,
                        }}
                      >
                        Pillar {p.id} Mastery
                      </span>

                      {isReviewed ? (
                        <span className="text-xs font-black text-[#009924] px-2 py-0.5 rounded-lg bg-[#009924]/10">
                          {scorePct}% Score
                        </span>
                      ) : (
                        <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                          <Lock className="w-3 h-3" />
                          Locked
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <div
                        className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-sm flex-shrink-0 text-white"
                        style={{
                          background: isReviewed ? brand.hex : '#94a3b8',
                        }}
                      >
                        <PillarIcon className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-serif text-sm font-bold text-slate-900 leading-snug truncate">
                          {p.name}
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                          {isReviewed ? 'Audit Completed & Verified' : 'Complete check to unlock'}
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {p.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center gap-2">
                    {isReviewed ? (
                      <>
                        <button
                          onClick={() => handleOpenPillarAchievement(p.id, p.name)}
                          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-[#045D61] hover:bg-[#023c3f] text-white font-bold text-xs transition-colors shadow-xs cursor-pointer"
                        >
                          <Award className="w-3.5 h-3.5" />
                          <span>View Pillar Card</span>
                        </button>
                        <button
                          onClick={() => handleOpenPillarAchievement(p.id, p.name)}
                          className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                          title="Share"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setScreen('screen-assessment-choice')}
                        className="w-full flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-[#009924] hover:text-white text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                      >
                        <span>Audit This Pillar</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

          {/* 🎖️ 3. Unlocked Gamification Badges & Trophies */}
          {(activeFilter === 'all' || activeFilter === 'badges') &&
            userBadges.map((b) => (
              <div
                key={`badge-${b.key}`}
                className={`rounded-3xl border p-5 flex flex-col justify-between transition-all ${
                  b.is_unlocked
                    ? 'bg-gradient-to-br from-amber-50/50 via-white to-white border-amber-200/90 shadow-sm hover:shadow-md'
                    : 'bg-slate-50/60 border-slate-200 opacity-60'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                        b.rarity === 'Diamond'
                          ? 'bg-purple-100 text-purple-800 border border-purple-300'
                          : b.rarity === 'Gold'
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-slate-100 text-slate-700 border border-slate-300'
                      }`}
                    >
                      {b.rarity} Trophy
                    </span>

                    <span
                      className={`text-[11px] font-bold ${
                        b.is_unlocked ? 'text-amber-700' : 'text-slate-400'
                      }`}
                    >
                      {b.is_unlocked ? '🏆 Unlocked' : '🔒 In Progress'}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-amber-100/70 border border-amber-200 flex items-center justify-center text-2xl shadow-xs flex-shrink-0">
                      {b.icon || '🏆'}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-serif text-sm font-bold text-slate-900 truncate">
                        {b.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 truncate">
                        {b.is_unlocked ? 'Milestone achieved' : 'Complete farm tasks'}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                    {b.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100">
                  {b.is_unlocked ? (
                    <button
                      onClick={() => handleOpenBadgeAchievement(b)}
                      className="w-full flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-colors shadow-xs cursor-pointer"
                    >
                      <Trophy className="w-3.5 h-3.5" />
                      <span>View &amp; Share Trophy</span>
                    </button>
                  ) : (
                    <div className="w-full py-2.5 text-center text-xs font-semibold text-slate-400 bg-slate-100 rounded-xl">
                      Locked
                    </div>
                  )}
                </div>
              </div>
            ))}

          {/* 📋 4. Past Assessment History Milestones */}
          {(activeFilter === 'all' || activeFilter === 'milestones') &&
            historyList.map((hist, idx) => (
              <div
                key={`hist-${hist.id}-${idx}`}
                className="rounded-3xl border border-slate-200 bg-white p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
                      Past Check
                    </span>
                    <span className="text-xs font-bold text-slate-500">
                      {hist.completed_at
                        ? new Date(hist.completed_at).toLocaleDateString()
                        : 'Completed'}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-[#045D61]/10 text-[#045D61] border border-[#045D61]/20 flex items-center justify-center flex-shrink-0">
                      <History className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-serif text-sm font-bold text-slate-900 leading-snug">
                        {hist.scope === 'pillar'
                          ? `${hist.target_pillar_name || 'Single Pillar'} Audit`
                          : 'Full Farm Check'}
                      </h4>
                      <p className="text-xs text-slate-600 font-semibold mt-0.5">
                        Score: {(hist.ffmi_score ?? hist.score ?? 0).toFixed(1)} · Tier{' '}
                        {hist.tier ?? 3}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed">
                    Official assessment record archived in your farm journey log.
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center gap-2">
                  <button
                    onClick={() => handleOpenHistoryAchievement(hist)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs transition-colors cursor-pointer"
                  >
                    <Trophy className="w-3.5 h-3.5" />
                    <span>View Milestone Card</span>
                  </button>
                  <button
                    onClick={() => handleOpenHistoryAchievement(hist)}
                    className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                    title="Share"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* ─── 3. Farm Check Areas Progress & Coverage ───────────────────── */}
      <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-[#045D61]/15 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-serif text-xl font-bold text-slate-900">
              8 Key Capability Areas
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Review your farm's status across all 8 framework pillars. ({reviewedPillars.length} of 8 Reviewed)
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-xs font-bold text-slate-700">Audit Progress:</span>
            <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-[#009924]/15 text-[#009924] border border-[#009924]/30">
              {Math.round((reviewedPillars.length / (pillars.length || 8)) * 100)}% Complete
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {pillars.map((p) => {
            const rawScore = pillarScores[p.id];
            const checked = typeof rawScore === 'number';
            const scorePct = checked
              ? Math.round(rawScore <= 1 ? rawScore * 100 : (rawScore / 3) * 100)
              : 0;

            return (
              <div
                key={`pillar-checklist-${p.id}`}
                className={`flex items-start justify-between gap-3 p-4 rounded-2xl border transition-all ${
                  checked
                    ? 'border-[#009924]/30 bg-emerald-50/40 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-start gap-3 min-w-0">
                  {checked ? (
                    <CheckCircle className="w-5 h-5 text-[#009924] flex-shrink-0 mt-0.5" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-300 flex-shrink-0 mt-0.5" />
                  )}
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-slate-900 truncate">{p.name}</div>
                    <div className="text-xs text-slate-500 mt-0.5 line-clamp-1">{p.description}</div>
                    <div
                      className={`text-xs mt-1 font-semibold ${
                        checked ? 'text-[#009924]' : 'text-slate-400'
                      }`}
                    >
                      {checked ? `Reviewed · ${scorePct}% Maturity` : 'Not yet reviewed'}
                    </div>
                  </div>
                </div>

                {checked && (
                  <button
                    onClick={() => handleOpenPillarAchievement(p.id, p.name)}
                    className="text-xs font-black px-2.5 py-1 rounded-lg bg-[#009924]/10 hover:bg-[#009924]/20 text-[#009924] flex-shrink-0 transition-colors cursor-pointer"
                    title="View Pillar Achievement Card"
                  >
                    {scorePct}% Card →
                  </button>
                )}
              </div>
            );
          })}
        </div>

        <div className="pt-2 flex flex-wrap items-center gap-3">
          <button
            onClick={() => setScreen('screen-assessment-choice')}
            className="px-5 py-3 rounded-xl bg-[#045D61] hover:bg-[#023c3f] text-white font-bold text-xs sm:text-sm transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Start or Update a Farm Check</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setScreen('screen-history')}
            className="px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm transition-colors cursor-pointer"
          >
            View Check History
          </button>
        </div>
      </div>

      {/* ─── 4. Suggested Next Steps ───────────────────────────────────── */}
      <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-[#045D61]/15 shadow-sm space-y-6">
        <div>
          <h3 className="font-serif text-xl font-bold text-slate-900">Suggested Next Steps</h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Practical improvements tailored for your farm to level up your score and unlock higher tier achievements.
          </p>
        </div>

        {recommendations.length === 0 ? (
          <div className="text-center py-10 space-y-3 bg-slate-50/70 rounded-2xl border border-slate-200/60 p-6">
            <div className="w-12 h-12 rounded-2xl bg-[#045D61]/10 text-[#045D61] flex items-center justify-center mx-auto text-xl">
              🌱
            </div>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
              Complete your Farm Check to unlock personalized high-impact recommendations.
            </p>
            <button
              onClick={() => setScreen('screen-assessment-choice')}
              className="px-5 py-2.5 rounded-xl bg-[#009924] hover:bg-[#007a1c] text-white font-bold text-xs transition-colors shadow-sm cursor-pointer"
            >
              Do a Farm Check
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {recommendations.slice(0, 6).map((r, i) => {
              const label =
                r.priority === 'quick_win'
                  ? 'Easy Win'
                  : r.priority === 'medium_term'
                  ? 'Medium Term'
                  : r.priority === 'strategic'
                  ? 'Strategic'
                  : 'Next Step';

              const badgeCls =
                r.priority === 'quick_win'
                  ? 'bg-[#009924]/15 text-[#009924] border-[#009924]/30'
                  : r.priority === 'medium_term'
                  ? 'bg-[#1E88E5]/15 text-[#1E88E5] border-[#1E88E5]/30'
                  : 'bg-[#FB8C00]/15 text-[#FB8C00] border-[#FB8C00]/30';

              return (
                <div
                  key={i}
                  className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-[#045D61]/30 transition-colors space-y-2 shadow-xs"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${badgeCls}`}>
                      {label}
                    </span>
                    <span className="text-xs font-bold text-slate-500 truncate">{r.pillar_name}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-800 leading-snug font-medium">
                    {r.recommended_action}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default JourneyPage;
