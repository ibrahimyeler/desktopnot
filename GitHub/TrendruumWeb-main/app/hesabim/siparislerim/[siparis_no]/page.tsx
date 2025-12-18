import React from 'react';
import OrderDetailPageClient from './OrderDetailPageClient';

interface Media {
  name: string;
  fullpath: string;
  url: string;
  type: string;
  updated_at: string;
  created_at: string;
  id: string;
}

interface Seller {
  name: string;
  slug: string;
  id: string;
}

interface Brand {
  name: string;
  slug: string;
  id: string;
}

interface Product {
  name: string;
  price: number;
  medias: Media | Media[];
  slug: string;
  seller?: Seller;
  brand?: Brand;
  updated_at: string;
  created_at: string;
  id: string;
}

interface OrderGroupItem {
  order_group_id: string;
  product_id: string;
  quantity: number;
  price: number;
  product: Product;
  updated_at: string;
  created_at: string;
  id: string;
}

interface Address {
  title: string;
  city: {
    name: string;
    slug: string;
    id: string;
  };
  district: {
    name: string;
    slug: string;
    id: string;
  };
  neighborhood: {
    name: string;
    slug: string;
    id: string;
  };
  description: string;
}

interface Invoice {
  type: 'individual' | 'corporate';
}

interface OrderAddress {
  firstname: string;
  lastname: string;
  phone: string;
  invoice: Invoice;
  address: Address;
  updated_at: string;
  created_at: string;
  id: string;
}

interface OrderGroup {
  order_id: string;
  status: string;
  address: OrderAddress;
  payment: any[];
  total_price: number;
  order_group_items: OrderGroupItem[];
  id: string;
  ogid?: number;
  order_number?: string;
  tracking_number?: string;
}

interface Order {
  user_id: string;
  status: string;
  payment: any[];
  address: OrderAddress;
  total_price: number;
  order_groups: OrderGroup[];
  id: string;
  order_number?: string;
  created_at: string;
  updated_at: string;
}

// Server-side data fetching functions
async function getOrderDetails(siparisNo: string): Promise<Order | null> {
  try {
    const axios = require('axios');
    
    // Note: In a real application, you would get the token from cookies or session
    // For now, we'll return null and let the client component handle the API call
    // This means the initial render will have no order data
    // The client component will fetch the data when it loads
    
    return null;
  } catch (_error) {
    return null;
  }
}

async function getReturnRequests(): Promise<any[] | null> {
  try {
    // Server-side'da token'a erişim olmadığı için bu fonksiyon şimdilik boş bırakıldı.
    // Client-side'da localStorage'dan token alınıp fetch işlemi yapılacak.
    return null;
  } catch (_error) {
    return null;
  }
}

async function getOrderQuestions(): Promise<any[] | null> {
  try {
    // Server-side'da token'a erişim olmadığı için bu fonksiyon şimdilik boş bırakıldı.
    // Client-side'da localStorage'dan token alınıp fetch işlemi yapılacak.
    return null;
  } catch (_error) {
    return null;
  }
}

async function getFollowedStores(): Promise<any[] | null> {
  try {
    // Server-side'da token'a erişim olmadığı için bu fonksiyon şimdilik boş bırakıldı.
    // Client-side'da localStorage'dan token alınıp fetch işlemi yapılacak.
    return null;
  } catch (_error) {
    return null;
  }
}

// Server component
export default async function OrderDetailPage({ params }: { params: Promise<{ siparis_no: string }> }) {
  const { siparis_no: siparisNo } = await params;
  
  // Server-side data fetching
  const [initialOrder, initialReturnRequests, initialOrderQuestions, initialFollowedStores] = await Promise.all([
    getOrderDetails(siparisNo),
    getReturnRequests(),
    getOrderQuestions(),
    getFollowedStores()
  ]);

  return (
    <OrderDetailPageClient 
      siparisNo={siparisNo}
      initialOrder={initialOrder}
      initialReturnRequests={initialReturnRequests}
      initialOrderQuestions={initialOrderQuestions}
      initialFollowedStores={initialFollowedStores}
    />
  );
}
