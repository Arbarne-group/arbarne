import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store/useStore';
import { assessmentApi } from '../services/api';
import {
  Check,
  X,
  ArrowLeft,
  ArrowRight,
  Info,
  Zap,
  Loader2,
  HelpCircle,
} from 'lucide-react';

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
        <h2 className="text-xl font-bold text-pine-950">No active questionnaire found</h2>
        <button
          onClick={() => setScreen('screen-assessment-choice')}
          className="px-5 py-2.5 rounded-xl bg-emerald-500 text-pine-950 font-bold text-xs"
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
        question_id: Number(qId),
        answer: ans,
      }));

      await assessmentApi.submitAnswers(assessmentId, payload);
      const result = await assessmentApi.calculateScore(assessmentId);

      awardXp(150, 'Completed Assessment');
      showNotification(
        `FFMI Scorecard calculated: Tier ${result.tier} (${result.tier_name})!`,
        'success',
        5000,
        'Assessment Finished'
      );
      setAssessmentResult(result);
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

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Top Navigation & Progress */}
      <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
        <button
          onClick={() => (currentIndex > 0 ? prevQuestion() : setScreen('screen-assessment-choice'))}
          className="flex items-center gap-1 hover:text-pine-950 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{currentIndex > 0 ? 'Previous Question' : 'Exit to Hub'}</span>
        </button>

        <div className="flex items-center gap-2">
          <span>Question {currentIndex + 1} of {total}</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
            {Math.round(progressPct)}%
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 to-sprout-400 transition-all duration-300 rounded-full"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Question Card */}
      <div className="p-6 sm:p-10 rounded-3xl glass-panel border border-emerald-900/10 shadow-xl space-y-6">
        {/* Capability / Pillar Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-extrabold uppercase tracking-wider">
            {currentQ.pillar_code || `Pillar ${currentQ.pillar_id}`}
          </span>
          <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-semibold">
            Capability {currentQ.capability_code || `C${currentQ.capability_id}`}
          </span>
        </div>

        {/* Question Text */}
        <h2 className="text-xl sm:text-2xl font-serif font-bold text-pine-950 leading-snug">
          {currentQ.question_text}
        </h2>

        {/* Why It Matters / Quick Win Box */}
        {(currentQ.why_it_matters || currentQ.quick_win) && (
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/60 space-y-2 text-xs">
            {currentQ.why_it_matters && (
              <div className="flex items-start gap-2 text-slate-700">
                <Info className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-pine-950">Why it matters: </span>
                  {currentQ.why_it_matters}
                </div>
              </div>
            )}
            {currentQ.quick_win && (
              <div className="flex items-start gap-2 text-emerald-800 font-medium">
                <Zap className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
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
                ? 'bg-emerald-500 text-pine-950 border-emerald-400 scale-[1.02]'
                : 'bg-white hover:bg-emerald-50 text-emerald-900 border-emerald-300 hover:border-emerald-500'
            }`}
          >
            <Check className="w-5 h-5" />
            <span>YES (Practiced)</span>
            <kbd className="hidden sm:inline text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono">
              Y
            </kbd>
          </button>

          <button
            onClick={() => handleResponse('no')}
            disabled={submitting}
            className={`py-4 rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 border-2 transition-all shadow-md ${
              currentAnswer === 'no'
                ? 'bg-slate-800 text-white border-slate-700 scale-[1.02]'
                : 'bg-white hover:bg-red-50 text-red-900 border-red-200 hover:border-red-400'
            }`}
          >
            <X className="w-5 h-5" />
            <span>NO (Gap)</span>
            <kbd className="hidden sm:inline text-[10px] px-1.5 py-0.5 rounded bg-red-100 text-red-800 font-mono">
              N
            </kbd>
          </button>
        </div>

        {submitting && (
          <div className="flex items-center justify-center gap-2 text-xs font-bold text-emerald-700 py-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Calculating Official FFMI Maturity Score &amp; Generating Roadmap...</span>
          </div>
        )}
      </div>
    </div>
  );
};
