"use client";

import Image from 'next/image';
import Header from '@/components/layout/Header';

export default function HakkimizdaPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header showBackButton={true} onBackClick={() => window.history.back()} />
      
      <main className="flex-grow pb-4 md:pb-0 pt-24 md:pt-8">
        {/* Main Image */}
        <div className="w-full px-4 md:px-5 relative pt-4 md:pt-0">
          <Image
            src="/hakkimizda/resim1.png"
            alt="Trendruum"
            width={1920}
            height={400}
            className="w-full h-64 md:h-80 lg:h-96 object-cover rounded-lg"
            priority
          />
          
          {/* Breadcrumb and Title */}
          <div className="absolute bottom-4 left-4 md:left-10">
            <div className="text-white text-xs md:text-sm mb-2">
              <span 
                className="hover:text-orange-300 cursor-pointer transition-colors"
                onClick={() => window.location.href = '/'}
              >
                Anasayfa
              </span>
              <span className="mx-2">/</span>
              <span>Hakkımızda</span>
            </div>
            <h1 className="text-white text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold drop-shadow-lg">
              Hakkımızda
            </h1>
          </div>
        </div>

        {/* Logo Section */}
        <div className="flex justify-center py-8">
          <Image
            src="/hakkimizda/logo.svg"
            alt="Trendruum Logo"
            width={70}
            height={28}
            className="h-7 w-auto"
          />
        </div>

        {/* Content Section */}
        <div className="max-w-4xl mx-auto px-4 pb-16 text-center space-y-4">
          <div className="p-4">
            <p className="text-base text-gray-800 leading-relaxed">
              <strong>Trendruum</strong>, yaşam alanlarınızı yenilemenin en keyifli ve pratik yolunu sunmak için kuruldu. Ev dekorasyonundan mobilyaya, 
              aksesuardan yaşam ürünlerine kadar geniş ürün yelpazemizle; estetiği, fonksiyonelliği ve kaliteyi bir araya getiriyoruz.
            </p>
          </div>

          <div className="p-4">
            <p className="text-base text-gray-800 leading-relaxed">
              Kurulduğumuz ilk günden bu yana amacımız, her zevke ve ihtiyaca hitap eden ürünleri güvenli ve kolay bir alışveriş deneyimiyle 
              sizlere ulaştırmak. Güncel trendleri yakından takip ediyor, koleksiyonlarımızı sürekli yeniliyor ve her detayı özenle seçiyoruz.
            </p>
          </div>

          <div className="p-4">
            <p className="text-lg font-bold italic text-gray-900 leading-relaxed">
              Trendruum'da her ürün, sadece bir eşya değil; tarzınızı yansıtan bir parça.
            </p>
          </div>

          <div className="p-4">
            <p className="text-base text-gray-800 leading-relaxed">
              Kaliteli ürünleri, ulaşılabilir fiyatlarla buluşturuyoruz; satış öncesi ve sonrası destekle memnuniyetinizi her zaman ön planda tutuyoruz. 
              Türkiye'nin dört bir yanına hızlı ve güvenli kargo, kolay iade ve güçlü müşteri hizmetleri altyapısıyla daima yanınızdayız.
            </p>
          </div>

          <div className="p-4">
            <p className="text-base font-bold italic text-gray-900 leading-relaxed">
              Sade, şık ve ilham verici yaşam alanları için doğru yerdesiniz.
            </p>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="max-w-6xl mx-auto px-4 pb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Card - Orange */}
         
            {/* Right Card - White */}
       
          </div>
        </div>

        {/* Additional Content Section */}
        <div className="max-w-4xl mx-auto px-4 pb-16 text-center space-y-6">
          {/* Office Section */}
          <div className="p-4">
            <div className="flex items-center justify-center mb-4">
              <span className="text-2xl mr-2">📍</span>
              <h3 className="text-lg font-bold text-gray-900">Trendruum Ofisi</h3>
            </div>
          </div>

          <div className="p-4">
            <p className="text-base text-gray-800 leading-relaxed">
              <strong>Trendruum</strong> olarak sadece ürünlerimizle değil, çalışma kültürümüzle de fark yaratmayı hedefliyoruz. İstanbul'daki merkez ofisimizde, 
              yenilikçi fikirlerin üretildiği, trendlerin takip edildiği ve her detayın titizlikle planlandığı dinamik bir ekip çalışıyor.
            </p>
          </div>

          <div className="p-4">
            <p className="text-base text-gray-800 leading-relaxed">
              Modern, yalın ve yaratıcı bir çalışma ortamı oluşturarak, tasarımdan lojistiğe, müşteri hizmetlerinden satın almaya kadar tüm 
              süreçleri aynı çatı altında yönetiyoruz. Bu sayede her ürünü, her hizmeti kendi kontrolümüzden geçiriyor ve müşteriyle 
              buluşturmadan önce defalarca test ediyoruz.
            </p>
          </div>

          <div className="p-4">
            <p className="text-base font-bold italic text-gray-900 leading-relaxed">
              Ofisimizde her gün, yaşam alanlarınıza değer katacak fikirler konuşuluyor. Çünkü bizim için Trendruum sadece bir alışveriş sitesi 
              değil, stil sahibi bir yaşam biçiminin temsilcisidir.
            </p>
          </div>
        </div>

        {/* Office Images Section */}
        <div className="max-w-7xl mx-auto px-4 pb-16">
          <div className="flex items-center justify-center gap-2 overflow-hidden">
            {/* Sol Resim - Yarısı Görünen */}
            <div className="flex-shrink-0 w-32 md:w-48">
              <Image
                src="/hakkimizda/solresim.png"
                alt="Trendruum Ofis - Sol"
                width={600}
                height={800}
                className="w-full h-48 md:h-64 object-cover rounded-lg cursor-pointer"
                quality={95}
              />
            </div>
            
            {/* Orta Resim - Ana Büyük Resim */}
            <div className="flex-shrink-0 w-80 md:w-96 lg:w-[500px]">
              <Image
                src="/hakkimizda/ortaresim.png"
                alt="Trendruum Ofis - Ana"
                width={1200}
                height={900}
                className="w-full h-64 md:h-80 lg:h-96 object-cover rounded-lg shadow-lg"
                priority
                quality={95}
              />
            </div>
            
            {/* Sağ Resim - Yarısı Görünen */}
            <div className="flex-shrink-0 w-32 md:w-48">
              <Image
                src="/hakkimizda/sagresim.png"
                alt="Trendruum Ofis - Sağ"
                width={600}
                height={800}
                className="w-full h-48 md:h-64 object-cover rounded-lg cursor-pointer"
                quality={95}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
