'use client';

import { createContext, useContext, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, AlertCircle, Info } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextValue {
    toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);
    const timerRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

    const dismiss = useCallback((id: string) => {
        clearTimeout(timerRef.current[id]);
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const toast = useCallback((message: string, type: ToastType = 'success') => {
        const id = Math.random().toString(36).slice(2);
        setToasts(prev => [...prev.slice(-3), { id, message, type }]);
        timerRef.current[id] = setTimeout(() => dismiss(id), 3500);
    }, [dismiss]);

    return (
        <ToastContext.Provider value={{ toast }}>
            {children}

            {/* Toast Portal */}
            <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
                <AnimatePresence mode="sync">
                    {toasts.map(t => (
                        <motion.div
                            key={t.id}
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                            className={`pointer-events-auto flex items-center gap-3 px-5 py-4 rounded-2xl border shadow-2xl backdrop-blur-2xl min-w-[240px] max-w-[340px] ${t.type === 'success'
                                    ? 'bg-green-500/10 border-green-500/30 text-green-400'
                                    : t.type === 'error'
                                        ? 'bg-red-500/10 border-red-500/30 text-red-400'
                                        : 'bg-primary/10 border-primary/30 text-primary'
                                }`}
                        >
                            <div className={`shrink-0 h-7 w-7 rounded-xl flex items-center justify-center ${t.type === 'success' ? 'bg-green-500/20' : t.type === 'error' ? 'bg-red-500/20' : 'bg-primary/20'
                                }`}>
                                {t.type === 'success' && <Check className="h-4 w-4" />}
                                {t.type === 'error' && <AlertCircle className="h-4 w-4" />}
                                {t.type === 'info' && <Info className="h-4 w-4" />}
                            </div>
                            <p className="text-xs font-bold tracking-wide flex-1">{t.message}</p>
                            <button
                                onClick={() => dismiss(t.id)}
                                className="shrink-0 p-1 opacity-50 hover:opacity-100 transition-opacity"
                            >
                                <X className="h-3.5 w-3.5" />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error('useToast must be used within ToastProvider');
    return ctx;
}
