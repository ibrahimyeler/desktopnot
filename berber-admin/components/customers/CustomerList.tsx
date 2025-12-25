'use client';

import { useState } from 'react';
import CustomerCard from './CustomerCard';
import { Search, Plus } from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalAppointments: number;
  lastAppointment: string;
  status: 'active' | 'inactive';
}

const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'Ahmet Yılmaz',
    email: 'ahmet@example.com',
    phone: '+90 555 111 22 33',
    totalAppointments: 12,
    lastAppointment: '10 Ocak 2024',
    status: 'active',
  },
  {
    id: '2',
    name: 'Mehmet Demir',
    email: 'mehmet@example.com',
    phone: '+90 555 222 33 44',
    totalAppointments: 8,
    lastAppointment: '8 Ocak 2024',
    status: 'active',
  },
  {
    id: '3',
    name: 'Ali Kaya',
    email: 'ali@example.com',
    phone: '+90 555 333 44 55',
    totalAppointments: 5,
    lastAppointment: '5 Ocak 2024',
    status: 'active',
  },
  {
    id: '4',
    name: 'Can Öz',
    email: 'can@example.com',
    phone: '+90 555 444 55 66',
    totalAppointments: 3,
    lastAppointment: '2 Ocak 2024',
    status: 'inactive',
  },
];

export default function CustomerList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [customers] = useState<Customer[]>(mockCustomers);

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.phone.includes(searchQuery)
  );

  const handleEdit = (id: string) => {
    console.log('Edit customer:', id);
    // TODO: Implement edit functionality
  };

  const handleDelete = (id: string) => {
    console.log('Delete customer:', id);
    // TODO: Implement delete functionality
  };

  const stats = {
    total: customers.length,
    active: customers.filter(c => c.status === 'active').length,
    inactive: customers.filter(c => c.status === 'inactive').length,
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-[#E5E7EB] mb-2">Müşteriler</h1>
          <p className="text-[#94A3B8]">Tüm müşterileri görüntüleyin ve yönetin</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#3498DB] text-white rounded-lg hover:bg-[#3498DB]/90 transition-colors">
          <Plus className="w-5 h-5" />
          <span>Yeni Müşteri Ekle</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-[#1E293B] border border-[#334155] rounded-lg p-4">
          <p className="text-sm text-[#94A3B8] mb-1">Toplam Müşteri</p>
          <p className="text-2xl font-bold text-[#E5E7EB]">{stats.total}</p>
        </div>
        <div className="bg-[#1E293B] border border-[#334155] rounded-lg p-4">
          <p className="text-sm text-[#94A3B8] mb-1">Aktif Müşteri</p>
          <p className="text-2xl font-bold text-[#22C55E]">{stats.active}</p>
        </div>
        <div className="bg-[#1E293B] border border-[#334155] rounded-lg p-4">
          <p className="text-sm text-[#94A3B8] mb-1">Pasif Müşteri</p>
          <p className="text-2xl font-bold text-[#94A3B8]">{stats.inactive}</p>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#94A3B8]" />
          <input
            type="text"
            placeholder="Müşteri ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#1E293B] border border-[#334155] rounded-lg text-[#E5E7EB] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#3498DB] focus:border-transparent"
          />
        </div>
      </div>

      {/* Customer Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCustomers.map((customer) => (
          <CustomerCard
            key={customer.id}
            customer={customer}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {filteredCustomers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-[#94A3B8]">Müşteri bulunamadı</p>
        </div>
      )}
    </div>
  );
}

