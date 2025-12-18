"use client";

import Image from 'next/image';
import Header from '@/components/layout/Header';

export default function SosyalMedyaPage() {
  const socialPlatforms = [
    {
      name: 'Instagram',
      handle: '@trendruum',
      description: 'Günlük yaşam tarzı, dekorasyon ipuçları ve yeni ürünler',
      color: 'bg-gradient-to-br from-pink-400 via-purple-500 to-orange-400',
      icon: '/sosyal/instagram.png',
      url: 'https://www.instagram.com/trendruum/',
    },
    {
      name: 'X',
      handle: '@trendruum',
      description: 'Anlık güncellemeler, kampanyalar ve müşteri hizmetleri',
      color: 'bg-slate-800',
      icon: '/sosyal/x.png',
      url: 'https://x.com/trendruum',
    },
    {
      name: 'Facebook',
      handle: 'Trendruum',
      description: 'Topluluk, etkinlikler ve özel kampanyalar',
      color: 'bg-blue-500',
      icon: '/sosyal/facebook.png',
      url: 'https://www.facebook.com/trendruumcom',
    },
    {
      name: 'YouTube',
      handle: 'Trendruum',
      description: 'Ürün tanıtımları, dekorasyon videoları ve DIY içerikler',
      color: 'bg-red-500',
      icon: '/sosyal/youtube.png',
      url: 'https://www.youtube.com/channel/UCg_b_FnRblF6qvY5CLKEGmA',
    },
    {
      name: 'TikTok',
      handle: '@trendruum.com',
      description: 'Eğlenceli içerikler, trend ürünler ve kısa videolar',
      color: 'bg-black',
      icon: '/sosyal/tiktok.png',
      url: 'https://www.tiktok.com/@trendruum.com',
    },
    {
      name: 'LinkedIn',
      handle: 'Trendruum',
      description: 'Şirket güncellemeleri, kariyer fırsatları ve sektör haberleri',
      color: 'bg-blue-600',
      icon: '/sosyal/linkedin.png',
      url: 'https://www.linkedin.com/company/trendruum',
    },

  ];

  const handleFollow = (platform: any) => {
    window.open(platform.url, '_blank');
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-grow header-padding pt-0">
        {/* Hero Section */}
        <div className="w-full px-5 relative">
          <div className="bg-gradient-to-br from-orange-500 via-red-500 to-purple-600 h-64 md:h-80 lg:h-96 rounded-lg relative overflow-hidden">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="text-6xl mb-4">📱</div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2">
                  Sosyal Medyada Trendruum
                </h1>
                <p className="text-lg md:text-xl opacity-90">
                  Bizi takip edin, güncel kalın!
                </p>
              </div>
            </div>
          </div>
          
          {/* Breadcrumb */}
          <div className="absolute top-4 left-10">
            <div className="text-white text-sm">
              <span className="hover:text-orange-300 cursor-pointer">Anasayfa</span>
              <span className="mx-2">/</span>
              <span>Sosyal Medya</span>
            </div>
          </div>
        </div>

        {/* Intro Section */}
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
            Dijital Dünyada Trendruum
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            Trendruum olarak sosyal medya platformlarında aktif olarak yer alıyor, 
            müşterilerimizle sürekli iletişim halinde kalıyoruz. Güncel trendler, 
            yeni ürünler, dekorasyon ipuçları ve özel kampanyalarımızı takip etmek 
            için bizi sosyal medyada takip edin!
          </p>
          <div className="flex justify-center items-center gap-4 text-2xl">
            <span className="text-orange-500">📱</span>
            <span className="text-purple-500">💻</span>
            <span className="text-blue-500">📺</span>
            <span className="text-green-500">🎯</span>
          </div>
        </div>

        {/* Social Media Grid */}
        <div className="max-w-7xl mx-auto px-4 pb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {socialPlatforms.map((platform, index) => (
              <div 
                key={index}
                className="bg-white rounded-lg transition-all duration-300 overflow-hidden group cursor-pointer border border-gray-200"
                onClick={() => handleFollow(platform)}
              >
                {/* Platform Header */}
                <div className={`${platform.color} p-4 text-white relative overflow-hidden`}>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 flex items-center justify-center">
                        <Image
                          src={platform.icon}
                          alt={`${platform.name} icon`}
                          width={48}
                          height={48}
                          className="w-10 h-10 object-contain"
                        />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold mb-1">{platform.name}</h3>
                    <p className="text-sm opacity-90">{platform.handle}</p>
                  </div>
                </div>

                {/* Platform Content */}
                <div className="p-4 flex flex-col h-full">
                  <p className="text-gray-700 text-sm leading-relaxed mb-4 flex-grow">
                    {platform.description}
                  </p>
                  
                                    <div className="flex items-center justify-between mb-4">
                    <div className="text-xs text-gray-500">
                      <span className="font-medium">{platform.posts}</span> gönderi
                    </div>
                    <div className="text-xs text-gray-500">
                      Aktif platform
                    </div>
                  </div>


 
                </div>
              </div>
            ))}
          </div>
        </div>

        
      </main>
    </div>
  );
}
