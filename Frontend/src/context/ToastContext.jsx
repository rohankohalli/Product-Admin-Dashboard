/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((message, type = 'success', duration = 3500) => {
    const id = Date.now() + Math.random().toString(36).slice(2, 6);
    const newToast = { id, message, type };

    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  const toast = {
    success: (msg, dur) => addToast(msg, 'success', dur),
    error: (msg, dur) => addToast(msg, 'error', dur),
    info: (msg, dur) => addToast(msg, 'info', dur),
    warning: (msg, dur) => addToast(msg, 'warning', dur),
  };

  const getToastStyles = (type) => {
    switch (type) {
      case 'error':
        return {
          container: 'bg-white border-rose-200 text-zinc-900 shadow-rose-950/5',
          icon: <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />,
          badge: 'bg-rose-50 text-rose-700',
        };
      case 'warning':
        return {
          container: 'bg-white border-amber-200 text-zinc-900 shadow-amber-950/5',
          icon: <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />,
          badge: 'bg-amber-50 text-amber-700',
        };
      case 'info':
        return {
          container: 'bg-white border-indigo-200 text-zinc-900 shadow-indigo-950/5',
          icon: <Info className="w-4 h-4 text-indigo-600 shrink-0" />,
          badge: 'bg-indigo-50 text-indigo-700',
        };
      case 'success':
      default:
        return {
          container: 'bg-white border-zinc-200/90 text-zinc-900 shadow-zinc-950/5',
          icon: <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />,
          badge: 'bg-emerald-50 text-emerald-700',
        };
    }
  };

  return (
    <ToastContext.Provider value={{ toast, removeToast }}>
      {children}

      {/* Floating Toast Notification Stack */}
      <aside
        aria-live="polite"
        aria-atomic="true"
        className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0"
      >
        {toasts.map((t) => {
          const styles = getToastStyles(t.type);

          return (
            <div
              key={t.id}
              role="status"
              className={`pointer-events-auto flex items-start gap-3 p-3.5 bg-white border rounded-xl shadow-lg transition-all duration-200 animate-in slide-in-from-bottom-3 fade-in ${styles.container}`}
            >
              <div className="pt-0.5">{styles.icon}</div>
              <div className="flex-1 text-xs font-medium text-zinc-800 leading-relaxed pr-2">
                {t.message}
              </div>
              <button
                type="button"
                onClick={() => removeToast(t.id)}
                className="text-zinc-400 hover:text-zinc-700 p-0.5 rounded-md hover:bg-zinc-100 transition-colors cursor-pointer shrink-0 -mr-1 -mt-0.5"
                aria-label="Dismiss notification"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </aside>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
