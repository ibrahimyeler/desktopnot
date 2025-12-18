import { getToken } from '../lib/auth';
import { API_V1_URL } from '@/lib/config';

interface BasketItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  name: string;
  image?: string;
}

interface Basket {
  id: string;
  totalPrice: number;
  items: BasketItem[];
}

interface BasketResponse {
  meta: {
    status: string;
    message: string;
    code: number;
  };
  data: Basket;
}

class BasketService {
  private baseUrl = API_V1_URL;

  private async request(endpoint: string, options: RequestInit = {}) {
    const token = await getToken();
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    };

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (data.meta?.status !== 'success') {
      throw new Error(data.meta?.message || 'Bir hata oluştu');
    }

    return data;
  }

  // Sepeti getir
  async getBasket(): Promise<BasketResponse> {
    return this.request('/customer/baskets');
  }

  // Ürün ekle
  async addToBasket(productId: string, quantity: number = 1): Promise<BasketResponse> {
    return this.request('/customer/baskets/add', {
      method: 'POST',
      body: JSON.stringify({ product_id: productId, quantity }),
    });
  }

  // Ürün güncelle
  async updateBasketItem(itemId: string, quantity: number): Promise<BasketResponse> {
    return this.request('/customer/baskets/update', {
      method: 'POST',
      body: JSON.stringify({ product_id: itemId, quantity }),
    });
  }

  // Ürün kaldır
  async removeFromBasket(itemId: string, quantity: number = 1): Promise<BasketResponse> {
    return this.request('/customer/baskets/remove', {
      method: 'POST',
      body: JSON.stringify({ product_id: itemId, quantity }),
    });
  }

  // Sepeti tamamen temizle
  async clearBasket(): Promise<BasketResponse> {
    return this.request('/customer/baskets/clear', {
      method: 'DELETE',
    });
  }
}

export const basketService = new BasketService(); 