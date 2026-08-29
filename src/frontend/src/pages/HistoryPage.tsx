import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store/useStore';
import { assessmentApi } from '../services/api';
import { AssessmentHistoryItem, TIER_CLASSIFICATION_COLORS } from '../types';
import {
  History,
  Calendar,
  Download,
  Loader2,
  ArrowRight,
  ClipboardList,
  CheckCircle2,
  Layers,
} from 'lucide-react';

export const HistoryPage: React.FC = () => {
  const { setScreen, setAssessmentResult, showNotification } = useAppStore();
  const [historyList, setHistoryList] = useState<AssessmentHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingId, setLoadingId] = useState<string | number | null>(null);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const res = await assessmentApi.getHistory();
      setHistoryList(res);
    } catch {
      // Leave historyList empty so the "No Farm Checks Yet" state is shown.
    } finally {
      setLoading(false);
    }
  };

  const handleViewScorecard = async (id: string | number) => {
    try {
      setLoadingId(id);
      const fullRes = await assessmentApi.getAssessment(id);
      if (fullRes) {
        setAssessmentResult(fullRes);
        setScreen('screen-result');
      }
    } catch (err: any) {
      showNotification(err.message || 'Could not load the results', 'error');
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#045D61]/15 text-[#045D61] border border-[#045D61]/30 text-xs font-bold uppercase tracking-wider mb-2">
          <History className="w-4 h-4 text-[#009924]" />
          <span>Past Farm Checks</span>
        </div>
        <h1 className="font-serif text-3xl font-bold text-slate-900">
          Past Farm Checks
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Look back at your previous Farm Checks, see how your Farm Score has changed, and download a copy.
        </p>
      </div>

      <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-[#045D61]/15 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-xl font-bold text-slate-900">
            Your Past Farm Checks ({historyList.length})
          </h3>
          <button
            onClick={() => setScreen('screen-assessment-choice')}
            className="px-4 py-2 rounded-xl bg-[#009924] hover:bg-[#007a1c] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
          >
            <span>New Farm Check</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16 text-xs font-semibold text-slate-500">
            <Loader2 className="w-5 h-5 animate-spin mr-2 text-[#045D61]" />
            <span>Loading your Farm Checks...</span>
          </div>
        ) : historyList.length === 0 ? (
          <div className="text-center py-16 space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-[#045D61]/10 text-[#045D61] flex items-center justify-center mx-auto text-2xl">
              📋
            </div>
            <div className="space-y-1">
              <h4 className="font-serif text-lg font-bold text-slate-900">No Farm Checks Yet</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                You haven't done a Farm Check yet. Start one to see how developed your farm is.
              </p>
            </div>
            <button
              onClick={() => setScreen('screen-assessment-choice')}
              className="px-5 py-2.5 rounded-xl bg-[#045D61] hover:bg-[#023c3f] text-white font-bold text-xs transition-colors shadow-md"
            >
              Start a Farm Check
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {historyList.map((item, idx) => {
              const tierVal = item.tier ?? 3;
              const tierMeta = TIER_CLASSIFICATION_COLORS[tierVal] || {
                hex: '#045D61',
              };

              const scoreVal =
                typeof item.ffmi_score === 'number'
                  ? item.ffmi_score
                  : typeof item.score === 'number'
                  ? item.score
                  : null;

              const dateStr = item.completed_at || item.submitted_at || item.started_at;
              const formattedDate = dateStr
                ? !isNaN(Date.parse(dateStr))
                  ? new Date(dateStr).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })
                  : dateStr
                : 'Recent';

              const isPillarScope = item.scope === 'pillar';

              return (
                <div
                  key={item.id || idx}
                  className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:bg-slate-50/60 rounded-2xl px-3 transition-colors"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-2xl bg-[#045D61]/10 text-[#045D61] flex items-center justify-center font-bold text-xs flex-shrink-0 group-hover:scale-105 transition-transform">
                      {isPillarScope ? (
                        <Layers className="w-5 h-5 text-[#1E88E5]" />
                      ) : (
                        <ClipboardList className="w-5 h-5 text-[#009924]" />
                      )}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">
                          {scoreVal !== null ? `Farm Score: ${scoreVal.toFixed(2)}` : 'In Progress'}
                        </span>
                        <span
                          className="px-2.5 py-0.5 rounded-full text-white font-extrabold text-[10px] shadow-xs"
                          style={{ backgroundColor: tierMeta.hex }}
                        >
                          Stage {tierVal}
                        </span>
                        {isPillarScope && (
                          <span className="px-2 py-0.5 rounded-full bg-[#1E88E5]/10 text-[#1E88E5] text-[10px] font-bold">
                            {item.target_pillar_name || 'Single Pillar'}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-2 mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{formattedDate}</span>
                        </span>
                        <span>•</span>
                        <span className="text-slate-600 font-medium">
                          {item.status === 'submitted' || item.status === 'completed'
                            ? 'Completed'
                            : 'In Progress'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleViewScorecard(item.id)}
                      disabled={loadingId === item.id}
                      className="px-3.5 py-2 rounded-xl bg-[#009924]/10 hover:bg-[#009924]/20 text-[#009924] font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      {loadingId === item.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      )}
                      <span>View Result</span>
                    </button>

                    <a
                      href={`/api/assessments/${item.id}/pdf`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 rounded-xl bg-[#045D61]/10 hover:bg-[#045D61]/20 text-[#045D61] border border-[#045D61]/30 font-bold text-xs flex items-center gap-1.5 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
