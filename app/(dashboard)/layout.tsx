import Sidebar from '../../components/Sidebar';
import { useSidebar } from '../contexts/SidebarContext';
import { motion } from 'framer-motion';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar();

  return (
    <div className="flex min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Background Decorative Glow */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] pointer-events-none z-0" />
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-accent/2 blur-[120px] pointer-events-none z-0" />

      <Sidebar />

      <motion.main
        initial={false}
        animate={{
          marginLeft: isCollapsed ? 72 : 320,
          padding: typeof window !== 'undefined' && window.innerWidth < 1024 ? '1rem' : '2rem'
        }}
        className="flex-1 relative z-10 transition-all duration-300"
      >
        <div className="max-w-7xl mx-auto h-full pt-16 lg:pt-0">
          {children}
        </div>
      </motion.main>
    </div>
  );
}
