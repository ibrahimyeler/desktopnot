interface ShippingPolicy {
  delivery_time: number;
  shipping_fee: number;
  free_shipping_threshold: number;
  carrier: string;
}

interface Seller {
  id: string;
  name: string;
  slug: string;
  shipping_policy: {
    general: ShippingPolicy;
    custom: {
      [key: string]: ShippingPolicy & {
        city: {
          name: string;
          slug: string;
          id: string;
        };
      };
    };
  };
}

interface ProductMedia {
  name: string;
  fullpath: string;
  url: string;
  type: string;
  id: string;
  created_at: string;
}

interface ProductVariant {
  name: string;
  slug: string;
  imageable: boolean;
  description: string;
  values: Array<{
    name: string;
    slug: string;
    value: string;
  }>;
  selected?: {
    name: string;
    slug: string;
    value: string;
  };
  id: string;
}

interface ProductAttribute {
  name: string;
  type: string;
  required: boolean;
  inputType: string;
  values: Array<{
    name: string;
    slug: string;
  }>;
  selected?: {
    name: string;
    slug: string;
  };
  slug: string;
  id: string;
}

interface Brand {
  ty_id: string;
  name: string;
  status: string;
  slug: string;
  url: string;
  id: string;
}

interface Category {
  name: string;
  image: {
    name: string;
    fullpath: string;
    url: string;
    type: string;
  };
  commission_rate: number;
  slug: string;
  id: string;
}

export interface Product {
  id: string;
  name: string;
  model_code?: string;
  description?: string;
  barcode?: string;
  price: number;
  discounted_price?: number | null;
  stock: number;
  like_count: number;
  comment_count: number;
  view_count: number;
  point_count: number;
  point_count_total: number;
  point_count_user_total: number;
  share_count: number;
  stock_code?: string;
  tax: number;
  status: string;
  parent_id?: string;
  slug: string;
  updated_at: string;
  created_at: string;
  variants?: ProductVariant[];
  attributes?: ProductAttribute[];
  medias?: ProductMedia[];
  brand?: Brand;
  category?: Category;
  seller?: {
    id: string;
    name: string;
    phone: string;
    status: string;
    category_sold: string;
    company_type: string;
    tax_number: string;
    reference_code: string;
    accept_term: boolean;
    shipping_policy: {
      general: {
        delivery_time: number;
        shipping_fee: number;
        free_shipping_threshold: number;
        carrier: string;
      };
      custom: any[];
    };
    addresses: Array<{
      country: {
        name: string;
        code: string;
        slug: string;
        id: string;
      };
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
      id: string;
    }>;
  };
  // Legacy fields for backward compatibility
  images?: {
    name: string;
    fullpath: string;
    url: string;
  }[];
  colors?: string[];
  sizes?: string[];
  gender?: string;
  rating?: number;
  average_rating?: number;
  review_count?: number;
  reviewCount?: number;
  soldCount?: string;
  badges?: {
    fast_shipping?: boolean;
    free_shipping?: boolean;
    same_day?: boolean;
    new_product?: boolean;
    best_selling?: boolean;
  };
  specialTag?: string;
  discount_rate?: number;
  is_adult?: boolean;
}

export interface CartItem {
  id: string;
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}
