export interface Category {
  id: string;
  name: string;
  slug: string;
  children?: Category[];
  parent_id?: string;
  description?: string;
  image?: string;
  status?: string;
  order?: number;
} 