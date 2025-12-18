"use client";

import { useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import Link from "next/link";
import DiscountCodeInput from "../cart/DiscountCodeInput";
import toast from "react-hot-toast";

interface BasketSummaryProps {
  totalPrice: number;
  itemCount: number;
  isLoading?: boolean;
  discount?: number;
  shippingCost?: number;
}

export default function BasketSummary({
  totalPrice,
  itemCount,
  isLoading = false,
  discount = 0,
  shippingCost = 0,
}: BasketSummaryProps) {
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [appliedDiscountCode, setAppliedDiscountCode] = useState<string | null>(null);
  const [discountCodeLoading, setDiscountCodeLoading] = useState(false);
  const { isLoggedIn } = useAuth();

  const handleCheckoutClick = () => {
    if (!isLoggedIn) {
      setShowLoginPopup(true);
    } else {
      // Ödeme sayfasına yönlendir
      window.location.href = '/odeme';
    }
  };

  const handleApplyDiscountCode = async (code: string) => {
    setDiscountCodeLoading(true);
    try {
      // TODO: API çağrısı yapılacak
      // const response = await applyDiscountCode(code);
      // if (response.success) {
      //   setAppliedDiscountCode(code);
      //   toast.success("İndirim kodu başarıyla uygulandı!");
      // } else {
      //   toast.error(response.message || "İndirim kodu geçersiz");
      // }
      
      // Şimdilik mock response
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAppliedDiscountCode(code);
      toast.success("İndirim kodu başarıyla uygulandı!");
    } catch (error) {
      toast.error("İndirim kodu uygulanırken bir hata oluştu");
    } finally {
      setDiscountCodeLoading(false);
    }
  };

  const handleRemoveDiscountCode = () => {
    setAppliedDiscountCode(null);
    toast.success("İndirim kodu kaldırıldı");
  };

  return (
    <>
      <div className="sticky top-4 right-4 bg-white border rounded-lg p-5 shadow-lg">
        {/* Başlık */}
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Sipariş Özeti</h2>

        {/* Fiyat Bilgileri */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-700">
            <span>Ürünlerin Toplamı</span>
            <span>{totalPrice.toLocaleString("tr-TR")} TL</span>
          </div>

          <div className="flex justify-between text-sm text-gray-700">
            <span>Kargo Toplam</span>
            <span>{shippingCost > 0 ? `${shippingCost.toLocaleString("tr-TR")} TL` : "Ücretsiz"}</span>
          </div>

          {discount > 0 && (
            <div className="flex justify-between text-sm bg-green-100 text-green-600 px-3 py-2 rounded-md">
              <span>Toplam İndirim</span>
              <span>-{discount.toLocaleString("tr-TR")} TL</span>
            </div>
          )}
        </div>

        {/* Toplam Fiyat */}
        <div className="border-t pt-4 mt-4">
          <div className="flex justify-between text-lg font-bold text-gray-900">
            <span>Toplam</span>
            <span className="text-[#F27A1A]">
              {(totalPrice + shippingCost - discount).toLocaleString("tr-TR")} TL
            </span>
          </div>
        </div>

        {/* Ürün Popülerlik Bilgisi */}
        <div className="mt-3 flex items-center text-sm text-gray-800">
          <span className="text-lg">🚀</span>
          <span className="ml-2">
            Sepetindeki ürünler son <span className="text-[#F27A1A] font-semibold">3 günde 100+</span> adet satıldı!
          </span>
        </div>

        {/* İndirim Kodu Alanı */}
        <DiscountCodeInput
          onApplyCode={handleApplyDiscountCode}
          onRemoveCode={handleRemoveDiscountCode}
          appliedCode={appliedDiscountCode}
          isApplied={!!appliedDiscountCode}
          isLoading={discountCodeLoading}
        />

        {/* Sepeti Onayla Butonu */}
        <button
          onClick={handleCheckoutClick}
          disabled={isLoading || itemCount === 0}
          className={`mt-4 w-full py-3 rounded-md transition-colors ${
            isLoading || itemCount === 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#F27A1A] hover:bg-[#F27A1A]/90 text-white"
          }`}
        >
          {isLoading ? "İşleniyor..." : itemCount === 0 ? "Sepetiniz Boş" : "Sepeti Onayla"}
        </button>
      </div>

      {showLoginPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-end">
              <button
                onClick={() => setShowLoginPopup(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="text-center mb-6">
              <h2 className="text-2xl font-medium mb-4">Trendruum Hesabınız Yok Mu?</h2>
            </div>
            
            <div className="space-y-4">
              <Link
                href="/giris"
                className="block w-full py-3 px-4 text-center bg-[#F27A1A] text-white rounded-md hover:bg-[#F27A1A]/90 transition"
              >
                Giriş Yap
              </Link>
              
              <Link
                href="/kayit-ol"
                className="block w-full py-3 px-4 text-center border border-[#F27A1A] text-[#F27A1A] rounded-md hover:bg-[#F27A1A]/10 transition"
              >
                Üye Ol
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 