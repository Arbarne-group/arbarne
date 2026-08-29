import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store/useStore';
import { assessmentApi } from '../services/api';
import {
  Check,
  X,
  ArrowLeft,
  Info,
  Zap,
  Loader2,
} from 'lucide-react';
import { PILLAR_BRAND_COLORS } from '../types';

export const QuestionnairePage: React.FC = () => {
  const {
    assessment,
    setAnswer,
    nextQuestion,
    prevQuestion,
    setAssessmentResult,
    awardXp,
    setScreen,
    showNotification,
    openShare,
  } = useAppStore();

  const [submitting, setSubmitting] = useState(false);

  const { questions, currentIndex, answers, id: assessmentId } = assessment;
  const currentQ = questions[currentIndex];
  const total = questions.length;
  const progressPct = total > 0 ? ((currentIndex + 1) / total) * 100 : 0;

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (submitting || !currentQ) return;
      if (e.key === 'y' || e.key === 'Y') handleResponse('yes');
      else if (e.key === 'n' || e.key === 'N') handleResponse('no');
      else if (e.key === 'ArrowLeft' && currentIndex > 0) prevQuestion();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentQ, currentIndex, submitting]);

  if (!currentQ) {
    return (
      <div className="text-center py-20 space-y-4">
        <h2 className="text-xl font-bold text-slate-900">No active questionnaire found</h2>
        <button
          onClick={() => setScreen('screen-assessment-choice')}
          className="px-5 py-2.5 rounded-xl bg-[#009924] text-white font-bold text-xs shadow-md"
        >
          Return to Assessment Hub
        </button>
      </div>
    );
  }

  const handleResponse = async (answer: 'yes' | 'no') => {
    setAnswer(currentQ.id, answer);
    awardXp(5, `Answered Q${currentIndex + 1}`);

    if (currentIndex < total - 1) {
      nextQuestion();
    } else {
      // Final question -> submit all answers and calculate score
      await finalizeAssessment({ ...answers, [currentQ.id]: answer });
    }
  };

  const finalizeAssessment = async (finalAnswers: Record<number, 'yes' | 'no'>) => {
    if (!assessmentId) return;
    setSubmitting(true);
    try {
      const payload = Object.entries(finalAnswers).map(([qId, ans]) => ({
        question_id: qId,
        answer: ans,
      }));

      await assessmentApi.submitAnswers(assessmentId, payload);
      const result = await assessmentApi.calculateScore(assessmentId);

      awardXp(150, 'Completed Assessment');

      // Auto-unlock achievements for every pillar completed in this assessment
      const { unlockBadge } = useAppStore.getState();
      const pKeys = Object.keys(result.pillar_scores ?? {}).map(Number);

      const PILLAR_BADGE_MAP: Record<number, string> = {
        1: 'soil_guardian',
        2: 'water_steward',
        3: 'biodiversity_hero',
        4: 'mechanization_pioneer',
        5: 'market_master',
        6: 'safety_shield',
        7: 'circular_champion',
        8: 'governance_pro',
      };

      pKeys.forEach((pId) => {
        const badgeKey = PILLAR_BADGE_MAP[pId];
        if (badgeKey) {
          unlockBadge(badgeKey);
        }
      });

      // If full assessment completed with tier >= 3, also unlock Future Ready 100k hero badge
      if (pKeys.length > 1 && result.tier >= 3) {
        unlockBadge('future_ready_100k');
      }

      showNotification(
        `FFMI Scorecard calculated: Tier ${result.tier} (${result.tier_classification})!`,
        'success',
        5000,
        'Assessment Finished'
      );
      setAssessmentResult(result);
      openShare(result);
    } catch (e: any) {
      showNotification(
        `Error computing assessment: ${e.message || e}`,
        'error',
        5000,
        'Assessment Error'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const currentAnswer = answers[currentQ.id];
  const pBrand = PILLAR_BRAND_COLORS[currentQ.pillar_id] || {
    hex: '#045D61',
    textClass: 'text-[#045D61]',
    bgLight: 'bg-[#045D61]/10',
    borderLight: 'border-[#045D61]/30',
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Top Navigation & Progress */}
      <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
        <button
          onClick={() => (currentIndex > 0 ? prevQuestion() : setScreen('screen-assessment-choice'))}
          className="flex items-center gap-1 hover:text-[#045D61] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{currentIndex > 0 ? 'Previous Question' : 'Exit to Hub'}</span>
        </button>

        <div className="flex items-center gap-2">
          <span>Question {currentIndex + 1} of {total}</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#045D61]/15 text-[#045D61] font-bold border border-[#045D61]/25">
            {Math.round(progressPct)}%
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#045D61] via-[#009924] to-[#FFD700] transition-all duration-300 rounded-full"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Question Card */}
      <div className="p-6 sm:p-10 rounded-3xl glass-panel border border-[#045D61]/15 shadow-xl space-y-6">
        {/* Capability / Pillar Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider border ${pBrand.bgLight} ${pBrand.borderLight} ${pBrand.textClass}`}
          >
            {currentQ.pillar_code || `Pillar ${currentQ.pillar_id}`}
          </span>
          <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-semibold">
            Capability {currentQ.capability_code || `C${currentQ.capability_id}`}
          </span>
        </div>

        {/* Question Text */}
        <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 leading-snug">
          {currentQ.question_text}
        </h2>

        {/* Why It Matters / Quick Win Box */}
        {(currentQ.why_it_matters || currentQ.quick_win) && (
          <div className="p-4 rounded-2xl bg-[#045D61]/5 border border-[#045D61]/15 space-y-2 text-xs">
            {currentQ.why_it_matters && (
              <div className="flex items-start gap-2 text-slate-700">
                <Info className="w-4 h-4 text-[#045D61] flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900">Why it matters: </span>
                  {currentQ.why_it_matters}
                </div>
              </div>
            )}
            {currentQ.quick_win && (
              <div className="flex items-start gap-2 text-[#009924] font-medium">
                <Zap className="w-4 h-4 text-[#009924] flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Quick win: </span>
                  {currentQ.quick_win}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Answer Decision Buttons */}
        <div className="grid grid-cols-2 gap-4 pt-4">
          <button
            onClick={() => handleResponse('yes')}
            disabled={submitting}
            className={`py-4 rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 border-2 transition-all shadow-md ${
              currentAnswer === 'yes'
                ? 'bg-[#009924] text-white border-[#009924] scale-[1.02] shadow-[#009924]/30'
                : 'bg-white hover:bg-[#009924]/10 text-[#009924] border-[#009924]/40 hover:border-[#009924]'
            }`}
          >
            <Check className="w-5 h-5" />
            <span>YES (Practiced)</span>
            <kbd className="hidden sm:inline text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-[#009924] font-mono border border-[#009924]/30">
              Y
            </kbd>
          </button>

          <button
            onClick={() => handleResponse('no')}
            disabled={submitting}
            className={`py-4 rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 border-2 transition-all shadow-md ${
              currentAnswer === 'no'
                ? 'bg-[#D32F2F] text-white border-[#D32F2F] scale-[1.02] shadow-[#D32F2F]/30'
                : 'bg-white hover:bg-red-50 text-[#D32F2F] border-[#D32F2F]/30 hover:border-[#D32F2F]'
            }`}
          >
            <X className="w-5 h-5" />
            <span>NO (Gap)</span>
            <kbd className="hidden sm:inline text-[10px] px-1.5 py-0.5 rounded bg-red-50 text-[#D32F2F] font-mono border border-[#D32F2F]/30">
              N
            </kbd>
          </button>
        </div>

        {submitting && (
          <div className="flex items-center justify-center gap-2 text-xs font-bold text-[#045D61] py-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Calculating Official FFMI Maturity Score &amp; Generating Roadmap...</span>
          </div>
        )}
      </div>
    </div>
  );
};
