import React, { useState } from 'react';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Info,
  Zap,
  X,
  Trash2,
  CheckCheck,
} from 'lucide-react';
import { useAppStore } from '../store/useStore';
import { InboxItem } from '../types';

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatTime(epoch: number): string {
  const diffMs = Date.now() - epoch;
  const diffMin = Math.floor(diffMs / 60_000);
  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `${diffH}h ago`;
  const diffD = Math.floor(diffH / 24);
  if (diffD === 1) return 'Yesterday';
  return `${diffD}d ago`;
}

const CategoryIcon: React.FC<{ cat: InboxItem['category'] }> = ({ cat }) => {
  const base = 'w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0';
  switch (cat) {
    case 'success':
      return <div className={`${base} bg-emerald-500/20`}><CheckCircle2 className="w-4.5 h-4.5 text-emerald-400" style={{ width: 18, height: 18 }} /></div>;
    case 'warning':
    case 'alert':
      return <div className={`${base} bg-amber-500/20`}><AlertTriangle className="w-4.5 h-4.5 text-amber-400" style={{ width: 18, height: 18 }} /></div>;
    case 'xp':
      return <div className={`${base} bg-purple-500/20`}><Zap className="w-4.5 h-4.5 text-purple-400" style={{ width: 18, height: 18 }} /></div>;
    default:
      return <div className={`${base} bg-sky-500/20`}><Info className="w-4.5 h-4.5 text-sky-400" style={{ width: 18, height: 18 }} /></div>;
  }
};

// ─── NotificationsPage ────────────────────────────────────────────────────────
type Filter = 'all' | 'unread';

export const NotificationsPage: React.FC = () => {
  const { inbox, markAllInboxRead, dismissInboxItem, clearInbox } = useAppStore();
  const [filter, setFilter] = useState<Filter>('all');

  const unreadCount = inbox.filter(n => !n.read).length;
  const displayed = filter === 'unread' ? inbox.filter(n => !n.read) : inbox;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#033c3f] to-[#011e20] px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-2xl mx-auto">

        {/* ── Header ── */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#009924]/20 border border-[#009924]/30 flex items-center justify-center">
              <Bell className="w-5 h-5 text-[#009924]" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Notifications</h1>
              <p className="text-xs text-white/50">
                {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
              </p>
            </div>
          </div>

          {/* Bulk actions */}
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllInboxRead}
                title="Mark all as read"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/70 hover:text-white text-xs font-medium transition-colors cursor-pointer"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Mark all read</span>
              </button>
            )}
            {inbox.length > 0 && (
              <button
                onClick={clearInbox}
                title="Clear all notifications"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-300/70 hover:text-red-200 text-xs font-medium transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Clear all</span>
              </button>
            )}
          </div>
        </div>

        {/* ── Filter tabs ── */}
        <div className="flex gap-1 p-1 bg-white/5 rounded-xl mb-6 w-fit">
          {(['all', 'unread'] as Filter[]).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filter === f
                  ? 'bg-[#009924] text-white shadow-sm'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              {f === 'all' ? `All (${inbox.length})` : `Unread (${unreadCount})`}
            </button>
          ))}
        </div>

        {/* ── Notification list ── */}
        {displayed.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center">
              <Bell className="w-7 h-7 text-white/20" />
            </div>
            <p className="text-white/40 text-sm font-medium">
              {filter === 'unread' ? "No unread notifications" : "You're all caught up! 🎉"}
            </p>
          </div>
        ) : (
          <ul className="flex flex-col gap-2">
            {displayed.map(item => (
              <li
                key={item.id}
                className={`flex items-start gap-3 p-4 rounded-2xl border transition-colors ${
                  item.read
                    ? 'bg-white/[0.03] border-white/8 hover:bg-white/[0.05]'
                    : 'bg-white/[0.07] border-white/15 hover:bg-white/10'
                }`}
              >
                <CategoryIcon cat={item.category} />

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm font-semibold leading-snug ${item.read ? 'text-white/70' : 'text-white'}`}>
                      {item.title}
                    </p>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {!item.read && (
                        <span className="w-2 h-2 rounded-full bg-[#009924]" aria-label="Unread" />
                      )}
                      <button
                        onClick={() => dismissInboxItem(item.id)}
                        aria-label="Dismiss"
                        className="p-1 rounded-md text-white/20 hover:text-white/60 hover:bg-white/10 transition-colors cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-white/50 mt-0.5 leading-snug">{item.body}</p>
                  <p className="text-[11px] text-white/30 mt-1.5">{formatTime(item.createdAt)}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
