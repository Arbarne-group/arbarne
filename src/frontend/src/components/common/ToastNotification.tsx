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
      card: 'bg-white/95 border-[#009924]/35 text-slate-900 shadow-lg shadow-[#009924]/10',
      iconBox: 'bg-[#009924]/10 text-[#009924] border border-[#009924]/30',
      icon: <CheckCircle2 className="w-4 h-4 text-[#009924]" />,
      badge: 'bg-[#009924]/15 text-[#009924] border border-[#009924]/30',
      badgeText: 'Success',
      timerBar: 'bg-[#009924]',
    },
    error: {
      card: 'bg-white/95 border-[#D32F2F]/35 text-slate-900 shadow-lg shadow-[#D32F2F]/10',
      iconBox: 'bg-[#D32F2F]/10 text-[#D32F2F] border border-[#D32F2F]/30',
      icon: <AlertCircle className="w-4 h-4 text-[#D32F2F]" />,
      badge: 'bg-[#D32F2F]/15 text-[#D32F2F] border border-[#D32F2F]/30',
      badgeText: 'Attention',
      timerBar: 'bg-[#D32F2F]',
    },
    warning: {
      card: 'bg-white/95 border-[#FB8C00]/35 text-slate-900 shadow-lg shadow-[#FB8C00]/10',
      iconBox: 'bg-[#FB8C00]/10 text-[#FB8C00] border border-[#FB8C00]/30',
      icon: <AlertTriangle className="w-4 h-4 text-[#FB8C00]" />,
      badge: 'bg-[#FB8C00]/15 text-[#FB8C00] border border-[#FB8C00]/30',
      badgeText: 'Warning',
      timerBar: 'bg-[#FB8C00]',
    },
    info: {
      card: 'bg-white/95 border-[#045D61]/35 text-slate-900 shadow-lg shadow-[#045D61]/10',
      iconBox: 'bg-[#045D61]/10 text-[#045D61] border border-[#045D61]/30',
      icon: <Info className="w-4 h-4 text-[#045D61]" />,
      badge: 'bg-[#045D61]/15 text-[#045D61] border border-[#045D61]/30',
      badgeText: 'Notice',
      timerBar: 'bg-[#045D61]',
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
          <p className="text-xs text-slate-600 leading-snug font-medium break-words">
            {toast.message}
          </p>
        </div>

        {/* Close Button */}
        <button
          onClick={onDismiss}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors flex-shrink-0"
          aria-label="Dismiss notification"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Progress Auto-Dismiss Timer Line */}
      {duration > 0 && (
        <div
          className={`absolute bottom-0 left-0 right-0 h-[2.5px] ${typeConfig.timerBar} opacity-85`}
          style={{
            animation: `toast-progress ${duration}ms linear forwards`,
          }}
        />
      )}
    </div>
  );
};
