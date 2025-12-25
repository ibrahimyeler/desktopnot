import MainLayout from '@/components/layout/MainLayout';
import WelcomeSection from '@/components/dashboard/WelcomeSection';
import StatsGrid from '@/components/dashboard/StatsGrid';
import RecentAppointments from '@/components/dashboard/RecentAppointments';
import TopBarbers from '@/components/dashboard/TopBarbers';

export default function DashboardPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <WelcomeSection />
        <StatsGrid />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentAppointments />
          <TopBarbers />
        </div>
      </div>
    </MainLayout>
  );
}

