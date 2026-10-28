import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

type Toast = {
  id: number;
  type: ToastType;
  title: string;
  message?: string;
};

type ToastContextType = {
  showToast: (type: ToastType, title: string, message?: string) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((type: ToastType, title: string, message?: string) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const dismiss = (id: number) => setToasts((prev) => prev.filter((t) => t.id !== id));

  const config = {
    success: { icon: CheckCircle2, color: 'text-accent-500', border: 'border-accent-500/30' },
    error: { icon: XCircle, color: 'text-red-500', border: 'border-red-500/30' },
    info: { icon: Info, color: 'text-primary-500', border: 'border-primary-500/30' },
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 max-w-sm pointer-events-none">
        {toasts.map((toast) => {
          const cfg = config[toast.type];
          const Icon = cfg.icon;
          return (
            <div
              key={toast.id}
              className={`glass-card rounded-2xl px-5 py-4 shadow-2xl animate-slide-in-right flex items-start gap-3 pointer-events-auto border-l-4 ${cfg.border}`}
            >
              <Icon className={`w-5 h-5 ${cfg.color} flex-shrink-0 mt-0.5`} />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-900 dark:text-white text-sm">{toast.title}</p>
                {toast.message && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{toast.message}</p>
                )}
              </div>
              <button
                onClick={() => dismiss(toast.id)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
