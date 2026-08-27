import React, { useEffect, useState } from 'react';
import { ArrowRight, BarChart3, BookOpen, CheckCircle2, ChevronRight, CircleAlert, Compass, Target } from 'lucide-react';
import { useAppStore } from '../store/useStore';
import { portalApi } from '../services/api';

const FALLBACK_SCORES: Record<number, number> = { 1: 0.72, 2: 0.45, 3: 0.85, 4: 0.6, 5: 0.78, 6: 0.5, 7: 0.68, 8: 0.4 };

export const DashboardPage: React.FC = () => {
  const { user, gamification, setScreen, assessment, pillars } = useAppStore();
  const [portalSummary, setPortalSummary] = useState({ completedCourses: 1, recommendations: 3 });
  const latest = assessment.latestResult;
  const scores = latest?.pillar_scores ?? FALLBACK_SCORES;
  const rankedPillars = pillars.map((pillar) => ({ ...pillar, score: scores[pillar.id] ?? 0 })).sort((a, b) => a.score - b.score);
  const priorityPillar = rankedPillars[0];
  const strongestPillar = rankedPillars[rankedPillars.length - 1];
  const priorityRecommendation = latest?.recommendations?.[0];
  const overallScore = Math.round(((latest?.ffmi_score ?? 13.8) / 24) * 100);
  const currentTier = latest?.tier ?? user.tier ?? 3;
  const answeredCount = Object.keys(assessment.answers).length || 74;
  const answeredPercent = Math.min(Math.round((answeredCount / 200) * 100), 100);
  const assessedPillarIds = new Set(
    assessment.questions.filter((question) => assessment.answers[question.id]).map((question) => question.pillar_id)
  );
  const pillarsAssessed = latest ? 8 : Math.max(assessedPillarIds.size, 0);

  useEffect(() => {
    portalApi.getDashboardSummary().then((summary) => {
      setPortalSummary({
        completedCourses: summary.completed_courses_count,
        recommendations: summary.active_recommendations_count,
      });
    }).catch(() => undefined);
  }, []);

  return (
    <div className="space-y-6 pb-8">
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#00852b]"><span className="h-2 w-2 rounded-full bg-[#00852b]" /> Farm intelligence</div>
          <p className="text-sm text-slate-500">{user.farm_name || 'Your farm'} <span className="mx-2 text-slate-300">/</span> {user.farm_region || 'Western Kenya'} <span className="mx-2 text-slate-300">/</span> {user.farm_size_acres || 5} acres</p>
        </div>
        {/* <div className="flex items-center gap-3 text-sm text-slate-500"><span className="rounded-full border border-[#d8e7df] bg-white px-3 py-1.5 font-semibold text-[#045d61]">Level {gamification.level}</span><span>{gamification.total_xp} XP</span><span className="text-[#ef6c00]">{gamification.streak_days} day streak</span></div> */}
      </header>

      <section>
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-b from-[#023c3f] via-[#045D61] to-[#012527] p-6 text-white shadow-xl shadow-[#023c3f]/20 sm:p-8">
          <div className="absolute -right-8 -top-12 h-56 w-56 rounded-full border-[28px] border-[#b6d36a]/10" />
          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
            <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-[#b6d36a]"><Compass className="h-4 w-4" /> Future Farms Framework</div>
            <h2 className="max-w-lg font-serif text-2xl font-bold leading-tight sm:text-3xl">Good morning, {user.name.split(' ')[0] || 'Farmer'}.</h2>
            <p className="mt-2 text-sm text-white/65">Your farm journey starts here.</p>
            <p className="mt-6 max-w-lg text-sm leading-relaxed text-white/70">Find the capability that needs attention first.</p>
            <button onClick={() => setScreen('screen-assessment-choice')} className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#b6d36a] px-4 py-3 text-sm font-bold text-[#173d2d] transition hover:bg-[#d0e78f]"><span>Start a focused assessment</span><ArrowRight className="h-4 w-4" /></button>
            </div>
            <div className="flex shrink-0 items-center gap-5 rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm sm:p-5 lg:w-[230px] lg:flex-col lg:gap-4" aria-label="Farm assessment scores">
              <div className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-full" style={{ background: `conic-gradient(#b6d36a ${overallScore}%, rgba(255,255,255,0.14) 0)` }}>
                <div className="flex h-[78px] w-[78px] flex-col items-center justify-center rounded-full bg-[#023c3f]"><strong className="text-xl text-white">{overallScore}/100</strong><span className="text-[9px] uppercase tracking-wider text-white/60">farm score</span></div>
              </div>
              <div className="grid flex-1 grid-cols-3 gap-2 lg:w-full"><FarmPulseStat icon={<Target className="h-3.5 w-3.5" />} value={`${Math.round(priorityPillar?.score * 100)}/100`} label="priority" /><FarmPulseStat icon={<CheckCircle2 className="h-3.5 w-3.5" />} value={`${Math.round(strongestPillar?.score * 100)}/100`} label="strongest" /><FarmPulseStat icon={<BarChart3 className="h-3.5 w-3.5" />} value={`${pillarsAssessed}/8`} label="covered" /></div>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-[#cfe0d5] bg-white p-5 sm:p-7">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div><p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#00852b]">Transformation progress</p><h2 className="mt-1 font-serif text-2xl font-bold text-[#022c24]">Your work at a glance</h2></div>
          <span className="text-xs text-slate-400">Updated from your latest activity</span>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <ProgressMetric icon={<Target className="h-4 w-4" />} label="Assessment" value={`${answeredPercent}%`} detail={`${answeredCount} of 200 questions`} progress={answeredPercent} color="#045d61" onClick={() => setScreen('screen-assessment-choice')} />
          <ProgressMetric icon={<BarChart3 className="h-4 w-4" />} label="Pillars assessed" value={`${pillarsAssessed} / 8`} detail={pillarsAssessed === 8 ? 'Full framework covered' : `${8 - pillarsAssessed} pillars remaining`} progress={(pillarsAssessed / 8) * 100} color="#00852b" onClick={() => setScreen('screen-assessment-choice')} />
          <ProgressMetric icon={<BookOpen className="h-4 w-4" />} label="Learning" value={`${portalSummary.completedCourses}`} detail="modules completed" progress={Math.min((portalSummary.completedCourses / 3) * 100, 100)} color="#045d61" onClick={() => setScreen('screen-learning')} />
          <ProgressMetric icon={<CircleAlert className="h-4 w-4" />} label="Recommendations" value={`${portalSummary.recommendations}`} detail="actions to review" progress={portalSummary.recommendations ? 100 : 0} color="#ef6c00" onClick={() => setScreen('screen-result')} />
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[2rem] border border-[#cfe0d5] bg-white p-5 sm:p-7">
          <div className="flex items-start justify-between gap-4"><div><p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#00852b]">Recommended next step</p><h2 className="mt-1 font-serif text-2xl font-bold text-[#022c24]">A clear path for {priorityPillar?.code || 'your priority gap'}</h2></div><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#e7f2df] text-[#00852b]"><CheckCircle2 className="h-5 w-5" /></span></div>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">One practical action to move your farm forward.</p>
          <div className="mt-6 rounded-2xl border border-[#cfe0d5] bg-[#f2f6f1] p-4"><div className="flex items-start gap-3"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#023c3f] text-sm font-bold text-[#b6d36a]">1</span><div><span className="mb-2 inline-flex rounded-full bg-[#e6f0d4] px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#35621e]">Start here</span><strong className="block text-sm leading-relaxed text-[#022c24]">{priorityRecommendation?.recommended_action || `Complete a focused assessment for ${priorityPillar?.name || 'your priority pillar'}.`}</strong><p className="mt-2 text-xs leading-relaxed text-slate-500">This is the first step toward stronger farm capability.</p></div></div></div>
        </div>

        <div className="rounded-[2rem] border border-[#cfe0d5] bg-white p-5 sm:p-7">
          <div className="flex items-start justify-between"><div><p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#00852b]">Pillar health</p><h2 className="mt-1 font-serif text-2xl font-bold text-[#022c24]">Your capability signals</h2></div><button onClick={() => setScreen('screen-result')} className="flex items-center gap-1 text-xs font-bold text-[#045d61]">All 8 <ArrowRight className="h-3.5 w-3.5" /></button></div>
          <div className="mt-6 space-y-3">{rankedPillars.slice(0, 3).map((pillar, index) => <div key={pillar.id} className={`rounded-xl border p-3 ${index === 0 ? 'border-[#f2c681] bg-[#fffaf1]' : 'border-[#e3ece7] bg-[#f8faf8]'}`}><div className="flex items-center gap-3"><span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold ${index === 0 ? 'bg-[#ef6c00] text-white' : 'bg-[#e4eee7] text-[#567166]'}`}>{index + 1}</span><span className="min-w-0 flex-1"><span className="block truncate text-xs font-semibold text-slate-700">{pillar.name}</span><span className="mt-0.5 block font-mono text-[10px] text-slate-400">{pillar.code} · {index === 0 ? 'Start here' : 'Developing signal'}</span></span><span className={`shrink-0 text-sm font-bold ${index === 0 ? 'text-[#c56b00]' : 'text-[#045d61]'}`}>{Math.round(pillar.score * 100)}/100</span></div><div className="ml-10 mt-2 h-2 rounded-full bg-slate-200"><div className={`h-full rounded-full ${index === 0 ? 'bg-[#ef6c00]' : 'bg-[#6ca77c]'}`} style={{ width: `${pillar.score * 100}%` }} /></div></div>)}</div>
          <button onClick={() => setScreen('screen-assessment-choice')} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-[#cfe0d5] px-4 py-3 text-xs font-bold text-[#045d61] transition hover:bg-[#f2f6f1]">Review all pillar details <ChevronRight className="h-4 w-4" /></button>
        </div>
      </section>

      <section className="rounded-[2rem] border border-[#cfe0d5] bg-[#f2f6f1] p-5 sm:p-7">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#00852b]">Maturity journey</p><h2 className="mt-1 font-serif text-2xl font-bold text-[#022c24]">Your farm’s progress</h2></div><span className="text-xs text-slate-500">Stage {currentTier} of 5</span></div>
        <div className="relative mt-7 grid grid-cols-5 gap-1 sm:gap-3"><div className="absolute left-[10%] right-[10%] top-4 h-1 rounded-full bg-[#d5e2d7]" /><div className="absolute left-[10%] top-4 h-1 rounded-full bg-[#00852b]" style={{ width: `${Math.max((Math.min(currentTier, 5) - 1) / 4 * 80, 0)}%` }} />{['Starting', 'Emerging', 'Structured', 'Ready', 'Future-ready'].map((stage, index) => { const stageNumber = index + 1; const isCurrent = stageNumber === currentTier; return <div key={stage} className="relative z-10 flex min-w-0 flex-col items-center gap-2 text-center"><span className={`flex h-8 w-8 items-center justify-center rounded-full border-4 border-[#f2f6f1] text-xs font-bold ${stageNumber <= currentTier ? 'bg-[#00852b] text-white' : 'bg-[#d5e2d7] text-[#567166]'}`}>{stageNumber}</span><span className={`text-[10px] font-semibold sm:text-xs ${isCurrent ? 'text-[#022c24]' : 'text-slate-500'}`}>{stage}</span></div>; })}</div>
      </section>
    </div>
  );
};

interface ProgressMetricProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  detail: string;
  progress: number;
  color: string;
  onClick: () => void;
}

const ProgressMetric: React.FC<ProgressMetricProps> = ({ icon, label, value, detail, progress, color, onClick }) => (
  <button onClick={onClick} className="rounded-2xl border border-[#e3ece7] bg-[#f8faf8] p-4 text-left transition hover:-translate-y-0.5 hover:border-[#9bb9aa]">
    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400"><span style={{ color }}>{icon}</span>{label}</div>
    <div className="mt-4 flex items-baseline justify-between gap-2"><strong className="text-2xl font-bold text-[#022c24]">{value}</strong><ChevronRight className="h-4 w-4 text-slate-300" /></div>
    <p className="mt-1 truncate text-xs text-slate-500">{detail}</p>
    <div className="mt-4 h-1.5 rounded-full bg-slate-200"><div className="h-full rounded-full" style={{ width: `${Math.min(progress, 100)}%`, backgroundColor: color }} /></div>
  </button>
);

interface FarmPulseStatProps {
  icon: React.ReactNode;
  value: string;
  label: string;
}

const FarmPulseStat: React.FC<FarmPulseStatProps> = ({ icon, value, label }) => (
  <div className="text-center"><span className="mx-auto flex h-7 w-7 items-center justify-center rounded-full bg-[#b6d36a]/20 text-[#b6d36a]">{icon}</span><strong className="mt-1 block text-sm text-white">{value}</strong><span className="block text-[9px] uppercase tracking-wider text-white/55">{label}</span></div>
);
