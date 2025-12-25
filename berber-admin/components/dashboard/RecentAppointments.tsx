import Link from 'next/link';
import { Calendar, Clock, User, ArrowRight } from 'lucide-react';

interface Appointment {
  id: string;
  customerName: string;
  barberName: string;
  service: string;
  date: string;
  time: string;
  status: 'confirmed' | 'pending' | 'cancelled';
}

const mockAppointments: Appointment[] = [
  {
    id: '1',
    customerName: 'Ahmet Yılmaz',
    barberName: 'Modern Berber',
    service: 'Saç Kesimi + Sakal',
    date: 'Bugün',
    time: '14:00',
    status: 'confirmed',
  },
  {
    id: '2',
    customerName: 'Mehmet Demir',
    barberName: 'Elite Berber',
    service: 'Sakal Tıraşı',
    date: 'Bugün',
    time: '15:30',
    status: 'pending',
  },
  {
    id: '3',
    customerName: 'Ali Kaya',
    barberName: 'Modern Berber',
    service: 'Saç Kesimi',
    date: 'Yarın',
    time: '10:00',
    status: 'confirmed',
  },
  {
    id: '4',
    customerName: 'Can Öz',
    barberName: 'Elite Berber',
    service: 'Saç Kesimi + Sakal',
    date: 'Yarın',
    time: '11:30',
    status: 'pending',
  },
];

const statusColors = {
  confirmed: 'bg-[#22C55E]/20 text-[#22C55E] border-[#22C55E]/30',
  pending: 'bg-[#F59E0B]/20 text-[#F59E0B] border-[#F59E0B]/30',
  cancelled: 'bg-[#EF4444]/20 text-[#EF4444] border-[#EF4444]/30',
};

const statusLabels = {
  confirmed: 'Onaylandı',
  pending: 'Beklemede',
  cancelled: 'İptal',
};

export default function RecentAppointments() {
  return (
    <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-[#E5E7EB]">Son Randevular</h2>
        <Link 
          href="/appointments"
          className="text-sm text-[#3498DB] hover:text-[#3498DB]/80 flex items-center gap-1 transition-colors"
        >
          Tümünü Gör
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
      
      <div className="space-y-4">
        {mockAppointments.map((appointment) => (
          <div
            key={appointment.id}
            className="bg-[#0F172A] border border-[#334155] rounded-lg p-4 hover:border-[#3498DB]/50 transition-all duration-200"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-[#3498DB]/20 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-[#3498DB]" />
                  </div>
                  <div>
                    <p className="font-medium text-[#E5E7EB]">{appointment.customerName}</p>
                    <p className="text-sm text-[#94A3B8]">{appointment.barberName}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-2 text-sm text-[#CBD5E1]">
                    <Calendar className="w-4 h-4 text-[#94A3B8]" />
                    <span>{appointment.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#CBD5E1]">
                    <Clock className="w-4 h-4 text-[#94A3B8]" />
                    <span>{appointment.time}</span>
                  </div>
                  <div className="text-sm text-[#94A3B8]">
                    {appointment.service}
                  </div>
                </div>
              </div>
              
              <div className="ml-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[appointment.status]}`}>
                  {statusLabels[appointment.status]}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

