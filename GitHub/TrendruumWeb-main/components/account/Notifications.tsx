"use client";

import { BellIcon, EnvelopeIcon, DevicePhoneMobileIcon, PhoneIcon, Bars3Icon } from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';

interface NotificationPreference {
  id: string;
  type: 'email' | 'sms' | 'phone';
  title: string;
  description: string;
  enabled: boolean;
  icon: React.ElementType;
}

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

const notificationTypes: NotificationPreference[] = [
  {
    id: 'email',
    type: 'email',
    title: 'E-posta Bildirimleri',
    description: 'Özel indirimler, kampanyalar ve yeni ürün duyuruları',
    enabled: false,
    icon: EnvelopeIcon
  },
  {
    id: 'sms',
    type: 'sms',
    title: 'SMS Bildirimleri',
    description: 'Sipariş durumu, kargo takibi ve acil duyurular',
    enabled: false,
    icon: DevicePhoneMobileIcon
  },
  {
    id: 'phone',
    type: 'phone',
    title: 'Telefon Aramaları',
    description: 'Önemli sipariş güncellemeleri ve müşteri hizmetleri',
    enabled: false,
    icon: PhoneIcon
  }
];

interface NotificationsProps {
  onMenuClick?: () => void;
}

const Notifications = ({ onMenuClick }: NotificationsProps) => {
  const [preferences, setPreferences] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchUserPreferences();
  }, []);

  const fetchUserPreferences = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await axios.get<ApiResponse>('/api/v1/customer/profile/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        const userChannels = response.data.data.notification_channels || [];
        
        // Tercihleri güncelle
        const preferencesMap = notificationTypes.reduce((acc, pref) => {
          acc[pref.type] = userChannels.includes(pref.type);
          return acc;
        }, {} as Record<string, boolean>);
        
        setPreferences(preferencesMap);
      }
    } catch (error) {
      toast.error('Tercihler yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (type: string) => {
    setPreferences(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const handleUpdate = async () => {
    setUpdating(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Oturum bulunamadı');

      const enabledChannels = Object.entries(preferences)
        .filter(([_, enabled]) => enabled)
        .map(([type]) => type);

      const response = await axios.post<ApiResponse>('/api/v1/customer/profile/me-update', {
        notification_channels: enabledChannels
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.meta.status === 'success') {
        toast.success('Tercihleriniz güncellendi');
      } else {
        throw new Error(response.data.meta.message || 'Tercihler güncellenirken bir hata oluştu');
      }
    } catch (error) {
      toast.error('Tercihler güncellenirken bir hata oluştu');
    } finally {
      setUpdating(false);
    }
  };

  const hasAnyPreference = Object.values(preferences).some(value => value);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="flex-1">
      {/* Üst Başlık */}
      <div className="mb-6 sm:mb-8 -mt-2 sm:mt-0">
        {/* Desktop Header */}
        <div className="hidden sm:flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-orange-50 p-2 rounded-lg">
              <BellIcon className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Tüm Duyuru Tercihlerim</h1>
              <p className="text-sm text-gray-500 mt-1">Hangi kanallardan bildirim almak istediğinizi seçin</p>
            </div>
          </div>
        </div>

        {/* Mobile Header */}
        <div className="sm:hidden">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              {onMenuClick && (
                <button
                  onClick={onMenuClick}
                  className="p-2 rounded-lg hover:bg-gray-100"
                  aria-label="Menü"
                >
                  <Bars3Icon className="w-6 h-6 text-gray-600" />
                </button>
              )}
              <div className="bg-orange-50 p-2 rounded-lg">
                <BellIcon className="w-5 h-5 text-orange-500" />
              </div>
              <h1 className="text-base font-semibold text-gray-900">Tüm Duyuru Tercihlerim</h1>
            </div>
          </div>
          <p className="text-sm text-gray-500 leading-relaxed">
            Hangi kanallardan bildirim almak istediğinizi seçin
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200">
        <div className="space-y-4 sm:space-y-6">
          {notificationTypes.map((notification) => {
            const Icon = notification.icon;
            return (
              <div 
                key={notification.id} 
                className={`flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg transition-colors ${
                  preferences[notification.type] 
                    ? 'bg-orange-50 border border-orange-100' 
                    : 'bg-gray-50 border border-gray-100'
                }`}
              >
                <div className="flex-shrink-0">
                  <div className={`p-1.5 sm:p-2 rounded-lg ${
                    preferences[notification.type] 
                      ? 'bg-orange-100' 
                      : 'bg-gray-100'
                  }`}>
                    <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${
                      preferences[notification.type] 
                        ? 'text-orange-500' 
                        : 'text-gray-400'
                    }`} />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1 gap-3">
                    <h3 className="text-sm sm:text-base font-medium text-gray-900 leading-tight">
                      {notification.title}
                    </h3>
                    <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                      <input 
                        type="checkbox" 
                        checked={preferences[notification.type] || false}
                        onChange={() => handleChange(notification.type)}
                        className="sr-only peer"
                      />
                      <div className="w-10 h-5 sm:w-11 sm:h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 sm:after:h-5 sm:after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                    </label>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-500 leading-relaxed pr-2">
                    {notification.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bilgi Kutusu */}
        <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-blue-50 rounded-xl border border-blue-100">
          <div className="flex items-start gap-2 sm:gap-3">
            <div className="bg-blue-100 p-1 rounded-full mt-0.5 flex-shrink-0">
              <svg className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="min-w-0">
              <p className="text-blue-800 text-xs font-medium">Bilgi</p>
              <p className="text-blue-700 text-xs mt-1 leading-relaxed">
                Bu tercihlerinizi istediğiniz zaman hesap ayarlarınızdan değiştirebilirsiniz.
              </p>
            </div>
          </div>
        </div>

        {/* Güncelle Butonu */}
        <div className="mt-6 sm:mt-8">
          <button 
            onClick={handleUpdate}
            disabled={updating}
            className={`w-full sm:w-auto sm:mx-auto sm:block px-6 sm:px-8 py-3 sm:py-2.5 rounded-lg text-sm font-medium transition-all ${
              hasAnyPreference 
                ? 'bg-orange-500 text-white hover:bg-orange-600' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            } ${updating ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {updating ? 'Güncelleniyor...' : 'Tercihlerimi Kaydet'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Notifications; 