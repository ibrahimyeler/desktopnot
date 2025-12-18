import { Product } from '../../../types/product';

/**
 * API'den gelen ürünü Product tipine formatlar
 */
export function formatApiProduct(apiProduct: any): Product {
  // Slug oluştur
  let productSlug = apiProduct.slug;
  if (!productSlug) {
    productSlug = apiProduct.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .trim();
  }

  // Marka bilgisini al
  let brandInfo = null;
  if (apiProduct.brand_v2) {
    brandInfo = {
      id: apiProduct.brand_v2.id,
      name: apiProduct.brand_v2.name,
      slug: apiProduct.brand_v2.slug,
      url: apiProduct.brand_v2.url || `/markalar/${apiProduct.brand_v2.slug}`,
      status: 'active'
    };
  } else if (apiProduct.brand) {
    brandInfo = {
      id: apiProduct.brand.id || apiProduct.brand_id,
      name: apiProduct.brand.name,
      slug: apiProduct.brand.slug,
      url: `/markalar/${apiProduct.brand.slug}`,
      status: 'active'
    };
  }

  return {
    id: apiProduct.id,
    name: apiProduct.name,
    slug: productSlug,
    price: apiProduct.price || 0,
    original_price: apiProduct.original_price || apiProduct.price || 0,
    campaign_price: apiProduct.campaign_price,
    discount_percentage: apiProduct.discount_percentage,
    campaign_type: apiProduct.campaign_type,
    campaign_settings: apiProduct.campaign_settings,
    stock: apiProduct.stock || 10,
    status: apiProduct.status || 'active',
    rating: apiProduct.average_rating || apiProduct.rating || 0,
    reviewCount: apiProduct.review_count || 0,
    review_count: apiProduct.review_count || 0,
    like_count: 0,
    comment_count: 0,
    view_count: 0,
    point_count: 0,
    sold_count: 0,
    point_count_total: 0,
    point_count_user_total: 0,
    share_count: 0,
    tax: 0,
    is_adult: apiProduct.is_adult === true || (apiProduct.is_adult !== undefined && String(apiProduct.is_adult).toLowerCase() === 'true') || false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: (apiProduct.medias || apiProduct.images || []).map((img: any) => ({
      url: img.url,
      name: img.name,
      id: img.id || img.name
    })),
    variants: apiProduct.variants || [],
    badges: {
      fast_shipping: apiProduct.badges?.fast_shipping || false,
      free_shipping: apiProduct.badges?.cargo_free || false,
      same_day: apiProduct.badges?.same_day || false,
      new_product: apiProduct.badges?.new_product || false,
      best_selling: apiProduct.badges?.best_selling || false
    },
    brand: brandInfo || undefined,
    seller: apiProduct.seller_v2 ? {
      id: apiProduct.seller_v2.id,
      name: apiProduct.seller_v2.name,
      slug: apiProduct.seller_v2.slug,
      phone: '',
      status: 'active',
      category_sold: '',
      company_type: 'individual',
      tax_number: '',
      reference_code: '',
      accept_term: true,
      shipping_policy: apiProduct.seller?.shipping_policy || {
        general: {
          delivery_time: 3,
          shipping_fee: 0,
          free_shipping_threshold: 150,
          carrier: 'Yurtiçi Kargo'
        },
        custom: []
      },
      addresses: []
    } : {
      id: apiProduct.seller?.id || '0',
      name: apiProduct.seller?.name || '',
      slug: apiProduct.seller?.slug || null,
      phone: '',
      status: 'active',
      category_sold: '',
      company_type: 'individual',
      tax_number: '',
      reference_code: '',
      accept_term: true,
      shipping_policy: apiProduct.seller?.shipping_policy || {
        general: {
          delivery_time: 3,
          shipping_fee: 0,
          free_shipping_threshold: 150,
          carrier: 'Yurtiçi Kargo'
        },
        custom: []
      },
      addresses: []
    }
  } as Product;
}

/**
 * Products array'ini parse eder ve formatlar
 */
export function parseAndFormatProducts(searchData: any): Product[] {
  let productsArray: any[] = [];
  if (searchData.products) {
    if (Array.isArray(searchData.products)) {
      productsArray = searchData.products;
    } else if (searchData.products.data && Array.isArray(searchData.products.data)) {
      productsArray = searchData.products.data;
    }
  }

  const formattedProducts = productsArray.map(formatApiProduct);

  // Duplicate ürünleri temizle (aynı ID'ye sahip ürünler)
  return formattedProducts.filter((product, index, self) =>
    index === self.findIndex((p) => p.id === product.id)
  );
}

