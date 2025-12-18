interface GuestBasketItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  name: string;
  image?: string;
}

interface GuestBasket {
  id: string;
  totalPrice: number;
  items: GuestBasketItem[];
}

interface GuestBasketResponse {
  meta: {
    status: string;
    message: string;
    code: number;
  };
  data: GuestBasket;
}

interface AddToBasketData {
  product_id: string;
  quantity_type: 'increment' | 'decrement' | 'set';
  quantity: number;
}

interface UpdateBasketItemData {
  product_id: string;
  quantity_type: 'increment' | 'decrement' | 'set';
  quantity: number;
}

interface RemoveFromBasketData {
  product_id: string;
  quantity_type: 'set';
  quantity: number;
}

interface RequestOptions extends RequestInit {
  data?: unknown;
}

import { API_V1_URL } from '@/lib/config';

class GuestBasketService {
  private readonly baseUrl: string;

  constructor() {
    this.baseUrl = API_V1_URL;
  }

  private async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      },
      ...(options.method === 'POST' && options.body === undefined && {
        body: JSON.stringify(options.data),
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Sepeti getir
  async getBasket(uuid: string): Promise<GuestBasketResponse> {
    return this.request<GuestBasketResponse>(`/guest/basket/${uuid}`);
  }

  // Ürün ekle
  async addToBasket(uuid: string, data: AddToBasketData): Promise<GuestBasketResponse> {
    return this.request<GuestBasketResponse>(`/guest/basket/${uuid}`, {
      method: 'POST',
      data,
    });
  }

  // Ürün güncelle
  async updateBasketItem(uuid: string, data: UpdateBasketItemData): Promise<GuestBasketResponse> {
    return this.request<GuestBasketResponse>(`/guest/basket/${uuid}`, {
      method: 'POST',
      data,
    });
  }

  // Ürün kaldır
  async removeFromBasket(uuid: string, data: RemoveFromBasketData): Promise<GuestBasketResponse> {
    return this.request<GuestBasketResponse>(`/guest/basket/${uuid}`, {
      method: 'POST',
      data,
    });
  }

  // Sepeti temizle
  async clearBasket(): Promise<GuestBasketResponse> {
    const currentItems = await this.getBasket('');
    const clearPromises = currentItems.data.items.map(item => 
      this.removeFromBasket('', { product_id: item.productId, quantity_type: 'set', quantity: 0 })
    );
    await Promise.all(clearPromises);
    return this.getBasket('');
  }
}

export const guestBasketService = new GuestBasketService(); 