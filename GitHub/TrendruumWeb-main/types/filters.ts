// Filtre API'den gelen veri tipleri
export interface FilterValue {
  slug: string;
  name: string;
  count: number;
}

export interface FilterAttribute {
  id: string;
  name: string;
  slug: string;
  type: 'attribute';
  usage_key: string;
  values: FilterValue[];
}

export interface FilterVariant {
  id: string;
  name: string;
  slug: string;
  type: 'variant';
  usage_key: string;
  values: FilterValue[];
}

export interface FilterData {
  attributes: FilterAttribute[];
  variants: FilterVariant[];
}

export interface FilterResponse {
  meta: {
    status: string;
    message: string;
    code: number;
  };
  data: {
    seller: {
      id: string;
      name: string;
      slug: string;
    };
    filters: FilterData;
    total_products: number;
    filter_usage: {
      attributes_example: string;
      variants_example: string;
    };
  };
}

// Filtre state tipleri
export interface FilterState {
  categories?: string[];
  brands?: string[];
  colors?: string[];
  genders?: string[];
  selectedSubcategories?: string[];
  product_stars?: string[];
  prices?: {
    min?: number;
    max?: number;
  };
  attributes?: Record<string, string[]>; // attribute slug -> value slugs
  variants?: Record<string, string[]>;   // variant slug -> value slugs
  sort_fields?: string;
  sort_types?: string;
}

// Filtre kullanım örneği
export interface FilterUsage {
  attributes_example: string;
  variants_example: string;
}
