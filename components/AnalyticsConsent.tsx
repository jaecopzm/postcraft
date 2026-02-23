"use client";

import { useEffect, useState } from 'react';

export default function AnalyticsConsent() {
    const [consent, setConsent] = useState<string | null>(null);
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        try {
            const stored = window.localStorage.getItem('analytics_consent');
            setConsent(stored);
            if (stored) setVisible(false);
        } catch (e) {
            setConsent('denied');
            setVisible(false);
        }
    }, []);

    if (consent || !visible) return null;

    const accept = async () => {
        try {
            window.localStorage.setItem('analytics_consent', 'granted');
            setConsent('granted');
            setVisible(false);
            const mod = await import('../lib/firebase');
            if (mod && typeof mod.loadAnalytics === 'function') {
                await mod.loadAnalytics();
            }
        } catch (err) {
            console.warn('Failed to enable analytics', err);
        }
    };

    const decline = () => {
        try {
            window.localStorage.setItem('analytics_consent', 'denied');
            setConsent('denied');
            setVisible(false);
        } catch (e) {
            console.warn('Failed to save analytics preference', e);
        }
    };

    return (
        <div className="fixed bottom-4 left-4 right-4 z-50 flex justify-center">
            <div className="max-w-3xl p-4 bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 rounded-lg shadow-lg flex items-center gap-4">
                <div className="flex-1 text-sm text-slate-800 dark:text-slate-200">
                    We use analytics to improve Postcraft. Accept to help us improve the product.
                    <a href="/settings" className="ml-2 font-medium underline">Manage</a>
                </div>
                <div className="flex gap-2">
                    <button onClick={decline} aria-label="Decline analytics" className="px-3 py-1 rounded-md bg-gray-200 text-sm text-slate-800 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300">Decline</button>
                    <button onClick={accept} aria-label="Accept analytics and close" className="px-3 py-1 rounded-md bg-primary text-sm text-white shadow-md ring-1 ring-primary/30 hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary/40">Accept</button>
                </div>
            </div>
        </div>
    );
}
