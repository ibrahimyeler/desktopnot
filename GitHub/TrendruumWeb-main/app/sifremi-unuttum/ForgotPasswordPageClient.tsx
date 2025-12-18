"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ScrollToTop from '@/components/ui/ScrollToTop';
import { API_V1_URL } from '@/lib/config';
import { ArrowLeftIcon, PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

interface ForgotPasswordPageClientProps {
  initialToken?: string;
}

const RESEND_INTERVAL_SECONDS = 180;

const ForgotPasswordPageClient: React.FC<ForgotPasswordPageClientProps> = ({ initialToken }) => {
  // Avoid lint complaints for unused prop (reserved for future use)
  useMemo(() => initialToken, [initialToken]);

  const router = useRouter();
  const [resetMethod, setResetMethod] = useState<'phone' | 'email'>('phone');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [passwordRepeat, setPasswordRepeat] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessPage, setShowSuccessPage] = useState(false);
  const [showCodeForm, setShowCodeForm] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    clearTimer();
    setResendTimer(RESEND_INTERVAL_SECONDS);

    timerRef.current = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearTimer();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [clearTimer]);

  useEffect(() => clearTimer, [clearTimer]);

  // Kod formu açıldığında alanları temizle
  useEffect(() => {
    if (showCodeForm) {
      setCode('');
      setPassword('');
      setPasswordRepeat('');
    }
  }, [showCodeForm]);

  // Reset method değiştiğinde input alanlarını temizle
  useEffect(() => {
    setPhone('');
    setEmail('');
    setCode('');
    setPassword('');
    setPasswordRepeat('');
    setShowCodeForm(false);
    setShowSuccessPage(false);
    clearTimer();
  }, [resetMethod, clearTimer]);

  const handleBackNavigation = useCallback(() => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  }, [router]);

  const requestPasswordReset = useCallback(
    async () => {
      let requestBody: { phone?: string; email?: string } = {};

      if (resetMethod === 'phone') {
        // Telefon numarası validasyonu
        const phoneRegex = /^0\d{10}$/;
        const cleanedPhone = phone.replace(/\s/g, '');

        if (!cleanedPhone) {
          toast.error('Lütfen telefon numaranızı giriniz.');
          return false;
        }

        if (!phoneRegex.test(cleanedPhone)) {
          toast.error('Geçerli bir telefon numarası giriniz. (11 rakam, örn: 05459092349)');
          return false;
        }

        // Telefon formatlarını dene: +905307721072, 05307721072, 905307721072
        let formattedPhone = cleanedPhone;
        if (cleanedPhone.startsWith('0')) {
          formattedPhone = `+90${cleanedPhone.slice(1)}`;
        } else if (cleanedPhone.startsWith('90')) {
          formattedPhone = `+${cleanedPhone}`;
        } else if (!cleanedPhone.startsWith('+')) {
          formattedPhone = `+90${cleanedPhone}`;
        }

        requestBody.phone = formattedPhone;
      } else {
        // E-posta validasyonu
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const trimmedEmail = email.trim();

        if (!trimmedEmail) {
          toast.error('Lütfen e-posta adresinizi giriniz.');
          return false;
        }

        if (!emailRegex.test(trimmedEmail)) {
          toast.error('Geçerli bir e-posta adresi giriniz.');
          return false;
        }

        requestBody.email = trimmedEmail;
      }

      try {
        const response = await fetch(`${API_V1_URL}/customer/auth/forgot`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(requestBody),
        });

        const data = await response.json();

        if (!response.ok) {
          const errorMessage =
            response.status === 404
              ? resetMethod === 'phone'
                ? 'Lütfen kayıtlı bir telefon numarası girin.'
                : 'Lütfen kayıtlı bir e-posta adresi girin.'
              : data?.meta?.message || data?.message || `Bir hata oluştu (HTTP ${response.status}).`;

          toast.error(errorMessage, { position: 'top-right' });
          return false;
        }

        return true;
      } catch {
        toast.error('Bir hata oluştu. Lütfen tekrar deneyin.', { position: 'top-right' });
        return false;
      }
    },
    [resetMethod, phone, email]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsLoading(true);

      const isSuccessful = await requestPasswordReset();

      if (isSuccessful) {
        const successMessage = resetMethod === 'phone'
          ? 'Şifre yenileme kodu telefon numaranıza gönderildi.'
          : 'Şifre yenileme linki e-posta adresinize gönderildi. Lütfen e-postanızı kontrol edin.';
        toast.success(successMessage, { position: 'top-right' });
        
        if (resetMethod === 'phone') {
          startTimer();
          setShowSuccessPage(true);
          setShowCodeForm(true);
        } else {
          // E-posta için sadece başarı sayfası göster, kod formu gösterme
          setShowSuccessPage(true);
          setShowCodeForm(false);
        }
        
        // Kod alanını temizle
        setCode('');
        setPassword('');
        setPasswordRepeat('');
      }

      setIsLoading(false);
    },
    [requestPasswordReset, resetMethod, startTimer]
  );

  const handleResend = useCallback(async () => {
    if (resendTimer > 0) {
      return;
    }

    setIsLoading(true);

    const isSuccessful = await requestPasswordReset();

    if (isSuccessful) {
      const successMessage = resetMethod === 'phone'
        ? 'Şifre yenileme kodu tekrar telefon numaranıza gönderildi.'
        : 'Şifre yenileme linki tekrar e-posta adresinize gönderildi. Lütfen e-postanızı kontrol edin.';
      toast.success(successMessage, { position: 'top-right' });
      
      if (resetMethod === 'phone') {
        startTimer();
      }
    }

    setIsLoading(false);
  }, [resendTimer, requestPasswordReset, resetMethod, startTimer]);

  const handleCodeSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      
      if (!code || !password || !passwordRepeat) {
        toast.error('Lütfen tüm alanları doldurunuz.');
        return;
      }
      
      if (password !== passwordRepeat) {
        toast.error('Şifreler eşleşmiyor.');
        return;
      }
      
      if (password.length < 8) {
        toast.error('Şifre en az 8 karakter olmalıdır.');
        return;
      }
      
      let requestBody: { phone?: string; email?: string; code: string; password: string; password_confirmation: string } = {
        code: code,
        password: password,
        password_confirmation: passwordRepeat
      };

      if (resetMethod === 'phone') {
        // Telefon numarası validasyonu
        const phoneRegex = /^0\d{10}$/;
        const cleanedPhone = phone.replace(/\s/g, '');
        if (!phoneRegex.test(cleanedPhone)) {
          toast.error('Geçerli bir telefon numarası giriniz.');
          return;
        }

        // Telefon formatlarını dene: +905307721072, 05307721072, 905307721072
        let formattedPhone = cleanedPhone;
        if (cleanedPhone.startsWith('0')) {
          formattedPhone = `+90${cleanedPhone.slice(1)}`;
        } else if (cleanedPhone.startsWith('90')) {
          formattedPhone = `+${cleanedPhone}`;
        } else if (!cleanedPhone.startsWith('+')) {
          formattedPhone = `+90${cleanedPhone}`;
        }

        requestBody.phone = formattedPhone;
      } else {
        // E-posta validasyonu
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const trimmedEmail = email.trim();

        if (!trimmedEmail) {
          toast.error('Lütfen e-posta adresinizi giriniz.');
          return;
        }

        if (!emailRegex.test(trimmedEmail)) {
          toast.error('Geçerli bir e-posta adresi giriniz.');
          return;
        }

        requestBody.email = trimmedEmail;
      }
      
      setIsLoading(true);
      try {
        const response = await fetch(`${API_V1_URL}/customer/auth/reset`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(requestBody)
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          const errorMessage =
            response.status === 404
              ? resetMethod === 'phone'
                ? 'Lütfen kayıtlı bir telefon numarası girin.'
                : 'Lütfen kayıtlı bir e-posta adresi girin.'
              : data.meta?.message || 'Şifre yenileme başarısız.';
          
          toast.error(errorMessage, { position: 'top-right' });
          return;
        }
        
        if (data.meta?.status === 'success') {
          toast.success('Şifreniz başarıyla yenilendi. Giriş yapabilirsiniz.', { position: 'top-right' });
          setTimeout(() => {
            router.push('/giris');
          }, 1200);
          return;
        }
        
        toast.error(data.meta?.message || 'Şifre yenileme başarısız.', {
          position: 'top-right',
        });
      } catch {
        toast.error('Bir hata oluştu. Lütfen tekrar deneyin.');
      } finally {
        setIsLoading(false);
      }
    },
    [resetMethod, phone, email, code, password, passwordRepeat, router]
  );

  const timerLabel = useMemo(() => {
    if (resendTimer <= 0) {
      return 'Tekrar Gönder';
    }

    const minutes = Math.floor(resendTimer / 60)
      .toString()
      .padStart(2, '0');
    const seconds = (resendTimer % 60).toString().padStart(2, '0');
    return `Tekrar Gönder (${minutes}:${seconds})`;
  }, [resendTimer]);

  const renderMobileHeader = () => (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-orange-200 via-orange-300 to-red-300">
        <div className="absolute inset-0 bg-gradient-to-t from-white/30 via-transparent to-white/20" />
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-20 translate-x-20 blur-xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-16 -translate-x-16 blur-xl" />
        <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-white/5 rounded-full blur-lg" />
        <div className="absolute top-1/3 right-1/3 w-16 h-16 bg-white/10 rounded-full blur-md" />
      </div>

      <div className="relative px-4 py-4 flex items-center">
        <button
          onClick={handleBackNavigation}
          className="md:hidden mr-3 flex items-center justify-center rounded-md border border-white/70 bg-white/80 p-2 text-gray-600 shadow-sm transition-colors duration-200 hover:bg-white hover:text-gray-900"
          aria-label="Geri"
        >
          <ArrowLeftIcon className="w-5 h-5" />
        </button>

        <div className="bg-white/30 backdrop-blur-sm rounded-xl p-2">
          <svg
            width="120"
            height="42"
            viewBox="0 0 184 65"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-auto"
          >
            <path d="M108.645 47.4155V50.4336C107.367 50.3665 106.26 50.618 105.323 51.1881C104.386 51.7582 103.909 52.7139 103.909 54.0385V60.5274H100.57V47.6503H103.909V49.8132C104.744 48.2204 106.328 47.4155 108.645 47.4155Z" fill="black" />
            <path d="M147.473 47.6838V54.5583C147.473 55.799 147.166 56.738 146.535 57.3416C145.922 57.9452 145.104 58.247 144.099 58.247C143.094 58.247 142.447 57.9955 141.918 57.4757C141.39 56.956 141.118 56.235 141.118 55.2625V47.667H138.255V55.5308C138.255 57.1739 138.733 58.465 139.67 59.404C140.607 60.3429 141.833 60.8124 143.367 60.8124C144.9 60.8124 146.621 60.1585 147.49 58.8339V60.4771H150.352V47.667H147.49L147.473 47.6838Z" fill="black" />
            <path d="M125.699 47.6838V54.5583C125.699 55.799 125.393 56.738 124.762 57.3416C124.149 57.9452 123.331 58.247 122.326 58.247C121.321 58.247 120.673 57.9955 120.145 57.4757C119.617 56.956 119.344 56.235 119.344 55.2625V47.667H116.482V55.5308C116.482 57.1739 116.959 58.465 117.896 59.404C118.833 60.3429 120.06 60.8124 121.593 60.8124C123.127 60.8124 124.847 60.1585 125.716 58.8339V60.4771H128.578V47.667H125.716L125.699 47.6838Z" fill="black" />
            <path d="M179.553 48.6732C178.582 47.7175 177.287 47.248 175.686 47.248C174.084 47.248 172.313 47.9355 171.358 49.2936C170.49 47.9355 169.161 47.248 167.355 47.248C165.549 47.248 164.22 47.8852 163.317 49.1427V47.5834H160.267V60.5108H163.317V53.2674C163.317 52.144 163.607 51.3057 164.186 50.7188C164.765 50.1488 165.532 49.8469 166.452 49.8469C167.372 49.8469 167.951 50.0985 168.411 50.5847C168.871 51.0709 169.11 51.7752 169.11 52.6638V60.4941H172.159V53.2507C172.159 52.1105 172.432 51.2554 172.994 50.6853C173.556 50.1152 174.306 49.8302 175.243 49.8302C176.18 49.8302 176.759 50.0817 177.253 50.5679C177.747 51.0542 177.986 51.7584 177.986 52.6471V60.4773H181.035V52.4626C181.035 50.853 180.541 49.5787 179.57 48.6397L179.553 48.6732Z" fill="black" />
            <path d="M23.2385 49.8469V47.684H20.5978V60.5108H23.2385V53.7033C23.2385 52.2949 23.6985 51.2889 24.6356 50.6517C25.5726 50.0146 26.68 49.7295 27.9748 49.7798V47.4492C25.6919 47.4492 24.1244 48.2373 23.2556 49.8301L23.2385 49.8469Z" fill="black" />
            <path d="M67.5518 48.7737C66.5636 47.8347 65.2348 47.3652 63.5992 47.3652C61.9636 47.3652 60.0385 48.0862 59.0503 49.5282V47.7006H56.614V60.4268H59.0503V53.6864C59.0503 52.2612 59.4251 51.2049 60.1748 50.5174C60.9244 49.83 61.9125 49.4947 63.1222 49.4947C64.3318 49.4947 65.0644 49.7797 65.6777 50.3498C66.2911 50.9199 66.5977 51.7247 66.5977 52.7642V60.4603H69.034V52.6469C69.034 51.0372 68.5399 49.7629 67.5518 48.8072V48.7737Z" fill="black" />
            <path d="M88.5073 42.5197V49.8637C87.434 48.1702 85.8666 47.3151 83.8051 47.3151C81.7436 47.3151 80.5851 47.969 79.3584 49.2768C78.1318 50.5847 77.5184 52.1775 77.5184 54.0722C77.5184 55.9669 78.1318 57.5598 79.3584 58.8676C80.5851 60.1754 82.0673 60.8294 83.8051 60.8294C85.5429 60.8294 87.434 59.9742 88.5073 58.2808V60.494H90.671V42.5029H88.5073V42.5197ZM87.2466 57.3586C86.3947 58.2472 85.3555 58.6832 84.0947 58.6832C82.834 58.6832 81.8118 58.2472 80.9599 57.3586C80.1081 56.4867 79.6821 55.3801 79.6821 54.089C79.6821 52.7979 80.1081 51.6913 80.9599 50.8194C81.8118 49.9308 82.851 49.4948 84.0947 49.4948C85.3384 49.4948 86.4118 49.9308 87.2466 50.8194C88.0984 51.7081 88.5244 52.7979 88.5244 54.089C88.5244 55.3801 88.0984 56.4867 87.2466 57.3586Z" fill="black" />
            <path d="M45.7274 56.4867C45.5911 56.822 45.4208 57.1406 45.1993 57.4089C44.4496 58.3311 43.3422 58.8005 41.9111 58.8005C40.48 58.8005 39.7133 58.482 38.9126 57.8616C38.4356 57.4927 38.0437 57.0232 37.7711 56.4532C37.4815 55.8663 37.3622 55.1956 37.3622 54.5417V54.1896H47.9593C47.9593 52.3284 47.38 50.7523 46.2045 49.4277C45.0289 48.1031 43.5296 47.4492 41.6896 47.4492C39.8496 47.4492 38.163 48.0864 36.9363 49.3607C35.7096 50.635 35.0963 52.2446 35.0963 54.1561C35.0963 56.0675 35.7267 57.7107 36.9704 58.9682C38.2141 60.2425 39.8326 60.8797 41.8259 60.8797C43.8193 60.8797 46.1363 59.9239 47.363 57.9957C47.9082 57.258 47.9422 56.4028 47.9422 56.4028H45.7274C45.7274 56.4196 45.7104 56.4531 45.6934 56.4699L45.7274 56.4867ZM38.7933 50.5511C39.56 49.8804 40.5311 49.5451 41.7067 49.5451C42.8822 49.5451 43.5978 49.8637 44.3474 50.4841C44.9608 50.9871 45.3867 51.6913 45.6252 52.58H37.5156C37.7541 51.7584 38.18 51.0709 38.7933 50.5344V50.5511Z" fill="black" />
            <path d="M8.38219 49.4779V56.671C8.38219 57.3249 8.51848 57.7943 8.80811 58.0626C9.0807 58.3309 9.52367 58.4818 10.1029 58.4818C10.6822 58.4818 11.3977 58.4818 12.2496 58.4315V60.5106C10.0518 60.7789 8.4333 60.6112 7.39404 60.0244C6.37182 59.4375 5.8607 58.3141 5.8607 56.6542V49.4611H2.98145V47.2311H5.8607V43.5088H8.38219V47.2311H12.2496V49.4611H8.38219V49.4779Z" fill="black" />
            <path d="M130.861 17.2687C130.861 24.8307 124.643 30.9506 116.959 30.9506C109.276 30.9506 103.057 24.8307 103.057 17.2687C103.057 9.70674 109.276 3.60352 116.959 3.60352C124.643 3.60352 130.861 9.72351 130.861 17.2687Z" fill="#EC6D04" />
            <path d="M84.3844 17.2687C84.3844 24.8307 78.1659 30.9506 70.4822 30.9506C62.7985 30.9506 56.58 24.8307 56.58 17.2687C56.58 9.70674 62.7985 3.60352 70.4822 3.60352C78.1659 3.60352 84.3844 9.72351 84.3844 17.2687Z" fill="#F9AF02" />
            <path d="M108.219 17.2687C108.219 24.8307 102.001 30.9506 94.317 30.9506C86.6333 30.9506 80.4148 24.8307 80.4148 17.2687C80.4148 9.70674 86.6333 3.60352 94.317 3.60352C102.001 3.60352 108.219 9.72351 108.219 17.2687Z" fill="black" />
          </svg>
        </div>
      </div>
    </div>
  );

  const mobileContainerPadding = showSuccessPage ? 'py-8' : 'py-6';

  const renderMobileContent = (content: React.ReactNode) => (
    <div className={`px-4 ${mobileContainerPadding}`}>
      <div className="relative z-10 max-w-md mx-auto w-full">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
          {content}
        </div>
      </div>
    </div>
  );

  const renderMobileForm = () => (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {/* Telefon/E-posta Seçim Butonları */}
      <div className="flex gap-2 mb-4">
        <button
          type="button"
          onClick={() => setResetMethod('phone')}
          className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-colors ${
            resetMethod === 'phone'
              ? 'bg-orange-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <PhoneIcon className="w-5 h-5" />
            <span>Telefon</span>
          </div>
        </button>
        <button
          type="button"
          onClick={() => setResetMethod('email')}
          className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-colors ${
            resetMethod === 'email'
              ? 'bg-orange-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <EnvelopeIcon className="w-5 h-5" />
            <span>E-posta</span>
          </div>
        </button>
      </div>

      <div>
        {resetMethod === 'phone' ? (
          <input
            id="mobile-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            required
            maxLength={11}
            value={phone}
            onChange={(e) => {
              // Sadece rakam kabul et, maksimum 11 karakter
              const value = e.target.value.replace(/[^\d]/g, '').slice(0, 11);
              setPhone(value);
            }}
            placeholder="Telefon numaranız (örn: 05307721072)"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-black"
          />
        ) : (
          <input
            id="mobile-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-posta adresiniz (örn: user@example.com)"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-black"
          />
        )}
      </div>

      <div className="space-y-3">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-orange-500 text-white py-3 px-4 rounded-lg font-semibold text-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Gönderiliyor...' : 'Şifremi Yenile'}
        </button>

        <button
          type="button"
          onClick={handleBackNavigation}
          className="w-full py-3 px-4 rounded-lg text-gray-700 hover:text-gray-900 transition-colors text-center font-semibold border border-gray-300 hover:border-gray-400"
        >
          Önceki Sayfaya Dön
        </button>
      </div>
    </form>
  );

  const renderCodeForm = (isDesktop: boolean) => (
    <form key={`code-form-${resetMethod}-${resetMethod === 'phone' ? phone : email}`} className="space-y-4" onSubmit={handleCodeSubmit}>
      <div>
        <label htmlFor={isDesktop ? "code" : "mobile-code"} className={isDesktop ? "block text-sm font-medium text-gray-700 mb-1" : "block text-sm font-medium text-gray-700 mb-1"}>
          Doğrulama Kodu
        </label>
        <input
          key={`code-input-${showCodeForm}`}
          id={isDesktop ? "code" : "mobile-code"}
          name="verification-code"
          type="text"
          autoComplete="off"
          required
          maxLength={6}
          value={code}
          onChange={(e) => {
            // Sadece rakam kabul et, maksimum 6 karakter
            const value = e.target.value.replace(/[^\d]/g, '').slice(0, 6);
            setCode(value);
          }}
          className={isDesktop 
            ? "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-sm text-black"
            : "w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-black"
          }
          placeholder="6 haneli kod"
        />
      </div>
      
      <div>
        <label htmlFor={isDesktop ? "password" : "mobile-password"} className={isDesktop ? "block text-sm font-medium text-gray-700 mb-1" : "block text-sm font-medium text-gray-700 mb-1"}>
          Yeni Şifre
        </label>
        <input
          id={isDesktop ? "password" : "mobile-password"}
          name="password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={isDesktop 
            ? "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-sm text-black"
            : "w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-black"
          }
          placeholder="Yeni şifrenizi girin"
        />
      </div>
      
      <div>
        <label htmlFor={isDesktop ? "passwordRepeat" : "mobile-passwordRepeat"} className={isDesktop ? "block text-sm font-medium text-gray-700 mb-1" : "block text-sm font-medium text-gray-700 mb-1"}>
          Yeni Şifre (Tekrar)
        </label>
        <input
          id={isDesktop ? "passwordRepeat" : "mobile-passwordRepeat"}
          name="passwordRepeat"
          type="password"
          required
          value={passwordRepeat}
          onChange={(e) => setPasswordRepeat(e.target.value)}
          className={isDesktop 
            ? "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-sm text-black"
            : "w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-black"
          }
          placeholder="Yeni şifrenizi tekrar girin"
        />
      </div>
      
      <div className="space-y-3">
        <button
          type="submit"
          disabled={isLoading}
          className={isDesktop
            ? "w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors disabled:opacity-60"
            : "w-full bg-orange-500 text-white py-3 px-4 rounded-lg font-semibold text-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
          }
        >
          {isLoading ? 'Yenileniyor...' : 'Şifremi Yenile'}
        </button>
        
        <button
          type="button"
          onClick={handleResend}
          disabled={isLoading || resendTimer > 0}
          className={isDesktop
            ? `w-full py-2 px-4 rounded-md text-center text-sm ${
                resendTimer > 0
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
              } transition-colors`
            : `w-full py-3 px-4 rounded-lg text-center font-semibold ${
                resendTimer > 0
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
              } transition-colors`
          }
        >
          {isLoading && resendTimer <= 0 ? 'Gönderiliyor...' : timerLabel}
        </button>
      </div>
    </form>
  );

  const renderSuccessDetails = (isDesktop: boolean) => (
    <div className="space-y-4">
      <div className={isDesktop ? 'bg-gray-50 p-4 rounded-lg' : 'bg-gray-50 p-4 rounded-2xl'}>
        <h3 className={isDesktop ? 'font-medium text-gray-900 mb-2' : 'font-semibold text-gray-900 mb-3 text-sm'}>
          {resetMethod === 'phone'
            ? 'Şifre yenileme kodu telefon numaranıza ulaşmadıysa:'
            : 'Şifre yenileme linki e-posta adresinize ulaşmadıysa:'
          }
        </h3>
        <ul className={isDesktop ? 'text-sm text-gray-600 space-y-2' : 'text-xs text-gray-600 space-y-2'}>
          {resetMethod === 'phone' ? (
            <>
              <li>• Şifre yenileme kodunun gelmesi birkaç dakika sürebilir.</li>
              <li>• SMS mesajlarınızı kontrol ediniz.</li>
              <li>• Girdiğiniz telefon numarasının doğruluğunu kontrol ediniz.</li>
            </>
          ) : (
            <>
              <li>• Şifre yenileme linkinin gelmesi birkaç dakika sürebilir.</li>
              <li>• E-posta kutunuzu (spam klasörü dahil) kontrol ediniz.</li>
              <li>• Girdiğiniz e-posta adresinin doğruluğunu kontrol ediniz.</li>
              <li>• E-postadaki linke tıklayarak şifrenizi yenileyebilirsiniz.</li>
            </>
          )}
        </ul>
      </div>
    </div>
  );

  return (
    <>
      <div className="hidden md:block">
        <Header />
      </div>

      <div className="md:hidden min-h-screen bg-gradient-to-br from-orange-100 via-orange-200 to-red-200">
        {renderMobileHeader()}

        {renderMobileContent(
          showCodeForm ? (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h1 className="text-2xl font-bold text-gray-800">Şifre Yenileme</h1>
                <p className="text-gray-600 text-sm">
                  {resetMethod === 'phone'
                    ? `${phone} numarasına gönderilen kodu girin ve yeni şifrenizi belirleyin.`
                    : `${email} adresine gönderilen kodu girin ve yeni şifrenizi belirleyin.`
                  }
                </p>
              </div>
              {renderCodeForm(false)}
              {renderSuccessDetails(false)}
            </div>
          ) : showSuccessPage ? (
            <div className="space-y-6 text-center">
              <div className="space-y-3">
                <h1 className="text-2xl font-bold text-gray-800">Şifre Yenileme</h1>
                <p className="text-gray-600 text-sm">
                  {resetMethod === 'phone'
                    ? `${phone} numarasına şifre yenileme kodu gönderildi.`
                    : `${email} adresine şifre yenileme linki gönderildi. Lütfen e-postanızdaki linke tıklayın.`
                  }
                </p>
              </div>
              {renderSuccessDetails(false)}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h1 className="text-2xl font-bold text-gray-800">Şifre Yenileme</h1>
                <p className="text-gray-600 text-sm">
                  Şifre yenileme kodunu gönderebilmemiz için telefon numaranız veya e-posta adresinize ihtiyacımız var.
                </p>
              </div>
              {renderMobileForm()}
            </div>
          )
        )}
      </div>

      <div className="hidden md:flex min-h-screen flex-col items-center justify-center py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
          {showCodeForm ? (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h1 className="text-3xl font-medium text-gray-900">Şifre Yenileme</h1>
                <p className="text-sm text-gray-600">
                  {resetMethod === 'phone'
                    ? `${phone} numarasına gönderilen kodu girin ve yeni şifrenizi belirleyin.`
                    : `${email} adresine gönderilen kodu girin ve yeni şifrenizi belirleyin.`
                  }
                </p>
              </div>
              {renderCodeForm(true)}
              {renderSuccessDetails(true)}
            </div>
          ) : showSuccessPage ? (
            <div className="space-y-6 text-center">
              <div className="space-y-3">
                <h1 className="text-3xl font-medium text-gray-900">Şifre Yenileme</h1>
                <p className="text-sm text-gray-600">
                  {resetMethod === 'phone'
                    ? `${phone} numarasına şifre yenileme kodu gönderildi.`
                    : `${email} adresine şifre yenileme linki gönderildi. Lütfen e-postanızdaki linke tıklayın.`
                  }
                </p>
              </div>
              {renderSuccessDetails(true)}
            </div>
          ) : (
            <>
              <div className="text-center space-y-2">
                <h1 className="text-3xl font-medium text-gray-900">Şifre Yenileme</h1>
                <p className="text-sm text-gray-600">
                  Şifre yenileme kodunu gönderebilmemiz için telefon numaranız veya e-posta adresinize ihtiyacımız var.
                </p>
              </div>
              <form className="space-y-6" onSubmit={handleSubmit}>
                {/* Telefon/E-posta Seçim Butonları */}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setResetMethod('phone')}
                    className={`flex-1 py-2.5 px-4 rounded-lg font-medium text-sm transition-colors ${
                      resetMethod === 'phone'
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <PhoneIcon className="w-5 h-5" />
                      <span>Telefon</span>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setResetMethod('email')}
                    className={`flex-1 py-2.5 px-4 rounded-lg font-medium text-sm transition-colors ${
                      resetMethod === 'email'
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <EnvelopeIcon className="w-5 h-5" />
                      <span>E-posta</span>
                    </div>
                  </button>
                </div>

                <div>
                  <label htmlFor={resetMethod === 'phone' ? "phone" : "email"} className="block text-sm font-medium text-gray-700">
                    {resetMethod === 'phone' ? 'Telefon' : 'E-posta'}
                  </label>
                  <div className="mt-1 relative">
                    {resetMethod === 'phone' ? (
                      <>
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          autoComplete="tel"
                          required
                          maxLength={11}
                          value={phone}
                          onChange={(e) => {
                            // Sadece rakam kabul et, maksimum 11 karakter
                            const value = e.target.value.replace(/[^\d]/g, '').slice(0, 11);
                            setPhone(value);
                          }}
                          placeholder="Telefon numaranız (örn: 05307721072)"
                          className="mt-1 block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-sm text-black"
                        />
                        <PhoneIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                      </>
                    ) : (
                      <>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="E-posta adresiniz (örn: user@example.com)"
                          className="mt-1 block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-sm text-black"
                        />
                        <EnvelopeIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                      </>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors disabled:opacity-60"
                  >
                    {isLoading ? 'Gönderiliyor...' : 'Şifremi Yenile'}
                  </button>

                  <button
                    type="button"
                    onClick={handleBackNavigation}
                    className="w-full flex justify-center py-2 px-4 border border-orange-500 rounded-md shadow-sm text-sm font-medium text-orange-500 bg-white hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
                  >
                    Önceki Sayfaya Dön
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>

    </>
  );
};

export default ForgotPasswordPageClient;
