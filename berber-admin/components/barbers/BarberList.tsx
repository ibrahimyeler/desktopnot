'use client';

import { useState } from 'react';
import BarberCard from './BarberCard';
import { Plus, Search } from 'lucide-react';

interface Barber {
  id: string;
  name: string;
  rating: number;
  address: string;
  phone: string;
  email: string;
  isActive: boolean;
  totalAppointments: number;
}

const mockBarbers: Barber[] = [
  {
    id: '1',
    name: 'Modern Berber',
    rating: 4.8,
    address: 'Kadıköy, İstanbul - Moda Mahallesi, Bağdat Caddesi No:123',
    phone: '+90 555 123 45 67',
    email: 'info@modernberber.com',
    isActive: true,
    totalAppointments: 156,
  },
  {
    id: '2',
    name: 'Elite Berber',
    rating: 4.7,
    address: 'Beşiktaş, İstanbul - Akaretler Mahallesi, Spor Caddesi No:45',
    phone: '+90 555 234 56 78',
    email: 'info@eliteberber.com',
    isActive: true,
    totalAppointments: 142,
  },
  {
    id: '3',
    name: 'Premium Berber',
    rating: 4.6,
    address: 'Şişli, İstanbul - Halaskargazi Caddesi No:78',
    phone: '+90 555 345 67 89',
    email: 'info@premiumberber.com',
    isActive: true,
    totalAppointments: 128,
  },
  {
    id: '4',
    name: 'Classic Berber',
    rating: 4.5,
    address: 'Üsküdar, İstanbul - Selimiye Mahallesi, Selimiye Caddesi No:12',
    phone: '+90 555 456 78 90',
    email: 'info@classicberber.com',
    isActive: false,
    totalAppointments: 115,
  },
];

export default function BarberList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [barbers] = useState<Barber[]>(mockBarbers);

  const filteredBarbers = barbers.filter(barber =>
    barber.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    barber.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (id: string) => {
    console.log('Edit barber:', id);
    // TODO: Implement edit functionality
  };

  const handleDelete = (id: string) => {
    console.log('Delete barber:', id);
    // TODO: Implement delete functionality
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-[#E5E7EB] mb-2">Berberler</h1>
          <p className="text-[#94A3B8]">Sistemdeki tüm berberleri yönetin</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#3498DB] text-white rounded-lg hover:bg-[#3498DB]/90 transition-colors">
          <Plus className="w-5 h-5" />
          <span>Yeni Berber Ekle</span>
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#94A3B8]" />
          <input
            type="text"
            placeholder="Berber ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#1E293B] border border-[#334155] rounded-lg text-[#E5E7EB] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#3498DB] focus:border-transparent"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-[#1E293B] border border-[#334155] rounded-lg p-4">
          <p className="text-sm text-[#94A3B8] mb-1">Toplam Berber</p>
          <p className="text-2xl font-bold text-[#E5E7EB]">{barbers.length}</p>
        </div>
        <div className="bg-[#1E293B] border border-[#334155] rounded-lg p-4">
          <p className="text-sm text-[#94A3B8] mb-1">Aktif Berber</p>
          <p className="text-2xl font-bold text-[#22C55E]">{barbers.filter(b => b.isActive).length}</p>
        </div>
        <div className="bg-[#1E293B] border border-[#334155] rounded-lg p-4">
          <p className="text-sm text-[#94A3B8] mb-1">Pasif Berber</p>
          <p className="text-2xl font-bold text-[#94A3B8]">{barbers.filter(b => !b.isActive).length}</p>
        </div>
      </div>

      {/* Barber Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredBarbers.map((barber) => (
          <BarberCard
            key={barber.id}
            barber={barber}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {filteredBarbers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-[#94A3B8]">Arama sonucu bulunamadı</p>
        </div>
      )}
    </div>
  );
}

