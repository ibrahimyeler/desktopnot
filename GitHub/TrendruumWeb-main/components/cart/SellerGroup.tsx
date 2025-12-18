"use client";

import { BasketGroup } from './types';
import CartItem, { CartCampaignInfo } from './CartItem';
import { BasketItem } from './types';

interface SellerGroupProps {
  group: BasketGroup;
  cartCampaigns: CartCampaignInfo[];
  updatingItems: Record<string, boolean>;
  productImages: Record<string, string>;
  onQuantityChange: (item: BasketItem, newQuantity: number) => Promise<void>;
  onDelete: (item: BasketItem) => Promise<void>;
  getSafeImageUrl: (item: BasketItem) => string;
  formatVariants: (variants: { [key: string]: string } | Array<{name: string, value_name: string}> | undefined) => Array<{label: string, value: string}> | null;
  formatPrice: (price: number | undefined | null) => string;
  basket?: {
    basket_groups?: BasketGroup[];
  } | null;
}

export default function SellerGroup({
  group,
  cartCampaigns,
  updatingItems,
  productImages,
  onQuantityChange,
  onDelete,
  getSafeImageUrl,
  formatVariants,
  formatPrice,
  basket
}: SellerGroupProps) {
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
  const isGroupFreeShipping = groupTotal >= 400;
  
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{group.seller.name}</h3>
            <p className="text-sm text-gray-600">
              {group.basket_group_items.length} ürün • {formatPrice(groupTotal)} TL
            </p>
          </div>
        </div>
        
        <div className="text-right">
          {isGroupFreeShipping ? (
            <div className="flex items-center gap-2 text-green-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm font-medium">Kargo Bedava</span>
            </div>
          ) : (
            <div className="text-sm text-gray-600">
              <span className="font-medium">{formatPrice(125)} TL</span>
              <span className="text-xs block">kargo ücreti</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="space-y-4">
        {group.basket_group_items.map((item, itemIndex) => (
          <CartItem 
            key={`${item.id}-${item.quantity}`} 
            item={item} 
            index={itemIndex}
            basket={basket}
            cartCampaigns={cartCampaigns}
            updatingItems={updatingItems}
            productImages={productImages}
            onQuantityChange={onQuantityChange}
            onDelete={onDelete}
            getSafeImageUrl={getSafeImageUrl}
            formatVariants={formatVariants}
            formatPrice={formatPrice}
          />
        ))}
      </div>
      
      {isGroupFreeShipping ? (
        <div className="mt-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-green-500 rounded-full">
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-green-800">
                🎉 Tebrikler! Bu satıcıdan kargo ücretsiz
              </p>
              <p className="text-xs text-green-600">
                400 TL ve üzeri alışverişlerde kargo bedava
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-4 p-3 bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-orange-500 rounded-full">
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-orange-800">
                💡 Kargonuzun ücretsiz olması için
              </p>
              <p className="text-xs text-orange-600">
                {formatPrice(400 - groupTotal)} TL daha alışveriş yaparsanız kargo ücretsiz olacak
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

