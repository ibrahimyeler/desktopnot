"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import ScrollToTop from '@/components/ui/ScrollToTop';
import AccountSidebar from '@/components/account/AccountSidebar';
import Orders from '@/components/account/Orders';
import MobileAccountPanel from '@/components/account/MobileAccountPanel';
import { ArrowLeftIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/app/context/AuthContext';

const HesabimPageClient = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, isLoggedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;
    
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace('/giris?redirect=' + encodeURIComponent('/hesabim'));
      return;
    }
    
    if (!isLoggedIn) {
      router.replace('/giris?redirect=' + encodeURIComponent('/hesabim'));
    }
  }, [isLoggedIn, router]);

  // Login kontrolü yapılırken hiçbir şey render etme
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (!token || !isLoggedIn) {
      return null;
    }
  } else {
    // SSR sırasında null döndür
    return null;
  }

  return (
    <>
      <Header showBackButton={false} />
      <div className="bg-white min-h-screen">
        <div className="w-full max-w-[88rem] xl:max-w-[96rem] 2xl:max-w-[110rem] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-20 pt-20 md:pt-0 pb-4 sm:py-8 lg:py-12 xl:py-16 2xl:py-20">
          {/* Mobile Top Card with Username */}
          <div className="lg:hidden mb-4">
            <div className="bg-gradient-to-br from-orange-400 via-orange-400 to-orange-500 rounded-2xl p-3 shadow-lg shadow-orange-500/20">
              <div className="flex items-center justify-center">
                <h1 className="text-base font-bold text-white tracking-tight">
                  {user?.name?.toUpperCase() || user?.email?.toUpperCase() || 'HESABIM'}
                </h1>
              </div>
            </div>
          </div>

          <div className="flex gap-4 lg:gap-6 xl:gap-8 2xl:gap-12 items-start">
            {/* Desktop Sidebar - Sticky positioned - Genişletilmiş */}
            <div className="hidden lg:block flex-shrink-0">
              <AccountSidebar />
            </div>

            {/* Mobile Body: full-page account panel style */}
            <div className="lg:hidden w-full">
              <MobileAccountPanel onBack={() => window.history.back()} showHeader={false} />
            </div>

            {/* Main Content - Biraz daraltılmış */}
            <div className="flex-1 w-full hidden lg:block max-w-4xl xl:max-w-5xl 2xl:max-w-6xl">
              <Orders />
            </div>
          </div>
        </div>
      </div>
      <div className="hidden lg:block">
      <ScrollToTop />
      </div>
    </>
  );
};

export default HesabimPageClient;
