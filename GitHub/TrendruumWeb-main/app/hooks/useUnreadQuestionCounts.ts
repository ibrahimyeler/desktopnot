"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { API_V1_URL } from '@/lib/config';
import { useAuth } from '@/app/context/AuthContext';

interface UnreadCounts {
  product: number;
  order: number;
}

export const useUnreadQuestionCounts = (pollInterval = 120000) => {
  const { isLoggedIn } = useAuth();
  const [counts, setCounts] = useState<UnreadCounts>({ product: 0, order: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const updateCountsSafely = useCallback((updater: (prev: UnreadCounts) => UnreadCounts) => {
    if (isMountedRef.current) {
      setCounts(updater);
    }
  }, []);

  const fetchCounts = useCallback(async () => {
    if (!isLoggedIn) {
      updateCountsSafely(() => ({ product: 0, order: 0 }));
      return;
    }

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      updateCountsSafely(() => ({ product: 0, order: 0 }));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const headers: HeadersInit = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      };

      const [productResponse, orderResponse] = await Promise.all([
        fetch(`${API_V1_URL}/customer/questions/user-product-question`, { headers }),
        fetch(`${API_V1_URL}/customer/questions/user-order-question`, { headers }),
      ]);

      const [productData, orderData] = await Promise.all([
        productResponse.ok ? productResponse.json() : Promise.resolve(null),
        orderResponse.ok ? orderResponse.json() : Promise.resolve(null),
      ]);

      const productItems: any[] = Array.isArray(productData?.data) ? productData.data : [];
      const orderItemsRaw: any[] = Array.isArray(orderData?.data) ? orderData.data : [];

      const productQuestions = productItems.filter((item) => !item?.order);
      const hasOrderField = orderItemsRaw.some((item) => item?.order);
      const orderItems = hasOrderField ? orderItemsRaw.filter((item) => item.order) : orderItemsRaw;

      const productUnread = productQuestions.filter(
        (item) => item?.status === 'pending' || !item?.answer
      ).length;

      const orderUnread = orderItems.filter(
        (item) => item?.status === 'pending' || !item?.answer
      ).length;

      updateCountsSafely(() => ({
        product: productUnread,
        order: orderUnread,
      }));
    } catch (err) {
      setError('Unread question counts could not be loaded');
      updateCountsSafely(() => ({ product: 0, order: 0 }));
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [isLoggedIn, updateCountsSafely]);

  useEffect(() => {
    fetchCounts();

    if (!pollInterval) {
      return;
    }

    const intervalId = setInterval(() => {
      fetchCounts();
    }, pollInterval);

    return () => {
      clearInterval(intervalId);
    };
  }, [fetchCounts, pollInterval]);

  return {
    unreadProductCount: counts.product,
    unreadOrderCount: counts.order,
    totalUnreadCount: counts.product + counts.order,
    loading,
    error,
    refresh: fetchCounts,
  };
};

