"use client";

import { useState, useEffect } from 'react';
import { XMarkIcon, BellIcon, EnvelopeIcon, DevicePhoneMobileIcon, PhoneIcon } from '@heroicons/react/24/outline';
import { CheckIcon } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';
import axios from 'axios';

interface NotificationPreference {
  id: string;
  title: string;
  description: string;
  icon: React.ReactElement;
  enabled: boolean;
  type: 'email' | 'sms' | 'phone';
}

interface NotificationPreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPreferencesSet?: () => void;
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

const NotificationPreferencesModal = ({ isOpen, onClose, onPreferencesSet }: NotificationPreferencesModalProps) => {
  const [preferences, setPreferences] = useState<NotificationPreference[]>([
    {
      id: 'email',
      title: 'E-posta Bildirimleri',
      description: 'Özel indirimler, kampanyalar ve yeni ürün duyuruları',
      icon: <EnvelopeIcon className="w-6 h-6" />,
      enabled: false,
      type: 'email'
    },
    {
      id: 'sms',
      title: 'SMS Bildirimleri',
      description: 'Sipariş durumu, kargo takibi ve acil duyurular',
      icon: <DevicePhoneMobileIcon className="w-6 h-6" />,
      enabled: false,
      type: 'sms'
    },
    {
      id: 'phone',
      title: 'Telefon Aramaları',
      description: 'Önemli sipariş güncellemeleri ve müşteri hizmetleri',
      icon: <PhoneIcon className="w-6 h-6" />,
      enabled: false,
      type: 'phone'
    }
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [originalPreferences, setOriginalPreferences] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      fetchUserPreferences();
    }
  }, [isOpen]);

  const fetchUserPreferences = async () => {
    setIsInitialLoading(true);
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
        setOriginalPreferences(userChannels);
        
        setPreferences(prev => 
          prev.map(pref => ({
            ...pref,
            enabled: userChannels.includes(pref.type)
          }))
        );
      }
    } catch (error) {
      toast.error('Tercihler yüklenirken bir hata oluştu');
    } finally {
      setIsInitialLoading(false);
    }
  };

  const togglePreference = (id: string) => {
    setPreferences(prev => 
      prev.map(pref => 
        pref.id === id ? { ...pref, enabled: !pref.enabled } : pref
      )
    );
  };

  // Tercihlerde değişiklik olup olmadığını kontrol et
  const hasChanges = () => {
    const currentEnabled = preferences
      .filter(pref => pref.enabled)
      .map(pref => pref.type)
      .sort();
    
    const originalEnabled = [...originalPreferences].sort();
    
    return JSON.stringify(currentEnabled) !== JSON.stringify(originalEnabled);
  };

  const handleSave = async () => {
    // Eğer hiçbir değişiklik yapılmadıysa
    if (!hasChanges()) {
      toast.success('Tercihleriniz zaten güncel');
      const userEmail = localStorage.getItem('userEmail');
      localStorage.setItem(`hasSeenNotificationModal_${userEmail}`, 'true');
      onPreferencesSet?.();
      onClose();
      return;
    }

    setIsLoading(true);
    try {
      const enabledChannels = preferences
        .filter(pref => pref.enabled)
        .map(pref => pref.type);

      const token = localStorage.getItem('token');
      const userEmail = localStorage.getItem('userEmail');
      
      if (token) {
        const response = await axios.post<ApiResponse>('/api/v1/customer/profile/me-update', {
          notification_channels: enabledChannels
        }, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.data.meta.status === 'success') {
          localStorage.setItem(`hasSeenNotificationModal_${userEmail}`, 'true');
          toast.success('Bildirim tercihleriniz başarıyla kaydedildi');
          onPreferencesSet?.();
          onClose();
        } else {
          toast.error(response.data.meta.message || 'Tercihler kaydedilirken bir hata oluştu');
        }
      }
    } catch (error) {
      toast.error('Tercihler kaydedilirken bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    const userEmail = localStorage.getItem('userEmail');
    localStorage.setItem(`hasSeenNotificationModal_${userEmail}`, 'true');
    onPreferencesSet?.();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-0 sm:p-4">
      <div className="bg-white rounded-none sm:rounded-2xl w-full h-full sm:h-auto sm:max-w-md sm:mx-4 overflow-hidden shadow-2xl animate-fade-in max-h-full overflow-y-auto sm:overflow-visible">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4 sm:p-6 text-white relative">
          <button 
            onClick={handleSkip}
            className="absolute right-3 top-3 sm:right-4 sm:top-4 text-white/80 hover:text-white transition-colors p-1"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-3 pr-8">
            <div className="bg-white/20 p-2 sm:p-3 rounded-full flex-shrink-0">
              <BellIcon className="w-6 h-6 sm:w-8 sm:h-8" />
            </div>
            <div className="min-w-0">
              <h2 className="text-lg sm:text-xl font-bold">Bildirim Tercihleri</h2>
              <p className="text-orange-100 text-sm leading-relaxed">Size özel deneyim için tercihlerinizi belirleyin</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">
          {isInitialLoading ? (
            <div className="flex items-center justify-center py-6 sm:py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
              <span className="ml-3 text-gray-600 text-sm">Tercihleriniz yükleniyor...</span>
            </div>
          ) : (
            <>
              <div className="space-y-3 sm:space-y-4">
                {preferences.map((pref) => (
                  <div 
                    key={pref.id}
                    className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border border-gray-100 hover:border-orange-200 transition-colors cursor-pointer"
                    onClick={() => togglePreference(pref.id)}
                  >
                    <div className={`p-1.5 sm:p-2 rounded-lg flex-shrink-0 ${pref.enabled ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-400'}`}>
                      <div className="w-5 h-5 sm:w-6 sm:h-6">
                        {pref.icon}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-sm leading-tight">{pref.title}</h3>
                      <p className="text-gray-600 text-xs mt-1 leading-relaxed">{pref.description}</p>
                    </div>
                    <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                      pref.enabled 
                        ? 'bg-orange-500 border-orange-500' 
                        : 'border-gray-300 hover:border-orange-300'
                    }`}>
                      {pref.enabled && <CheckIcon className="w-3 h-3 sm:w-4 sm:h-4 text-white" />}
                    </div>
                  </div>
                ))}
              </div>

              {/* Info Box */}
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
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 bg-gray-50 flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleSkip}
            className="flex-1 px-4 py-3 text-gray-600 font-medium text-sm border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors order-2 sm:order-1"
          >
            Şimdi Değil
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading || isInitialLoading}
            className={`flex-1 px-4 py-3 font-medium text-sm rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed order-1 sm:order-2 ${
              hasChanges() 
                ? 'bg-orange-500 text-white hover:bg-orange-600' 
                : 'bg-gray-300 text-gray-600 cursor-not-allowed'
            }`}
          >
            {isLoading ? 'Kaydediliyor...' : hasChanges() ? 'Kaydet' : 'Değişiklik Yok'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationPreferencesModal; 