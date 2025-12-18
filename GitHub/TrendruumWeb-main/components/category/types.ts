export interface Color {
  id: string;
  name: string;
  value: string;
  code: string;
  count: number;
}

export interface FilterState {
  categories?: string[];
  brands?: string[];
  colors?: string[];
  genders?: string[];
  product_stars?: string[];
  sort_fields?: string;
  sort_types?: string;
  gender?: string;
  stars?: string;
  prices?: {
    min?: number;
    max?: number;
  };
  sizes?: string[];
  sellers?: string[];
  sellerTypes?: string[];
  selectedSubcategories?: string[];
}

export interface CategoryInfo {
  name: string;
  breadcrumbPath: Array<{
    name: string;
    slug: string;
    id: string;
  }>;
  is_adult?: boolean;
}

export interface FilterChangeEvent {
  target: {
    name: string;
    value: string[] | { min?: number; max?: number };
  };
}

export interface ApiProductResponse {
  id: string;
  name: string;
  price?: number;
  stock?: number;
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
  images?: {
    name: string;
    fullpath: string;
    url: string;
  }[];
  status?: string;
  brand?: {
    name?: string;
    slug: string;
    id?: string;
  };
  brand_v2?: {
    id: string;
    name: string;
    slug: string;
    url?: string;
  };
  slug?: string;
  colors?: string[];
  sizes?: string[];
  gender?: string;
  rating?: number;
  review_count?: number;
  soldCount?: string;
  badges?: {
    fast_shipping?: boolean;
    cargo_free?: boolean;
    same_day?: boolean;
    new_product?: boolean;
    best_selling?: boolean;
  };
  specialTag?: string;
  discount_rate?: number;
  parent_id?: string;
  original_price?: number;
  campaign_price?: number;
  discount_percentage?: number;
  campaign_type?: string;
  campaign_settings?: {
    buy_quantity?: number;
    pay_quantity?: number;
  };
  main_product_id?: string;
  product_group_id?: string;
  variant_group_id?: string;
  seller?: {
    id: string;
    name: string;
    slug: string;
    shipping_policy?: {
      general: {
        delivery_time: number;
        shipping_fee: number;
        free_shipping_threshold: number;
        carrier: string;
      };
      custom: any[];
    };
  };
  seller_v2?: {
    id: string;
    name: string;
    slug: string;
    url?: string;
  };
  variants?: Array<{
    slug: string;
    name: string;
    value_name: string;
    value_slug: string;
    imageable: boolean;
  }>;
}

export interface CategoryWithDetails {
  id: string;
  name: string;
  slug: string;
  children?: CategoryWithDetails[];
  shipping_policy?: string;
  breadcrumb?: CategoryWithDetails[];
  parent?: CategoryWithDetails;
  is_adult?: boolean;
}

export interface CategoryPageClientProps {
  category: string;
  initialCategoryData: any;
  initialProducts: any;
  initialSubCategories: any[];
  categoryExists?: boolean;
}

