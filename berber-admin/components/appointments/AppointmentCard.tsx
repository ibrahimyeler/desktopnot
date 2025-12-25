import { Calendar, Clock, User, Scissors, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

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

interface AppointmentCardProps {
  appointment: Appointment;
  onConfirm?: (id: string) => void;
  onCancel?: (id: string) => void;
}

const statusConfig = {
  confirmed: {
    label: 'Onaylandı',
    color: 'bg-[#22C55E]/20 text-[#22C55E] border-[#22C55E]/30',
    icon: CheckCircle,
  },
  pending: {
    label: 'Beklemede',
    color: 'bg-[#F59E0B]/20 text-[#F59E0B] border-[#F59E0B]/30',
    icon: AlertCircle,
  },
  cancelled: {
    label: 'İptal',
    color: 'bg-[#EF4444]/20 text-[#EF4444] border-[#EF4444]/30',
    icon: XCircle,
  },
  completed: {
    label: 'Tamamlandı',
    color: 'bg-[#3498DB]/20 text-[#3498DB] border-[#3498DB]/30',
    icon: CheckCircle,
  },
};

export default function AppointmentCard({ appointment, onConfirm, onCancel }: AppointmentCardProps) {
  const config = statusConfig[appointment.status];
  const Icon = config.icon;

  return (
    <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-6 hover:border-[#3498DB]/50 transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-[#3498DB]/20 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-[#3498DB]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#E5E7EB]">{appointment.customerName}</h3>
              <p className="text-sm text-[#94A3B8]">{appointment.barberName}</p>
            </div>
          </div>
          
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm text-[#CBD5E1]">
              <Scissors className="w-4 h-4 text-[#94A3B8]" />
              <span>{appointment.service}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-[#CBD5E1]">
              <Calendar className="w-4 h-4 text-[#94A3B8]" />
              <span>{appointment.date}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-[#CBD5E1]">
              <Clock className="w-4 h-4 text-[#94A3B8]" />
              <span>{appointment.time}</span>
            </div>
          </div>
        </div>
        
        <div className="ml-4 text-right">
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border mb-2 ${config.color}`}>
            <Icon className="w-4 h-4" />
            <span>{config.label}</span>
          </div>
          <p className="text-lg font-bold text-[#E5E7EB]">₺{appointment.price.toLocaleString('tr-TR')}</p>
        </div>
      </div>
      
      {appointment.status === 'pending' && onConfirm && onCancel && (
        <div className="flex items-center gap-2 pt-4 border-t border-[#334155]">
          <button
            onClick={() => onConfirm(appointment.id)}
            className="flex-1 px-4 py-2 bg-[#22C55E] text-white rounded-lg hover:bg-[#22C55E]/90 transition-colors"
          >
            Onayla
          </button>
          <button
            onClick={() => onCancel(appointment.id)}
            className="flex-1 px-4 py-2 bg-[#EF4444] text-white rounded-lg hover:bg-[#EF4444]/90 transition-colors"
          >
            İptal Et
          </button>
        </div>
      )}
    </div>
  );
}

