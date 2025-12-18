import { Product } from './product';

export interface Address {
  id: string;
  userId: string;
  title: string;
  firstName: string;
  lastName: string;
  phone: string;
  city: string;
  district: string;
  neighborhood: string;
  address: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  product: Product;
  quantity: number;
  price: number;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  userId?: string;
  uuid: string;
  items: OrderItem[];
  totalPrice: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    district: string;
    phone: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface OrderResponse {
  order: Order;
  message?: string;
  error?: string;
}

export interface CreateOrderRequest {
  basketId: string;
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    district: string;
    phone: string;
  };
}

export interface UpdateOrderRequest {
  status: Order['status'];
} 