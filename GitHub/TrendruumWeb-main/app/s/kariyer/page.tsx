"use client";

import Image from 'next/image';
import Header from '@/components/layout/Header';

export default function KariyerPage() {


  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header showBackButton={true} onBackClick={() => window.history.back()} />
      
      <main className="flex-grow pb-4 md:pb-0 pt-24 md:pt-8">
        {/* Hero Section */}
        <div className="w-full px-4 md:px-5 relative pt-4 md:pt-0">
          <div 
            className="h-64 md:h-80 lg:h-96 rounded-lg relative overflow-hidden bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: 'url(/bg-trendruum.png)'
            }}
          >
            <div className="absolute inset-0 bg-black/40"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white px-4">
                <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-2">
                  Trendruum'da Kariyer
                </h1>
                <p className="text-base md:text-lg lg:text-xl opacity-90">
                  Geleceği birlikte inşa edelim!
                </p>
              </div>
            </div>
          </div>
          
          {/* Breadcrumb */}
          <div className="absolute top-4 left-4 md:left-10">
            <div className="text-white text-xs md:text-sm">
              <span 
                className="hover:text-orange-300 cursor-pointer transition-colors"
                onClick={() => window.location.href = '/'}
              >
                Anasayfa
              </span>
              <span className="mx-2">/</span>
              <span>Kariyer</span>
            </div>
          </div>
        </div>

        {/* Intro Section */}
        <div className="max-w-4xl mx-auto px-4 py-8 md:py-12 text-center">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 md:mb-6">
            Neden Trendruum?
          </h2>
          <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-6 md:mb-8 px-2">
            Trendruum olarak, yenilikçi fikirlerin hayat bulduğu, sürekli öğrenmenin teşvik edildiği 
            ve her çalışanın değerli hissettiği bir çalışma ortamı yaratıyoruz. E-ticaret dünyasında 
            fark yaratmak isteyen, dinamik ve yaratıcı kişilerle çalışmaktan mutluluk duyuyoruz.
          </p>
        </div>



        {/* Culture Section */}
        <div className="bg-gray-50 py-12 md:py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-6 md:mb-8">
              Şirket Kültürümüz
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="text-3xl md:text-4xl mb-4">🎯</div>
                <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2">Misyon Odaklı</h3>
                <p className="text-gray-600 text-sm md:text-base">
                  Müşteri memnuniyeti ve kaliteli hizmet odaklı çalışma anlayışı
                </p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="text-3xl md:text-4xl mb-4">🚀</div>
                <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2">İnovasyon</h3>
                <p className="text-gray-600 text-sm md:text-base">
                  Sürekli gelişim ve yenilikçi çözümler üretme yaklaşımı
                </p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="text-3xl md:text-4xl mb-4">🤝</div>
                <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2">Takım Ruhu</h3>
                <p className="text-gray-600 text-sm md:text-base">
                  Birlikte başarma ve karşılıklı destek kültürü
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="max-w-4xl mx-auto px-4 py-12 md:py-16 text-center">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 md:mb-6">
            İletişime Geçin
          </h2>
          <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-6 md:mb-8 px-2">
            Açık pozisyonlarımız hakkında daha fazla bilgi almak veya genel başvuru yapmak için 
            bizimle iletişime geçebilirsiniz. CV'nizi gönderebilir ve size en uygun pozisyonu 
            birlikte değerlendirebiliriz.
          </p>
          
          <div className="flex flex-col md:flex-row flex-wrap justify-center gap-4 md:gap-6 text-sm md:text-base text-gray-600">
            <div className="flex items-center justify-center gap-2 bg-white rounded-lg p-4 shadow-sm">
              <span className="text-blue-500 text-lg">📧</span>
              <span className="break-all">destek@trendruum.com</span>
            </div>
            <div className="flex items-center justify-center gap-2 bg-white rounded-lg p-4 shadow-sm">
              <span className="text-purple-500 text-lg">📱</span>
              <span>0850 242 11 44</span>
            </div>
            <div className="flex items-center justify-center gap-2 bg-white rounded-lg p-4 shadow-sm">
              <span className="text-green-500 text-lg">📍</span>
              <span className="text-center">Maslak, Bilim Sk. Sun Plaza No:5 K:13, 34398 Sarıyer/İstanbul</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
