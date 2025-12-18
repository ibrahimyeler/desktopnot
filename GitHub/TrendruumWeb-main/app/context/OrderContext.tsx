"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios, { AxiosError } from 'axios';
import { useAuth } from './AuthContext';
import { toast } from 'react-hot-toast';
import { API_V1_URL } from '@/lib/config';

const BASE_URL = API_V1_URL;

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface Order {
  id: string;
  items: OrderItem[];
  totalPrice: number;
  status: string;
  createdAt: string;
}

interface OrderData {
  items: Array<{
    product_id: string;
    quantity: number;
  }>;
  shipping_address: {
    address: string;
    city: string;
    state: string;
    zip_code: string;
    country: string;
  };
  payment_method: string;
}

interface OrderContextType {
  orders: Order[];
  currentOrder: Order | null;
  loading: boolean;
  error: string | null;
  getOrders: () => Promise<void>;
  getOrder: (orderId: string) => Promise<void>;
  createOrder: (addressId: string, payment: { oid: string }) => Promise<void>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isLoggedIn } = useAuth();

  const getOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      
      if (isLoggedIn) {
        const token = localStorage.getItem('token');
        
        if (!token) {
          setError('No token found');
          toast.error('Oturum bilgileri bulunamadı');
          return;
        }


        try {
          const response = await axios.get(`${BASE_URL}/customer/orders`, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Accept': 'application/json'
            }
          });

          if (response.data.meta?.status === 'success') {
            setOrders(response.data.data);
          } else {
            setError('Invalid response format');
            toast.error('Siparişler alınamadı');
          }
        } catch (error) {
          if (error instanceof AxiosError) {
            if (error.response) {
          
              setError(`API Error: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}`);
              toast.error(`Sipariş bilgileri alınamadı: ${error.response.status}`);
            } else {
              setError('Network error');
              toast.error('Bağlantı hatası');
            }
          } else {
            setError('Unknown error');
            toast.error('Bilinmeyen bir hata oluştu');
          }
          throw error;
        }
      } else {
        // Misafir kullanıcılar için sipariş listesi boş olmalı
        setOrders([]);
      }
    } catch (error) {
      setError('Failed to fetch orders');
      toast.error('Siparişler alınamadı');
    } finally {
      setLoading(false);
    }
  }, [isLoggedIn]);

  const getOrder = async (orderId: string) => {
    try {
      setLoading(true);
      setError(null);

      if (isLoggedIn) {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }

        const response = await axios.get(`${BASE_URL}/customer/orders/${orderId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });

        if (response.data.meta?.status === 'success') {
          setCurrentOrder(response.data.data);
        }
      } else {
        // Misafir kullanıcılar için sipariş detayı görüntülenemez
        setCurrentOrder(null);
        toast.error('Sipariş detaylarını görüntülemek için giriş yapmalısınız');
      }
    } catch (error) {
      setError('Failed to fetch order');
      toast.error('Sipariş detayları alınamadı');
    } finally {
      setLoading(false);
    }
  };

  const createOrder = async (addressId: string, payment: { oid: string }) => {
    try {
      setLoading(true);
      setError(null);

      if (isLoggedIn) {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }

        const response = await axios.post(
          `${BASE_URL}/customer/orders`,
          {
            address_id: addressId,
            payment: {
              oid: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              payment_amount: '100.00', // Bu değer dinamik olarak hesaplanmalı
              currency: 'TL',
              test_mode: '1', // Test modu aktif
              non_3d: '0', // 3D Secure kullan
              merchant_ok_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://trendruum.bixcod.dev'}/basarili`,
              merchant_fail_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://trendruum.bixcod.dev'}/basarisiz`,
              user_name: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}').name || 'Kullanıcı' : 'Kullanıcı',
              user_address: JSON.stringify({
                title: "Teslimat Adresi",
                city: { name: "İstanbul", slug: "istanbul" },
                district: { name: "Kadıköy", slug: "kadikoy" },
                neighborhood: { name: "Fenerbahçe", slug: "fenerbahce" },
                description: "Teslimat adresi"
              }),
              user_phone: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}').phone || '' : '',
              user_basket: JSON.stringify([
                ['Ürün', '100.00', 1]
              ]),
              debug_on: '1',
              client_lang: 'tr',
              non3d_test_failed: '0',
              installment_count: '0',
              card_type: ''
            }
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Accept': 'application/json'
            }
          }
        );

        if (response.data.meta?.status === 'success') {
          setOrders([...orders, response.data.data]);
          toast.success('Sipariş başarıyla oluşturuldu');
        }
      } else {
        const response = await axios.post(
          `${BASE_URL}/orders`,
          {
            address_id: addressId,
            payment: {
              oid: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              payment_amount: '100.00', // Bu değer dinamik olarak hesaplanmalı
              currency: 'TL',
              test_mode: '1', // Test modu aktif
              non_3d: '0', // 3D Secure kullan
              merchant_ok_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://trendruum.bixcod.dev'}/basarili`,
              merchant_fail_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://trendruum.bixcod.dev'}/basarisiz`,
              user_name: 'Misafir Kullanıcı',
              user_address: JSON.stringify({
                title: "Teslimat Adresi",
                city: { name: "İstanbul", slug: "istanbul" },
                district: { name: "Kadıköy", slug: "kadikoy" },
                neighborhood: { name: "Fenerbahçe", slug: "fenerbahce" },
                description: "Teslimat adresi"
              }),
              user_phone: '',
              user_basket: JSON.stringify([
                ['Ürün', '100.00', 1]
              ]),
              debug_on: '1',
              client_lang: 'tr',
              non3d_test_failed: '0',
              installment_count: '0',
              card_type: ''
            }
          }
        );

        if (response.data.meta?.status === 'success') {
          setOrders([...orders, response.data.data]);
          toast.success('Sipariş başarıyla oluşturuldu');
        }
      }
    } catch (error) {
      setError('Failed to create order');
      toast.error('Sipariş oluşturulamadı');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getOrders();
  }, [getOrders]);

  return (
    <OrderContext.Provider
      value={{
        orders,
        currentOrder,
        loading,
        error,
        getOrders,
        getOrder,
        createOrder
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
} 