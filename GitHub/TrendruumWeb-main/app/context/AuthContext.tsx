"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { API_V1_URL } from '@/lib/config';

interface UserInfo {
  id?: number;
  email?: string;
  name?: string;
}

interface User {
  id: string;
  email: string;
  name: string;
  lastname: string;
  gender?: string;
  role?: {
    name: string;
    type: string;
    slug: string;
  };
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface AuthContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  user: User | null;
  setUser: (user: User | null) => void;
  userInfo: UserInfo | null;
  logout: () => void;
  fetchUserInfo: (token: string) => Promise<void>;
  checkAuth: () => Promise<void>;
  showNotificationModal: boolean;
  setShowNotificationModal: (show: boolean) => void;
}

interface ApiError {
  message?: string;
  response?: {
    status: number;
    data: {
      message?: string;
      meta?: {
        message?: string;
      };
    };
  };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        await fetchUserInfo(token);
        setIsLoggedIn(true);
      } catch (error) {
        setIsLoggedIn(false);
        setUser(null);
        setUserInfo(null);
        localStorage.removeItem('token');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('user');
      }
    } else {
      setIsLoggedIn(false);
      setUser(null);
      setUserInfo(null);
    }
  }, []);

  useEffect(() => {
    checkAuth();

    // Storage event listener for cross-tab communication
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'token') {
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [checkAuth]);

  const fetchUserInfo = async (token: string) => {
    try {
      const response = await axios.get(`${API_V1_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (response.data.meta?.status === 'success') {
        const userData = response.data.data;
        setUser({
          id: userData.id,
          email: userData.email,
          name: userData.name,
          lastname: userData.lastname,
          gender: userData.gender,
          role: userData.role,
          status: userData.status,
          createdAt: userData.created_at,
          updatedAt: userData.updated_at
        });
        setUserInfo({
          id: userData.id,
          email: userData.email,
          name: userData.name
        });
        localStorage.setItem('userEmail', userData.email);
        
        // Guest ID temizleme işlemi artık BasketContext'te yapılıyor
        
        // Kullanıcı bilgileri yüklendikten sonra notification modal kontrolü
        const hasSeenModal = localStorage.getItem(`hasSeenNotificationModal_${userData.email}`);
        if (!hasSeenModal) {
          // Kısa bir gecikme ekleyerek modal'ın düzgün açılmasını sağla
          setTimeout(() => {
            setShowNotificationModal(true);
          }, 1000);
        }
      } else {
        throw new Error('Failed to fetch user info');
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      // Token yoksa direkt temizlik yap
      localStorage.removeItem('token');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('user');
      setIsLoggedIn(false);
      setUser(null);
      setUserInfo(null);
      return;
    }

    try {
      await axios.post(`${API_V1_URL}/auth/logout`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
    } catch (error: unknown) {
      const apiError = error as ApiError;
      // 404 veya başka bir hata durumunda da temizlik yap
    } finally {
      // Her durumda temizlik yap
      localStorage.removeItem('token');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('user');
      localStorage.removeItem('hasMergedGuestBasket');
      // Guest ID temizleme işlemi artık BasketContext'te yapılıyor
      setIsLoggedIn(false);
      setUser(null);
      setUserInfo(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        user,
        setUser,
        userInfo,
        logout,
        fetchUserInfo,
        checkAuth,
        showNotificationModal,
        setShowNotificationModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Optional useAuth hook - AuthProvider yoksa undefined döner
export function useAuthOptional() {
  const context = useContext(AuthContext);
  return context;
} 