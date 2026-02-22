'use client';

import Sidebar from '@/components/Sidebar';
import { useSidebar } from '../contexts/SidebarContext';
import MobileNav from '@/components/MobileNav';
import { useEffect, useState } from 'react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar();
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return (
    <div className="flex min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Background Decorative Glow */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] pointer-events-none z-0" />
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-accent/2 blur-[120px] pointer-events-none z-0" />

      <Sidebar />

      {/*
        On mobile: sidebar is a fixed overlay → main takes full width (marginLeft: 0)
        On lg+: sidebar is always visible → main gets a left margin matching sidebar width
      */}
      <main
        className="flex-1 relative z-10 p-4 md:p-6 lg:p-8 transition-[margin] duration-300"
        style={{ marginLeft: isDesktop ? (isCollapsed ? 72 : 280) : 0 }}
      >
        <div className="max-w-7xl mx-auto h-full pt-16 lg:pt-0 pb-24 lg:pb-0">
          {children}
        </div>
      </main>

      {/* Mobile bottom nav — only visible on < lg */}
      <MobileNav />
    </div>
  );
}
