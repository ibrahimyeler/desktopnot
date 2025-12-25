import { Star, MapPin, Phone, Mail, Edit, Trash2 } from 'lucide-react';

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

interface BarberCardProps {
  barber: Barber;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function BarberCard({ barber, onEdit, onDelete }: BarberCardProps) {
  return (
    <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-6 hover:border-[#3498DB]/50 transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-bold text-[#E5E7EB]">{barber.name}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              barber.isActive 
                ? 'bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]/30' 
                : 'bg-[#94A3B8]/20 text-[#94A3B8] border border-[#94A3B8]/30'
            }`}>
              {barber.isActive ? 'Aktif' : 'Pasif'}
            </span>
          </div>
          
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-4 h-4 text-[#F59E0B] fill-[#F59E0B]" />
            <span className="text-sm font-medium text-[#CBD5E1]">{barber.rating}</span>
            <span className="text-sm text-[#94A3B8]">({barber.totalAppointments} randevu)</span>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-[#CBD5E1]">
              <MapPin className="w-4 h-4 text-[#94A3B8]" />
              <span>{barber.address}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-[#CBD5E1]">
              <Phone className="w-4 h-4 text-[#94A3B8]" />
              <span>{barber.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-[#CBD5E1]">
              <Mail className="w-4 h-4 text-[#94A3B8]" />
              <span>{barber.email}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 ml-4">
          <button
            onClick={() => onEdit(barber.id)}
            className="p-2 text-[#3498DB] hover:bg-[#3498DB]/20 rounded-lg transition-colors"
          >
            <Edit className="w-5 h-5" />
          </button>
          <button
            onClick={() => onDelete(barber.id)}
            className="p-2 text-[#EF4444] hover:bg-[#EF4444]/20 rounded-lg transition-colors"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

