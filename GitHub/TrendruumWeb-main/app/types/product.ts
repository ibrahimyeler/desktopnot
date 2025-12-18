export interface Brand {
  id: string;
  name: string;
  slug: string;
}

export interface ProductImage {
  id: string;
  productId: string;
  url: string;
  isMain: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  price?: number;
  images?: { url: string }[];
  medias?: {
    name: string;
    fullpath: string;
    url: string;
    type: string;
    updated_at: string;
    created_at: string;
    id: {
      $oid: string;
    };
  }[];
  seller?: {
    name: string;
    shipping_policy?: {
      general: {
        shipping_fee: number;
        carrier: string;
        delivery_time: number;
      };
    };
  };
  slug?: string;
  rating?: {
    average: number;
    count: number;
  };
  reviews?: {
    total: number;
    questions: number;
    answers: number;
  };
  viewCount?: number;
  installment?: {
    count: number;
    price: number;
  };
  category_id?: string;
  created_at?: string;
  updated_at?: string;
  stock?: number;
  colors?: string[];
  sizes?: string[];
  gender?: string;
  seller_id?: string;
  seller_type?: string;
  freeShipping?: boolean;
  isNew?: boolean;
  discount?: number;
  originalPrice?: number;
  like_count?: number;
  badges?: {
    same_day?: boolean;
    cargo_free?: boolean;
  };
  view?: number;
  cpid?: number;
}

export interface ProductResponse {
  product: Product;
  message?: string;
  error?: string;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  message?: string;
  error?: string;
} 