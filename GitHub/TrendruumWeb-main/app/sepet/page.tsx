import React from 'react';
import CartPageClient from './CartPageClient';
import { cookies } from 'next/headers';

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

// Server-side data fetching function
async function getBasketData(token: string): Promise<Basket | null> {
  try {
    const axios = require('axios');
    
    if (!token) {
      // Guest basket için boş basket döndür
      return {
        id: 'guest',
        basket_groups: [],
        total_price: 0,
        total_items: 0
      };
    }

    // Önce basket endpoint'ini dene
    let response;
    try {
      response = await axios.get('https://api.trendruum.com/api/v1/customer/baskets', {
        timeout: 10000,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        validateStatus: function (status: number) {
          // 404 ve diğer hataları da başarılı say (sonra handle edeceğiz)
          return status >= 200 && status < 500;
        }
      });

      // 404 ise boş sepet döndür
      if (response.status === 404) {
        return {
          id: 'guest',
          basket_groups: [],
          total_price: 0,
          total_items: 0
        };
      }
    } catch (firstError: any) {
      // Network hatası veya timeout
      return {
        id: 'guest',
        basket_groups: [],
        total_price: 0,
        total_items: 0
      };
    }

    if (response.data?.meta?.status === 'success' && response.data.data) {
      return response.data.data;
    }
    
    // Başarılı response ama data yok - boş sepet döndür
    return {
      id: 'guest',
      basket_groups: [],
      total_price: 0,
      total_items: 0
    };
  } catch (error: any) {
    // Genel hata yakalama - tüm hatalar için boş sepet döndür
    return {
      id: 'guest',
      basket_groups: [],
      total_price: 0,
      total_items: 0
    };
  }
}

// Server component
export default async function CartPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value || '';
  
  const initialBasket = await getBasketData(token);
  
  return (
    <CartPageClient 
      initialBasket={initialBasket}
      initialToken={token}
    />
  );
}