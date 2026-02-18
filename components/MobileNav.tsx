'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Rocket, BarChart3, CalendarIcon, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

const NAV_ITEMS = [
    { name: 'Home', href: '/dashboard', icon: Home },
    { name: 'Create', href: '/command-center', icon: Rocket },
    { name: 'Calendar', href: '/calendar', icon: CalendarIcon },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Settings', href: '/settings', icon: Settings },
];

export default function MobileNav() {
    const pathname = usePathname();

    return (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50">
            {/* Blur backdrop */}
            <div className="absolute inset-0 bg-[#0A0A0B]/80 backdrop-blur-2xl border-t border-white/5" />

            <div className="relative flex items-center justify-around px-2 py-2 safe-area-pb">
                {NAV_ITEMS.map((item) => {
                    const Icon = item.icon;
                    const active = pathname === item.href;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="relative flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl transition-all duration-200 min-w-[56px]"
                        >
                            {active && (
                                <motion.div
                                    layoutId="mobile-nav-active"
                                    className="absolute inset-0 bg-primary/10 rounded-xl"
                                    transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                                />
                            )}
                            <Icon
                                className={`h-5 w-5 relative z-10 transition-all duration-200 ${active ? 'text-primary scale-110' : 'text-white/30'
                                    }`}
                            />
                            <span
                                className={`text-[9px] font-black tracking-wider uppercase relative z-10 transition-colors duration-200 ${active ? 'text-primary' : 'text-white/20'
                                    }`}
                            >
                                {item.name}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
