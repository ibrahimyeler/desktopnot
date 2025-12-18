"use client";

import { useState, useEffect } from 'react';
import { MapPinIcon, PlusIcon, XMarkIcon, PencilIcon, TrashIcon, ArrowLeftIcon, Bars3Icon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { addressService } from '@/app/services/addressService';
import axios from 'axios';
import { API_V1_URL } from '@/lib/config';

// addressService'den gelen Address tipini kullan
interface Address {
  id: string;
  title: string;
  first_name: string;
  last_name: string;
  phone: string;
  email?: string;
  country_id: number;
  city_id: number;
  district_id: number;
  neighborhood_id?: number;
  address: string;
  postal_code?: string;
  is_default?: boolean;
  created_at: string;
  updated_at: string;
  city_slug?: string;
  district_slug?: string;
  neighborhood_slug?: string;
}

interface City {
  id: string;
  name: string;
  slug: string;
}

interface District {
  id: string;
  name: string;
  slug: string;
}

interface Neighborhood {
  id: string;
  name: string;
  slug: string;
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

const initialForm = {
  name: '',
  surname: '',
  email: '',
  phone: '',
  city: '',
  cityId: '',
  district: '',
  districtId: '',
  address: '',
  addressTitle: '',
  invoiceType: 'Bireysel',
  vkn: '',
  taxOffice: '',
  companyName: '',
  isEFatura: false,
};

interface AddressesProps {
  addresses: Address[];
  onSaveAddress: (address: Address) => void;
  onDeleteAddress: (addressId: string) => void;
  onUpdateAddress: (addressId: string, address: Address) => void;
  staticData: {
    cities: City[];
    districts: { [key: string]: District[] };
    neighborhoods: { [key: string]: Neighborhood[] };
  };
  onMenuClick?: () => void;
}

const Addresses = ({ addresses = [], onSaveAddress, onDeleteAddress, onUpdateAddress, staticData, onMenuClick }: AddressesProps) => {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [deleteIdx, setDeleteIdx] = useState<number|null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editIdx, setEditIdx] = useState<number|null>(null);
  const [loading, setLoading] = useState(false);
  const [cities, setCities] = useState<City[]>(staticData?.cities || []);
  const [districts, setDistricts] = useState<District[]>([]);
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
  const [saving, setSaving] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    password: '',
    new_password: '',
    new_password_confirmation: '',
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    if (staticData?.cities) {
      setCities(staticData.cities);
    }
  }, [staticData]);

  // iOS Safari için keyboard yönetimi ve viewport düzeltmeleri
  useEffect(() => {
    if (showModal) {
      // iOS'ta viewport height sorununu çöz
      const setViewportHeight = () => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
      };
      
      setViewportHeight();
      window.addEventListener('resize', setViewportHeight);
      window.addEventListener('orientationchange', setViewportHeight);

      // Keyboard açıldığında input'ları görünür tut
      const handleFocusIn = (e: FocusEvent) => {
        const target = e.target as HTMLElement;
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
          setTimeout(() => {
            const modalContent = target.closest('[class*="overflow-y-auto"]');
            if (modalContent) {
              const rect = target.getBoundingClientRect();
              const modalRect = (modalContent as HTMLElement).getBoundingClientRect();
              const scrollTop = (modalContent as HTMLElement).scrollTop;
              const targetTop = rect.top - modalRect.top + scrollTop;
              
              (modalContent as HTMLElement).scrollTo({
                top: targetTop - 100,
                behavior: 'smooth'
              });
            } else {
              target.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }, 300);
        }
      };

      // Input focus olayını dinle
      document.addEventListener('focusin', handleFocusIn);

      return () => {
        window.removeEventListener('resize', setViewportHeight);
        window.removeEventListener('orientationchange', setViewportHeight);
        document.removeEventListener('focusin', handleFocusIn);
      };
    }
  }, [showModal]);

  // Kullanıcı profil bilgilerini çek (email kontrolü için)
  useEffect(() => {
    const fetchUserEmail = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await axios.get(`${API_V1_URL}/customer/profile/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });

        if (response.data?.meta?.status === 'success') {
          const email = response.data.data?.email || '';
          setUserEmail(email);
        }
      } catch (error) {
      }
    };

    fetchUserEmail();
  }, []);

  const fetchDistricts = async (citySlug: string) => {
    try {
      const districts = await addressService.getDistricts(citySlug);
      setDistricts(districts);
    } catch (error) {
      setDistricts([]);
    }
  };

  const fetchNeighborhoods = async (districtSlug: string) => {
    try {
      const neighborhoods = await addressService.getNeighborhoods(districtSlug);
      setNeighborhoods(neighborhoods);
    } catch (error) {
      setNeighborhoods([]);
    }
  };

  useEffect(() => {
    if (form.cityId) {
      fetchDistricts(form.cityId);
      setForm(f => ({ ...f, district: '', districtId: '', neighborhood: '', neighborhoodId: '' }));
      setNeighborhoods([]);
    }
  }, [form.cityId]);

  useEffect(() => {
    if (form.districtId) {
      fetchNeighborhoods(form.districtId);
    }
  }, [form.districtId]);

  const handleOpen = async () => {
    // Yeni adres ekleme: mevcut profilden e-posta/telefonu al, ama e-posta zorunlu değil
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await axios.get(`${API_V1_URL}/customer/profile/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });

        if (response.data?.meta?.status === 'success') {
          const email = response.data.data?.email || '';
          setUserEmail(email);
          setForm({ ...initialForm, email: email || '' });
          setEditIdx(null);
          setShowModal(true);
          return;
        }
      }
    } catch (error) {
      // ignore, aşağıda fallback ile modal açılacak
    }
    
    // Hata durumunda veya token yoksa da modalı aç (misafir veya sadece telefonla kayıtlı kullanıcı olabilir)
    setForm({ ...initialForm, email: userEmail || '' });
    setEditIdx(null);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setForm(initialForm);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setForm((prev) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleInvoiceType = (type: string) => {
    setForm((prev) => ({ ...prev, invoiceType: type }));
  };

  const handleDelete = (idx: number) => {
    setDeleteIdx(idx);
    setShowDeleteConfirm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    // Seçilen şehir ve ilçe bilgilerini al
    const selectedCity = cities.find((c: any) => c.slug === form.cityId);
    const selectedDistrict = districts.find((d: any) => d.slug === form.districtId);
    
    const payload: any = {
      title: form.addressTitle,
      first_name: form.name,
      last_name: form.surname,
      email: form.email || userEmail || '',
      phone: form.phone,
      country_id: 1,
      city_id: selectedCity?.id ? parseInt(selectedCity.id) : 0,
      district_id: selectedDistrict?.id ? parseInt(selectedDistrict.id) : 0,
      neighborhood_id: 0,
      address: form.address,
      is_default: false
    };

    try {
      const token = localStorage.getItem('token');
      let response;
      
      if (editIdx !== null) {
        // Güncelleme
        response = await axios.put(
          `${API_V1_URL}/customer/profile/addresses/${addresses[editIdx].id}`,
          payload,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        if (response.data?.meta?.status === 'success') {
          onUpdateAddress(addresses[editIdx].id, { ...payload, id: addresses[editIdx].id });
          toast.success('Adres güncellendi');
          handleClose();
          
          // Diğer sayfaları bildir (sepetim/odeme sayfası için)
          window.dispatchEvent(new CustomEvent('address-updated'));
        } else {
          throw new Error(response.data?.meta?.message || 'Güncelleme başarısız');
        }
      } else {
        // Yeni adres ekleme
        response = await axios.post(
          `${API_V1_URL}/customer/profile/addresses`,
          payload,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        if (response.data?.meta?.status === 'success') {
          const newAddress = { ...payload, id: response.data.data?.id || Date.now().toString() };
          onSaveAddress(newAddress);
          toast.success('Adres eklendi');
          handleClose();
          
          // Diğer sayfaları bildir (sepetim/odeme sayfası için)
          window.dispatchEvent(new CustomEvent('address-added'));
        } else {
          throw new Error(response.data?.meta?.message || 'Ekleme başarısız');
        }
      }
    } catch (error: any) {
      // API'den gelen hata mesajını kontrol et
      const errorMessage = error?.response?.data?.meta?.message || 
                          error?.response?.data?.message || 
                          error?.message || 
                          '';
      
      // Email zaten varsa
      if (errorMessage.toLowerCase().includes('email') && 
          (errorMessage.toLowerCase().includes('already') || 
           errorMessage.toLowerCase().includes('exists') || 
           errorMessage.toLowerCase().includes('zaten') ||
           errorMessage.toLowerCase().includes('duplicate'))) {
        toast.error('Bu e-posta adresi zaten kullanılıyor');
      } 
      // Telefon zaten varsa
      else if (errorMessage.toLowerCase().includes('phone') && 
               (errorMessage.toLowerCase().includes('already') || 
                errorMessage.toLowerCase().includes('exists') || 
                errorMessage.toLowerCase().includes('zaten') ||
                errorMessage.toLowerCase().includes('duplicate'))) {
        toast.error('Bu telefon numarası zaten kullanılıyor');
      } 
      // Genel hata
      else {
        toast.error(errorMessage || 'İşlem başarısız oldu');
      }
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = () => {
    if (deleteIdx !== null) {
      onDeleteAddress(addresses[deleteIdx].id);
      toast.success('Adres silindi');
      
      // Diğer sayfaları bildir (sepetim/odeme sayfası için)
      window.dispatchEvent(new CustomEvent('address-deleted'));
    }
    setShowDeleteConfirm(false);
    setDeleteIdx(null);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setDeleteIdx(null);
  };

  const handleEdit = (idx: number) => {
    const addr = addresses[idx];
    
    // city_slug varsa onu kullan, yoksa city_id'den çevir
    let citySlug = addr.city_slug || '';
    if (!citySlug && addr.city_id && cities.length > 0) {
      const city = cities.find((c: any) => c.id === addr.city_id.toString());
      citySlug = city?.slug || '';
    }
    
    setForm({
      ...initialForm,
      name: addr.first_name,
      surname: addr.last_name,
      email: addr.email || userEmail || '',
      phone: addr.phone,
      cityId: citySlug,
      districtId: addr.district_slug || '',
      address: addr.address,
      addressTitle: addr.title,
    });
    setEditIdx(idx);
    setShowModal(true);
    
    // Eğer city slug varsa, ilçeleri yükle
    if (citySlug) {
      fetchDistricts(citySlug);
    }
  };

  const handleOpenPasswordModal = () => {
    setPasswordForm({ password: '', new_password: '', new_password_confirmation: '' });
    setPasswordError('');
    setPasswordSuccess('');
    setShowPasswordModal(true);
  };

  const handleClosePasswordModal = () => {
    setShowPasswordModal(false);
    setPasswordForm({ password: '', new_password: '', new_password_confirmation: '' });
    setPasswordError('');
    setPasswordSuccess('');
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
    setPasswordError('');
    setPasswordSuccess('');
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordLoading(true);
    try {
      const res = await axios.post('/api/v1/customer/profile/password-reset', {
        password: passwordForm.password,
        new_password: passwordForm.new_password,
        new_password_confirmation: passwordForm.new_password_confirmation,
      });
      if (res.data?.meta?.status === 'success') {
        setPasswordSuccess('Şifre başarıyla güncellendi.');
        toast.success('Şifre başarıyla güncellendi');
        setTimeout(() => {
          handleClosePasswordModal();
        }, 1200);
      } else {
        setPasswordError(res.data?.meta?.message || 'Şifre güncellenemedi.');
      }
    } catch (err: unknown) {
      const error = err as ApiError;
      setPasswordError(error.response?.data?.message || 'Şifre güncellenemedi');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="flex-1">
      <div className="mb-4 sm:mb-8 -mt-2 sm:mt-0">
        {/* Desktop Header */}
        <div className="hidden sm:flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.history.back()}
              aria-label="Geri"
              className="p-1.5 rounded-md hover:bg-gray-100 transition-colors text-gray-600 hover:text-gray-900"
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </button>
            <MapPinIcon className="w-6 h-6 text-orange-500" />
            <h1 className="text-xl font-semibold text-gray-900">Adres Bilgilerim</h1>
          </div>
          <div className="flex gap-2">
            <button onClick={handleOpen} className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-orange-600 transition-colors">
              <PlusIcon className="w-5 h-5" />
              Yeni Adres Ekle
            </button>
          </div>
        </div>

        {/* Mobile Header */}
        <div className="sm:hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => window.history.back()}
                aria-label="Geri"
                className="p-1.5 rounded-md hover:bg-gray-100 transition-colors text-gray-600"
              >
                <ArrowLeftIcon className="w-5 h-5" />
              </button>
              <MapPinIcon className="w-5 h-5 text-orange-500" />
              <h1 className="text-base font-semibold text-gray-900">Adres Bilgilerim</h1>
            </div>
            {onMenuClick && (
              <button
                onClick={onMenuClick}
                className="p-2 rounded-lg hover:bg-gray-100"
                aria-label="Menü"
              >
                <Bars3Icon className="w-6 h-6 text-gray-600" />
              </button>
            )}
          </div>
          <button onClick={handleOpen} className="w-full flex items-center justify-center gap-2 bg-orange-500 text-white px-4 py-3 rounded-lg font-medium text-sm hover:bg-orange-600 transition-colors">
            <PlusIcon className="w-5 h-5" />
            Yeni Adres Ekle
          </button>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl p-6 sm:p-10 flex flex-col items-center justify-center border border-gray-100 max-w-lg mx-auto animate-pulse">
          <div className="bg-orange-50 rounded-full w-16 h-16 sm:w-24 sm:h-24 flex items-center justify-center mb-4 sm:mb-6">
            <MapPinIcon className="w-8 h-8 sm:w-12 sm:h-12 text-orange-400" />
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 tracking-tight">Adresler yükleniyor...</h3>
        </div>
      ) : addresses.length === 0 ? (
        <div className="bg-white rounded-2xl p-6 sm:p-10 flex flex-col items-center justify-center border border-gray-100 max-w-lg mx-auto">
          <div className="bg-orange-50 rounded-full w-16 h-16 sm:w-24 sm:h-24 flex items-center justify-center mb-4 sm:mb-6">
            <MapPinIcon className="w-8 h-8 sm:w-12 sm:h-12 text-orange-400" />
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 tracking-tight">Henüz adres eklenmemiş</h3>
          <p className="text-sm sm:text-base text-gray-500 mb-4 text-center max-w-xs leading-relaxed">
            Adres ekleyerek siparişlerinizi daha hızlı ve kolay tamamlayabilirsiniz.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {addresses.map((address, idx) => (
            <div key={address.id} className="bg-white border border-orange-100 rounded-xl p-4 sm:p-5 flex flex-col gap-2 relative group transition-all duration-200 hover:border-orange-200">
              <div className="flex items-start justify-between mb-2 gap-3">
                <div className="font-semibold text-orange-500 text-sm sm:text-base flex-1 min-w-0">{address.title}</div>
                <div className="flex gap-1 sm:gap-2 opacity-100 sm:opacity-80 sm:group-hover:opacity-100 transition-opacity flex-shrink-0">
                  <button
                    className="p-1.5 sm:p-1 rounded hover:bg-orange-50 text-gray-500 hover:text-orange-500 transition-colors"
                    title="Düzenle"
                    onClick={() => handleEdit(idx)}
                  >
                    <PencilIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                  <button
                    className="p-1.5 sm:p-1 rounded hover:bg-red-50 text-gray-500 hover:text-red-500 transition-colors"
                    title="Sil"
                    onClick={() => handleDelete(idx)}
                  >
                    <TrashIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>
              <div className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                <div className="font-medium">{address.first_name} {address.last_name}</div>
                <div className="mt-1">{address.phone}</div>
                <div className="mt-1">{address.address}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div 
          className="fixed inset-0 z-[1400] flex items-start sm:items-center justify-center bg-black bg-opacity-40 p-0 sm:p-4"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100%',
            height: '100dvh',
            transform: 'translateZ(0)',
            WebkitTransform: 'translateZ(0)',
            isolation: 'isolate',
            WebkitBackfaceVisibility: 'hidden',
            backfaceVisibility: 'hidden',
            touchAction: 'pan-y',
            overscrollBehavior: 'contain',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          <div 
            className="bg-white rounded-none sm:rounded-xl w-full h-full sm:h-auto sm:max-w-2xl sm:mx-4 p-4 sm:p-6 pt-12 sm:pt-8 pb-20 sm:pb-6 relative animate-fade-in overflow-y-auto z-[1401]"
            style={{
              maxHeight: '100vh',
              height: '100%',
              WebkitOverflowScrolling: 'touch',
              overscrollBehavior: 'contain',
              transform: 'translateZ(0)',
              WebkitTransform: 'translateZ(0)',
              willChange: 'scroll-position',
              WebkitTapHighlightColor: 'transparent',
              // iOS için tam görünüm
              display: 'block',
              position: 'relative'
            }}
          >
            <button 
              onClick={handleClose} 
              className="absolute right-3 top-3 sm:right-2 sm:top-2 text-gray-400 hover:text-gray-700 z-[1402] p-1"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">{editIdx !== null ? 'Adresi Düzenle' : 'Adres Ekle'}</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm">
              <div>
                <label className="block font-medium text-gray-700 mb-1 text-xs sm:text-sm">Ad*</label>
                <input 
                  name="name" 
                  value={form.name} 
                  onChange={handleChange} 
                  required 
                  placeholder="Adınızı Giriniz" 
                  className="w-full px-3 py-2.5 sm:py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500 text-gray-900 text-sm sm:text-xs placeholder:text-sm sm:placeholder:text-xs"
                  style={{
                    WebkitAppearance: 'none',
                    appearance: 'none'
                  }}
                />
              </div>
              <div>
                <label className="block font-medium text-gray-700 mb-1 text-xs sm:text-sm">Soyad*</label>
                <input 
                  name="surname" 
                  value={form.surname} 
                  onChange={handleChange} 
                  required 
                  placeholder="Soyadınızı Giriniz" 
                  className="w-full px-3 py-2.5 sm:py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500 text-gray-900 text-sm sm:text-xs placeholder:text-sm sm:placeholder:text-xs"
                  style={{
                    WebkitAppearance: 'none',
                    appearance: 'none'
                  }}
                />
              </div>
              <div>
                <label className="block font-medium text-gray-700 mb-1 text-xs sm:text-sm">
                  E-posta
                </label>
                <input
                  name="email"
                  type="email"
                  value={form.email || userEmail || ''}
                  onChange={handleChange}
                  // Artık tüm kullanıcılar için opsiyonel; isterlerse doldurabilirler
                  placeholder="E-posta Adresiniz"
                  autoComplete="email"
                  className="w-full px-3 py-2.5 sm:py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500 text-gray-900 text-sm sm:text-xs placeholder:text-sm sm:placeholder:text-xs"
                  style={{
                    WebkitAppearance: 'none',
                    appearance: 'none'
                  }}
                />
              </div>
              <div>
                <label className="block font-medium text-gray-700 mb-1 text-xs sm:text-sm">Telefon*</label>
                <input
                  name="phone"
                  type="tel"
                  value={form.phone}
                  maxLength={11}
                  onChange={e => {
                    const value = e.target.value.replace(/\D/g, '');
                    setForm(prev => ({ ...prev, phone: value }));
                  }}
                  required
                  placeholder="Telefon Numaranız"
                  autoComplete="tel"
                  className="w-full px-3 py-2.5 sm:py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500 text-gray-900 text-sm sm:text-xs placeholder:text-sm sm:placeholder:text-xs"
                  style={{
                    WebkitAppearance: 'none',
                    appearance: 'none'
                  }}
                />
              </div>
              <div>
                <label className="block font-medium text-gray-700 mb-1 text-xs sm:text-sm">İl*</label>
                <select name="cityId" value={form.cityId} onChange={handleChange} required className="w-full px-3 py-2.5 sm:py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500 text-gray-900 text-sm sm:text-xs">
                  <option value="">Seçiniz</option>
                  {cities.map((c: City) => (
                    <option key={c.id} value={c.slug}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-medium text-gray-700 mb-1 text-xs sm:text-sm">İlçe*</label>
                <select 
                  name="districtId" 
                  value={form.districtId} 
                  onChange={handleChange} 
                  required 
                  className="w-full px-3 py-2.5 sm:py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500 text-gray-900 text-sm sm:text-xs"
                  style={{
                    WebkitAppearance: 'none',
                    appearance: 'none',
                    backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 12 12\'%3E%3Cpath fill=\'%23333\' d=\'M6 9L1 4h10z\'/%3E%3C/svg%3E")',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 12px center',
                    paddingRight: '36px'
                  }}
                >
                  <option value="">Seçiniz</option>
                  {districts.map((d: District) => (
                    <option key={d.id} value={d.slug}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block font-medium text-gray-700 mb-1 text-xs sm:text-sm">Adres*</label>
                <textarea 
                  name="address" 
                  value={form.address} 
                  onChange={handleChange} 
                  required 
                  placeholder="Cadde, mahalle sokak ve diğer bilgileri giriniz." 
                  className="w-full px-3 py-2.5 sm:py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500 text-gray-900 text-sm sm:text-xs min-h-[80px] sm:min-h-[60px] placeholder:text-sm sm:placeholder:text-xs"
                  style={{
                    WebkitAppearance: 'none',
                    appearance: 'none',
                    resize: 'vertical' as any
                  }}
                />
                <span className="text-xs sm:text-[10px] text-gray-500 mt-1 block leading-relaxed">Kargonuzun size sorunsuz bir şekilde ulaşabilmesi için mahalle, cadde, sokak, bina gibi detay bilgileri eksiksiz girdiğinizden emin olun.</span>
              </div>
              <div className="md:col-span-2">
                <label className="block font-medium text-gray-700 mb-1 text-xs">Adres Başlığı*</label>
                <input name="addressTitle" value={form.addressTitle} onChange={handleChange} required placeholder="Adres Başlığı Giriniz" className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500 text-gray-900 text-xs placeholder:text-xs" />
              </div>
              <div className="md:col-span-2">
                <label className="block font-medium text-gray-700 mb-1 text-xs">Fatura Türü*</label>
                <div className="flex gap-2 mt-1">
                  <button type="button" onClick={() => handleInvoiceType('Bireysel')} className={`flex-1 py-2 rounded border text-xs font-medium ${form.invoiceType === 'Bireysel' ? 'border-orange-500 text-orange-500 bg-orange-50' : 'border-gray-300 text-gray-700 bg-white'}`}>Bireysel</button>
                  <button type="button" onClick={() => handleInvoiceType('Kurumsal')} className={`flex-1 py-2 rounded border text-xs font-medium ${form.invoiceType === 'Kurumsal' ? 'border-orange-500 text-orange-500 bg-orange-50' : 'border-gray-300 text-gray-700 bg-white'}`}>Kurumsal</button>
                </div>
              </div>
              {form.invoiceType === 'Kurumsal' && (
                <>
                  <div className="md:col-span-1">
                    <label className="block font-medium text-gray-700 mb-1 text-xs flex items-center gap-1">
                      VKN/TCKN*
                      <span title="Vergi Kimlik Numarası / TC Kimlik Numarası hakkında bilgi" className="text-[10px] text-gray-400 cursor-help">&#9432;</span>
                    </label>
                    <input 
                      name="vkn" 
                      value={form.vkn || ''} 
                      maxLength={11}
                      onChange={e => {
                        const value = e.target.value.replace(/\D/g, '');
                        setForm(prev => ({ ...prev, vkn: value }));
                      }}
                      required={form.invoiceType === 'Kurumsal'} 
                      placeholder="VKN/TCKN Giriniz" 
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500 text-gray-900 text-xs placeholder:text-xs" 
                    />
                  </div>
                  <div className="md:col-span-1">
                    <label className="block font-medium text-gray-700 mb-1 text-xs">Vergi Dairesi*</label>
                    <input name="taxOffice" value={form.taxOffice || ''} onChange={handleChange} required={form.invoiceType === 'Kurumsal'} placeholder="Vergi Dairesi Giriniz" className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500 text-gray-900 text-xs placeholder:text-xs" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block font-medium text-gray-700 mb-1 text-xs">Firma Adı*</label>
                    <input name="companyName" value={form.companyName || ''} onChange={handleChange} required={form.invoiceType === 'Kurumsal'} placeholder="Firma Adı Giriniz" className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500 text-gray-900 text-xs placeholder:text-xs" />
                  </div>
                  <div className="md:col-span-2 flex items-center gap-2 mt-1">
                    <input id="isEFatura" name="isEFatura" type="checkbox" checked={form.isEFatura} onChange={handleChange} className="w-4 h-4 border-gray-300 rounded accent-orange-500" />
                    <label htmlFor="isEFatura" className="text-xs text-gray-700 select-none">E-fatura mükellefiyim</label>
                  </div>
                </>
              )}
              <div className="md:col-span-2 mt-4">
                <button type="submit" disabled={saving} className="w-full bg-orange-500 text-white py-2 rounded-lg font-semibold text-sm hover:bg-orange-600 transition-colors disabled:opacity-60">{saving ? 'Kaydediliyor...' : 'Kaydet'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div 
          className="fixed inset-0 z-[1400] flex items-center justify-center bg-black bg-opacity-30"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100%',
            height: '100dvh',
            transform: 'translateZ(0)',
            WebkitTransform: 'translateZ(0)',
            isolation: 'isolate',
            touchAction: 'pan-y',
            overscrollBehavior: 'contain'
          }}
        >
          <div className="bg-white border-2 border-orange-500 rounded-lg p-4 max-w-xs w-full mx-4 text-center">
            <div className="mb-3 text-base font-semibold text-orange-500">Adresi silmek istiyor musunuz?</div>
            <div className="flex justify-center gap-2 mt-4">
              <button onClick={confirmDelete} className="px-4 py-1.5 rounded bg-orange-500 text-white font-medium text-xs hover:bg-orange-600 transition-colors">Evet, Sil</button>
              <button onClick={cancelDelete} className="px-4 py-1.5 rounded border border-orange-200 text-orange-500 font-medium text-xs bg-white hover:bg-orange-50 transition-colors">Vazgeç</button>
            </div>
          </div>
        </div>
      )}

      {showPasswordModal && (
        <div 
          className="fixed inset-0 z-[1400] flex items-center justify-center bg-black bg-opacity-40"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100%',
            height: '100dvh',
            transform: 'translateZ(0)',
            WebkitTransform: 'translateZ(0)',
            isolation: 'isolate',
            touchAction: 'pan-y',
            overscrollBehavior: 'contain'
          }}
        >
          <div 
            className="bg-white rounded-xl w-full max-w-md mx-4 p-4 pt-8 relative animate-fade-in overflow-visible z-[1401]"
            style={{
              maxHeight: '90dvh',
              WebkitOverflowScrolling: 'touch',
              overscrollBehavior: 'contain',
              paddingTop: 'calc(env(safe-area-inset-top, 0px) + 32px)',
              paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 16px)'
            }}
          >
            <button onClick={handleClosePasswordModal} className="absolute right-2 top-2 text-gray-400 hover:text-gray-700 z-[1402]">
              <XMarkIcon className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Şifreyi Güncelle</h2>
            <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-3 text-sm">
              <div>
                <label className="block font-medium text-gray-700 mb-1 text-xs">Mevcut Şifre*</label>
                <input name="password" type="password" value={passwordForm.password} onChange={handlePasswordChange} required placeholder="Mevcut şifreniz" className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500 text-gray-900 text-xs placeholder:text-xs" />
              </div>
              <div>
                <label className="block font-medium text-gray-700 mb-1 text-xs">Yeni Şifre*</label>
                <input name="new_password" type="password" value={passwordForm.new_password} onChange={handlePasswordChange} required placeholder="Yeni şifreniz" className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500 text-gray-900 text-xs placeholder:text-xs" />
              </div>
              <div>
                <label className="block font-medium text-gray-700 mb-1 text-xs">Yeni Şifre (Tekrar)*</label>
                <input name="new_password_confirmation" type="password" value={passwordForm.new_password_confirmation} onChange={handlePasswordChange} required placeholder="Yeni şifre tekrar" className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500 text-gray-900 text-xs placeholder:text-xs" />
              </div>
              {passwordError && <div className="text-xs text-red-500 mt-1">{passwordError}</div>}
              {passwordSuccess && <div className="text-xs text-green-600 mt-1">{passwordSuccess}</div>}
              <div className="mt-2">
                <button type="submit" disabled={passwordLoading} className="w-full bg-orange-500 text-white py-2 rounded-lg font-semibold text-sm hover:bg-orange-600 transition-colors disabled:opacity-60">
                  {passwordLoading ? 'Kaydediliyor...' : 'Şifreyi Güncelle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Addresses; 