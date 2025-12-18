import { Product } from './product';

export interface BasketItem {
  id: string;
  basketId: string;
  productId: string;
  product: Product;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface Basket {
  id: string;
  userId?: string;
  uuid: string;
  items: BasketItem[];
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
}

export interface BasketResponse {
  basket: Basket;
  message?: string;
  error?: string;
}

export interface AddToBasketRequest {
  productId: string;
  quantity: number;
}

export interface UpdateBasketItemRequest {
  itemId: string;
  quantity: number;
}

export interface RemoveFromBasketRequest {
  itemId: string;
} 