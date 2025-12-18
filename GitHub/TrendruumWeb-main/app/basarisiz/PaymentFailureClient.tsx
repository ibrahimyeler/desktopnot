"use client";

import React, { useEffect, useState } from 'react';
import { XCircleIcon, HomeIcon, ShoppingBagIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ScrollToTop from '@/components/ui/ScrollToTop';
import { API_V1_URL } from '@/lib/config';

interface PaymentFailureClientProps {
  orderId: string | null;
  errorCode: string | null;
  errorMessage: string;
  initialOrderDetails: any;
}

export default function PaymentFailureClient({ 
  orderId, 
  errorCode,
  errorMessage,
  initialOrderDetails 
}: PaymentFailureClientProps) {
  const [orderDetails, setOrderDetails] = useState<any>(initialOrderDetails);
  const [loading, setLoading] = useState(!initialOrderDetails);
  const [processedErrorMessage, setProcessedErrorMessage] = useState(errorMessage);

  useEffect(() => {
    // URL'den sipariş bilgilerini al (fallback)
    const urlParams = new URLSearchParams(window.location.search);
    const urlOrderId = urlParams.get('merchant_oid');
    const urlErrorCode = urlParams.get('failed_reason_code');
    const urlErrorMessage = urlParams.get('failed_reason_msg');
    
    const finalOrderId = orderId || urlOrderId;
    
    // Process error message if not provided from server
    if (!errorMessage && (urlErrorMessage || urlErrorCode)) {
      if (urlErrorMessage) {
        setProcessedErrorMessage(decodeURIComponent(urlErrorMessage));
      } else if (urlErrorCode) {
        setProcessedErrorMessage(`Ödeme işlemi başarısız oldu. Hata kodu: ${urlErrorCode}`);
      }
    }
    
    if (finalOrderId && !initialOrderDetails) {
      // Sipariş detaylarını getir
      fetchOrderDetails(finalOrderId);
    } else if (!finalOrderId) {
      setLoading(false);
    }
  }, [orderId, errorMessage, initialOrderDetails]);

  const fetchOrderDetails = async (orderId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_V1_URL}/customer/orders/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setOrderDetails(data.data);
      }
    } catch (_error) {
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-orange-500"></div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-8 sm:py-12 lg:py-16 xl:py-20">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl border-2 border-gray-200 p-6 sm:p-8 lg:p-10 xl:p-12 text-center">
          {/* Hata İkonu */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
              <XCircleIcon className="w-12 h-12 text-red-600" />
            </div>
          </div>

          {/* Başlık */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 lg:mb-8">
            Ödeme İşlemi Başarısız
          </h1>
          
          <p className="text-base sm:text-lg lg:text-xl xl:text-2xl text-gray-600 mb-6 sm:mb-8 lg:mb-10">
            {processedErrorMessage}
          </p>

          {/* Uyarı Kutusu */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
            <div className="flex items-center gap-3">
              <ExclamationTriangleIcon className="w-6 h-6 text-yellow-600 flex-shrink-0" />
              <div className="text-left">
                <h3 className="text-sm sm:text-base font-medium text-yellow-800">Önemli Bilgi</h3>
                <p className="text-sm text-yellow-700 mt-1">
                  Siparişiniz oluşturuldu ancak ödeme işlemi tamamlanamadı. Sepetinizdeki ürünler korunmuştur.
                </p>
              </div>
            </div>
          </div>

          {/* Sipariş Bilgileri */}
          {orderDetails && (
            <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left">
              <h2 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-semibold text-gray-900 mb-3 sm:mb-4 lg:mb-6">Sipariş Bilgileri</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <span className="text-sm font-medium text-gray-500">Sipariş No:</span>
                  <p className="text-gray-900 font-medium">{orderDetails.id}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Toplam Tutar:</span>
                  <p className="text-gray-900 font-medium">
                    {orderDetails.total_price?.toLocaleString('tr-TR', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })} TL
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Durum:</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    Ödeme Başarısız
                  </span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Tarih:</span>
                  <p className="text-gray-900">
                    {new Date(orderDetails.created_at).toLocaleDateString('tr-TR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>

              {/* Ürünler */}
              {orderDetails.order_groups && orderDetails.order_groups[0]?.order_group_items && (
                <div className="mt-6">
                  <h3 className="text-base sm:text-lg lg:text-xl xl:text-2xl font-semibold text-gray-900 mb-2 sm:mb-3 lg:mb-4">Sipariş Edilen Ürünler</h3>
                  <div className="space-y-3">
                    {orderDetails.order_groups[0].order_group_items.map((item: any, index: number) => (
                      <div key={index} className="flex items-center gap-4 p-3 bg-white rounded-lg border">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0">
                          {item.product?.medias?.url && (
                            <img 
                              src={item.product.medias.url} 
                              alt={item.product.name}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{item.product?.name}</h4>
                          <p className="text-sm text-gray-500">
                            Adet: {item.quantity} × {item.price?.toLocaleString('tr-TR')} TL
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">
                            {(item.price * item.quantity).toLocaleString('tr-TR')} TL
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Kargo Bilgileri */}
              {orderDetails.shipping_cost !== undefined && (
                <div className="mt-4 p-4 bg-white rounded-lg border">
                  <h3 className="text-base sm:text-lg lg:text-xl xl:text-2xl font-semibold text-gray-900 mb-2 sm:mb-3 lg:mb-4">Kargo Bilgileri</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Kargo Ücreti:</span>
                      <span className="font-medium text-gray-900">
                        {orderDetails.shipping_cost > 0 
                          ? `${orderDetails.shipping_cost.toLocaleString('tr-TR')} TL` 
                          : "Ücretsiz"
                        }
                      </span>
                    </div>
                    {orderDetails.subtotal && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Ürün Toplamı:</span>
                        <span className="font-medium text-gray-900">
                          {orderDetails.subtotal.toLocaleString('tr-TR')} TL
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Butonlar */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/sepetim"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-orange-600 hover:bg-orange-700"
            >
              <ShoppingBagIcon className="w-5 h-5 mr-2" />
              Sepetime Dön
            </Link>
            
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50"
            >
              <HomeIcon className="w-5 h-5 mr-2" />
              Ana Sayfaya Dön
            </Link>
          </div>

          {/* Yardım Kutusu */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-sm sm:text-base lg:text-lg font-medium text-blue-900 mb-2">Yardıma mı ihtiyacınız var?</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Kart bilgilerinizi kontrol edin</li>
              <li>• Kart limitinizin yeterli olduğundan emin olun</li>
              <li>• 3D Secure işlemini tamamladığınızdan emin olun</li>
              <li>• Sorun devam ederse müşteri hizmetlerimizle iletişime geçin</li>
            </ul>
          </div>

          {/* İletişim Bilgileri */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm sm:text-base lg:text-lg font-medium text-gray-900 mb-2">Müşteri Hizmetleri</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p>📞 Telefon: 0501 742 62 50</p>
              <p>📧 E-posta: destek@trendruum.com</p>
              <p>🕒 Çalışma Saatleri: Hafta içi 09:00-18:00</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <ScrollToTop />
    </div>
  );
}
