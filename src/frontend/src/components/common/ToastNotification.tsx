import React from 'react';
import { useAppStore } from '../../store/useStore';
import {
  CheckCircle2,
  AlertCircle,
  Info,
  AlertTriangle,
  X,
  Sparkles,
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
        <ToastItem key={toast.id} toast={toast} onDismiss={() => removeToast(toast.id)} />
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
      container:
        'bg-[#022c24]/95 border-emerald-400/50 text-emerald-100 shadow-emerald-950/50',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />,
      accent: 'bg-emerald-400',
      badge: 'Success',
    },
    error: {
      container:
        'bg-red-950/95 border-red-500/50 text-red-100 shadow-red-950/50',
      icon: <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />,
      accent: 'bg-red-500',
      badge: 'Notice',
    },
    warning: {
      container:
        'bg-amber-950/95 border-amber-500/50 text-amber-100 shadow-amber-950/50',
      icon: <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />,
      accent: 'bg-amber-400',
      badge: 'Warning',
    },
    info: {
      container:
        'bg-[#011913]/95 border-sprout-400/50 text-sprout-100 shadow-pine-950/50',
      icon: <Info className="w-5 h-5 text-sprout-400 flex-shrink-0" />,
      accent: 'bg-sprout-400',
      badge: 'Update',
    },
  }[toast.type || 'info'];

  return (
    <div
      className={`pointer-events-auto p-4 rounded-2xl border backdrop-blur-xl shadow-2xl transition-all transform duration-300 animate-slide-in relative overflow-hidden flex items-start gap-3 ${typeConfig.container}`}
      role="alert"
    >
      {/* Visual Accent bar on left */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-1.5 ${typeConfig.accent}`}
      />

      <div className="mt-0.5">{typeConfig.icon}</div>

      <div className="flex-1 min-w-0 pr-1">
        {toast.title ? (
          <div className="text-xs font-bold text-white tracking-wide mb-0.5">
            {toast.title}
          </div>
        ) : null}
        <div className="text-xs font-medium leading-relaxed opacity-90 break-words">
          {toast.message}
        </div>
      </div>

      <button
        onClick={onDismiss}
        className="p-1 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors flex-shrink-0"
        aria-label="Dismiss notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
