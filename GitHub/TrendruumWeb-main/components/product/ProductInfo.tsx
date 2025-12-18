"use client";

import { useState } from 'react';
import Image from 'next/image';

const ProductInfo = () => {
  const [showFeedback, setShowFeedback] = useState(false);

  const feedbackOptions = [
    { id: 'price', label: 'Ürünün fiyatı hatalı' },
    { id: 'image', label: 'Görsel hatalı' },
    { id: 'name', label: 'Ürünün ismi eksik/hatalı' },
    { id: 'specs', label: 'Ürün özellikleri eksik ya da hatalı' },
    { id: 'category', label: 'Ürünün kategorisi hatalı' }
  ];

  const [selectedOption, setSelectedOption] = useState('');

  return (
    <div className="w-full">

      <h1 className="text-[19px] font-semibold text-gray-800 mb-4">Ürün Bilgileri</h1>
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-6">
          <h2 className="text-[17px] font-medium text-gray-700 max-w-[800px]">
            ENCİVA İsimli Bebek Anne Anı Küpü Dekor Türkçe 5&apos;li Set İsimli Ahşap Bebek Anı Küpüleri
          </h2>
          <button 
            onClick={() => setShowFeedback(true)}
            className="flex items-center gap-1 group"
          >
            <svg 
              width="16" 
              height="16" 
              viewBox="0 0 16 16" 
              className="text-[#333333]"
              fill="currentColor"
            >
              <path d="M2 2H14V11H3.17L2 12.17V2ZM2 0C0.9 0 0.00999999 0.9 0.00999999 2L0 16L4 12H14C15.1 12 16 11.1 16 10V2C16 0.9 15.1 0 14 0H2Z" />
            </svg>
            <span className="text-[13px] text-[#333333] group-hover:underline">
              Geri Bildirim Ver
            </span>
          </button>
        </div>

        <div className="flex gap-8">
          <div className="w-[300px] h-[300px] relative">
            <Image src="/productDetail/photo1.webp" alt="Bebek Anı Küpü" fill className="object-contain" priority />
          </div>

          <div className="flex-1">
            <div className="grid grid-cols-2 gap-x-8 text-[13px] text-gray-600">
              <div className="space-y-4">
                <p className="flex gap-2">
                  <span>•</span> Bu ürün <span className="font-medium underline">ENCİ DEKORASYON</span> tarafından gönderilecektir.
                </p>
                <p className="flex gap-2">
                  <span>•</span> Kampanya fiyatından satılmak üzere 100 adetten fazla stok sunulmuştur.
                </p>
                <p className="flex gap-2">
                  <span>•</span> İncelemiş olduğunuz ürünün satış fiyatını satıcı belirlemektedir.
                </p>
                <p className="flex gap-2">
                  <span>•</span> Bir ürün, birden fazla satıcı tarafından satılabilir. Birden fazla satıcı tarafından satışa sunulan ürünlerin satıcıları ürün için belirledikleri fiyata, satıcı puanlarına, teslimat statülerine, ürünlerdeki promosyonlara, kargonun bedava olup olmamasına ve ürünlerin hızlı teslimat ile teslim edilip edilememesine, ürünlerin stok ve kategorileri bilgilerine göre sıralanmaktadır.
                </p>
                <p className="flex gap-2">
                  <span>•</span> İsim belirtmeniz halinde isimli olarak gönderilmektedir. Hamilelik ve annelik sürecinde bebeğinizin ve sizin özel anlarınızı fotoğraflayabilirsin.
                </p>
                <p className="flex gap-2">
                  <span>•</span> Rakamlar ve emojiler özel el işçiliği ile ihtiyaç sahibi kadınlarımız tarafından yapılmaktadır.
                </p>
              </div>

              <div className="space-y-4">
                <p className="flex gap-2">
                  <span>•</span> Bebek odalarında ve ev içerisinde tarih hafta kombinleriyle dekor amaçlı kullanabilirsiniz
                </p>
                <p className="flex gap-2">
                  <span>•</span> Gün * hafta * ay * yıl kombinasyonları yapabilir ayrıca doğum hamilelik hediyeleri için çok özel bir üründür
                </p>
                <p className="flex gap-2">
                  <span>•</span> Paket içeriği 5 adet ahşap küp
                </p>
                <p className="flex gap-2">
                  <span>•</span> 100 x 50- 1 adet isim küpü
                </p>
                <p className="flex gap-2">
                  <span>•</span> 100 x 50 - 1 adet prizma günlük -Haftalık - Aylık - Yaşında
                </p>
                <p className="flex gap-2">
                  <span>•</span> 50 x50 - 2 adet rakam küpü 50 x 50 - 1 adet emoji simgeleri küpü
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-[17px] font-medium text-gray-700 mb-4">Ürün Özellikleri</h2>
          <div className="bg-gray-50 rounded p-3 flex items-center">
            <div className="w-[200px]">
              <p className="text-[13px] text-gray-600">Renk</p>
            </div>
            <div>
              <p className="text-[13px] text-gray-600">Siyah</p>
            </div>
          </div>
        </div>
      </div>

      {showFeedback && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md mx-4">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-medium text-[#333333]">Ürün Şikayet Nedeni Seçiniz</h3>
              <button 
                onClick={() => setShowFeedback(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-4 space-y-3">
              {feedbackOptions.map((option) => (
                <label 
                  key={option.id}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <div className="relative flex items-center justify-center w-5 h-5">
                    <input
                      type="radio"
                      name="feedback"
                      value={option.id}
                      checked={selectedOption === option.id}
                      onChange={(e) => setSelectedOption(e.target.value)}
                      className="appearance-none w-5 h-5 border-2 border-gray-300 rounded-full checked:border-[#f27a1a] transition-colors"
                    />
                    {selectedOption === option.id && (
                      <div className="absolute w-2.5 h-2.5 bg-[#f27a1a] rounded-full" />
                    )}
                  </div>
                  <span className="text-sm text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>

            <div className="p-4 border-t">
              <button 
                onClick={() => setShowFeedback(false)}
                disabled={!selectedOption}
                className={`w-full py-3 rounded text-white text-sm font-medium transition-colors ${
                  selectedOption 
                    ? 'bg-[#f27a1a] hover:bg-[#d85a00]' 
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                Gönder
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductInfo; 