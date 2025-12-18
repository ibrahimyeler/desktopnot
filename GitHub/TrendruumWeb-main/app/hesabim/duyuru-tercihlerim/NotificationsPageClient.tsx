"use client";

import { useState, useEffect } from 'react';
import AccountSidebar from '@/components/account/AccountSidebar';
import Notifications from '@/components/account/Notifications';
import NotificationPreferencesModal from '@/components/common/NotificationPreferencesModal';
import Header from '@/components/layout/Header';
import ScrollToTop from '@/components/ui/ScrollToTop';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import axios from 'axios';

interface UserProfile {
  notification_channels?: string[];
  name?: string;
  lastname?: string;
  email?: string;
  gender?: string;
  status?: string;
  role?: {
    name: string;
    type: string;
    slug: string;
  };
}

interface ApiResponse {
  meta: {
    status: string;
    message: string;
    code: number;
  };
  data: UserProfile;
}

interface NotificationsPageClientProps {
  initialUserProfile: UserProfile | null;
}

const NotificationsPageClient = ({ initialUserProfile }: NotificationsPageClientProps) => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(!initialUserProfile);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!initialUserProfile) {
      checkUserPreferences();
    } else {
      // Check if we need to show modal based on initial data
      const userChannels = initialUserProfile.notification_channels || [];
      if (userChannels.length === 0) {
        setShowModal(true);
      }
    }
  }, [initialUserProfile]);

  const checkUserPreferences = async () => {
    try {
      const token = localStorage.getItem('token');
      const userEmail = localStorage.getItem('userEmail');
      
      if (!token || !userEmail) {
        setLoading(false);
        return;
      }

      // Önce localStorage'da kontrol et
      const hasSeenModal = localStorage.getItem(`hasSeenNotificationModal_${userEmail}`);
      if (hasSeenModal === 'true') {
        setLoading(false);
        return;
      }

      // API'den kullanıcı tercihlerini kontrol et
      const response = await axios.get<ApiResponse>('/api/v1/customer/profile/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const userChannels = response.data.data.notification_channels || [];
      
      // Eğer hiç tercih seçilmemişse modalı göster
      if (userChannels.length === 0) {
        setShowModal(true);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handlePreferencesSet = () => {
    setShowModal(false);
  };

  if (loading) {
    return (
      <>
        <Header showBackButton={false} />
        <div className="min-h-screen bg-gray-50">
          <div className="header-padding pt-0 sm:pt-0">
            <div className="w-full max-w-[88rem] xl:max-w-[96rem] 2xl:max-w-[110rem] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-20 pt-20 md:pt-0 pb-8 sm:py-12 lg:py-16 xl:py-20">
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header showBackButton={false} />
      <div className="min-h-screen bg-gray-50">
          <div className="header-padding pt-0 sm:pt-0">
          <div className="w-full max-w-[88rem] xl:max-w-[96rem] 2xl:max-w-[110rem] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-20 pt-20 md:pt-0 pb-8 sm:py-12 lg:py-16 xl:py-20">

        <div className="flex gap-4 lg:gap-6 xl:gap-8 2xl:gap-12 items-start">
          {/* Desktop Sidebar */}
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
          <div className="flex-1 w-full max-w-4xl xl:max-w-5xl 2xl:max-w-6xl">
            <Notifications onMenuClick={() => setSidebarOpen(true)} />
          </div>
        </div>
      </div>
        </div>
      </div>

      <NotificationPreferencesModal 
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onPreferencesSet={handlePreferencesSet}
      />
      <ScrollToTop />
    </>
  );
};

export default NotificationsPageClient;
