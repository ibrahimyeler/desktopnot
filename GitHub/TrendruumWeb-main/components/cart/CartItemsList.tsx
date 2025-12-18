"use client";

import { useBasket } from "@/app/context/BasketContext";
import { useEffect, useState, useMemo, useCallback } from "react";
import ClearBasketModal from './ClearBasketModal';
import { useCartCampaigns } from '@/app/hooks/useCartCampaigns';
import { BasketItem, BasketGroup } from './types';
import EmptyCart from './EmptyCart';
import FreeShippingBanner from './FreeShippingBanner';
import CartCampaignsBanner from './CartCampaignsBanner';
import ClearBasketButton from './ClearBasketButton';
import SellerGroup from './SellerGroup';
import CartItem from './CartItem';

const CartItemsList = () => {
  const { basket, loading, updateBasketItem, removeFromBasket, clearBasket, totalPrice } = useBasket();
  const [updatingItems, setUpdatingItems] = useState<Record<string, boolean>>({});
  const [productImages, setProductImages] = useState<Record<string, string>>({});
  const [showClearModal, setShowClearModal] = useState(false);
  const [isClearingBasket, setIsClearingBasket] = useState(false);

  // Sepet ürünlerini al
  const basketItems = useMemo(() => {
    const items = basket?.basket_groups?.flatMap(group => group.basket_group_items) || [];
    return items;
  }, [basket?.basket_groups]);

  // Kampanya bilgilerini al
  const { cartCampaigns } = useCartCampaigns(basketItems);

  // 400 TL ve üzeri için kargo bedava
  const freeShippingThreshold = 400;
  const isFreeShipping = useMemo(() => 
    (totalPrice || 0) >= freeShippingThreshold,
    [totalPrice]
  );
  
  const remainingForFreeShipping = useMemo(() => 
    Math.max(0, freeShippingThreshold - (totalPrice || 0)),
    [totalPrice]
  );

  useEffect(() => {
    const fetchMissingImages = async () => {
      if (!basket?.basket_groups) return;
      const allItems = basket.basket_groups.flatMap(group => group.basket_group_items);

      for (const item of allItems) {
        if (!item.product) continue;
        if (item.product.images || item.product.medias) continue;
        
        const slug = item.product.slug;
        if (!slug) continue;
        
        const isObjectId = /^[0-9a-fA-F]{24}$/.test(slug);
        if (isObjectId) {
          continue;
        }
        
        try {
          const response = await fetch(`/api/v1/products/${slug}`);
          
          if (!response.ok) {
            if (response.status === 400 || response.status === 404) {
              continue;
            }
            continue;
          }
          
          const data = await response.json();
          
          if (data.meta?.status === 'success' && data.data?.images?.[0]?.url) {
            setProductImages(prev => ({
              ...prev,
              [item.product_id]: data.data.images[0].url
            }));
          }
        } catch (e) {
          continue;
        }
      }
    };
    fetchMissingImages();
  }, [basket]);

  const handleQuantityChange = useCallback(async (item: BasketItem, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setUpdatingItems(prev => ({ ...prev, [item.id]: true }));
      
    try {
      await updateBasketItem(item.product_id, newQuantity);
    } catch (error: any) {
      // Hata durumunda sepet otomatik olarak refreshBasket ile yenilenecek
    } finally {
      setUpdatingItems(prev => ({ ...prev, [item.id]: false }));
    }
  }, [updateBasketItem]);

  const handleDelete = useCallback(async (item: BasketItem) => {
    try {
      setUpdatingItems(prev => ({ ...prev, [item.id]: true }));
      await removeFromBasket(item.product_id, item.quantity);
    } catch (error: any) {
      if (error.response?.status === 404) {
        // Error handling is done in BasketContext
      }
    } finally {
      setUpdatingItems(prev => ({ ...prev, [item.id]: false }));
    }
  }, [removeFromBasket]);

  const handleClearBasket = useCallback(() => {
    setShowClearModal(true);
  }, []);

  const confirmClearBasket = useCallback(async () => {
    try {
      setIsClearingBasket(true);
      await clearBasket();
      setShowClearModal(false);
    } catch (error) {
    } finally {
      setIsClearingBasket(false);
    }
  }, [clearBasket]);

  const formatPrice = useCallback((price: number | undefined | null) => {
    if (price === undefined || price === null || isNaN(price)) return '0,00';
    return price.toLocaleString('tr-TR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }, []);

  const formatVariants = useCallback((variants: { [key: string]: string } | Array<{name: string, value_name: string}> | undefined) => {
    if (!variants) return null;
    
    if (Array.isArray(variants)) {
      if (variants.length === 0) return null;
      return variants.map(v => ({
        label: v.name,
        value: v.value_name
      }));
    }
    
    if (Object.keys(variants).length === 0) return null;
    return Object.entries(variants).map(([key, value]) => ({
      label: key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' '),
      value: value
    }));
  }, []);

  const getSafeImageUrl = useCallback((item: BasketItem): string => {
    if (!item.product) {
      return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOTYiIGhlaWdodD0iOTYiIHZpZXdCb3g9IjAgMCA5NiA5NiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9Ijk2IiBoZWlnaHQ9Ijk2IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik00OCA0OEM1My41MjM0IDQ4IDU4IDQzLjUyMzQgNTggMzhDNTggMzIuNDc2NiA1My41MjM0IDI4IDQ4IDI4QzQyLjQ3NjYgMjggMzggMzIuNDc2NiAzOCAzOEMzOCA0My41MjM0IDQyLjQ3NjYgNDggNDggNDhaIiBmaWxsPSIjOUI5QkEwIi8+CjxwYXRoIGQ9Ik00OCA1NkM0Mi40NzY2IDU2IDM4IDUxLjUyMzQgMzggNDZDMzggNDAuNDc2NiA0Mi40NzY2IDM2IDQ4IDM2QzUzLjUyMzQgMzYgNTggNDAuNDc2NiA1OCA0NkM1OCA1MS41MjM0IDUzLjUyMzQgNTYgNDggNTZaIiBmaWxsPSIjOUI5QkEwIi8+Cjwvc3ZnPgo=';
    }
    
    const url =
      item.product.images?.[0]?.url ||
      (Array.isArray(item.product.medias) ? item.product.medias[0]?.url : item.product.medias?.url) ||
      productImages[item.product_id] ||
      'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOTYiIGhlaWdodD0iOTYiIHZpZXdCb3g9IjAgMCA5NiA5NiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9Ijk2IiBoZWlnaHQ9Ijk2IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik00OCA0OEM1My41MjM0IDQ4IDU4IDQzLjUyMzQgNTggMzhDNTggMzIuNDc2NiA1My41MjM0IDI4IDQ4IDI4QzQyLjQ3NjYgMjggMzggMzIuNDc2NiAzOCAzOEMzOCA0My41MjM0IDQyLjQ3NjYgNDggNDggNDhaIiBmaWxsPSIjOUI5QkEwIi8+CjxwYXRoIGQ9Ik00OCA1NkM0Mi40NzY2IDU2IDM4IDUxLjUyMzQgMzggNDZDMzggNDAuNDc2NiA0Mi40NzY2IDM2IDQ4IDM2QzUzLjUyMzQgMzYgNTggNDAuNDc2NiA1OCA0NkM1OCA1MS41MjM0IDUzLjUyMzQgNTYgNDggNTZaIiBmaWxsPSIjOUI5QkEwIi8+Cjwvc3ZnPgo=';
    
    if (
      !url ||
      url === 'undefined' ||
      url === 'null' ||
      url.includes('undefined') ||
      url.includes('null')
    ) {
      return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOTYiIGhlaWdodD0iOTYiIHZpZXdCb3g9IjAgMCA5NiA5NiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9Ijk2IiBoZWlnaHQ9Ijk2IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik00OCA0OEM1My41MjM0IDQ4IDU4IDQzLjUyMzQgNTggMzhDNTggMzIuNDc2NiA1My41MjM0IDI4IDQ4IDI4QzQyLjQ3NjYgMjggMzggMzIuNDc2NiAzOCAzOEMzOCA0My41MjM0IDQyLjQ3NjYgNDggNDggNDhaIiBmaWxsPSIjOUI5QkEwIi8+CjxwYXRoIGQ9Ik00OCA1NkM0Mi40NzY2IDU2IDM4IDUxLjUyMzQgMzggNDZDMzggNDAuNDc2NiA0Mi40NzY2IDM2IDQ4IDM2QzUzLjUyMzQgMzYgNTggNDAuNDc2NiA1OCA0NkM1OCA1MS41MjM0IDUzLjUyMzQgNTYgNDggNTZaIiBmaWxsPSIjOUI5QkEwIi8+Cjwvc3ZnPgo=';
    }
    return url;
  }, [productImages]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center border rounded-xl bg-white p-8 mb-8 w-full max-w-2xl mx-auto">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mb-4"></div>
        <p className="text-gray-600 font-medium">Sepet yükleniyor...</p>
      </div>
    );
  }

  const allItems: BasketItem[] = useMemo(() => 
    basket?.basket_groups?.flatMap(group => group.basket_group_items) || [], 
    [basket?.basket_groups]
  );

  if (allItems.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className="space-y-4">
      {!isFreeShipping && remainingForFreeShipping > 0 && (
        <FreeShippingBanner remainingAmount={remainingForFreeShipping} />
      )}

      {cartCampaigns.length > 0 && (
        <CartCampaignsBanner cartCampaigns={cartCampaigns} />
      )}

      {allItems.length > 0 && (
        <ClearBasketButton onClear={handleClearBasket} />
      )}
      
      {basket?.basket_groups?.map((group) => (
        <SellerGroup
          key={group.id}
          group={group}
          cartCampaigns={cartCampaigns}
          updatingItems={updatingItems}
          productImages={productImages}
          onQuantityChange={handleQuantityChange}
          onDelete={handleDelete}
          getSafeImageUrl={getSafeImageUrl}
          formatVariants={formatVariants}
          formatPrice={formatPrice}
          basket={basket}
        />
      ))}

      <ClearBasketModal
        isOpen={showClearModal}
        onClose={() => setShowClearModal(false)}
        onConfirm={confirmClearBasket}
        isLoading={isClearingBasket}
      />
    </div>
  );
};

export default CartItemsList;
