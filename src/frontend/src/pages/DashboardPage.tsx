import React from 'react';
import { useAppStore } from '../store/useStore';
import { RadarChart } from '../components/charts/RadarChart';
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  Award,
  AlertTriangle,
  Zap,
  CheckCircle,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user, gamification, setScreen, assessment } = useAppStore();

  const latest = assessment.latestResult;
  const ffmiScore = latest ? latest.ffmi_score : user.ffmi_score || 13.8;
  const tier = latest ? latest.tier : user.tier || 3;
  const tierName = latest ? latest.tier_name : user.tier_name || 'Commercializing Farm';

  const dividendKes = latest?.economic_dividend?.dividend_gain_kes || 248685;

  return (
    <div className="space-y-6">
      {/* ─── Hero Card ─────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#022c24] via-[#03362c] to-[#011913] border border-emerald-500/30 p-6 sm:p-10 shadow-2xl text-white">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="h-0.5 w-6 bg-emerald-400 rounded-full" />
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-400">
                Arbarne Agriculture Group • Live Farm Intelligence
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
              Karibu, {user.name.split(' ')[0] || 'Farmer'}.
              <br />
              <span className="text-sprout-400 italic">The Great Transition.</span>
            </h1>
            <p className="text-xs sm:text-sm text-white/70 flex items-center gap-2 pt-1">
              <span>📍 {user.farm_name || 'Kakamega Demofarm'}</span>
              <span>•</span>
              <span>{user.farm_region || 'Western Kenya'}</span>
              <span>•</span>
              <span>{user.farm_size_acres || 5} Acres</span>
            </p>
          </div>

          {/* KPI Snapshot Pills */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="px-5 py-3 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-md">
              <div className="text-[10px] font-bold uppercase tracking-wider text-sprout-300">
                Maturity Status
              </div>
              <div className="text-base font-bold text-white">
                Tier {tier} {tierName.split(' ')[0]}
              </div>
            </div>

            <div className="px-5 py-3 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 backdrop-blur-md">
              <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                FFMI Maturity Index
              </div>
              <div className="text-xl font-extrabold text-white">
                {ffmiScore.toFixed(2)}{' '}
                <span className="text-xs font-normal text-white/60">/ 24.00</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action CTAs */}
        <div className="relative z-10 flex flex-wrap gap-3 mt-6 pt-6 border-t border-white/10">
          <button
            onClick={() => setScreen('screen-assessment-choice')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-pine-950 font-bold text-xs shadow-lg shadow-emerald-500/30 transition-all hover:scale-105"
          >
            <span>Start Capability Assessment</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => setScreen('screen-journey')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/15 transition-all"
          >
            <Award className="w-4 h-4 text-amber-400" />
            <span>Transformation Roadmap &amp; Quests</span>
          </button>
        </div>
      </div>

      {/* ─── Active Quest & Gamification Banner ────────────────────────── */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#03362c] to-[#022c24] border border-emerald-400/20 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-xl">
            🏆
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold text-amber-400 uppercase tracking-wider">
                Level {gamification.level}: {gamification.level_name}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 font-bold">
                {gamification.streak_days}-Day Streak 🔥
              </span>
            </div>
            <p className="text-xs text-white/80 mt-0.5">
              Complete the <span className="font-semibold text-white">Smart Farming Baseline Quest</span> to unlock 150 XP and the Digital Pioneer Badge.
            </p>
          </div>
        </div>
        <button
          onClick={() => setScreen('screen-journey')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-pine-950 text-xs font-bold shadow-md transition-all whitespace-nowrap"
        >
          <span>Open Quests &amp; Badges</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* ─── Three Pillar Portals ─────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl glass-panel hover:shadow-xl transition-all border border-emerald-900/10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-2xl">📝</span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              Diagnostic Engine
            </span>
          </div>
          <h3 className="font-serif text-lg font-bold text-pine-950">Assessment Hub</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Evaluate your farm readiness across the 8 FFF pillars. Choose a quick Single-Pillar deep dive or a comprehensive baseline.
          </p>
          <div className="flex gap-2 pt-2">
            <button
              onClick={() => setScreen('screen-assessment-choice')}
              className="flex-1 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition-colors"
            >
              Start Audit
            </button>
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-panel hover:shadow-xl transition-all border border-emerald-900/10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-2xl">🛠️</span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
              Inputs &amp; Tech
            </span>
          </div>
          <h3 className="font-serif text-lg font-bold text-pine-950">Services Portal</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Connect with vetted mechanization providers, solar drip irrigation, agroforestry nurseries, and soil test labs matching your capability gaps.
          </p>
          <div className="pt-2">
            <button
              onClick={() => setScreen('screen-services')}
              className="w-full py-2 rounded-xl bg-pine-900 hover:bg-pine-800 text-white text-xs font-bold transition-colors"
            >
              Explore Agro-Services
            </button>
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-panel hover:shadow-xl transition-all border border-emerald-900/10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-2xl">📚</span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
              Agronomic Skills
            </span>
          </div>
          <h3 className="font-serif text-lg font-bold text-pine-950">Learning Academy</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Practical, audio-assisted training modules on regenerative IPM, farm gross-margin ledgers, and organic biochar composting.
          </p>
          <div className="pt-2">
            <button
              onClick={() => setScreen('screen-learning')}
              className="w-full py-2 rounded-xl bg-pine-900 hover:bg-pine-800 text-white text-xs font-bold transition-colors"
            >
              Open Learning Modules
            </button>
          </div>
        </div>
      </div>

      {/* ─── Priority Transformation Gap ─────────────────────────────── */}
      <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-700 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-amber-900">Transformation Gaps Identified</div>
            <div className="text-xs text-amber-800">
              <span className="font-semibold text-emerald-800">Strongest:</span> Pillar 1 Smart Farming &amp; Digital •{' '}
              <span className="font-semibold text-red-800">Priority Gap:</span> Pillar 2 Productive Use of Renewable Energy
            </div>
          </div>
        </div>
        <button
          onClick={() => setScreen('screen-assessment-choice')}
          className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors whitespace-nowrap"
        >
          Explore Action Plan
        </button>
      </div>

      {/* ─── Capability Analytics & Benchmarks ────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar Profile */}
        <div className="p-6 rounded-3xl glass-panel shadow-sm border border-emerald-900/10 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-600">
                Closed Cross-Pillar Metrics
              </span>
              <h3 className="font-serif text-lg font-bold text-pine-950">
                8-Pillar Maturity Profile
              </h3>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
              Interactive Spider Chart
            </span>
          </div>

          <RadarChart pillarScores={latest?.pillar_scores} />

          <div className="flex items-center justify-center gap-6 text-xs text-slate-600 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <span>Your Farm Enterprise</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-500" />
              <span>Regional Peer Average</span>
            </div>
          </div>
        </div>

        {/* Economic Dividend Projections */}
        <div className="p-6 rounded-3xl glass-panel shadow-sm border border-emerald-900/10 space-y-5">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-600">
              Empirical ROI Projection
            </span>
            <h3 className="font-serif text-lg font-bold text-pine-950">
              Projected Economic Dividend
            </h3>
            <p className="text-xs text-slate-600">
              Financial and agronomic returns from resolving priority capability gaps.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                Projected Yield
              </span>
              <div className="text-2xl font-bold text-emerald-900">
                19.2 <span className="text-xs font-normal text-emerald-700">bags/ac</span>
              </div>
              <span className="text-[10px] text-emerald-600 font-semibold">
                +45% vs baseline
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">
                Net Annual Gain
              </span>
              <div className="text-2xl font-bold text-amber-900">
                KES {dividendKes.toLocaleString()}
              </div>
              <span className="text-[10px] text-amber-600 font-semibold">
                +58% profitability dividend
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#022c24] text-white space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-sprout-400">Next Target: Tier 4</span>
              <span className="text-white/60">Commercial Agribusiness</span>
            </div>
            <div className="text-xs text-white/80 leading-relaxed">
              Target Score: <span className="font-bold text-white">15.00 pts</span> • Gap to close: <span className="font-bold text-sprout-400">+1.20 pts</span>.
            </div>
            <button
              onClick={() => setScreen('screen-simulator')}
              className="w-full mt-2 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-pine-950 font-bold text-xs transition-colors"
            >
              Simulate Tier 4 ROI in Scenario Simulator ➔
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
