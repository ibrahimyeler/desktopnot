import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { FaTrash } from 'react-icons/fa';
import { HiMinus, HiPlus } from 'react-icons/hi';
import { useBasket } from '@/app/context/BasketContext';
import Image from 'next/image';
import Link from 'next/link';
import { createProductUrl } from '@/utils/productUrl';

interface CartItem {
  id: number;
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  estimatedDeliveryTime: string;
}

interface CartItemsProps {
  items: CartItem[];
  totalItems: number;
}

const CartItems: React.FC<CartItemsProps> = ({ items, totalItems }) => {
  const queryClient = useQueryClient();
  const { updateBasketItem, removeFromBasket } = useBasket();
  const [isLoading, setIsLoading] = useState<Record<number, boolean>>({});

  const handleRemoveItem = async (item: CartItem) => {
    const productId = item.id;
    
    if (!productId) {
      return;
    }

    // Mevcut sepet verisini al
    const previousData = queryClient.getQueryData(['cart']);

    // Optimistic update - UI'ı hemen güncelle
    queryClient.setQueryData(['cart'], (old: { items: CartItem[], totalItems: number }) => ({
      ...old,
      items: old.items.filter((i: CartItem) => i.id !== productId),
      totalItems: (old.totalItems || 0) - 1
    }));

    setIsLoading(prev => ({ ...prev, [productId]: true }));
    
    try {
      await removeFromBasket(productId.toString());
    } catch (error) {
      // Hata durumunda eski veriyi geri yükle
      queryClient.setQueryData(['cart'], previousData);
    } finally {
      setIsLoading(prev => ({ ...prev, [productId]: false }));
    }
  };

  const handleQuantityChange = async (item: CartItem, type: 'increment' | 'decrement' | 'set') => {
    const productId = item.id;
    setIsLoading(prev => ({ ...prev, [productId]: true }));

    try {
      const newQuantity = type === 'increment' ? item.quantity + 1 : 
                         type === 'decrement' ? Math.max(0, item.quantity - 1) : 
                         item.quantity;
      
      await updateBasketItem(productId.toString(), newQuantity);
    } catch (error) {
    } finally {
      setIsLoading(prev => ({ ...prev, [productId]: false }));
    }
  };

  if (!items.length) {
    return (
      <div className="flex flex-col items-center justify-center h-96 bg-white rounded-2xl shadow-lg">
        <div className="text-6xl mb-6">🛒</div>
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">Sepetiniz Boş</h2>
        <p className="text-gray-500 text-lg mb-6">Hemen alışverişe başlayın!</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-6 rounded-xl">
      <div className="flex items-center mb-6">
        <h1 className="text-xl font-semibold text-gray-800">
          Sepetim <span className="text-gray-500 font-normal">({totalItems} Ürün)</span>
        </h1>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <div 
            key={item.id}
            className="bg-white rounded-lg p-4 shadow-sm"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="text-[#F27A1A] bg-orange-50 px-3 py-1 rounded-full text-sm font-medium">
                  Trendruum
                </span>
              </div>
              <button 
                onClick={() => handleRemoveItem(item)}
                disabled={isLoading[item.id]}
                className="text-gray-400 disabled:opacity-50"
              >
                <FaTrash className="w-4 h-4" />
              </button>
            </div>

            <div className="flex gap-4">
              <Link href={createProductUrl(item.product_id)} className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden relative">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover cursor-pointer"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/no-image.png';
                  }}
                />
              </Link>

              <div className="flex-grow">
                <Link href={createProductUrl(item.product_id)} className="block">
                  <h3 className="text-base font-medium text-gray-900 mb-2 cursor-pointer">
                  {item.name}
                </h3>
                </Link>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-bold text-[#F27A1A]">
                      {item.price.toLocaleString("tr-TR")} TL
                    </p>
                  </div>



                  <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200">
                    <button
                      onClick={() => handleQuantityChange(item, 'decrement')}
                      className="p-2 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={item.quantity <= 1 || isLoading[item.id]}
                    >
                      <HiMinus className="w-4 h-4" />
                    </button>
                    <span className="w-10 text-center py-2 text-sm font-medium">
                      {isLoading[item.id] ? '...' : item.quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(item, 'increment')}
                      className="p-2 text-[#F27A1A] disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isLoading[item.id]}
                    >
                      <HiPlus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CartItems; 