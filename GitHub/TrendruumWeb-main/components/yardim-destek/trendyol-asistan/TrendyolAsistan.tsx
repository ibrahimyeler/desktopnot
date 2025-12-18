'use client';
import { useState } from 'react';
import Image from 'next/image';
import { IoClose, IoRemove } from 'react-icons/io5';
import { FaChevronRight } from 'react-icons/fa';

const categories = [
  {
    id: 'siparislerim',
    icon: '📦',
    title: 'Siparişlerim'
  },
  {
    id: 'yemek-market',
    icon: '🛒',
    title: 'Yemek ve Market Siparişlerim'
  },
  {
    id: 'hesabim',
    icon: '👤',
    title: 'Hesabım'
  },
  {
    id: 'kampanya',
    icon: '🏷️',
    title: 'Kampanya ve Kupon İşlemlerim'
  },
  {
    id: 'iade',
    icon: '↩️',
    title: 'İade İşlemlerim'
  }
];

export default function TrendruumAsistan() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputMessage, setInputMessage] = useState('');

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Kapalı Durum */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 bg-[#F27A1A] text-white px-4 py-3 rounded-lg shadow-lg hover:bg-[#e67018] transition-colors"
        >
          <Image
            src="/trendruum-asistan-icon.png"
            alt="Trendruum Asistan"
            width={24}
            height={24}
            className="rounded-full"
          />
          <span className="font-medium">Trendruum Asistan</span>
        </button>
      )}

      {isOpen && (
        <div 
          className={`bg-white rounded-lg shadow-xl w-[360px] ${
            isMinimized ? 'h-[48px]' : 'h-[600px]'
          } flex flex-col transition-all duration-300`}
        >
          <div className="bg-[#F27A1A] text-white p-3 rounded-t-lg flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-2xl">💬</span>
              <span className="font-medium">Trendruum Asistan</span>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-white hover:text-gray-200"
              >
                <IoRemove size={24} />
              </button>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-gray-200"
              >
                <IoClose size={24} />
              </button>
          
            </div>
          </div>

          {!isMinimized && (
            <>
              <div className="flex items-center justify-between px-4 py-2 border-b">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">🇬🇧 ENG</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-gray-600">Bilgilendirmeler</span>
                  <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">1</span>
                </div>
              </div>

              <div className="p-4 border-b">
                <div className="flex justify-between items-center text-[#F27A1A] mb-4">
                  <span>Tüm Duyuruları Gör</span>
                  <FaChevronRight />
                </div>
              </div>

              <div className="p-4 bg-gray-100">
                <p className="text-gray-700">
                  Sana yardımcı olabilmem için talebini birkaç kelimeyle yazabilir ya da aşağıdaki başlıklardan uygun olanı seçebilirsin.
                </p>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    className="w-full text-left p-4 border rounded-lg mb-2 hover:border-[#F27A1A] transition-colors flex items-center gap-3"
                  >
                    <span className="text-2xl">{category.icon}</span>
                    <span className="text-gray-700">{category.title}</span>
                  </button>
                ))}
              </div>

              <div className="p-4 border-t">
                <div className="relative">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Talebini birkaç kelime ile yazabilirsin..."
                    className="w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:border-[#F27A1A]"
                  />
                  <button className="absolute right-3 top-1/2 -translate-y-1/2 text-[#F27A1A]">
                    <FaChevronRight size={20} />
                  </button>
                </div>
                <div className="mt-4 text-center">
                  <div className="bg-orange-50 text-[#F27A1A] p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Hatırlatma</h3>
                    <p className="text-sm">
                      Talebini birkaç kelime ile buraya yazarak, aradığın sorunun yanıtına hızlıca ulaşabilirsin.
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
} 