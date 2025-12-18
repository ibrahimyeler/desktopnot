"use client";

import Image from 'next/image';
import Header from '@/components/layout/Header';

export default function SurdurulebilirlikPage() {


  const initiatives = [
    {
      title: 'Yeşil Lojistik',
      description: 'Elektrikli araç filosu ve optimize edilmiş rota planlaması ile karbon emisyonunu azaltıyoruz.',
      icon: '🚚'
    },
    {
      title: 'Sürdürülebilir Ambalaj',
      description: 'Geri dönüştürülebilir ve biyolojik olarak parçalanabilir ambalaj çözümleri kullanıyoruz.',
      icon: '📦'
    },
    {
      title: 'Enerji Verimliliği',
      description: 'Ofislerimizde LED aydınlatma ve akıllı enerji yönetim sistemleri uyguluyoruz.',
      icon: '💡'
    },
    {
      title: 'Dijital Dönüşüm',
      description: 'Bulut tabanlı sistemler ve uzaktan çalışma ile kaynak tüketimini minimize ediyoruz.',
      icon: '☁️'
    }
  ];

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
                  Sürdürülebilirlik
                </h1>
                <p className="text-base md:text-lg lg:text-xl opacity-90">
                  Gelecek için sorumlu ticaret
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
              <span>Sürdürülebilirlik</span>
            </div>
          </div>
        </div>

        {/* Intro Section */}
        <div className="max-w-4xl mx-auto px-4 py-8 md:py-12 text-center">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 md:mb-6">
            Sürdürülebilir Gelecek İçin Çalışıyoruz
          </h2>
          <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-6 md:mb-8 px-2">
            Trendruum olarak, çevresel sorumluluğumuzun bilincindeyiz. E-ticaret faaliyetlerimizde 
            sürdürülebilir uygulamalar benimseyerek, gelecek nesillere daha yaşanabilir bir dünya 
            bırakmak için çalışıyoruz. Karbon ayak izimizi azaltmak, atık miktarını minimize etmek 
            ve sosyal fayda yaratmak temel hedeflerimiz arasında yer alıyor.
          </p>
        </div>



        {/* Initiatives Section */}
        <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
              Sürdürülebilirlik İnisiyatiflerimiz
            </h2>
            <p className="text-gray-600 text-sm md:text-base">
              Günlük operasyonlarımızda uyguladığımız yeşil çözümler
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {initiatives.map((initiative, index) => (
              <div key={index} className="bg-white rounded-lg border border-gray-200 p-4 md:p-6 text-center hover:shadow-md transition-shadow">
                <div className="text-3xl md:text-4xl mb-4">{initiative.icon}</div>
                <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3">{initiative.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{initiative.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Future Goals */}
    

        {/* Contact Section */}
        <div className="max-w-4xl mx-auto px-4 py-12 md:py-16 text-center">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 md:mb-6">
            Sürdürülebilirlik Hakkında
          </h2>
          <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-6 md:mb-8 px-2">
            Sürdürülebilirlik uygulamalarımız hakkında daha fazla bilgi almak, 
            önerilerinizi paylaşmak veya işbirliği fırsatlarını değerlendirmek için 
            bizimle iletişime geçebilirsiniz.
          </p>
          
          <div className="flex flex-col md:flex-row flex-wrap justify-center gap-4 md:gap-6 text-sm md:text-base text-gray-600">
            <div className="flex items-center justify-center gap-2 bg-white rounded-lg p-4 shadow-sm">
              <span className="text-green-500 text-lg">📧</span>
              <span className="break-all">destek@trendruum.com</span>
            </div>
            <div className="flex items-center justify-center gap-2 bg-white rounded-lg p-4 shadow-sm">
              <span className="text-emerald-500 text-lg">📱</span>
              <span>0850 242 11 44</span>
            </div>
            <div className="flex items-center justify-center gap-2 bg-white rounded-lg p-4 shadow-sm">
              <span className="text-teal-500 text-lg">📍</span>
              <span className="text-center">Maslak, Bilim Sk. Sun Plaza No:5 K:13, 34398 Sarıyer/İstanbul</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
