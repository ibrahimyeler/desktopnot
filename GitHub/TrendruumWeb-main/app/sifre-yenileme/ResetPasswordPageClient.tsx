"use client"

import React, { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ScrollToTop from '@/components/ui/ScrollToTop';
import { API_V1_URL } from '@/lib/config';
import { PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

interface ResetPasswordPageClientProps {
  initialToken: string;
}

// Şifre yenileme formunu ayrı bir bileşene taşıyalım
const ResetPasswordForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [passwordRepeat, setPasswordRepeat] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resetMethod, setResetMethod] = useState<'phone' | 'email'>('phone');

  useEffect(() => {
    const phoneParam = searchParams.get('phone') || '';
    const emailParam = searchParams.get('email') || '';
    const codeParam = searchParams.get('code') || '';
    
    // Eğer email parametresi varsa email modunu kullan
    if (emailParam) {
      setResetMethod('email');
      setEmail(emailParam);
    } else if (phoneParam) {
      setResetMethod('phone');
      setPhone(phoneParam);
    }
    
    setCode(codeParam);
    setPassword('');
    setPasswordRepeat('');
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validasyon
    if (resetMethod === 'phone') {
      if (!phone || !code || !password || !passwordRepeat) {
        toast.error('Lütfen tüm alanları doldurunuz.');
        return;
      }
      // Telefon numarası validasyonu
      const phoneRegex = /^0\d{10}$/;
      const cleanedPhone = phone.replace(/\s/g, '');
      if (!phoneRegex.test(cleanedPhone)) {
        toast.error('Geçerli bir telefon numarası giriniz. (11 rakam, örn: 05459092349)');
        return;
      }
    } else {
      // E-posta için kod gerekmez, sadece şifre alanları gerekli
      if (!email || !password || !passwordRepeat) {
        toast.error('Lütfen tüm alanları doldurunuz.');
        return;
      }
      // E-posta validasyonu
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const trimmedEmail = email.trim();
      if (!emailRegex.test(trimmedEmail)) {
        toast.error('Geçerli bir e-posta adresi giriniz.');
        return;
      }
      // E-posta için kod URL'den geliyor, state'e set edilmiş olmalı
      if (!code) {
        toast.error('Geçersiz veya eksik doğrulama kodu.');
        return;
      }
    }
    
    if (password !== passwordRepeat) {
      toast.error('Şifreler eşleşmiyor.');
      return;
    }
    if (password.length < 8) {
      toast.error('Şifre en az 8 karakter olmalıdır.');
      return;
    }
    
    setIsLoading(true);
    try {
      const requestBody = resetMethod === 'phone'
        ? {
            phone: phone.replace(/\s/g, ''),
            code: code,
            password: password,
            password_confirmation: passwordRepeat
          }
        : {
            email: email.trim(),
            code: code,
            password: password,
            password_confirmation: passwordRepeat
          };

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
  };

  return (
    <>
      {/* Mobile Layout */}
      <div className="md:hidden">
        {/* Hoş Geldiniz Mesajı */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Şifre Yenileme</h1>
          <p className="text-gray-600 text-sm">Hesabınız için yeni bir şifre belirleyin</p>
        </div>
        
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Telefon alanı - sadece telefon için göster */}
            {resetMethod === 'phone' && (
              <div>
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
              </div>
            )}
            {/* E-posta alanı - sadece e-posta için göster, readonly */}
            {resetMethod === 'email' && (
              <div>
                <input
                  id="mobile-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  readOnly
                  value={email}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                />
              </div>
            )}
            {/* Kod alanı - sadece telefon için göster */}
            {resetMethod === 'phone' && (
              <div>
                <input
                  id="mobile-code"
                  name="code"
                  type="text"
                  required
                  placeholder="Doğrulama Kodu"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-black"
                />
              </div>
            )}
            <div>
              <input
                id="mobile-password"
                name="password"
                type="password"
                required
                placeholder="Yeni şifrenizi girin"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-black"
              />
            </div>
            <div>
              <input
                id="mobile-passwordRepeat"
                name="passwordRepeat"
                type="password"
                required
                placeholder="Yeni şifrenizi tekrar girin"
                value={passwordRepeat}
                onChange={(e) => setPasswordRepeat(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-black"
              />
            </div>
            <div className="space-y-3">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-orange-500 text-white py-3 px-4 rounded-lg font-semibold text-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Yenileniyor...' : 'Şifremi Yenile'}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="w-full py-3 px-4 rounded-lg text-gray-700 hover:text-gray-900 transition-colors text-center font-semibold border border-gray-300 hover:border-gray-400"
              >
                Önceki Sayfaya Dön
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:block min-h-screen flex flex-col items-center justify-center py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-medium text-gray-900">
              Şifre Yenileme
            </h1>
            <p className="mt-4 text-sm text-gray-600">
              Hesabınız için yeni bir şifre belirleyin.
            </p>
          </div>

          <div className="mt-8 bg-white p-8 rounded-lg">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Telefon alanı - sadece telefon için göster */}
              {resetMethod === 'phone' && (
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Telefon
                  </label>
                  <div className="mt-1 relative">
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
                      className="mt-1 appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-sm text-black"
                    />
                    <PhoneIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  </div>
                </div>
              )}
              {/* E-posta alanı - sadece e-posta için göster, readonly */}
              {resetMethod === 'email' && (
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    E-posta
                  </label>
                  <div className="mt-1 relative">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      readOnly
                      value={email}
                      className="mt-1 appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md bg-gray-50 text-gray-600 cursor-not-allowed text-sm"
                    />
                    <EnvelopeIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  </div>
                </div>
              )}
              {/* Kod alanı - sadece telefon için göster */}
              {resetMethod === 'phone' && (
                <div>
                  <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                    Doğrulama Kodu
                  </label>
                  <input
                    id="code"
                    name="code"
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-sm text-black"
                  />
                </div>
              )}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Yeni Şifre
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-sm text-black"
                />
              </div>
              <div>
                <label htmlFor="passwordRepeat" className="block text-sm font-medium text-gray-700">
                  Yeni Şifre (Tekrar)
                </label>
                <input
                  id="passwordRepeat"
                  name="passwordRepeat"
                  type="password"
                  required
                  value={passwordRepeat}
                  onChange={(e) => setPasswordRepeat(e.target.value)}
                  className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-sm text-black"
                />
              </div>
              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
                >
                  {isLoading ? 'Yenileniyor...' : 'Şifremi Yenile'}
                </button>
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="w-full flex justify-center py-2 px-4 border border-orange-500 rounded-md shadow-sm text-sm font-medium text-orange-500 bg-white hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
                >
                  Önceki Sayfaya Dön
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default function ResetPasswordPageClient({ initialToken }: ResetPasswordPageClientProps) {
  return (
    <>
      {/* Desktop Header */}
      <div className="hidden">
        <Header />
      </div>
      
      {/* Mobile Layout */}
      <div className="md:hidden min-h-screen bg-gradient-to-br from-orange-100 via-orange-200 to-red-200">
        {/* Mobile Header - Modern Gradient Background */}
        <div className="relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-200 via-orange-300 to-red-300">
            <div className="absolute inset-0 bg-gradient-to-t from-white/30 via-transparent to-white/20"></div>
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-20 translate-x-20 blur-xl"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-16 -translate-x-16 blur-xl"></div>
            <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-white/5 rounded-full blur-lg"></div>
            <div className="absolute top-1/3 right-1/3 w-16 h-16 bg-white/10 rounded-full blur-md"></div>
          </div>
          
          {/* Header Content */}
          <div className="relative px-4 py-4 flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-white/30 backdrop-blur-sm rounded-xl p-2 mr-3">
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
            <Link 
              href="/giris"
              className="bg-white/30 backdrop-blur-sm rounded-full p-3 text-black text-xl font-bold hover:bg-white/40 transition-all duration-300"
            >
              ×
            </Link>
          </div>
        </div>

        {/* Mobile Content */}
        <div className="px-4 py-6">
          {/* Content Background */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-white/20"></div>
          
          {/* Mobile Form */}
          <div className="relative z-10 max-w-md mx-auto w-full">
            <Suspense fallback={
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
              </div>
            }>
              <ResetPasswordForm />
            </Suspense>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:block">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto">
            <Suspense fallback={
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
              </div>
            }>
              <ResetPasswordForm />
            </Suspense>
          </div>
        </main>
        <Footer />
        <ScrollToTop />
      </div>
    </>
  );
}
