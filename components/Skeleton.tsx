'use client';

import React from 'react';

/* ─── Base Skeleton Primitive ─── */
export function Skeleton({ className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={`skeleton rounded-xl ${className}`}
            {...props}
        />
    );
}

/* ─── Dashboard Skeleton ─── */
export function DashboardSkeleton() {
    return (
        <div className="space-y-10 animate-in fade-in duration-500">
            {/* Header row */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6">
                <div className="space-y-3">
                    <Skeleton className="h-10 w-64 sm:w-80 rounded-2xl" />
                    <Skeleton className="h-4 w-48 rounded-lg" />
                </div>
                <div className="flex gap-3">
                    {[1, 2, 3].map(i => (
                        <Skeleton key={i} className="h-20 w-28 rounded-2xl" />
                    ))}
                </div>
            </div>

            {/* Generation form card */}
            <div className="glass-card rounded-2xl p-4 sm:p-6 space-y-6">
                <div className="space-y-3">
                    <Skeleton className="h-4 w-32 rounded-lg" />
                    <Skeleton className="h-14 w-full rounded-2xl" />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div className="space-y-4">
                        <Skeleton className="h-4 w-40 rounded-lg" />
                        <div className="grid grid-cols-3 gap-3">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <Skeleton key={i} className="h-20 rounded-2xl" />
                            ))}
                        </div>
                    </div>
                    <div className="space-y-4">
                        <Skeleton className="h-4 w-36 rounded-lg" />
                        <div className="grid grid-cols-2 gap-3">
                            {[1, 2, 3, 4].map(i => (
                                <Skeleton key={i} className="h-16 rounded-2xl" />
                            ))}
                        </div>
                    </div>
                </div>
                <Skeleton className="h-16 w-full rounded-2xl" />
            </div>
        </div>
    );
}

/* ─── Analytics Skeleton ─── */
export function AnalyticsSkeleton() {
    return (
        <div className="space-y-10 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center gap-4 sm:gap-6">
                <Skeleton className="h-12 w-12 sm:h-16 sm:w-16 rounded-2xl" />
                <div className="space-y-2">
                    <Skeleton className="h-10 w-52 sm:w-72 rounded-2xl" />
                    <Skeleton className="h-4 w-64 rounded-lg" />
                </div>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="glass-card rounded-3xl p-5 sm:p-8 space-y-6">
                        <div className="flex items-center justify-between">
                            <Skeleton className="h-12 w-12 rounded-2xl" />
                            <Skeleton className="h-5 w-5 rounded-md" />
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-3 w-16 rounded-md" />
                            <Skeleton className="h-9 w-24 rounded-xl" />
                            <Skeleton className="h-3 w-28 rounded-md" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Two-column data panels */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
                {[1, 2].map(i => (
                    <div key={i} className="glass-card rounded-2xl p-4 sm:p-6 space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-2">
                                <Skeleton className="h-6 w-40 rounded-xl" />
                                <Skeleton className="h-3 w-52 rounded-md" />
                            </div>
                            <Skeleton className="h-8 w-20 rounded-full" />
                        </div>
                        <div className="space-y-6">
                            {[1, 2, 3, 4].map(j => (
                                <div key={j} className="space-y-3">
                                    <div className="flex justify-between">
                                        <Skeleton className="h-3 w-24 rounded-md" />
                                        <Skeleton className="h-3 w-12 rounded-md" />
                                    </div>
                                    <Skeleton className="h-2 w-full rounded-full" />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ─── History Skeleton ─── */
export function HistorySkeleton() {
    return (
        <div className="max-w-5xl mx-auto space-y-6 sm:space-y-12 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center gap-4 sm:gap-8">
                <Skeleton className="h-12 w-12 sm:h-20 sm:w-20 rounded-2xl sm:rounded-[2rem]" />
                <div className="space-y-3">
                    <Skeleton className="h-5 w-36 rounded-full" />
                    <Skeleton className="h-10 w-64 sm:w-96 rounded-2xl" />
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 sm:gap-6 bg-gray-50 border border-gray-200 p-2 rounded-2xl">
                <Skeleton className="h-14 flex-1 rounded-xl sm:rounded-2xl" />
                <Skeleton className="h-14 flex-[1.5] rounded-xl sm:rounded-2xl" />
            </div>

            {/* History entries */}
            <div className="space-y-10">
                {/* Date separator */}
                <div className="flex items-center gap-4 px-2">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
                    <Skeleton className="h-3 w-20 rounded-md" />
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
                </div>

                {[1, 2].map(i => (
                    <div key={i} className="glass-card rounded-2xl p-4 sm:p-6 space-y-6">
                        <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
                            <div className="flex items-center gap-4 sm:gap-6">
                                <Skeleton className="h-10 w-10 sm:h-14 sm:w-14 rounded-xl sm:rounded-2xl" />
                                <div className="space-y-3">
                                    <Skeleton className="h-8 w-48 sm:w-72 rounded-xl" />
                                    <div className="flex items-center gap-3">
                                        <Skeleton className="h-3 w-16 rounded-md" />
                                        <div className="flex gap-1.5">
                                            {[1, 2, 3].map(j => (
                                                <Skeleton key={j} className="h-6 w-6 rounded-md" />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4].map(j => (
                                    <Skeleton key={j} className="h-11 w-11 rounded-2xl" />
                                ))}
                            </div>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                            {[1, 2, 3].map(j => (
                                <Skeleton key={j} className="h-40 rounded-xl sm:rounded-[2rem]" />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ─── Library Skeleton ─── */
export function LibrarySkeleton() {
    return (
        <div className="container mx-auto max-w-7xl space-y-8 sm:space-y-12 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="flex items-center gap-4 sm:gap-6">
                    <Skeleton className="h-14 w-14 sm:h-20 sm:w-20 rounded-2xl sm:rounded-[2rem]" />
                    <div className="space-y-3">
                        <Skeleton className="h-5 w-28 rounded-full" />
                        <Skeleton className="h-10 w-52 sm:w-64 rounded-2xl" />
                    </div>
                </div>
                <Skeleton className="h-4 w-32 rounded-lg" />
            </div>

            <div className="grid grid-cols-12 gap-6 lg:gap-8">
                {/* Sidebar */}
                <div className="col-span-12 lg:col-span-3 space-y-4">
                    <div className="glass-card rounded-2xl p-5 space-y-3">
                        <Skeleton className="h-3 w-16 rounded-md" />
                        {[1, 2, 3].map(i => (
                            <Skeleton key={i} className="h-10 w-full rounded-xl" />
                        ))}
                    </div>
                    <div className="glass-card rounded-2xl p-5 space-y-3">
                        <Skeleton className="h-3 w-12 rounded-md" />
                        <div className="flex flex-wrap gap-2">
                            {[1, 2, 3, 4].map(i => (
                                <Skeleton key={i} className="h-8 w-16 rounded-xl" />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Content area */}
                <div className="col-span-12 lg:col-span-9 space-y-6">
                    <Skeleton className="h-14 w-full rounded-2xl" />
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="glass-card rounded-2xl sm:rounded-[2rem] p-5 sm:p-8 space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="flex-1 space-y-3">
                                        <Skeleton className="h-5 w-48 rounded-lg" />
                                        <div className="flex gap-2">
                                            <Skeleton className="h-6 w-16 rounded-full" />
                                            <Skeleton className="h-6 w-20 rounded-full" />
                                        </div>
                                    </div>
                                    <div className="flex gap-1.5">
                                        {[1, 2, 3].map(j => (
                                            <Skeleton key={j} className="h-9 w-9 rounded-xl" />
                                        ))}
                                    </div>
                                </div>
                                <Skeleton className="h-12 w-full rounded-lg" />
                                <div className="flex justify-between pt-3 border-t border-gray-200">
                                    <Skeleton className="h-3 w-24 rounded-md" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ─── Brand Voice Skeleton ─── */
export function BrandVoiceSkeleton() {
    return (
        <div className="container mx-auto max-w-5xl animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 mb-8 sm:mb-12">
                <div className="space-y-4">
                    <Skeleton className="h-8 w-48 rounded-full" />
                    <Skeleton className="h-10 w-64 sm:w-80 rounded-2xl" />
                </div>
                <Skeleton className="h-14 w-56 rounded-2xl" />
            </div>

            {/* Voice cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[1, 2].map(i => (
                    <div key={i} className="glass-card rounded-2xl p-4 sm:p-6 space-y-6">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3 sm:gap-5">
                                <Skeleton className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl" />
                                <div className="space-y-3">
                                    <Skeleton className="h-6 w-36 rounded-xl" />
                                    <Skeleton className="h-6 w-24 rounded-full" />
                                </div>
                            </div>
                            <div className="flex gap-2">
                                {[1, 2, 3].map(j => (
                                    <Skeleton key={j} className="h-11 w-11 rounded-2xl" />
                                ))}
                            </div>
                        </div>
                        <div className="space-y-4">
                            <Skeleton className="h-3 w-32 rounded-md" />
                            <div className="flex gap-2">
                                {[1, 2, 3].map(j => (
                                    <Skeleton key={j} className="h-9 w-24 rounded-xl" />
                                ))}
                            </div>
                        </div>
                        <div className="space-y-4">
                            <Skeleton className="h-3 w-28 rounded-md" />
                            <Skeleton className="h-12 w-full rounded-lg" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ─── Calendar Skeleton ─── */
export function CalendarSkeleton() {
    return (
        <div className="container mx-auto max-w-7xl animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 mb-8 sm:mb-12">
                <div className="space-y-4">
                    <Skeleton className="h-8 w-40 rounded-full" />
                    <Skeleton className="h-10 w-72 rounded-2xl" />
                </div>
                <div className="flex items-center gap-3">
                    <Skeleton className="h-12 w-48 rounded-2xl" />
                    <Skeleton className="h-12 w-20 rounded-2xl" />
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[1fr_350px] gap-8">
                {/* Calendar grid */}
                <div className="space-y-8">
                    <div className="glass-card rounded-2xl sm:rounded-[2.5rem] p-4 sm:p-8">
                        <div className="grid grid-cols-7 gap-1 sm:gap-3 mb-6">
                            {[1, 2, 3, 4, 5, 6, 7].map(i => (
                                <Skeleton key={i} className="h-3 w-full rounded-md" />
                            ))}
                        </div>
                        <div className="grid grid-cols-7 gap-1 sm:gap-3">
                            {Array.from({ length: 35 }).map((_, i) => (
                                <Skeleton key={i} className="aspect-square rounded-xl sm:rounded-3xl" />
                            ))}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                        {[1, 2, 3].map(i => (
                            <Skeleton key={i} className="h-24 rounded-[2rem]" />
                        ))}
                    </div>
                </div>

                {/* Right sidebar */}
                <div className="space-y-6">
                    <Skeleton className="h-80 rounded-2xl sm:rounded-[2.5rem]" />
                    <Skeleton className="h-40 rounded-2xl sm:rounded-[2rem]" />
                </div>
            </div>
        </div>
    );
}

/* ─── Command Center Skeleton ─── */
export function CommandCenterSkeleton() {
    return (
        <div className="container mx-auto max-w-6xl animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 mb-8 sm:mb-12">
                <div className="space-y-4">
                    <Skeleton className="h-8 w-40 rounded-full" />
                    <Skeleton className="h-10 w-72 rounded-2xl" />
                </div>
                <Skeleton className="h-20 w-48 rounded-2xl" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
                {/* Left */}
                <div className="lg:col-span-1 space-y-8">
                    <Skeleton className="h-56 rounded-3xl" />
                    <Skeleton className="h-40 rounded-3xl" />
                </div>
                {/* Right */}
                <div className="lg:col-span-2">
                    <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-6">
                        <div className="flex items-center justify-between">
                            <Skeleton className="h-6 w-40 rounded-xl" />
                            <Skeleton className="h-8 w-24 rounded-full" />
                        </div>
                        {[1, 2, 3].map(i => (
                            <Skeleton key={i} className="h-28 w-full rounded-2xl" />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ─── Settings Skeleton ─── */
export function SettingsSkeleton() {
    return (
        <div className="container mx-auto max-w-4xl animate-in fade-in duration-500">
            <div className="space-y-4 mb-8 sm:mb-12">
                <Skeleton className="h-8 w-40 rounded-full" />
                <Skeleton className="h-12 w-64 sm:w-96 rounded-2xl" />
            </div>

            <div className="space-y-8">
                {[1, 2, 3].map(i => (
                    <div key={i} className="glass-card rounded-2xl p-4 sm:p-6 space-y-6">
                        <div className="flex items-center gap-4">
                            <Skeleton className="h-12 w-12 rounded-2xl" />
                            <div className="space-y-2">
                                <Skeleton className="h-6 w-48 rounded-lg" />
                                <Skeleton className="h-2 w-16 rounded-full" />
                            </div>
                        </div>
                        <Skeleton className="h-32 w-full rounded-2xl" />
                    </div>
                ))}
            </div>
        </div>
    );
}
