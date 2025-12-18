"use client";

import { useState, useEffect } from 'react';
import { ShoppingBagIcon, MagnifyingGlassIcon, StarIcon, ArrowLeftIcon, Bars3Icon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import SuccessNotification from '@/components/ui/SuccessNotification';
import ProductReviewModal from '@/components/ui/ProductReviewModal';
import OrdersTabs from './OrdersTabs';
import { API_V1_URL } from '@/lib/config';
import { createProductUrl } from '@/utils/productUrl';

interface Media {
  name: string;
  fullpath: string;
  url: string;
  type: string;
  id: string;
}

interface Product {
  name: string;
  price: number;
  medias: Media | Media[];
  status: string;
  slug: string;
  id: string;
}

interface OrderItem {
  order_group_id: string;
  product_id: string;
  quantity: number;
  price: number;
  product: Product;
  id: string;
}

interface Address {
  title: string;
  city: {
    name: string;
    slug: string;
    id: string;
  };
  district: {
    name: string;
    slug: string;
    id: string;
  };
  neighborhood: {
    name: string;
    slug: string;
    id: string;
  };
  description: string;
}

interface OrderAddress {
  firstname: string;
  lastname: string;
  phone: string;
  invoice: {
    type: string;
  };
  address: Address;
  id: string;
}

interface OrderGroup {
  order_id: string;
  status: string;
  address: OrderAddress;
  payment: any[];
  total_price: number;
  order_group_items: OrderItem[];
  id: string;
  ogid?: number;
  order_number?: string;
  tracking_number?: string;
}

interface Order {
  user_id: string;
  status: string;
  payment: any[];
  address: OrderAddress;
  total_price: number;
  order_groups: OrderGroup[];
  id: string;
  order_number?: string;
  created_at: string;
  updated_at: string;
}

interface ReviewProduct {
  id: string;
  name: string;
  image: string;
    price: number;
}

interface ReviewPopupProps {
  isOpen: boolean;
  onClose: () => void;
  product: ReviewProduct | null;
  onSubmit: (rating: number, comment: string) => void;
}

const ReviewPopup = ({ isOpen, onClose, product, onSubmit }: ReviewPopupProps) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hoverRating, setHoverRating] = useState(0);

  if (!isOpen || !product) return null;

  const handleSubmit = () => {
    onSubmit(rating, comment);
    setRating(0);
    setComment('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Ürün Değerlendirmesi</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex items-center space-x-4 mb-4">
          <div className="relative w-20 h-20">
            {product.image ? (
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-contain rounded-lg"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-lg">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>
          <div>
            <h4 className="font-medium">{product.name}</h4>
            <p className="text-sm text-gray-500">{product.price} TL</p>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Puanınız</label>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="focus:outline-none"
              >
                {star <= (hoverRating || rating) ? (
                  <StarIconSolid className="w-8 h-8 text-yellow-400" />
                ) : (
                  <StarIcon className="w-8 h-8 text-yellow-400" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
            Yorumunuz
          </label>
          <textarea
            id="comment"
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Ürün hakkında düşüncelerinizi paylaşın..."
          />
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            İptal
          </button>
          <button
            onClick={handleSubmit}
            disabled={rating === 0}
            className="px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Değerlendir
          </button>
        </div>
      </div>
    </div>
  );
};

interface OrdersProps {
  onMenuClick?: () => void;
}

const Orders = ({ onMenuClick }: OrdersProps) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ReviewProduct | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showReviewPopup, setShowReviewPopup] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(5);

  // Dinamik filtre sayıları
  const [filterCounts, setFilterCounts] = useState({
    all: 0,
    ongoing: 0,
    returns: 0,
    cancelled: 0
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Oturum açmanız gerekiyor');
      return;
    }
    fetchOrders();
  }, [router]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Oturum açmanız gerekiyor');
        return;
      }

      const apiUrl = `${API_V1_URL}/customer/orders`;
      

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          setError('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
          return;
        }
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      
              if (data.meta?.status === 'success' && Array.isArray(data.data)) {
          // Siparişleri tarih sırasına göre sırala (en yeni en üstte)
          const sortedOrders = data.data.sort((a: Order, b: Order) => {
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          });
        
        setOrders(sortedOrders);
        
        // Tüm siparişleri göster (TR filtresi kaldırıldı)
        const allOrders = sortedOrders;
        
        // Filtre sayılarını hesapla (tüm siparişler için)
        const counts = {
          all: allOrders.length,
          ongoing: allOrders.filter((order: Order) => {
            const firstGroupStatus = order.order_groups[0]?.status || order.status;
            return firstGroupStatus === 'pending' || firstGroupStatus === 'searchingDriver' || firstGroupStatus === 'in_progress' || firstGroupStatus === 'shipping' || firstGroupStatus === 'pickedUp' || firstGroupStatus === 'picked_up';
          }).length,
          returns: allOrders.filter((order: Order) => {
            const firstGroupStatus = order.order_groups[0]?.status || order.status;
            return firstGroupStatus === 'return_requested' || firstGroupStatus === 'return_pending' || firstGroupStatus === 'returned';
          }).length,
          cancelled: allOrders.filter((order: Order) => {
            const firstGroupStatus = order.order_groups[0]?.status || order.status;
            return firstGroupStatus === 'canceled' || firstGroupStatus === 'shipmentCanceled';
          }).length
        };
        
        setFilterCounts(counts);
      } else {
        setError('Siparişler yüklenirken bir hata oluştu');
      }
    } catch (error) {
      setError('Siparişler yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('tr-TR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const getStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'pending': 'Beklemede',
      'searchingDriver': 'Beklemede',
      'in_progress': 'Kargoya Hazırlanıyor',
      'shipping': 'Kargoya Verildi',
      'delivered': 'Teslim Edildi',
      'canceled': 'İptal Edildi',
      'shipmentCanceled': 'İptal Edildi',
      'return_requested': 'İade Talep Edildi',
      'return_pending': 'İade Bekleniyor',
      'returned': 'İade Ulaştı'
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colorMap: { [key: string]: string } = {
      'pending': 'bg-orange-100 text-orange-800',
      'searchingDriver': 'bg-orange-100 text-orange-800',
      'in_progress': 'bg-blue-100 text-blue-800',
      'shipping': 'bg-purple-100 text-purple-800',
      'delivered': 'bg-green-100 text-green-800',
      'canceled': 'bg-red-100 text-red-800',
      'shipmentCanceled': 'bg-red-100 text-red-800',
      'return_requested': 'bg-yellow-100 text-yellow-800',
      'return_pending': 'bg-indigo-100 text-indigo-800',
      'returned': 'bg-gray-100 text-gray-800'
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800';
  };

  const getDeliveryStatus = (status: string) => {
    switch (status) {
      case 'delivered':
        return {
          icon: (
            <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          ),
          bgColor: 'bg-green-500',
          textColor: 'text-green-600',
          text: 'Teslim Edildi',
          description: 'ürün teslim edildi'
        };
      case 'pending':
        return {
          icon: (
            <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
          ),
          bgColor: 'bg-orange-500',
          textColor: 'text-orange-600',
          text: 'Beklemede',
          description: 'ürün beklemede'
        };
      case 'searchingDriver':
        return {
          icon: (
            <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
          ),
          bgColor: 'bg-orange-500',
          textColor: 'text-orange-600',
          text: 'Bekliyor',
          description: 'ürün bekliyor'
        };
      case 'in_progress':
        return {
          icon: (
            <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
          ),
          bgColor: 'bg-blue-500',
          textColor: 'text-blue-600',
          text: 'Kargoya Hazırlanıyor',
          description: 'ürün kargoya hazırlanıyor'
        };
      case 'shipping':
        return {
          icon: (
            <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          ),
          bgColor: 'bg-purple-500',
          textColor: 'text-purple-600',
          text: 'Kargoya Verildi',
          description: 'ürün kargoya verildi'
        };
      case 'pickedUp':
      case 'picked_up':
        return {
          icon: (
            <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          ),
          bgColor: 'bg-blue-500',
          textColor: 'text-blue-600',
          text: 'Kargoda',
          description: 'ürün kargoda'
        };
      case 'canceled':
        return {
          icon: (
            <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          ),
          bgColor: 'bg-red-500',
          textColor: 'text-red-600',
          text: 'İptal Edildi',
          description: 'sipariş iptal edildi'
        };
      case 'shipmentCanceled':
        return {
          icon: (
            <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          ),
          bgColor: 'bg-red-500',
          textColor: 'text-red-600',
          text: 'İptal Edildi',
          description: 'sipariş iptal edildi'
        };
      case 'return_requested':
        return {
          icon: (
            <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          ),
          bgColor: 'bg-yellow-500',
          textColor: 'text-yellow-600',
          text: 'İade Talep Edildi',
          description: 'iade talebi oluşturuldu'
        };
      case 'return_pending':
        return {
          icon: (
            <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
          ),
          bgColor: 'bg-indigo-500',
          textColor: 'text-indigo-600',
          text: 'İade Bekleniyor',
          description: 'iade bekleniyor'
        };
      case 'returned':
        return {
          icon: (
            <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          ),
          bgColor: 'bg-gray-500',
          textColor: 'text-gray-600',
          text: 'İade Ulaştı',
          description: 'iade ulaştı'
        };
      default:
        return {
          icon: (
            <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
          ),
          bgColor: 'bg-gray-500',
          textColor: 'text-gray-600',
          text: 'Bilinmeyen Durum',
          description: 'durum bilinmiyor'
        };
    }
  };

  // Filtrelenmiş siparişleri getir
  const getFilteredOrders = () => {
    let filtered = orders;

    // Tüm siparişleri göster (TR filtresi kaldırıldı)

    // Aktif tab'a göre filtrele
    switch (activeTab) {
      case 'ongoing':
        filtered = filtered.filter((order: Order) => {
          const firstGroupStatus = order.order_groups[0]?.status || order.status;
          return firstGroupStatus === 'pending' || firstGroupStatus === 'searchingDriver' || firstGroupStatus === 'in_progress' || firstGroupStatus === 'shipping' || firstGroupStatus === 'pickedUp' || firstGroupStatus === 'picked_up';
        });
        break;
      case 'returns':
        filtered = filtered.filter((order: Order) => {
          const firstGroupStatus = order.order_groups[0]?.status || order.status;
          return firstGroupStatus === 'return_requested' || firstGroupStatus === 'return_pending' || firstGroupStatus === 'returned';
        });
        break;
      case 'cancelled':
        filtered = filtered.filter((order: Order) => {
          const firstGroupStatus = order.order_groups[0]?.status || order.status;
          return firstGroupStatus === 'canceled' || firstGroupStatus === 'shipmentCanceled';
        });
        break;
      default:
        // 'all' için filtreleme yapma
        break;
    }

    // Arama sorgusuna göre filtrele
    if (searchQuery.trim()) {
      filtered = filtered.filter(order => {
        const searchLower = searchQuery.toLowerCase();
        return order.order_groups.some(group =>
          group.order_group_items.some(item =>
            item.product.name.toLowerCase().includes(searchLower)
          )
        );
      });
    }

    return filtered;
  };

  const handleReviewSubmit = async (rating: number, comment: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token || !selectedProduct) return;

      const response = await fetch(`${API_V1_URL}/customer/reviews`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product_id: selectedProduct.id,
          rating,
          comment,
        }),
      });

      if (!response.ok) {
        throw new Error('Değerlendirme gönderilemedi');
      }

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      // Handle error silently
    }
  };

  const openReviewModal = (product: ReviewProduct) => {
    setSelectedProduct(product);
    setShowReviewModal(true);
  };


  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => router.push('/giris')}
            className="bg-orange-500 text-white px-6 py-2.5 rounded-lg font-medium text-sm hover:bg-orange-600 transition-colors"
          >
            Giriş Yap
          </button>
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
              <h1 className="text-xl font-semibold text-gray-900">Tüm Siparişlerim</h1>
            </div>
          
          {/* Desktop Arama ve Filtre */}
          <div className="flex gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Ürün ismi veya Marka ara"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-[300px] px-4 py-2.5 border rounded-lg focus:outline-none focus:border-orange-500 text-gray-900 text-sm placeholder:text-gray-500"
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2 hover:text-orange-500 transition-colors">
                <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2.5 border rounded-lg focus:outline-none focus:border-orange-500 text-sm text-gray-900 cursor-pointer hover:border-gray-300 transition-colors"
            >
              <option value="all">Tüm Siparişler</option>
              <option value="lastMonth">Son 1 Ay</option>
              <option value="last3Months">Son 3 Ay</option>
              <option value="last6Months">Son 6 Ay</option>
            </select>
          </div>
        </div>

        {/* Mobile Header */}
        <div className="sm:hidden space-y-3">
          <div className="flex items-center justify-between">
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
              <h1 className="text-base font-semibold text-gray-900">Tüm Siparişlerim</h1>
            </div>
          </div>
          
          {/* Mobile Arama ve Filtre - Tek satırda */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Sipariş ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-orange-500 text-gray-900 text-sm placeholder:text-gray-500"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 hover:text-orange-500 transition-colors">
                <MagnifyingGlassIcon className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border rounded-lg focus:outline-none focus:border-orange-500 text-sm text-gray-900 cursor-pointer hover:border-gray-300 transition-colors min-w-[120px]"
            >
              <option value="all">Tümü</option>
              <option value="lastMonth">1 Ay</option>
              <option value="last3Months">3 Ay</option>
              <option value="last6Months">6 Ay</option>
            </select>
          </div>
        </div>
      </div>

      {/* Sekmeler */}
      <div className="mb-4 sm:mb-6">
        <OrdersTabs 
          activeTab={activeTab}
          onTabChange={setActiveTab}
          filterCounts={filterCounts}
        />
      </div>

      {/* Siparişler Listesi */}
      {orders.length > 0 ? (
        <>
          <div className="space-y-4">
            {getFilteredOrders().slice((currentPage - 1) * ordersPerPage, currentPage * ordersPerPage).map((order) => (
            <div 
              key={order.id} 
              className="bg-white rounded-lg border"
            >
              {/* Gri Başlık Alanı */}
              <div className="bg-gray-100 rounded-t-lg px-4 py-3">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="grid grid-cols-2 lg:flex lg:items-center gap-4 lg:gap-6">
                    <div>
                      <p className="text-xs text-gray-600 mb-0.5">Sipariş No</p>
                      <p className="text-xs font-medium text-gray-900">
                        {order.order_groups?.[0]?.ogid ? `${order.order_groups[0].ogid}` : (order.order_groups?.[0]?.order_number ? `${order.order_groups[0].order_number}` : `#${order.order_groups?.[0]?.order_id?.slice(-6) || order.id.slice(-6)}`)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-0.5">Sipariş tarihi</p>
                      <p className="text-xs font-medium text-gray-900">
                        {new Date(order.created_at).toLocaleDateString('tr-TR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-0.5">Sipariş özeti</p>
                      <p className="text-xs font-medium text-gray-900">
                        {order.order_groups.length} Teslimat, {order.order_groups.reduce((total, group) => total + group.order_group_items.length, 0)} Ürün
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-0.5">Alıcı</p>
                      <p className="text-xs font-medium text-gray-900">
                        {order.address.firstname} {order.address.lastname}
                    </p>
                  </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-0.5">Toplam</p>
                      <p className="text-xs font-semibold text-orange-600">
                      {formatPrice(order.total_price)} TL
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      router.push(`/hesabim/siparislerim/${order.id}`);
                    }}
                    className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors w-full lg:w-auto"
                  >
                    Detaylar
                  </button>
                </div>
              </div>

              {/* Sipariş İçeriği */}
              <div className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      {(() => {
                        // Sipariş gruplarından ilk grubun status'unu kullan
                        const firstGroupStatus = order.order_groups[0]?.status || order.status;

                        const statusInfo = getDeliveryStatus(firstGroupStatus);
                        return (
                          <>
                            <div className={`w-5 h-5 ${statusInfo.bgColor} rounded-full flex items-center justify-center`}>
                              {statusInfo.icon}
                            </div>
                            <span className={`text-sm font-medium ${statusInfo.textColor}`}>
                              {statusInfo.text}
                            </span>
                          </>
                        );
                      })()}
                    </div>
                    <p className="text-sm text-gray-600">
                      {order.order_groups.reduce((total, group) => total + group.order_group_items.length, 0)} {getDeliveryStatus(order.order_groups[0]?.status || order.status).description}
                    </p>
                  </div>
                  
                  {/* Ürün Görselleri */}
                  <div className="flex gap-2 flex-wrap">
                    {order.order_groups.map((group) => 
                      group.order_group_items.map((item) => (
                        <Link 
                          key={item.id} 
                          href={createProductUrl(item.product.slug)}
                          className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 hover:opacity-80 transition-opacity"
                        >
                            {(() => {
                              const imageUrl = Array.isArray(item.product.medias) 
                                ? item.product.medias[0]?.url 
                                : item.product.medias?.url;
                              return imageUrl && imageUrl.trim() !== '' ? (
                                <Image
                                  src={imageUrl}
                                  alt={item.product.name}
                                  fill
                                  className="object-contain"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                </div>
                              );
                            })()}
                          </Link>
                      ))
                    )}
                  </div>
              </div>
              </div>
            </div>
          ))}
          </div>
          
          {/* Sayfalama */}
          {getFilteredOrders().length > ordersPerPage && (
            <div className="flex justify-center items-center mt-6 space-x-1 sm:space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-2 sm:px-3 py-1 text-xs border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Önceki
              </button>
              
              {/* Mobilde sadece mevcut sayfa ve yanındaki sayfaları göster */}
              <div className="flex space-x-1 sm:space-x-2">
                {Array.from({ length: Math.ceil(getFilteredOrders().length / ordersPerPage) }, (_, i) => i + 1)
                  .filter((page) => {
                    // Mobilde sadece mevcut sayfa ve yanındaki 1'er sayfa göster
                    if (window.innerWidth < 640) {
                      return Math.abs(page - currentPage) <= 1;
                    }
                    return true;
                  })
                  .map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-2 sm:px-3 py-1 text-xs rounded-lg ${
                        currentPage === page
                          ? 'bg-orange-500 text-white'
                          : 'border hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
              </div>
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(getFilteredOrders().length / ordersPerPage)))}
                disabled={currentPage === Math.ceil(getFilteredOrders().length / ordersPerPage)}
                className="px-2 sm:px-3 py-1 text-xs border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Sonraki
              </button>
            </div>
          )}
        </>
      ) : (
      <div className="bg-white rounded-lg p-8 text-center">
        <div className="max-w-sm mx-auto">
          <div className="bg-gray-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <ShoppingBagIcon className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Henüz siparişiniz bulunmuyor
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            Binlerce ürün arasından beğendiklerinizi sepetinize ekleyip alışverişe başlayabilirsiniz.
          </p>
          <button 
              onClick={() => router.push('/')}
            className="bg-orange-500 text-white px-6 py-2.5 rounded-lg font-medium text-sm hover:bg-orange-600 transition-colors"
          >
            Alışverişe Başla
          </button>
        </div>
      </div>
      )}


      {/* Başarılı Değerlendirme Popup'ı */}
      {showSuccess && (
        <SuccessNotification
          message="Değerlendirmeniz başarıyla kaydedildi. Teşekkür ederiz!"
          onClose={() => setShowSuccess(false)}
        />
      )}

      {/* Değerlendirme Modal'ı */}
      {selectedProduct && (
        <ProductReviewModal
          isOpen={showReviewModal}
          onClose={() => {
            setShowReviewModal(false);
            setSelectedProduct(null);
          }}
          productName={selectedProduct.name}
          productImage={selectedProduct.image}
          onSubmit={handleReviewSubmit}
        />
      )}

      <ReviewPopup
        isOpen={showReviewPopup}
        onClose={() => {
          setShowReviewPopup(false);
          setSelectedProduct(null);
        }}
        product={selectedProduct}
        onSubmit={handleReviewSubmit}
      />
    </div>
  );
};

export default Orders;
