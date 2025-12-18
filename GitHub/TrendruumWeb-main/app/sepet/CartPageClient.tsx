"use client";

import Header from "@/components/layout/Header";
import ScrollToTop from "@/components/ui/ScrollToTop";
import CartItemsList from "@/components/cart/CartItemsList";
import CartSummary from "@/components/cart/CartSummary";
import BestSellersList from "@/components/cart/BestSellersList";
import CartTabs from "@/components/cart/CartTabs";
import { useAuth } from "@/app/context/AuthContext";
import { useBasket } from "@/app/context/BasketContext";
import { useEffect, useMemo, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { API_V1_URL } from "@/lib/config";
import { PlusIcon, TagIcon, XMarkIcon } from "@heroicons/react/24/outline";

interface BasketItem {
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
}

interface BasketGroup {
  id: string;
  seller_id: string;
  seller_name: string;
  basket_group_items: BasketItem[];
}

interface Basket {
  id: string;
  user_id?: string;
  basket_groups: BasketGroup[];
  total_price: number;
  total_items: number;
}

interface CartPageClientProps {
  initialBasket: Basket | null;
  initialToken: string;
}

function CartPageContent({ initialBasket, initialToken }: CartPageClientProps) {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const { basket, isGuestBasket, refreshBasket, loading } = useBasket();
  const [appliedDiscountCode, setAppliedDiscountCode] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [discountCodeLoading, setDiscountCodeLoading] = useState(false);
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [modalDiscountCode, setModalDiscountCode] = useState("");

  // Initial basket'i set et
  useEffect(() => {
    if (initialBasket && !basket) {
      // Context'e initial basket'i set etmek için refreshBasket çağır
      refreshBasket();
    }
  }, [initialBasket, basket, refreshBasket]);

  // Sepet sayfası yüklendiğinde sepeti yenile (sadece ilk yüklemede)
  useEffect(() => {
    if (!initialBasket) {
      refreshBasket();
    }
  }, []); // refreshBasket dependency'sini kaldırdık

  // Sepet boş mu kontrolü - Guest basket için doğru kontrol
  const allItems = useMemo(() => 
    basket?.basket_groups?.flatMap(group => group.basket_group_items) || [], 
    [basket?.basket_groups]
  );
  const isCartEmpty = useMemo(() => 
    !basket || basket.basket_groups.length === 0 || allItems.length === 0,
    [basket, allItems.length]
  );

  const loadingView = (
      <div className="bg-white min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 pt-20 md:pt-0 pb-4 sm:py-8 lg:py-12 xl:py-16 2xl:py-20">
          {/* Mobile Header - Enhanced */}
          <div className="lg:hidden mb-4">
            <div className="flex items-center justify-between bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
           
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5.4M7 13v6a2 2 0 002 2h6a2 2 0 002-2v-6M9 21v-8m6 8v-8" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="text-center py-12">
              <p className="text-gray-600">Sepet yükleniyor...</p>
            </div>
          </div>
        </div>
      </div>
    );
  
  const emptyView = (
      <div className="bg-white min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 pt-20 md:pt-0 pb-4 sm:py-8 lg:py-12 xl:py-16 2xl:py-20">
          <div className="flex justify-center">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 xl:gap-8 2xl:gap-12 w-full">
              <div className="lg:col-span-3 w-full">
                <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 lg:p-8 text-center mb-4 sm:mb-6 lg:mb-8">
                  <div className="max-w-md mx-auto">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5.4M7 13v6a2 2 0 002 2h6a2 2 0 002-2v-6M9 21v-8m6 8v-8" />
                      </svg>
                    </div>
                    <h2 className="text-lg sm:text-xl font-semibold text-black mb-2 sm:mb-3">Sepetiniz Boş</h2>
                    <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">
                      Henüz sepetinizde ürün bulunmuyor. Binlerce ürün arasından beğendiklerinizi sepetinize ekleyin.
                    </p>
                    <a
                      href="/"
                      className="inline-block px-4 sm:px-6 py-2.5 sm:py-3 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700"
                    >
                      Alışverişe Başla
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );

  const handleApplyDiscountCode = useCallback(async (code: string): Promise<boolean> => {
    setDiscountCodeLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error("İndirim kodu uygulamak için giriş yapmanız gerekiyor", {
          duration: 4000,
          style: {
            background: '#fef2f2',
            color: '#dc2626',
            border: '1px solid #fecaca'
          }
        });
        setTimeout(() => {
          router.push('/giris');
        }, 1500);
        return false;
      }

      const response = await fetch(`${API_V1_URL}/customer/baskets/apply-discount-coupon`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ code })
      });

      const data = await response.json();

      if (data.meta?.status === 'success') {
        setAppliedDiscountCode(code);
        setDiscountAmount(data.data?.discount_coupon_code_amount || 0);
        toast.success(data.meta.message || "İndirim kodu başarıyla uygulandı!");
        return true;
      } else {
        toast.error(data.meta?.message || data.errors?.exception || "İndirim kodu geçersiz");
        return false;
      }
    } catch (error) {
      toast.error("İndirim kodu uygulanırken bir hata oluştu");
      return false;
    } finally {
      setDiscountCodeLoading(false);
    }
  }, [router]);

  const handleRemoveDiscountCode = useCallback(async () => {
    setDiscountCodeLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setAppliedDiscountCode(null);
        setDiscountAmount(0);
        toast.success("İndirim kodu kaldırıldı");
        return;
      }

      const response = await fetch(`${API_V1_URL}/customer/baskets/remove-discount-coupon`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.meta?.status === 'success' || response.ok) {
        setAppliedDiscountCode(null);
        setDiscountAmount(0);
        toast.success("İndirim kodu kaldırıldı");
      } else {
        toast.error(data.meta?.message || "İndirim kodu kaldırılırken bir hata oluştu");
      }
    } catch (error) {
      setAppliedDiscountCode(null);
      setDiscountAmount(0);
      toast.success("İndirim kodu kaldırıldı");
    } finally {
      setDiscountCodeLoading(false);
    }
  }, []);

  const filledView = (
    <>
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 pt-20 md:pt-0 pb-24 sm:pb-8 lg:py-12 xl:py-16 2xl:py-20">
        {/* Mobile Header - Enhanced */}
    
        <div className="flex justify-center">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 xl:gap-8 2xl:gap-12 w-full">
            <div className="lg:col-span-2 w-full order-1 lg:order-1">
              <CartItemsList />
              <div className="mt-4 sm:mt-6 lg:mt-8 xl:mt-10 space-y-4">
                <div className="lg:hidden bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex flex-col">
                      <span className="text-base font-semibold text-gray-900">İndirim Kodu</span>
                      {appliedDiscountCode ? (
                        <span className="text-xs text-emerald-600">
                          "{appliedDiscountCode}" kodu uygulandı
                        </span>
                      ) : (
                        <span className="text-xs text-gray-500">Kodu ekleyerek avantaj yakalayın</span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setModalDiscountCode(appliedDiscountCode || "");
                        setShowDiscountModal(true);
                      }}
                      className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors"
                    >
                      <span className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center bg-white">
                        <PlusIcon className="w-3 h-3 text-orange-500" />
                      </span>
                      <span>{appliedDiscountCode ? 'Kodu Değiştir' : 'Kod Uygula'}</span>
                    </button>
                  </div>
                </div>
                {/* Guest kullanıcılar için de CartTabs göster */}
                <CartTabs />
              </div>
            </div>
            <div className="lg:col-span-1 order-2 lg:order-2">
              {/* Desktop'ta CartSummary göster */}
              <div className="hidden lg:block">
                <CartSummary
                  appliedDiscountCode={appliedDiscountCode}
                  discountAmount={discountAmount}
                  discountCodeLoading={discountCodeLoading}
                  onApplyDiscountCode={handleApplyDiscountCode}
                  onRemoveDiscountCode={handleRemoveDiscountCode}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Mobil için sabit alt buton */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 pb-20 z-50">
          <CartSummary
            appliedDiscountCode={appliedDiscountCode}
            discountAmount={discountAmount}
            discountCodeLoading={discountCodeLoading}
            onApplyDiscountCode={handleApplyDiscountCode}
            onRemoveDiscountCode={handleRemoveDiscountCode}
            variant="compact"
          />
        </div>
      </div>
    </div>
    {showDiscountModal && (
      <div
        className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/50 px-4"
        onClick={() => !discountCodeLoading && setShowDiscountModal(false)}
      >
        <div
          className="bg-white rounded-3xl w-full max-w-sm p-6 relative"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => !discountCodeLoading && setShowDiscountModal(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            aria-label="Kapat"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>

          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
              <TagIcon className="w-7 h-7" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-900">İndirim Kodu Giriniz</h3>
            <p className="text-sm text-gray-500 mt-1">Fırsatlardan yararlanmak için kodunuzu yazın.</p>
          </div>

          <div className="mt-5 space-y-3">
            <input
              type="text"
              value={modalDiscountCode}
              onChange={(e) => setModalDiscountCode(e.target.value)}
              placeholder="İndirim kodu"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              disabled={discountCodeLoading}
            />
            <button
              onClick={async () => {
                const trimmed = modalDiscountCode.trim();
                if (!trimmed) {
                  toast.error("Lütfen bir indirim kodu girin");
                  return;
                }
                const success = await handleApplyDiscountCode(trimmed);
                if (success) {
                  setShowDiscountModal(false);
                }
              }}
              disabled={discountCodeLoading}
              className={`w-full py-3 rounded-xl font-semibold text-white transition-colors ${
                discountCodeLoading ? 'bg-gray-400 cursor-wait' : 'bg-[#F27A1A] hover:bg-[#F27A1A]/90'
              }`}
            >
              {discountCodeLoading ? 'Uygulanıyor...' : 'Uygula'}
            </button>
            {appliedDiscountCode && (
              <button
                type="button"
                onClick={async () => {
                  await handleRemoveDiscountCode();
                  setModalDiscountCode("");
                  setShowDiscountModal(false);
                }}
                disabled={discountCodeLoading}
                className="w-full py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Kodu Kaldır
              </button>
            )}
          </div>
        </div>
      </div>
    )}
    </>
  );

  return loading ? loadingView : (isCartEmpty ? emptyView : filledView);
}

export default function CartPageClient({ initialBasket, initialToken }: CartPageClientProps) {
  return (
    <>
      <Header showBackButton={true} onBackClick={() => window.history.back()} />
      <CartPageContent initialBasket={initialBasket} initialToken={initialToken} />
      <ScrollToTop />
    </>
  );
}
