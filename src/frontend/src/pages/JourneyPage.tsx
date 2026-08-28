import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store/useStore';
import { portalApi } from '../services/api';
import { Badge, Quest, LeaderboardEntry } from '../types';
import {
  CheckCircle,
  Flame,
  Loader2,
} from 'lucide-react';

// Icon lookup so live backend badges that are missing an icon
// (e.g. from a stale localStorage cache) can always fall back to
// the hardcoded emoji defined here.
const BADGE_ICON_MAP: Record<string, string> = {
  soil_guardian: '🌱',
  quick_learner: '📚',
  future_ready_100k: '🌾',
  digital_pioneer: '📱',
  solar_champion: '⚡',
  master_steward: '👑',
  // engine.py catalogue keys
  water_steward: '💧',
  biodiversity_hero: '🌱',
  mechanization_pioneer: '🚜',
  market_master: '💳',
  safety_shield: '🛡️',
  circular_champion: '♻️',
  governance_pro: '📈',
  assessment_veteran: '🚀',
  service_implementer: '🛠️',
};

const MASTER_BADGES: Badge[] = [
  {
    key: 'soil_guardian',
    title: 'Soil Guardian',
    description: 'Active organic composting & soil health baseline.',
    icon: '🌱',
    rarity: 'Bronze',
    is_unlocked: true,
  },
  {
    key: 'quick_learner',
    title: 'Quick Learner',
    description: 'Completed first 3 regenerative learning academy audio modules.',
    icon: '📚',
    rarity: 'Bronze',
    is_unlocked: true,
  },
  {
    key: 'future_ready_100k',
    title: 'Future Ready 100k',
    description: 'Registered verified enterprise in the Future Farms directory.',
    icon: '🌾',
    rarity: 'Silver',
    is_unlocked: true,
  },
  {
    key: 'digital_pioneer',
    title: 'Digital Pioneer',
    description: 'Baseline farm technology readiness & digital bookkeeping records.',
    icon: '📱',
    rarity: 'Silver',
    is_unlocked: false,
  },
  {
    key: 'solar_champion',
    title: 'Solar Champion',
    description: 'Adopted solar-powered drip irrigation or renewable cold storage.',
    icon: '⚡',
    rarity: 'Gold',
    is_unlocked: false,
  },
  {
    key: 'master_steward',
    title: 'Master Steward',
    description: 'Achieved Tier 4 Investment Ready status across all 8 pillars.',
    icon: '👑',
    rarity: 'Diamond',
    is_unlocked: false,
  },
];

export const JourneyPage: React.FC = () => {
  const { gamification, claimQuest, user, setScreen } = useAppStore();
  const [badgeFilter, setBadgeFilter] = useState<'all' | 'unlocked' | 'locked'>('all');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loadingLb, setLoadingLb] = useState(false);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    setLoadingLb(true);
    try {
      const res = await portalApi.getLeaderboard('All Regions');
      setLeaderboard(res.top_entries);
    } catch {
      // Fallback mock data
      setLeaderboard([
        {
          rank: 1,
          farmer_name: 'Grace Wanjiku',
          farm_name: 'Highland Dairy & Avocado',
          region: 'All Regions',
          tier: 4,
          tier_name: 'Investment Ready Farm',
          ffmi_score: 18.5,
          level: 5,
          total_xp: 3200,
          weekly_xp_delta: 450,
        },
        {
          rank: 2,
          farmer_name: user.name || 'Joseph Ochieng',
          farm_name: user.farm_name || 'Kakamega Demonstration Farm',
          region: 'All Regions',
          tier: user.tier || 3,
          tier_name: user.tier_name || 'Structured Farm',
          ffmi_score: user.ffmi_score || 13.8,
          level: gamification.level,
          total_xp: gamification.total_xp,
          weekly_xp_delta: 280,
          is_current_user: true,
        },
        {
          rank: 3,
          farmer_name: 'Peter Kiprop',
          farm_name: 'Sergoit Grain Enterprise',
          region: 'All Regions',
          tier: 3,
          tier_name: 'Structured Farm',
          ffmi_score: 12.9,
          level: 3,
          total_xp: 890,
          weekly_xp_delta: 120,
        },
      ]);
    } finally {
      setLoadingLb(false);
    }
  };

  const quests: Quest[] = [
    {
      id: 'quest_soil_baseline',
      title: 'Complete Smart Farming Baseline',
      description: 'Run through the Pillar 1 capability questions to establish digital records.',
      xp_reward: 100,
      is_completed: true,
      is_claimed: gamification.claimed_quest_ids.includes('quest_soil_baseline'),
      target_screen: 'screen-assessment-choice',
    },
    {
      id: 'quest_clean_energy',
      title: 'Renewable Energy Gap Assessment',
      description: 'Audit your solar irrigation and energy requirements to earn solar badges.',
      xp_reward: 150,
      is_completed: false,
      is_claimed: false,
      target_screen: 'screen-assessment-choice',
    },
    {
      id: 'quest_browse_services',
      title: 'Connect with Verified Providers',
      description: 'Browse the agro-dealers portal and inspect mechanization pricing.',
      xp_reward: 50,
      is_completed: false,
      is_claimed: false,
      target_screen: 'screen-services',
    },
  ];

  // Prefer live backend badges; fall back to the curated showcase list.
  const liveBadges: Badge[] = gamification.badges && gamification.badges.length
    ? gamification.badges
    : MASTER_BADGES.map((b) => ({
        ...b,
        is_unlocked: gamification.unlocked_badge_keys.includes(b.key),
      }));

  const filteredBadges = liveBadges.filter((b) => {
    if (badgeFilter === 'unlocked') return b.is_unlocked;
    if (badgeFilter === 'locked') return !b.is_unlocked;
    return true;
  });

  return (
    <div className="space-y-8">
      {/* ─── Gamification Banner ─────────────────────────────────────── */}
      <div className="p-8 rounded-3xl bg-gradient-to-br from-[#023c3f] via-[#045D61] to-[#012527] border border-[#045D61]/30 text-white shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/10 text-[#FFD700] border border-[#FFD700]/30 uppercase tracking-wider">
              Level {gamification.level} • {gamification.level_name}
            </span>
          </div>
          <h1 className="text-3xl font-serif font-bold tracking-tight text-white">
            Transformation Journey &amp; Trophies
          </h1>
          <p className="text-xs text-white/80">
            Earn verified experience points (XP), complete capability milestones, and climb your regional farmer leaderboard.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-white/10 border border-white/15 text-center">
            <div className="text-[10px] uppercase font-bold text-white/80">Total XP</div>
            <div className="text-2xl font-extrabold text-white">
              {(gamification?.total_xp ?? 0).toLocaleString()}
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-[#EF6C00]/25 border border-[#FFD700]/35 text-center">
            <div className="text-[10px] uppercase font-bold text-[#FFD700]">Active Streak</div>
            <div className="text-2xl font-extrabold text-[#FFD700] flex items-center justify-center gap-1">
              <Flame className="w-5 h-5 text-[#FFD700]" />
              <span>{gamification.streak_days}d</span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Active Quests ───────────────────────────────────────────── */}
      <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-[#045D61]/15 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#009924]">
              Active Missions
            </span>
            <h3 className="font-serif text-xl font-bold text-slate-900">
              Capability Quests
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quests.map((q) => (
            <div
              key={q.id}
              className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#009924]/15 text-[#009924] border border-[#009924]/30">
                    +{q.xp_reward} XP
                  </span>
                  {q.is_completed && (
                    <span className="text-xs text-[#009924] font-bold flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> Done
                    </span>
                  )}
                </div>
                <h4 className="font-bold text-sm text-slate-900">{q.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {q.description}
                </p>
              </div>

              {q.is_completed && !q.is_claimed ? (
                <button
                  onClick={() => claimQuest(q.id, q.xp_reward)}
                  className="w-full py-2 rounded-xl bg-[#EF6C00] hover:bg-[#d85f00] text-white font-bold text-xs shadow-md transition-colors"
                >
                  Claim +{q.xp_reward} XP Reward ➔
                </button>
              ) : q.is_claimed ? (
                <button
                  disabled
                  className="w-full py-2 rounded-xl bg-slate-100 text-slate-400 font-semibold text-xs cursor-default"
                >
                  Reward Claimed
                </button>
              ) : (
                <button
                  onClick={() => q.target_screen && setScreen(q.target_screen)}
                  className="w-full py-2 rounded-xl bg-[#045D61] hover:bg-[#023c3f] text-white font-bold text-xs transition-colors shadow-sm"
                >
                  Start Quest
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ─── Badge Showcase & Trophy Cabinet ─────────────────────────── */}
      <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-[#045D61]/15 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#009924]">
              Verifiable Milestones
            </span>
            <h3 className="font-serif text-xl font-bold text-slate-900">
              Master Trophy Cabinet
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {(['all', 'unlocked', 'locked'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setBadgeFilter(filter)}
                className={`px-3 py-1 rounded-xl text-xs font-bold capitalize transition-colors ${
                  badgeFilter === filter
                    ? 'bg-[#045D61] text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredBadges.map((badge) => (
            <div
              key={badge.key}
              className={`p-5 rounded-2xl border transition-all ${
                badge.is_unlocked
                  ? 'bg-white border-[#009924]/40 shadow-md'
                  : 'bg-slate-50/70 border-slate-200 opacity-60'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="text-3xl">
                  {badge.icon || BADGE_ICON_MAP[badge.key] || '🏅'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900">{badge.title}</h4>
                    <span
                      className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded ${
                        badge.rarity === 'Diamond'
                          ? 'bg-purple-100 text-purple-800'
                          : badge.rarity === 'Gold'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {badge.rarity}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">{badge.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Regional Leaderboard ────────────────────────────────────── */}
      <div
        className="rounded-3xl overflow-hidden"
        style={{
          background: 'var(--color-surface-white, #ffffff)',
          border: '1px solid rgba(4,93,97,0.15)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
          marginBottom: '2.5rem',
        }}
      >
        {/* Header */}
        <div
          className="px-6 sm:px-8 pt-6 sm:pt-8 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          style={{ borderBottom: '1px solid rgba(4,93,97,0.1)' }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shadow-sm"
              style={{ background: 'linear-gradient(135deg, #045D61 0%, #009924 100%)' }}
            >
              🏆
            </div>
            <div>
              <span
                className="block text-[10px] font-extrabold uppercase tracking-widest"
                style={{ color: '#009924' }}
              >
                Peer Benchmarking
              </span>
              <h3 className="font-serif text-xl font-bold" style={{ color: '#022c24' }}>
                National Smallholder Leaderboard
              </h3>
            </div>
          </div>

          <p className="text-xs font-semibold" style={{ color: '#64748b' }}>
            Top 10 farmers across all regions
          </p>
        </div>

        {loadingLb ? (
          <div className="flex items-center justify-center py-16 text-sm font-semibold" style={{ color: '#64748b' }}>
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            Loading regional rankings…
          </div>
        ) : (
          <>
            {/* ── Top-3 Podium ─────────────────────────────────── */}
            {leaderboard.length >= 3 && (
              <div
                className="px-6 sm:px-8 py-8"
                style={{
                  background: 'linear-gradient(135deg, #022c24 0%, #04382d 100%)',
                }}
              >
                <p
                  className="text-center text-xs font-extrabold uppercase tracking-widest mb-6"
                  style={{ color: 'rgba(255,255,255,0.5)' }}
                >
                  Top Performers — All Regions
                </p>
                {/* Podium: 2nd | 1st | 3rd */}
                <div
                  className="grid gap-4"
                  style={{ gridTemplateColumns: '1fr 1.15fr 1fr', alignItems: 'end' }}
                >
                  {[leaderboard[1], leaderboard[0], leaderboard[2]].map((entry, podiumIdx) => {
                    if (!entry) return null;
                    const isFirst = entry.rank === 1;
                    const isSecond = entry.rank === 2;
                    const rankMedal = ['🥇', '🥈', '🥉'][entry.rank - 1] || `#${entry.rank}`;
                    const podiumStyles: React.CSSProperties = isFirst
                      ? {
                          background: 'linear-gradient(160deg, #ffd700 0%, #f59e0b 100%)',
                          border: '2px solid rgba(255,215,0,0.6)',
                          minHeight: 240,
                          boxShadow: '0 0 40px rgba(255,215,0,0.35), 0 8px 32px rgba(0,0,0,0.4)',
                        }
                      : isSecond
                      ? {
                          background: 'linear-gradient(160deg, #334155 0%, #1e293b 100%)',
                          border: '1px solid rgba(148,163,184,0.4)',
                          minHeight: 200,
                        }
                      : {
                          background: 'linear-gradient(160deg, #44200a 0%, #78350f 100%)',
                          border: '1px solid rgba(217,119,6,0.4)',
                          minHeight: 190,
                        };

                    const nameColor = isFirst ? '#022c24' : '#ffffff';
                    const metaColor = isFirst ? 'rgba(2,44,36,0.7)' : 'rgba(255,255,255,0.65)';
                    const scoreColor = isFirst ? '#022c24' : '#ffffff';

                    const tierColors: Record<number, string> = {
                      1: '#dc2626', 2: '#ea580c', 3: '#ca8a04',
                      4: '#16a34a', 5: '#0891b2',
                    };

                    return (
                      <div
                        key={entry.rank}
                        className="rounded-2xl p-5 text-center flex flex-col items-center transition-transform duration-300 hover:-translate-y-1 relative overflow-hidden"
                        style={{ ...podiumStyles, order: podiumIdx === 0 ? 1 : podiumIdx === 1 ? 0 : 2 }}
                      >
                        {/* Crown sparkle for 1st */}
                        {isFirst && (
                          <div
                            className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
                            style={{ background: 'linear-gradient(90deg, #ffd700, #f59e0b, #ffd700)' }}
                          />
                        )}

                        {/* Medal */}
                        <div className="text-3xl mb-1">{rankMedal}</div>

                        {/* Avatar */}
                        <div
                          className="text-4xl mb-2"
                          style={{ filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.25))' }}
                        >
                          🧑‍🌾
                        </div>

                        {/* Name */}
                        <p className="font-serif font-bold text-sm leading-tight mb-0.5" style={{ color: nameColor }}>
                          {entry.farmer_name}
                          {entry.is_current_user && (
                            <span
                              className="ml-1 text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-full"
                              style={{ background: isFirst ? 'rgba(2,44,36,0.2)' : 'rgba(255,255,255,0.2)', color: nameColor }}
                            >
                              You
                            </span>
                          )}
                        </p>
                        <p className="text-[11px] mb-2" style={{ color: metaColor }}>
                          {entry.farm_name}
                        </p>

                        {/* Tier badge */}
                        <span
                          className="text-[10px] font-bold px-2.5 py-0.5 rounded-full mb-2"
                          style={{
                            background: tierColors[entry.tier] || '#045D61',
                            color: '#ffffff',
                          }}
                        >
                          Tier {entry.tier}
                        </span>

                        {/* Score pill */}
                        <div
                          className="rounded-full px-3 py-1 text-sm font-extrabold font-mono mb-1"
                          style={{
                            background: isFirst ? 'rgba(2,44,36,0.15)' : 'rgba(255,255,255,0.12)',
                            color: scoreColor,
                            border: `1px solid ${isFirst ? 'rgba(2,44,36,0.2)' : 'rgba(255,255,255,0.2)'}`,
                          }}
                        >
                          {Number(entry.ffmi_score).toFixed(2)} pts
                        </div>

                        {/* XP */}
                        <p className="text-[11px] font-bold" style={{ color: metaColor }}>
                          {(entry.total_xp ?? 0).toLocaleString()} XP
                          {entry.weekly_xp_delta > 0 && (
                            <span style={{ color: isFirst ? 'rgba(2,44,36,0.8)' : '#4ade80' }}>
                              {' '}↑{entry.weekly_xp_delta} this week
                            </span>
                          )}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── Cohort Table ─────────────────────────────────── */}
            <div className="overflow-x-auto">
              <table className="w-full text-left" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
                <thead>
                  <tr style={{ background: '#f8faf9', borderBottom: '1px solid rgba(4,93,97,0.1)' }}>
                    {['Rank', 'Farmer & Enterprise', 'Region', 'Maturity Tier', 'FFMI Score', 'Level', 'Total XP'].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-[11px] font-extrabold uppercase tracking-widest"
                        style={{ color: '#64748b' }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.slice(3).map((entry) => {
                    const tierColors: Record<number, { bg: string; text: string }> = {
                      1: { bg: 'rgba(220,38,38,0.1)', text: '#dc2626' },
                      2: { bg: 'rgba(234,88,12,0.1)', text: '#ea580c' },
                      3: { bg: 'rgba(202,138,4,0.1)', text: '#a16207' },
                      4: { bg: 'rgba(22,163,74,0.1)', text: '#15803d' },
                      5: { bg: 'rgba(8,145,178,0.1)', text: '#0369a1' },
                    };
                    const tc = tierColors[entry.tier] || { bg: 'rgba(4,93,97,0.1)', text: '#045D61' };
                    const rankEmoji = entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : null;
                    return (
                      <tr
                        key={entry.rank}
                        style={
                          entry.is_current_user
                            ? {
                                background: 'linear-gradient(90deg, rgba(0,153,36,0.07) 0%, rgba(4,93,97,0.07) 100%)',
                                borderLeft: '3px solid #009924',
                              }
                            : {}
                        }
                        className="transition-colors hover:bg-slate-50"
                      >
                        {/* Rank */}
                        <td className="px-4 py-3.5" style={{ borderBottom: '1px solid #f1f5f3' }}>
                          <span
                            className="font-mono font-extrabold text-sm"
                            style={{ color: entry.rank <= 3 ? '#d97706' : '#94a3b8' }}
                          >
                            {rankEmoji ? `${rankEmoji}` : `#${entry.rank}`}
                          </span>
                        </td>

                        {/* Farmer */}
                        <td className="px-4 py-3.5" style={{ borderBottom: '1px solid #f1f5f3' }}>
                          <div
                            className="font-bold text-sm flex items-center gap-1.5"
                            style={{ color: '#022c24' }}
                          >
                            🧑‍🌾 {entry.farmer_name}
                            {entry.is_current_user && (
                              <span
                                className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-full"
                                style={{ background: 'rgba(0,153,36,0.12)', color: '#009924' }}
                              >
                                You
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] mt-0.5" style={{ color: '#94a3b8' }}>
                            {entry.farm_name}
                          </div>
                        </td>

                        {/* Region */}
                        <td className="px-4 py-3.5" style={{ borderBottom: '1px solid #f1f5f3' }}>
                          <span
                            className="text-[10px] font-bold px-2.5 py-1 rounded-full"
                            style={{ background: 'rgba(4,93,97,0.08)', color: '#045D61' }}
                          >
                            {entry.region}
                          </span>
                        </td>

                        {/* Tier */}
                        <td className="px-4 py-3.5" style={{ borderBottom: '1px solid #f1f5f3' }}>
                          <span
                            className="px-2.5 py-1 rounded-full text-[10px] font-bold"
                            style={{ background: tc.bg, color: tc.text }}
                          >
                            Tier {entry.tier} · {entry.tier_name.split(' ').slice(0, 2).join(' ')}
                          </span>
                        </td>

                        {/* FFMI */}
                        <td className="px-4 py-3.5 font-mono font-bold text-sm" style={{ color: '#045D61', borderBottom: '1px solid #f1f5f3' }}>
                          {Number(entry.ffmi_score ?? 0).toFixed(2)}
                          <span className="text-[10px] font-normal ml-0.5" style={{ color: '#94a3b8' }}>/ 24</span>
                        </td>

                        {/* Level */}
                        <td className="px-4 py-3.5" style={{ borderBottom: '1px solid #f1f5f3' }}>
                          <span
                            className="text-xs font-extrabold px-2 py-0.5 rounded-full"
                            style={{ background: 'rgba(255,215,0,0.15)', color: '#b45309' }}
                          >
                            Lvl {entry.level}
                          </span>
                        </td>

                        {/* XP */}
                        <td className="px-4 py-3.5 text-right" style={{ borderBottom: '1px solid #f1f5f3' }}>
                          <span className="font-mono font-bold text-sm" style={{ color: '#022c24' }}>
                            {(entry.total_xp ?? 0).toLocaleString()}
                          </span>
                          <span className="text-[10px] ml-0.5" style={{ color: '#94a3b8' }}>XP</span>
                          {entry.weekly_xp_delta > 0 && (
                            <div className="text-[10px] font-bold" style={{ color: '#16a34a' }}>
                              +{entry.weekly_xp_delta} wk
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

    </div>
  );
};
