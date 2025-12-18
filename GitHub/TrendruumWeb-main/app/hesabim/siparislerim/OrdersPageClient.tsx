"use client";

import { useState } from 'react';
import Header from '@/components/layout/Header';
import ScrollToTop from '@/components/ui/ScrollToTop';
import AccountSidebar from '@/components/account/AccountSidebar';
import Orders from '@/components/account/Orders';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const OrdersPageClient = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <Header showBackButton={false} />
      <div className="min-h-screen bg-white">
        <div className="header-padding pt-0 sm:pt-0">
          <div className="w-full max-w-[88rem] xl:max-w-[96rem] 2xl:max-w-[110rem] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-20 pt-20 md:pt-0 pb-4 sm:py-12 lg:py-16 xl:py-20">

        <div className="flex gap-4 lg:gap-6 xl:gap-8 2xl:gap-12 items-start">
          {/* Desktop Sidebar - Sticky positioned */}
          <div className="hidden lg:block flex-shrink-0">
            <AccountSidebar />
          </div>

          {/* Mobile Sidebar Overlay */}
          {sidebarOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setSidebarOpen(false)} />
              <div className="fixed left-0 top-0 h-full w-80 bg-white border-r border-gray-200 overflow-y-auto">
                <div className="p-4 border-b">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">Hesabım</h2>
                    <button
                      onClick={() => setSidebarOpen(false)}
                      className="p-2 rounded-lg hover:bg-gray-100 "
                    >
                      <XMarkIcon className="w-6 h-6 text-gray-600" />
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <AccountSidebar onItemClick={() => setSidebarOpen(false)} />
                </div>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1 max-w-4xl xl:max-w-5xl 2xl:max-w-6xl">
            <Orders onMenuClick={() => setSidebarOpen(true)} />
          </div>
        </div>
      </div>
        </div>
      </div>
      <ScrollToTop />
    </>
  );
};

export default OrdersPageClient;
