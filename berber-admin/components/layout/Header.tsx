'use client';

import { Bell, Search, Menu } from 'lucide-react';
import { useSidebar } from './SidebarContext';

export default function Header() {
  const { toggle, isOpen } = useSidebar();

  return (
    <header className="h-16 bg-[#1E293B] border-b border-[#334155] flex items-center justify-between px-6">
      {/* Left Side - Menu Toggle */}
      <div className="flex items-center gap-4">
        {!isOpen && (
          <button
            onClick={toggle}
            className="p-2 text-[#CBD5E1] hover:text-[#E5E7EB] hover:bg-[#334155] rounded-lg transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        {/* Search Bar */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#94A3B8]" />
            <input
              type="text"
              placeholder="Ara..."
              className="w-full pl-10 pr-4 py-2 bg-[#0F172A] border border-[#334155] rounded-lg text-[#E5E7EB] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#3498DB] focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative p-2 text-[#CBD5E1] hover:text-[#E5E7EB] hover:bg-[#334155] rounded-lg transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-[#E74C3C] rounded-full"></span>
        </button>

        {/* Date */}
        <div className="text-sm text-[#94A3B8]">
          {new Date().toLocaleDateString('tr-TR', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>
    </header>
  );
}
