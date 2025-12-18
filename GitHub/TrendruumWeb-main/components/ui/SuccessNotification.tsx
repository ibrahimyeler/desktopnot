"use client";

import { useEffect, useState } from 'react';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

interface SuccessNotificationProps {
  message: string;
  onClose: () => void;
}

export default function SuccessNotification({ message, onClose }: SuccessNotificationProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, 2000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed top-24 right-4 z-50 transform transition-all duration-300 ease-in-out ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <div className="bg-green-50 border border-green-200 rounded-lg shadow-lg p-6 flex items-center gap-3 min-w-[350px]">
        <div className="bg-green-100 rounded-full p-2">
          <CheckCircleIcon className="h-8 w-8 text-green-600 flex-shrink-0" />
        </div>
        <div className="flex-1">
          <h3 className="text-green-800 font-semibold text-lg mb-1">Sipariş Başarılı!</h3>
          <p className="text-green-700 text-base">{message}</p>
        </div>
      </div>
    </div>
  );
} 