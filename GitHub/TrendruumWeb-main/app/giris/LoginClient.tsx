"use client"

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { PhoneIcon, LockClosedIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import Header from '@/components/layout/Header';
import ScrollToTop from '@/components/ui/ScrollToTop';
import { useRouter } from 'next/navigation';
import { API_V1_URL } from '@/lib/config';

interface LoginError {
  message: string;
}

interface ApiError {
  message?: string;
  status?: number;
}

const LoginClient = () => {
  // Tek alan: e-posta veya telefon
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<LoginError | null>(null);
  const { setIsLoggedIn, fetchUserInfo } = useAuth();
  const router = useRouter();
  
  // Swipe gesture states
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const switchRef = useRef<HTMLDivElement>(null);

  const handleBackNavigation = useCallback(() => {
    // Register sayfasıyla aynı davranış: varsa bir önceki sayfaya dön, yoksa ana sayfa
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  }, [router]);

  // Swipe gesture functions
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    setIsDragging(true);
    setDragOffset(0);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!touchStart || !isDragging) return;
    
    const currentX = e.targetTouches[0].clientX;
    const distance = touchStart - currentX;
    
    // Switch genişliğinin yarısı kadar maksimum kaydırma
    const maxOffset = 100; // Yaklaşık switch genişliğinin yarısı
    const clampedOffset = Math.max(-maxOffset, Math.min(maxOffset, distance));
    
    setDragOffset(clampedOffset);
    setTouchEnd(currentX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) {
      setIsDragging(false);
      setDragOffset(0);
      return;
    }
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    setIsDragging(false);
    setDragOffset(0);

    if (isLeftSwipe) {
      // Swipe left - go to signup
      setIsAnimating(true);
      setTimeout(() => {
        router.push('/kayit-ol');
      }, 300);
    } else if (isRightSwipe) {
      // Swipe right - stay on login (already here)
      setIsAnimating(true);
      setTimeout(() => {
        setIsAnimating(false);
      }, 300);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    try {
      // Giriş türünü belirle: email mi telefon mu?
      const isEmail = /@/.test(identifier.trim());

      // Telefonu normalize et (0XXXXXXXXXX formatı)
      const normalizePhone = (input: string) => {
        const digits = input.replace(/[^\d]/g, '');
        if (digits.startsWith('0090') && digits.length >= 13) {
          return '0' + digits.slice(4, 14);
        }
        if (digits.startsWith('90') && digits.length >= 12) {
          return '0' + digits.slice(2, 12);
        }
        if (digits.startsWith('0') && digits.length >= 11) {
          return digits.slice(0, 11);
        }
        return digits; // doğrulama aşağıda yapılır
      };

      let endpoint = `${API_V1_URL}/auth/login`;
      let body: Record<string, unknown> = { password, device_name: 'web' };

      const doLogin = async (url: string, payload: Record<string, unknown>) => {
        const res = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        });
        const json = await res.json().catch(() => ({}));
        return { res, json } as { res: Response; json: any };
      };

      let response: Response;
      let data: any;

      if (isEmail) {
        body.email = identifier.trim();
        const r = await doLogin(endpoint, body);
        response = r.res;
        data = r.json;
      } else {
        const cleanedPhone = normalizePhone(identifier);
        const phoneRegex = /^0\d{10}$/;
        if (!phoneRegex.test(cleanedPhone)) {
          setLoginError({ message: 'Geçerli bir telefon veya e-posta giriniz. (Telefon: 11 hane, örn: 05459092349)' });
          return;
        }
        // 1) Telefonla müşteri login dene
        const primaryUrl = `${API_V1_URL}/customer/auth/login`;
        const primary = await doLogin(primaryUrl, { ...body, phone: cleanedPhone });

        if (primary.res.ok) {
          response = primary.res;
          data = primary.json;
        } else {
          // 2) Fallback: Genel login endpoint'inde phone alanı ile dene
          const fallbackUrl = `${API_V1_URL}/auth/login`;
          const fallback = await doLogin(fallbackUrl, { ...body, phone: cleanedPhone });
          response = fallback.res;
          data = fallback.json;
        }
      }

      // 'data' değişkeni yukarıda dolduruldu

      if (!response.ok) {
        // API'den gelen hata mesajını göster
        const errorMessage = data.meta?.message || data.message || 'Giriş yapılamadı';
        setLoginError({ message: errorMessage });
        return;
      }

      if (data.meta?.status === 'success' && data.data?.access_token) {
        const token = data.data.access_token;
        
        // Token'ı hem localStorage hem cookie'ye kaydet
        localStorage.setItem('token', token);
        document.cookie = `token=${token}; path=/; max-age=2592000`; // 30 gün
        
        if (data.data.user) {
          localStorage.setItem('user', JSON.stringify(data.data.user));
          // userEmail'i de kaydet (eğer varsa)
          if (data.data.user.email) {
            localStorage.setItem('userEmail', data.data.user.email);
          }
        }
        
        await fetchUserInfo(token);
        setIsLoggedIn(true);
        
        // Ana sayfaya yönlendir
        router.push('/');
        return;
      }

      // Başarılı response ama token yok
      setLoginError({ message: data.meta?.message || 'Giriş yapılamadı. Lütfen bilgilerinizi kontrol edin.' });
    } catch (error: unknown) {
      const apiError = error as ApiError;
      setLoginError({ 
        message: apiError.message || 'Bir hata oluştu. Lütfen tekrar deneyin.'
      });
    }
  };

  return (
    <>
      {/* Desktop Header */}
      <div className="hidden md:block">
      <Header />
      </div>
      
      {/* Mobile Layout */}
      <div className="md:hidden min-h-screen bg-gradient-to-br from-orange-100 via-orange-200 to-red-200">
        {/* Mobile Header - Modern Gradient Background */}
        <div className="relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-200 via-orange-300 to-red-300 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-t from-white/30 via-transparent to-white/20 pointer-events-none"></div>
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-20 translate-x-20 blur-xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-16 -translate-x-16 blur-xl pointer-events-none"></div>
            <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-white/5 rounded-full blur-lg pointer-events-none"></div>
            <div className="absolute top-1/3 right-1/3 w-16 h-16 bg-white/10 rounded-full blur-md pointer-events-none"></div>
          </div>
          
          {/* Header Content */}
          <div className="relative px-4 py-4 flex items-center">
            <button
              type="button"
              onClick={handleBackNavigation}
              className="md:hidden mr-3 flex items-center justify-center rounded-md border border-white/70 bg-white/80 p-2 text-gray-600 shadow-sm transition-colors duration-200 hover:bg-white hover:text-gray-900 z-20 pointer-events-auto"
              aria-label="Geri"
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </button>
            <div className="bg-white/30 backdrop-blur-sm rounded-xl p-2">
              <svg width="120" height="42" viewBox="0 0 184 65" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-8 w-auto">
                  <path d="M108.645 47.4155V50.4336C107.367 50.3665 106.26 50.618 105.323 51.1881C104.386 51.7582 103.909 52.7139 103.909 54.0385V60.5274H100.57V47.6503H103.909V49.8132C104.744 48.2204 106.328 47.4155 108.645 47.4155Z" fill="black"/>
                  <path d="M147.473 47.6838V54.5583C147.473 55.799 147.166 56.738 146.535 57.3416C145.922 57.9452 145.104 58.247 144.099 58.247C143.094 58.247 142.447 57.9955 141.918 57.4757C141.39 56.956 141.118 56.235 141.118 55.2625V47.667H138.255V55.5308C138.255 57.1739 138.733 58.465 139.67 59.404C140.607 60.3429 141.833 60.8124 143.367 60.8124C144.9 60.8124 146.621 60.1585 147.49 58.8339V60.4771H150.352V47.667H147.49L147.473 47.6838Z" fill="black"/>
                  <path d="M125.699 47.6838V54.5583C125.699 55.799 125.393 56.738 124.762 57.3416C124.149 57.9452 123.331 58.247 122.326 58.247C121.321 58.247 120.673 57.9955 120.145 57.4757C119.617 56.956 119.344 56.235 119.344 55.2625V47.667H116.482V55.5308C116.482 57.1739 116.959 58.465 117.896 59.404C118.833 60.3429 120.06 60.8124 121.593 60.8124C123.127 60.8124 124.847 60.1585 125.716 58.8339V60.4771H128.578V47.667H125.716L125.699 47.6838Z" fill="black"/>
                  <path d="M179.553 48.6732C178.582 47.7175 177.287 47.248 175.686 47.248C174.084 47.248 172.313 47.9355 171.358 49.2936C170.49 47.9355 169.161 47.248 167.355 47.248C165.549 47.248 164.22 47.8852 163.317 49.1427V47.5834H160.267V60.5108H163.317V53.2674C163.317 52.144 163.607 51.3057 164.186 50.7188C164.765 50.1488 165.532 49.8469 166.452 49.8469C167.372 49.8469 167.951 50.0985 168.411 50.5847C168.871 51.0709 169.11 51.7752 169.11 52.6638V60.4941H172.159V53.2507C172.159 52.1105 172.432 51.2554 172.994 50.6853C173.556 50.1152 174.306 49.8302 175.243 49.8302C176.18 49.8302 176.759 50.0817 177.253 50.5679C177.747 51.0542 177.986 51.7584 177.986 52.6471V60.4773H181.035V52.4626C181.035 50.853 180.541 49.5787 179.57 48.6397L179.553 48.6732Z" fill="black"/>
                  <path d="M23.2385 49.8469V47.684H20.5978V60.5108H23.2385V53.7033C23.2385 52.2949 23.6985 51.2889 24.6356 50.6517C25.5726 50.0146 26.68 49.7295 27.9748 49.7798V47.4492C25.6919 47.4492 24.1244 48.2373 23.2556 49.8301L23.2385 49.8469Z" fill="black"/>
                  <path d="M67.5518 48.7737C66.5636 47.8347 65.2348 47.3652 63.5992 47.3652C61.9636 47.3652 60.0385 48.0862 59.0503 49.5282V47.7006H56.614V60.4268H59.0503V53.6864C59.0503 52.2612 59.4251 51.2049 60.1748 50.5174C60.9244 49.83 61.9125 49.4947 63.1222 49.4947C64.3318 49.4947 65.0644 49.7797 65.6777 50.3498C66.2911 50.9199 66.5977 51.7247 66.5977 52.7642V60.4603H69.034V52.6469C69.034 51.0372 68.5399 49.7629 67.5518 48.8072V48.7737Z" fill="black"/>
                  <path d="M88.5073 42.5197V49.8637C87.434 48.1702 85.8666 47.3151 83.8051 47.3151C81.7436 47.3151 80.5851 47.969 79.3584 49.2768C78.1318 50.5847 77.5184 52.1775 77.5184 54.0722C77.5184 55.9669 78.1318 57.5598 79.3584 58.8676C80.5851 60.1754 82.0673 60.8294 83.8051 60.8294C85.5429 60.8294 87.434 59.9742 88.5073 58.2808V60.494H90.671V42.5029H88.5073V42.5197ZM87.2466 57.3586C86.3947 58.2472 85.3555 58.6832 84.0947 58.6832C82.834 58.6832 81.8118 58.2472 80.9599 57.3586C80.1081 56.4867 79.6821 55.3801 79.6821 54.089C79.6821 52.7979 80.1081 51.6913 80.9599 50.8194C81.8118 49.9308 82.851 49.4948 84.0947 49.4948C85.3384 49.4948 86.4118 49.9308 87.2466 50.8194C88.0984 51.7081 88.5244 52.7979 88.5244 54.089C88.5244 55.3801 88.0984 56.4867 87.2466 57.3586Z" fill="black"/>
                  <path d="M45.7274 56.4867C45.5911 56.822 45.4208 57.1406 45.1993 57.4089C44.4496 58.3311 43.3422 58.8005 41.9111 58.8005C40.48 58.8005 39.7133 58.482 38.9126 57.8616C38.4356 57.4927 38.0437 57.0232 37.7711 56.4532C37.4815 55.8663 37.3622 55.1956 37.3622 54.5417V54.1896H47.9593C47.9593 52.3284 47.38 50.7523 46.2045 49.4277C45.0289 48.1031 43.5296 47.4492 41.6896 47.4492C39.8496 47.4492 38.163 48.0864 36.9363 49.3607C35.7096 50.635 35.0963 52.2446 35.0963 54.1561C35.0963 56.0675 35.7267 57.7107 36.9704 58.9682C38.2141 60.2425 39.8326 60.8797 41.8259 60.8797C43.8193 60.8797 46.1363 59.9239 47.363 57.9957C47.9082 57.258 47.9422 56.4028 47.9422 56.4028H45.7274C45.7274 56.4196 45.7104 56.4531 45.6934 56.4699L45.7274 56.4867ZM38.7933 50.5511C39.56 49.8804 40.5311 49.5451 41.7067 49.5451C42.8822 49.5451 43.5978 49.8637 44.3474 50.4841C44.9608 50.9871 45.3867 51.6913 45.6252 52.58H37.5156C37.7541 51.7584 38.18 51.0709 38.7933 50.5344V50.5511Z" fill="black"/>
                  <path d="M8.38219 49.4779V56.671C8.38219 57.3249 8.51848 57.7943 8.80811 58.0626C9.0807 58.3309 9.52367 58.4818 10.1029 58.4818C10.6822 58.4818 11.3977 58.4818 12.2496 58.4315V60.5106C10.0518 60.7789 8.4333 60.6112 7.39404 60.0244C6.37182 59.4375 5.8607 58.3141 5.8607 56.6542V49.4611H2.98145V47.2311H5.8607V43.5088H8.38219V47.2311H12.2496V49.4611H8.38219V49.4779Z" fill="black"/>
                  <path d="M130.861 17.2687C130.861 24.8307 124.643 30.9506 116.959 30.9506C109.276 30.9506 103.057 24.8307 103.057 17.2687C103.057 9.70674 109.276 3.60352 116.959 3.60352C124.643 3.60352 130.861 9.72351 130.861 17.2687Z" fill="#EC6D04"/>
                  <path d="M84.3844 17.2687C84.3844 24.8307 78.1659 30.9506 70.4822 30.9506C62.7985 30.9506 56.58 24.8307 56.58 17.2687C56.58 9.70674 62.7985 3.60352 70.4822 3.60352C78.1659 3.60352 84.3844 9.72351 84.3844 17.2687Z" fill="#F9AF02"/>
                  <path d="M108.219 17.2687C108.219 24.8307 102.001 30.9506 94.317 30.9506C86.6333 30.9506 80.4148 24.8307 80.4148 17.2687C80.4148 9.70674 86.6333 3.60352 94.317 3.60352C102.001 3.60352 108.219 9.72351 108.219 17.2687Z" fill="black"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Mobile Content */}
        <div className="px-4 py-6 relative">
          {/* Content Background */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-white/20 pointer-events-none"></div>
          
          {/* Mobile Form */}
          <div className="relative z-10 max-w-md mx-auto w-full">
            {/* Hoş Geldiniz Mesajı */}
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Trendruum'a hoş geldiniz</h1>
              <p className="text-gray-600 text-sm">Hesabınıza giriş yapın veya yeni hesap oluşturun</p>
            </div>
            
            {/* Giriş ve Üye Ol Switch */}
            <div className="mb-6">
              <div 
                ref={switchRef}
                className={`bg-white/95 backdrop-blur-sm rounded-2xl p-1 transition-all duration-300 ${
                  isAnimating ? 'scale-95 opacity-80' : 'scale-100 opacity-100'
                }`}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
              >
                <div className="flex relative">
                  {/* Active Background */}
                  <div 
                    className="absolute top-1 w-1/2 h-[calc(100%-8px)] bg-gradient-to-r from-orange-500 to-red-500 rounded-xl transition-transform duration-300 ease-in-out"
                    style={{
                      left: isDragging ? `${8 + dragOffset}px` : '8px',
                      transform: isDragging ? `translateX(${dragOffset}px)` : 'translateX(0)',
                      transition: isDragging ? 'none' : 'transform 0.3s ease-in-out'
                    }}
                  ></div>
                  
                  <button 
                    onClick={() => router.push('/giris')}
                    className="flex-1 text-center py-3 px-4 rounded-xl text-white font-semibold relative z-10 transition-colors duration-300"
                  >
                    Giriş Yap
                  </button>
                  <button 
                    onClick={() => router.push('/kayit-ol')}
                    className="flex-1 text-center py-3 px-4 rounded-xl text-gray-600 font-semibold relative z-10 transition-colors duration-300 hover:text-orange-500"
                  >
                    Üye Ol
                  </button>
                </div>
              </div>
            </div>

            {/* Hata mesajı */}
            {loginError && (
              <div className="mb-4 p-3 rounded-md bg-red-50 text-red-500 text-sm">
                {loginError.message}
              </div>
            )}
            
            <form className="space-y-4" onSubmit={handleSubmit} method="POST">
            <div>
              <input
                id="mobile-identifier"
                name="identifier"
                type="text"
                autoComplete="username"
                required
                placeholder="E-posta veya Telefon"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-black"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
              />
            </div>

            <div className="relative">
              <input
                id="mobile-password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                placeholder="Şifre"
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-black"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                {showPassword ? (
                  <svg 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    className="h-5 w-5 text-gray-400 hover:text-gray-600"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path 
                      d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" 
                      stroke="currentColor" 
                      strokeWidth="1.5" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <svg 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    className="h-5 w-5 text-gray-400 hover:text-gray-600"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path 
                      d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" 
                      stroke="currentColor" 
                      strokeWidth="1.5" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                    <path 
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
                      stroke="currentColor" 
                      strokeWidth="1.5" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </button>
            </div>

            <div className="flex justify-end">
              <Link 
                href="/sifremi-unuttum" 
                className="text-sm text-orange-500 hover:text-orange-600"
              >
                Şifremi unuttum
              </Link>
            </div>

            <button
              type="submit"
              className="w-full bg-orange-500 text-white py-3 px-4 rounded-lg font-semibold text-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              GİRİŞ YAP
            </button>
            </form>
          </div>

          {/* Mobile Footer */}
        
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:block min-h-screen bg-gray-50 flex flex-col justify-center py-8 sm:py-12 lg:py-16 xl:py-20 px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        <div className="sm:mx-auto sm:w-full sm:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl">
          <h1 className="text-center text-lg sm:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-normal text-gray-800">
            Merhaba,
          </h1>
          <p className="mt-2 sm:mt-3 lg:mt-4 text-center text-sm sm:text-base lg:text-lg xl:text-xl text-gray-800">
            Trendruum&apos;e giriş yap veya hesap oluştur, indirimleri kaçırma!
          </p>
        </div>

        <div className="mt-6 sm:mt-8 lg:mt-10 xl:mt-12 sm:mx-auto sm:w-full sm:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl">
          <div className="bg-white py-6 sm:py-8 lg:py-10 xl:py-12 px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 rounded-lg border border-gray-200">
            {/* Hata mesajı */}
            {loginError && (
              <div className="mb-4 p-3 rounded-md bg-red-50 text-red-500 text-sm">
                {loginError.message}
              </div>
            )}

            <div className="flex justify-center space-x-8 mb-8">
              <button 
                onClick={() => router.push('/giris')}
                className="text-xl font-semibold text-black hover:text-orange-500 transition-colors border-b-2 border-orange-500 pb-2"
              >
                Giriş Yap
              </button>
              <button 
                onClick={() => router.push('/kayit-ol')}
                className="text-xl font-semibold text-black hover:text-orange-500 transition-colors pb-2"
              >
                Üye Ol
              </button>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit} method="POST">
              <div>
                <label htmlFor="identifier" className="block text-sm font-medium text-black">
                  E-posta veya Telefon
                </label>
                <div className="mt-1 relative">
                  <input
                    id="identifier"
                    name="identifier"
                    type="text"
                    autoComplete="username"
                    required
                    placeholder=""
                    className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-black"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                  />
                  <PhoneIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-black">
                  Şifre
                </label>
                <div className="mt-1 relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    className="appearance-none block w-full px-3 py-2 pl-10 pr-10 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-black"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <LockClosedIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showPassword ? (
                      <svg 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        className="h-5 w-5 text-gray-400 hover:text-gray-600"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path 
                          d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" 
                          stroke="currentColor" 
                          strokeWidth="1.5" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : (
                      <svg 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        className="h-5 w-5 text-gray-400 hover:text-gray-600"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path 
                          d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" 
                          stroke="currentColor" 
                          strokeWidth="1.5" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                        />
                        <path 
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
                          stroke="currentColor" 
                          strokeWidth="1.5" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="flex justify-end mb-4">
                <div className="text-sm">
                  <Link 
                    href="/sifremi-unuttum" 
                    className="font-normal text-black hover:text-orange-500 border-b border-gray-300"
                  >
                    Şifremi unuttum
                  </Link>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                >
                  Giriş Yap
                </button>
              </div>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-gray-300" />
                </div>
              </div>

                          {/* Facebook ve Google butonları geçici olarak devre dışı
            <div className="mt-6 grid grid-cols-2 gap-4">
              <button 
                className="w-full inline-flex items-center py-3 px-4 rounded-md transition-colors border border-gray-200 hover:border-orange-500"
              >
                <div className="bg-[#1b4f9b] p-1 rounded w-6 h-6 flex items-center justify-center">
                  <span className="text-white font-bold text-xl">f</span>
                </div>
                <div className="flex flex-col ml-3">
                  <span className="text-sm font-medium text-black">Facebook</span>
                  <span className="text-xs text-gray-500">ile giriş yap</span>
                </div>
              </button>
              <button 
                className="w-full inline-flex items-center py-3 px-4 rounded-md transition-colors border border-gray-200 hover:border-orange-500"
              >
                <div className="bg-[#DB4437] p-1 rounded w-6 h-6 flex items-center justify-center">
                  <span className="text-white font-bold text-xl">G</span>
                </div>
                <div className="flex flex-col ml-3">
                  <span className="text-sm font-medium text-black">Google</span>
                  <span className="text-xs text-gray-500">ile giriş yap</span>
                </div>
              </button>
            </div>
            */}
            </div>
          </div>
        </div>
      </div>
      
      {/* ScrollToTop */}
      <div className="hidden md:block">
      <ScrollToTop />
      </div>
    </>
  );
};

export default LoginClient;
