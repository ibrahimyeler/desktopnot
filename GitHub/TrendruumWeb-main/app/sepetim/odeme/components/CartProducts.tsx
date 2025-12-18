"use client";

import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { IoIosArrowDown } from "react-icons/io";
import { useBasket } from '@/app/context/BasketContext';
import Image from 'next/image';

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

interface Basket {
  id: string;
  user_id?: string;
  basket_groups: Array<{
    id: string;
    seller_id: string;
    seller_name: string;
    basket_group_items: BasketItem[];
  }>;
  total_price: number;
  total_items: number;
}

interface CartProductsProps {
  initialBasket?: Basket | null;
}

interface CartProduct {
  id: string;
  product_id?: string;
  name: string;
  price: number;
  image?: string;
  images?: Array<{
    name: string;
    fullpath: string;
    url: string;
  }>;
  quantity: number;
  product?: {
    images?: Array<{
      name: string;
      fullpath: string;
      url: string;
    }>;
    main_image?: string;
    medias?: Array<{
      url: string;
    }>;
  };
}

const getImageUrl = (item: CartProduct): string => {
  // Eğer product.medias bir dizi ise
  if (Array.isArray(item.product?.medias) && item.product?.medias.length > 0) {
    return item.product?.medias[0].url;
    }
  // Eğer product.medias bir obje ise
  if (item.product?.medias && item.product?.medias.url) {
    return item.product?.medias.url;
  }
  return '/placeholder.webp';
};

export default function CartProducts({ initialBasket }: CartProductsProps) {
  const { basket } = useBasket();

  // Sepet gruplarındaki tüm ürünleri tek bir diziye topla
  const currentBasket = basket || initialBasket;
  const cartItems = currentBasket?.basket_groups?.flatMap(group => group.basket_group_items) || [];

  const renderProduct = (product: CartProduct) => (
    <div
      key={product.id}
      className="flex flex-col items-center bg-white rounded-3xl p-3 sm:p-4 w-32 sm:w-40"
    >
      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-orange-200 mb-2 flex items-center justify-center bg-gray-50">
        <img
          src={getImageUrl(product)}
          alt={product.product?.name}
          className="object-cover w-full h-full"
          onError={e => (e.currentTarget.src = '/placeholder.webp')}
        />
      </div>
      <div className="text-center">
        <div className="font-semibold text-xs sm:text-sm text-gray-900 line-clamp-2">{product.product?.name}</div>
        <div className="text-orange-600 font-bold text-base sm:text-lg mt-1">
          {Number(product.price).toLocaleString('tr-TR')} TL
        </div>
        <div className="text-[10px] sm:text-xs text-gray-500 mt-1">Adet: {product.quantity}</div>
      </div>
    </div>
  );

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="w-full border rounded-md p-5 text-center text-gray-500">
        Sepetinizde ürün bulunmamaktadır.
      </div>
    );
  }

  return (
    <Disclosure
      as="div"
      className="w-full border rounded-md shadow-sm"
      defaultOpen={false}
    >
      <DisclosureButton className="group flex justify-between w-full p-3 sm:p-5 hover:bg-gray-50">
        <h1 className="font-bold text-sm sm:text-base text-gray-900">
          Sepetimdeki Ürünler ({cartItems.length})
        </h1>
        <div className="flex gap-3 sm:gap-5 items-center">
          {cartItems.slice(0, 2).map((item: CartProduct) => (
            <div key={item.id || item.product_id} className="h-5 w-5 sm:h-6 sm:w-6 rounded-full bg-gray-200 relative overflow-hidden">
              <Image
                src={getImageUrl(item)}
                alt={item.name || 'Ürün görseli'}
                fill
                className="object-cover"
                sizes="24px"
                priority={false}
                onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                  e.currentTarget.src = '/images/product-placeholder.png';
                }}
              />
            </div>
          ))}
          <div className="bg-gray-200 rounded-full p-1">
            <IoIosArrowDown className="transition duration-300 group-data-[headlessui-state=open]:rotate-180" />
          </div>
        </div>
      </DisclosureButton>
      
      <DisclosurePanel className="w-full border-t">
        <div className="p-3 flex flex-wrap gap-3 sm:gap-6 justify-center sm:justify-start">
          {cartItems.map((item) => renderProduct(item))}
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
}
