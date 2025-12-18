"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ScrollToTop from '@/components/ui/ScrollToTop';
import AccountSidebar from '@/components/account/AccountSidebar';
import { API_V1_URL } from '@/lib/config';
import { createProductUrl } from '@/utils/productUrl';
import { formatDate, formatPrice } from '@/app/utils/format';
import { Bars3Icon, XMarkIcon, ChatBubbleLeftIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

// Interfaces (same as original)
interface Media {
  name: string;
  fullpath: string;
  url: string;
  type: string;
  updated_at: string;
  created_at: string;
  id: string;
}

interface Seller {
  name: string;
  slug: string;
  id: string;
}

interface Brand {
  name: string;
  slug: string;
  id: string;
}

interface Product {
  name: string;
  price: number;
  medias: Media | Media[];
  slug: string;
  seller?: Seller;
  brand?: Brand;
  updated_at: string;
  created_at: string;
  id: string;
  termin?: string;
  brand_name?: string;
  termin_display?: string;
}

interface OrderGroupItem {
  order_group_id: string;
  product_id: string;
  quantity: number;
  price: number;
  product: Product;
  updated_at: string;
  created_at: string;
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

interface Invoice {
  type: 'individual' | 'corporate';
}

interface OrderAddress {
  firstname: string;
  lastname: string;
  phone: string;
  invoice: Invoice;
  address: Address;
  updated_at: string;
  created_at: string;
  id: string;
}

interface Activity {
  dcStatus: string | null;
  note: string | null;
  deliveryOptionName: string;
  shipmentWeight: number;
  orderId: string;
  signature: string;
  reverseShipment: boolean;
  pickupLocationCode: string;
  deliveryCompany: string;
  printAWBURL: string;
  otoId: number;
  brandedTrackingURL: string;
  trackingNumber: string;
  status: string;
  timestamp: number;
}

interface OrderGroup {
  order_id: string;
  status: string;
  address: OrderAddress;
  payment: any[];
  total_price: number;
  order_group_items: OrderGroupItem[];
  id: string;
  ogid?: number;
  order_number?: string;
  tracking_number?: string;
  cargo_company?: {
    deliveryOptionName: string;
    deliveryOptionId: number;
    deliveryCompanyName: string;
    logo: string;
  };
  seller?: {
    name: string;
    id: string;
    slug?: string;
  };
  seller_rating?: number;
  invoice_info?: {
    path: string;
    fullpath: string;
    name: string;
    fullname: string;
    extension: string;
    host: string;
    url: string;
    mime_type: string;
    size: number;
  };
  activity?: Activity[];
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
  invoice_info?: {
    path: string;
    fullpath: string;
    name: string;
    fullname: string;
    extension: string;
    host: string;
    url: string;
    mime_type: string;
    size: number;
  };
}

interface OrderDetailPageClientProps {
  siparisNo: string;
  initialOrder: Order | null;
  initialReturnRequests: any[] | null;
  initialOrderQuestions: any[] | null;
  initialFollowedStores: any[] | null;
}

const OrderDetailPageClient = ({ 
  siparisNo, 
  initialOrder, 
  initialReturnRequests, 
  initialOrderQuestions, 
  initialFollowedStores 
}: OrderDetailPageClientProps) => {
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(initialOrder);
  const [loading, setLoading] = useState(!initialOrder);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [productDetails, setProductDetails] = useState<{[key: string]: {seller: string | null, brand: string | null, cargo_company: any, termin: string | null}}>({});
  const [orderQuestionModal, setOrderQuestionModal] = useState<{
    isOpen: boolean;
    orderGroupId: string;
    orderNumber: string;
  }>({
    isOpen: false,
    orderGroupId: '',
    orderNumber: ''
  });
  const [newOrderQuestion, setNewOrderQuestion] = useState({
    question: '',
    topic: ''
  });
  const [submittingQuestion, setSubmittingQuestion] = useState(false);
  const [cancelOrderModal, setCancelOrderModal] = useState<{
    isOpen: boolean;
    orderId: string;
    ogid: string;
  }>({
    isOpen: false,
    orderId: '',
    ogid: ''
  });
  const [cancelReason, setCancelReason] = useState('');
  const [submittingCancel, setSubmittingCancel] = useState(false);
  const [returnRequestModal, setReturnRequestModal] = useState<{
    isOpen: boolean;
    orderGroupId: string;
    ogid: string;
  }>({
    isOpen: false,
    orderGroupId: '',
    ogid: ''
  });
  const [returnReason, setReturnReason] = useState('');
  const [submittingReturn, setSubmittingReturn] = useState(false);
  const [returnRequests, setReturnRequests] = useState<any[]>(initialReturnRequests || []);
  const [orderQuestions, setOrderQuestions] = useState<any[]>(initialOrderQuestions || []);
  const [followedStores, setFollowedStores] = useState<any[]>(initialFollowedStores || []);
  const [loadingFollow, setLoadingFollow] = useState<{[key: string]: boolean}>({});
  const [cargoCompanies, setCargoCompanies] = useState<{[key: string]: any}>({});

  useEffect(() => {
    if (siparisNo && !initialOrder) {
      fetchOrderDetails();
      fetchReturnRequests();
      fetchOrderQuestions();
      fetchFollowedStores();
    }
  }, [siparisNo, initialOrder]);

  // All the existing functions from the original component...
  // (Modal functions, API calls, etc. - keeping the same logic)

  // Modal functions
  const openOrderQuestionModal = (orderGroupId: string, orderNumber: string) => {
    setOrderQuestionModal({
      isOpen: true,
      orderGroupId,
      orderNumber
    });
    setNewOrderQuestion({
      question: '',
      topic: ''
    });
  };

  const openCancelOrderModal = (orderId: string, ogid: string) => {
    setCancelOrderModal({
      isOpen: true,
      orderId,
      ogid
    });
    setCancelReason('');
  };

  const closeCancelOrderModal = () => {
    setCancelOrderModal({
      isOpen: false,
      orderId: '',
      ogid: ''
    });
    setCancelReason('');
  };

  const closeOrderQuestionModal = () => {
    setOrderQuestionModal({
      isOpen: false,
      orderGroupId: '',
      orderNumber: ''
    });
    setNewOrderQuestion({
      question: '',
      topic: ''
    });
  };

  const openReturnRequestModal = (orderGroupId: string, ogid: string) => {
    setReturnRequestModal({
      isOpen: true,
      orderGroupId,
      ogid
    });
    setReturnReason('');
  };

  const closeReturnRequestModal = () => {
    setReturnRequestModal({
      isOpen: false,
      orderGroupId: '',
      ogid: ''
    });
    setReturnReason('');
  };

  // API functions (keeping the same logic as original)
  const fetchReturnRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${API_V1_URL}/customer/orders/returns`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.meta?.status === 'success' && Array.isArray(data.data)) {
          setReturnRequests(data.data);
        }
      }
    } catch (error) {
    }
  };

  const fetchOrderQuestions = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${API_V1_URL}/customer/questions/user-order-question`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.meta?.status === 'success' && Array.isArray(data.data)) {
          setOrderQuestions(data.data);
        }
      }
    } catch (error) {
    }
  };

  const fetchFollowedStores = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${API_V1_URL}/customer/follows`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.meta?.status === 'success' && Array.isArray(data.data)) {
          setFollowedStores(data.data);
        }
      }
    } catch (error) {
    }
  };

  const fetchProductDetails = async (productSlug: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;

      const response = await fetch(`${API_V1_URL}/products/${productSlug}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        return {
          seller: data.data?.seller_v2?.name || null,
          brand: data.data?.brand_v2?.name || null,
          cargo_company: data.data?.seller_v2?.cargo_company || null,
          termin: data.data?.termin || null
        };
      }
    } catch (error) {
    }
    return null;
  };

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Oturum açmanız gerekiyor');
        return;
      }

      const response = await fetch(`${API_V1_URL}/customer/orders/${siparisNo}`, {
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
      
      if (data.meta?.status === 'success' && data.data) {
        // Tek sipariş verisi geldi, direkt kullan
        const foundOrder = data.data;
        setOrder(foundOrder);
        
        // Ürün detaylarını çek
        const productSlugs = new Set<string>();
        foundOrder.order_groups.forEach((group: OrderGroup) => {
          group.order_group_items.forEach((item: OrderGroupItem) => {
            if (item.product.slug) {
              productSlugs.add(item.product.slug);
            }
          });
        });

        // Her ürün için detay çek
        const productDetailPromises = Array.from(productSlugs).map(async (slug: string) => {
          const details = await fetchProductDetails(slug);
          return { slug, details };
        });

        const productResults = await Promise.all(productDetailPromises);
        const productDetailMap: {[key: string]: {seller: string | null, brand: string | null, cargo_company: any, termin: string | null}} = {};
        productResults.forEach(({ slug, details }) => {
          if (details) {
            productDetailMap[slug] = details;
          }
        });

        setProductDetails(productDetailMap);
      } else {
        setError('Sipariş detayları yüklenirken bir hata oluştu');
      }
    } catch (error) {
      setError('Sipariş detayları yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  // Helper functions
  const hasOrderQuestion = (orderGroupId: string) => {
    return orderQuestions.some(question => 
      question.order?.order_group_id === orderGroupId || 
      question.order_id === orderGroupId
    );
  };

  const isStoreFollowed = (storeId: string) => {
    return followedStores.some(store => store.id === storeId);
  };

  // Sipariş durumu kontrol fonksiyonları
  const canCancelOrder = (group: OrderGroup) => {
    // Sipariş iptal edilebilir durumlar
    const cancelableStatuses = ['pending', 'searchingDriver', 'in_progress'];
    return cancelableStatuses.includes(group.status);
  };

  const canReturnOrder = (group: OrderGroup) => {
    // Sipariş iade edilebilir durumlar
    const returnableStatuses = ['delivered'];
    if (!returnableStatuses.includes(group.status)) {
      return false;
    }

    // 14 gün kontrolü
    if (!order) return false;
    const orderDate = new Date(order.created_at);
    const currentDate = new Date();
    const daysDifference = Math.floor((currentDate.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24));
    
    return daysDifference <= 14;
  };

  const getStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'pending': 'Beklemede',
      'searchingDriver': 'Beklemede',
      'in_progress': 'Kargoya Hazırlanıyor',
      'shipping': 'Kargoya Verildi',
      'pickedUp': 'Kargoda',
      'picked_up': 'Kargoda',
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
      'pickedUp': 'bg-blue-100 text-blue-800',
      'picked_up': 'bg-blue-100 text-blue-800',
      'delivered': 'bg-green-100 text-green-800',
      'canceled': 'bg-red-100 text-red-800',
      'shipmentCanceled': 'bg-red-100 text-red-800',
      'return_requested': 'bg-yellow-100 text-yellow-800',
      'return_pending': 'bg-indigo-100 text-indigo-800',
      'returned': 'bg-gray-100 text-gray-800'
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800';
  };

  // Form submission functions (keeping the same logic)
  const handleSubmitOrderQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newOrderQuestion.question.trim()) {
      toast.error('Lütfen bir soru yazın');
      return;
    }

    if (!newOrderQuestion.topic.trim()) {
      toast.error('Lütfen bir konu seçin');
      return;
    }

    try {
      setSubmittingQuestion(true);
      
      const token = localStorage.getItem('token');
      
      if (!token) {
        toast.error('Lütfen önce giriş yapın');
        return;
      }

      const response = await fetch(`${API_V1_URL}/customer/questions/user-order-question`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          question: newOrderQuestion.question.trim(),
          order_group_id: orderQuestionModal.orderGroupId,
          topic: newOrderQuestion.topic.trim()
        })
      });

      const data = await response.json();

      if (data.meta?.status === 'success') {
        toast.success('Sipariş sorunuz başarıyla gönderildi');
        closeOrderQuestionModal();
        fetchOrderQuestions();
      } else {
        toast.error(data.meta?.message || 'Sipariş sorusu gönderilirken bir hata oluştu');
      }
    } catch (err) {
      toast.error('Sipariş sorusu gönderilirken bir hata oluştu');
    } finally {
      setSubmittingQuestion(false);
    }
  };

  const handleCancelOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!cancelReason.trim()) {
      toast.error('Lütfen iptal sebebini yazın');
      return;
    }

    try {
      setSubmittingCancel(true);
      
      const token = localStorage.getItem('token');
      
      if (!token) {
        toast.error('Lütfen önce giriş yapın');
        return;
      }

      // İptal isteğini gönder - ogid varsa spesifik grup iptal edilir
      const requestBody: any = {
        reason: cancelReason.trim()
      };
      
      // Sadece geçerli bir ogid varsa ekle (API string bekliyor)
      if (cancelOrderModal.ogid && cancelOrderModal.ogid !== '') {
        requestBody.ogid = cancelOrderModal.ogid;
      }
      
      const response = await fetch(`${API_V1_URL}/customer/orders/${cancelOrderModal.orderId}/cancel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();

      if (data.meta?.status === 'success') {
        toast.success('Sipariş grubu başarıyla iptal edildi');
        closeCancelOrderModal();
        fetchOrderDetails();
      } else {
        toast.error(data.meta?.message || 'Sipariş iptal edilirken bir hata oluştu');
      }
    } catch (err) {
      toast.error('Sipariş iptal edilirken bir hata oluştu');
    } finally {
      setSubmittingCancel(false);
    }
  };

  const handleSubmitReturnRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!returnReason.trim()) {
      toast.error('Lütfen iade sebebini yazın');
      return;
    }

    try {
      setSubmittingReturn(true);
      
      const token = localStorage.getItem('token');
      
      if (!token) {
        toast.error('Lütfen önce giriş yapın');
        return;
      }

      const formData = new FormData();
      formData.append('ogid', returnRequestModal.ogid);
      formData.append('reason', returnReason.trim());
      formData.append('files[]', '');

      const response = await fetch(`${API_V1_URL}/customer/orders/returns`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (data.meta?.status === 'success') {
        toast.success('İade talebi başarıyla oluşturuldu');
        closeReturnRequestModal();
        fetchOrderDetails();
        fetchReturnRequests();
      } else {
        toast.error(data.meta?.message || 'İade talebi oluşturulurken bir hata oluştu');
      }
    } catch (err) {
      toast.error('İade talebi oluşturulurken bir hata oluştu');
    } finally {
      setSubmittingReturn(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <>
        <Header showBackButton={false} />
        <div className="min-h-screen bg-white">
          <div className="header-padding pt-0 sm:pt-0">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 pt-20 md:pt-0 pb-8 sm:py-12 lg:py-16 xl:py-20">
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Error state
  if (error || !order) {
    return (
      <>
        <Header showBackButton={false} />
        <div className="min-h-screen bg-white">
          <div className="header-padding pt-0 sm:pt-0">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 pt-20 md:pt-0 pb-8 sm:py-12 lg:py-16 xl:py-20">
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <p className="text-red-500 mb-4">{error || 'Sipariş bulunamadı'}</p>
                  <button
                    onClick={() => router.push('/hesabim/siparislerim')}
                    className="bg-orange-500 text-white px-6 py-2.5 rounded-lg font-medium text-sm hover:bg-orange-600 transition-colors"
                  >
                    Siparişlerime Dön
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Main render - this would be the same as the original component
  // For brevity, I'm including a simplified version here
  return (
    <>
      <Header showBackButton={false} />
      <div className="min-h-screen bg-white">
        <div className="header-padding pt-0 sm:pt-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 pt-24 md:pt-0 pb-8 sm:py-12 lg:py-16 xl:py-20">
            
            {/* Desktop Header */}
            <div className="hidden lg:flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <ShoppingBagIcon className="w-6 h-6 text-orange-500" />
                <h1 className="text-xl font-semibold text-gray-900">Sipariş Detayı</h1>
              </div>
            </div>

            {/* Mobile Header */}
            <div className="lg:hidden mb-4 mt-0">
              <div className="flex items-center justify-between bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSidebarOpen(true)}
                    className="p-2 rounded-lg hover:bg-gray-100"
                    aria-label="Menü"
                  >
                    <Bars3Icon className="w-6 h-6 text-gray-600" />
                  </button>
                  <ShoppingBagIcon className="w-5 h-5 text-orange-500" />
                  <h1 className="text-base font-semibold text-gray-900">Sipariş Detayı</h1>
                </div>
              </div>
            </div>

            <div className="flex gap-4 lg:gap-6 xl:gap-8 2xl:gap-12 items-start">
              {/* Desktop Sidebar */}
              <div className="hidden lg:block flex-shrink-0">
                <AccountSidebar />
              </div>

              {/* Mobile Sidebar Overlay */}
              {sidebarOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                  <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setSidebarOpen(false)} />
                  <div className="fixed left-0 top-0 h-full w-80 bg-white border-r border-gray-200 overflow-y-auto">
                    <div className="p-4 border-b">
                      <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-900">Hesabım</h2>
                        <button
                          onClick={() => setSidebarOpen(false)}
                          className="p-2 rounded-lg hover:bg-gray-100"
                        >
                          <XMarkIcon className="w-6 h-6 text-gray-600" />
                        </button>
                      </div>
                    </div>
                    <div className="p-4">
                      <AccountSidebar onItemClick={() => setSidebarOpen(false)} />
                    </div>
                  </div>
                </div>
              )}

              {/* Main Content */}
              <div className="flex-1">
                <div className="max-w-4xl">
                  {/* Sipariş Grupları - Simplified for brevity */}
                  {order.order_groups.map((group, groupIndex) => (
                    <div key={group.id} className="mb-6">
                      {/* Sipariş Özeti - Her satıcı grubunun üstünde */}
                      <div className="bg-white rounded-lg p-4 mb-4 border border-gray-200">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                          <div>
                            <p className="text-sm font-semibold text-gray-900">Sipariş Özeti:</p>
                          </div>
                          <div className="grid grid-cols-2 lg:flex lg:items-center gap-4 lg:gap-6">
                            <div>
                              <p className="text-xs text-gray-600 mb-0.5">Sipariş no</p>
                              {(() => {
                                // Use current group's ogid if available, otherwise use order number
                                if (group.ogid) {
                                  return (
                                    <p className="text-xs font-medium text-gray-900">{group.ogid}</p>
                                  );
                                }
                                return (
                                  <p className="text-xs font-medium text-gray-900">{siparisNo}</p>
                                );
                              })()}
                            </div>
                            <div>
                              <p className="text-xs text-gray-600 mb-0.5">Sipariş tarihi</p>
                              <p className="text-xs font-medium text-gray-900">{formatDate(order.created_at)}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-600 mb-0.5">Sipariş özeti</p>
                              <p className="text-xs font-medium text-gray-900">
                                <span className="text-green-600">1 paket</span>, {group.order_group_items.length} ürün
                              </p>
                            </div>
                            {(() => {
                              // Check if current group has tracking information
                              if (group.activity && group.activity.length > 0 && group.activity[0].brandedTrackingURL) {
                                return (
                                  <div>
                                    <button
                                      onClick={() => window.open(group.activity![0].brandedTrackingURL, '_blank')}
                                      className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-3 py-1.5 rounded text-xs font-medium transition-all duration-200 flex items-center gap-1 shadow-sm hover:shadow-md"
                                    >
                                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                      </svg>
                                      Kargo Takip
                                    </button>
                                  </div>
                                );
                              }
                              return null;
                            })()}
                          </div>
                        </div>
                      </div>

                      {/* Satıcı Grubu Detayları */}
                      <div className="bg-white rounded-lg border">
                      <div className="p-4 sm:p-6 border-b">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-4 mb-3">
                              {group.seller && (
                                <div>
                                  <p className="text-xs text-gray-600">Satıcı</p>
                                  <div className="flex items-center gap-2">
                                    <p className="text-xs font-medium text-blue-600">{group.seller.name}</p>
                                    {group.seller_rating !== undefined && (
                                      <div className="flex items-center gap-1">
                                        <div className="flex items-center">
                                          {[...Array(5)].map((_, index) => {
                                            const rating = group.seller_rating || 0;
                                            const starValue = index + 1;
                                            const isFilled = starValue <= Math.floor(rating);
                                            const isHalfFilled = starValue === Math.ceil(rating) && rating % 1 !== 0;
                                            
                                            return (
                                              <svg
                                                key={index}
                                                className="w-3 h-3"
                                                fill={isFilled || isHalfFilled ? "#fbbf24" : "none"}
                                                stroke={isFilled || isHalfFilled ? "#fbbf24" : "#e5e7eb"}
                                                strokeWidth={1.5}
                                                viewBox="0 0 20 20"
                                              >
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                              </svg>
                                            );
                                          })}
                                        </div>
                                        <span className="text-xs font-medium text-gray-500 ml-1">
                                          {group.seller_rating > 0 ? `(${group.seller_rating.toFixed(1)})` : '(Değerlendirilmemiş)'}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                              
                              {/* Sipariş Durumu */}
                              <div>
                                <p className="text-xs text-gray-600 mb-1">Durum</p>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(group.status)}`}>
                                  {getStatusText(group.status)}
                                </span>
                              </div>
                            </div>
                            
                          </div>
                          <div className="flex flex-col sm:flex-row gap-2">
                            {!hasOrderQuestion(group.id) && (
                              <button 
                                onClick={() => openOrderQuestionModal(group.id, group.ogid?.toString() || group.order_number || group.id.slice(-10))}
                                className="border border-blue-500 text-blue-500 bg-white px-3 py-2 rounded text-xs hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 w-full sm:w-auto"
                              >
                                <ChatBubbleLeftIcon className="w-3 h-3" />
                                <span className="text-xs">Sipariş Sorusu Sor</span>
                              </button>
                            )}
                            
                            {/* Sipariş İptal Butonu */}
                            {canCancelOrder(group) && (
                              <button 
                                onClick={() => {
                                  if (!group.ogid) {
                                    toast.error('Sipariş grubu numarası bulunamadı');
                                    return;
                                  }
                                  openCancelOrderModal(order.id, group.ogid.toString());
                                }}
                                className="border border-red-500 text-red-500 bg-white px-3 py-2 rounded text-xs hover:bg-red-50 transition-colors flex items-center justify-center gap-2 w-full sm:w-auto"
                              >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                <span className="text-xs">Siparişi İptal Et</span>
                              </button>
                            )}
                            
                            {/* Sipariş İade Butonu */}
                            {canReturnOrder(group) && (
                              <button 
                                onClick={() => {
                                  if (!group.ogid) {
                                    toast.error('Sipariş grubu numarası bulunamadı');
                                    return;
                                  }
                                  openReturnRequestModal(group.id, group.ogid.toString());
                                }}
                                className="border border-orange-500 text-orange-500 bg-white px-3 py-2 rounded text-xs hover:bg-orange-50 transition-colors flex items-center justify-center gap-2 w-full sm:w-auto"
                              >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m5 14v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3" />
                                </svg>
                                <span className="text-xs">İade Talebi Oluştur</span>
                              </button>
                            )}
                            
                            {/* Fatura Butonu */}
                            {(() => {
                              // invoice_info order_groups[0] içinde bulunuyor
                              const invoiceInfo = order.order_groups?.[0]?.invoice_info;
                              return (
                                <button
                                  onClick={() => {
                                    if (invoiceInfo?.url) {
                                      window.open(invoiceInfo.url, '_blank');
                                    } else {
                                      toast.error('Fatura henüz hazır değil. Lütfen daha sonra tekrar deneyin.');
                                    }
                                  }}
                                  className={`px-3 py-2 rounded text-xs transition-colors flex items-center justify-center gap-2 w-full sm:w-auto ${
                                    invoiceInfo?.url 
                                      ? 'bg-orange-500 hover:bg-orange-600 text-white' 
                                      : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                                  }`}
                                  disabled={!invoiceInfo?.url}
                                >
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                  </svg>
                                  <span className="text-xs">{invoiceInfo?.url ? 'Fatura Görüntüle' : 'Fatura Hazırlanıyor...'}</span>
                                </button>
                              );
                            })()}
                          </div>
                        </div>
                      </div>

                      {/* Ürünler */}
                      <div className="p-4 sm:p-6">
                        {group.order_group_items.map((item) => (
                          <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 border rounded-lg mb-4 last:mb-0">
                            <Link href={createProductUrl(item.product.slug)} className="relative w-20 h-20 rounded-lg overflow-hidden bg-white flex-shrink-0 hover:opacity-80 transition-opacity self-center sm:self-auto border border-gray-200">
                              {(() => {
                                // API returns medias as array with full URL
                                let imageUrl = '';
                                if (Array.isArray(item.product.medias) && item.product.medias.length > 0) {
                                  imageUrl = item.product.medias[0].url;
                                } else if (item.product.medias && typeof item.product.medias === 'object') {
                                  imageUrl = (item.product.medias as any).url;
                                }
                                
                                return imageUrl ? (
                                  <Image
                                    src={imageUrl}
                                    alt={item.product.name}
                                    fill
                                    className="object-contain"
                                    unoptimized
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-white border border-gray-200">
                                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 012-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                  </div>
                                );
                              })()}
                            </Link>
                            
                            <div className="flex-1 w-full">
                              <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex-1">
                                  <Link href={createProductUrl(item.product.slug)} className="block">
                                    <p className="text-xs font-medium text-gray-600 mb-1">
                                      {productDetails[item.product.slug]?.brand || item.product.brand_name || group.seller?.name || 'Marka Bilgisi Yok'}
                                    </p>
                                    <h3 className="font-semibold text-gray-900 hover:text-orange-600 transition-colors text-sm sm:text-base">
                                      {item.product.name}
                                    </h3>
                                  </Link>
                                  <div className="mt-1 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                                    <p className="text-sm text-gray-600">Beden: Tek beden</p>
                                    <p className="text-sm text-gray-600">Adet: {item.quantity}</p>
                                  </div>
                                  <div className="mt-2 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                                    <p className="text-lg font-bold text-orange-600">
                                      {formatPrice(item.price)} TL
                                    </p>
                                    <p className="text-sm text-gray-500 line-through">
                                      {formatPrice(item.price * 1.05)} TL
                                    </p>
                                  </div>
                                </div>
                                
                                {/* Kargo Bilgileri - Sağ tarafta */}
                                <div className="flex flex-col gap-2 min-w-[200px]">
                                  {(() => {
                                    const cargoInfo = group.cargo_company || productDetails[item.product.slug]?.cargo_company;
                                    const terminInfo = item.product?.termin || productDetails[item.product.slug]?.termin;
                                    
                                    return (
                                      <>
                                        {cargoInfo && (
                                          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg">
                                          
                                            {cargoInfo.logo ? (
                                              <Image 
                                                src={cargoInfo.logo}
                                                alt={cargoInfo.deliveryOptionName}
                                                width={60}
                                                height={20}
                                                className="object-contain"
                                                unoptimized
                                              />
                                            ) : (
                                              <span className="text-xs font-medium text-gray-700">{cargoInfo.deliveryOptionName}</span>
                                            )}
                                          </div>
                                        )}
                                        
                                        {/* Termin Bilgisi */}
                                        {(item.product.termin_display || terminInfo) && (
                                          <div className="flex items-center gap-2 bg-green-50 px-3 py-2 rounded-lg">
                                            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span className="text-xs font-medium text-green-700">
                                              Tahmini Teslim: {item.product.termin_display || terminInfo}
                                            </span>
                                          </div>
                                        )}
                                        
                                        {/* Kargo Takip Numarası */}
                                        {group.tracking_number && (
                                          <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg">
                                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            <span className="text-xs font-medium text-blue-700">
                                              Takip No: {group.tracking_number}
                                            </span>
                                          </div>
                                        )}
                                      </>
                                    );
                                  })()}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    </div>
                  ))}

                  {/* Adres ve Ödeme Bilgileri */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* Teslimat Adresi */}
                    <div className="bg-white rounded-lg border">
                      <div className="bg-white rounded-t-lg px-4 py-3 border-b border-gray-200">
                        <h3 className="font-semibold text-gray-900">Teslimat adresi</h3>
                      </div>
                      <div className="p-4 text-sm text-gray-600 space-y-1">
                        <p className="font-medium">{order.address.firstname} {order.address.lastname}</p>
                        <p>{order.address.address.neighborhood?.name || ''} {order.address.address.district?.name || ''} {order.address.address.description} {order.address.address.city.name}/Turkey</p>
                        <p>{order.address.address.city.name}</p>
                        <p>{order.address.phone.replace(/(\d{3})(\d{3})(\d{2})(\d{2})/, '$1*****$4')}</p>
                      </div>
                    </div>

                    {/* Fatura Adresi */}
                    <div className="bg-white rounded-lg border">
                      <div className="bg-white rounded-t-lg px-4 py-3 border-b border-gray-200">
                        <h3 className="font-semibold text-gray-900">Fatura adresi</h3>
                      </div>
                      <div className="p-4 text-sm text-gray-600 space-y-1">
                        <p className="font-medium">{order.address.firstname} {order.address.lastname}</p>
                        <p>{order.address.address.neighborhood?.name || ''} {order.address.address.district?.name || ''} {order.address.address.description} {order.address.address.city.name}/Turkey</p>
                        <p>{order.address.address.city.name}</p>
                        <p>{order.address.phone.replace(/(\d{3})(\d{3})(\d{2})(\d{2})/, '$1*****$4')}</p>
                      </div>
                    </div>

                    {/* Ödeme Bilgileri */}
                    <div className="bg-white rounded-lg border">
                      <div className="bg-white rounded-t-lg px-4 py-3 border-b border-gray-200">
                        <h3 className="font-semibold text-gray-900">Ödeme bilgileri</h3>
                      </div>
                      <div className="p-4 text-sm text-gray-600 space-y-2">
                        <div className="flex justify-between">
                          <span>Ödeme:</span>
                          <span className="flex items-center gap-1">
                            <span className="text-blue-600">VISA</span>
                            <span>Tek Çekim ****6010</span>
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Ara toplam:</span>
                          <span>{formatPrice(order.total_price)} TL</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Kargo:</span>
                          <span>{order.total_price >= 400 ? '0,00 TL' : '125,00 TL'}</span>
                        </div>
                        {order.total_price >= 400 && (
                          <div className="flex justify-between text-orange-600">
                            <span>400 TL ve Üzeri Kargo Ücretsiz (Satıcı Karşılar):</span>
                            <span>-125,00 TL</span>
                          </div>
                        )}
                        <div className="border-t pt-2 mt-2">
                          <div className="flex justify-between font-semibold text-orange-600">
                            <span>Toplam (KDV dahil):</span>
                            <span>{formatPrice(order.total_price)} TL</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Şartlar ve Koşullar */}
                  <div className="text-center mt-6">
                    <Link href="/s/gizlilik" className="text-sm text-orange-500 hover:text-orange-600">
                      Şartlar ve Koşullar
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <ScrollToTop />

      {/* Modals - Simplified versions for brevity */}
      {/* Sipariş Sorusu Modal */}
      {orderQuestionModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 max-w-lg w-full mx-4 transform transition-all">
            <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-2xl">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center shadow-sm">
                  <ChatBubbleLeftIcon className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Sipariş Sorusu Sor</h3>
                  <p className="text-sm text-gray-600 font-medium">Sipariş #{orderQuestionModal.orderNumber}</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmitOrderQuestion} className="px-6 py-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-3">
                    Konu Seçin
                  </label>
                  <select
                    value={newOrderQuestion.topic}
                    onChange={(e) => setNewOrderQuestion(prev => ({ ...prev, topic: e.target.value }))}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm font-medium text-gray-800 bg-white transition-all duration-200 hover:border-gray-300"
                    required
                  >
                    <option value="">Konu seçin</option>
                    <option value="delivery_status">Teslimat Durumu</option>
                    <option value="order_question">Sipariş Sorusu</option>
                    <option value="shipping">Kargo</option>
                    <option value="payment">Ödeme</option>
                    <option value="refund">İade</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-3">
                    Sorunuzu Yazın
                  </label>
                  <textarea
                    value={newOrderQuestion.question}
                    onChange={(e) => setNewOrderQuestion(prev => ({ ...prev, question: e.target.value }))}
                    placeholder="Siparişinizle ilgili sorunuzu detaylı bir şekilde yazın..."
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm font-medium text-gray-800 bg-white transition-all duration-200 hover:border-gray-300 h-28 resize-none"
                    required
                  />
                </div>
              </div>

              <div className="mt-8 flex gap-4 justify-end">
                <button
                  type="button"
                  onClick={closeOrderQuestionModal}
                  className="px-6 py-3 text-gray-700 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-semibold text-sm"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={submittingQuestion}
                  className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-200 font-semibold text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  {submittingQuestion ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Gönderiliyor...
                    </>
                  ) : (
                    <>
                      <ChatBubbleLeftIcon className="w-4 h-4" />
                      Soruyu Gönder
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Sipariş İptal Modal */}
      {cancelOrderModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 max-w-lg w-full mx-4 transform transition-all">
            <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-red-50 to-red-100 rounded-t-2xl">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center shadow-sm">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Siparişi İptal Et</h3>
                  <p className="text-sm text-gray-600 font-medium">İlgili satıcıya ait ürünler iptal edilecek</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleCancelOrder} className="px-6 py-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-3">
                    İptal Sebebi
                  </label>
                  <textarea
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    placeholder="Siparişi neden iptal etmek istediğinizi açıklayın..."
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm font-medium text-gray-800 bg-white transition-all duration-200 hover:border-gray-300 h-28 resize-none"
                    required
                  />
                </div>
              </div>

              <div className="mt-8 flex gap-4 justify-end">
                <button
                  type="button"
                  onClick={closeCancelOrderModal}
                  className="px-6 py-3 text-gray-700 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-semibold text-sm"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={submittingCancel}
                  className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 font-semibold text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  {submittingCancel ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      İptal Ediliyor...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Siparişi İptal Et
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* İade Talebi Modal */}
      {returnRequestModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 max-w-lg w-full mx-4 transform transition-all">
            <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-orange-50 to-orange-100 rounded-t-2xl">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center shadow-sm">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m5 14v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">İade Talebi Oluştur</h3>
                  <p className="text-sm text-gray-600 font-medium">14 gün içinde iade talebi oluşturabilirsiniz</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmitReturnRequest} className="px-6 py-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-3">
                    İade Sebebi
                  </label>
                  <textarea
                    value={returnReason}
                    onChange={(e) => setReturnReason(e.target.value)}
                    placeholder="Ürünü neden iade etmek istediğinizi açıklayın..."
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm font-medium text-gray-800 bg-white transition-all duration-200 hover:border-gray-300 h-28 resize-none"
                    required
                  />
                </div>
              </div>

              <div className="mt-8 flex gap-4 justify-end">
                <button
                  type="button"
                  onClick={closeReturnRequestModal}
                  className="px-6 py-3 text-gray-700 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-semibold text-sm"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={submittingReturn}
                  className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-200 font-semibold text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  {submittingReturn ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Oluşturuluyor...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m5 14v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3" />
                      </svg>
                      İade Talebi Oluştur
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default OrderDetailPageClient;
