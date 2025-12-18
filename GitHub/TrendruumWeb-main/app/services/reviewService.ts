import { getToken } from '../utils/auth';
import { API_V1_URL } from '@/lib/config';

const BASE_URL = API_V1_URL;

export interface Review {
  id: string;
  rating: number;
  comment: string;
  product_id: string;
  product_name: string;
  product_image: string;
  created_at: string;
  updated_at: string;
  status: 'pending' | 'approved' | 'rejected' | 'deleted';
}

export const reviewService = {
  // Tüm yorumları getir
  getReviews: async (type: string = 'seller') => {
    try {
      const token = getToken();
      const response = await fetch(`${BASE_URL}/customer/reviews?type=${type}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) throw new Error('Yorumlar getirilemedi');
      
      const data = await response.json();
      return data.data;
    } catch (error) {
      throw error;
    }
  },

  // Tek bir yorumu getir
  getReview: async (id: string) => {
    try {
      const token = getToken();
      const response = await fetch(`${BASE_URL}/customer/reviews/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) throw new Error('Yorum getirilemedi');
      
      const data = await response.json();
      return data.data;
    } catch (error) {
      throw error;
    }
  },

  // Yeni yorum oluştur
  createReview: async (reviewData: Partial<Review>) => {
    try {
      const token = getToken();
      if (!token) throw new Error('Yetkilendirme token\'ı bulunamadı');

      const response = await fetch(`${BASE_URL}/customer/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(reviewData)
      });
      
      if (!response.ok) {
        let errorMessage = 'Yorum oluşturulamadı';
        try {
          const errorData = await response.json();
          errorMessage += `: ${errorData.message || errorData.error || response.statusText}`;
        } catch {
          errorMessage += ` (HTTP ${response.status})`;
        }
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      return data.data;
    } catch (error) {
      throw error;
    }
  },

  // Yorum güncelle
  updateReview: async (id: string, reviewData: Partial<Review>) => {
    try {
      const token = getToken();
      const response = await fetch(`${BASE_URL}/customer/reviews/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(reviewData)
      });
      
      if (!response.ok) throw new Error('Yorum güncellenemedi');
      
      const data = await response.json();
      return data.data;
    } catch (error) {
      throw error;
    }
  },

  // Yorum sil
  deleteReview: async (id: string) => {
    try {
      const token = getToken();
      const response = await fetch(`${BASE_URL}/customer/reviews/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) throw new Error('Yorum silinemedi');
      
      return true;
    } catch (error) {
      throw error;
    }
  }
};
