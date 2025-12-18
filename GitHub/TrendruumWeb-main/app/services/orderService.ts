import { getToken } from '../lib/auth';
import { API_V1_URL } from '@/lib/config';

interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  name: string;
  image?: string;
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  totalPrice: number;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

interface OrderResponse {
  meta: {
    status: string;
    message: string;
    code: number;
  };
  data: Order;
}

interface OrdersResponse {
  meta: {
    status: string;
    message: string;
    code: number;
  };
  data: {
    items: Order[];
    pagination: {
      total: number;
      perPage: number;
      currentPage: number;
      lastPage: number;
    };
  };
}

// Guest sipariş için interface
interface GuestOrderResponse {
  meta: {
    status: string;
    message: string;
    code: number;
  };
  data: {
    id: string;
    user_id: string;
    user_type: string;
    status: string;
    payment: {
      post_url: string;
      status: string;
      inputs: Record<string, string>;
    };
    address: any;
    total_price: number;
    created_at: string;
    updated_at: string;
    order_groups: any[];
  };
}

class OrderService {
  private baseUrl = API_V1_URL;

  private async request(endpoint: string, options: RequestInit = {}): Promise<OrderResponse | OrdersResponse> {
    const token = await getToken();
    
    if (!token) {
      throw new Error('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
    }
    
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
      if (response.status === 401 || response.status === 403) {
        throw new Error('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (data.meta?.status !== 'success') {
      throw new Error(data.meta?.message || 'Bir hata oluştu');
    }

    return data;
  }

  // Guest sipariş oluşturma
  async createGuestOrder(addressId: string, guestId: string, payment: any): Promise<GuestOrderResponse> {
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Guest-ID': guestId,
    };

    const response = await fetch(`${this.baseUrl}/orders`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        address_id: addressId,
        payment: payment
      })
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

  // Tüm siparişleri getir
  async getOrders(page: number = 1, perPage: number = 10): Promise<OrdersResponse> {
    return this.request(`/customer/orders?page=${page}&per_page=${perPage}`) as Promise<OrdersResponse>;
  }

  // Sipariş detayını getir
  async getOrder(orderId: string): Promise<OrderResponse> {
    return this.request(`/customer/orders/${orderId}`) as Promise<OrderResponse>;
  }

  // Yeni sipariş oluştur (Customer)
  async createOrder(addressId: string, basketId: string, totalAmount: number, cartItems: any[]): Promise<OrderResponse> {
    try {
      return this.request('/customer/orders', {
        method: 'POST',
        body: JSON.stringify({
          basket_id: basketId,
          address_id: addressId,
          payment: {
            card_type: "credit_card",
            card_number: "1234567890123456",
            expiry_month: "12",
            expiry_year: "2025",
            cvv: "123"
          }
        })
      }) as Promise<OrderResponse>;
    } catch (error) {
      if (error instanceof Error && error.message.includes('401')) {
        throw new Error('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
      }
      throw error;
    }
  }
}

export const orderService = new OrderService(); 