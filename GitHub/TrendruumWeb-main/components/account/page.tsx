"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ScrollToTop from '@/components/ui/ScrollToTop';
import HesabimSidebar from '../../components/hesabim/HesabimSidebar';
import OrdersHeader from '../../components/hesabim/OrdersHeader';
import OrdersTabs from './OrdersTabs';

const HesabimPage = () => {
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
    }
  }, [isLoggedIn, router]);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        <div className="mt-8">
          <div className="max-w-[1440px] mx-auto px-4">
            <div className="flex gap-6">
              <div className="w-52">
                <HesabimSidebar />
              </div>

              <div className="flex-1">
                <OrdersHeader />
                <OrdersTabs />
                
                <div className="bg-gray-100 rounded-lg p-4">
                  <p className="text-xs text-gray-600 text-center py-6">
                    Henüz sipariş bulunmamaktadır.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <ScrollToTop />
    </>
  );
};

export default HesabimPage;
