import React from 'react';
import { useAppStore } from '../../store/useStore';
import {
  CheckCircle2,
  AlertCircle,
  Info,
  AlertTriangle,
  X,
} from 'lucide-react';
import { AppNotification } from '../../types';

export const ToastNotification: React.FC = () => {
  const { toasts, removeToast } = useAppStore();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div
      className="fixed top-4 right-4 sm:top-6 sm:right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none"
      aria-live="polite"
    >
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onDismiss={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};

interface ToastItemProps {
  toast: AppNotification;
  onDismiss: () => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onDismiss }) => {
  const typeConfig = {
    success: {
      card: 'bg-white/95 border-emerald-200/90 text-slate-900',
      iconBox: 'bg-emerald-50 text-emerald-600 border border-emerald-200',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />,
      badge: 'bg-emerald-100 text-emerald-800',
      badgeText: 'Success',
      timerBar: 'bg-emerald-500',
    },
    error: {
      card: 'bg-white/95 border-red-200/90 text-slate-900',
      iconBox: 'bg-red-50 text-red-600 border border-red-200',
      icon: <AlertCircle className="w-4 h-4 text-red-600" />,
      badge: 'bg-red-100 text-red-800',
      badgeText: 'Attention',
      timerBar: 'bg-red-500',
    },
    warning: {
      card: 'bg-white/95 border-amber-200/90 text-slate-900',
      iconBox: 'bg-amber-50 text-amber-600 border border-amber-200',
      icon: <AlertTriangle className="w-4 h-4 text-amber-600" />,
      badge: 'bg-amber-100 text-amber-800',
      badgeText: 'Warning',
      timerBar: 'bg-amber-500',
    },
    info: {
      card: 'bg-white/95 border-slate-200/90 text-slate-900',
      iconBox: 'bg-teal-50 text-teal-700 border border-teal-200',
      icon: <Info className="w-4 h-4 text-teal-700" />,
      badge: 'bg-teal-100 text-teal-800',
      badgeText: 'Notice',
      timerBar: 'bg-teal-600',
    },
  }[toast.type || 'info'];

  const duration = toast.durationMs ?? 4000;

  return (
    <div
      className={`pointer-events-auto p-3.5 rounded-2xl border backdrop-blur-md transition-all toast-enter overflow-hidden relative ${typeConfig.card}`}
      role="alert"
    >
      <div className="flex items-start gap-3">
        {/* Rounded Icon Capsule */}
        <div
          className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${typeConfig.iconBox}`}
        >
          {typeConfig.icon}
        </div>

        {/* Text Content */}
        <div className="flex-1 min-w-0 pr-1">
          <div className="flex items-center gap-2 mb-0.5">
            {toast.title ? (
              <span className="text-xs font-bold text-slate-900 tracking-tight">
                {toast.title}
              </span>
            ) : null}
            <span
              className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-md ${typeConfig.badge}`}
            >
              {typeConfig.badgeText}
            </span>
          </div>

          <p className="text-xs font-medium text-slate-600 leading-snug break-words">
            {toast.message}
          </p>
        </div>

        {/* Close Button */}
        <button
          onClick={onDismiss}
          className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors flex-shrink-0"
          aria-label="Close notification"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Subtle Progress Bar */}
      {duration > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-100 overflow-hidden">
          <div
            className={`h-full toast-progress ${typeConfig.timerBar}`}
            style={{ animationDuration: `${duration}ms` }}
          />
        </div>
      )}
    </div>
  );
};
