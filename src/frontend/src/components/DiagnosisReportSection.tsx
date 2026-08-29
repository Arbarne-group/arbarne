import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Target,
  TrendingUp,
  ShieldAlert,
  Lightbulb,
  Compass,
  CheckCircle2,
  AlertCircle,
  UserCog,
  Flag,
} from 'lucide-react';
import { MATURITY_STATUS_COLORS, DiagnosisReport } from '../types';
import { assessmentApi } from '../services/api';

const STATUS_KEY: Record<string, keyof typeof MATURITY_STATUS_COLORS> = {
  non_existent: 'nonExistent',
  emerging: 'emerging',
  basic: 'basic',
  developing: 'developing',
  established: 'established',
  advanced: 'advanced',
};

const PRIORITY_META: Record<string, { label: string; cls: string }> = {
  quick_win: { label: 'QUICK WIN', cls: 'bg-[#009924]/15 text-[#009924] border border-[#009924]/30' },
  medium_term: { label: 'MEDIUM TERM', cls: 'bg-[#1E88E5]/15 text-[#1E88E5] border border-[#1E88E5]/30' },
  strategic: { label: 'STRATEGIC', cls: 'bg-[#FB8C00]/15 text-[#FB8C00] border border-[#FB8C00]/30' },
};

function StatusBadge({ level }: { level: string }) {
  const key = STATUS_KEY[level] || 'developing';
  const c = MATURITY_STATUS_COLORS[key];
  return (
    <span
      className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider"
      style={{ backgroundColor: `${c.hex}1A`, color: c.hex }}
    >
      {level.replace('_', ' ')}
    </span>
  );
}

function PillarDiagnosis({ pillar }: { pillar: DiagnosisReport['pillars'][number] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs"
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h3 className="font-serif text-lg font-bold text-[#004447]">{pillar.pillar_name}</h3>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Pillar {pillar.pillar_id} · Score {Math.round(pillar.pillar_score * 100)}/100
          </p>
        </div>
        <StatusBadge level={pillar.status_level} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-700 mb-2">Strengths</p>
          <ul className="space-y-1.5">
            {pillar.strengths.map((s, i) => (
              <li key={i} className="flex items-start gap-1.5 text-[12px] text-slate-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-rose-700 mb-2">Key Gaps</p>
          <ul className="space-y-1.5">
            {pillar.key_gaps.map((g, i) => (
              <li key={i} className="flex items-start gap-1.5 text-[12px] text-slate-700">
                <AlertCircle className="w-3.5 h-3.5 text-rose-500 mt-0.5 shrink-0" />
                <span>{g}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-amber-700 mb-2">Root Causes</p>
          <ul className="space-y-1.5">
            {pillar.root_causes.map((r, i) => (
              <li key={i} className="flex items-start gap-1.5 text-[12px] text-slate-700">
                <Flag className="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0" />
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {pillar.personalised_recommendations.length > 0 && (
        <div className="mt-4">
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#004447] mb-2">
            Personalised Recommendations
          </p>
          <div className="space-y-2">
            {pillar.personalised_recommendations.map((rec, i) => {
              const meta = PRIORITY_META[rec.priority] || PRIORITY_META.medium_term;
              return (
                <div key={i} className="rounded-2xl bg-slate-50 border border-slate-200/80 p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold ${meta.cls}`}>{meta.label}</span>
                  </div>
                  <p className="text-[12px] font-semibold text-slate-800">{rec.action}</p>
                  {rec.rationale && <p className="text-[11px] text-slate-600 mt-1">{rec.rationale}</p>}
                  {rec.linked_to_profile && (
                    <p className="text-[11px] text-[#004447] mt-1 italic">{rec.linked_to_profile}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
        <div className="rounded-2xl bg-[#045D61]/5 border border-[#045D61]/15 p-3">
          <p className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest text-[#045D61] mb-1">
            <UserCog className="w-3.5 h-3.5" /> Coaching Approach
          </p>
          <p className="text-[12px] text-slate-700">{pillar.coaching_approach}</p>
        </div>
        <div className="rounded-2xl bg-[#009924]/5 border border-[#009924]/15 p-3">
          <p className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest text-[#009924] mb-1">
            <Compass className="w-3.5 h-3.5" /> Aspiration Alignment
          </p>
          <p className="text-[12px] text-slate-700">{pillar.aspiration_alignment}</p>
        </div>
      </div>
    </motion.div>
  );
}

export const DiagnosisReportSection: React.FC<{ assessmentId: string | number }> = ({ assessmentId }) => {
  const [report, setReport] = useState<DiagnosisReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    assessmentApi
      .getDiagnosis(assessmentId)
      .then((res) => {
        if (!cancelled) setReport(res.diagnosis);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [assessmentId]);

  if (loading) {
    return (
      <div className="bg-white border border-slate-200/90 rounded-3xl p-8 text-center">
        <p className="text-xs text-slate-500">Generating your personalised professional diagnosis…</p>
      </div>
    );
  }
  if (error || !report) return null;

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-[#009924]" />
        <h2 className="font-serif text-xl font-bold text-[#004447]">Professional Diagnosis</h2>
        {report.is_fallback && (
          <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200">
            Rule-based
          </span>
        )}
      </div>

      {/* Overall diagnosis */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-gradient-to-br from-[#004447] to-[#023335] rounded-3xl p-6 sm:p-7 text-white shadow-md"
      >
        <p className="text-[10px] font-extrabold uppercase tracking-widest text-white/70 mb-2">
          Executive Summary
        </p>
        <p className="text-sm leading-relaxed text-white/95">{report.overall.executive_summary}</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
          <div className="rounded-2xl bg-white/10 p-4">
            <p className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest text-white/70 mb-1.5">
              <TrendingUp className="w-3.5 h-3.5" /> Trajectory
            </p>
            <p className="text-[12px] text-white/90">{report.overall.transformation_trajectory}</p>
          </div>
          <div className="rounded-2xl bg-white/10 p-4">
            <p className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest text-white/70 mb-1.5">
              <Target className="w-3.5 h-3.5" /> Vision Alignment
            </p>
            <p className="text-[12px] text-white/90">{report.overall.vision_alignment}</p>
          </div>
          <div className="rounded-2xl bg-white/10 p-4">
            <p className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest text-white/70 mb-1.5">
              <ShieldAlert className="w-3.5 h-3.5" /> Key Risks
            </p>
            <ul className="space-y-1">
              {report.overall.key_risks.map((r, i) => (
                <li key={i} className="text-[12px] text-white/90">{r}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="rounded-2xl bg-white/10 p-4">
            <p className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest text-white/70 mb-1.5">
              <Lightbulb className="w-3.5 h-3.5" /> Holistic Strengths
            </p>
            <ul className="space-y-1">
              {report.overall.holistic_strengths.map((s, i) => (
                <li key={i} className="text-[12px] text-white/90">{s}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl bg-white/10 p-4">
            <p className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest text-white/70 mb-1.5">
              <Flag className="w-3.5 h-3.5" /> Priority Roadmap
            </p>
            <ul className="space-y-1">
              {report.overall.priority_roadmap.map((r, i) => (
                <li key={i} className="text-[12px] text-white/90">{r}</li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Per-pillar diagnosis */}
      <div className="space-y-4">
        {report.pillars.map((p) => (
          <PillarDiagnosis key={p.pillar_id} pillar={p} />
        ))}
      </div>
    </div>
  );
};
