"use client";

import { useState, useEffect } from 'react';
import { EyeIcon, UserIcon, Bars3Icon } from '@heroicons/react/24/outline';
import axios from 'axios';
import { useAuth } from '@/app/context/AuthContext';
import toast from 'react-hot-toast';

interface ApiError {
  response?: {
    data?: {
      meta?: {
        message?: string;
      };
    };
  };
}

interface UserProfile {
  name: string;
  lastname: string;
  email: string;
  gender: string;
  phone: string;
  birthday: string;
  validate: {
    is_validated: boolean;
    validated_at: string;
    validated_code: string | null;
    validated_code_expires_at: string | null;
  };
  status: string;
  updated_at: string;
  created_at: string;
  role: {
    name: string;
    type: string;
    slug: string;
    updated_at: string;
    created_at: string;
    id: {
      $oid: string;
    };
  };
  id: string;
}

interface ApiResponse {
  meta: {
    status: string;
    message: string;
    code: number;
  };
  data: UserProfile;
}

interface UserInfoProps {
  onMenuClick?: () => void;
}

const UserInfo = ({ onMenuClick }: UserInfoProps) => {
  const { } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [passwordError, setPasswordError] = useState('');
  const [isEmailEditable, setIsEmailEditable] = useState(false);
  
  // Üyelik bilgileri form state'i
  const [profileForm, setProfileForm] = useState({
    name: '',
    surname: '',
    email: '',
    phone: '',
    gender: 'male',
    birthDay: '',
    birthMonth: '',
    birthYear: '',
    notifications: false
  });

  // E-posta validasyon fonksiyonu
  const isValidEmail = (email: string) => {
    if (!email || email.trim() === '') return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Şifre güncelleme form state'i
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await axios.get<ApiResponse>('/api/v1/customer/profile/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const userData = response.data.data;
      
      // Doğum tarihini parçalara ayır
      let birthDay = '', birthMonth = '', birthYear = '';
      if (userData.birthday) {
        const [month, day, year] = userData.birthday.split('/');
        birthDay = day;
        birthMonth = month;
        birthYear = year;
      }
      
      // Telefon ile kayıt olan kullanıcılar için e-posta düzenlenebilir
      // Telefon ile kayıt olan kullanıcıları tespit et: Telefon varsa telefon ile kayıt olmuş demektir
      const email = userData.email || '';
      const phone = userData.phone || '';
      const hasPhone = !!(phone && phone.trim() !== '');
      // Telefon ile kayıt olan kullanıcılar için e-posta her zaman düzenlenebilir (eklemek ve değiştirmek için)
      const canEditEmail = hasPhone;
      setIsEmailEditable(canEditEmail);
      
      setProfileForm(prev => ({
        ...prev,
        name: userData.name || '',
        surname: userData.lastname || '',
        email: email,
        phone: userData.phone || '',
        gender: userData.gender || 'male',
        birthDay,
        birthMonth,
        birthYear
      }));

    } catch (error) {
      toast.error('Profil bilgileri yüklenirken bir hata oluştu');
    } finally {
      setProfileLoading(false);
    }
  };

  // Form dolu mu kontrolü
  const isProfileFormFilled = Object.entries(profileForm).every(([key, value]) => {
    if (key === 'notifications') return true;
    return value !== '';
  });

  const isPasswordFormFilled = Object.values(passwordForm).every(value => value !== '');

  const handleProfileUpdate = async () => {
    if (!isProfileFormFilled) return;

    setProfileLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Oturum bulunamadı');

      // Doğum tarihini API formatına dönüştür
      const birthday = `${profileForm.birthMonth}/${profileForm.birthDay}/${profileForm.birthYear}`;

      const response = await axios.post<ApiResponse>('/api/v1/customer/profile/me-update', {
        name: profileForm.name,
        lastname: profileForm.surname,
        email: profileForm.email,
        phone: profileForm.phone,
        gender: profileForm.gender,
        birthday
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.meta.status === 'success') {
        // API'den gelen güncel veriyi form'a yerleştir
        const updatedData = response.data.data;
        
        // Doğum tarihini parçalara ayır
        let birthDay = '', birthMonth = '', birthYear = '';
        if (updatedData.birthday) {
          const [month, day, year] = updatedData.birthday.split('/');
          birthDay = day;
          birthMonth = month;
          birthYear = year;
        }

        // Form'u güncelle
        setProfileForm(prev => ({
          ...prev,
          name: updatedData.name || '',
          surname: updatedData.lastname || '',
          email: updatedData.email || '',
          phone: updatedData.phone || '',
          gender: updatedData.gender || 'male',
          birthDay,
          birthMonth,
          birthYear
        }));

        // localStorage'daki user bilgilerini güncelle
        const currentUser = localStorage.getItem('user');
        if (currentUser) {
          try {
            const user = JSON.parse(currentUser);
            const updatedUser = {
              ...user,
              name: updatedData.name,
              lastname: updatedData.lastname,
              email: updatedData.email,
              phone: updatedData.phone
            };
            localStorage.setItem('user', JSON.stringify(updatedUser));
          } catch (e) {
          }
        }

        toast.success('Üyelik bilgileriniz başarıyla güncellendi');
      } else {
        throw new Error(response.data.meta.message || 'Güncelleme başarısız');
      }
    } catch (error: any) {
      // API'den gelen hata mesajını kontrol et
      const errorData = error?.response?.data;
      
      // Errors objesi direkt response.data içinde olabilir (Laravel formatı: {meta: {...}, errors: {...}})
      const errors = errorData?.errors || {};
      const errorMessage = errorData?.meta?.message || 
                          errorData?.message || 
                          error?.message || 
                          '';
      
      // Validation hatalarını kontrol et (Laravel/PHP API formatı)
      // Response formatı: {meta: {status: "error", message: "Validation failed"}, errors: {email: ["The email has already been taken."]}}
      if (errors && typeof errors === 'object' && Object.keys(errors).length > 0) {
        // Email hatası varsa
        if (errors.email) {
          const emailError = Array.isArray(errors.email) ? errors.email[0] : errors.email;
          const emailErrorLower = String(emailError).toLowerCase();
          
          // "has already been taken", "taken", "already", "exists", "zaten" kontrolü
          if (emailErrorLower.includes('taken') || 
              emailErrorLower.includes('already') || 
              emailErrorLower.includes('exists') ||
              emailErrorLower.includes('zaten') ||
              emailErrorLower.includes('duplicate')) {
            toast.error('Bu e-posta adresi zaten kullanılıyor');
          } else {
            toast.error(String(emailError) || 'E-posta adresi geçersiz');
          }
          setProfileLoading(false);
          return;
        }
        
        // Telefon hatası varsa
        if (errors.phone) {
          const phoneError = Array.isArray(errors.phone) ? errors.phone[0] : errors.phone;
          const phoneErrorLower = String(phoneError).toLowerCase();
          
          if (phoneErrorLower.includes('taken') || 
              phoneErrorLower.includes('already') || 
              phoneErrorLower.includes('exists') ||
              phoneErrorLower.includes('zaten') ||
              phoneErrorLower.includes('duplicate')) {
            toast.error('Bu telefon numarası zaten kullanılıyor');
          } else {
            toast.error(String(phoneError) || 'Telefon numarası geçersiz');
          }
          setProfileLoading(false);
          return;
        }
        
        // Diğer validation hataları varsa, ilkini göster
        const errorKeys = Object.keys(errors);
        if (errorKeys.length > 0) {
          const firstError = errors[errorKeys[0]];
          const firstErrorMsg = Array.isArray(firstError) ? firstError[0] : firstError;
          toast.error(String(firstErrorMsg) || 'Güncelleme sırasında bir hata oluştu');
          setProfileLoading(false);
          return;
        }
      }
      
      // Email zaten varsa (mesaj içinde kontrol - fallback)
      const lowerMessage = errorMessage.toLowerCase();
      if (lowerMessage.includes('email') && 
          (lowerMessage.includes('taken') ||
           lowerMessage.includes('already') || 
           lowerMessage.includes('exists') || 
           lowerMessage.includes('zaten') ||
           lowerMessage.includes('duplicate'))) {
        toast.error('Bu e-posta adresi zaten kullanılıyor');
      } 
      // Telefon zaten varsa (mesaj içinde kontrol - fallback)
      else if (lowerMessage.includes('phone') && 
               (lowerMessage.includes('taken') ||
                lowerMessage.includes('already') || 
                lowerMessage.includes('exists') || 
                lowerMessage.includes('zaten') ||
                lowerMessage.includes('duplicate'))) {
        toast.error('Bu telefon numarası zaten kullanılıyor');
      }
      // "Validation failed" mesajı - ama errors objesi boşsa genel mesaj göster
      else if (lowerMessage.includes('validation') || 
               lowerMessage.includes('validation failed') ||
               lowerMessage.includes('geçersiz')) {
        // Eğer spesifik bir hata mesajı yoksa, varsayılan mesaj göster
        toast.error('Lütfen girdiğiniz bilgileri kontrol edin');
      }
      // Genel hata
      else {
        toast.error(errorMessage || 'Profil güncellenirken bir hata oluştu');
      }
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordUpdate = async () => {
    if (!isPasswordFormFilled) return;
    
    // Şifre validasyonu
    if (passwordForm.newPassword.length < 10) {
      setPasswordError('Şifre en az 10 karakter olmalıdır.');
      return;
    }
    if (!/[A-Z]/.test(passwordForm.newPassword)) {
      setPasswordError('Şifre en az 1 büyük harf içermelidir.');
      return;
    }
    if (!/[a-z]/.test(passwordForm.newPassword)) {
      setPasswordError('Şifre en az 1 küçük harf içermelidir.');
      return;
    }
    if (!/[0-9]/.test(passwordForm.newPassword)) {
      setPasswordError('Şifre en az 1 rakam içermelidir.');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('Yeni şifreler eşleşmiyor.');
      return;
    }

    setPasswordLoading(true);
    setPasswordError('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        "/api/v1/customer/profile/password-reset",
        {
          password: passwordForm.currentPassword,
          new_password: passwordForm.newPassword,
          new_password_confirmation: passwordForm.confirmPassword
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Accept': 'application/json'
          }
        }
      );

      if (response.data?.meta?.status === 'success') {
        toast.success('Şifreniz başarıyla güncellendi');
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        setPasswordError(response.data?.meta?.message || 'Şifre güncellenemedi.');
      }
    } catch (error: unknown) {
      const apiError = error as ApiError;
      setPasswordError(apiError.response?.data?.meta?.message || 'Şifre güncellenirken bir hata oluştu.');
    } finally {
      setPasswordLoading(false);
    }
  };

  if (profileLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="flex-1">
      {/* Üst Başlık */}
      <div className="mb-4 sm:mb-6 -mt-2 sm:mt-0">
        {/* Desktop Header */}
        <div className="hidden sm:flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <UserIcon className="w-6 h-6 text-orange-500" />
            <h1 className="text-xl font-semibold text-gray-900">Tüm Kullanıcı Bilgilerim</h1>
          </div>
        </div>

        {/* Mobile Header */}
        <div className="sm:hidden flex items-center justify-between">
          <div className="flex items-center gap-2">
            {onMenuClick && (
              <button
                onClick={onMenuClick}
                className="p-2 rounded-lg hover:bg-gray-100"
                aria-label="Menü"
              >
                <Bars3Icon className="w-6 h-6 text-gray-600" />
              </button>
            )}
            <UserIcon className="w-5 h-5 text-orange-500" />
            <h1 className="text-base font-semibold text-gray-900">Tüm Kullanıcı Bilgilerim</h1>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Üyelik Bilgileri */}
        <div className="bg-white rounded-lg p-3 sm:p-4 border border-gray-100">
          <h2 className="text-[#F27A1A] text-base sm:text-lg mb-3 sm:mb-4 font-semibold">Üyelik Bilgilerim</h2>
          <div className="space-y-3 sm:space-y-4">
            <div>
              <label className="block text-xs sm:text-sm text-gray-600 mb-1">Ad</label>
              <input
                type="text"
                placeholder="Adınız"
                value={profileForm.name}
                onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                className="w-full px-3 py-2.5 sm:py-2 rounded-md border border-gray-300 focus:ring-1 focus:ring-[#F27A1A]/20 focus:border-[#F27A1A] outline-none text-gray-900 text-sm sm:text-xs"
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm text-gray-600 mb-1">Soyad</label>
              <input
                type="text"
                placeholder="Soyadınız"
                value={profileForm.surname}
                onChange={(e) => setProfileForm({...profileForm, surname: e.target.value})}
                className="w-full px-3 py-2.5 sm:py-2 rounded-md border border-gray-300 focus:ring-1 focus:ring-[#F27A1A]/20 focus:border-[#F27A1A] outline-none text-gray-900 text-sm sm:text-xs"
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm text-gray-600 mb-1">E-Mail</label>
              <input
                type="email"
                placeholder="E-posta adresiniz"
                value={profileForm.email}
                onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                className={`w-full px-3 py-2.5 sm:py-2 rounded-md border border-gray-300 focus:ring-1 focus:ring-[#F27A1A]/20 focus:border-[#F27A1A] outline-none text-gray-900 text-sm sm:text-xs ${
                  isEmailEditable ? 'bg-white' : 'bg-gray-100'
                }`}
                readOnly={!isEmailEditable}
                disabled={!isEmailEditable}
              />
              {isEmailEditable && (
                <p className="text-xs text-gray-500 mt-1">
                  Telefon ile kayıt olduğunuz için e-posta adresinizi ekleyebilir veya değiştirebilirsiniz.
                </p>
              )}
            </div>
            <div>
              <label className="block text-xs sm:text-sm text-gray-600 mb-1">Cinsiyet</label>
              <select
                value={profileForm.gender}
                onChange={(e) => setProfileForm({...profileForm, gender: e.target.value})}
                className="w-full px-3 py-2.5 sm:py-2 rounded-md border border-gray-300 focus:ring-1 focus:ring-[#F27A1A]/20 focus:border-[#F27A1A] outline-none text-gray-900 bg-white text-sm sm:text-xs"
              >
                <option value="male">Erkek</option>
                <option value="female">Kadın</option>
              </select>
            </div>
            <div>
              <label className="block text-xs sm:text-sm text-gray-600 mb-1">Cep Telefonu</label>
              <div className="flex gap-2">
                <select 
                  className={`w-16 sm:w-20 px-2 py-2.5 sm:py-2 rounded-md border border-gray-300 focus:ring-1 focus:ring-[#F27A1A]/20 focus:border-[#F27A1A] outline-none text-gray-900 text-sm sm:text-xs ${
                    isEmailEditable ? 'bg-gray-100' : 'bg-white'
                  }`}
                  disabled={isEmailEditable}
                >
                  <option value="+90">+90</option>
                </select>
                <input
                  type="tel"
                  placeholder="Telefon numaranız"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                  maxLength={10}
                  className={`flex-1 px-3 py-2.5 sm:py-2 rounded-md border border-gray-300 focus:ring-1 focus:ring-[#F27A1A]/20 focus:border-[#F27A1A] outline-none text-gray-900 text-sm sm:text-xs ${
                    isEmailEditable ? 'bg-gray-100' : 'bg-white'
                  }`}
                  readOnly={isEmailEditable}
                  disabled={isEmailEditable}
                />
              </div>
              {isEmailEditable && (
                <p className="text-xs text-gray-500 mt-1">
                  Telefon ile kayıt olduğunuz için telefon numaranız değiştirilemez.
                </p>
              )}
            </div>
            <div>
              <label className="block text-xs sm:text-sm text-gray-600 mb-1">Doğum Tarihiniz</label>
              <div className="flex gap-2">
                <select 
                  value={profileForm.birthDay}
                  onChange={(e) => setProfileForm({...profileForm, birthDay: e.target.value})}
                  className="flex-1 px-2 py-2.5 sm:py-2 rounded-md border border-gray-300 focus:ring-1 focus:ring-[#F27A1A]/20 focus:border-[#F27A1A] outline-none text-gray-900 bg-white text-sm sm:text-xs"
                >
                  <option value="">Gün</option>
                  {[...Array(31)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                  ))}
                </select>
                <select 
                  value={profileForm.birthMonth}
                  onChange={(e) => setProfileForm({...profileForm, birthMonth: e.target.value})}
                  className="flex-1 px-2 py-2.5 sm:py-2 rounded-md border border-gray-300 focus:ring-1 focus:ring-[#F27A1A]/20 focus:border-[#F27A1A] outline-none text-gray-900 bg-white text-sm sm:text-xs"
                >
                  <option value="">Ay</option>
                  {[...Array(12)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                  ))}
                </select>
                <select 
                  value={profileForm.birthYear}
                  onChange={(e) => setProfileForm({...profileForm, birthYear: e.target.value})}
                  className="flex-1 px-2 py-2.5 sm:py-2 rounded-md border border-gray-300 focus:ring-1 focus:ring-[#F27A1A]/20 focus:border-[#F27A1A] outline-none text-gray-900 bg-white text-sm sm:text-xs"
                >
                  <option value="">Yıl</option>
                  {[...Array(100)].map((_, i) => (
                    <option key={2024 - i} value={2024 - i}>{2024 - i}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="flex items-start sm:items-center gap-2">
                <input 
                  type="checkbox"
                  checked={profileForm.notifications}
                  onChange={(e) => setProfileForm({...profileForm, notifications: e.target.checked})}
                  className="w-4 h-4 mt-0.5 sm:mt-0 text-[#F27A1A] rounded border-gray-300 focus:ring-[#F27A1A] checked:bg-[#F27A1A] flex-shrink-0" 
                />
                <span className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                  İş yeri alışverişlerim için fırsatlardan haberdar olmak istiyorum.
                </span>
              </label>
            </div>
          </div>
          <button 
            onClick={handleProfileUpdate}
            disabled={profileLoading}
            className={`mt-4 sm:mt-5 w-full py-2.5 sm:py-2 rounded-md font-medium text-sm sm:text-xs transition-colors ${
              isProfileFormFilled && !profileLoading
                ? 'bg-[#F27A1A] text-white hover:bg-[#F27A1A]/90' 
                : 'bg-[#F1F2F3] text-gray-700 hover:bg-[#E5E7E9]'
            }`}
          >
            {profileLoading ? 'Güncelleniyor...' : 'Güncelle'}
          </button>
        </div>

        {/* Şifre Güncelleme ve İki Adımlı Doğrulama */}
        <div className="bg-white rounded-lg p-3 sm:p-4 border border-gray-100">
          <div className="mb-4 sm:mb-6">
            <h2 className="text-[#F27A1A] text-base sm:text-lg mb-3 sm:mb-4 font-semibold">Şifre Güncelleme</h2>
            <form autoComplete="off" onSubmit={e => { e.preventDefault(); handlePasswordUpdate(); }}>
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm text-gray-600 mb-1">Şu Anki Şifre</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Mevcut şifreniz"
                      name="current-password"
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                      autoComplete="new-password"
                      className="w-full px-3 py-2.5 sm:py-2 rounded-md border border-gray-300 focus:ring-1 focus:ring-[#F27A1A]/20 focus:border-[#F27A1A] outline-none text-gray-900 text-sm sm:text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <EyeIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm text-gray-600 mb-1">Yeni Şifre</label>
                  <input 
                    type="password" 
                    placeholder="Yeni şifreniz"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                    className="w-full px-3 py-2.5 sm:py-2 rounded-md border border-gray-300 focus:ring-1 focus:ring-[#F27A1A]/20 focus:border-[#F27A1A] outline-none text-gray-900 text-sm sm:text-xs"
                  />
                  <p className="text-xs sm:text-[10px] text-gray-500 mt-1 leading-relaxed">
                    Şifreniz en az 10 karakter olmalı, 1 büyük harf, 1 küçük harf ve rakam içermelidir.
                  </p>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm text-gray-600 mb-1">Yeni Şifre (Tekrar)</label>
                  <input 
                    type="password" 
                    placeholder="Yeni şifrenizi tekrar girin"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                    className="w-full px-3 py-2.5 sm:py-2 rounded-md border border-gray-300 focus:ring-1 focus:ring-[#F27A1A]/20 focus:border-[#F27A1A] outline-none text-gray-900 text-sm sm:text-xs"
                  />
                </div>
                {passwordError && (
                  <div className="text-xs sm:text-sm text-red-500 mt-1">{passwordError}</div>
                )}
              </div>
              <button 
                type="submit"
                disabled={passwordLoading || !isPasswordFormFilled}
                className={`mt-4 sm:mt-5 w-full py-2.5 sm:py-2 rounded-md font-medium text-sm sm:text-xs transition-colors ${
                  isPasswordFormFilled && !passwordLoading
                    ? 'bg-[#F27A1A] text-white hover:bg-[#F27A1A]/90' 
                    : 'bg-[#F1F2F3] text-gray-700 hover:bg-[#E5E7E9]'
                }`}
              >
                {passwordLoading ? 'Güncelleniyor...' : 'Güncelle'}
              </button>
            </form>
          </div>

          {/* İki Adımlı Doğrulama */}
          <div className="border-t pt-4 sm:pt-5 mt-4 sm:mt-5">
            <div className="flex items-start sm:items-center justify-between gap-3">
              <div className="flex-1">
                <h2 className="text-xs sm:text-sm font-semibold text-gray-900">İKİ ADIMLI DOĞRULAMA</h2>
                <p className="text-xs sm:text-[10px] text-gray-500 mt-1 leading-relaxed">
                  İki adımlı doğrulama yöntemini etkinleştirdiğinizde, kişisel şifrelerinize ek olarak kayıtlı cep telefonunuza gelen doğrulama koduyla oturum açarsınız.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                <input
                  type="checkbox"
                  checked={twoFactorAuth}
                  onChange={(e) => setTwoFactorAuth(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-10 h-6 sm:w-9 sm:h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 sm:after:h-4 sm:after:w-4 after:transition-all peer-checked:bg-[#F27A1A]"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
