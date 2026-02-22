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
                            className="relative flex flex-col items-center justify-center gap-1.5 px-3 py-2 min-w-[56px] h-[52px]"
                        >
                            <Icon
                                className={`h-[18px] w-[18px] sm:h-5 sm:w-5 relative z-10 transition-all duration-300 ${active ? 'text-primary scale-110 -translate-y-0.5' : 'text-white/40 group-hover:text-white/70'
                                    }`}
                            />
                            <span
                                className={`text-[9px] sm:text-[10px] font-black tracking-widest uppercase relative z-10 transition-colors duration-300 ${active ? 'text-white' : 'text-white/20'
                                    }`}
                            >
                                {item.name}
                            </span>
                            {active && (
                                <motion.div
                                    layoutId="mobile-nav-dot"
                                    className="absolute -bottom-1 h-1 w-1 bg-primary rounded-full shadow-[0_0_8px_rgba(236,88,0,0.8)]"
                                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                />
                            )}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
