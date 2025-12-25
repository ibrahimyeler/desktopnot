import MainLayout from '@/components/layout/MainLayout';
import { Bell, Lock, Database, Palette, Globe } from 'lucide-react';

export default function SettingsPage() {
  const settingsCategories = [
    {
      title: 'Bildirimler',
      icon: Bell,
      description: 'E-posta ve push bildirim ayarları',
    },
    {
      title: 'Güvenlik',
      icon: Lock,
      description: 'Şifre ve güvenlik ayarları',
    },
    {
      title: 'Veritabanı',
      icon: Database,
      description: 'Veritabanı yedekleme ve yönetim',
    },
    {
      title: 'Tema',
      icon: Palette,
      description: 'Arayüz teması ve renk ayarları',
    },
    {
      title: 'Dil',
      icon: Globe,
      description: 'Dil ve bölge ayarları',
    },
  ];

  return (
    <MainLayout>
      <div>
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[#E5E7EB] mb-2">Ayarlar</h1>
          <p className="text-[#94A3B8]">Sistem ayarlarını yönetin</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {settingsCategories.map((category) => {
            const Icon = category.icon;
            return (
              <div
                key={category.title}
                className="bg-[#1E293B] border border-[#334155] rounded-xl p-6 hover:border-[#3498DB]/50 transition-all duration-200 cursor-pointer"
              >
                <div className="w-12 h-12 bg-[#3498DB]/20 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-[#3498DB]" />
                </div>
                <h3 className="text-lg font-bold text-[#E5E7EB] mb-2">{category.title}</h3>
                <p className="text-sm text-[#94A3B8]">{category.description}</p>
              </div>
            );
          })}
        </div>

        {/* System Info */}
        <div className="mt-8 bg-[#1E293B] border border-[#334155] rounded-xl p-6">
          <h2 className="text-xl font-bold text-[#E5E7EB] mb-4">Sistem Bilgileri</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-[#94A3B8] mb-1">Versiyon</p>
              <p className="text-[#E5E7EB] font-medium">1.0.0</p>
            </div>
            <div>
              <p className="text-sm text-[#94A3B8] mb-1">Son Güncelleme</p>
              <p className="text-[#E5E7EB] font-medium">15 Ocak 2024</p>
            </div>
            <div>
              <p className="text-sm text-[#94A3B8] mb-1">Durum</p>
              <p className="text-[#22C55E] font-medium">Aktif</p>
            </div>
            <div>
              <p className="text-sm text-[#94A3B8] mb-1">Lisans</p>
              <p className="text-[#E5E7EB] font-medium">Premium</p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

