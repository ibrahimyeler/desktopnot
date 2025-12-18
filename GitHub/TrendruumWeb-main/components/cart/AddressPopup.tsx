"use client"

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import OrderSummary from '@/app/sepetim/odeme/components/OrderSummary';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { API_V1_URL } from '@/lib/config';
import { useAuth } from '@/app/context/AuthContext';
import { useBasket } from '@/app/context/BasketContext';
import GuestAddressList from './GuestAddressList';
import { orderService } from '@/app/services/orderService';

interface AddressPopupProps {
  onClose: () => void;
  onSubmit?: (formData: AddressFormData) => void;
  initialAddress?: any; // Düzenleme için başlangıç adresi
  isEditMode?: boolean; // Düzenleme modunda mı?
  // Misafir (guest) checkout akışında, üstteki "Kayıtlı Adresleriniz" alanını gizlemek için
  hideGuestSavedAddresses?: boolean;
}

interface AddressFormData {
  user: {
    firstname: string;
    lastname: string;
    phone: string;
  email: string;
  };
  address: {
    title: string;
    city: string;
    district: string;
    neighborhood?: string;
    description: string;
  };
  invoice: {
    type: "individual" | "corporate";
    tax_office: string;
    tax_number: string;
    e_invoice: boolean;
  };
}

interface City {
  id: string;
  name: string;
  slug: string;
}

interface DistrictData {
  id: string;
  name: string;
  slug: string;
}

interface NeighborhoodData {
  id: string;
  name: string;
  slug: string;
}

interface SuccessPopupProps {
  onClose: () => void;
}

const SuccessPopup = ({ onClose }: SuccessPopupProps) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
    <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 text-center relative">
      <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-black mb-2">Başarıyla Kaydedildi!</h3>
      <p className="text-gray-600 mb-4">Adres bilgileriniz başarıyla kaydedildi.</p>
      <button
        onClick={onClose}
        className="w-full bg-[#F27A1A] text-white py-2 rounded-md hover:bg-[#F27A1A]/90 transition-colors"
      >
        Tamam
      </button>
    </div>
  </div>
);

export default function AddressPopup({
  onClose,
  onSubmit,
  initialAddress,
  isEditMode = false,
  hideGuestSavedAddresses = false,
}: AddressPopupProps) {
  const BASE_URL = API_V1_URL;
  const { isLoggedIn } = useAuth();
  const { guestId } = useBasket();
  const [formData, setFormData] = useState<AddressFormData>({
    user: {
      firstname: initialAddress?.first_name || initialAddress?.firstname || '',
      lastname: initialAddress?.last_name || initialAddress?.lastname || '',
      phone: initialAddress?.phone || '',
      email: initialAddress?.email || ''
    },
    address: {
      title: initialAddress?.title || '',
      city: initialAddress?.city?.slug || initialAddress?.city_slug || initialAddress?.city || '',
      district: initialAddress?.district?.slug || initialAddress?.district_slug || initialAddress?.district || '',
      neighborhood: initialAddress?.neighborhood?.slug || initialAddress?.neighborhood_slug || initialAddress?.neighborhood || '',
      description: initialAddress?.description || initialAddress?.address || ''
    },
    invoice: {
      type: initialAddress?.invoice?.type || "individual",
      tax_office: initialAddress?.invoice?.tax_office || '',
      tax_number: initialAddress?.invoice?.tax_number || '',
      e_invoice: initialAddress?.invoice?.e_invoice || false
    }
  });

  const [cities, setCities] = useState<City[]>([]);
  const [districts, setDistricts] = useState<DistrictData[]>([]);
  const [neighborhoods, setNeighborhoods] = useState<NeighborhoodData[]>([]);
  const [loading, setLoading] = useState({
    cities: false,
    districts: false,
    neighborhoods: false
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasAddress, setHasAddress] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const [paytrForm, setPaytrForm] = useState<{ post_url: string, inputs: Record<string, string> } | null>(null);
  const [showAddressList, setShowAddressList] = useState(false);
  const paytrFormRef = useRef<HTMLFormElement>(null);
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [userHasEmail, setUserHasEmail] = useState(false);

  // Fetch user information and populate email field, or populate from initialAddress if editing
  useEffect(() => {
    // Düzenleme modunda initialAddress'ten formu doldur
    if (isEditMode && initialAddress) {
      setFormData({
        user: {
          firstname: initialAddress.first_name || initialAddress.firstname || '',
          lastname: initialAddress.last_name || initialAddress.lastname || '',
          phone: initialAddress.phone || '',
          email: initialAddress.email || ''
        },
        address: {
          title: initialAddress.title || '',
          city: initialAddress.city?.slug || initialAddress.city_slug || initialAddress.city || '',
          district: initialAddress.district?.slug || initialAddress.district_slug || initialAddress.district || '',
          neighborhood: initialAddress.neighborhood?.slug || initialAddress.neighborhood_slug || initialAddress.neighborhood || '',
          description: initialAddress.description || initialAddress.address || ''
        },
        invoice: {
          type: initialAddress.invoice?.type || "individual",
          tax_office: initialAddress.invoice?.tax_office || '',
          tax_number: initialAddress.invoice?.tax_number || '',
          e_invoice: initialAddress.invoice?.e_invoice || false
        }
      });
      return;
    }

    // Yeni adres ekleme modunda kullanıcı bilgilerini çek
    const fetchUserInfo = async () => {
      if (isLoggedIn) {
        try {
          const token = localStorage.getItem('token');
          if (token) {
            const response = await fetch(`${BASE_URL}/auth/me`, {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            });
            
            if (response.ok) {
              const data = await response.json();
              if (data.meta?.status === 'success' && data.data) {
                const email = data.data.email || '';
                setUserHasEmail(!!email && email.trim() !== '');
                setFormData(prev => ({
                  ...prev,
                  user: {
                    ...prev.user,
                    email,
                    firstname: data.data.name || '',
                    lastname: data.data.lastname || ''
                  }
                }));
              }
            }
          }
        } catch (error) {
        }
      }
    };

    fetchUserInfo();
  }, [isLoggedIn, BASE_URL, isEditMode, initialAddress]);

  useEffect(() => {
    if (paytrForm && paytrFormRef.current) {
      paytrFormRef.current.submit();
    }
  }, [paytrForm]);

  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
    if (typeof window === 'undefined') {
      return;
    }

    let container = document.getElementById('address-popup-portal-root') as HTMLElement | null;
    if (!container) {
      container = document.createElement('div');
      container.id = 'address-popup-portal-root';
      container.style.position = 'relative';
      container.style.zIndex = '2147483000';
      document.body.appendChild(container);
    }
    setPortalContainer(container);

    return () => {
      // portal container intentionally left in DOM for reuse
    };
  }, []);

  const fetchDistricts = async (citySlug: string) => {
    setLoading(prev => ({ ...prev, districts: true }));
    try {
      const response = await fetch(`${BASE_URL}/locations/cities/${citySlug}`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      if (data.meta?.status === 'success' && data.data?.districts) {
        setDistricts(data.data.districts.map((district: { id: string; name: string; slug: string }) => ({
          id: district.id,
          name: district.name,
          slug: district.slug
        })));
      } else {
        setDistricts([]);
      }
    } catch (error) {
      setDistricts([]);
    } finally {
      setLoading(prev => ({ ...prev, districts: false }));
    }
  };

  const fetchNeighborhoods = async (districtSlug: string) => {
    setLoading(prev => ({ ...prev, neighborhoods: true }));
    try {
      const response = await fetch(`${BASE_URL}/locations/districts/${districtSlug}`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      if (data.meta?.status === 'success' && data.data?.neighborhoods) {
        setNeighborhoods(data.data.neighborhoods.map((neighborhood: { id: string; name: string; slug: string }) => ({
          id: neighborhood.id,
          name: neighborhood.name,
          slug: neighborhood.slug
        })));
      } else {
        setNeighborhoods([]);
      }
    } catch (error) {
      setNeighborhoods([]);
    } finally {
      setLoading(prev => ({ ...prev, neighborhoods: false }));
    }
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (name.startsWith('user.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        user: {
          ...prev.user,
          [field]: value
        }
      }));
    } else if (name.startsWith('address.')) {
      const field = name.split('.')[1];
      
      // İl değiştiğinde
      if (field === 'city') {
        setFormData(prev => ({
          ...prev,
          address: {
            ...prev.address,
            city: value,
            district: '',
            neighborhood: ''
          }
        }));
        if (value) {
          await fetchDistricts(value);
        } else {
          setDistricts([]);
        }
      }
      // İlçe değiştiğinde
      else if (field === 'district') {
        setFormData(prev => ({
          ...prev,
          address: {
            ...prev.address,
            district: value
          }
        }));
      }
      // Diğer adres alanları için
      else {
        setFormData(prev => ({
          ...prev,
          address: {
            ...prev.address,
            [field]: value
          }
        }));
      }
    } else if (name.startsWith('invoice.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        invoice: {
          ...prev.invoice,
          [field]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }
      }));
    }
  };

  useEffect(() => {
    const fetchCities = async () => {
      setLoading(prev => ({ ...prev, cities: true }));
      try {
        // İlk endpoint'i dene
        let response = await fetch(`${BASE_URL}/locations/countries/turkiye`, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
        
        // Eğer ilk endpoint başarısız olursa alternatif endpoint'i dene
        if (!response.ok) {
          response = await fetch(`${BASE_URL}/countries/tr`, {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          });
        }
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        if (data.meta?.status === 'success' && data.data?.cities) {
          setCities(data.data.cities.map((city: { id: string; name: string; slug: string }) => ({
            id: city.id,
            name: city.name,
            slug: city.slug
          })));
        } else if (data.meta?.status === 'success' && Array.isArray(data.data)) {
          // Alternatif endpoint formatı için
          setCities(data.data.map((city: { id: string; name: string; slug: string }) => ({
            id: city.id,
            name: city.name,
            slug: city.slug
          })));
        }
      } catch (error) {
        // Hata durumunda boş array bırak, kullanıcı sayfayı kullanmaya devam edebilir
        setCities([]);
      } finally {
        setLoading(prev => ({ ...prev, cities: false }));
      }
    };

    fetchCities();
  }, [BASE_URL]);

  useEffect(() => {
    const checkAddress = async () => {
      try {
        const response = await fetch(`${API_V1_URL}/customer/addresses`, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          setHasAddress(false);
          return;
        }
        
        const data = await response.json();
        setHasAddress(data.data && data.data.length > 0);
      } catch (error) {
        setHasAddress(false);
      }
    };

    checkAddress();
  }, []);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    
    if (!value) {
      setFormData(prev => ({
        ...prev,
        user: { ...prev.user, phone: '' }
      }));
      return;
    }
    
    value = value.slice(0, 11);
    
    let formatted = '';
    if (value.length > 0) formatted += value[0];
    if (value.length > 1) formatted += ' (';
    if (value.length > 1) formatted += value.substring(1, 4);
    if (value.length > 4) formatted += ') ';
    if (value.length > 4) formatted += value.substring(4, 7);
    if (value.length > 7) formatted += ' ';
    if (value.length > 7) formatted += value.substring(7, 9);
    if (value.length > 9) formatted += ' ';
    if (value.length > 9) formatted += value.substring(9, 11);
    
    setFormData(prev => ({
      ...prev,
      user: { ...prev.user, phone: formatted }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // Slug değerlerini al
      const selectedCitySlug = formData.address.city;
      const selectedDistrictSlug = formData.address.district;
      
      const formattedPhone = formData.user.phone.replace(/\D/g, '');
      
      if (formattedPhone.length !== 11) {
        setError('Telefon numarası 11 haneli olmalıdır');
        setIsSubmitting(false);
        return;
      }

      // Guest için request data (email olmadan)
      const requestData = {
        user: {
          firstname: formData.user.firstname,
          lastname: formData.user.lastname,
          phone: formattedPhone
          // Guest için email gerekmiyor
        },
        address: {
          title: formData.address.title,
          city: selectedCitySlug,
          district: selectedDistrictSlug,
          neighborhood: '', // API'de neighborhood alanı var ama form'da yok
          description: formData.address.description
        },
        invoice: {
          type: formData.invoice.type,
          tax_office: formData.invoice.tax_office,
          tax_number: formData.invoice.tax_number,
          e_invoice: formData.invoice.e_invoice
        }
      };

      const headers: Record<string, string> = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      };

      let response;
      let data;

      if (isLoggedIn) {
        // Customer için API çağrısı - email dahil
        const customerRequestData = {
          ...requestData,
          user: {
            ...requestData.user,
            email: formData.user.email
          }
        };

        const token = localStorage.getItem('token');
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        // Düzenleme modunda PUT, yoksa POST
        const method = isEditMode && initialAddress?.id ? 'PUT' : 'POST';
        const url = isEditMode && initialAddress?.id 
          ? `${BASE_URL}/customer/profile/addresses/${initialAddress.id}`
          : `${BASE_URL}/customer/profile/addresses`;

        response = await fetch(url, {
          method,
          headers,
          body: JSON.stringify(customerRequestData)
        });
      } else {
        // Guest için API çağrısı - email dahil
        const guestRequestData = {
          ...requestData,
          user: {
            ...requestData.user,
            email: formData.user.email
          }
        };
        
        headers['Guest-ID'] = guestId;

        response = await fetch(`${BASE_URL}/addresses`, {
          method: 'POST',
          headers,
          body: JSON.stringify(guestRequestData)
        });
      }

      data = await response.json();
      
      if (response.ok && data.meta?.status === 'success') {
        setShowSuccess(true);
        setSelectedAddress(data.data);
        setHasAddress(true);
        
        // Guest kullanıcılar için localStorage'a kaydet
        if (!isLoggedIn) {
          const guestData = {
            firstname: formData.user.firstname,
            lastname: formData.user.lastname,
            email: formData.user.email,
            phone: formData.user.phone,
            address: {
              address_title: formData.address.title,
              city: formData.address.city,
              district: formData.address.district,
              neighborhood: formData.address.neighborhood || '',
              address_detail: formData.address.description
            }
          };
          localStorage.setItem('guestCustomer', JSON.stringify(guestData));
        }
        
        // Diğer sayfaları bildir (hesabim/adres-bilgilerim sayfası için)
        if (isLoggedIn) {
          if (isEditMode) {
            window.dispatchEvent(new CustomEvent('address-updated'));
          } else {
            window.dispatchEvent(new CustomEvent('address-added'));
          }
        }
        
        if (onSubmit) {
          onSubmit(data.data);
        }
      } else {
        let errorMessage = data.meta?.message || 'Bir hata oluştu';
        
        if (data.errors) {
          if (typeof data.errors === 'string') {
            errorMessage = data.errors;
          } else if (typeof data.errors === 'object') {
            const errorMessages = Object.values(data.errors)
              .flat()
              .join('\n');
            errorMessage = errorMessages || errorMessage;
          }
        }

        // Token hatası kontrolü (sadece customer için)
        if (isLoggedIn && (response.status === 401 || response.status === 403)) {
          errorMessage = 'Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.';
          localStorage.removeItem('token');
        }
        
        setError(errorMessage);
      
      }
    } catch (error) {
      if (error instanceof Error) {
  
      }
      setError('Sunucu bağlantısında bir hata oluştu. Lütfen daha sonra tekrar deneyiniz.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateForm = (): boolean => {
    const errors: string[] = [];

    if (!formData.user.firstname) errors.push('Ad alanı zorunludur');
    if (!formData.user.lastname) errors.push('Soyad alanı zorunludur');
    if (!formData.user.phone) errors.push('Telefon alanı zorunludur');
    
    // E-posta artık herkes için opsiyonel; sadece girilmişse formatını kontrol et
    if (formData.user.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.user.email)) {
      errors.push('Geçerli bir e-posta adresi giriniz');
    }
    
    if (!formData.address.city) errors.push('İl seçimi zorunludur');
    if (!formData.address.district) errors.push('İlçe seçimi zorunludur');
    if (!formData.address.description) errors.push('Adres alanı zorunludur');
    if (!formData.address.title) errors.push('Adres başlığı zorunludur');

    if (formData.address.city && !cities.some(city => city.slug === formData.address.city)) {
      errors.push('Geçersiz il seçimi');
    }
    if (formData.address.district && !districts.some(district => district.slug === formData.address.district)) {
      errors.push('Geçersiz ilçe seçimi');
    }

    if (errors.length > 0) {
      setError(errors.join('\n'));
      return false;
    }

    return true;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    await handleSubmit(e);
  };

  const handleContinue = async () => {
    if (!termsAccepted) {
      toast.error("Lütfen sözleşmeleri kabul edin");
      return;
    }
    setIsLoading(true);
    try {
      // Debug: Token ve login durumunu kontrol et
      const token = localStorage.getItem('token');
   
      
      // Kullanıcının seçili adresinin id'sini alın
      const selectedAddressId = selectedAddress?.id;
      if (!selectedAddressId) {
        toast.error("Adres seçilmedi");
        setIsLoading(false);
        return;
      }

      let result;
      
      // Customer kontrolü - token var mı kontrol et
      const isCustomer = isLoggedIn && token;
      
      if (isCustomer) {
        // Customer için sipariş oluştur
        const payment = { oid: "random" }; // Gerçek ödeme objesini buraya koy
        result = await orderService.createOrder(selectedAddressId, "", 0, []);
      } else {
        // Guest için sipariş oluştur
        const payment = {
          instalment: "2",
          card_type: "bonus"
        };
        result = await orderService.createGuestOrder(selectedAddressId, guestId, payment);
      }

      if (result.meta?.status === "success") {
        setShowSuccess(true);
        setTimeout(() => {
          router.push('/');
        }, 2000);
      } else {
        toast.error(result.meta?.message || "Sipariş oluşturulamadı");
      }
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('Oturum süreniz dolmuş')) {
          toast.error('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
          localStorage.removeItem('token');
          router.push('/giris');
          return;
        }
        toast.error(error.message);
      } else {
        toast.error("Sipariş sırasında hata oluştu");
      }
    } finally {
      setIsLoading(false);
    }
  };



  useEffect(() => {
    // Scrollbar genişliğini hesapla
    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    if (scrollBarWidth > 0) {
      document.body.style.paddingRight = scrollBarWidth + 'px';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, []);

  if (!isMounted || !portalContainer) {
    return null;
  }

  const content = (
    <>
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] backdrop-blur-sm p-4 sm:p-6">
        {/* PAYTR Otomatik Form */}
        {paytrForm && (
          <form
            ref={paytrFormRef}
            action={paytrForm.post_url}
            method="POST"
            style={{ display: "none" }}
          >
            {Object.entries(paytrForm.inputs).map(([key, value]) => (
              <input key={key} type="hidden" name={key} value={value} />
            ))}
          </form>
        )}
        {/* Adres Ekle Popup */}
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-100 p-4 sm:p-6 md:p-7 max-w-xl w-full max-h-[85vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-gray-900">
              Adres Ekle
            </h2>
            <button
              onClick={onClose}
              className="inline-flex items-center justify-center rounded-full p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <XMarkIcon className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          {/* Guest kullanıcılar için adres listesi */}
          {!isLoggedIn && !hideGuestSavedAddresses && (
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-black">Kayıtlı Adresleriniz</h3>
                <button
                  onClick={() => setShowAddressList(!showAddressList)}
                  className="text-[#F27A1A] hover:text-[#F27A1A]/80 text-sm font-medium"
                >
                  {showAddressList ? 'Gizle' : 'Göster'}
                </button>
              </div>
              
              {showAddressList && (
                <GuestAddressList
                  onAddressSelect={(address) => {
                    setSelectedAddress(address);
                    toast.success('Adres seçildi');
                  }}
                  selectedAddressId={selectedAddress?.id}
                />
              )}
              
            </div>
          )}

          <div className="mb-4 p-4 bg-orange-50 rounded-lg">
            <p className="text-sm text-black">
              Kişisel verileriniz, siparişinizin teslimatının sağlanması ve yasal yükümlülüklerimizin
              yerine getirilmesi için gerekli olup, tarafınıza ait bir üyelik
              hesabı oluşturulmayacaktır.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 rounded-lg">
              <p className="text-red-600 whitespace-pre-line text-sm">
                {error}
              </p>
            </div>
          )}

          {/* Form sadece customer için veya guest için adres listesi gizliyse göster */}
          {(!showAddressList || isLoggedIn) && (
            <form onSubmit={handleFormSubmit} className="space-y-4 pb-4">
              {/* Email alanı hem customer hem guest için göster - tamamen opsiyonel */}
              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  E-posta
                </label>
                <input
                  type="email"
                  name="user.email"
                  className="w-full p-2 border rounded-md text-black"
                  placeholder="E-posta adresinizi giriniz"
                  value={formData.user.email}
                  onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-1">
                    Ad*
                  </label>
                  <input
                    type="text"
                    name="user.firstname"
                    required
                    className="w-full p-2 border rounded-md text-black"
                    placeholder="Adınızı Giriniz"
                    value={formData.user.firstname}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-1">
                    Soyad*
                  </label>
                  <input
                    type="text"
                    name="user.lastname"
                    required
                    className="w-full p-2 border rounded-md text-black"
                    placeholder="Soyadınızı Giriniz"
                    value={formData.user.lastname}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Telefon*
                </label>
                <input
                  type="tel"
                  name="user.phone"
                  required
                  className="w-full p-2 border rounded-md text-black"
                  placeholder="0 (5XX) XXX XX XX"
                  value={formData.user.phone}
                  onChange={handlePhoneChange}
                  maxLength={17}
                  pattern="[0-9\s\(\)]{17}"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Adres Başlığı*
                </label>
                <input
                  type="text"
                  name="address.title"
                  required
                  className="w-full p-2 border rounded-md text-black"
                  placeholder="Adres Başlığı Giriniz"
                  value={formData.address.title}
                  onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-1">
                    İl*
                  </label>
                  <select
                    name="address.city"
                    required
                    className="w-full p-2 border rounded-md text-black"
                    value={formData.address.city}
                    onChange={handleChange}
                    disabled={loading.cities}
                  >
                    <option value="">Seçiniz</option>
                    {cities.map(city => (
                      <option key={city.id} value={city.slug}>
                          {city.name}
                        </option>
                    ))}
                  </select>
                  {loading.cities && <span className="text-sm text-gray-500">Yükleniyor...</span>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-1">
                    İlçe*
                  </label>
                  <select
                    name="address.district"
                    required
                    className="w-full p-2 border rounded-md text-black"
                    value={formData.address.district}
                    onChange={handleChange}
                    disabled={!formData.address.city || loading.districts}
                  >
                    <option value="">Seçiniz</option>
                    {districts.map(district => (
                      <option key={district.id} value={district.slug}>
                        {district.name}
                      </option>
                    ))}
                  </select>
                  {loading.districts && <span className="text-sm text-gray-500">Yükleniyor...</span>}
                </div>
              </div>



              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Adres*
                </label>
                <textarea
                  name="address.description"
                  required
                  className="w-full p-2 border rounded-md text-black"
                  placeholder="Cadde, mahalle sokak ve diğer bilgileri giriniz."
                  rows={3}
                  value={formData.address.description}
                  onChange={handleChange}
                />
              </div>

              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold mb-4">Fatura Bilgileri</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">
                      Fatura Tipi
                    </label>
                    <select
                      name="invoice.type"
                      className="w-full p-2 border rounded-md text-black"
                      value={formData.invoice.type}
                      onChange={handleChange}
                    >
                      <option value="individual">Bireysel</option>
                      <option value="corporate">Kurumsal</option>
                    </select>
                  </div>

                  {formData.invoice.type === 'corporate' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-black mb-1">
                          Vergi Dairesi
                        </label>
                        <input
                          type="text"
                          name="invoice.tax_office"
                          className="w-full p-2 border rounded-md text-black"
                          placeholder="Vergi Dairesi"
                          value={formData.invoice.tax_office}
                          onChange={handleChange}
                        />
                      </div>
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                        Vergi Numarası
              </label>
              <input
                type="text"
                        name="invoice.tax_number"
                className="w-full p-2 border rounded-md text-black"
                        placeholder="Vergi Numarası"
                        value={formData.invoice.tax_number}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="invoice.e_invoice"
                        id="e_invoice"
                        className="mr-2"
                        checked={formData.invoice.e_invoice}
                onChange={handleChange}
              />
                      <label htmlFor="e_invoice" className="text-sm text-black">
                        E-Fatura
                      </label>
                    </div>
                  </>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-[#F27A1A] text-white py-3 rounded-md hover:bg-[#F27A1A]/90 transition-colors ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
          </form>
        )}
      </div>
      </div>
    </>
  );

  return createPortal(content, portalContainer);
}
