"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import SuccessNotification from "@/components/ui/SuccessNotification";
import { useBasket } from "@/app/context/BasketContext";
import { useAuth } from "@/app/context/AuthContext";
import { useCartCampaigns } from "@/app/hooks/useCartCampaigns";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { API_V1_URL } from "@/lib/config";
import { orderService } from "@/app/services/orderService";
import DistanceSalesAgreementModal from "@/components/common/DistanceSalesAgreementModal";

interface Basket {
  id: string;
  user_id?: string;
  basket_groups: Array<{
    id: string;
    seller_id: string;
    seller_name: string;
    basket_group_items: Array<{
      id: string;
      product_id: string;
      quantity: number;
      price: number;
      product: {
        id: string;
        name: string;
        slug: string;
        price: number;
        original_price?: number;
        campaign_price?: number;
        discount_percentage?: number;
        images: Array<{
          url: string;
          name: string;
          id: string;
        }>;
        brand?: {
          id: string;
          name: string;
          slug: string;
        };
        seller?: {
          id: string;
          name: string;
          slug: string;
        };
      };
    }>;
  }>;
  total_price: number;
  total_items: number;
}

interface OrderSummaryProps {
  showPaymentButton?: boolean;
  onContinue?: () => void;
  hasAddress?: boolean;
  selectedAddressId?: string;
  onAddressSelect?: (addressId: string) => void;
  selectedInstallment?: {
    count: number;
    rate: number;
  } | null;
  cardType?: string;
  cardInfo?: {
    cardNumber: string;
    cardOwner: string;
    expiryMonth: string;
    expiryYear: string;
    cvv: string;
    secure3d: boolean;
    isValid?: boolean;
  };
  initialBasket?: Basket | null;
}

export default function OrderSummary({ 
  showPaymentButton = false,
  onContinue,
  hasAddress = false,
  selectedAddressId,
  onAddressSelect,
  selectedInstallment = null,
  cardType = '',
  cardInfo,
  initialBasket
}: OrderSummaryProps) {
  const router = useRouter();
  const { basket, guestId } = useBasket();
  const { isLoggedIn } = useAuth();
  const currentBasket = basket || initialBasket;
  const cartItems = currentBasket?.basket_groups?.flatMap(group => group.basket_group_items || []) || [];
  const cartTotal = currentBasket?.total_price || 0;
  const { cartCampaigns, totalCampaignSavings } = useCartCampaigns(cartItems);
  const [isLoading, setIsLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showAgreementModal, setShowAgreementModal] = useState(false);
  const [paytrForm, setPaytrForm] = useState<{ post_url: string, inputs: Record<string, string> } | null>(null);
  const [sellerInfo, setSellerInfo] = useState<any>(null);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const paytrFormRef = useRef<HTMLFormElement>(null);
  const submitted = useRef(false);

  // Eğer cartTotal hook'tan doğru gelmiyorsa, manuel hesaplama yapalım
  interface CartItem {
    price?: number;
    quantity?: number;
  }

  const calculatedTotal = cartItems.reduce((sum: number, item: CartItem) => 
    sum + ((item.price || 0) * (item.quantity || 1)), 0);
  
  // Hangisi dolu ise onu kullanalım
  const effectiveCartTotal = cartTotal > 0 ? cartTotal : calculatedTotal;

  // Dinamik hesaplamalar
  const totalQuantity = cartItems.reduce((sum: number, item: CartItem) => sum + (item.quantity || 1), 0);
  
  // Kargo ücreti hesaplama - her satıcı için ayrı hesaplama
  const shippingCost = useMemo(() => {

    if (!basket?.basket_groups) {
      return 0;
    }
    
    let totalShippingFee = 0;
    
    basket.basket_groups.forEach((group, index) => {
      // Bu satıcının toplam tutarını hesapla
      const groupTotal = group.basket_group_items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      
      // Eğer satıcının toplam tutarı 400 TL altındaysa kargo ücreti ekle
      if (groupTotal < 400) {
        totalShippingFee += 125;
      } else {
      }
    });
    
    return totalShippingFee;
  }, [basket?.basket_groups]);
  
  // Kampanya indirimi uygulanmış toplam - güvenlik kontrolü ile
  const safeCampaignSavings = typeof totalCampaignSavings === 'number' ? totalCampaignSavings : 0;
  const cartTotalWithCampaigns = effectiveCartTotal - safeCampaignSavings;
  
  // 2. Taksitli toplamı hesapla (kampanya indirimi uygulanmış toplam üzerinden)
  let taksitliTotal = cartTotalWithCampaigns;
  if (selectedInstallment && selectedInstallment.count > 1) {
    taksitliTotal = cartTotalWithCampaigns + (cartTotalWithCampaigns * selectedInstallment.rate / 100);
  }
  // Kargo ücretini de dahil et - güvenlik kontrolü ile
  const finalTotal = Number(taksitliTotal) + Number(shippingCost);
  
  // Debug: Final total hesaplaması
 
  const totalSold = cartItems.reduce((sum: number, item: CartItem) => sum + ((item.quantity || 1) * 15), 0);

  useEffect(() => {
                      if (paytrForm && paytrFormRef.current && !submitted.current) {
                    // Debug: PayTR'ye gönderilen tüm form verilerini kontrol et
               
                
                    // Form verilerini kontrol et
                    const formData = new FormData(paytrFormRef.current);
                    for (let [key, value] of formData.entries()) {
                    }
                    
                    // Özellikle payment_amount ve user_basket alanlarını kontrol et
                    const paymentAmount = formData.get('payment_amount');
                    const userBasket = formData.get('user_basket');

                    

                    
                    submitted.current = true;
                    paytrFormRef.current.submit();
                  }
  }, [paytrForm, cardInfo, effectiveCartTotal, shippingCost, finalTotal]);

  // Modal açıldığında satıcı bilgilerini çek
  useEffect(() => {
    if (showAgreementModal && !sellerInfo) {
      fetchSellerInfo();
    }
  }, [showAgreementModal, sellerInfo]);

  // Modal açıldığında seçilen adres bilgilerini çek
  useEffect(() => {

    
    if (showAgreementModal && selectedAddressId && !selectedAddress && (isLoggedIn || guestId)) {
      fetchSelectedAddress();
    }
  }, [showAgreementModal, selectedAddressId, selectedAddress, isLoggedIn, guestId]);

  // Modal açıldığında kullanıcı profil bilgilerini çek
  useEffect(() => {
 
    
    if (showAgreementModal && isLoggedIn && !userProfile) {
      fetchUserProfile();
    }
  }, [showAgreementModal, isLoggedIn, userProfile]);

  const formatPrice = (price: number) => {
    return price.toLocaleString('tr-TR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const fetchSellerInfo = async () => {
    try {
      // Sepetteki ilk grup'tan satıcı ID'sini al
      const firstGroup = basket?.basket_groups?.[0];
      if (!firstGroup?.seller?.id) {
        return;
      }

      const sellerId = firstGroup.seller.id;
      const response = await fetch(`${API_V1_URL}/sellers/${sellerId}/info`);
      
      if (response.ok) {
        const data = await response.json();
        setSellerInfo(data.data);
      } else {
      }
    } catch (error) {
    }
  };

  const fetchSelectedAddress = async () => {
    try {
      if (!selectedAddressId) {
        return;
      }

      if (isLoggedIn) {
        // Customer için adres çek
        const token = localStorage.getItem('token');
        if (!token) {
          return;
        }

        const response = await fetch(`/api/proxy/customer/addresses/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          const addresses = data.data || [];
          const address = addresses.find((addr: any) => addr.id === selectedAddressId);
          
          if (address) {
            setSelectedAddress(address);
          } else {

          }
        } else {
        }
      } else if (guestId) {
        // Guest için adres çek
        const response = await fetch(`/api/proxy/addresses/${selectedAddressId}`, {
          headers: {
            'Guest-ID': guestId
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setSelectedAddress(data.data);
        } else {
        }
      }
    } catch (error) {
    }
  };

  const fetchUserProfile = async () => {
    try {
      if (!isLoggedIn) {
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        return;
      }

      const response = await fetch(`/api/proxy/customer/profile/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUserProfile(data.data);
      } else {
      }
    } catch (error) {
    }
  };

  const handleContinue = async () => {
    if (!termsAccepted) {
      toast.error("Lütfen sözleşmeleri kabul edin");
      return;
    }

    if (!selectedAddressId) {
      toast.error("Lütfen bir teslimat adresi seçin");
      return;
    }

    // Kart bilgileri validasyonu
    if (showPaymentButton && cardInfo) {
      // Eğer isValid bilgisi varsa onu kullan, yoksa manuel kontrol yap
      if (cardInfo.isValid === false) {
        toast.error("Lütfen tüm kart bilgilerini doğru şekilde doldurun");
        return;
      }
      
      // isValid yoksa manuel kontrol yap
      if (cardInfo.isValid === undefined) {
        const { cardNumber, cardOwner, expiryMonth, expiryYear, cvv } = cardInfo;
        
        // Kart sahibi adı kontrolü
        if (!cardOwner || cardOwner.trim().length < 2) {
          toast.error("Lütfen geçerli bir kart sahibi adı girin");
          return;
        }
        
        // Kart numarası kontrolü (16 haneli olmalı)
        const cardNumberClean = cardNumber.replace(/\s/g, '');
        if (!cardNumberClean || cardNumberClean.length !== 16) {
          toast.error("Lütfen 16 haneli kart numarasını girin");
          return;
        }
        
        // Son kullanma tarihi kontrolü
        if (!expiryMonth || !expiryYear) {
          toast.error("Lütfen son kullanma tarihini seçin");
          return;
        }
        
        // CVV kontrolü (3 haneli olmalı)
        if (!cvv || cvv.length !== 3) {
          toast.error("Lütfen 3 haneli CVV kodunu girin");
          return;
        }
        
        // Son kullanma tarihi geçerlilik kontrolü
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1;
        const selectedYear = parseInt(expiryYear);
        const selectedMonth = parseInt(expiryMonth);
        
        if (selectedYear < currentYear || 
            (selectedYear === currentYear && selectedMonth < currentMonth)) {
          toast.error("Geçersiz son kullanma tarihi");
          return;
        }
      }
    }

    setIsLoading(true);
    try {
      if (showPaymentButton) {
        // Debug: Token ve login durumunu kontrol et
        const token = localStorage.getItem('token');
   
        // Customer kontrolü - token var mı kontrol et
        const isCustomer = isLoggedIn && token;
        
        if (isCustomer) {
          // Customer için sipariş oluştur
          const basketId = basket?.id || currentBasket?.id;
          if (!basketId) {
    
            toast.error("Sepet bilgileri bulunamadı. Lütfen sepetinize ürün ekleyin veya sayfayı yenileyin.");
            setIsLoading(false);
            return;
          }

          // finalTotal'ın sayı olduğundan emin ol
          const safeFinalTotal = typeof finalTotal === 'number' && !isNaN(finalTotal) ? finalTotal : 0;
          
          const requestBody = {
            basket_id: basketId,
            address_id: selectedAddressId,
            payment: {
              card_type: cardType || "credit_card",
              total_amount: safeFinalTotal
            }
          };
         
      
        
          
          const orderResponse = await fetch(`${API_V1_URL}/customer/orders`, {            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(requestBody)
          });

          const responseData = await orderResponse.json();

          if (!orderResponse.ok) {
            toast.error(responseData.meta?.message || responseData.message || 'Sipariş oluşturulamadı');
            setIsLoading(false);
            return;
          }

          // PayTR yönlendirme kontrolü
          if (responseData?.data?.payment?.post_url && responseData?.data?.payment?.inputs) {

            
            setPaytrForm({
              post_url: responseData.data.payment.post_url,
              inputs: responseData.data.payment.inputs
            });
            setIsLoading(false);
            return;
          }

          // PayTR yönlendirmesi yoksa başarılı say
          setShowSuccess(true);
          setTimeout(() => {
            router.push('/');
          }, 5000);
        } else {
          // Guest için sipariş oluştur
          const safeFinalTotal = typeof finalTotal === 'number' && !isNaN(finalTotal) ? finalTotal : 0;
          
          const payment = {
            instalment: selectedInstallment?.count?.toString() || "1",
            card_type: cardType || "bonus",
            total_amount: safeFinalTotal
          };
       
     
      
     
        
          
          const result = await orderService.createGuestOrder(selectedAddressId, guestId, payment);
          
          if (result.meta?.status === "success") {
            // PayTR yönlendirme kontrolü
            if (result.data?.payment?.post_url && result.data?.payment?.inputs) {
      
              
              setPaytrForm({
                post_url: result.data.payment.post_url,
                inputs: result.data.payment.inputs
              });
              setIsLoading(false);
              return;
            }
            
            setShowSuccess(true);
            setTimeout(() => {
              router.push('/');
            }, 5000);
          } else {
            toast.error(result.meta?.message || "Sipariş oluşturulamadı");
          }
        }
      } else if (onContinue) {
        await onContinue();
      }
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('Oturum süreniz dolmuş')) {
          toast.error('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
          localStorage.removeItem('token');
          router.push('/giris');
          return;
        }
        toast.error(error.message);
      } else {
        toast.error('İşlem sırasında bir hata oluştu');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const isButtonEnabled = !isLoading && termsAccepted && cartItems.length > 0 && (showPaymentButton ? (hasAddress && selectedAddressId) : true);

  // Prepare data for the agreement modal
  const getSellerInfo = () => {
    if (sellerInfo) {
      return {
        name: sellerInfo.name || "Sipariş sırasında belirtilecek",
        address: sellerInfo.address || "Sipariş sırasında belirtilecek",
        phone: sellerInfo.phone || "Sipariş sırasında belirtilecek",
        taxNumber: sellerInfo.tax_number || "Sipariş sırasında belirtilecek",
        email: sellerInfo.email || "Sipariş sırasında belirtilecek"
      };
    }
    
    // Fallback to basket seller info
    const firstGroup = basket?.basket_groups?.[0];
    if (firstGroup?.seller) {
      return {
        name: firstGroup.seller.name || "Sipariş sırasında belirtilecek",
        address: "Sipariş sırasında belirtilecek",
        phone: "Sipariş sırasında belirtilecek",
        taxNumber: "Sipariş sırasında belirtilecek",
        email: "Sipariş sırasında belirtilecek"
      };
    }

    return {
      name: "Sipariş sırasında belirtilecek",
      address: "Sipariş sırasında belirtilecek",
      phone: "Sipariş sırasında belirtilecek",
      taxNumber: "Sipariş sırasında belirtilecek",
      email: "Sipariş sırasında belirtilecek"
    };
  };

  const getCustomerInfo = () => {
  
    
    if (selectedAddress) {
      let name = "Sipariş sırasında belirtilecek";
      let address = "Sipariş sırasında belirtilecek";
      let email = "Sipariş sırasında belirtilecek";

      if (isLoggedIn) {
        // Customer adresi
        const fullName = [selectedAddress.first_name, selectedAddress.last_name].filter(Boolean).join(' ');
        name = fullName || selectedAddress.title || "Sipariş sırasında belirtilecek";
        address = selectedAddress.address || "Sipariş sırasında belirtilecek";
        email = userProfile?.email || "Sipariş sırasında belirtilecek";
      } else {
        // Guest adresi
        const fullName = [selectedAddress.firstname, selectedAddress.lastname].filter(Boolean).join(' ');
        name = fullName || "Sipariş sırasında belirtilecek";
        
        if (selectedAddress.address) {
          const addressParts = [
            selectedAddress.address.description,
            selectedAddress.address.district?.name,
            selectedAddress.address.city?.name
          ].filter(Boolean);
          address = addressParts.join(', ') || "Sipariş sırasında belirtilecek";
        }
        
        // Guest için email genellikle başka yerden gelir
        email = "Sipariş sırasında belirtilecek";
      }
      
      return { name, address, email };
    }

    return {
      name: userProfile?.first_name && userProfile?.last_name ? 
             `${userProfile.first_name} ${userProfile.last_name}` : 
             "Sipariş sırasında belirtilecek",
      address: "Sipariş sırasında belirtilecek",
      email: userProfile?.email || "Sipariş sırasında belirtilecek"
    };
  };

  const getProductInfo = () => {
    if (cartItems.length === 0) return {};
    
    const firstItem = cartItems[0];
    return {
      name: firstItem.product?.name || "Ürün",
      price: firstItem.price || 0,
      quantity: firstItem.quantity || 1
    };
  };

  const getOrderInfo = () => {
    return {
      subtotal: effectiveCartTotal,
      shippingCost: shippingCost,
      total: finalTotal,
      paymentMethod: cardType || "Kredi Kartı"
    };
  };

  return (
    <>
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-2xl max-w-md w-full mx-4 p-6 text-center animate-fade-in">
            <div className="bg-green-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <CheckCircleIcon className="w-12 h-12 text-green-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Siparişiniz Başarıyla Oluşturuldu!
            </h3>
            <p className="text-gray-500 mb-6">
              Siparişiniz başarıyla oluşturuldu. Anasayfaya yönlendiriliyorsunuz...
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => router.push('/hesabim/siparislerim')}
                className="w-full bg-orange-500 text-white px-6 py-2.5 rounded-lg font-medium text-sm hover:bg-orange-600 transition-colors"
              >
                Geçmiş Siparişlerim
              </button>
              <button
                onClick={() => router.push('/')}
                className="w-full border border-gray-200 text-gray-600 px-6 py-2.5 rounded-lg font-medium text-sm hover:bg-gray-50 transition-colors"
              >
                Anasayfaya Dön
              </button>
            </div>
          </div>
        </div>
      )}

      <div>
        {/* PAYTR Otomatik Form */}
        {paytrForm && (
          <form
            ref={paytrFormRef}
            action={paytrForm.post_url}
            method="POST"
            style={{ display: "none" }}
          >
            {/* Backend'den gelen PayTR verileri */}
            {Object.entries(paytrForm.inputs).map(([key, value]) => (
              <input key={key} type="hidden" name={key} value={value} />
            ))}
            
            {/* Kullanıcının girdiği kart bilgileri */}
            {cardInfo && (
              <>
                <input type="hidden" name="cc_owner" value={cardInfo.cardOwner} />
                <input type="hidden" name="card_number" value={cardInfo.cardNumber.replace(/\s/g, '')} />
                <input type="hidden" name="expiry_month" value={cardInfo.expiryMonth} />
                <input type="hidden" name="expiry_year" value={cardInfo.expiryYear} />
                <input type="hidden" name="cvv" value={cardInfo.cvv} />
                <input type="hidden" name="non_3d" value={cardInfo.secure3d ? "0" : "1"} />
              </>
            )}
            

          </form>
        )}

        {/* Sipariş Özeti */}
        <div className="rounded-md border p-3 sm:p-4 w-full shadow-sm bg-white">
          <h1 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">Sipariş Özeti</h1>
          
          {/* Kampanya Özeti */}
          {cartCampaigns.length > 0 && (() => {
            const hasPercentageDiscount = cartCampaigns.some(c => c.campaign.type === 'percentage_discount');
            const hasNthProductDiscount = cartCampaigns.some(c => c.campaign.type === 'nth_product_discount');
            const hasPriceDiscount = cartCampaigns.some(c => c.campaign.type === 'price_discount');
            const hasBuyXPayY = cartCampaigns.some(c => c.campaign.type === 'buy_x_pay_y');
            
            return (
              <div className={`mb-3 p-2 border rounded-lg ${
                hasPercentageDiscount 
                  ? 'bg-gradient-to-r from-red-50 to-pink-50 border-red-200' 
                  : hasNthProductDiscount
                    ? 'bg-gradient-to-r from-purple-50 to-violet-50 border-purple-200'
                    : hasPriceDiscount
                      ? 'bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200'
                      : 'bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <svg className={`w-4 h-4 ${
                    hasPercentageDiscount ? 'text-red-600' : hasNthProductDiscount ? 'text-purple-600' : hasPriceDiscount ? 'text-blue-600' : 'text-emerald-600'
                  }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  <h3 className={`text-xs font-semibold ${
                    hasPercentageDiscount ? 'text-red-800' : hasNthProductDiscount ? 'text-purple-800' : hasPriceDiscount ? 'text-blue-800' : 'text-emerald-800'
                  }`}>Aktif Kampanyalar</h3>
                </div>
                <div className="space-y-1">
                  {cartCampaigns.map((campaignInfo: any, index: number) => (
                    <div key={index} className="flex items-center justify-between text-xs">
                      <span className={`${
                        campaignInfo.campaign.type === 'percentage_discount'
                          ? 'text-red-700'
                          : campaignInfo.campaign.type === 'nth_product_discount'
                            ? 'text-purple-700'
                            : campaignInfo.campaign.type === 'price_discount'
                              ? 'text-blue-700'
                              : 'text-emerald-700'
                      }`}>
                        {campaignInfo.campaign.type === 'percentage_discount'
                          ? `%${campaignInfo.discountPercentage || 0} İndirim`
                          : campaignInfo.campaign.type === 'nth_product_discount'
                            ? `${campaignInfo.campaign.campaign_settings?.nth_product}. Ürün %${campaignInfo.campaign.campaign_settings?.nth_discount_percentage} İndirim`
                            : campaignInfo.campaign.type === 'price_discount'
                              ? `${campaignInfo.campaign.campaign_settings?.discount_amount} TL İndirim`
                              : `${campaignInfo.campaign.campaign_settings?.buy_quantity} Al ${campaignInfo.campaign.campaign_settings?.pay_quantity} Öde`
                        }
                      </span>
                      <span className={`font-medium ${
                        campaignInfo.campaign.type === 'percentage_discount'
                          ? 'text-red-600'
                          : campaignInfo.campaign.type === 'nth_product_discount'
                            ? 'text-purple-600'
                            : campaignInfo.campaign.type === 'price_discount'
                              ? 'text-blue-600'
                              : 'text-emerald-600'
                      }`}>
                        -{formatPrice(campaignInfo.savings)} TL
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}

          <div className="space-y-2 text-xs sm:text-sm">
            <div className="flex justify-between text-gray-700">
              <span>Ürünlerin Toplamı ({totalQuantity} Ürün)</span>
              <span>{formatPrice(effectiveCartTotal)} TL</span>
            </div>

            {totalCampaignSavings > 0 && (
              <div className="flex justify-between text-sm bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 px-2 py-1 rounded-md border border-emerald-200">
                <div className="flex items-center gap-1">
                  <svg className="w-3 h-3 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  <span className="font-medium">Kampanya İndirimi</span>
                </div>
                <span className="font-bold text-emerald-700">-{formatPrice(totalCampaignSavings)} TL</span>
              </div>
            )}

            {/* Kargo Ücreti Detayları */}
            {basket?.basket_groups && basket.basket_groups.length > 0 && (
              <div className="space-y-1">
                {basket.basket_groups.map((group, index) => {
                  const groupTotal = group.basket_group_items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                  const groupShippingCost = groupTotal < 400 ? 125 : 0;
                  
                  return (
                    <div key={group.id} className="flex justify-between text-gray-700 text-xs">
                      <span>
                        {group.seller?.name || 'Bilinmeyen Satıcı'}
                        {groupShippingCost > 0 && (
                          <span className="text-gray-500 ml-1">({formatPrice(groupTotal)} TL)</span>
                        )}
                      </span>
                      <span className={groupShippingCost === 0 ? "text-green-600 font-medium" : ""}>
                        {groupShippingCost === 0 ? "Ücretsiz" : `${formatPrice(groupShippingCost)} TL`}
                      </span>
                    </div>
                  );
                })}
                
                {/* Toplam Kargo */}
                {shippingCost > 0 && (
                  <div className="flex justify-between text-gray-900 font-medium border-t pt-1 mt-1">
                    <span>Kargo Toplam</span>
                    <span>{formatPrice(shippingCost)} TL</span>
                  </div>
                )}
              </div>
            )}

            {selectedInstallment && selectedInstallment.count > 1 && (
              <div className="flex justify-between text-gray-700">
                <span>Taksit Oranı ({selectedInstallment.count} Taksit)</span>
                <span>+{formatPrice(cartTotalWithCampaigns * selectedInstallment.rate / 100)} TL</span>
              </div>
            )}

          </div>

          <div className="border-t my-3 sm:my-4" />

          <div className="flex justify-between items-center mb-3 sm:mb-4">
            <span className="font-medium text-sm sm:text-base">Toplam</span>
            <span className="text-base sm:text-lg font-bold text-orange-500">
              {formatPrice(finalTotal)} TL
            </span>
          </div>

          {cartItems.length > 0 && (
            <p className="text-[10px] sm:text-xs text-gray-600 mb-3 sm:mb-4">
              Sepetindeki ürünler son{" "}
              <span className="text-orange-500 font-medium">3 günde {totalSold}+</span> adet satıldı!
            </p>
          )}

          <button
            onClick={handleContinue}
            disabled={!isButtonEnabled}
            className={`w-full py-2.5 sm:py-3 rounded-md text-white font-medium transition-colors text-sm sm:text-base ${
              !isButtonEnabled
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-orange-500 hover:bg-orange-400"
            }`}
          >
            {isLoading ? "İşleniyor..." : showPaymentButton ? "Ödemeyi Tamamla" : "Kaydet ve Devam Et"}
          </button>
        </div>

        <div className="rounded-md border p-3 sm:p-4 mt-3 sm:mt-4 flex items-start gap-2 sm:gap-3 bg-white">
          <input
            type="checkbox"
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
            className="mt-1 h-4 w-4 accent-orange-500 cursor-pointer"
          />
          <p className="text-[10px] sm:text-xs text-gray-600">
            <Link href="/s/on-bilgilendirme-kosullari" target="_blank" className="font-semibold underline text-black hover:text-orange-500">
              Ön Bilgilendirme Koşulları
            </Link>
            {" "}nı ve{" "}
            <button
              type="button"
              onClick={() => setShowAgreementModal(true)}
              className="font-semibold underline text-black hover:text-orange-500"
            >
              Mesafeli Satış Sözleşmesi
            </button>
            {" "}ni okudum, onaylıyorum.
          </p>
        </div>
      </div>

      {/* Distance Sales Agreement Modal */}
      <DistanceSalesAgreementModal
        isOpen={showAgreementModal}
        onClose={() => setShowAgreementModal(false)}
        onAccept={() => setTermsAccepted(true)}
        sellerInfo={getSellerInfo()}
        customerInfo={getCustomerInfo()}
        productInfo={getProductInfo()}
        orderInfo={getOrderInfo()}
      />
    </>
  );
}
