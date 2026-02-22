'use client';

import Sidebar from '../../components/Sidebar';
import { SidebarProvider, useSidebar } from '../contexts/SidebarContext';

function SettingsContent({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar();
  
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className={`flex-1 p-8 transition-all duration-300 ${isCollapsed ? 'lg:ml-[72px]' : 'lg:ml-[280px]'}`}>
        {children}
      </main>
    </div>
  );
}

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <SettingsContent>{children}</SettingsContent>
    </SidebarProvider>
  );
}
