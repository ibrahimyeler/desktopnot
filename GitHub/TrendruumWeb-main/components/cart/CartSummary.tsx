"use client";

import { useState, useMemo, useCallback, memo } from "react";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useAuth } from "@/app/context/AuthContext";
import { useBasket } from "@/app/context/BasketContext";
import { useCartCampaigns } from "@/app/hooks/useCartCampaigns";
import AddressPopup from "./AddressPopup";
import DiscountCodeInput from "./DiscountCodeInput";
import toast from "react-hot-toast";

interface CartSummaryProps {
  appliedDiscountCode: string | null;
  discountAmount: number;
  discountCodeLoading: boolean;
  onApplyDiscountCode: (code: string) => Promise<boolean>;
  onRemoveDiscountCode: () => Promise<void | boolean> | void;
  variant?: "default" | "compact";
}

const CartSummary = memo(({
  appliedDiscountCode,
  discountAmount,
  discountCodeLoading,
  onApplyDiscountCode,
  onRemoveDiscountCode,
  variant = "default",
}: CartSummaryProps) => {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const {
    basket,
    totalPrice,
    shippingFee,
    loading,
    isGuestBasket,
  } = useBasket();
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showAddressPopup, setShowAddressPopup] = useState(false);
  
  // Sepet boş mu kontrolü - Guest basket için doğru kontrol
  const allItems = useMemo(() => 
    basket?.basket_groups?.flatMap(group => group.basket_group_items) || [], 
    [basket?.basket_groups]
  );
  
  const { cartCampaigns, totalCampaignSavings } = useCartCampaigns(allItems);
  
  // 400 TL ve üzeri için kargo bedava - artık her satıcı için ayrı hesaplama yapıyoruz
  const freeShippingThreshold = 400;
  
  // Kargo ücreti hesaplama - her satıcı için ayrı hesaplama
  const finalShippingFee = useMemo(() => {
    if (!basket?.basket_groups) return 0;
    
    let totalShippingFee = 0;
    
    try {
    basket.basket_groups.forEach(group => {
      // Bu satıcının toplam tutarını hesapla
        const groupTotal = group.basket_group_items.reduce((sum, item) => {
          try {
            if (!item || item.price === null || item.price === undefined || item.quantity === null || item.quantity === undefined) {
              return sum;
            }
            return sum + ((item.price || 0) * (item.quantity || 0));
          } catch (error) {
            return sum;
          }
        }, 0);
      
      
      // Eğer satıcının toplam tutarı 400 TL altındaysa kargo ücreti ekle
      if (groupTotal < 400) {
        totalShippingFee += 125;
      }
    });
    } catch (error) {
      toast.error('Kargo ücreti hesaplanırken bir hata oluştu. Lütfen sayfayı yenileyin.');
    }
    
    return totalShippingFee;
  }, [basket?.basket_groups]);
  
  const totalWithExtras = useMemo(() => 
    (totalPrice || 0) + finalShippingFee - (totalCampaignSavings || 0) - (discountAmount || 0), 
    [totalPrice, finalShippingFee, totalCampaignSavings, discountAmount]
  );
  const isCartEmpty = useMemo(() => 
    !basket?.basket_groups || basket.basket_groups.length === 0 || allItems.length === 0,
    [basket?.basket_groups, allItems.length]
  );

  if (isCartEmpty) {
    return (
      <div className="sticky top-4 bg-[#FFF8F3] border border-[#FFE0C2] rounded-lg p-4 sm:p-5 w-full sm:w-80 flex items-center justify-center min-h-[120px]">
        <span className="text-[#F27A1A] text-sm font-medium">Sepetinizde ürün bulunmamaktadır.</span>
      </div>
    );
  }

  const formatPrice = useCallback((price: number | undefined | null) => {
    if (price === undefined || price === null || isNaN(price)) return '0,00';
    return price.toLocaleString('tr-TR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }, []);


  
  const handleCheckoutClick = useCallback(() => {
    if (isCartEmpty) {
      return; // Boş sepet durumunda hiçbir şey yapma
    }

    // Tüm kullanıcılar için ödeme sayfasına yönlendir
      router.push('/sepetim/odeme');
  }, [isCartEmpty, router]);

  const handleAddressSubmit = useCallback(() => {
    setShowAddressPopup(false);
    router.push('/sepetim/odeme');
  }, [router]);

  const compactView = (
    <div className="flex items-center justify-between gap-3">
      <div className="flex flex-col">
        <span className="text-sm text-gray-600">Toplam</span>
        <span className="text-lg font-bold text-[#F27A1A]">{formatPrice(totalWithExtras)} TL</span>
      </div>
      <button
        onClick={handleCheckoutClick}
        disabled={loading || isCartEmpty}
        className={`flex-1 py-3 rounded-2xl text-sm font-semibold text-white transition-colors ${
          loading || isCartEmpty
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-[#F27A1A] hover:bg-[#F27A1A]/90"
        }`}
      >
        {loading ? "İşleniyor..." : isCartEmpty ? "Sepet Boş" : "Sepeti Onayla"}
      </button>
    </div>
  );

  if (variant === "compact") {
    return compactView;
    }

  return (
    <>
      {/* Desktop görünüm - tam CartSummary */}
      <div className="hidden lg:block sticky top-4 bg-[#FFF8F3] border border-[#FFE0C2] rounded-lg p-4 sm:p-5 w-full sm:w-80">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Sipariş Özeti</h2>

        {/* Guest Basket Uyarısı */}
        {isGuestBasket && (
          <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-md">
            <div className="flex items-center text-orange-700 text-sm">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <span>Misafir sepeti kullanılıyor</span>
            </div>
            <p className="text-orange-600 text-xs mt-1">
              Giriş yaparak sepetinizi kalıcı hale getirin
            </p>
          </div>
        )}

        {isCartEmpty ? (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m6 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
              </svg>
            </div>
            <p className="text-gray-500 mb-4">Sepetinizde ürün bulunmamaktadır</p>
            <Link 
              href="/"
              className="inline-block bg-orange-500 text-white px-6 py-2 rounded-md hover:bg-orange-600 transition-colors"
            >
              Alışverişe Başla
            </Link>
          </div>
        ) : (
          <>

            {/* Kampanya Özeti */}
            {cartCampaigns.length > 0 && (() => {
              const hasPercentageDiscount = cartCampaigns.some(c => c.campaign.type === 'percentage_discount');
              const hasNthProductDiscount = cartCampaigns.some(c => c.campaign.type === 'nth_product_discount');
        const hasPriceDiscount = cartCampaigns.some(c => c.campaign.type === 'price_discount');
              const hasBuyXPayY = cartCampaigns.some(c => c.campaign.type === 'buy_x_pay_y');
              
              return (
        <div className={`mb-4 p-3 border rounded-lg ${
          hasPercentageDiscount 
            ? 'bg-gradient-to-r from-red-50 to-pink-50 border-red-200' 
            : hasNthProductDiscount
              ? 'bg-gradient-to-r from-purple-50 to-violet-50 border-purple-200'
              : hasPriceDiscount
                ? 'bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200'
                : 'bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200'
        }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <svg className={`w-5 h-5 ${
                      hasPercentageDiscount ? 'text-red-600' : hasNthProductDiscount ? 'text-purple-600' : hasPriceDiscount ? 'text-blue-600' : 'text-emerald-600'
                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    <h3 className={`text-sm font-semibold ${
                      hasPercentageDiscount ? 'text-red-800' : hasNthProductDiscount ? 'text-purple-800' : hasPriceDiscount ? 'text-blue-800' : 'text-emerald-800'
                    }`}>Aktif Kampanyalar</h3>
                  </div>
                  <div className="space-y-1">
                    {cartCampaigns.map((campaignInfo: any, index: number) => {
                      const isPercentageDiscount = campaignInfo.campaign.type === 'percentage_discount';
                      const isNthProductDiscount = campaignInfo.campaign.type === 'nth_product_discount';
                      const isPriceDiscount = campaignInfo.campaign.type === 'price_discount';
                      return (
                        <div key={index} className="flex items-center justify-between text-xs">
                          <span className={isPercentageDiscount ? 'text-red-700' : isNthProductDiscount ? 'text-purple-700' : isPriceDiscount ? 'text-blue-700' : 'text-emerald-700'}>
                            {isPercentageDiscount 
                              ? `%${campaignInfo.discountPercentage || 0} İndirim`
                              : isNthProductDiscount
                                ? `${campaignInfo.campaign.campaign_settings?.nth_product}. Ürün %${campaignInfo.campaign.campaign_settings?.nth_discount_percentage} İndirim`
                                : isPriceDiscount
                                  ? `${campaignInfo.campaign.campaign_settings?.discount_amount} TL İndirim`
                                  : `${campaignInfo.campaign.campaign_settings?.buy_quantity} Al ${campaignInfo.campaign.campaign_settings?.pay_quantity} Öde`
                            }
                          </span>
                          <span className={`font-medium ${
                            isPercentageDiscount ? 'text-red-600' : isNthProductDiscount ? 'text-purple-600' : isPriceDiscount ? 'text-blue-600' : 'text-emerald-600'
                          }`}>
                            -{formatPrice(campaignInfo.savings)} TL
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-700">
                <span>Ürünün Toplamı</span>
                <span>{formatPrice(totalPrice)} TL</span>
              </div>

              <div className="flex justify-between text-sm text-gray-700">
                <span>
                  Kargo Toplam
                  {finalShippingFee > 0 && (() => {
                    if (!basket?.basket_groups) return null;
                    
                    const sellersWithShipping = basket.basket_groups.filter(group => {
                      const groupTotal = group.basket_group_items.reduce((sum, item) => {
                        try {
                          if (!item || item.price === null || item.price === undefined || item.quantity === null || item.quantity === undefined) {
                            return sum;
                          }
                          return sum + ((item.price || 0) * (item.quantity || 0));
                        } catch (error) {
                          return sum;
                        }
                      }, 0);
                      return groupTotal < 400;
                    }).length;
                    
                    return sellersWithShipping > 1 ? (
                      <span className="text-xs text-gray-500 ml-1">
                        ({sellersWithShipping} satıcı)
                      </span>
                    ) : null;
                  })()}
                </span>
                <span className={finalShippingFee === 0 ? "text-green-600 font-medium" : ""}>
                  {finalShippingFee === 0 ? "Ücretsiz" : `${formatPrice(finalShippingFee)} TL`}
                </span>
              </div>

              {totalCampaignSavings > 0 && (() => {
                const hasPercentageDiscount = cartCampaigns.some(c => c.campaign.type === 'percentage_discount');
                const hasNthProductDiscount = cartCampaigns.some(c => c.campaign.type === 'nth_product_discount');
        const hasPriceDiscount = cartCampaigns.some(c => c.campaign.type === 'price_discount');
                const firstCampaign = cartCampaigns[0];
                const isFirstPercentageDiscount = firstCampaign?.campaign.type === 'percentage_discount';
                const isFirstNthProductDiscount = firstCampaign?.campaign.type === 'nth_product_discount';
        const isFirstPriceDiscount = firstCampaign?.campaign.type === 'price_discount';
                
                return (
                  <div className={`flex justify-between text-sm px-3 py-2 rounded-md border ${
                    hasPercentageDiscount 
                      ? 'bg-gradient-to-r from-red-100 to-pink-100 text-red-700 border-red-200' 
                      : hasNthProductDiscount
                        ? 'bg-gradient-to-r from-purple-100 to-violet-100 text-purple-700 border-purple-200'
                        : hasPriceDiscount
                          ? 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 border-blue-200'
                          : 'bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 border-emerald-200'
                  }`}>
                    <div className="flex items-center gap-2">
                      <svg className={`w-4 h-4 ${
                        hasPercentageDiscount ? 'text-red-600' : hasNthProductDiscount ? 'text-purple-600' : hasPriceDiscount ? 'text-blue-600' : 'text-emerald-600'
                      }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      <div className="flex flex-col">
                        <span className="font-medium text-xs">
                          {isFirstPercentageDiscount 
                            ? `%${firstCampaign?.discountPercentage || 0} İndirim`
                            : isFirstNthProductDiscount
                              ? `${firstCampaign?.campaign.campaign_settings?.nth_product}. Ürün %${firstCampaign?.campaign.campaign_settings?.nth_discount_percentage} İndirim`
                              : isFirstPriceDiscount
                                ? `${firstCampaign?.campaign.campaign_settings?.discount_amount} TL İndirim`
                                : `${firstCampaign?.campaign.campaign_settings?.buy_quantity} Al ${firstCampaign?.campaign.campaign_settings?.pay_quantity} Öde`
                          }
                        </span>
                        <span className={`text-xs ${
                          hasPercentageDiscount ? 'text-red-600' : hasNthProductDiscount ? 'text-purple-600' : hasPriceDiscount ? 'text-blue-600' : 'text-emerald-600'
                        }`}>Toplam İndirimi</span>
                      </div>
                    </div>
                    <span className={`font-bold text-xs whitespace-nowrap ${
                      hasPercentageDiscount ? 'text-red-700' : hasNthProductDiscount ? 'text-purple-700' : hasPriceDiscount ? 'text-blue-700' : 'text-emerald-700'
                    }`}>-{formatPrice(totalCampaignSavings)} TL</span>
                  </div>
                );
              })()}

              {discountAmount > 0 && (
                <div className="flex justify-between text-sm px-3 py-2 rounded-md border bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-700 border-yellow-200">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                    </svg>
                    <div className="flex flex-col">
                      <span className="font-medium text-xs">İndirim Kuponu</span>
                      <span className="text-xs text-yellow-600">{appliedDiscountCode}</span>
                    </div>
                  </div>
                  <span className="font-bold text-xs whitespace-nowrap text-yellow-700">-{formatPrice(discountAmount)} TL</span>
                </div>
              )}
            </div>

            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between text-lg font-bold text-gray-900">
                <span>Genel Toplam</span>
                <span className="text-[#F27A1A]">{formatPrice(totalWithExtras)} TL</span>
              </div>
            </div>


            {/* Popülerlik Bilgisi */}
            <div className="mt-3 flex items-center text-sm text-gray-800">
              <span className="text-lg">🚀</span>
              <span className="ml-2">
                Sepetindeki ürünler son <span className="text-[#F27A1A] font-semibold">3 günde 100+</span> adet satıldı!
              </span>
            </div>

            {/* İndirim Kodu Girişi */}
            <div className="hidden lg:block">
            <DiscountCodeInput
                onApplyCode={onApplyDiscountCode}
                onRemoveCode={onRemoveDiscountCode}
              appliedCode={appliedDiscountCode}
              isApplied={!!appliedDiscountCode}
              isLoading={discountCodeLoading}
            />
            </div>

            <button
              onClick={handleCheckoutClick}
              disabled={loading || isCartEmpty}
              className={`mt-4 w-full py-3 rounded-md transition-colors ${
                loading || isCartEmpty 
                  ? "bg-gray-400 cursor-not-allowed" 
                  : "bg-[#F27A1A] hover:bg-[#F27A1A]/90 text-white"
              }`}
            >
              {loading ? "İşleniyor..." : isCartEmpty ? "Sepet Boş" : "Sepeti Onayla"}
            </button>
          </>
        )}
      </div>

      {showLoginPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] pb-24 lg:pb-0">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-end">
              <button onClick={() => setShowLoginPopup(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="text-center mb-6">
              <h2 className="text-2xl font-medium mb-4 text-gray-900">Trendruum Hesabınız Yok Mu?</h2>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => {
                  setShowLoginPopup(false);
                  setShowAddressPopup(true);
                }}
                className="block w-full py-3 px-4 text-center border border-[#F27A1A] text-[#F27A1A] rounded-md hover:bg-[#F27A1A]/10 transition"
              >
                Üye Olmadan Devam Et
              </button>

              <Link
                href="/giris"
                className="block w-full py-3 px-4 text-center bg-[#F27A1A] text-white rounded-md hover:bg-[#F27A1A]/90 transition"
              >
                Giriş Yap / Üye Ol
              </Link>
            </div>
          </div>
        </div>
      )}

      {showAddressPopup && (
        <AddressPopup 
          onClose={() => setShowAddressPopup(false)} 
          onSubmit={handleAddressSubmit} 
          hideGuestSavedAddresses={true}
        />
      )}
    </>
  );
});

CartSummary.displayName = 'CartSummary';

export default CartSummary;