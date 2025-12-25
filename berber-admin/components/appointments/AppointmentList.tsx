'use client';

import { useState } from 'react';
import AppointmentCard from './AppointmentCard';
import { Search, Filter } from 'lucide-react';

interface Appointment {
  id: string;
  customerName: string;
  barberName: string;
  service: string;
  date: string;
  time: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  price: number;
}

const mockAppointments: Appointment[] = [
  {
    id: '1',
    customerName: 'Ahmet Yılmaz',
    barberName: 'Modern Berber',
    service: 'Saç Kesimi + Sakal',
    date: '15 Ocak 2024',
    time: '14:00',
    status: 'confirmed',
    price: 150,
  },
  {
    id: '2',
    customerName: 'Mehmet Demir',
    barberName: 'Elite Berber',
    service: 'Sakal Tıraşı',
    date: '15 Ocak 2024',
    time: '15:30',
    status: 'pending',
    price: 80,
  },
  {
    id: '3',
    customerName: 'Ali Kaya',
    barberName: 'Modern Berber',
    service: 'Saç Kesimi',
    date: '16 Ocak 2024',
    time: '10:00',
    status: 'pending',
    price: 100,
  },
  {
    id: '4',
    customerName: 'Can Öz',
    barberName: 'Elite Berber',
    service: 'Saç Kesimi + Sakal',
    date: '16 Ocak 2024',
    time: '11:30',
    status: 'completed',
    price: 150,
  },
  {
    id: '5',
    customerName: 'Burak Şahin',
    barberName: 'Premium Berber',
    service: 'Saç Kesimi',
    date: '14 Ocak 2024',
    time: '16:00',
    status: 'cancelled',
    price: 100,
  },
];

export default function AppointmentList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [appointments] = useState<Appointment[]>(mockAppointments);

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = 
      appointment.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appointment.barberName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appointment.service.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleConfirm = (id: string) => {
    console.log('Confirm appointment:', id);
    // TODO: Implement confirm functionality
  };

  const handleCancel = (id: string) => {
    console.log('Cancel appointment:', id);
    // TODO: Implement cancel functionality
  };

  const stats = {
    total: appointments.length,
    confirmed: appointments.filter(a => a.status === 'confirmed').length,
    pending: appointments.filter(a => a.status === 'pending').length,
    completed: appointments.filter(a => a.status === 'completed').length,
    cancelled: appointments.filter(a => a.status === 'cancelled').length,
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#E5E7EB] mb-2">Randevular</h1>
        <p className="text-[#94A3B8]">Tüm randevuları görüntüleyin ve yönetin</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-[#1E293B] border border-[#334155] rounded-lg p-4">
          <p className="text-sm text-[#94A3B8] mb-1">Toplam</p>
          <p className="text-2xl font-bold text-[#E5E7EB]">{stats.total}</p>
        </div>
        <div className="bg-[#1E293B] border border-[#334155] rounded-lg p-4">
          <p className="text-sm text-[#94A3B8] mb-1">Onaylandı</p>
          <p className="text-2xl font-bold text-[#22C55E]">{stats.confirmed}</p>
        </div>
        <div className="bg-[#1E293B] border border-[#334155] rounded-lg p-4">
          <p className="text-sm text-[#94A3B8] mb-1">Beklemede</p>
          <p className="text-2xl font-bold text-[#F59E0B]">{stats.pending}</p>
        </div>
        <div className="bg-[#1E293B] border border-[#334155] rounded-lg p-4">
          <p className="text-sm text-[#94A3B8] mb-1">Tamamlandı</p>
          <p className="text-2xl font-bold text-[#3498DB]">{stats.completed}</p>
        </div>
        <div className="bg-[#1E293B] border border-[#334155] rounded-lg p-4">
          <p className="text-sm text-[#94A3B8] mb-1">İptal</p>
          <p className="text-2xl font-bold text-[#EF4444]">{stats.cancelled}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#94A3B8]" />
          <input
            type="text"
            placeholder="Randevu ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#1E293B] border border-[#334155] rounded-lg text-[#E5E7EB] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#3498DB] focus:border-transparent"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#94A3B8]" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="pl-10 pr-4 py-2 bg-[#1E293B] border border-[#334155] rounded-lg text-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#3498DB] focus:border-transparent appearance-none cursor-pointer"
          >
            <option value="all">Tüm Durumlar</option>
            <option value="pending">Beklemede</option>
            <option value="confirmed">Onaylandı</option>
            <option value="completed">Tamamlandı</option>
            <option value="cancelled">İptal</option>
          </select>
        </div>
      </div>

      {/* Appointment Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredAppointments.map((appointment) => (
          <AppointmentCard
            key={appointment.id}
            appointment={appointment}
            onConfirm={handleConfirm}
            onCancel={handleCancel}
          />
        ))}
      </div>

      {filteredAppointments.length === 0 && (
        <div className="text-center py-12">
          <p className="text-[#94A3B8]">Randevu bulunamadı</p>
        </div>
      )}
    </div>
  );
}

