"use client";

import React from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const MobileFooter = () => {
  const pathname = usePathname();
  const isProductPage = pathname?.startsWith('/urunler/');
  const isLoginPage = pathname === '/giris';
  const isSignUpPage = pathname === '/kayit-ol';
  const isForgotPasswordPage = pathname === '/sifremi-unuttum';

  // Ürün detay sayfasında, giriş, kayıt ve şifremi unuttum sayfalarında mobil footer'ı gizle
  if (isProductPage || isLoginPage || isSignUpPage || isForgotPasswordPage) {
    return null;
  }

  return (
    <footer className="lg:hidden bg-white border-t border-gray-200 py-4 pb-20" data-component="mobile-footer">
      <div className="max-w-7xl mx-auto px-4">
        {/* Mobile Apps Section */}
        <div className="mb-4 pb-4 border-b border-gray-200">
          <div className="flex justify-center items-center gap-2 flex-wrap">
            <a 
              href="https://apps.apple.com/tr/app/trendruum-online-al%C4%B1%C5%9Fveri%C5%9F/id6458739916"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity cursor-pointer"
            >
              <Image src="/mobile/app-store.webp" alt="App Store" width={120} height={40} className="w-28 h-9" />
            </a>
            <a 
              href="https://play.google.com/store/apps/details?id=com.trendruum.mobile&hl=tr"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity cursor-pointer"
            >
              <Image src="/mobile/google-play.webp" alt="Google Play" width={120} height={40} className="w-28 h-9" />
            </a>
            <a 
              href="https://appgallery.huawei.com/app/trendruum"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity cursor-pointer"
            >
              <Image src="/mobile/app-gallery.webp" alt="App Gallery" width={120} height={40} className="w-28 h-9" />
            </a>
          </div>
        </div>

        <div className="flex justify-center items-center gap-3 sm:gap-4 overflow-x-auto pb-2">
          {/* Visa */}
          <Image 
            src="/visa.svg" 
            alt="Visa" 
            width={40} 
            height={26} 
            className="h-6 w-auto object-contain flex-shrink-0" 
          />
          
          {/* Mastercard */}
          <Image 
            src="/master-card.svg" 
            alt="Mastercard" 
            width={40} 
            height={26} 
            className="h-6 w-auto object-contain flex-shrink-0" 
          />
          
          {/* Troy */}
          <Image 
            src="/troy.svg" 
            alt="Troy" 
            width={40} 
            height={26} 
            className="h-6 w-auto object-contain flex-shrink-0" 
          />
          
          {/* Güvenli Alışveriş */}
          <Image 
            src="/guvenli-alisveris.svg" 
            alt="Güvenli Alışveriş" 
            width={40} 
            height={26} 
            className="h-6 w-auto object-contain flex-shrink-0" 
          />
          
          {/* TRGO */}
          <a 
            href="https://www.guvendamgasi.org.tr/view/uye/detay.php?Guid=94b194b3-47c9-11ee-99c6-48df373f4850"
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:opacity-80 transition-opacity cursor-pointer flex-shrink-0 flex items-center"
            title="Güven Damgası Bilgilerini Görüntüle"
          >
            <Image 
              src="/certificates/trgo.webp" 
              alt="TRGO" 
              width={60} 
              height={38} 
              className="h-10 w-auto object-contain" 
            />
          </a>
          
          {/* ETBİS */}
          <a 
            href="https://etbis.ticaret.gov.tr/tr/Home/SearchSiteResult?siteId=31f5d2c4-849f-40ce-95f3-300d5015c383"
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:opacity-80 transition-opacity cursor-pointer flex-shrink-0 flex items-center"
            title="ETBİS Kayıt Bilgilerini Görüntüle"
          >
            <Image 
              src="/certificates/etbis.jpg" 
              alt="ETBİS" 
              width={45} 
              height={26} 
              className="h-10 w-auto object-contain" 
            />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default React.memo(MobileFooter);

