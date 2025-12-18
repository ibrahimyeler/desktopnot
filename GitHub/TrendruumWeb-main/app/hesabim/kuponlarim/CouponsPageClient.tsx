"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { ArrowLeftIcon, Bars3Icon, XMarkIcon, TagIcon } from '@heroicons/react/24/outline';
import Header from '@/components/layout/Header';
import ScrollToTop from '@/components/ui/ScrollToTop';
import AccountSidebar from '@/components/account/AccountSidebar';
import CouponsList from '@/components/account/CouponsList';
import { API_V1_URL } from '@/lib/config';

interface Coupon {
  id: string;
  code: string;
  title: string;
  description?: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_purchase_amount?: number;
  max_discount_amount?: number;
  valid_from: string;
  valid_until: string;
  is_used: boolean;
  used_at?: string;
}

export default function CouponsPageClient() {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (isLoggedIn === false) {
      router.replace('/giris');
    }
  }, [isLoggedIn, router]);

  useEffect(() => {
    const fetchCoupons = async () => {
      if (!isLoggedIn) return;
      
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          router.replace('/giris');
          return;
        }

        const response = await fetch(`${API_V1_URL}/customer/discount-coupons`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });

        const data = await response.json();
        
        if (data.meta?.status === 'success') {
          setCoupons(data.data || []);
        } else {
          // API yoksa veya hata varsa boş liste göster
          setCoupons([]);
        }
      } catch (error) {
        setCoupons([]);
      } finally {
        setLoading(false);
      }
    };

    if (isLoggedIn) {
      fetchCoupons();
    }
  }, [isLoggedIn, router]);

  if (isLoggedIn === undefined || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="w-full max-w-[88rem] xl:max-w-[96rem] 2xl:max-w-[110rem] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-20 py-8 sm:py-12 lg:py-16 xl:py-20">
          <div className="flex items-center justify-center py-24">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F27A1A]"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (isLoggedIn === false) {
    return null;
  }

  return (
    <>
      <Header showBackButton={false} />
      <div className="bg-gray-50 min-h-screen">
        <div className="w-full max-w-[88rem] xl:max-w-[96rem] 2xl:max-w-[110rem] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-20 pt-20 md:pt-0 pb-4 sm:py-8 lg:py-12 xl:py-16 2xl:py-20">
          {/* Desktop Header */}
          <div className="hidden sm:flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <TagIcon className="w-6 h-6 text-orange-500" />
              <h1 className="text-xl font-semibold text-gray-900">Tüm Kuponlarım</h1>
            </div>
          </div>

          {/* Mobile Header - Enhanced */}
          <div className="sm:hidden mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="p-2 rounded-lg hover:bg-gray-100"
                  aria-label="Menü"
                >
                  <Bars3Icon className="w-6 h-6 text-gray-600" />
                </button>
                <TagIcon className="w-5 h-5 text-orange-500" />
                <h1 className="text-base font-semibold text-gray-900">Tüm Kuponlarım</h1>
              </div>
            </div>
          </div>

          <div className="flex gap-4 lg:gap-6 xl:gap-8 2xl:gap-12 items-start">
            {/* Desktop Sidebar - Sticky positioned */}
            <div className="hidden lg:block flex-shrink-0">
              <AccountSidebar />
            </div>

            {/* Mobile Sidebar Overlay - Enhanced */}
            {sidebarOpen && (
              <div className="fixed inset-0 z-50 lg:hidden">
                {/* Backdrop */}
                <div 
                  className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300" 
                  onClick={() => setSidebarOpen(false)} 
                />
                
                {/* Sidebar */}
                <div className="fixed left-0 top-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out overflow-hidden">
                  {/* Sidebar Header */}
                  <div className="bg-white border-b border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">İndirim Kuponlarım</h2>
                        <p className="text-gray-600 text-sm mt-1">Menüyü keşfedin</p>
                      </div>
                      <button
                        onClick={() => setSidebarOpen(false)}
                        className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-all"
                      >
                        <XMarkIcon className="w-6 h-6 text-gray-700" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Sidebar Content */}
                  <div className="flex-1 overflow-y-auto">
                    <div className="p-4">
                      <AccountSidebar onItemClick={() => setSidebarOpen(false)} />
                    </div>
                  </div>
                  
                  {/* Sidebar Footer */}
                  <div className="border-t border-gray-200 p-4 bg-gray-50">
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Trendruum hesap yönetimi</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Main Content - Enhanced mobile spacing */}
            <div className="flex-1 w-full max-w-4xl xl:max-w-5xl 2xl:max-w-6xl">
              <CouponsList coupons={coupons} loading={loading} />
            </div>
          </div>
        </div>
      </div>
      <ScrollToTop />
    </>
  );
}
