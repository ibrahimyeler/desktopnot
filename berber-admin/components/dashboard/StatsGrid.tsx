import { Calendar, Clock, Users, DollarSign } from 'lucide-react';
import StatCard from '../common/StatCard';

export default function StatsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Bugünkü Randevular"
        value="24"
        icon={Calendar}
        color="#3498DB"
        trend={{ value: "+12%", isPositive: true }}
      />
      <StatCard
        title="Bekleyen Randevular"
        value="8"
        icon={Clock}
        color="#F59E0B"
        trend={{ value: "-3%", isPositive: false }}
      />
      <StatCard
        title="Toplam Müşteri"
        value="1,234"
        icon={Users}
        color="#22C55E"
        trend={{ value: "+8%", isPositive: true }}
      />
      <StatCard
        title="Aylık Gelir"
        value="₺125,000"
        icon={DollarSign}
        color="#E74C3C"
        trend={{ value: "+15%", isPositive: true }}
      />
    </div>
  );
}

