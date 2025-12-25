import { User, Phone, Mail, Calendar, Edit, Trash2 } from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalAppointments: number;
  lastAppointment: string;
  status: 'active' | 'inactive';
}

interface CustomerCardProps {
  customer: Customer;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function CustomerCard({ customer, onEdit, onDelete }: CustomerCardProps) {
  return (
    <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-6 hover:border-[#3498DB]/50 transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-[#3498DB] to-[#2C3E50] rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#E5E7EB]">{customer.name}</h3>
              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                customer.status === 'active'
                  ? 'bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]/30'
                  : 'bg-[#94A3B8]/20 text-[#94A3B8] border border-[#94A3B8]/30'
              }`}>
                {customer.status === 'active' ? 'Aktif' : 'Pasif'}
              </span>
            </div>
          </div>
          
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm text-[#CBD5E1]">
              <Mail className="w-4 h-4 text-[#94A3B8]" />
              <span>{customer.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-[#CBD5E1]">
              <Phone className="w-4 h-4 text-[#94A3B8]" />
              <span>{customer.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-[#CBD5E1]">
              <Calendar className="w-4 h-4 text-[#94A3B8]" />
              <span>{customer.totalAppointments} randevu</span>
            </div>
            {customer.lastAppointment && (
              <div className="text-xs text-[#94A3B8] mt-2">
                Son randevu: {customer.lastAppointment}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2 ml-4">
          <button
            onClick={() => onEdit(customer.id)}
            className="p-2 text-[#3498DB] hover:bg-[#3498DB]/20 rounded-lg transition-colors"
          >
            <Edit className="w-5 h-5" />
          </button>
          <button
            onClick={() => onDelete(customer.id)}
            className="p-2 text-[#EF4444] hover:bg-[#EF4444]/20 rounded-lg transition-colors"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

