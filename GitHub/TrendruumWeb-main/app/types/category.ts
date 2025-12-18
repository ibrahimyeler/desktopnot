export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  parentId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FilterData {
  brands: string[];
  colors: string[];
  sizes: string[];
  priceRange: {
    min: number;
    max: number;
  };
  sellers: string[];
  types: string[];
} 