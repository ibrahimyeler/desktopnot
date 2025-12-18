import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { Toaster } from 'react-hot-toast';

import { AuthProvider } from './context/AuthContext';
import { BasketProvider } from './context/BasketContext';
import { OrderProvider } from './context/OrderContext';
import { FavoriteProvider } from './context/FavoriteContext';
import { VisitedProductsProvider } from './context/VisitedProductsContext';
import Providers from './providers';
import ScrollToTop from '@/components/ui/ScrollToTop';
import MobileTabNavigator from '@/components/layout/MobileTabNavigator';
import MobileFooter from '@/components/layout/MobileFooter';
import Footer from '@/components/layout/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Trendruum - Online Alışveriş Sitesi',
  description: 'Trendruum\'da binlerce ürün arasından seçim yapın. En uygun fiyatlarla, hızlı kargo ile alışveriş yapın.',
  keywords: 'online alışveriş, e-ticaret, ürün, fiyat, kargo, trendruum',
  openGraph: {
    title: 'Trendruum - Online Alışveriş Sitesi',
    description: 'Trendruum\'da binlerce ürün arasından seçim yapın. En uygun fiyatlarla, hızlı kargo ile alışveriş yapın.',
    url: 'https://www.trendruum.com',
    siteName: 'Trendruum',
    images: [
      {
        url: 'https://www.trendruum.com/og-default.svg',
        width: 1200,
        height: 630,
        alt: 'Trendruum - Online Alışveriş Sitesi',
      }
    ],
    locale: 'tr_TR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Trendruum - Online Alışveriş Sitesi',
    description: 'Trendruum\'da binlerce ürün arasından seçim yapın. En uygun fiyatlarla, hızlı kargo ile alışveriş yapın.',
    images: ['https://www.trendruum.com/og-default.svg'],
  },
  other: {
    'google-site-verification': 'zvdwRqD1kav6MKfAUXUatv3DSFKrycqOxeoZgkjZwHI',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className="scroll-smooth">
      <head>
        <meta name="facebook-domain-verification" content="qu7du5dp15uqtha1z5mnc39dbvxmd0" />
        {/* Google Tag Manager */}
        <Script
          id="google-tag-manager"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start': 
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0], 
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src= 
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f); 
              })(window,document,'script','dataLayer','GTM-NSKL6L56');
            `,
          }}
        />
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-17509047450"
          strategy="afterInteractive"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'AW-17509047450');
            `,
          }}
        />
        {/* Facebook Pixel */}
        <Script
          id="facebook-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '1336264368068378');
              fbq('track', 'PageView');
              
              // Facebook Access Token for Conversions API
              window.FACEBOOK_ACCESS_TOKEN = 'EAANCZCDdCEjwBPdVIC3zcOVnfDacsbprqvYmZANniOGBkVkCQOzJ8lqxBDwIqcqm1ghcBQzLuHIXBf2jpSBI4hw9mNjj5krdWxz3MJFHPwNcsyh2S46bJw84U1n5Vm55Sc3yNkBuj8NagzlFs2E5r5q3aHdGRTaXwOpijRjRaZCq8sNWZAZAzKlnZCiRbkAQZDZD';
            `,
          }}
        />
        {/* Global Error Handler - Türkçe Hata Mesajları */}
        <Script
          id="global-error-handler"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // React Hot Toast'u import et (zaten yüklü olacak)
                const showErrorToast = (message) => {
                  if (typeof window !== 'undefined' && window.dispatchEvent) {
                    const event = new CustomEvent('show-toast-error', { detail: { message } });
                    window.dispatchEvent(event);
                  }
                };
                
                // Window error handler
                window.addEventListener('error', function(event) {
                  const errorMessage = event.message || '';
                  
                  // "Attempt to read property" hatalarını yakala
                  if (errorMessage.includes('Cannot read property') || 
                      errorMessage.includes('Attempt to read property') ||
                      (errorMessage.includes('price') && errorMessage.includes('null'))) {
                    event.preventDefault();
                    showErrorToast('Ürün fiyat bilgisi alınamadı. Lütfen sayfayı yenileyin.');
                    return false;
                  }
                }, true);
                
                // Unhandled promise rejection handler
                window.addEventListener('unhandledrejection', function(event) {
                  const error = event.reason;
                  const errorMessage = error?.message || String(error) || '';
                  
                  // "Attempt to read property" hatalarını yakala
                  if (errorMessage.includes('Cannot read property') || 
                      errorMessage.includes('Attempt to read property') ||
                      (errorMessage.includes('price') && errorMessage.includes('null'))) {
                    event.preventDefault();
                    showErrorToast('Ürün fiyat bilgisi alınamadı. Lütfen sayfayı yenileyin.');
                    return false;
                  }
                });
              })();
            `,
          }}
        />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=1336264368068378&ev=PageView&noscript=1"
          />
        </noscript>
      </head>
      <body className={`${inter.className} bg-white min-h-screen m-0 p-0 flex flex-col`}>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-NSKL6L56"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        <Providers>
          <AuthProvider>
            <VisitedProductsProvider>
              <BasketProvider>
                <OrderProvider>
                  <FavoriteProvider>
                    <div className="flex-1 flex flex-col">
                      {children}
                    </div>
                    <ScrollToTop />
                    <Toaster position="top-right" />
                    <Footer />
                    <MobileFooter />
                    <MobileTabNavigator />
                  </FavoriteProvider>
                </OrderProvider>
              </BasketProvider>
            </VisitedProductsProvider>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}