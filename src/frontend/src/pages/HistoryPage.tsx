import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store/useStore';
import { assessmentApi } from '../services/api';
import { History, Calendar, Award, ArrowRight, Download, Loader2 } from 'lucide-react';

export const HistoryPage: React.FC = () => {
  const { user, setScreen } = useAppStore();
  const [historyList, setHistoryList] = useState<Array<{ id: number; completed_at: string; score: number; tier: number }>>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const res = await assessmentApi.getHistory();
      setHistoryList(res);
    } catch {
      // Fallback demo data
      setHistoryList([
        { id: 101, completed_at: '2026-08-20T14:30:00Z', score: 13.80, tier: 3 },
        { id: 98, completed_at: '2026-06-15T09:15:00Z', score: 11.20, tier: 2 },
        { id: 82, completed_at: '2026-03-10T11:00:00Z', score: 8.50, tier: 1 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
          <History className="w-4 h-4 text-emerald-600" />
          <span>Historical Audits &amp; Progress</span>
        </div>
        <h1 className="font-serif text-3xl font-bold text-pine-950">
          Assessment History &amp; Benchmarks
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Review previous capability audits, track FFMI trajectory across seasons, and download past scorecard certificates.
        </p>
      </div>

      <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-emerald-900/10 shadow-sm space-y-6">
        <h3 className="font-serif text-xl font-bold text-pine-950">
          Completed Farm Audits
        </h3>

        {loading ? (
          <div className="flex items-center justify-center py-12 text-xs font-semibold text-slate-500">
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            <span>Loading assessment records...</span>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {historyList.map((item) => (
              <div
                key={item.id}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                    #{item.id}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-pine-950">
                        FFMI Score: {item.score.toFixed(2)} pts
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-800 font-extrabold text-[10px]">
                        Tier {item.tier}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(item.completed_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`/assessments/${item.id}/report/pdf`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>PDF</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
