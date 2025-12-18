import { getToken } from '../utils/auth';
import { API_V1_URL } from '@/lib/config';

const API_URL = API_V1_URL;

export interface ProductQuestion {
  id: string;
  product_id: string;
  product_name: string;
  product_image: string;
  question: string;
  answer?: string;
  status: 'pending' | 'answered' | 'rejected';
  created_at: string;
  updated_at: string;
}

class ProductQuestionService {
  private async handleResponse(response: Response) {
    // Response detaylarını logla


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
      
      // Hata detaylarını logla

      
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

  // Kullanıcının ürün sorularını getir
  async getUserProductQuestions(): Promise<ProductQuestion[]> {
    // Farklı endpoint'leri dene
    try {
      return await this.request('/customer/product-questions');
    } catch (error) {
      try {
        return await this.request('/customer/questions/user-product-question');
      } catch (secondError) {
        throw secondError;
      }
    }
  }

  // Tek bir ürün sorusunu getir
  async getUserProductQuestion(id: string): Promise<ProductQuestion> {
    try {
      return await this.request(`/customer/product-questions/${id}`);
    } catch (error) {
      try {
        return await this.request(`/customer/questions/user-product-question/${id}`);
      } catch (secondError) {
        throw secondError;
      }
    }
  }

  // Yeni ürün sorusu oluştur
  async createUserProductQuestion(data: Partial<ProductQuestion>): Promise<ProductQuestion> {
    try {
      return await this.request('/customer/product-questions', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    } catch (error) {
      try {
        return await this.request('/customer/questions', {
          method: 'POST',
          body: JSON.stringify(data),
        });
      } catch (secondError) {
        throw secondError;
      }
    }
  }

  // Ürün sorusunu güncelle
  async updateUserProductQuestion(id: string, data: Partial<ProductQuestion>): Promise<ProductQuestion> {
    try {
      return await this.request(`/customer/product-questions/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    } catch (error) {
      try {
        return await this.request(`/customer/questions/user-product-question/${id}`, {
          method: 'PUT',
          body: JSON.stringify(data),
        });
      } catch (secondError) {
        throw secondError;
      }
    }
  }

  // Ürün sorusunu sil
  async deleteUserProductQuestion(id: string): Promise<void> {
    try {
      return await this.request(`/customer/product-questions/${id}`, {
        method: 'DELETE',
      });
    } catch (error) {
      try {
        return await this.request(`/customer/questions/user-product-question/${id}`, {
          method: 'DELETE',
        });
      } catch (secondError) {
        throw secondError;
      }
    }
  }
}

export const productQuestionService = new ProductQuestionService(); 