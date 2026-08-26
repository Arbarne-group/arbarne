import React from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../store/useStore';
import { RadarChart } from '../components/charts/RadarChart';
import {
  ArrowRight,
  Award,
  AlertTriangle,
  Shield,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user, gamification, setScreen, assessment } = useAppStore();

  const latest = assessment.latestResult;
  const ffmiScore = latest ? latest.ffmi_score : user.ffmi_score || 13.8;
  const tier = latest ? latest.tier : user.tier || 3;
  const tierName = latest ? latest.tier_name : user.tier_name || 'Structured Farm';

  const dividendKes = latest?.economic_dividend?.dividend_gain_kes || 248685;

  return (
    <div className="space-y-6">
      {/* ─── 1. Hero Card with Animated Logo & Watermark ────────────────── */}
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
                Karibu, {user.name.split(' ')[0] || 'Farmer'}.
                <br />
                <span className="text-[#FFD700] italic">The Great Transition.</span>
              </h1>
              <p className="text-xs sm:text-sm text-white/80 flex flex-wrap items-center gap-2 pt-0.5">
                <span>📍 {user.farm_name || 'Kakamega Demofarm'}</span>
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

      {/* ─── 2. Active Quest & Gamification Banner ──────────────────────── */}
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

      {/* ─── 3. Three Pillar Portals ───────────────────────────────────── */}
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
          <div className="flex gap-2 pt-2">
            <button
              onClick={() => setScreen('screen-assessment-choice')}
              className="flex-1 py-2 rounded-xl bg-[#009924] hover:bg-[#007a1c] text-white text-xs font-bold transition-colors shadow-sm"
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

      {/* ─── 4. Priority Transformation Gap ───────────────────────────── */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#FB8C00]/10 border border-[#FB8C00]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FB8C00]/20 text-[#FB8C00] flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900">Transformation Gaps Identified</div>
            <div className="text-xs text-slate-700">
              <span className="font-bold text-[#009924]">Strongest:</span> Pillar 1 Smart Farming &amp; Digital •{' '}
              <span className="font-bold text-[#D32F2F]">Priority Gap:</span> Pillar 2 Productive Use of Renewable Energy
            </div>
          </div>
        </div>
        <button
          onClick={() => setScreen('screen-assessment-choice')}
          className="px-4 py-2 rounded-xl bg-[#FB8C00] hover:bg-[#e07d00] text-white text-xs font-bold transition-colors whitespace-nowrap shadow-sm"
        >
          Explore Action Plan
        </button>
      </div>

      {/* ─── 5. Capability Analytics & Benchmarks ──────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar Profile */}
        <div className="p-6 rounded-3xl glass-panel shadow-sm border border-[#045D61]/15 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#009924]">
                Closed Cross-Pillar Metrics
              </span>
              <h3 className="font-serif text-lg font-bold text-slate-900">
                8-Pillar Maturity Profile
              </h3>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#045D61]/15 text-[#045D61] border border-[#045D61]/30">
              Interactive Spider Chart
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
                KES {dividendKes.toLocaleString()}
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
