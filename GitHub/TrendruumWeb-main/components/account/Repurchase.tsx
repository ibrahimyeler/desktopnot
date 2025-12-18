"use client";

import { MagnifyingGlassIcon, ArrowLeftIcon, ShoppingBagIcon, Bars3Icon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { useBasket } from '@/app/context/BasketContext';
import { createProductUrl } from '@/utils/productUrl';
import { API_V1_URL } from '@/lib/config';

interface OrderItem {
  id: string;
  product_id: string;
  quantity: number;
  price: number;
  product: {
    id: string;
    name: string;
    slug: string;
    stock?: number;
    status?: string;
    images?: Array<{
      url: string;
      fullpath: string;
    }>;
    medias?: {
      url: string;
      fullpath: string;
    };
  };
}

interface Order {
  id: string;
  order_number: string;
  status: string;
  total_price: number;
  created_at: string;
  items: OrderItem[];
  order_groups?: Array<{
    id: string;
    order_group_items: OrderItem[];
  }>;
}

interface RepurchaseProps {
  onMenuClick?: () => void;
}

const getBaseSlug = (slug?: string) => {
  if (!slug) return '';
  return slug.replace(/-\d+$/, '').toLowerCase();
};

const Repurchase = ({ onMenuClick }: RepurchaseProps) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasedProducts, setPurchasedProducts] = useState<any[]>([]);
  const { addToBasket } = useBasket();
  const [isDesktopViewport, setIsDesktopViewport] = useState(false);

  useEffect(() => {
    const updateViewport = () => {
      setIsDesktopViewport(window.innerWidth >= 1024);
    };

    updateViewport();
    window.addEventListener('resize', updateViewport);

    return () => {
      window.removeEventListener('resize', updateViewport);
    };
  }, []);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await fetch('/api/v1/customer/orders', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.meta?.status === 'success') {
          setOrders(data.data || []);
          
          // Satın alınan ürünleri topla
          const products = new Map();
          data.data?.forEach((order: Order) => {
            // order_groups içindeki order_group_items'ları kontrol et
            order.order_groups?.forEach((orderGroup: any) => {
              orderGroup.order_group_items?.forEach((item: OrderItem) => {
                const key = item.product_id;
                if (!products.has(key)) {
                  products.set(key, {
                    ...item.product,
                    id: item.product.id || item.product_id,
                    stock: item.product.stock ?? 0,
                    status: item.product.status ?? 'active',
                    quantity: item.quantity,
                    price: item.price,
                    lastOrderDate: order.created_at,
                    orderCount: 1
                  });
                } else {
                  const existing = products.get(key);
                  existing.orderCount += 1;
                  existing.quantity += item.quantity;
                }
              });
            });
          });
          
          // Ürünlerin güncel stok durumunu kontrol et
          const productIds = Array.from(products.keys());
          const availableProducts: any[] = [];
          
          // Her ürün için güncel stok durumunu kontrol et (paralel olarak)
          const productChecks = productIds.map(async (productId) => {
            try {
              const product = products.get(productId);
              if (!product || !product.slug) return null;
              
              // Ürün detayını API'den çek (slug ile)
              const productResponse = await fetch(`${API_V1_URL}/products/${product.slug}`, {
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
                }
              });
              
              if (productResponse.ok) {
                const productData = await productResponse.json();
                if (productData.meta?.status === 'success' && productData.data) {
                  const currentStock = productData.data.stock ?? 0;
                  const currentStatus = productData.data.status ?? 'active';
                  
                  // Sadece stokta olan ve aktif ürünleri ekle
                  if (currentStock > 0 && currentStatus === 'active') {
                    return {
                      ...product,
                      stock: currentStock,
                      status: currentStatus,
                      // Resim bilgilerini güncelle
                      images: productData.data.images || (productData.data.medias ? (Array.isArray(productData.data.medias) ? productData.data.medias : [productData.data.medias]) : []) || product.images || [],
                      medias: productData.data.medias || productData.data.images || product.medias
                    };
                  }
                }
              }
              return null;
            } catch (error) {
              // Hata durumunda ürünü atla
              return null;
            }
          });
          
          // Tüm kontrolleri bekle ve sonuçları filtrele
          const results = await Promise.all(productChecks);
          const filtered = results.filter((product): product is any => product !== null);
          
          setPurchasedProducts(filtered);
        }
      }
    } catch (error) {
      toast.error('Siparişler yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId: string) => {
    try {
      await addToBasket(productId, 1);
      // Toast mesajı BasketContext'te yönetiliyor
    } catch (error) {
      // Hata mesajı da BasketContext'te yönetiliyor
    }
  };

  const handleProductNavigation = (productSlug: string | undefined, productId: string) => {
    if (typeof window === 'undefined') return;
    const scrollPosition = window.scrollY || window.pageYOffset;
    sessionStorage.setItem('repurchaseScrollPosition', scrollPosition.toString());
    sessionStorage.setItem('repurchaseProductId', productId);
    sessionStorage.setItem('repurchaseProductSlug', productSlug || '');
    sessionStorage.setItem('repurchaseProductBaseSlug', getBaseSlug(productSlug));
  };

  useEffect(() => {
    if (typeof window === 'undefined' || loading || purchasedProducts.length === 0) return;

    const savedProductId = sessionStorage.getItem('repurchaseProductId');
    const savedScrollPosition = sessionStorage.getItem('repurchaseScrollPosition');
    const savedProductSlug = sessionStorage.getItem('repurchaseProductSlug');
    const savedProductBaseSlug = sessionStorage.getItem('repurchaseProductBaseSlug');

    if (!savedScrollPosition) return;

    const timer = setTimeout(() => {
      const scrollToElement = (element: HTMLElement) => {
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - 100;

        window.scrollTo({
          top: Math.max(offsetPosition, 0),
          behavior: 'smooth'
        });
      };

      let targetElement: HTMLElement | null = null;

      if (savedProductId) {
        targetElement = document.getElementById(`repurchase-${savedProductId}`);
      }

      if (!targetElement && savedProductSlug) {
        targetElement = document.querySelector(`[data-repurchase-slug="${savedProductSlug}"]`) as HTMLElement | null;
      }

      if (!targetElement && savedProductBaseSlug) {
        targetElement = document.querySelector(`[data-repurchase-slug^="${savedProductBaseSlug}"]`) as HTMLElement | null;
      }

      if (targetElement) {
        scrollToElement(targetElement);
      } else {
        const scrollPos = parseInt(savedScrollPosition, 10);
        if (!isNaN(scrollPos)) {
          window.scrollTo({
            top: scrollPos,
            behavior: 'smooth'
          });
        }
      }

      sessionStorage.removeItem('repurchaseProductId');
      sessionStorage.removeItem('repurchaseScrollPosition');
      sessionStorage.removeItem('repurchaseProductSlug');
      sessionStorage.removeItem('repurchaseProductBaseSlug');
    }, 300);

    return () => clearTimeout(timer);
  }, [loading, purchasedProducts]);

  const getImageUrl = (product: any): string => {
    // Önce images array'inden kontrol et
    if (product.images && Array.isArray(product.images) && product.images.length > 0) {
      return product.images[0].url || product.images[0].fullpath || '/placeholder.webp';
    }
    // Sonra medias object'inden kontrol et
    if (product.medias) {
      if (Array.isArray(product.medias) && product.medias.length > 0) {
        return product.medias[0].url || product.medias[0].fullpath || '/placeholder.webp';
      }
      if (product.medias.url) {
        return product.medias.url;
      }
      if (product.medias.fullpath) {
        return product.medias.fullpath;
      }
    }
    return '/placeholder.webp';
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('tr-TR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  if (loading) {
    return (
      <div className="flex-1">
        {/* Desktop Back Link */}
        <div className="hidden sm:flex items-center gap-2 mb-6">
          <Link 
            href="/hesabim"
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-orange-500 transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Hesabıma Dön
          </Link>
        </div>
        
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Tekrar Satın Al</h1>
        </div>
        
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </div>
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
            <ShoppingBagIcon className="w-6 h-6 text-orange-500" />
            <h1 className="text-xl font-semibold text-gray-900">Tekrar Satın Al</h1>
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
            <ShoppingBagIcon className="w-5 h-5 text-orange-500" />
            <h1 className="text-base font-semibold text-gray-900">Tekrar Satın Al</h1>
          </div>
        </div>
      </div>

      {purchasedProducts.length > 0 ? (
        <div className="space-y-4">
          <p className="text-sm text-gray-600 mb-4">
            Daha önce satın aldığınız ürünler
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {purchasedProducts.map((product, index) => (
              <div 
                key={index} 
                className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:border-orange-200 transition-colors flex flex-col"
                id={`repurchase-${product.id}`}
                data-repurchase-slug={product.slug || ''}
              >
                <Link 
                  href={createProductUrl(product.slug || '')} 
                  className="relative w-full aspect-square hover:opacity-80 transition-opacity"
                  onClick={() => handleProductNavigation(product.slug, product.id)}
                  target={isDesktopViewport ? '_blank' : undefined}
                  rel={isDesktopViewport ? 'noopener noreferrer' : undefined}
                >
                  <Image
                    src={getImageUrl(product)}
                    alt={product.name}
                    fill
                    className="object-contain p-2"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder.webp';
                    }}
                  />
                </Link>
                <div className="p-3 flex flex-col flex-1">
                  <Link 
                    href={createProductUrl(product.slug || '')} 
                    className="block flex-1 mb-2"
                    onClick={() => handleProductNavigation(product.slug, product.id)}
                    target={isDesktopViewport ? '_blank' : undefined}
                    rel={isDesktopViewport ? 'noopener noreferrer' : undefined}
                  >
                    <h3 className="font-medium text-xs sm:text-sm text-gray-900 line-clamp-2 hover:text-orange-600 transition-colors cursor-pointer min-h-[2.5rem]">
                      {product.name}
                    </h3>
                  </Link>
                  <div className="space-y-1.5">
                    <p className="text-sm sm:text-base font-bold text-black">
                      {formatPrice(product.price)} TL
                    </p>
                    <p className="text-xs text-gray-500">
                      {product.orderCount} kez satın alındı
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Boş Durum */
        <div className="bg-white rounded-lg p-8 text-center">
          <div className="max-w-sm mx-auto">
            <div className="bg-gray-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
              <ShoppingBagIcon className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Henüz Ürün Satın Almadınız
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Satın aldığınız ürünler burada listelenecek ve tekrar satın alabileceksiniz
            </p>
            <button 
              onClick={() => window.location.href = '/'}
              className="bg-orange-500 text-white px-6 py-2.5 rounded-lg font-medium text-sm hover:bg-orange-600 transition-colors"
            >
              Alışverişe Başla
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Repurchase; 