"use client"

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { LockClosedIcon, EyeIcon, EyeSlashIcon, XMarkIcon, UserIcon, ArrowLeftIcon, PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import Header from '@/components/layout/Header';
import ScrollToTop from '@/components/ui/ScrollToTop';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import ExplicitConsentModal from '@/components/common/ExplicitConsentModal';
import { API_V1_URL } from '@/lib/config';
import toast from 'react-hot-toast';

const SignUpPage = () => {
  const router = useRouter();
  const { setIsLoggedIn, fetchUserInfo, checkAuth } = useAuth();
  const [signupMethod, setSignupMethod] = useState<'phone' | 'email'>('phone');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [gender, setGender] = useState('');
  const [dataProcessing, setDataProcessing] = useState(false);
  const [emailConsent, setEmailConsent] = useState(false);
  const [privacyPolicy, setPrivacyPolicy] = useState(false);
  const [showVerificationPopup, setShowVerificationPopup] = useState(false);
  const [verificationType, setVerificationType] = useState<null | 'phone' | 'email'>(null);
  const [verificationTimer, setVerificationTimer] = useState(600);
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0, // 0: empty, 1: weak, 2: medium, 3: strong
    message: ''
  });
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showOrderTrackingModal, setShowOrderTrackingModal] = useState(false);
  const verificationInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [passwordError, setPasswordError] = useState('');
  const [showExplicitConsentModal, setShowExplicitConsentModal] = useState(false);
  const [explicitConsentActiveTab, setExplicitConsentActiveTab] = useState<'consent' | 'clarification' | 'membership'>('consent');
  const handleBackNavigation = useCallback(() => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  }, [router]);
  
  // Swipe gesture states
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const switchRef = useRef<HTMLDivElement>(null);

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

    if (isRightSwipe) {
      // Swipe right - go to login
      setIsAnimating(true);
      setTimeout(() => {
        router.push('/giris');
      }, 300);
    } else if (isLeftSwipe) {
      // Swipe left - stay on signup (already here)
      setIsAnimating(true);
      setTimeout(() => {
        setIsAnimating(false);
      }, 300);
    }
  };

  // Geri sayım için useEffect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (showVerificationPopup && verificationTimer > 0) {
      timer = setInterval(() => {
        setVerificationTimer((prev) => prev - 1);
      }, 1000);
    }

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [showVerificationPopup, verificationTimer]);

  const handleSubmitPhone = async () => {
    try {
      if (!phone) {
        toast.error('İsim, soyisim, telefon ve şifre alanları zorunludur.');
        return;
      }
      
      if (!password || !firstName || !lastName) {
        toast.error('İsim, soyisim ve şifre alanları zorunludur.');
        return;
      }
      
      // Telefon numarası validasyonu - 11 haneli (05459092349 gibi)
      const phoneRegex = /^0\d{10}$/;
      const cleanedPhone = phone.replace(/\s/g, '');
      if (!phoneRegex.test(cleanedPhone)) {
        toast.error('Geçerli bir telefon numarası giriniz. (11 rakam, örn: 05459092349)');
        return;
      }

      // Checkbox validasyonları
      if (!dataProcessing) {
        toast.error('Kişisel verilerin işlenmesine açık rıza vermelisiniz.');
        return;
      }

      if (!emailConsent) {
        toast.error('Elektronik ileti gönderilmesi onayını vermelisiniz.');
        return;
      }

      if (!privacyPolicy) {
        toast.error('Aydınlatma metnini okuduğunuzu onaylamalısınız.');
        return;
      }

      const passwordMeetsRequirements =
        password.length >= 10 &&
        /[A-Z]/.test(password) &&
        /[a-z]/.test(password) &&
        /[0-9]/.test(password);

      if (!passwordMeetsRequirements) {
        const requirementMessage = 'Şifreniz en az 10 karakter olmalı; en az bir büyük harf, bir küçük harf ve bir rakam içermelidir.';
        setPasswordError(requirementMessage);
        toast.error(requirementMessage);
        return;
      }

      const trimmedFirstName = firstName.trim();
      const trimmedLastName = lastName.trim();
      
      // Endpoint path'i kontrol et - kullanıcı /v1/customer/auth/register dedi
      const registerEndpoint = `${API_V1_URL}/customer/auth/register`;
      
      // Request body - sadece telefon ile kayıt
      const requestBody = {
        password: password,
        name: trimmedFirstName,
        lastname: trimmedLastName,
        phone: cleanedPhone,
        gender: gender || undefined
      };

      const registerResponse = await fetch(registerEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      const data = await registerResponse.json();

      if (data.meta?.status === 'success' || 
          data.meta?.message?.includes('exists') || 
          data.meta?.message === 'duplicated_code' ||
          data.meta?.message === 'pending_validation' ||
          data.meta?.code === 400) {
        // Pending bilgilerini kaydet - sadece telefon
        localStorage.setItem('pendingUserPhone', phone.replace(/\s/g, ''));
        localStorage.setItem('pendingUserPassword', password);
        setShowVerificationPopup(true);
        setVerificationTimer(600);
        setVerificationCode(['', '', '', '', '', '']);
        setVerificationType('phone');
      } else {
        throw new Error(data.meta?.message || 'Kayıt işlemi sırasında bir hata oluştu');
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Kayıt işlemi sırasında bir hata oluştu';
      toast.error(errorMessage);
    }
  };

  const handleSubmitEmail = async () => {
    try {
      if (!email || !password || !firstName || !lastName) {
        toast.error('İsim, soyisim, e-posta ve şifre alanları zorunludur.');
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const trimmedEmail = email.trim();
      if (!emailRegex.test(trimmedEmail)) {
        toast.error('Geçerli bir e-posta adresi giriniz.');
        return;
      }

      if (!dataProcessing) {
        toast.error('Kişisel verilerin işlenmesine açık rıza vermelisiniz.');
        return;
      }
      if (!emailConsent) {
        toast.error('Elektronik ileti gönderilmesi onayını vermelisiniz.');
        return;
      }
      if (!privacyPolicy) {
        toast.error('Aydınlatma metnini okuduğunuzu onaylamalısınız.');
        return;
      }

      const passwordMeetsRequirements =
        password.length >= 10 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password);
      if (!passwordMeetsRequirements) {
        const requirementMessage = 'Şifreniz en az 10 karakter olmalı; en az bir büyük harf, bir küçük harf ve bir rakam içermelidir.';
        setPasswordError(requirementMessage);
        toast.error(requirementMessage);
        return;
      }

      const trimmedFirstName = firstName.trim();
      const trimmedLastName = lastName.trim();

      const registerResponse = await fetch(`${API_V1_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          email: trimmedEmail,
          password: password,
          name: trimmedFirstName,
          lastname: trimmedLastName,
          gender: gender || undefined,
          device_name: 'web'
        })
      });

      const data = await registerResponse.json();

      if (
        data.meta?.status === 'success' ||
        data.meta?.message?.includes('exists') ||
        data.meta?.message === 'duplicated_code' ||
        data.meta?.message === 'pending_validation' ||
        data.meta?.code === 400
      ) {
        localStorage.setItem('pendingUserEmail', trimmedEmail);
        localStorage.setItem('pendingUserPassword', password);
        setShowVerificationPopup(true);
        setVerificationTimer(600);
        setVerificationCode(['', '', '', '', '', '']);
        setVerificationType('email');
      } else {
        throw new Error(data.meta?.message || 'Kayıt işlemi sırasında bir hata oluştu');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Kayıt işlemi sırasında bir hata oluştu';
      toast.error(errorMessage);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (signupMethod === 'phone') {
      await handleSubmitPhone();
    } else {
      await handleSubmitEmail();
    }
  };

  // Doğrulama kodu değişikliği için handler
  const handleVerificationCodeChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newCode = [...verificationCode];
      newCode[index] = value;
      setVerificationCode(newCode);

      // Otomatik olarak sonraki input'a geç
      if (value && index < 5) {
        verificationInputRefs.current[index + 1]?.focus();
      }
    }
  };

  // Klavye olayları için handler
  const handleVerificationKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      // Boş input'ta backspace'e basılırsa önceki input'a git
      verificationInputRefs.current[index - 1]?.focus();
    }
  };

  // Doğrulama kodunu gönderme
  const handleVerifyCode = async () => {
    try {
      const code = verificationCode.join('');
      if (verificationType === 'email') {
        const userEmail = localStorage.getItem('pendingUserEmail');
        const userPassword = localStorage.getItem('pendingUserPassword');
        if (!userEmail) throw new Error('Email bilgisi bulunamadı');
        const response = await fetch(`${API_V1_URL}/auth/validate-code`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({ email: userEmail, code, device_name: 'web' })
        });
        const data = await response.json();
        if (response.ok && data.meta?.status === 'success') {
          if (userPassword) {
            await performAutoLoginEmail(userEmail, userPassword);
          } else {
            router.push('/');
          }
          localStorage.removeItem('pendingUserEmail');
          localStorage.removeItem('pendingUserPassword');
          setShowVerificationPopup(false);
        } else {
          const errorMessage = data.meta?.message || 'Doğrulama kodu hatalı';
          throw new Error(errorMessage);
        }
      } else {
        const userPhone = localStorage.getItem('pendingUserPhone');
        const userPassword = localStorage.getItem('pendingUserPassword');
        if (!userPhone) throw new Error('Telefon bilgisi bulunamadı');
        const response = await fetch(`${API_V1_URL}/customer/auth/validate-code`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({ phone: userPhone, code })
        });
        const data = await response.json();
        if (response.ok && data.meta?.status === 'success') {
          if (userPassword && userPhone) {
            await performAutoLogin(userPhone, userPassword);
          } else {
            router.push('/');
          }
          localStorage.removeItem('pendingUserPhone');
          localStorage.removeItem('pendingUserPassword');
          setShowVerificationPopup(false);
        } else {
          const errorMessage = data.meta?.message || 'Doğrulama kodu hatalı';
          throw new Error(errorMessage);
        }
      }
    } catch (error) {
      let errorMessage = 'Doğrulama başarısız oldu. ';
      if (error instanceof Error) {
        errorMessage += error.message;
      }
      toast.error(`${errorMessage} Lütfen kodu kontrol edip tekrar deneyin.`);
    }
  };

  // Otomatik login fonksiyonu
  const performAutoLogin = async (phone: string, password: string) => {
    try {
      const loginBody = {
        phone: phone.replace(/\s/g, ''),
        password: password,
        device_name: 'web'
      };
      
      // Telefon ile login için müşteri endpoint'i kullan
      const loginResponse = await fetch(`${API_V1_URL}/customer/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(loginBody)
      });

      const loginData = await loginResponse.json();

      if (loginData.meta?.status === 'success' && loginData.data?.access_token) {
        const token = loginData.data.access_token;
        
        // Token'ı hem localStorage hem cookie'ye kaydet
        localStorage.setItem('token', token);
        document.cookie = `token=${token}; path=/; max-age=2592000`; // 30 gün
        
        if (loginData.data.user) {
          localStorage.setItem('user', JSON.stringify(loginData.data.user));
          localStorage.setItem('userEmail', loginData.data.user.email);
        }
        
        await fetchUserInfo(token);
        setIsLoggedIn(true);
        
        // Yeni kayıt olan kullanıcı için notification modal'ı aç
        const userIdentifier = phone.replace(/\s/g, '');
        localStorage.removeItem(`hasSeenNotificationModal_${userIdentifier}`);
        
        // Kısa bir bekleme ekleyerek state'in güncellenmesini bekle
        setTimeout(() => {
          router.push('/');
        }, 500);
      } else {
        throw new Error('Otomatik giriş başarısız oldu');
      }
    } catch (error) {
      // Hata olsa bile ana sayfaya yönlendir
      router.push('/');
    }
  };

  const performAutoLoginEmail = async (email: string, password: string) => {
    try {
      const loginResponse = await fetch(`${API_V1_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email: email.trim(), password, device_name: 'web' })
      });
      const loginData = await loginResponse.json();
      if (loginData.meta?.status === 'success' && loginData.data?.access_token) {
        const token = loginData.data.access_token;
        localStorage.setItem('token', token);
        document.cookie = `token=${token}; path=/; max-age=2592000`;
        if (loginData.data.user) {
          localStorage.setItem('user', JSON.stringify(loginData.data.user));
          localStorage.setItem('userEmail', loginData.data.user.email);
        }
        await fetchUserInfo(token);
        setIsLoggedIn(true);
        localStorage.removeItem(`hasSeenNotificationModal_${email.trim()}`);
        setTimeout(() => {
          router.push('/');
        }, 500);
      } else {
        throw new Error('Otomatik giriş başarısız oldu');
      }
    } catch (error) {
      router.push('/');
    }
  };

  // Yeni kod gönderme işlemini güncelleyelim
  const handleResendCode = async () => {
    try {
      const userPhone = localStorage.getItem('pendingUserPhone');

      if (!userPhone) {
        throw new Error('Telefon bilgisi bulunamadı');
      }

      // Endpoint path'i kontrol et - resend-code endpoint'i muhtemelen aynı yapıda
      const resendEndpoint = `${API_V1_URL}/customer/auth/resend-code`;
      
      const requestBody = {
        phone: userPhone
      };

      const response = await fetch(resendEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();

      if (response.ok && data.meta?.status === 'success') {
        setVerificationTimer(600);
        setVerificationCode(['', '', '', '', '', '']);
        toast.success('Yeni doğrulama kodu telefon numaranıza gönderildi.');
      } else {
        const errorMessage = data.meta?.message || 'Kod gönderme başarısız oldu';
        throw new Error(errorMessage);
      }
    } catch (error) {
      toast.error('Yeni kod gönderme işlemi başarısız oldu. Lütfen tekrar deneyin.');
    }
  };

  // Popup'ı kapatma işlemi için yeni fonksiyon
  const handleCloseVerification = () => {
    if (window.confirm('Doğrulama işlemini iptal etmek istediğinize emin misiniz?')) {
        setShowVerificationPopup(false);
        localStorage.removeItem('pendingUserPhone');
        localStorage.removeItem('pendingUserEmail');
        localStorage.removeItem('pendingUserPassword');
        setVerificationCode(['', '', '', '', '', '']);
    }
  };

  // Şifre gücünü hesapla
  const calculatePasswordStrength = (password: string) => {
    if (password.length === 0) {
      setPasswordStrength({ score: 0, message: '' });
      setPasswordError('');
      return;
    }

    // Identifier ile aynı şifre kontrolü
    if (signupMethod === 'phone') {
      if (password === phone.replace(/\s/g, '')) {
        setPasswordStrength({ score: 0, message: 'Zayıf' });
        setPasswordError('Şifreniz telefon numaranızla aynı olamaz');
        return;
      }
    } else {
      if (email && password === email) {
        setPasswordStrength({ score: 0, message: 'Zayıf' });
        setPasswordError('Şifreniz e-posta adresinizle aynı olamaz');
        return;
      }
    }

    let score = 0;
    const checks = {
      length: false,
      hasUpperCase: false,
      hasLowerCase: false,
      hasNumber: false,
      hasSpecialChar: false
    };

    // Uzunluk kontrolü
    if (password.length >= 8) {
      checks.length = true;
      score += 1;
    }

    // Büyük harf kontrolü
    if (/[A-Z]/.test(password)) {
      checks.hasUpperCase = true;
      score += 1;
    }

    // Küçük harf kontrolü
    if (/[a-z]/.test(password)) {
      checks.hasLowerCase = true;
      score += 1;
    }

    // Rakam kontrolü
    if (/[0-9]/.test(password)) {
      checks.hasNumber = true;
      score += 1;
    }

    // Özel karakter kontrolü
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      checks.hasSpecialChar = true;
      score += 1;
    }

    // Skor hesaplama
    const finalScore = score >= 4 ? 3 : score >= 3 ? 2 : 1;
    const messages = ['Zayıf', 'Orta', 'Güçlü'];

    const requirementsMet =
      password.length >= 10 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /[0-9]/.test(password);

    setPasswordStrength({
      score: finalScore,
      message: messages[finalScore - 1]
    });
    setPasswordError(
      requirementsMet
        ? ''
        : 'Şifreniz en az 10 karakter olmalı; en az bir büyük harf, bir küçük harf ve bir rakam içermelidir.'
    );
  };

  // Password input handler'ını güncelle
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    calculatePasswordStrength(newPassword);
  };

  // Verification Popup JSX
  const renderVerificationPopup = () => {
    if (!showVerificationPopup) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 relative">
          <button 
            onClick={handleCloseVerification}
            className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
          
          <h2 className="text-2xl font-semibold mb-4 text-black">
            {verificationType === 'email' ? 'Email Doğrulama' : 'Telefon Doğrulama'}
          </h2>
          <p className="text-black mb-6">
            {verificationType === 'email'
              ? 'E-posta adresinize gönderilen 6 haneli doğrulama kodunu giriniz.'
              : 'Telefon numaranıza gönderilen 6 haneli doğrulama kodunu giriniz.'}
          </p>

          <div className="flex gap-2 mb-6 justify-center">
            {verificationCode.map((digit, index) => (
              <input
                key={index}
                type="tel"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                onChange={(e) => handleVerificationCodeChange(index, e.target.value)}
                onKeyDown={(e) => handleVerificationKeyDown(e, index)}
                className="w-12 h-12 text-center border-2 rounded-lg text-xl text-black focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                ref={el => { verificationInputRefs.current[index] = el; }}
              />
            ))}
          </div>

          <div className="text-center mb-6">
            <span className="text-black">Kalan Süre: </span>
            <span className="font-semibold text-black">
              {Math.floor(verificationTimer / 60)}:{(verificationTimer % 60).toString().padStart(2, '0')}
            </span>
          </div>

          <button
            onClick={handleVerifyCode}
            className="w-full bg-orange-500 text-white py-3 rounded-md hover:bg-orange-600 transition-colors mb-4"
            disabled={verificationCode.some(digit => digit === '')}
          >
            Onayla
          </button>

          <button
            onClick={handleResendCode}
            disabled={verificationTimer > 0}
            className={`w-full py-3 rounded-md text-center ${
              verificationTimer > 0 
                ? 'text-gray-400 cursor-not-allowed' 
                : 'text-black hover:text-orange-600'
            }`}
          >
            Kodu Tekrar Gönder
          </button>
        </div>
      </div>
    );
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
          <div className="absolute inset-0 bg-gradient-to-br from-orange-200 via-orange-300 to-red-300">
            <div className="absolute inset-0 bg-gradient-to-t from-white/30 via-transparent to-white/20"></div>
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
            <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/5 rounded-full"></div>
          </div>
          
          {/* Header Content */}
          <div className="relative px-4 py-6 flex items-center">
            <button
              onClick={handleBackNavigation}
              className="md:hidden mr-3 flex items-center justify-center rounded-md border border-white/70 bg-white/80 p-2 text-gray-600 shadow-sm transition-colors duration-200 hover:bg-white hover:text-gray-900"
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
        <div className="px-4 py-6 relative min-h-[65vh] flex items-center">
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
                      right: isDragging ? `${8 - dragOffset}px` : '8px',
                      transform: isDragging ? `translateX(${-dragOffset}px)` : 'translateX(0)',
                      transition: isDragging ? 'none' : 'transform 0.3s ease-in-out'
                    }}
                  ></div>
                  
                  <button 
                    onClick={() => router.push('/giris')}
                    className="flex-1 text-center py-3 px-4 rounded-xl text-gray-600 font-semibold relative z-10 transition-colors duration-300 hover:text-orange-500"
                  >
                    Giriş Yap
                  </button>
                  <button 
                    onClick={() => router.push('/kayit-ol')}
                    className="flex-1 text-center py-3 px-4 rounded-xl text-white font-semibold relative z-10 transition-colors duration-300"
                  >
                    Üye Ol
                  </button>
                </div>
              </div>
            </div>

            {/* Kayıt Yöntemi Sekmeleri (Mobil) */}
            <div className="mb-4">
              <div className="grid grid-cols-2 rounded-xl border border-gray-200 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setSignupMethod('phone')}
                  className={`py-2 text-sm font-medium ${signupMethod === 'phone' ? 'bg-orange-500 text-white' : 'bg-white text-gray-700 hover:text-orange-600'}`}
                >
                  Telefon ile Kayıt
                </button>
                <button
                  type="button"
                  onClick={() => setSignupMethod('email')}
                  className={`py-2 text-sm font-medium ${signupMethod === 'email' ? 'bg-orange-500 text-white' : 'bg-white text-gray-700 hover:text-orange-600'}`}
                >
                  E-posta ile Kayıt
                </button>
              </div>
            </div>

            
            
            <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <input
                id="mobile-firstName"
                name="firstName"
                type="text"
                required
                placeholder="İsim"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-black"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>

            <div>
              <input
                id="mobile-lastName"
                name="lastName"
                type="text"
                required
                placeholder="Soyisim"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-black"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>

            {signupMethod === 'phone' ? (
              <div>
                <input
                  id="mobile-phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  required
                  maxLength={11}
                  placeholder="Telefon (11 hane, örn: 05459092349)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-black"
                  value={phone}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^\d]/g, '').slice(0, 11);
                    setPhone(value);
                  }}
                />
              </div>
            ) : (
              <div className="relative">
                <input
                  id="mobile-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="E-posta adresi"
                  className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-black"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <EnvelopeIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
            )}

            <div className="relative">
              <input
                id="mobile-password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                placeholder="Şifre"
                className={`w-full px-4 py-3 pr-12 border ${
                  passwordError ? 'border-red-500' : 'border-gray-300'
                } rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-black`}
                value={password}
                onChange={handlePasswordChange}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                )}
              </button>
            </div>

                    <div className="mt-2">
                      {password && (
                        <div className="mb-2">
                          <div className="flex h-1.5 rounded-full bg-gray-200 overflow-hidden">
                            <div
                              className={`transition-all duration-300 ease-in-out ${
                                passwordStrength.score === 1
                                  ? 'w-1/3 bg-red-500'
                                  : passwordStrength.score === 2
                                  ? 'w-2/3 bg-yellow-500'
                                  : passwordStrength.score === 3
                                  ? 'w-full bg-green-500'
                                  : 'w-0'
                              }`}
                            />
                          </div>
                          <p
                            className={`text-xs mt-1 ${
                              passwordStrength.score === 1
                                ? 'text-red-500'
                                : passwordStrength.score === 2
                                ? 'text-yellow-500'
                                : 'text-green-500'
                            }`}
                          >
                            {passwordStrength.message}
                          </p>
                        </div>
                      )}
                      <p className="text-xs text-gray-600">
                        Şifreniz en az 10 karakter olmalı; en az bir büyük harf, bir küçük harf ve bir rakam içermelidir.
                      </p>
                      {passwordError && (
                        <p className="text-xs text-red-500 mt-1">{passwordError}</p>
                      )}
                    </div>

            {/* Cinsiyet Seçimi */}
            <div>
              <div className="flex space-x-2">
                <label className="relative flex-1">
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    className="peer sr-only"
                    onChange={(e) => setGender(e.target.value)}
                  />
                  <div className="w-full p-3 text-center border rounded-lg cursor-pointer text-sm text-gray-500 
                    peer-checked:border-orange-500 peer-checked:bg-orange-50 hover:border-orange-500 
                    transition-colors border-gray-200">
                    <span>Kadın</span>
                  </div>
                </label>

                <label className="relative flex-1">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    className="peer sr-only"
                    onChange={(e) => setGender(e.target.value)}
                  />
                  <div className="w-full p-3 text-center border rounded-lg cursor-pointer text-sm text-gray-500 
                    peer-checked:border-orange-500 peer-checked:bg-orange-50 hover:border-orange-500 
                    transition-colors border-gray-200">
                    <span>Erkek</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Checkbox'lar */}
            <div className="space-y-3">
              <div className="flex items-start">
                <input
                  id="mobile-dataProcessing"
                  name="dataProcessing"
                  type="checkbox"
                  className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded mt-1 accent-orange-500"
                  checked={dataProcessing}
                  onChange={(e) => setDataProcessing(e.target.checked)}
                />
                <label htmlFor="mobile-dataProcessing" className="ml-2 block text-sm text-black">
                  Tarafıma avantajlı tekliflerin sunulabilmesi amacıyla kişisel verilerimin işlenmesine ve paylaşılmasına
                  <Link
                    href="/s/acik-riza-metni"
                    target="_blank"
                    className="text-black underline ml-1 hover:text-orange-500 cursor-pointer p-0 bg-transparent border-0 text-sm"
                  >
                    açık rıza
                  </Link>
                  {' '}
                  veriyorum.
                </label>
              </div>

              <div className="flex items-start">
                <input
                  id="mobile-emailConsent"
                  name="emailConsent"
                  type="checkbox"
                  className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded mt-1 accent-orange-500"
                  checked={emailConsent}
                  onChange={(e) => setEmailConsent(e.target.checked)}
                />
                <label htmlFor="mobile-emailConsent" className="ml-2 block text-sm text-black">
                  Tarafıma elektronik ileti gönderilmesini kabul ediyorum.
                </label>
              </div>

              <div className="flex items-start">
                <input
                  id="mobile-privacyPolicy"
                  name="privacyPolicy"
                  type="checkbox"
                  className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded mt-1 accent-orange-500"
                  checked={privacyPolicy}
                  onChange={(e) => setPrivacyPolicy(e.target.checked)}
                />
                <label htmlFor="mobile-privacyPolicy" className="ml-2 block text-sm text-black">
                  Kişisel verilerimin işlenmesine yönelik
                  <Link
                    href="/s/aydinlatma-metni"
                    target="_blank"
                    className="text-black underline ml-1 hover:text-orange-500 cursor-pointer p-0 bg-transparent border-0 text-sm"
                  >
                    aydınlatma metnini
                  </Link>
                  {' '}
                  okudum ve anladım.
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={
                (signupMethod === 'phone' ? !phone : !email) ||
                !password || !firstName || !lastName || !dataProcessing || !emailConsent || !privacyPolicy || !!passwordError
              }
              className={`w-full py-3 px-4 rounded-lg font-semibold text-lg transition-colors ${
                ((signupMethod === 'phone' ? !phone : !email) ||
                !password || !firstName || !lastName || !dataProcessing || !emailConsent || !privacyPolicy || !!passwordError)
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500'
              }`}
            >
              ÜYE OL
            </button>
            
            <p className="text-xs text-center text-gray-500">
              Üye Ol&apos;a basarak
              <Link 
                href="/s/uyelik-kosullari"
                target="_blank"
                className="text-black underline ml-1 hover:text-orange-500 cursor-pointer p-0 bg-transparent border-0 text-xs"
              >
                Üyelik Koşulları
              </Link>
              {' '}
              &apos;nı kabul ediyorum
            </p>
            </form>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:block min-h-screen bg-gray-50 flex flex-col justify-center py-8 sm:py-12 lg:py-16 xl:py-20 px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        <div className="sm:mx-auto sm:w-full sm:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl">
          <h1 className="text-center text-lg sm:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-normal text-gray-800">
            Merhaba,
          </h1>
          <p className="mt-2 sm:mt-3 lg:mt-4 text-center text-sm sm:text-base lg:text-lg xl:text-xl text-gray-800">
            Trendruum&apos;a giriş yap veya hesap oluştur, indirimleri kaçırma!
          </p>
        </div>

        <div className="mt-6 sm:mt-8 lg:mt-10 xl:mt-12 sm:mx-auto sm:w-full sm:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl">
          <div className="bg-white py-6 sm:py-8 lg:py-10 xl:py-12 px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 rounded-lg border border-gray-200">
            <div className="flex justify-center space-x-8 mb-8">
              <button 
                onClick={() => router.push('/giris')}
                className="text-xl font-semibold text-black hover:text-orange-500 transition-colors pb-2"
              >
                Giriş Yap
              </button>
              <button 
                onClick={() => router.push('/kayit-ol')}
                className="text-xl font-semibold text-black hover:text-orange-500 transition-colors border-b-2 border-orange-500 pb-2"
              >
                Üye Ol
              </button>
            </div>

            {/* Kayıt Yöntemi Sekmeleri (Desktop) */}
            <div className="mb-6">
              <div className="inline-flex rounded-xl border border-gray-200 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setSignupMethod('phone')}
                  className={`px-4 py-2 text-sm font-medium ${signupMethod === 'phone' ? 'bg-orange-500 text-white' : 'bg-white text-gray-700 hover:text-orange-600'}`}
                >
                  Telefon ile Kayıt
                </button>
                <button
                  type="button"
                  onClick={() => setSignupMethod('email')}
                  className={`px-4 py-2 text-sm font-medium ${signupMethod === 'email' ? 'bg-orange-500 text-white' : 'bg-white text-gray-700 hover:text-orange-600'}`}
                >
                  E-posta ile Kayıt
                </button>
              </div>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-black">
                  İsim
                </label>
                <div className="mt-1 relative">
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-black"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                  <UserIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-black">
                  Soyisim
                </label>
                <div className="mt-1 relative">
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-black"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                  <UserIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                </div>
              </div>

              {signupMethod === 'phone' ? (
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-black">
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
                      className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-black"
                      value={phone}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^\d]/g, '').slice(0, 11);
                        setPhone(value);
                      }}
                    />
                    <PhoneIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  </div>
                </div>
              ) : (
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-black">
                    E-posta Adresi
                  </label>
                  <div className="mt-1 relative">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-black"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <EnvelopeIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-black">
                  Şifre
                </label>
                <div className="mt-1 relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    className={`appearance-none block w-full px-3 py-2 pl-10 pr-10 border ${
                      passwordError ? 'border-red-500' : 'border-gray-300'
                    } rounded-md placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-black`}
                    value={password}
                    onChange={handlePasswordChange}
                  />
                  <LockClosedIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>

                    <div className="mt-2 space-y-2">
                      {password && (
                        <div>
                          <div className="flex h-1.5 rounded-full bg-gray-200 overflow-hidden">
                            <div
                              className={`transition-all duration-300 ease-in-out ${
                                passwordStrength.score === 1
                                  ? 'w-1/3 bg-red-500'
                                  : passwordStrength.score === 2
                                  ? 'w-2/3 bg-yellow-500'
                                  : passwordStrength.score === 3
                                  ? 'w-full bg-green-500'
                                  : 'w-0'
                              }`}
                            />
                          </div>
                          <p
                            className={`text-xs mt-1 ${
                              passwordStrength.score === 1
                                ? 'text-red-500'
                                : passwordStrength.score === 2
                                ? 'text-yellow-500'
                                : 'text-green-500'
                            }`}
                          >
                            {passwordStrength.message}
                          </p>
                        </div>
                      )}
                      <p className="text-xs text-gray-600">
                        Şifreniz en az 10 karakter olmalı; en az bir büyük harf, bir küçük harf ve bir rakam içermelidir.
                      </p>
                      {passwordError && (
                        <p className="text-xs text-red-500">{passwordError}</p>
                      )}
                    </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-3">
                  Cinsiyet (Opsiyonel)
                </label>
                <div className="flex space-x-4">
                  <label className="relative flex-1">
                    <input
                      type="radio"
                      name="gender"
                      value="female"
                      className="peer sr-only"
                      onChange={(e) => setGender(e.target.value)}
                    />
                    <div className="w-full p-3 text-center border rounded-md cursor-pointer text-xs text-gray-500 
                      peer-checked:border-orange-500 peer-checked:bg-orange-50 hover:border-orange-500 
                      transition-colors border-gray-200">
                      <span>Kadın</span>
                    </div>
                  </label>

                  <label className="relative flex-1">
                    <input
                      type="radio"
                      name="gender"
                      value="male"
                      className="peer sr-only"
                      onChange={(e) => setGender(e.target.value)}
                    />
                    <div className="w-full p-3 text-center border rounded-md cursor-pointer text-xs text-gray-500 
                      peer-checked:border-orange-500 peer-checked:bg-orange-50 hover:border-orange-500 
                      transition-colors border-gray-200">
                      <span>Erkek</span>
                    </div>
                  </label>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start">
                  <input
                    id="dataProcessing"
                    name="dataProcessing"
                    type="checkbox"
                    className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded mt-1 accent-orange-500"
                    checked={dataProcessing}
                    onChange={(e) => setDataProcessing(e.target.checked)}
                  />
                  <label htmlFor="dataProcessing" className="ml-2 block text-sm text-black">
                    Tarafıma avantajlı tekliflerin sunulabilmesi amacıyla kişisel verilerimin işlenmesine ve paylaşılmasına
                    <Link
                      href="/s/acik-riza-metni"
                      target="_blank"
                      className="text-black underline ml-1 hover:text-orange-500 cursor-pointer p-0 bg-transparent border-0 text-sm"
                    >
                      açık rıza
                    </Link>
                    {' '}
                    veriyorum.
                  </label>
                </div>

                <div className="flex items-start">
                  <input
                    id="emailConsent"
                    name="emailConsent"
                    type="checkbox"
                    className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded mt-1 accent-orange-500"
                    checked={emailConsent}
                    onChange={(e) => setEmailConsent(e.target.checked)}
                  />
                  
                  
                  <label htmlFor="emailConsent" className="ml-2 block text-sm text-black">
                    Tarafıma elektronik ileti gönderilmesini kabul ediyorum.
                  </label>
                </div>

                <div className="flex items-start">
                  <input
                    id="privacyPolicy"
                    name="privacyPolicy"
                    type="checkbox"
                    className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded mt-1 accent-orange-500"
                    checked={privacyPolicy}
                    onChange={(e) => setPrivacyPolicy(e.target.checked)}
                  />
                  <label htmlFor="privacyPolicy" className="ml-2 block text-sm text-black">
                    Kişisel verilerimin işlenmesine yönelik
                    <Link
                      href="/s/aydinlatma-metni"
                      target="_blank"
                      className="text-black underline ml-1 hover:text-orange-500 cursor-pointer p-0 bg-transparent border-0 text-sm"
                    >
                      aydınlatma metnini
                    </Link>
                    {' '}
                    okudum ve anladım.
                  </label>
                </div>
              </div>

              <div className="space-y-4">
                <button
                  type="submit"
                  disabled={
                    (signupMethod === 'phone' ? !phone : !email) ||
                    !password || !firstName || !lastName || !dataProcessing || !emailConsent || !privacyPolicy || !!passwordError
                  }
                  className={`w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md text-sm font-medium transition-colors ${
                    ((signupMethod === 'phone' ? !phone : !email) ||
                    !password || !firstName || !lastName || !dataProcessing || !emailConsent || !privacyPolicy || !!passwordError)
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500'
                  }`}
                >
                  Üye Ol
                </button>
                
                <p className="text-xs text-center text-gray-500">
                  Üye Ol&apos;a basarak
                  <Link 
                    href="/s/uyelik-kosullari"
                    target="_blank"
                    className="text-black underline ml-1 hover:text-orange-500 cursor-pointer p-0 bg-transparent border-0 text-xs"
                  >
                    Üyelik Koşulları
                  </Link>
                  {' '}
                  &apos;nı kabul ediyorum
                </p>
              </div>
            </form>

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
      
      {/* Render verification popup */}
      {renderVerificationPopup()}
      
      {/* ScrollToTop */}
      <div className="hidden md:block">
      <ScrollToTop />
      </div>

      {/* Üyelik Koşulları Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full mx-4 relative max-h-[80vh] overflow-y-auto border-2 border-orange-500">
            <button 
              onClick={() => setShowTermsModal(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-orange-500 transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
            <h2 className="text-3xl font-bold mb-4 text-black border-b-2 border-orange-500 pb-2">Üyelik Koşulları</h2>
            <div className="prose prose-sm max-w-none text-black">
              <h3 className="text-xl font-semibold text-orange-500 mb-2">1. Genel Hükümler</h3>
              <p className="mb-4 text-black">Bu üyelik koşulları, <span className="text-orange-500 font-semibold">Trendruum</span> platformunda sunulan hizmetlerin kullanımına ilişkin şartları ve kuralları belirler.</p>
              <h3 className="text-xl font-semibold text-orange-500 mb-2">2. Üyelik</h3>
              <ul className="list-disc pl-6 mb-4">
                <li className="mb-1 text-black">Üyelik başvurusu sırasında verilen bilgilerin doğruluğu ve güncelliği üyeye aittir.</li>
                <li className="mb-1 text-black">Her kullanıcı yalnızca bir hesap açabilir.</li>
                <li className="mb-1 text-black">Hesap güvenliği kullanıcının sorumluluğundadır.</li>
              </ul>
              <h3 className="text-xl font-semibold text-orange-500 mb-2">3. Gizlilik ve Güvenlik</h3>
              <p className="mb-4 text-black">Kişisel verileriniz <span className="text-orange-500 font-semibold">Gizlilik Politikası</span> kapsamında korunur ve işlenir.</p>
              <h3 className="text-xl font-semibold text-orange-500 mb-2">4. Hak ve Yükümlülükler</h3>
              <ul className="list-disc pl-6 mb-4">
                <li className="mb-1 text-black">Platformun kullanım koşulları zaman zaman güncellenebilir.</li>
                <li className="mb-1 text-black">Kullanıcılar güncellemeleri takip etmekle yükümlüdür.</li>
                <li className="mb-1 text-black">Kurallara aykırı davranışlarda üyelik sonlandırılabilir.</li>
              </ul>
              <h3 className="text-xl font-semibold text-orange-500 mb-2">5. İletişim</h3>
              <p className="mb-4 text-black">Her türlü soru ve talepleriniz için <span className="text-orange-500 font-semibold">İletişim</span> sayfamızı kullanabilirsiniz.</p>
            </div>
            <button
              onClick={() => setShowTermsModal(false)}
              className="mt-6 w-full bg-orange-500 text-white py-3 rounded-lg font-semibold text-lg hover:bg-orange-600 transition-colors shadow"
            >
              Kapat
            </button>
          </div>
        </div>
      )}

  
      {showOrderTrackingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 relative">
            <button 
              onClick={() => setShowOrderTrackingModal(false)}
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
            <h2 className="text-2xl font-semibold mb-4">Sipariş Takibi</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Sipariş Numarası
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Sipariş numaranızı giriniz"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  E-posta Adresi
                </label>
                <input
                  type="email"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                  placeholder="E-posta adresinizi giriniz"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                Siparişi Sorgula
              </button>
            </form>
          </div>
        </div>
      )}

      {showExplicitConsentModal && (
        <ExplicitConsentModal isOpen={showExplicitConsentModal} onClose={() => setShowExplicitConsentModal(false)} initialTab={explicitConsentActiveTab} />
      )}
    </>
  );
};

export default SignUpPage;
