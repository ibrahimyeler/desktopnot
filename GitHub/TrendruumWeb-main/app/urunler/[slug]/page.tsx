import React from 'react';
import ProductPageClient from './ProductPageClient';

const API_BASE_URL = 'https://api.trendruum.com/api/v1';

const defaultHeaders: HeadersInit = {
  Accept: 'application/json',
  'Content-Type': 'application/json'
};

async function fetchWithTimeout(
  input: string,
  init: RequestInit = {},
  timeoutMs = 3000
): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(id);
  }
}

// Server-side data fetching functions
async function getProductData(slug: string) {
  try {
    const tryFetch = async (slugLike: string) => {
      const response = await fetchWithTimeout(
        `${API_BASE_URL}/products/${slugLike}`,
        {
          method: 'GET',
          headers: defaultHeaders
        },
        3000
      );

      if (!response.ok) {
        return { ok: false as const, status: response.status, data: null as any };
      }

      const data = await response.json();
      if (data.meta?.status === 'success') {
        return { ok: true as const, status: response.status, data: data.data };
      }

      return { ok: false as const, status: response.status, data: null as any };
    };

    // Önce slug ile dene (ana endpoint)
    let result = await tryFetch(slug);
    if (result.ok) {
      return result.data;
    }

    // Eğer slug ile başarısız olursa, temizlenmiş slug ile dene
    const cleanSlug = slug.replace(/-\d+$/, '');
    if (cleanSlug !== slug) {
      result = await tryFetch(cleanSlug);
      if (result.ok) {
        return result.data;
      }
    }

    if (result.status === 404) {
      return null;
    }

    if (result.status >= 500) {
      return null;
    }

    return null;
  } catch (error: any) {
    // Timeout veya diğer hata durumlarını handle et
    if (
      error?.name === 'AbortError' ||
      error?.code === 'ECONNABORTED' ||
      error?.message?.includes('timeout')
    ) {
      return null; // Client-side'da fetch edilecek
    }

    return null;
  }
}

async function getProductVariants(productId: string) {
  if (!productId) return [];
  try {
    const response = await fetchWithTimeout(
      `${API_BASE_URL}/products/${productId}/variants`,
      {
        method: 'GET',
        headers: defaultHeaders
      },
      3000
    );

    if (!response.ok) {
      if (response.status >= 500) {
     
      }
      return [];
    }

    const data = await response.json();
    if (data.meta?.status === 'success' && data.data && data.data.length > 0) {
      return data.data;
    }
    return [];
  } catch (error: any) {
    // Timeout veya hata durumunda graceful fallback
    if (
      error?.name === 'AbortError' ||
      error?.code === 'ECONNABORTED' ||
      error?.message?.includes('timeout')
    ) {
      return [];
    }

    return [];
  }
}

async function getProductReviews(productId: string) {
  if (!productId) return [];
  try {
    const response = await fetchWithTimeout(
      `${API_BASE_URL}/products/${productId}/reviews?page=1&limit=10`,
      {
        method: 'GET',
        headers: defaultHeaders
      },
      3000
    );

    if (!response.ok) {
      if (response.status >= 500) {
      
      }
      return [];
    }

    const data = await response.json();
    if (data.meta?.status === 'success') {
      return data.data || [];
    }
    return [];
  } catch (error: any) {
    // Timeout veya hata durumunda graceful fallback
    if (
      error?.name === 'AbortError' ||
      error?.code === 'ECONNABORTED' ||
      error?.message?.includes('timeout')
    ) {
    } else {
    }
    return [];
  }
}

async function getProductQuestions(productId: string) {
  if (!productId) return [];
  try {
    const response = await fetchWithTimeout(
      `${API_BASE_URL}/products/${productId}/questions?page=1&limit=10`,
      {
        method: 'GET',
        headers: defaultHeaders
      },
      3000
    );

    if (!response.ok) {
      if (response.status >= 500) {
     
      }
      return [];
    }

    const data = await response.json();
    if (data.meta?.status === 'success') {
      return data.data || [];
    }
    return [];
  } catch (error: any) {
    // Timeout veya hata durumunda graceful fallback
    if (
      error?.name === 'AbortError' ||
      error?.code === 'ECONNABORTED' ||
      error?.message?.includes('timeout')
    ) {
    } else {
    }
    return [];
  }
}

async function getRelatedProducts(productId: string) {
  if (!productId) {
    return [];
  }
  try {
    const response = await fetchWithTimeout(
      `${API_BASE_URL}/products/${productId}/related`,
      {
        method: 'GET',
        headers: defaultHeaders
      },
      5000
    );

    if (!response.ok) {
      // Handle 404 errors silently - endpoint doesn't exist
      if (response.status === 404) {
        return [];
      }

      return [];
    }

    const data = await response.json();
    if (data.meta?.status === 'success') {
      return data.data || [];
    }
    return [];
  } catch (error: any) {
    return [];
  }
}

// getOtherSellers SSR'dan çıkarıldı - client-side'da yüklenecek

// Server component
export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // Server-side data fetching - get product data first to get the correct ID
  // Sadece zorunlu verileri SSR'da çek: product detay, reviews, questions
  const productData = await getProductData(slug);

  // Use the product ID from the response for reviews, questions, and variants
  const productId = productData?.id;

  // Variantları da SSR'da çek - paralel fetch ile hızlı yükleme
  const [reviews, questions, variants] = await Promise.all([
    getProductReviews(productId),
    getProductQuestions(productId),
    // Variantları sadece ürün variant'ları varsa çek
    productData?.variants && productData.variants.length > 0 
      ? getProductVariants(productId) 
      : Promise.resolve([])
  ]);

  // İsteğe bağlı veriler (related products, other sellers) client-side'da yüklenecek
  // Bu sayede SSR hızlı tamamlanır ve kullanıcı sayfayı hemen görür
  return (
    <ProductPageClient
      productSlug={slug}
      initialProductData={productData}
      initialReviews={reviews}
      initialQuestions={questions}
      initialRelatedProducts={[]}
      initialOtherSellers={[]}
      initialVariants={variants}
    />
  );
}
