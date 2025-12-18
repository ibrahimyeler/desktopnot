"use client";

import { Bell, Search, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#00ff88]/30 bg-gray-900/80 backdrop-blur-sm px-6">
      <div className="flex flex-1 items-center">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#00ff88]" />
          <input
            type="search"
            placeholder="Ara..."
            className="h-10 w-full rounded-lg border border-[#00ff88]/50 bg-gray-900/50 backdrop-blur-sm text-white pl-10 pr-4 text-sm focus:border-[#00ff88] focus:outline-none focus:ring-2 focus:ring-[#00ff88]/20 placeholder:text-gray-400"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button className="relative flex h-10 w-10 items-center justify-center rounded-lg text-[#00ff88] hover:bg-[#00ff88]/10">
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00ff88] opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#00ff88]"></span>
          </span>
        </button>

        <div className="h-8 w-px bg-[#00ff88]/30"></div>

        <button className="flex items-center space-x-2 rounded-lg px-3 py-2 text-sm font-medium text-white hover:bg-[#00ff88]/10">
          <User className="h-5 w-5" />
          <span>Profil</span>
        </button>

        <Button variant="ghost" size="sm">
          <LogOut className="mr-2 h-4 w-4" />
          Çıkış
        </Button>
      </div>
    </header>
  );
}

