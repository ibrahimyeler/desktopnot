"use client";

import { KeyIcon, EyeIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

const PasswordSettings = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="bg-white rounded-lg p-6">
      <div className="flex items-center gap-2 mb-6">
        <KeyIcon className="w-6 h-6 text-[#F27A1A]" />
        <h2 className="text-xl font-medium text-[#F27A1A]">Şifre Güncelleme</h2>
      </div>

      <div className="space-y-4 mb-8">
        <div>
          <label className="block text-sm text-gray-600 mb-2">
            Şu Anki Şifre
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              className="w-full px-4 py-3 rounded border border-gray-300 focus:ring-1 focus:ring-[#F27A1A]/20 focus:border-[#F27A1A] outline-none text-gray-900"
              placeholder="Mevcut şifreniz"
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <EyeIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-2">
            Yeni Şifre
          </label>
          <input
            type="password"
            className="w-full px-4 py-3 rounded border border-gray-300 focus:ring-1 focus:ring-[#F27A1A]/20 focus:border-[#F27A1A] outline-none text-gray-900"
            placeholder="Yeni şifreniz"
          />
          <p className="text-xs text-gray-500 mt-1">
            Şifreniz en az 10 karakter olmalı, 1 büyük harf, 1 küçük harf ve rakam içermelidir.
          </p>
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-2">
            Yeni Şifre (Tekrar)
          </label>
          <input
            type="password"
            className="w-full px-4 py-3 rounded border border-gray-300 focus:ring-1 focus:ring-[#F27A1A]/20 focus:border-[#F27A1A] outline-none text-gray-900"
            placeholder="Yeni şifrenizi tekrar girin"
          />
        </div>

        <div className="pt-2">
          <button className="w-full bg-[#F1F2F3] text-gray-700 px-8 py-3 rounded font-medium hover:bg-[#E5E7E9] transition-colors">
            Güncelle
          </button>
        </div>
      </div>

      {/* 2 Adımlı Doğrulama */}
      <div className="border-t pt-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-medium text-gray-900">
              İKİ ADIMLI DOĞRULAMA
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              İki adımlı doğrulama yöntemini etkinleştirdiğinizde, kişisel şifrelerinize ek olarak kayıtlı cep telefonunuza gelen doğrulama koduyla oturum açarsınız.
            </p>
          </div>
          <div className="flex items-center">
            <div className="relative inline-block w-10 mr-2 align-middle select-none">
              <input 
                type="checkbox" 
                name="toggle" 
                id="toggle"
                className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 border-gray-300 appearance-none cursor-pointer transition-transform duration-200 ease-in translate-x-0 checked:translate-x-full checked:border-[#F27A1A]"
              />
              <label 
                htmlFor="toggle" 
                className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .toggle-checkbox:checked + .toggle-label {
          background-color: #F27A1A;
        }
      `}</style>
    </div>
  );
};

export default PasswordSettings; 