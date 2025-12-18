import { Product } from '../../types/product';

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
  variants?: Record<string, string[]>; // variant slug -> selected values
  prices?: {
    min?: number;
    max?: number;
  };
}

export interface SearchData {
  products: Product[];
  filters: {
    brands: Array<{
      name: string;
      slug: string;
      id: string;
      count: number;
    }>;
    categories: Array<{
      name: string;
      slug: string;
      id: string;
      count: number;
    }>;
    variants: Array<{
      slug: string;
      name: string;
      values: Array<{
        name: string;
        slug: string;
        count?: number;
      }>;
    }>;
    attributes: Array<{
      slug: string;
      name: string;
      values: Array<{
        name: string;
        slug: string;
        count?: number;
      }>;
    }>;
  };
  searchInfo: {
    total_results: number;
  };
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface SearchPageClientProps {
  initialQuery: string;
  initialSearchData: SearchData | null;
}

export interface FilterChip {
  key: string;
  label: string;
}

