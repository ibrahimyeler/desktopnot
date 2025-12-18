import React from 'react';
import CheckoutPageClient from './CheckoutPageClient';
import { cookies } from 'next/headers';

interface UserProfile {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  birth_date?: string;
  gender?: string;
  created_at: string;
  updated_at: string;
}

interface Address {
  id: string;
  title: string;
  firstname: string;
  lastname: string;
  phone: string;
  city: {
    id: string;
    name: string;
    slug: string;
  };
  district: {
    id: string;
    name: string;
    slug: string;
  };
  neighborhood: {
    id: string;
    name: string;
    slug: string;
  };
  description: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

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

interface CheckoutData {
  userProfile: UserProfile | null;
  addresses: Address[];
  basket: Basket | null;
}

// Server-side data fetching functions
async function getUserProfile(token: string): Promise<UserProfile | null> {
  try {
    if (!token) return null;
    
    const axios = require('axios');
    const response = await axios.get('https://api.trendruum.com/api/v1/customer/profile/me', {
      timeout: 10000,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      validateStatus: function (status: number) {
        // 4xx ve 5xx hatalarını da başarılı say (sonra handle edeceğiz)
        return status >= 200 && status < 600;
      }
    });

    // 404, 401, 403 veya 500 ise null döndür (guest kullanıcı veya geçersiz token)
    if (response.status === 404 || response.status === 401 || response.status === 403 || response.status >= 500) {
      return null;
    }

    if (response.data?.meta?.status === 'success' && response.data.data) {
      return response.data.data;
    }
    
    return null;
  } catch (error: any) {
    // AxiosError veya diğer hatalar için null döndür
    // Guest kullanıcılar için bu normal bir durum
    if (error?.response?.status === 500 || error?.response?.status === 401 || error?.response?.status === 403) {
      return null;
    }
    // Diğer hatalar için de null döndür (network hatası vs.)
    return null;
  }
}

async function getUserAddresses(token: string): Promise<Address[]> {
  try {
    if (!token) return [];
    
    const axios = require('axios');
    const response = await axios.get('https://api.trendruum.com/api/v1/customer/addresses', {
      timeout: 10000,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      validateStatus: function (status: number) {
        // 5xx hatalarında bile response objesini döndürmeye devam et
        return status >= 200 && status < 600;
      }
    });

    // 404, 401, 403 veya 500 ise boş array döndür (guest kullanıcı veya geçersiz token)
    if (response.status === 404 || response.status === 401 || response.status === 403 || response.status >= 500) {
      return [];
    }

    if (response.data?.meta?.status === 'success' && response.data.data) {
      return response.data.data;
    }
    
    return [];
  } catch (error: any) {
    // AxiosError veya diğer hatalar için boş array döndür
    // Guest kullanıcılar için bu normal bir durum
    if (error?.response?.status === 500 || error?.response?.status === 401 || error?.response?.status === 403) {
      return [];
    }
    // Diğer hatalar için de boş array döndür (network hatası vs.)
    return [];
  }
}

async function getBasketData(token: string): Promise<Basket | null> {
  try {
    const axios = require('axios');
    
    if (!token) {
      // Guest basket için guest basket API'sini çağır
      // Server-side'da guest ID'yi alamayız, bu yüzden boş basket döndür
      // Client-side'da BasketContext guest basket'i yükleyecek
      return {
        id: 'guest',
        basket_groups: [],
        total_price: 0,
        total_items: 0
      };
    }

    // Customer basket için
    const response = await axios.get('https://api.trendruum.com/api/v1/customer/baskets', {
      timeout: 10000,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      validateStatus: function (status: number) {
        // 5xx hatalarında bile response objesini döndürmeye devam et
        return status >= 200 && status < 600;
      }
    });

    // 404, 401, 403 veya 500 ise guest basket döndür
    if (response.status === 404 || response.status === 401 || response.status === 403 || response.status >= 500) {
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
    
    return {
      id: 'guest',
      basket_groups: [],
      total_price: 0,
      total_items: 0
    };
  } catch (error: any) {
    // AxiosError veya diğer hatalar için guest basket döndür
    // Guest kullanıcılar için bu normal bir durum
    return {
      id: 'guest',
      basket_groups: [],
      total_price: 0,
      total_items: 0
    };
  }
}

async function getCheckoutData(token: string): Promise<CheckoutData> {
  try {
    const [userProfile, addresses, basket] = await Promise.all([
      getUserProfile(token),
      getUserAddresses(token),
      getBasketData(token)
    ]);

    return {
      userProfile,
      addresses,
      basket
    };
  } catch (error) {
    return {
      userProfile: null,
      addresses: [],
      basket: null
    };
  }
}

// Server component
export default async function CheckoutPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value || '';
  
  const checkoutData = await getCheckoutData(token);
  
  return (
    <CheckoutPageClient 
      initialCheckoutData={checkoutData}
      initialToken={token}
    />
  );
}