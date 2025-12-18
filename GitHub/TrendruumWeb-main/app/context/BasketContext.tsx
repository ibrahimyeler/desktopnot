"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo
} from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useAuth } from './AuthContext';
import { API_V1_URL } from '@/lib/config';

const BASE_URL = API_V1_URL; // ✅ CANLI URL, doğrudan API'ye istek yapılıyor

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('basketId');
      window.location.href = '/giris';
    }
    return Promise.reject(error);
  }
);

// Guest ID oluşturma fonksiyonu
const generateGuestId = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Guest ID yönetimi - 1 günlük ID oluştur veya mevcut olanı kullan
const getOrCreateGuestId = (): string => {
  // Server-side rendering için kontrol
  if (typeof window === 'undefined') {
    return generateGuestId();
  }

  const storedGuestId = localStorage.getItem('guestId');
  const storedTimestamp = localStorage.getItem('guestIdTimestamp');
  
  if (storedGuestId && storedTimestamp) {
    const timestamp = parseInt(storedTimestamp);
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000; // 1 gün milisaniye cinsinden
    
    // Eğer 1 günden az geçmişse mevcut ID'yi kullan
    if (now - timestamp < oneDay) {
      return storedGuestId;
    }
  }
  
  // Yeni ID oluştur ve kaydet
  const newGuestId = generateGuestId();
  localStorage.setItem('guestId', newGuestId);
  localStorage.setItem('guestIdTimestamp', Date.now().toString());
  
  return newGuestId;
};

// Guest ID'yi temizle (login olduğunda)
const clearGuestId = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('guestId');
    localStorage.removeItem('guestIdTimestamp');
  }
};

// Types
export interface BasketItem {
  id: string;
  basket_id: string;
  basket_group_id: string;
  seller_id: string;
  product_id: string;
  quantity: number;
  price: number;
  updated_at: string;
  created_at: string;
  variants?: {
    [key: string]: string;
  };
  product: {
    name: string;
    price: number;
    images?: Array<{
      url: string;
      fullpath: string;
    }>;
    medias?: Array<{
      url: string;
      fullpath: string;
    }> | {
      url: string;
      fullpath: string;
      name?: string;
      type?: string;
      id?: string;
    };
    status?: string;
    slug: string;
    updated_at: string;
    created_at: string;
    id: string;
  };
  total_price: number;
}

interface BasketGroup {
  basket_id: string;
  seller_id: string;
  seller: {
    name: string;
    id: string;
  };
  updated_at: string;
  created_at: string;
  total_price: number;
  id: string;
  basket_group_items: BasketItem[];
}

interface Basket {
  user_id: string;
  status: string;
  total_price: number;
  updated_at: string;
  created_at: string;
  id: string;
  basket_groups: BasketGroup[];
}

// Guest Basket Types
interface GuestBasket {
  id: string;
  user_type: string;
  basket_groups: BasketGroup[];
  total_quantity: number;
  total_price: number;
  total_shipping_fee: number;
  total_products: number;
}

interface BasketResponse {
  meta: {
    status: string;
    message: string;
    code: number;
  };
  data: Basket | GuestBasket;
}

interface BasketContextType {
  basket: Basket | GuestBasket | null;
  basketItems: BasketItem[];
  totalQuantity: number;
  totalPrice: number;
  loading: boolean;
  error: string | null;
  addToBasket: (productId: string, quantity: number, variants?: { [key: string]: string }) => Promise<void>;
  addToGuestBasket: (productId: string, quantity: number, variants?: { [key: string]: string }) => Promise<void>;
  updateBasketItem: (productId: string, quantity: number) => Promise<void>;
  removeFromBasket: (productId: string, quantity?: number) => Promise<void>;
  clearBasket: () => Promise<void>;
  refreshBasket: () => Promise<void>;
  shippingFee: number;
  isGuestBasket: boolean;
  guestId: string;
}

const BasketContext = createContext<BasketContextType | undefined>(undefined);

// Component
export function BasketProvider({ children }: { children: React.ReactNode }) {
  const [basket, setBasket] = useState<Basket | GuestBasket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isLoggedIn } = useAuth();
  const [guestId] = useState<string>(getOrCreateGuestId());

  const handleBasketError = useCallback((error: unknown) => {
    
    if (axios.isAxiosError(error)) {
      const errorData = error.response?.data;
      const errorMessage = 
        errorData?.meta?.message || 
        errorData?.message || 
        errorData?.error?.message ||
        errorData?.error ||
        (typeof errorData === 'string' ? errorData : '') ||
        error.message || 
        'Bilinmeyen bir hata oluştu';
      
      setError(errorMessage);
      
      const errorMessageLower = String(errorMessage).toLowerCase();
   
      // Stok ile ilgili hata mesajlarını kontrol et
      if (errorMessageLower.includes('stok') || 
          errorMessageLower.includes('stock') ||
          errorMessageLower.includes('yetersiz') ||
          errorMessageLower.includes('bulunamadı') ||
          errorMessageLower.includes('mevcut değil')) {
        toast.error('Ürün stokta bulunmamaktadır.');
        return;
      }
      
      // "Ürün güncellenirken bir hata oluştu" mesajını "Ürün stokta bulunmamaktadır" olarak değiştir
      if (errorMessageLower.includes('güncellenirken') && errorMessageLower.includes('hata')) {
        toast.error('Ürün stokta bulunmamaktadır.');
        return;
      }
      
      // "An unexpected error occurred" mesajını daha anlamlı hale getir
      if (errorMessage === 'An unexpected error occurred' || errorMessageLower.includes('unexpected error')) {
        if (error.response?.status === 500) {
          // 500 hatası için de stok kontrolü yap
          if (errorMessageLower.includes('stok') || errorMessageLower.includes('stock')) {
            toast.error('Ürün stokta bulunmamaktadır.');
          } else {
          toast.error('Sunucu hatası oluştu. Lütfen sayfayı yenileyin.');
          }
        } else if (error.response?.status === 401) {
          toast.error('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
        } else if (error.response?.status === 404) {
          toast.error('Sepet bilgileri bulunamadı.');
        } else {
          toast.error('Sepet yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.');
        }
        return;
      }
      
      // Eğer gerçek bir hata mesajı varsa onu göster
      if (errorMessage && errorMessage.trim() !== '' && errorMessage !== 'Bilinmeyen bir hata oluştu') {
        toast.error(errorMessage);
        return;
      }
      
      // Daha kullanıcı dostu mesajlar (sadece gerçek hata mesajı yoksa)
      if (error.response?.status === 500) {
        // 500 hatası için de stok kontrolü yap
        if (errorMessageLower.includes('stok') || errorMessageLower.includes('stock')) {
          toast.error('Ürün stokta bulunmamaktadır.');
        } else {
        toast.error('Sunucu hatası oluştu. Lütfen tekrar deneyin.');
        }
      } else if (error.response?.status === 400) {
        toast.error('Geçersiz istek. Lütfen tekrar deneyin.');
      } else if (error.response?.status === 401) {
        toast.error('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
      } else {
        toast.error(`Sepet işlemi başarısız: ${errorMessage}`);
      }
    } else {
      const errorMessage = error instanceof Error ? error.message : 'Bilinmeyen bir hata oluştu';
      setError(errorMessage);
      toast.error('Bir hata oluştu. Lütfen tekrar deneyin.');
    }
  }, []);

  // Ürün stok kontrolü
  const checkProductStock = useCallback(async (productId: string): Promise<{ stock: number; name: string } | null> => {
    try {
      // Eğer productId MongoDB ObjectId formatındaysa (24 hex karakter), isteği atlama
      // API slug bekliyor, ID ile istek atarsak 400 hatası alırız
      const isObjectId = /^[0-9a-fA-F]{24}$/.test(productId);
      if (isObjectId) {
        // ID formatında ise stok kontrolünü atla - API slug bekliyor
        // Sepete ekleme işlemi devam edecek, API kendi stok kontrolünü yapacak
        return null;
      }
      
      // Slug formatında ise isteği at
      let response = await axiosInstance.get(`/products/${productId}`);
      
      if (response.data.meta.status === 'success') {
        return {
          stock: response.data.data.stock || 0,
          name: response.data.data.name || 'Ürün'
        };
      }
      
      return null;
    } catch (error) {
      // 400 hatası aldıysak, ID ile çekilemiyor demektir - slug ile denemeyi atla
      // Çünkü ID MongoDB ObjectId formatında olabilir ve API slug bekliyor
      // Stok kontrolü başarısız, sessizce devam et (sepete ekleme işlemi devam edecek)
      return null;
    }
  }, []);

  // Guest basket işlemleri
  const getGuestBasket = useCallback(async () => {
    try {
      const response = await axiosInstance.get<BasketResponse>('/baskets', {
        headers: {
          'Guest-ID': guestId
        }
      });
      if (response.data.meta.status === 'success') {
        const guestBasket = response.data.data as GuestBasket;
        return guestBasket;
      }
      throw new Error(response.data.meta.message);
    } catch (error) {
      return null;
    }
  }, [guestId]);

  const addToGuestBasket = useCallback(async (productId: string, quantity: number, variants?: { [key: string]: string }): Promise<void> => {
    try {
      // Önce ürün stok kontrolü yap
      const productInfo = await checkProductStock(productId);
      
      if (productInfo) {
        if (productInfo.stock <= 0) {
          toast.error(`${productInfo.name} ürünü stokta bulunmamaktadır.`);
          return;
        }
        
        if (productInfo.stock < quantity) {
          toast.error(`${productInfo.name} ürününden sadece ${productInfo.stock} adet stokta bulunmaktadır.`);
          return;
        }
      }
      // Stok kontrolü başarısız olsa bile sepete ekleme işlemine devam et
      // API'den gelen hata mesajlarına göre işlem yapılacak

      const requestBody: any = { product_id: productId, quantity: quantity };
      if (variants && Object.keys(variants).length > 0) {
        requestBody.variants = variants;
      }

      const response = await axiosInstance.post<BasketResponse>('/baskets/add', requestBody, {
        headers: {
          'Guest-ID': guestId
        }
      });

      if (response.data.meta.status === 'success') {
        setBasket(response.data.data as GuestBasket);
        toast.success('Ürün sepete eklendi');
        return;
      }
      throw new Error(response.data.meta.message);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // API'den gelen hata mesajını kontrol et
        const errorMessage = error.response?.data?.meta?.message || error.response?.data?.message || '';
        const errorCode = error.response?.data?.meta?.code;
        
        // Stok ile ilgili hata mesajlarını kontrol et
        if (errorMessage.toLowerCase().includes('stok') || 
            errorMessage.toLowerCase().includes('stock') ||
            errorMessage.toLowerCase().includes('yetersiz') ||
            errorMessage.toLowerCase().includes('bulunamadı') ||
            errorMessage.toLowerCase().includes('mevcut değil')) {
          toast.error('Ürün stokta bulunmamaktadır.');
          return;
        }
        
        // HTTP status kodlarına göre mesajlar
        if (error.response?.status === 404) {
          toast.error('Ürün bulunamadı veya stokta değil.');
          return;
        } else if (error.response?.status === 500) {
          // 500 hatası için de stok kontrolü yap
          if (errorMessage.toLowerCase().includes('stok') || 
              errorMessage.toLowerCase().includes('stock') ||
              errorMessage.toLowerCase().includes('yetersiz')) {
            toast.error('Ürün stokta bulunmamaktadır.');
          } else {
            toast.error('Ürün stokta bulunmamaktadır.');
          }
          return;
        } else if (error.response?.status === 400) {
          // 400 hatası için de stok kontrolü yap
          if (errorMessage.toLowerCase().includes('stok') || 
              errorMessage.toLowerCase().includes('stock') ||
              errorMessage.toLowerCase().includes('yetersiz')) {
            toast.error('Ürün stokta bulunmamaktadır.');
          } else {
            toast.error('Ürün bilgileri alınamadı. Lütfen tekrar deneyin.');
          }
          return;
        }
      }
      // Diğer hatalar için genel mesaj
      toast.error('Ürün sepete eklenirken bir hata oluştu.');
      return;
    }
  }, [guestId, checkProductStock]);

  const updateGuestBasketItem = useCallback(async (productId: string, quantity: number) => {
    try {
      const response = await axiosInstance.post<BasketResponse>('/baskets/update', {
        product_id: productId,
        quantity: quantity
      }, {
        headers: {
          'Guest-ID': guestId
        }
      });

      if (response.data.meta.status === 'success') {
        setBasket(response.data.data as GuestBasket);
        return response.data.data as GuestBasket;
      }
      throw new Error(response.data.meta.message);
    } catch (error: any) {
      // API'den gelen hata mesajını kontrol et
      if (axios.isAxiosError(error)) {
        const errorData = error.response?.data;
        const errorMessage = 
          errorData?.meta?.message || 
          errorData?.message || 
          errorData?.error?.message ||
          errorData?.error ||
          (typeof errorData === 'string' ? errorData : '') ||
          '';
        
        const errorMessageLower = String(errorMessage).toLowerCase();
        
        // Stok ile ilgili hata mesajlarını kontrol et
        if (errorMessageLower.includes('stok') || 
            errorMessageLower.includes('stock') ||
            errorMessageLower.includes('yetersiz') ||
            errorMessageLower.includes('bulunamadı') ||
            errorMessageLower.includes('mevcut değil')) {
          toast.error('Ürün stokta bulunmamaktadır.');
          // Hata mesajı gösterildi, hatayı fırlatma (üst seviyede tekrar gösterilmesin)
          // Sepeti yenileme işlemi updateBasketItem içinde yapılacak
          return;
        }
        
        // "Ürün güncellenirken bir hata oluştu" mesajını "Ürün stokta bulunmamaktadır" olarak değiştir
        if (errorMessageLower.includes('güncellenirken') && errorMessageLower.includes('hata')) {
          toast.error('Ürün stokta bulunmamaktadır.');
          // Hata mesajı gösterildi, hatayı fırlatma (üst seviyede tekrar gösterilmesin)
          // Sepeti yenileme işlemi updateBasketItem içinde yapılacak
          return;
        }
        
        // Eğer gerçek bir hata mesajı varsa onu göster
        if (errorMessage && errorMessage.trim() !== '') {
          toast.error(errorMessage);
          // Hata mesajı gösterildi, hatayı fırlatma (üst seviyede tekrar gösterilmesin)
          return;
        }
      }
      throw error;
    }
  }, [guestId]);

  const removeFromGuestBasket = useCallback(async (productId: string) => {
    try {
      const response = await axiosInstance.post<BasketResponse>('/baskets/remove', {
        product_id: productId
      }, {
        headers: {
          'Guest-ID': guestId
        }
      });

      if (response.data.meta.status === 'success') {
        const updatedBasket = response.data.data as GuestBasket;
        
        // Sepet boş mu kontrol et
        const hasItems = updatedBasket?.basket_groups?.some(group => 
          group.basket_group_items && group.basket_group_items.length > 0
        );
        
        if (!hasItems) {
          // Sepet boşsa null olarak ayarla
          setBasket(null);
        } else {
          setBasket(updatedBasket);
        }
        
        toast.success('Ürün sepetten kaldırıldı');
        return updatedBasket;
      }
      throw new Error(response.data.meta.message);
    } catch (error) {
      throw error;
    }
  }, [guestId]);

  const refreshBasket = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

      if (!token) {
        // Guest basket işlemi
        try {
          const response = await axiosInstance.get<BasketResponse>('/baskets', {
            headers: {
              'Guest-ID': guestId
            }
          });
          if (response.data.meta.status === 'success') {
            const guestBasket = response.data.data as GuestBasket;
            setBasket(guestBasket);
          } else {
            setBasket(null);
          }
        } catch (guestError) {
          setBasket(null);
        }
        return;
      }

      // Logged in user basket işlemi
      const response = await axiosInstance.get<BasketResponse>('/customer/baskets', {
        headers: { Authorization: `Bearer ${token}` }
      });


      if (response.data.meta.status === 'success') {
        const basketData = response.data.data as Basket;
        
        // Sepet verilerini her zaman set et (boş olsa bile)
        setBasket(basketData);
        if (typeof window !== 'undefined') {
          localStorage.setItem('basketId', basketData.id);
        }
      } else {
        throw new Error(response.data.meta.message);
      }
    } catch (err) {
      // Site açılışında sepet yüklenirken hata oluşursa sessizce geç
      // Sadece gerçek sepet işlemlerinde hata göster
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          // Token geçersizse sessizce geç
          setBasket(null);
        } else if (err.response?.status === 404) {
          // Sepet bulunamadı - boş sepet oluştur
          setBasket(null);
        } else {
          setBasket(null);
        }
      } else {
        setBasket(null);
      }
    } finally {
      setLoading(false);
    }
  }, [handleBasketError, guestId]);

  const addToBasket = async (productId: string, quantity: number, variants?: { [key: string]: string }) => {
    try {
      setLoading(true);
      setError(null);

      // Önce ürün stok kontrolü yap
      const productInfo = await checkProductStock(productId);
      
      if (productInfo) {
        if (productInfo.stock <= 0) {
          toast.error(`${productInfo.name} ürünü stokta bulunmamaktadır.`);
          return;
        }
        
        if (productInfo.stock < quantity) {
          toast.error(`${productInfo.name} ürününden sadece ${productInfo.stock} adet stokta bulunmaktadır.`);
          return;
        }
      }
      // Stok kontrolü başarısız olsa bile sepete ekleme işlemine devam et
      // API'den gelen hata mesajlarına göre işlem yapılacak

      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      
      if (!token) {
        // Guest basket işlemi
        await addToGuestBasket(productId, quantity, variants);
        return;
      }

      // Logged in user basket işlemi - variant bilgilerini ekle
      const requestBody: any = { product_id: productId, quantity };
      if (variants && Object.keys(variants).length > 0) {
        requestBody.variants = variants;
      }

      const response = await axiosInstance.post<BasketResponse>(
        '/customer/baskets/add',
        requestBody,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.meta.status === 'success') {
        setBasket(response.data.data as Basket);
        toast.success('Ürün sepete eklendi');
        
        // Sepete eklenen ürünü geçmişe kaydet
        saveToCartHistory(productId, response.data.data as Basket);
      } else {
        throw new Error(response.data.meta.message || 'Ürün sepete eklenirken bir hata oluştu');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // API'den gelen hata mesajını kontrol et - tüm olası yerleri kontrol et
        const errorData = error.response?.data;
        const errorMessage = 
          errorData?.meta?.message || 
          errorData?.message || 
          errorData?.error?.message ||
          errorData?.error ||
          (typeof errorData === 'string' ? errorData : '') ||
          '';
        
        // Hata mesajını string'e çevir ve küçük harfe çevir
        const errorMessageLower = String(errorMessage).toLowerCase();
        
        // Validation failed kontrolü - öncelikli kontrol
        if (errorMessageLower.includes('validation') || 
            errorMessageLower.includes('valid') ||
            errorMessageLower.includes('geçersiz') ||
            errorMessageLower.includes('failed')) {
          toast.error('Ürün bilgileri geçersiz. Lütfen sayfayı yenileyip tekrar deneyin.');
          return;
        }
        
        // Stok ile ilgili hata mesajlarını kontrol et
        if (errorMessageLower.includes('stok') || 
            errorMessageLower.includes('stock') ||
            errorMessageLower.includes('yetersiz') ||
            errorMessageLower.includes('bulunamadı') ||
            errorMessageLower.includes('mevcut değil')) {
          toast.error('Ürün stokta bulunmamaktadır.');
          return;
        }
        
        if (error.response?.status === 401) {
          if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
          }
          toast.error('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
          window.location.href = '/giris';
        } else if (error.response?.status === 404) {
          toast.error('Ürün bulunamadı veya stokta değil.');
        } else if (error.response?.status === 500) {
          // 500 hatası - genellikle validation veya sunucu hatası
          toast.error('Ürün bilgileri geçersiz veya sunucu hatası oluştu. Lütfen sayfayı yenileyip tekrar deneyin.');
        } else if (error.response?.status === 400) {
          // 400 hatası - genellikle validation hatası
          toast.error('Ürün bilgileri geçersiz. Lütfen sayfayı yenileyip tekrar deneyin.');
        } else {
          handleBasketError(error);
        }
      } else {
        handleBasketError(error);
      }
    } finally {
      setLoading(false);
    }
  };

  // Sepete eklenen ürünleri geçmişe kaydet
  const saveToCartHistory = (productId: string, basketData: Basket | GuestBasket) => {
    try {
      // Server-side rendering için kontrol
      if (typeof window === 'undefined') {
        return;
      }

      // Mevcut geçmişi al
      const existingHistory = localStorage.getItem('cartHistory');
      const history = existingHistory ? JSON.parse(existingHistory) : [];
      
      // Sepetteki ürünü bul
      const addedItem = basketData.basket_groups
        .flatMap(group => group.basket_group_items)
        .find(item => item.product_id === productId);
      
      if (addedItem) {
        // Aynı ürün zaten varsa güncelle, yoksa ekle
        const existingIndex = history.findIndex((item: any) => item.product_id === productId);
        const newItem = {
          id: Date.now().toString(),
          product_id: productId,
          product_name: addedItem.product?.name || 'Bilinmeyen Ürün',
          price: addedItem.price || 0,
          quantity: addedItem.quantity || 0,
          added_at: new Date().toISOString(),
          product_image: (Array.isArray(addedItem.product?.medias) ? addedItem.product.medias[0]?.url : addedItem.product?.medias?.url) || addedItem.product?.images?.[0]?.url || '/placeholder.webp',
          product_slug: addedItem.product?.slug || ''
        };
        
        if (existingIndex !== -1) {
          // Mevcut ürünü güncelle
          history[existingIndex] = {
            ...history[existingIndex],
            quantity: addedItem.quantity,
            added_at: new Date().toISOString()
          };
        } else {
          // Yeni ürün ekle
          history.unshift(newItem);
        }
        
        // Son 2 haftalık veriyi tut (14 gün)
        const twoWeeksAgo = new Date();
        twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
        
        const filteredHistory = history.filter((item: any) => 
          new Date(item.added_at) >= twoWeeksAgo
        );
        
        localStorage.setItem('cartHistory', JSON.stringify(filteredHistory));
      }
    } catch (error) {
    }
  };

  const updateBasketItem = async (productId: string, quantity: number) => {
    try {
      // setLoading(true); // Bu satırı kaldırdık - tüm component'leri re-render etmesin
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      
      if (!token) {
        // Guest basket işlemi
        // updateGuestBasketItem içinde hata durumunda toast gösteriliyor ve return ediliyor
        await updateGuestBasketItem(productId, quantity);
        return;
      }

      // Logged in user basket işlemi
      const response = await axiosInstance.post<BasketResponse>(
        '/customer/baskets/update',
        { product_id: productId, quantity },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.meta.status === 'success') {
        setBasket(response.data.data as Basket);
      }
    } catch (error: any) {
      // API'den gelen hata mesajını kontrol et
      if (axios.isAxiosError(error)) {
        const errorData = error.response?.data;
        const errorMessage = 
          errorData?.meta?.message || 
          errorData?.message || 
          errorData?.error?.message ||
          errorData?.error ||
          (typeof errorData === 'string' ? errorData : '') ||
          '';
        
        const errorMessageLower = String(errorMessage).toLowerCase();
        
        // Stok ile ilgili hata mesajlarını kontrol et
        if (errorMessageLower.includes('stok') || 
            errorMessageLower.includes('stock') ||
            errorMessageLower.includes('yetersiz') ||
            errorMessageLower.includes('bulunamadı') ||
            errorMessageLower.includes('mevcut değil')) {
          toast.error('Ürün stokta bulunmamaktadır.');
          // Sepeti yenile
          await refreshBasket();
          return;
        }
        
        // "Ürün güncellenirken bir hata oluştu" mesajını "Ürün stokta bulunmamaktadır" olarak değiştir
        if (errorMessageLower.includes('güncellenirken') && errorMessageLower.includes('hata')) {
          toast.error('Ürün stokta bulunmamaktadır.');
          // Sepeti yenile
          await refreshBasket();
          return;
        }
        
      // 404 hatası için özel mesaj
      if (error.response?.status === 404) {
          // Eğer hata mesajı varsa onu göster, yoksa genel mesaj
          if (errorMessage && errorMessage.trim() !== '') {
            toast.error(errorMessage);
          } else {
            toast.error('Ürün bulunamadı veya stokta değil.');
          }
        // Sepeti yenile
        await refreshBasket();
          return;
        }
        
        // Eğer gerçek bir hata mesajı varsa onu göster
        if (errorMessage && errorMessage.trim() !== '') {
          toast.error(errorMessage);
          return;
        }
      }
      
      // Diğer hatalar için genel hata yönetimi
        handleBasketError(error);
    }
    // finally bloğunu da kaldırdık
  };

  const removeFromBasket = async (productId: string, quantity?: number) => {
    try {
      setLoading(true);
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      
      if (!token) {
        // Guest basket işlemi
        await removeFromGuestBasket(productId);
        return;
      }

      // Logged in user basket işlemi
      const response = await axiosInstance.post<BasketResponse>(
        '/customer/baskets/remove',
        { product_id: productId, quantity: quantity || 1 },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.meta.status === 'success') {
        const updatedBasket = response.data.data as Basket;
        
        // Sepet boş mu kontrol et
        const hasItems = updatedBasket?.basket_groups?.some(group => 
          group.basket_group_items && group.basket_group_items.length > 0
        );
        
        
        if (!hasItems) {
          // Sepet boşsa null olarak ayarla
          setBasket(null);
        } else {
          setBasket(updatedBasket);
        }
        
        toast.success('Ürün sepetten kaldırıldı');
      }
    } catch (error) {
      handleBasketError(error);
    } finally {
      setLoading(false);
    }
  };

  const clearBasket = async () => {
    try {
      setLoading(true);
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      
      if (!token) {
        // Guest basket için tüm ürünleri tek tek sil
        if (basket?.basket_groups) {
          for (const group of basket.basket_groups) {
            for (const item of group.basket_group_items) {
              await removeFromGuestBasket(item.product_id);
            }
          }
        }
        setBasket(null);
        toast.success('Sepet temizlendi');
        return;
      }

      // Logged in user basket işlemi
      const response = await axiosInstance.delete<BasketResponse>(
        '/customer/baskets/clear',
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.meta.status === 'success') {
        setBasket(null);
        toast.success('Sepet temizlendi');
      } else {
        // API başarısız olsa bile local state'i temizle
        setBasket(null);
        toast.success('Sepet temizlendi');
      }
    } catch (error) {
      // API hatası olsa bile local state'i temizle
      setBasket(null);
      toast.success('Sepet temizlendi');
      handleBasketError(error);
    } finally {
      setLoading(false);
    }
  };

  const totalPrice = useMemo(() => {
    if (!basket?.basket_groups) return 0;
    let total = 0;
    
    try {
      total = basket.basket_groups.reduce((groupTotal, group) => {
        const groupSum = (group.basket_group_items || []).reduce((itemTotal, item) => {
          try {
            if (!item || item.price === null || item.price === undefined || item.quantity === null || item.quantity === undefined) {
              return itemTotal;
            }
          const itemPrice = Number(item.price) || 0;
          const itemQuantity = Number(item.quantity) || 0;
          return itemTotal + (itemPrice * itemQuantity);
          } catch (error) {
            return itemTotal;
          }
        }, 0);
        return groupTotal + groupSum;
      }, 0);
    } catch (error) {
      return 0;
    }
    
    return total;
  }, [basket]);

  const shippingFee = useMemo(() => {
    if (!basket?.basket_groups) return 0;
    
    try {
      // Tüm sepet toplamını hesapla
      const totalCartValue = basket.basket_groups.reduce((total, group) => {
        const groupTotal = group.basket_group_items.reduce((groupTotal, item) => {
          try {
            if (!item || item.price === null || item.price === undefined || item.quantity === null || item.quantity === undefined) {
              return groupTotal;
            }
          const itemPrice = Number(item.price) || 0;
          const itemQuantity = Number(item.quantity) || 0;
          return groupTotal + (itemPrice * itemQuantity);
          } catch (error) {
            return groupTotal;
          }
        }, 0);
        return total + groupTotal;
      }, 0);
      
      // Free shipping for orders over 400 TL
      if (totalCartValue >= 400) return 0;
      return 125; // Default shipping fee
    } catch (error) {
      return 0;
    }
  }, [basket]);

  // Guest basket kontrolü
  const isGuestBasket = useMemo(() => {
    return !!(basket && 'user_type' in basket && basket.user_type === 'guest');
  }, [basket]);

  // Guest sepetini kullanıcı sepetine aktar
  const mergeGuestBasketToUserBasket = useCallback(async () => {
    try {
      // Eğer zaten bir kullanıcı sepeti varsa, guest sepetini aktarmaya gerek yok
      if (basket && !isGuestBasket) {
        return;
      }

      // Guest sepetini al
      const guestBasket = await getGuestBasket();
      if (!guestBasket || !guestBasket.basket_groups) {
        // Guest sepeti boşsa, sadece guest ID'yi temizle
        clearGuestId();
        return;
      }

      // Guest sepetindeki tüm ürünleri topla
      const guestItems: Array<{productId: string, quantity: number}> = [];
      guestBasket.basket_groups.forEach(group => {
        group.basket_group_items.forEach(item => {
          guestItems.push({
            productId: item.product_id,
            quantity: item.quantity
          });
        });
      });

      if (guestItems.length === 0) {
        // Guest sepeti boşsa, sadece guest ID'yi temizle
        clearGuestId();
        return;
      }

      // Her ürünü kullanıcı sepetine ekle
      for (const item of guestItems) {
        try {
          await addToBasket(item.productId, item.quantity);
          // Her ürün arasında kısa bir bekleme (API rate limiting için)
          await new Promise(resolve => setTimeout(resolve, 200));
        } catch (error) {
          // Bir ürün eklenemezse diğerlerine devam et
        }
      }

      // Guest ID'yi temizle
      clearGuestId();
      
      
    } catch (error) {
      // Hata olsa bile guest ID'yi temizle
      clearGuestId();
    }
  }, [basket, isGuestBasket, getGuestBasket, refreshBasket, addToBasket]);

  // Login olduğunda guest sepetini kullanıcı sepetine aktar
  useEffect(() => {
    if (isLoggedIn) {
      // Sadece bir kez çalıştırmak için flag kontrolü
      const hasMergedGuestBasket = localStorage.getItem('hasMergedGuestBasket');
      if (!hasMergedGuestBasket) {
        mergeGuestBasketToUserBasket();
        localStorage.setItem('hasMergedGuestBasket', 'true');
      }
    } else {
      // Logout olduğunda flag'i temizle
      localStorage.removeItem('hasMergedGuestBasket');
    }
  }, [isLoggedIn, mergeGuestBasketToUserBasket]);

  // İlk yüklemede sepeti yükle
  useEffect(() => {
    refreshBasket();
  }, []); // Sadece component mount olduğunda çalış

  return (
    <BasketContext.Provider
      value={{
        basket,
        basketItems: basket?.basket_groups?.flatMap(group => group.basket_group_items || []) || [],
        totalQuantity: (() => {
          if (!basket || !basket.basket_groups) return 0;
          let total = 0;
          try {
            total = basket.basket_groups.reduce((groupTotal, group) => {
              if (!group || !group.basket_group_items) return groupTotal;
              const groupSum = group.basket_group_items.reduce((itemTotal, item) => {
                return itemTotal + (Number(item.quantity) || 0);
              }, 0);
              return groupTotal + groupSum;
            }, 0);
          } catch (error) {
            return 0;
          }
          return total;
        })(),
        totalPrice,
        loading,
        error,
        addToBasket,
        addToGuestBasket,
        updateBasketItem,
        removeFromBasket,
        clearBasket,
        refreshBasket,
        shippingFee,
        isGuestBasket,
        guestId
      }}
    >
      {children}
    </BasketContext.Provider>
  );
}

export function useBasket() {
  const context = useContext(BasketContext);
  if (!context) {
    throw new Error('useBasket must be used within a BasketProvider');
  }
  return context;
}

// Optional version - context yoksa fallback değerler döner
export function useBasketOptional() {
  const context = useContext(BasketContext);
  if (!context) {
    // Fallback değerler
    return {
      basket: null,
      basketItems: [],
      totalQuantity: 0,
      totalPrice: 0,
      loading: false,
      error: null,
      addToBasket: async () => {},
      addToGuestBasket: async () => {},
      updateBasketItem: async () => {},
      removeFromBasket: async () => {},
      clearBasket: async () => {},
      refreshBasket: async () => {},
      shippingFee: 0,
      isGuestBasket: false,
      guestId: ''
    };
  }
  return context;
}
