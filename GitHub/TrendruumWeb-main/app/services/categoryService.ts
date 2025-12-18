import { getToken } from '../utils/auth';
import { API_V1_URL } from '@/lib/config';

const API_URL = API_V1_URL;

export interface CategoryImage {
  id: string;
  name: string;
  fullpath: string;
  url: string;
  type: string;
  updated_at: string;
  created_at: string;
}

export interface CategoryAttribute {
  id: string;
  name: string;
  slug: string;
  values: {
    name: string;
    slug: string;
  }[];
}

export interface CategoryVariant {
  id: string;
  name: string;
  slug: string;
  values: {
    name: string;
    slug: string;
    value: string;
  }[];
  imageable: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  search_word?: string;
  children: Category[];
  attributes?: CategoryAttribute[];
  variants?: CategoryVariant[];
  top_tree?: { id: string }[];
}

export interface Product {
  id: string;
  name: string;
  slug: string | null;
  price: number;
  images: CategoryImage[];
}

export interface Pagination {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface ApiResponse<T> {
  meta: {
    status: string;
    message: string;
    code: number;
  };
  data: T;
}

export interface ProductsResponse {
  data: Product[];
  pagination: Pagination;
}

class CategoryService {
  private async handleResponse(response: Response) {
 
    if (!response.ok) {
      let errorMessage = 'Bir hata oluştu';
      let errorDetails = null;
      
      try {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
          errorDetails = errorData;
        } else {
          const textResponse = await response.text();
          errorMessage = textResponse || errorMessage;
          errorDetails = { text: textResponse };
        }
      } catch (err) {
        errorDetails = { parseError: err };
      }
      

      
      throw new Error(`${errorMessage} (Status: ${response.status})`);
    }

    try {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        // API yanıt yapısını kontrol et
        if (data && typeof data === 'object') {
          // Eğer data.data yapısı varsa onu döndür
          if (data.data !== undefined) {
            return data.data;
          }
          // Eğer data.items yapısı varsa onu döndür
          if (data.items !== undefined) {
            return data.items;
          }
          // Direkt data objesini döndür
          return data;
        }
        return data;
      }
      return response.text();
    } catch (err) {
      throw new Error('API yanıtı işlenirken bir hata oluştu');
    }
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const token = getToken();
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };



    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
      });
      return await this.handleResponse(response);
    } catch (error) {
      throw error;
    }
  }

  // Tüm kategorileri getir
  async getCategories(): Promise<Category[]> {
    return this.request('/categories');
  }

  // Tek bir kategori detayını getir
  async getCategory(slug: string): Promise<Category> {
    return this.request(`/categories/${slug}`);
  }

  // Kategoriye ait ürünleri getir
  async getCategoryProducts(slug: string, page: number = 1, perPage: number = 10): Promise<ProductsResponse> {
    return this.request(`/category-products/${slug}?page=${page}&per_page=${perPage}`);
  }

  // Tek bir ürün detayını getir
  async getProduct(id: string): Promise<Product> {
    return this.request(`/products/${id}`);
  }
}

export const categoryService = new CategoryService(); 