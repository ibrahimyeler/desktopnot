'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  UserCircle, 
  Settings,
  Scissors,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useSidebar } from './SidebarContext';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navigation: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Berberler', href: '/barbers', icon: Scissors },
  { name: 'Randevular', href: '/appointments', icon: Calendar },
  { name: 'Müşteriler', href: '/customers', icon: Users },
  { name: 'Ayarlar', href: '/settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { isOpen, toggle } = useSidebar();

  return (
    <div className={`
      fixed left-0 top-0 h-screen bg-[#1E293B] border-r border-[#334155] flex flex-col
      transition-all duration-300 ease-in-out z-50
      ${isOpen ? 'w-16' : 'w-0 overflow-hidden'}
    `}>
      {/* Toggle Button - Top */}
      <div className="h-16 flex items-center justify-center border-b border-[#334155] relative">
        <button
          onClick={toggle}
          className="absolute -right-3 w-6 h-6 bg-[#3498DB] rounded-full flex items-center justify-center shadow-lg hover:bg-[#3498DB]/90 transition-colors z-10"
        >
          {isOpen ? (
            <ChevronLeft className="w-4 h-4 text-white" />
          ) : (
            <ChevronRight className="w-4 h-4 text-white" />
          )}
        </button>
        {isOpen && (
          <div className="w-10 h-10 bg-[#3498DB] rounded-lg flex items-center justify-center">
            <Scissors className="w-5 h-5 text-white" />
          </div>
        )}
      </div>

      {/* Navigation */}
      {isOpen && (
        <nav className="flex-1 px-2 py-4 space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                title={item.name}
                className={`
                  flex items-center justify-center w-12 h-12 rounded-lg transition-all duration-200
                  ${isActive 
                    ? 'bg-[#3498DB] text-white shadow-lg shadow-[#3498DB]/20' 
                    : 'text-[#CBD5E1] hover:bg-[#334155] hover:text-[#E5E7EB]'
                  }
                `}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-[#94A3B8]'}`} />
              </Link>
            );
          })}
        </nav>
      )}

      {/* User Profile */}
      {isOpen && (
        <div className="p-2 border-t border-[#334155]">
          <div className="flex justify-center">
            <div className="w-12 h-12 bg-[#3498DB] rounded-lg flex items-center justify-center cursor-pointer hover:bg-[#3498DB]/80 transition-colors">
              <UserCircle className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
