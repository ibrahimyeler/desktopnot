import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

interface NotificationPreferencesModalProps {
  onClose: () => void;
  onPreferencesSet?: () => void;
}

interface NotificationPreferences {
  email: boolean;
  push: boolean;
  sms: boolean;
}

export default function NotificationPreferencesModal({ onClose, onPreferencesSet }: NotificationPreferencesModalProps) {
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    email: false,
    push: false,
    sms: false,
  });

  useEffect(() => {
    const savedPreferences = localStorage.getItem('notificationPreferences');
    if (savedPreferences) {
      setPreferences(JSON.parse(savedPreferences));
    }
  }, []);

  const handleSave = async () => {
    try {
      const response = await fetch('/api/notification-preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preferences),
      });

      if (response.ok) {
        localStorage.setItem('notificationPreferences', JSON.stringify(preferences));
        onPreferencesSet?.();
        onClose();
      } else {
        toast.error('Bildirim tercihleri kaydedilirken bir hata oluştu');
      }
    } catch (error) {
      toast.error('Bildirim tercihleri kaydedilirken bir hata oluştu');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Bildirim Tercihleri</h2>
        
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="email"
              checked={preferences.email}
              onChange={(e) => setPreferences({ ...preferences, email: e.target.checked })}
              className="mr-2"
            />
            <label htmlFor="email">E-posta Bildirimleri</label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="push"
              checked={preferences.push}
              onChange={(e) => setPreferences({ ...preferences, push: e.target.checked })}
              className="mr-2"
            />
            <label htmlFor="push">Push Bildirimleri</label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="sms"
              checked={preferences.sms}
              onChange={(e) => setPreferences({ ...preferences, sms: e.target.checked })}
              className="mr-2"
            />
            <label htmlFor="sms">SMS Bildirimleri</label>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            İptal
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Kaydet
          </button>
        </div>
      </div>
    </div>
  );
} 