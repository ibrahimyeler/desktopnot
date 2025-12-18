"use client";

import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import {
  ArrowLeftIcon,
  ShoppingBagIcon,
  ChatBubbleLeftRightIcon,
  ArrowPathIcon,
  TagIcon,
  ClockIcon,
  BuildingStorefrontIcon,
  UserIcon,
  MapPinIcon,
  BellIcon,
} from "@heroicons/react/24/outline";

interface MobileAccountPanelProps {
  onBack?: () => void;
  onClose?: () => void;
  showHeader?: boolean;
}

const Row: React.FC<{ href: string; icon: React.ReactNode; label: string; badge?: string }> = ({ href, icon, label, badge }) => (
  <Link
    href={href}
    className="flex items-center justify-between py-3 px-3 rounded-lg hover:bg-orange-50 text-gray-900 text-sm font-medium transition-colors w-full"
  >
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
        {icon}
      </div>
      <span>{label}</span>
      {badge && (
        <span className={`ml-2 text-[10px] px-2 py-0.5 rounded-full ${
          badge === 'YENİ' ? 'bg-red-500 text-white' : 'bg-orange-100 text-orange-600'
        }`}>{badge}</span>
      )}
    </div>
    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  </Link>
);

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
    <div className="px-3 py-2 text-xs font-semibold text-gray-900 border-b border-gray-100">
      {title}
    </div>
    <div className="py-1">
      {children}
    </div>
  </div>
);

const MobileAccountPanel: React.FC<MobileAccountPanelProps> = ({ onBack, onClose, showHeader = true }) => {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      if (onClose) onClose();
      router.push("/");
    }
  };

  return (
    <div className="h-full w-full flex flex-col">
      {/* Sub header */}
      {showHeader && (
        <div className="px-4 py-3">
          <button onClick={onBack} className="flex items-center gap-2 text-gray-900">
            <ArrowLeftIcon className="w-5 h-5" />
            <span className="text-sm font-semibold">{user?.name || 'Hesabım'}</span>
          </button>
        </div>
      )}

      <div className="px-0 pb-6 space-y-4 overflow-y-auto">
        <Section title="Siparişlerim">
          <div className="space-y-1">
            <Row href="/hesabim/siparislerim" icon={<ShoppingBagIcon className="w-5 h-5 text-orange-600" />} label="Tüm Siparişlerim" />
            <Row href="/hesabim/degerlendirmelerim" icon={<ChatBubbleLeftRightIcon className="w-5 h-5 text-orange-600" />} label="Değerlendirmelerim" />
            <Row href="/hesabim/mesajlarim" icon={<ChatBubbleLeftRightIcon className="w-5 h-5 text-orange-600" />} label="Satıcı Mesajlarım" />
            <Row href="/hesabim/tekrar-al" icon={<ArrowPathIcon className="w-5 h-5 text-orange-600" />} label="Tekrar Satın Al" />
          </div>
        </Section>

        <Section title="Sana Özel">
          <div className="space-y-1">
            <Row href="/hesabim/kuponlarim" icon={<TagIcon className="w-5 h-5 text-orange-600" />} label="İndirim Kuponlarım" />
            <Row href="/hesabim/onceden-gezdiklerim" icon={<ClockIcon className="w-5 h-5 text-orange-600" />} label="Önceden Gezdiklerim" />
            <Row href="/hesabim/takip-ettigim-magazalar" icon={<BuildingStorefrontIcon className="w-5 h-5 text-orange-600" />} label="Takip Ettiğim Mağazalar" />
          </div>
        </Section>

        <Section title="Hesabım & Yardım">
          <div className="space-y-1">
            <Row href="/hesabim/kullanici-bilgilerim" icon={<UserIcon className="w-5 h-5 text-orange-600" />} label="Kullanıcı Bilgilerim" />
            <Row href="/hesabim/adres-bilgilerim" icon={<MapPinIcon className="w-5 h-5 text-orange-600" />} label="Adres Bilgilerim" />
            <Row href="/hesabim/duyuru-tercihlerim" icon={<BellIcon className="w-5 h-5 text-orange-600" />} label="Duyuru Tercihlerim" />
          </div>
        </Section>

        {/* Logout Button */}
        <div className="pt-2">
          <button
            onClick={handleLogout}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold text-sm transition-colors"
          >
            Çıkış Yap
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileAccountPanel;
