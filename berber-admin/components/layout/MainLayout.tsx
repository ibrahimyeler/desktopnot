'use client';

import Sidebar from './Sidebar';
import Header from './Header';
import { SidebarProvider, useSidebar } from './SidebarContext';

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { isOpen } = useSidebar();

  return (
    <div className="flex h-screen bg-[#0F172A]">
      <Sidebar />
      <div className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${isOpen ? 'ml-16' : 'ml-0'}`}>
        <Header />
        <main className="flex-1 overflow-y-auto px-[10px] py-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <LayoutContent>{children}</LayoutContent>
    </SidebarProvider>
  );
}
