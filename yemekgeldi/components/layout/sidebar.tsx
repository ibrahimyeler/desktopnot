"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  UtensilsCrossed,
  Building2,
  Users,
  BookOpen,
  ShoppingCart,
  Package,
  CreditCard,
  HeadphonesIcon,
  Bell,
  Settings,
  FileText,
  QrCode,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface MenuItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

const menuItems: MenuItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Catering", href: "/catering", icon: UtensilsCrossed },
  { title: "Şirketler", href: "/companies", icon: Building2 },
  { title: "Çalışanlar", href: "/employees", icon: Users },
  { title: "Menüler", href: "/menus", icon: BookOpen },
  { title: "Siparişler", href: "/orders", icon: ShoppingCart },
  { title: "Teslimat & QR", href: "/delivery", icon: QrCode },
  { title: "Fiyatlandırma", href: "/pricing", icon: CreditCard },
  { title: "Destek", href: "/support", icon: HeadphonesIcon },
  { title: "Bildirimler", href: "/notifications", icon: Bell },
  { title: "Loglar", href: "/logs", icon: FileText },
  { title: "Ayarlar", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-[#00ff88]/30 bg-gray-900/80 backdrop-blur-sm">
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center border-b border-[#00ff88]/30 px-6">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#00ff88]">
              <UtensilsCrossed className="h-5 w-5 text-black" />
            </div>
            <span className="text-xl font-bold text-white">Yemek Geldi</span>
          </Link>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            
            return (
              <Link
                key={item.href}
                href={item.href}
                  className={cn(
                  "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-[#00ff88]/20 text-[#00ff88] border-l-2 border-[#00ff88]"
                    : "text-white/70 hover:bg-[#00ff88]/10 hover:text-[#00ff88]"
                )}
              >
                <Icon className={cn("h-5 w-5", isActive ? "text-[#00ff88]" : "text-white/60")} />
                <span className="flex-1">{item.title}</span>
                {item.badge && item.badge > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-[#00ff88]/30 p-4">
          <div className="flex items-center space-x-3 rounded-lg px-3 py-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#00ff88]">
              <span className="text-sm font-medium text-black font-bold">A</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-white">Admin</p>
              <p className="text-xs text-[#00ff88]">admin@yemekgeldi.com</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

