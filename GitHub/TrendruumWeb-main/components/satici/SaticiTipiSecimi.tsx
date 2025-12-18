"use client";

import React from 'react';

const SaticiTipiSecimi = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Main Title and Introduction */}
        <div className="text-center mb-16">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-6">
            Trendruum'da Satıcı Ol
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Aşağıdaki satıcı tiplerinden birini seçip Trendruum Satıcı Panel başvurunuzu hemen yapın, 
            bütün aksiyonlarınızı tek bir kanaldan yönetin, satışlarınızı arttırın!
          </p>
        </div>

        {/* Seller Type Options */}
        <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
          {/* Standard Seller */}
          <div className="text-center p-8 rounded-2xl border-2 border-gray-200 hover:border-orange-300 hover:shadow-lg transition-all duration-300 cursor-pointer group">
            <div className="mb-6">
              <div className="w-24 h-24 mx-auto bg-green-50 rounded-full flex items-center justify-center group-hover:bg-green-100 transition-colors duration-300">
                <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Satıcı Ol</h2>
            <p className="text-gray-600 leading-relaxed">
              Trendruum'da satış yaparak e-ticaret dünyasına adım atın, işinizi büyütün!
            </p>
            
            <div className="mt-8">
              <a
                href="https://seller.trendruum.com/onboarding/satici-formu/pazaryeri"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-orange-400 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-500 transition-colors duration-200"
              >
                Başvuru Yap
              </a>
            </div>
          </div>

          {/* Female Entrepreneur */}
          <div className="text-center p-8 rounded-2xl border-2 border-gray-200 hover:border-orange-300 hover:shadow-lg transition-all duration-300 cursor-pointer group">
            <div className="mb-6">
              <div className="w-24 h-24 mx-auto bg-yellow-50 rounded-full flex items-center justify-center group-hover:bg-yellow-100 transition-colors duration-300">
                <svg className="w-12 h-12 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Satıcı Girişi</h2>
            <p className="text-gray-600 leading-relaxed">
              Zaten Trendruum'da satış yapıyorsanız, hesabınıza giriş yapın ve 
              satışlarınızı yönetmeye devam edin!
            </p>
            
            <div className="mt-8">
              <a
                href="https://seller.trendruum.com/onboarding/satici-formu/pazaryeri"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-orange-400 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-500 transition-colors duration-200"
              >
                Başvuru Yap
              </a>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-16 text-center">
          <div className="bg-gray-50 rounded-xl p-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Neden Trendruum Satıcı Paneli?
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">%10 Komisyon</h4>
                <p className="text-sm text-gray-600">Rekabetçi komisyon oranı ile daha fazla kar</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">15 İş Günü Ödeme</h4>
                <p className="text-sm text-gray-600">Hızlı ödeme süresi ile nakit akışınızı yönetin</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">İade Kargo Desteği</h4>
                <p className="text-sm text-gray-600">İade kargo ücretlerini biz karşılıyoruz</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Ücretsiz Reklam</h4>
                <p className="text-sm text-gray-600">Sponsorlu reklam desteği ile satışlarınızı artırın</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaticiTipiSecimi;
