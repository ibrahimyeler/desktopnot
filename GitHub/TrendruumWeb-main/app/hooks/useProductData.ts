import { useState, useEffect, useCallback } from 'react';
import { API_V1_URL } from '@/lib/config';

interface ProductData {
  product: any;
  variants: any[];
  reviews: any[];
  questions: any[];
  loading: boolean;
  error: string | null;
}

interface UseProductDataReturn extends ProductData {
  refetchProduct: () => Promise<void>;
  refetchVariants: () => Promise<void>;
  refetchReviews: () => Promise<void>;
  refetchQuestions: () => Promise<void>;
}

export const useProductData = (productSlug: string, productId?: string): UseProductDataReturn => {
  const [product, setProduct] = useState<any>(null);
  const [variants, setVariants] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cache for API responses
  const [cache, setCache] = useState<{
    product?: any;
    variants?: any[];
    reviews?: any[];
    questions?: any[];
  }>({});

  const fetchProduct = useCallback(async () => {
    try {
      // Check cache first
      if (cache.product) {
        setProduct(cache.product);
        return cache.product;
      }

      const response = await fetch(`${API_V1_URL}/products/${productSlug}`);
      const data = await response.json();

      if (data?.meta?.status === 'success') {
        const apiData = data.data as any;
        
        const productData = {
          ...apiData,
          images: apiData.medias?.map((media: any) => ({
            id: media.id?.$oid || media.id,
            url: media.url,
            alt: media.name || apiData.name
          })) || [],
          brand: apiData.brand_v2 ? {
            ty_id: apiData.brand_v2.id,
            name: apiData.brand_v2.name,
            slug: apiData.brand_v2.slug,
            url: apiData.brand_v2.url || `/markalar/${apiData.brand_v2.slug}`,
            status: 'active',
            id: apiData.brand_v2.id
          } : apiData.brand,
          seller: apiData.seller_v2 ? {
            ty_id: apiData.seller_v2.id,
            name: apiData.seller_v2.name,
            slug: apiData.seller_v2.slug,
            url: apiData.seller_v2.url || `/magaza/${apiData.seller_v2.slug}`,
            shipping_policy: apiData.seller?.shipping_policy || {
              general: {
                delivery_time: 3,
                shipping_fee: 0,
                free_shipping_threshold: 0,
                carrier: 'Yurtiçi Kargo'
              },
              custom: {}
            }
          } : apiData.seller,
          category: apiData.category_v2 ? {
            ty_id: apiData.category_v2.id,
            name: apiData.category_v2.name,
            slug: apiData.category_v2.slug,
            url: apiData.category_v2.url || `/${apiData.category_v2.slug}`,
            is_adult: apiData.category?.is_adult || false
          } : apiData.category
        };

        setProduct(productData);
        setCache(prev => ({ ...prev, product: productData }));
        setError(null);
        
        return productData;
      } else {
        setError('Ürün bilgileri yüklenirken bir hata oluştu');
        return null;
      }
    } catch (error) {
      setError('Ürün bilgileri yüklenirken bir hata oluştu');
      return null;
    }
  }, [productSlug, cache.product]);

  const fetchVariants = useCallback(async (targetProductId?: string) => {
    try {
      const productIdToUse = targetProductId || product?.id;
      
      if (!productIdToUse) {
        return;
      }

      // Check cache first
      if (cache.variants) {
        setVariants(cache.variants);
        return cache.variants;
      }

      const response = await fetch(`${API_V1_URL}/products/${productIdToUse}/variants`);
      const data = await response.json();

      if (data?.meta?.status === 'success') {
        setVariants(data.data);
        setCache(prev => ({ ...prev, variants: data.data }));
        return data.data;
      }
    } catch (error) {
    }
  }, [product?.id, cache.variants]);

  const fetchReviews = useCallback(async () => {
    try {
      // Check cache first
      if (cache.reviews) {
        setReviews(cache.reviews);
        return cache.reviews;
      }

      const token = localStorage.getItem('token');
      const cleanSlug = productSlug.replace(/-\d+$/, '');
      
      const response = await fetch(`/api/product-reviews?productSlug=${cleanSlug}&productId=${productId || product?.id || ''}`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data?.meta?.status === 'success') {
          setReviews(data.data);
          setCache(prev => ({ ...prev, reviews: data.data }));
          return data.data;
        }
      }
      setReviews([]);
    } catch (error) {
      setReviews([]);
    }
  }, [productSlug, productId, product?.id, cache.reviews]);

  const fetchQuestions = useCallback(async () => {
    try {
      if (!product?.id) {
        setQuestions([]);
        return;
      }

      // Check cache first
      if (cache.questions) {
        setQuestions(cache.questions);
        return cache.questions;
      }

      const response = await fetch(`${API_V1_URL}/products/${product.id}/questions`);
      const data = await response.json();

      if (data?.meta?.status === 'success' && data.data) {
        const transformedQuestions = data.data.map((item: any) => ({
          id: item.id,
          question: item.question,
          answer: item.answer,
          userName: item.user?.name || '**** ****',
          date: new Date(item.created_at).toLocaleDateString('tr-TR', {
            year: 'numeric',
            month: 'long', 
            day: 'numeric'
          }),
          isAnswered: item.answered === true || !!item.answer,
          category: item.type || 'general',
          likes: item.likes || 0,
          dislikes: item.dislikes || 0
        }));

        setQuestions(transformedQuestions);
        setCache(prev => ({ ...prev, questions: transformedQuestions }));
        return transformedQuestions;
      } else {
        setQuestions([]);
      }
    } catch (error) {
      setQuestions([]);
    }
  }, [product?.id, cache.questions]);

  // Initial data fetch
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      
      // Fetch product first
      const productData = await fetchProduct();
      
      if (productData) {
        // Then fetch variants using product ID
        await fetchVariants(productData.id);
      }
      
      // Fetch reviews and questions in parallel
      await Promise.all([
        fetchReviews(),
        fetchQuestions()
      ]);
      
      setLoading(false);
    };

    if (productSlug) {
      loadData();
    }
  }, [productSlug]);

  // Refetch functions
  const refetchProduct = useCallback(async () => {
    setCache(prev => ({ ...prev, product: undefined }));
    await fetchProduct();
  }, [fetchProduct]);

  const refetchVariants = useCallback(async () => {
    setCache(prev => ({ ...prev, variants: undefined }));
    await fetchVariants();
  }, [fetchVariants]);

  const refetchReviews = useCallback(async () => {
    setCache(prev => ({ ...prev, reviews: undefined }));
    await fetchReviews();
  }, [fetchReviews]);

  const refetchQuestions = useCallback(async () => {
    setCache(prev => ({ ...prev, questions: undefined }));
    await fetchQuestions();
  }, [fetchQuestions]);

  return {
    product,
    variants,
    reviews,
    questions,
    loading,
    error,
    refetchProduct,
    refetchVariants,
    refetchReviews,
    refetchQuestions
  };
};
