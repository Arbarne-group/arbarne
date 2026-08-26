import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store/useStore';
import { portalApi } from '../services/api';
import { Badge, Quest, LeaderboardEntry, TIER_CLASSIFICATION_COLORS } from '../types';
import {
  CheckCircle,
  Flame,
  Loader2,
  Users,
} from 'lucide-react';

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
  const [leaderboardRegion, setLeaderboardRegion] = useState('Western Kenya');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loadingLb, setLoadingLb] = useState(false);

  useEffect(() => {
    fetchLeaderboard(leaderboardRegion);
  }, [leaderboardRegion]);

  const fetchLeaderboard = async (region: string) => {
    setLoadingLb(true);
    try {
      const res = await portalApi.getLeaderboard(region);
      setLeaderboard(res.top_entries);
    } catch {
      // Fallback mock data
      setLeaderboard([
        {
          rank: 1,
          farmer_name: 'Grace Wanjiku',
          farm_name: 'Highland Dairy & Avocado',
          region,
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
          region,
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
          region,
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

  const filteredBadges = MASTER_BADGES.map((b) => ({
    ...b,
    is_unlocked: gamification.unlocked_badge_keys.includes(b.key),
  })).filter((b) => {
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
              {gamification.total_xp.toLocaleString()}
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
                <div className="text-3xl">{badge.icon}</div>
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
      <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-[#045D61]/15 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#045D61]/15 text-[#045D61] flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#009924]">
                Peer Benchmarking
              </span>
              <h3 className="font-serif text-xl font-bold text-slate-900">
                Regional Transformation Leaderboard
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {['Western Kenya', 'Rift Valley', 'Central Kenya'].map((r) => (
              <button
                key={r}
                onClick={() => setLeaderboardRegion(r)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors ${
                  leaderboardRegion === r
                    ? 'bg-[#045D61] text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {loadingLb ? (
          <div className="flex items-center justify-center py-12 text-xs font-semibold text-slate-500">
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            <span>Loading regional rankings...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="pb-3 px-3">Rank</th>
                  <th className="pb-3 px-3">Farmer &amp; Enterprise</th>
                  <th className="pb-3 px-3">Maturity Tier</th>
                  <th className="pb-3 px-3">FFMI Score</th>
                  <th className="pb-3 px-3 text-right">Total XP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {leaderboard.map((entry) => {
                  const tierMeta = TIER_CLASSIFICATION_COLORS[entry.tier] || {
                    hex: '#045D61',
                  };
                  return (
                    <tr
                      key={entry.rank}
                      className={`hover:bg-slate-50 transition-colors ${
                        entry.is_current_user ? 'bg-[#045D61]/10 font-bold' : ''
                      }`}
                    >
                      <td className="py-3 px-3 font-mono font-extrabold text-sm">
                        #{entry.rank}
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900">{entry.farmer_name}</div>
                        <div className="text-[11px] text-slate-500">{entry.farm_name}</div>
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className="px-2 py-0.5 rounded-full text-white font-semibold text-[10px] shadow-sm"
                          style={{ backgroundColor: tierMeta.hex }}
                        >
                          Tier {entry.tier} {entry.tier_name.split(' ')[0]}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-[#045D61]">
                        {entry.ffmi_score.toFixed(2)} pts
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                        {entry.total_xp.toLocaleString()} XP
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
