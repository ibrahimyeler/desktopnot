"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, memo } from "react";
import { HiMinus, HiPlus } from "react-icons/hi";
import { TrashIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { createProductUrl } from '@/utils/productUrl';
import { BasketItem, BasketGroup } from './types';

export interface CartCampaignInfo {
  productId: string;
  campaign: {
    id: string;
    name: string;
    slug: string;
    type: string;
    campaign_settings?: {
      buy_quantity?: number;
      pay_quantity?: number;
      percentage?: number;
      nth_product?: number;
      nth_discount_percentage?: number;
      discount_amount?: number;
    };
  };
  quantity: number;
  originalPrice: number;
  campaignPrice: number;
  savings: number;
  discountPercentage?: number;
}

interface CartItemProps {
  item: BasketItem;
  index: number;
  basket?: {
    basket_groups?: BasketGroup[];
  } | null;
  cartCampaigns: CartCampaignInfo[];
  updatingItems: Record<string, boolean>;
  productImages: Record<string, string>;
  onQuantityChange: (item: BasketItem, newQuantity: number) => Promise<void>;
  onDelete: (item: BasketItem) => Promise<void>;
  getSafeImageUrl: (item: BasketItem) => string;
  formatVariants: (variants: { [key: string]: string } | Array<{name: string, value_name: string}> | undefined) => Array<{label: string, value: string}> | null;
  formatPrice: (price: number | undefined | null) => string;
}

const CartItem = memo(({ 
  item, 
  index,
  basket,
  cartCampaigns,
  updatingItems,
  productImages,
  onQuantityChange,
  onDelete,
  getSafeImageUrl,
  formatVariants,
  formatPrice
}: CartItemProps) => {
  const isUpdating = updatingItems[item.id];
  const [displayValue, setDisplayValue] = useState<string>(item.quantity.toString());
  const stockInfo = item.product && (item.product as any)?.stock !== undefined ? {
    stock: (item.product as any).stock,
    name: item.product.name || 'Ürün'
  } : null;
  const [showStockWarning, setShowStockWarning] = useState(false);
  
  useEffect(() => {
    setDisplayValue(item.quantity.toString());
  }, [item.quantity]);
  
  if (!item.product) {
    return null;
  }

  const basketSellerInfo = basket?.basket_groups?.find(group => 
    group.basket_group_items.some(groupItem => groupItem.id === item.id)
  )?.seller;
  
  const sellerWithRating = basketSellerInfo ? {
    ...basketSellerInfo,
    point: (basketSellerInfo as any).point || (basketSellerInfo as any).rating || undefined
  } : null;
  
  const brandInfo = item.product.brand;
  
  return (
    <div className="relative flex items-start gap-3 sm:gap-4 p-4 sm:p-5 bg-white rounded-xl transition-all duration-200 border border-gray-100">
      <button
        onClick={() => onDelete(item)}
        disabled={isUpdating}
        className="absolute top-3 right-3 p-2 sm:p-2.5 rounded-full hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed z-10 transition-all duration-200 hover:scale-110"
        title="Ürünü sepetten sil"
      >
        <TrashIcon className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
      </button>
      
      <Link href={createProductUrl(item.product.slug)} className="w-16 h-16 sm:w-24 sm:h-24 relative hover:opacity-80 transition-all duration-200 flex-shrink-0 rounded-lg overflow-hidden bg-gray-50 hover:scale-105">
        <Image
          src={getSafeImageUrl(item)}
          alt={item.product.name || 'Ürün'}
          fill
          className="object-contain cursor-pointer"
          sizes="(max-width: 640px) 64px, 96px"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOTYiIGhlaWdodD0iOTYiIHZpZXdCb3g9IjAgMCA5NiA5NiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9Ijk2IiBoZWlnaHQ9Ijk2IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik00OCA0OEM1My41MjM0IDQ4IDU4IDQzLjUyMzQgNTggMzhDNTggMzIuNDc2NiA1My41MjM0IDI4IDQ4IDI4QzQyLjQ3NjYgMjggMzggMzIuNDc2NiAzOCAzOEMzOCA0My41MjM0IDQyLjQ3NjYgNDggNDggNDhaIiBmaWxsPSIjOUI5QkEwIi8+CjxwYXRoIGQ9Ik00OCA1NkM0Mi40NzY2IDU2IDM4IDUxLjUyMzQgMzggNDZDMzggNDAuNDc2NiA0Mi40NzY2IDM2IDQ4IDM2QzUzLjUyMzQgMzYgNTggNDAuNDc2NiA1OCA0NkM1OCA1MS41MjM0IDUzLjUyMzQgNTYgNDggNTZaIiBmaWxsPSIjOUI5QkEwIi8+Cjwvc3ZnPgo=';
          }}
        />
      </Link>
      
      <div className="flex-1 min-w-0 pr-10 sm:pr-12">
        <Link href={createProductUrl(item.product.slug)} className="block">
          <h3 className="font-semibold text-gray-900 hover:text-orange-500 transition-colors cursor-pointer text-xs sm:text-sm lg:text-base line-clamp-2 leading-tight">
            {item.product.name || 'İsimsiz Ürün'}
          </h3>
        </Link>
        
        <div className="flex items-center gap-3 mt-2">
          {sellerWithRating && (
            <div className="flex items-center gap-2 rounded-lg px-2 py-1">
              <span className="text-xs text-blue-600 font-semibold">
                {sellerWithRating.name}
              </span>
              {sellerWithRating.point && typeof sellerWithRating.point === 'number' && (
                <div className="flex items-center gap-1">
                  <div className="bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
                    {sellerWithRating.point.toFixed(1)}
                  </div>
                </div>
              )}
            </div>
          )}
          
          {brandInfo && brandInfo.name && (
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 6a2 2 0 114 0 2 2 0 01-4 0zm8 0a2 2 0 114 0 2 2 0 01-4 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-xs text-orange-600 font-semibold">
                {brandInfo.name}
              </span>
            </div>
          )}
        </div>

        {((item.variants && formatVariants(item.variants)) || (item.product?.variants && formatVariants(item.product?.variants))) && (
          <div className="flex flex-wrap items-center gap-2 mt-3">
            {(formatVariants(item.variants) || formatVariants(item.product?.variants as any))?.map((variant, index) => (
              <div key={index} className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-orange-50 to-orange-100 rounded-full border border-orange-200 shadow-sm hover:shadow-md transition-all duration-200">
                <div className="w-5 h-5 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center shadow-sm">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xs font-semibold text-orange-700">
                    {variant.label}:
                  </span>
                  <span className="text-xs font-bold text-orange-900">
                    {variant.value}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0 mt-2 sm:mt-3">
          <div className="flex items-center gap-2">
            <p className="text-gray-900 text-xs sm:text-sm lg:text-base font-bold">
              {formatPrice(item?.price)} TL
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Toplam:</span>
            <p className="text-xs sm:text-sm font-bold text-orange-600">
              {formatPrice(item?.total_price)} TL
            </p>
          </div>
        </div>

        {cartCampaigns.some(campaign => campaign.productId === item.product_id) && (() => {
          const campaignInfo = cartCampaigns.find(campaign => campaign.productId === item.product_id);
          const isPercentageDiscount = campaignInfo?.campaign.type === 'percentage_discount';
          const isNthProductDiscount = campaignInfo?.campaign.type === 'nth_product_discount';
          const isPriceDiscount = campaignInfo?.campaign.type === 'price_discount';
          
          return (
            <div className={`mt-2 flex items-center justify-between p-2 border-l-2 rounded-r-md ${
              isPercentageDiscount 
                ? 'bg-red-50/50 border-red-400' 
                : isNthProductDiscount
                  ? 'bg-purple-50/50 border-purple-400'
                  : isPriceDiscount
                    ? 'bg-blue-50/50 border-blue-400'
                    : 'bg-emerald-50/50 border-emerald-400'
            }`}>
              <div className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                  isPercentageDiscount ? 'bg-red-500' : isNthProductDiscount ? 'bg-purple-500' : isPriceDiscount ? 'bg-blue-500' : 'bg-emerald-500'
                }`}>
                  <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <span className={`text-xs font-medium ${
                  isPercentageDiscount ? 'text-red-700' : isNthProductDiscount ? 'text-purple-700' : isPriceDiscount ? 'text-blue-700' : 'text-emerald-700'
                }`}>
                  {isPercentageDiscount 
                    ? `%${campaignInfo?.discountPercentage || 0} İndirim`
                    : isNthProductDiscount
                      ? `${campaignInfo?.campaign.campaign_settings?.nth_product}. Ürün %${campaignInfo?.campaign.campaign_settings?.nth_discount_percentage} İndirim`
                      : isPriceDiscount
                        ? `${campaignInfo?.campaign.campaign_settings?.discount_amount} TL İndirim`
                        : `${campaignInfo?.campaign.campaign_settings?.buy_quantity} Al ${campaignInfo?.campaign.campaign_settings?.pay_quantity} Öde`
                  }
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 line-through">
                  {formatPrice((item?.quantity || 0) * (item?.price || 0))} TL
                </span>
                <span className={`text-xs font-bold ${
                  isPercentageDiscount ? 'text-red-600' : 'text-emerald-600'
                }`}>
                  {formatPrice(campaignInfo?.campaignPrice || item.total_price)} TL
                </span>
                <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${
                  isPercentageDiscount 
                    ? 'text-red-600 bg-red-100' 
                    : 'text-emerald-600 bg-emerald-100'
                }`}>
                  -{formatPrice(campaignInfo?.savings || 0)} TL
                </span>
              </div>
            </div>
          );
        })()}
        
        <div className="flex items-center gap-1 mt-3 sm:mt-4">
          <button
            onClick={() => {
              if (item.quantity <= 1) {
                onDelete(item);
              } else {
                onQuantityChange(item, item.quantity - 1);
              }
            }}
            disabled={isUpdating}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-gray-50 to-gray-100 hover:from-red-50 hover:to-red-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 hover:scale-110 hover:shadow-md border border-gray-200 hover:border-red-300 flex items-center justify-center group"
          >
            <HiMinus className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600 group-hover:text-red-600 transition-colors duration-200" />
          </button>
          
          <div className="relative">
            <input
              type="number"
              min="0"
              max="99"
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete="off"
              value={isUpdating ? '...' : displayValue}
              onChange={(e) => {
                const value = e.target.value;
                const cleanValue = value.replace(/[^0-9]/g, '');
                setDisplayValue(cleanValue);
                
                if (cleanValue === '' || /^\d+$/.test(cleanValue)) {
                  const newQuantity = parseInt(cleanValue) || 0;
                  
                  if (stockInfo && newQuantity > stockInfo.stock) {
                    setShowStockWarning(true);
                    setDisplayValue(stockInfo.stock.toString());
                    return;
                  } else {
                    setShowStockWarning(false);
                  }
                  
                  if (newQuantity >= 1 && newQuantity <= 99) {
                    onQuantityChange(item, newQuantity);
                  }
                  if (newQuantity === 0 && cleanValue !== '') {
                    onDelete(item);
                  }
                }
              }}
              onBlur={(e) => {
                const value = e.target.value;
                const cleanValue = value.replace(/[^0-9]/g, '');
                const newQuantity = parseInt(cleanValue);
                
                if (cleanValue === '' || isNaN(newQuantity) || newQuantity < 1) {
                  setDisplayValue(item.quantity.toString());
                  setShowStockWarning(false);
                } else if (newQuantity === 0) {
                  onDelete(item);
                } else if (newQuantity > 99) {
                  onQuantityChange(item, 99);
                  setDisplayValue('99');
                  setShowStockWarning(false);
                } else if (stockInfo && newQuantity > stockInfo.stock) {
                  setDisplayValue(stockInfo.stock.toString());
                  setShowStockWarning(true);
                } else {
                  setDisplayValue(cleanValue);
                  setShowStockWarning(false);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.currentTarget.blur();
                }
              }}
              disabled={isUpdating}
              className="w-12 sm:w-14 h-8 sm:h-9 text-xs sm:text-sm font-bold text-center bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-xl px-2 py-1 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-md hover:border-orange-300 text-gray-900 placeholder-gray-400"
              style={{
                WebkitAppearance: 'none',
                MozAppearance: 'textfield',
                color: '#111827',
                backgroundColor: '#ffffff'
              }}
            />
            {isUpdating && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-3 h-3 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>
          
          {showStockWarning && stockInfo && (
            <div className="absolute -bottom-8 left-0 right-0 bg-red-50 border border-red-200 rounded-lg p-2 shadow-lg z-10">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                  <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-xs font-medium text-red-700">
                  Stokta sadece <span className="font-bold">{stockInfo.stock}</span> adet var
                </span>
              </div>
            </div>
          )}
          
          <button
            onClick={() => {
              const newQuantity = item.quantity + 1;
              if (stockInfo && newQuantity > stockInfo.stock) {
                setShowStockWarning(true);
                toast.error(`Stokta sadece ${stockInfo.stock} adet bulunmaktadır.`);
                return;
              }
              setShowStockWarning(false);
              onQuantityChange(item, newQuantity);
            }}
            disabled={isUpdating || (stockInfo ? item.quantity >= stockInfo.stock : false)}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-orange-50 to-orange-100 hover:from-orange-200 hover:to-orange-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 hover:scale-110 hover:shadow-md border border-orange-200 hover:border-orange-400 flex items-center justify-center group"
          >
            <HiPlus className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-600 group-hover:text-orange-700 transition-colors duration-200" />
          </button>
        </div>
      </div>
    </div>
  );
});

CartItem.displayName = 'CartItem';

export default CartItem;

