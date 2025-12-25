import Link from 'next/link';
import { Star, TrendingUp, ArrowRight } from 'lucide-react';

interface Barber {
  id: string;
  name: string;
  rating: number;
  appointments: number;
  revenue: number;
}

const mockBarbers: Barber[] = [
  {
    id: '1',
    name: 'Modern Berber',
    rating: 4.8,
    appointments: 156,
    revenue: 45000,
  },
  {
    id: '2',
    name: 'Elite Berber',
    rating: 4.7,
    appointments: 142,
    revenue: 42000,
  },
  {
    id: '3',
    name: 'Premium Berber',
    rating: 4.6,
    appointments: 128,
    revenue: 38000,
  },
  {
    id: '4',
    name: 'Classic Berber',
    rating: 4.5,
    appointments: 115,
    revenue: 35000,
  },
];

export default function TopBarbers() {
  return (
    <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-[#E5E7EB]">En Çok Randevu Alan Berberler</h2>
        <Link 
          href="/barbers"
          className="text-sm text-[#3498DB] hover:text-[#3498DB]/80 flex items-center gap-1 transition-colors"
        >
          Tümünü Gör
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
      
      <div className="space-y-4">
        {mockBarbers.map((barber, index) => (
          <div
            key={barber.id}
            className="bg-[#0F172A] border border-[#334155] rounded-lg p-4 hover:border-[#3498DB]/50 transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-[#3498DB] to-[#2C3E50] rounded-lg flex items-center justify-center text-white font-bold">
                  {index + 1}
                </div>
                <div>
                  <p className="font-medium text-[#E5E7EB]">{barber.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Star className="w-4 h-4 text-[#F59E0B] fill-[#F59E0B]" />
                    <span className="text-sm text-[#CBD5E1]">{barber.rating}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-sm text-[#94A3B8]">Randevu</p>
                  <p className="font-medium text-[#E5E7EB]">{barber.appointments}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-[#94A3B8]">Gelir</p>
                  <p className="font-medium text-[#E5E7EB]">₺{barber.revenue.toLocaleString('tr-TR')}</p>
                </div>
                <TrendingUp className="w-5 h-5 text-[#22C55E]" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

