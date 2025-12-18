"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product } from '@/app/types/product';
import { useAuth } from './AuthContext';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { API_V1_URL } from '@/lib/config';

interface FavoriteContextType {
  favorites: Product[];
  loading: boolean;
  error: string | null;
  addToFavorites: (productId: string) => Promise<void>;
  removeFavorite: (productId: string) => Promise<void>;
  refreshFavorites: () => Promise<void>;
  isInFavorites: (productId: string) => boolean;
  favoritesCount: number;
  incrementFavoritesCount: () => void;
  decrementFavoritesCount: () => void;
}

const FavoriteContext = createContext<FavoriteContextType | undefined>(undefined);

export function FavoriteProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isLoggedIn } = useAuth();
  const [favoritesCount, setFavoritesCount] = useState(0);

  const isInFavorites = (productId: string) => {
    return favorites.some(favorite => favorite.id === productId);
  };

  const refreshFavorites = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (!isLoggedIn) {
        // Login olmamış kullanıcılar için favorileri temizle
        setFavorites([]);
        setFavoritesCount(0);
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token bulunamadı');
      }

      const response = await axios.get(`${API_V1_URL}/customer/likes`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (response.data.meta?.status === 'success') {
        // API'den gelen veriyi Product interface'ine uygun hale getir
        const formattedFavorites = response.data.data.map((item: any) => {
          // Handle different media structures
          let medias = [];
          let images = [];
          
          if (item.medias && Array.isArray(item.medias)) {
            // Standard medias array structure
            medias = item.medias;
            images = item.medias.map((media: any) => ({ url: media.url }));
          } else {
            // Handle numbered keys structure (0, 1, 2, etc.)
            const mediaKeys = Object.keys(item).filter(key => 
              /^\d+$/.test(key) && item[key] && typeof item[key] === 'object' && item[key].url
            );
            
            if (mediaKeys.length > 0) {
              medias = mediaKeys.map(key => item[key]);
              images = mediaKeys.map(key => ({ url: item[key].url }));
            }
          }

          return {
            id: item.id,
            name: item.name,
            slug: item.slug,
            price: item.price || 0,
            medias: medias,
            images: images,
            like_count: item.like_count,
            badges: item.badges,
            view: item.view,
            cpid: item.cpid,
            created_at: item.created_at,
            updated_at: item.updated_at
          };
        });
        
        setFavorites(formattedFavorites);
        setFavoritesCount(formattedFavorites.length);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      setError('Failed to refresh favorites');
      
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        // Token geçersiz, favorileri temizle
        localStorage.removeItem('token');
        setFavorites([]);
        setFavoritesCount(0);
      } else {
        toast.error('Favoriler yüklenirken bir hata oluştu');
      }
    } finally {
      setLoading(false);
    }
  }, [isLoggedIn]);

  const addToFavorites = async (productId: string) => {
    try {
      setLoading(true);
      setError(null);

      if (!isLoggedIn) {
        throw new Error('Kullanıcı giriş yapmamış');
      }

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token bulunamadı');
      }

      const response = await axios.post(
        `${API_V1_URL}/customer/likes`,
        { product_id: productId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Accept': 'application/json'
          }
        }
      );

      if (response.data.meta?.status === 'success') {
        await refreshFavorites();
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      setError('Failed to add to favorites');
      
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        // Token geçersiz, kullanıcıyı login sayfasına yönlendir
        localStorage.removeItem('token');
        window.location.href = '/giris';
      } else if (error instanceof Error && error.message === 'Kullanıcı giriş yapmamış') {
        // Kullanıcı giriş yapmamış, bu durumda toast mesajı gösterme
        // Çünkü bu durum zaten component seviyesinde yönetiliyor
      } else {
        toast.error('Ürün favorilere eklenirken bir hata oluştu');
      }
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (productId: string) => {
    try {
      setLoading(true);
      setError(null);

      if (!isLoggedIn) {
        throw new Error('Kullanıcı giriş yapmamış');
      }

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token bulunamadı');
      }

      const response = await axios.delete(
        `${API_V1_URL}/customer/likes/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Accept': 'application/json'
          }
        }
      );

      if (response.data.meta?.status === 'success') {
        await refreshFavorites();
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      setError('Failed to remove from favorites');
      
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        // Token geçersiz, kullanıcıyı login sayfasına yönlendir
        localStorage.removeItem('token');
        window.location.href = '/giris';
      } else if (error instanceof Error && error.message === 'Kullanıcı giriş yapmamış') {
        // Kullanıcı giriş yapmamış, bu durumda toast mesajı gösterme
        // Çünkü bu durum zaten component seviyesinde yönetiliyor
      } else {
        toast.error('Ürün favorilerden kaldırılırken bir hata oluştu');
      }
    } finally {
      setLoading(false);
    }
  };

  const incrementFavoritesCount = () => {
    setFavoritesCount(prev => prev + 1);
  };

  const decrementFavoritesCount = () => {
    setFavoritesCount(prev => Math.max(0, prev - 1));
  };

  useEffect(() => {
    refreshFavorites();
  }, [refreshFavorites]);

  return (
    <FavoriteContext.Provider
      value={{
        favorites,
        loading,
        error,
        addToFavorites,
        removeFavorite,
        refreshFavorites,
        isInFavorites,
        favoritesCount,
        incrementFavoritesCount,
        decrementFavoritesCount
      }}
    >
      {children}
    </FavoriteContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoriteContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoriteProvider');
  }
  return context;
}

// Optional version - context yoksa fallback değerler döner
export function useFavoritesOptional() {
  const context = useContext(FavoriteContext);
  if (!context) {
    // Fallback değerler
    return {
      favorites: [],
      loading: false,
      error: null,
      addToFavorites: async () => {},
      removeFavorite: async () => {},
      refreshFavorites: async () => {},
      isInFavorites: () => false,
      favoritesCount: 0,
      incrementFavoritesCount: () => {},
      decrementFavoritesCount: () => {}
    };
  }
  return context;
}
