"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { HeartIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { HiMinus, HiPlus } from 'react-icons/hi';
import { useBasket } from 'app/context/BasketContext';
import { useFavorites } from '@/app/context/FavoriteContext';
import { useAuth } from '@/app/context/AuthContext';
import { useCampaign } from '@/app/hooks/useCampaign';
import toast from 'react-hot-toast';

interface ProductActionsProps {
  product: {
    id: string;
    name: string;
    price?: number;
    campaign_price?: number;
    original_price?: number;
    stock?: number;
    categoryId?: string;
    variants?: Array<{
      name: string;
      value_name: string;
      value_slug: string;
      slug: string;
      selected?: {
        name: string;
        value: string;
      };
    }>;
  };
  selectedVariantId?: string; // Seçili varyant ID'si
  selectedVariants?: { [key: string]: string }; // Seçili variant bilgileri
  hasSizeVariants?: boolean; // Beden varyantı var mı?
  onFavoriteClick?: () => Promise<void>;
  isInFavorites?: boolean;
  campaign?: any;
  isProductInCampaign?: boolean;
  getCampaignQuantity?: (quantity: number) => number;
  mobileButtonLoading?: boolean;
  setMobileButtonLoading?: (loading: boolean) => void;
  renderMobileButtonOnly?: boolean; // Sadece mobil butonu render et (main container dışı için)
}

const ProductActions = ({ 
  product, 
  selectedVariantId,
  selectedVariants,
  hasSizeVariants = true,
  onFavoriteClick,
  isInFavorites: isInFavoritesProp,
  campaign,
  isProductInCampaign,
  getCampaignQuantity,
  mobileButtonLoading,
  setMobileButtonLoading,
  renderMobileButtonOnly = false
}: ProductActionsProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const { addToBasket, isGuestBasket } = useBasket();
  const { isInFavorites, addToFavorites, removeFavorite } = useFavorites();
  const { isLoggedIn } = useAuth();
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  
  // Kampanya bilgilerini al - prop'tan gelen varsa onu kullan, yoksa hook'tan al
  const campaignHook = useCampaign(product.id, product.categoryId);
  const campaignData = campaign || campaignHook.campaign;
  const isProductInCampaignData = isProductInCampaign || campaignHook.isProductInCampaign;
  const getCampaignQuantityData = getCampaignQuantity || campaignHook.getCampaignQuantity;

  const isFavorited = isInFavoritesProp || isInFavorites(product.id);
  const isOutOfStock = product.stock === 0;
  const hasNoSizeVariants = !hasSizeVariants;
  
  // Beden seçimi yapılmış mı kontrol et
  // API'den gelen variants array'inde beden varsa ve value_name doluysa seçili sayılır
  const hasSelectedSize = product.variants?.some(v => 
    v.name.toLowerCase().includes('beden') || 
    v.name.toLowerCase().includes('yaş') || 
    v.name.toLowerCase().includes('yas')
  ) ? product.variants?.some(v => 
    (v.name.toLowerCase().includes('beden') || 
     v.name.toLowerCase().includes('yaş') || 
     v.name.toLowerCase().includes('yas')) && 
    (v.selected?.value || v.value_name) // API'den gelen value_name'i de kontrol et
  ) : true; // Eğer beden varyantı yoksa true döndür

  // Seçili varyantları göster (string formatında)
  const selectedVariantsDisplay = product.variants?.map(v => 
    `${v.name}: ${v.selected?.name || v.value_name}`
  ).join(' - ');

  const handleAddToCart = async (qty?: number) => {
    if (loading) return;
    setLoading(true);

    try {
      // Seçili varyant ID'si varsa onu kullan, yoksa ana ürün ID'sini kullan
      const productIdToAdd = selectedVariantId || product.id;
      
      // Kullanılacak miktar: parametre olarak gelirse onu kullan, yoksa state'teki quantity'yi kullan
      const quantityToUse = qty !== undefined ? qty : quantity;
      

      
      // Kampanya kurallarına göre miktar hesapla
      const quantityToAdd = getCampaignQuantityData(quantityToUse);
      
      // Variant bilgilerini sepete ekle
      await addToBasket(productIdToAdd, quantityToAdd, selectedVariants);
    } catch (error) {
      // Hata mesajı da BasketContext'te yönetiliyor
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    // Stok kontrolü
    const maxStock = product.stock || 99;
    if (newQuantity < 1) {
      setQuantity(1);
    } else if (newQuantity > maxStock) {
      setQuantity(maxStock);
      toast.error(`Stokta sadece ${maxStock} adet bulunmaktadır.`);
    } else if (newQuantity > 99) {
      setQuantity(99);
      toast.error('Maksimum 99 adet ekleyebilirsiniz.');
    } else {
      setQuantity(newQuantity);
    }
  };

  const handleFavoriteClick = async () => {
    if (onFavoriteClick) {
      await onFavoriteClick();
      return;
    }

    if (!isLoggedIn) {
      toast.error('Favorilere eklemek için giriş yapmalısınız');
      router.push('/giris');
      return;
    }

    if (favoriteLoading) return;
    setFavoriteLoading(true);

    try {
      if (isFavorited) {
        await removeFavorite(product.id);
        toast.success('Ürün favorilerden kaldırıldı');
      } else {
        await addToFavorites(product.id);
        toast.success('Ürün favorilere eklendi');
      }
    } catch (error) {
      toast.error('İşlem sırasında bir hata oluştu');
    } finally {
      setFavoriteLoading(false);
    }
  };
  const formatPrice = (value: number) =>
    value.toLocaleString('tr-TR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  const hasDiscount =
    !!(
      product.campaign_price &&
      product.original_price &&
      product.campaign_price < product.original_price
    );
  const unitPrice = hasDiscount
    ? product.campaign_price || 0
    : product.price || 0;
  const unitOriginalPrice = hasDiscount
    ? product.original_price || 0
    : product.price || 0;
  const totalPrice = unitPrice * quantity;
  const totalOriginalPrice = hasDiscount ? unitOriginalPrice * quantity : null;
  const shippingEligible = totalPrice >= 400;
  const shippingMessage = shippingEligible ? 'Kargo ücretsiz' : '125 TL kargo';

  // Sadece mobil butonu render et (main container dışı için)
  if (renderMobileButtonOnly) {
    return (
      <div 
        className="md:hidden fixed bottom-[64px] left-0 right-0 bg-white border-t border-gray-200 z-[99998]"
        style={{ 
          padding: '1rem', 
          paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 1rem)',
          transform: 'translateZ(0)',
          WebkitTransform: 'translateZ(0)',
          willChange: 'transform',
          isolation: 'isolate',
          WebkitBackfaceVisibility: 'hidden',
          backfaceVisibility: 'hidden',
          position: 'fixed',
          WebkitOverflowScrolling: 'touch',
          overscrollBehavior: 'none'
        }}
      >
        <div className="flex items-center justify-between gap-3">
          {/* Toplam Fiyat - Sol */}
          <div className="flex flex-col">
            <span className="text-sm text-gray-600">Toplam</span>
            <span className="text-base font-bold text-[#F27A1A]">
              {formatPrice(totalPrice)} TL
            </span>
            <span
              className={`text-xs font-medium mt-0.5 ${
                shippingEligible ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {shippingMessage}
            </span>
          </div>

          {/* Miktar Kontrolü ve Sepete Ekle Butonu - Sağda Hizalı */}
          <div className="flex items-center gap-2">
            {/* Miktar Kontrolü */}
            <div className="flex items-center bg-gray-50 rounded-md border border-gray-200">
              <button
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1 || loading || mobileButtonLoading}
                className="p-0.5 h-5 flex items-center justify-center text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:bg-gray-100 rounded-l-md"
              >
                <HiMinus className="w-3 h-3" />
              </button>
              <input
                type="number"
                min="1"
                max={product.stock || 99}
                value={quantity === 0 ? '' : quantity}
                onChange={(e) => {
                  const value = e.target.value;
                  const cleanValue = value.replace(/[^0-9]/g, '');
                  if (cleanValue === '') {
                    setQuantity(0);
                  } else {
                    const newQuantity = parseInt(cleanValue);
                    handleQuantityChange(newQuantity);
                  }
                }}
                onBlur={(e) => {
                  const value = e.target.value;
                  const cleanValue = value.replace(/[^0-9]/g, '');
                  const newQuantity = parseInt(cleanValue);
                  if (cleanValue === '' || isNaN(newQuantity) || newQuantity < 1) {
                    setQuantity(1);
                  } else {
                    handleQuantityChange(newQuantity);
                  }
                }}
                disabled={loading || mobileButtonLoading}
                className="w-4 h-5 text-center text-xs font-medium text-black bg-transparent border-x border-gray-200 focus:outline-none focus:ring-1 focus:ring-orange-400 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  WebkitAppearance: 'none',
                  MozAppearance: 'textfield',
                }}
              />
              <button
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={
                  loading || 
                  mobileButtonLoading || 
                  (product.stock ? quantity >= product.stock : quantity >= 99)
                }
                className="p-0.5 h-5 flex items-center justify-center text-[#F27A1A] disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:bg-gray-100 rounded-r-md"
              >
                <HiPlus className="w-3 h-3" />
              </button>
            </div>

            {/* Sepete Ekle Butonu */}
            {product.price && product.price > 0 && !isOutOfStock && (
              <button
                onClick={() => {
                  if (hasSizeVariants && !hasSelectedSize) {
                    toast.error('Lütfen bir beden seçin');
                    return;
                  }
                  handleAddToCart();
                }}
                disabled={loading || mobileButtonLoading}
                className={`px-4 py-2.5 rounded-md transition-colors whitespace-nowrap text-sm ${
                  loading || mobileButtonLoading || isOutOfStock
                    ? "bg-gray-400 cursor-not-allowed" 
                    : "bg-[#F27A1A] hover:bg-[#F27A1A]/90 text-white"
                }`}
              >
                {loading || mobileButtonLoading ? "Ekleniyor..." : "Sepete Ekle"}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Seçili Varyantlar - Kaldırıldı */}
      
      {/* Guest Basket Bilgisi */}
   
      
      {/* Stok Durumu Bilgisi */}
      {isOutOfStock && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span className="text-sm font-medium text-red-700">Bu ürün şu anda stokta bulunmuyor</span>
          </div>
        </div>
      )}

      {/* Beden Seçimi Gerekli Bilgisi */}
      {hasSizeVariants && !hasSelectedSize && !isOutOfStock && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
            <span className="text-sm font-medium text-gray-700">Lütfen bir beden seçin</span>
          </div>
        </div>
      )}

      {/* Desktop Butonlar */}
      <div className="hidden md:flex gap-2">
        {isOutOfStock ? (
          /* Stokta Yok - Tek Büyük Buton */
          <button
            disabled={true}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gray-400 text-white font-medium text-sm cursor-not-allowed opacity-50"
          >
            <span>Stokta Yok</span>
          </button>
        ) : (
          <>
            {/* Fiyat Gösterimi - Desktop */}
            <div className="flex-1 flex flex-col items-start justify-center px-4 py-2.5 rounded-lg bg-white">
              {totalOriginalPrice !== null && (
                <span className="text-xs text-gray-400 line-through">
                  {formatPrice(totalOriginalPrice)} TL
                </span>
              )}
              <span className="text-lg font-bold text-gray-900">
                {formatPrice(totalPrice)} TL
              </span>
              <span
                className={`text-xs font-medium ${
                  shippingEligible ? 'text-green-600' : 'text-orange-600'
                }`}
              >
                {shippingMessage}
              </span>
            </div>

            {/* Miktar Kontrolü - Desktop */}
            <div className="flex items-center bg-gray-50 rounded-md border border-gray-200">
              <button
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1 || loading}
                className="p-1 h-8 w-8 flex items-center justify-center text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:bg-gray-100 rounded-l-md"
              >
                <HiMinus className="w-3.5 h-3.5" />
              </button>
              <input
                type="number"
                min="1"
                max={product.stock || 99}
                value={quantity === 0 ? '' : quantity}
                onChange={(e) => {
                  const value = e.target.value;
                  const cleanValue = value.replace(/[^0-9]/g, '');
                  if (cleanValue === '') {
                    setQuantity(0);
                  } else {
                    const newQuantity = parseInt(cleanValue);
                    handleQuantityChange(newQuantity);
                  }
                }}
                onBlur={(e) => {
                  const value = e.target.value;
                  const cleanValue = value.replace(/[^0-9]/g, '');
                  const newQuantity = parseInt(cleanValue);
                  if (cleanValue === '' || isNaN(newQuantity) || newQuantity < 1) {
                    setQuantity(1);
                  } else {
                    handleQuantityChange(newQuantity);
                  }
                }}
                disabled={loading}
                className="w-8 h-8 text-center text-xs font-medium text-black bg-transparent border-x border-gray-200 focus:outline-none focus:ring-1 focus:ring-orange-400 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  WebkitAppearance: 'none',
                  MozAppearance: 'textfield',
                }}
              />
              <button
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={
                  loading || 
                  (product.stock ? quantity >= product.stock : quantity >= 99)
                }
                className="p-1 h-8 w-8 flex items-center justify-center text-[#F27A1A] disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:bg-gray-100 rounded-r-md"
              >
                <HiPlus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Sepete Ekle Butonu - 0 TL ürünlerde gizli - Desktop */}
            {product.price && product.price > 0 && (
              <button
                onClick={() => {
                  if (hasSizeVariants && !hasSelectedSize) {
                    toast.error('Lütfen bir beden seçin');
                    return;
                  }
                  handleAddToCart();
                }}
                disabled={loading}
                className={`flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg text-white font-medium text-sm transition-all duration-300 ${
                  loading
                    ? 'bg-orange-400 cursor-wait'
                    : isProductInCampaignData && campaignData?.type === 'buy_x_pay_y'
                      ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
                      : 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700'
                }`}
              >
                <ShoppingCartIcon className="w-4 h-4" />
                <span>
                  {loading ? 'Ekleniyor...' : 'Sepete Ekle'}
                </span>
              </button>
            )}
          </>
        )}
      </div>

    </div>
  );
};

export default ProductActions;
