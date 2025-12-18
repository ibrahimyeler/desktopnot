"use client";

import { UserIcon } from '@heroicons/react/24/outline';

const ProfileInfo = () => {
  return (
    <div className="bg-white rounded-lg p-6">
      <div className="flex items-center gap-2 mb-6">
        <UserIcon className="w-6 h-6 text-orange-500" />
        <h2 className="text-lg font-medium text-gray-900">Üyelik Bilgilerim</h2>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Ad Soyad
          </label>
          <input
            type="text"
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-gray-900"
            placeholder="Ad Soyad"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            E-posta
          </label>
          <input
            type="email"
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-gray-900"
            placeholder="E-posta"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Telefon
          </label>
          <input
            type="tel"
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-gray-900"
            placeholder="Telefon"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Doğum Tarihi
          </label>
          <input
            type="date"
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-gray-900"
          />
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button className="bg-[#F27A1A] text-white px-8 py-2.5 rounded-lg font-medium hover:bg-[#F27A1A]/90 transition-colors">
          Değişiklikleri Kaydet
        </button>
      </div>
    </div>
  );
};

export default ProfileInfo; 