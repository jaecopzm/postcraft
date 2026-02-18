'use client';

import Sidebar from '../../components/Sidebar';
import { SidebarProvider, useSidebar } from '../contexts/SidebarContext';

function SettingsContent({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar();
  
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#1A1A1F] to-[#22222A]">
      <Sidebar />
      <main className={`flex-1 p-8 transition-all duration-300 ${isCollapsed ? 'lg:ml-[72px]' : 'lg:ml-80'}`}>
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
