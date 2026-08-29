import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store/useStore';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  RotateCcw,
  Sparkles,
  Lightbulb,
  Gauge,
  BookOpen,
  PlayCircle,
  Handshake,
  ChevronRight,
  Sun,
  Cpu,
  ShieldCheck,
  Trees,
  Truck,
  Users,
  Building2,
  Briefcase,
  Loader2,
} from 'lucide-react';
import { assessmentApi, portalApi, apiRequest } from '../services/api';
import { PILLAR_BRAND_COLORS, MATURITY_STATUS_COLORS } from '../types';

// ─── Real backend-shaped types ────────────────────────────────────────────
interface FetchedCapability {
  id: number;
  number: number;
  code: string;
  name: string;
  description: string;
}

interface FetchedProvider {
  id: number | string;
  name: string; // provider
  category: string;
  title: string;
  description: string;
  cost_model?: string;
  pillar_id?: number;
  is_recommended?: boolean;
  contact_phone?: string;
  icon?: string; // emoji
}

const PILLAR_ICONS: Record<number, React.ReactNode> = {
  1: <Cpu className="w-6 h-6" />,
  2: <Sun className="w-6 h-6" />,
  3: <ShieldCheck className="w-6 h-6" />,
  4: <Trees className="w-6 h-6" />,
  5: <Truck className="w-6 h-6" />,
  6: <Users className="w-6 h-6" />,
  7: <Building2 className="w-6 h-6" />,
  8: <Briefcase className="w-6 h-6" />,
};

function mapService(s: any): FetchedProvider {
  return {
    id: s.id,
    name: s.provider || s.name || 'Agro-Provider',
    category: s.category || 'Agro-Services',
    title: s.service_title || s.title || '',
    description: s.description || '',
    cost_model: s.cost_model,
    pillar_id: s.pillar_id,
    is_recommended: s.is_recommended,
    contact_phone: s.contact_phone,
    icon: s.icon,
  };
}

function getActionIcon(priority?: string) {
  if (priority === 'strategic') return <Sparkles className="w-5 h-5" />;
  if (priority === 'quick_win') return <Lightbulb className="w-5 h-5" />;
  return <Gauge className="w-5 h-5" />;
}

export const PillarDetailPage: React.FC = () => {
  const {
    selectedPillarDetailId,
    setSelectedPillarDetailId,
    setScreen,
    showNotification,
    startAssessment,
    awardXp,
    pillars,
    assessment,
  } = useAppStore();

  const [activePillarId, setActivePillarId] = useState<number>(selectedPillarDetailId || 2);
  const [startedActions, setStartedActions] = useState<Record<string, boolean>>({});
  const [dismissedActions, setDismissedActions] = useState<Record<string, boolean>>({});
  const [isRetaking, setIsRetaking] = useState(false);

  // Real data fetched from the backend
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [capabilities, setCapabilities] = useState<FetchedCapability[]>([]);
  const [learning, setLearning] = useState<any[]>([]);
  const [services, setServices] = useState<FetchedProvider[]>([]);

  const brand = PILLAR_BRAND_COLORS[activePillarId] || PILLAR_BRAND_COLORS[2];
  const pillar = pillars.find((p) => p.id === activePillarId);
  const pillarNumber = String(activePillarId).padStart(2, '0');
  const latestResult = assessment.latestResult;

  // Real pillar score (mirror Dashboard conversion: raw <= 1.0 -> *100 else /3*100)
  const rawScore = latestResult?.pillar_scores?.[activePillarId];
  const hasScore = rawScore !== undefined && rawScore !== null;
  const displayScore = hasScore
    ? Math.round(rawScore <= 1.0 ? rawScore * 100 : (rawScore / 3) * 100)
    : 0;

  let maturityKey: keyof typeof MATURITY_STATUS_COLORS | 'nonExistent' = 'nonExistent';
  if (hasScore) {
    if (displayScore >= 80) maturityKey = 'advanced';
    else if (displayScore >= 55) maturityKey = 'established';
    else if (displayScore >= 30) maturityKey = 'developing';
    else if (displayScore >= 10) maturityKey = 'basic';
    else maturityKey = 'nonExistent';
  }
  const maturityMeta = hasScore
    ? MATURITY_STATUS_COLORS[maturityKey]
    : { label: 'Not Assessed', hex: '#94A3B8' };

  // Real recommendations for this pillar
  const pillarRecs = (latestResult?.recommendations || []).filter(
    (r) => r.pillar_id === activePillarId
  );

  // ─── Fetch real data when the active pillar changes ─────────────────────
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setFetchError(null);

    Promise.all([
      apiRequest<FetchedCapability[]>(`/api/pillars/${activePillarId}/capabilities`),
      portalApi.getLearning(activePillarId),
      apiRequest<any[]>(`/api/portal/services?pillar_id=${activePillarId}`),
    ])
      .then(([caps, learn, servs]) => {
        if (cancelled) return;
        setCapabilities(caps || []);
        setLearning(learn || []);
        setServices((servs || []).map(mapService));
        setLoading(false);
      })
      .catch((e: any) => {
        if (cancelled) return;
        setFetchError(e?.message || 'Failed to load pillar data.');
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [activePillarId]);

  const handlePillarChange = (newId: number) => {
    setActivePillarId(newId);
    setSelectedPillarDetailId(newId);
  };

  const handleStartAction = (actionId: string, actionTitle: string) => {
    setStartedActions((prev) => ({ ...prev, [actionId]: true }));
    awardXp(15, `Started Action: ${actionTitle}`);
    showNotification(
      `Action "${actionTitle}" has been added to your Active Farm Roadmap!`,
      'success',
      4000,
      'Action Started (+15 XP)'
    );
  };

  const handleDismissAction = (actionId: string) => {
    setDismissedActions((prev) => ({ ...prev, [actionId]: true }));
    showNotification('Action dismissed from priority view.', 'info', 2500);
  };

  const handleRetakeAssessment = async () => {
    setIsRetaking(true);
    try {
      const res = await assessmentApi.startAssessment('pillar', activePillarId);
      startAssessment(res.assessment_id, 'pillar', res.questions, activePillarId);
      awardXp(20, `Retook Diagnostic: Pillar ${pillarNumber}`);
      showNotification(
        `Retaking diagnostic for Pillar ${pillarNumber}: ${pillar?.name || ''}`,
        'info',
        3500,
        'Pillar Audit Launched'
      );
    } catch (e: any) {
      showNotification(`Could not start retake: ${e?.message || e}`, 'error');
    } finally {
      setIsRetaking(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* ─── 1. Breadcrumbs & Pillar Switcher ─────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <button
            onClick={() => setScreen('screen-result')}
            className="hover:text-[#004447] transition-colors flex items-center gap-1 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Assessment Results</span>
          </button>
          <span>/</span>
          <span className="text-slate-900 font-bold">
            Pillar {pillarNumber} ({pillar?.name || `Pillar ${activePillarId}`})
          </span>
        </div>

        {/* Quick Pillar Selector Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((pid) => (
            <button
              key={pid}
              onClick={() => handlePillarChange(pid)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activePillarId === pid
                  ? 'bg-[#004447] text-white shadow-sm scale-105'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              Pillar 0{pid}
            </button>
          ))}
        </div>
      </div>

      {/* ─── 2. Header Hero Card (Bento Style) ────────────────────────── */}
      <section className="bg-white border border-slate-200/90 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        {/* Decorative subtle background pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-100/30 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center">
              <span className={brand.textClass}>{PILLAR_ICONS[activePillarId]}</span>
            </div>
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-[#009924]">
              Pillar {pillarNumber} • {pillar?.code || `P${activePillarId}`}
            </h2>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#004447] mb-2 tracking-tight">
            {pillar?.name || `Pillar ${activePillarId}`}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {pillar?.description ||
              'Complete the Farm Check to see a detailed description of this pillar.'}
          </p>
        </div>

        <div className="flex flex-col items-start md:items-end gap-4 relative z-10 min-w-[200px] w-full md:w-auto">
          <div className="flex flex-col items-start md:items-end">
            <div className="flex items-baseline gap-1">
              <span className="font-serif text-4xl sm:text-5xl font-bold text-[#004447] leading-none">
                {displayScore}
              </span>
              <span className="text-sm sm:text-base text-slate-400 font-medium">/100</span>
            </div>
            <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 border border-slate-200">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: maturityMeta.hex }}
              />
              <span className="text-xs font-bold text-slate-700">
                Maturity: {maturityMeta.label}
              </span>
            </div>
          </div>

          <button
            onClick={handleRetakeAssessment}
            disabled={isRetaking}
            className="w-full md:w-auto px-5 py-2.5 border-2 border-[#009924] text-[#009924] hover:bg-[#009924] hover:text-white rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 bg-white shadow-xs cursor-pointer"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isRetaking ? 'animate-spin' : ''}`} />
            <span>Retake Assessment</span>
          </button>
        </div>
      </section>

      {fetchError && (
        <div className="bg-[#D32F2F]/10 border border-[#D32F2F]/30 text-[#D32F2F] text-xs font-semibold rounded-2xl px-4 py-3">
          {fetchError}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-24 text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span className="ml-3 text-sm font-semibold">Loading pillar data…</span>
        </div>
      ) : (
        <>
          {/* ─── 3. Main Layout Grid (12 Columns) ─────────────────────────── */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
            {/* Left Column (8 Columns: Capabilities Breakdown & Action Plan) */}
            <div className="xl:col-span-8 flex flex-col gap-6">
              {/* Capabilities Breakdown Card */}
              <section className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-xs">
                <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                  <h3 className="font-serif text-lg font-bold text-[#004447] flex items-center gap-2">
                    <Gauge className="w-5 h-5 text-[#009924]" />
                    <span>Capabilities Breakdown</span>
                  </h3>
                  <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                    {capabilities.length || '—'} Assessment Areas
                  </span>
                </div>

                {capabilities.length === 0 ? (
                  <div className="text-center py-6 text-slate-500 text-xs">
                    No capabilities are listed for this pillar yet.
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {capabilities.map((cap) => (
                      <motion.div
                        key={cap.id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-1.5"
                      >
                        <div className="flex justify-between items-center gap-2">
                          <h4 className="text-xs sm:text-sm font-semibold text-slate-800">
                            {cap.name}
                          </h4>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-400 whitespace-nowrap">
                            Not yet scored
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          {cap.description ||
                            'Complete the Farm Check to unlock capability scores.'}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                )}
              </section>

              {/* Priority Action Plan Card */}
              <section className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-xs flex flex-col">
                <div className="bg-slate-50 p-6 border-b border-slate-200/80">
                  <h3 className="font-serif text-lg font-bold text-[#004447] flex items-center gap-2 mb-1">
                    <Sparkles className="w-5 h-5 text-[#009924]" />
                    <span>Priority Action Plan</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Targeting your lowest-scoring capabilities in Pillar {pillarNumber}.
                  </p>
                </div>

                <div className="p-6 flex flex-col gap-4">
                  {pillarRecs.length === 0 ? (
                    <div className="text-center py-6 text-slate-500 text-xs">
                      No priority actions yet — complete a Farm Check to get personalized steps.
                    </div>
                  ) : (
                    pillarRecs
                      .map((rec, idx) => {
                        const actionId = `p${activePillarId}-${rec.capability_id ?? 'x'}-${idx}`;
                        return { rec, actionId };
                      })
                      .filter(({ actionId }) => !dismissedActions[actionId])
                      .map(({ rec, actionId }) => {
                        const isStarted = startedActions[actionId];
                        return (
                          <div
                            key={actionId}
                            className="flex flex-col sm:flex-row gap-4 p-5 rounded-2xl border border-slate-200/90 hover:shadow-md transition-all bg-white group"
                          >
                            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 text-[#009924] mt-0.5 group-hover:scale-105 transition-transform">
                              {getActionIcon(rec.priority)}
                            </div>

                            <div className="flex-1 space-y-1.5">
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <h4 className="text-xs sm:text-sm font-bold text-[#004447]">
                                  {rec.recommended_action}
                                </h4>
                                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                                  {rec.capability_name}
                                </span>
                              </div>
                              {rec.why_it_matters && (
                                <p className="text-xs text-slate-600 leading-relaxed">
                                  {rec.why_it_matters}
                                </p>
                              )}

                              <div className="flex items-center gap-3 pt-3">
                                <button
                                  onClick={() => handleStartAction(actionId, rec.recommended_action)}
                                  disabled={isStarted}
                                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                    isStarted
                                      ? 'bg-emerald-100 text-[#007519] border border-emerald-200'
                                      : 'bg-[#009924] text-white hover:bg-[#007a1c] shadow-xs'
                                  }`}
                                >
                                  {isStarted ? 'Action Active ✓' : 'Start Action'}
                                </button>
                                <button
                                  onClick={() => handleDismissAction(actionId)}
                                  className="px-4 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                                >
                                  Dismiss
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })
                  )}

                  {pillarRecs.length > 0 &&
                    pillarRecs.every(
                      (_rec, idx) =>
                        dismissedActions[`p${activePillarId}-${_rec.capability_id ?? 'x'}-${idx}`]
                    ) && (
                      <div className="text-center py-6 text-slate-500 text-xs">
                        All priority actions for this pillar have been addressed or dismissed.
                      </div>
                    )}
                </div>
              </section>
            </div>

            {/* Right Column (4 Columns: Relevant Learning & Vetted Providers) */}
            <div className="xl:col-span-4 flex flex-col gap-6">
              {/* Relevant Learning Card */}
              <section className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-4">
                <h3 className="font-serif text-lg font-bold text-[#004447] flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#004447]" />
                  <span>Relevant Learning</span>
                </h3>

                {learning.length === 0 ? (
                  <div className="text-center py-6 text-slate-500 text-xs">
                    No learning modules listed for this pillar yet.
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {learning.map((course) => (
                      <div
                        key={course.id}
                        onClick={() => setScreen('screen-learning')}
                        className="group flex items-center gap-3.5 p-3 rounded-2xl border border-slate-200/80 hover:bg-slate-50 hover:border-[#009924] transition-all cursor-pointer"
                      >
                        <div
                          className={`w-16 h-16 rounded-xl overflow-hidden relative shrink-0 border border-slate-200 flex items-center justify-center text-2xl ${brand.bgLight}`}
                        >
                          {course.icon ? (
                            <span>{course.icon}</span>
                          ) : (
                            <PlayCircle className="w-7 h-7 text-white drop-shadow-md" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#004447] transition-colors line-clamp-2 leading-snug">
                            {course.title}
                          </h4>
                          <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1.5">
                            <span>{course.duration_mins} min</span>
                            <span>•</span>
                            <span className="font-semibold text-[#009924]">
                              {course.format_type || course.level}
                            </span>
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <button
                  onClick={() => setScreen('screen-learning')}
                  className="mt-2 w-full text-center py-2.5 text-xs font-bold text-[#009924] hover:bg-emerald-50 rounded-xl transition-colors border border-emerald-200/60 cursor-pointer"
                >
                  View All Courses in Learning Hub
                </button>
              </section>

              {/* Vetted Providers Card */}
              <section className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-4">
                <h3 className="font-serif text-lg font-bold text-[#004447] flex items-center gap-2">
                  <Handshake className="w-5 h-5 text-[#004447]" />
                  <span>Vetted Providers</span>
                </h3>

                {services.length === 0 ? (
                  <div className="text-center py-6 text-slate-500 text-xs">
                    No vetted providers listed for this pillar yet.
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {services.map((prov) => (
                      <div
                        key={prov.id}
                        onClick={() => setScreen('screen-services')}
                        className="flex items-center justify-between gap-3 p-3.5 border border-slate-200/80 rounded-2xl bg-white hover:border-[#009924] hover:shadow-xs transition-all cursor-pointer group"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0 border ${brand.bgLight} ${brand.textClass} border-slate-200`}
                          >
                            {prov.icon ? prov.icon : <Handshake className="w-5 h-5" />}
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#004447] transition-colors flex items-center gap-1.5">
                              {prov.name}
                              {prov.is_recommended && (
                                <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full bg-emerald-100 text-[#007519]">
                                  Recommended
                                </span>
                              )}
                            </h4>
                            <p className="text-[11px] text-slate-500">{prov.category}</p>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#009924] group-hover:translate-x-0.5 transition-all" />
                      </div>
                    ))}
                  </div>
                )}

                <button
                  onClick={() => setScreen('screen-services')}
                  className="mt-2 w-full text-center py-2.5 text-xs font-bold text-[#004447] hover:bg-slate-50 rounded-xl transition-colors border border-slate-200 cursor-pointer"
                >
                  Browse Services Directory
                </button>
              </section>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
