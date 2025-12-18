"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import { ChatBubbleLeftIcon, TrashIcon, Bars3Icon, ArrowTopRightOnSquareIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { productQuestionService } from '@/app/services/productQuestionService';
import { API_V1_URL } from '@/lib/config';
import toast from 'react-hot-toast';
import Image from 'next/image';
import Link from 'next/link';

interface ProductQuestion {
  id: string;
  product_id: string;
  product_name: string;
  product_image: string;
  product_slug?: string;
  question: string;
  answer?: string;
  status: 'pending' | 'answered' | 'rejected';
  created_at: string;
  updated_at: string;
  topic?: string;
}

interface OrderQuestion {
  id: string;
  order_id: string;
  order_number: string;
  question: string;
  answer?: string;
  status: 'pending' | 'answered' | 'rejected';
  created_at: string;
  updated_at: string;
  topic?: string;
  product_name?: string;
  product_image?: string;
}

interface MessagesProps {
  onMenuClick?: () => void;
}

const Messages = ({ onMenuClick }: MessagesProps) => {
  const [activeTab, setActiveTab] = useState('product-questions'); // 'product-questions' | 'order-questions'
  const [questions, setQuestions] = useState<ProductQuestion[]>([]);
  const [orderQuestions, setOrderQuestions] = useState<OrderQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [orderQuestionsLoading, setOrderQuestionsLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    type: 'product' | 'order';
    id: string;
    title: string;
  }>({
    isOpen: false,
    type: 'product',
    id: '',
    title: ''
  });

  const [newQuestion, setNewQuestion] = useState({
    product_id: '',
    product_name: '',
    product_image: '',
    question: ''
  });

  const [newOrderQuestion, setNewOrderQuestion] = useState({
    order_group_id: '',
    order_number: '',
    question: '',
    topic: ''
  });

  // Ürün resmi yolu çıkarma fonksiyonu
  const getProductImage = (product: any): string => {
    if (!product) return '/placeholder-product.jpg';
    
    // Direkt medias.url varsa
    if (product.medias?.url) {
      return product.medias.url;
    }
    
    // medias array ise
    if (product.medias && Array.isArray(product.medias) && product.medias.length > 0) {
      return product.medias[0]?.url || '/placeholder-product.jpg';
    }
    
    // medias object ise (numbered keys)
    if (product.medias && typeof product.medias === 'object') {
      const mediaKeys = Object.keys(product.medias).filter(key => 
        /^\d+$/.test(key) && product.medias[key]?.url
      );
      if (mediaKeys.length > 0) {
        return product.medias[mediaKeys[0]].url;
      }
    }
    
    // image field varsa
    if (product.image) {
      return product.image;
    }
    
    return '/placeholder-product.jpg';
  };

  // Ürün sorularını getir
  const fetchQuestions = useCallback(async () => {
    try {
      setLoading(true);
      
      // Token'ı localStorage'dan al
      const token = localStorage.getItem('token');
      
      if (!token) {
        setQuestions([]);
        return;
      }

      // API'den soruları getir
      const response = await fetch(`${API_V1_URL}/customer/questions/user-product-question`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
   

      if (data.meta?.status === 'success' && data.data) {
        // API'den gelen veriyi dönüştür - sadece ürün sorularını al (order field'ı olmayan)
        const transformedQuestions = data.data
          .filter((item: any) => !item.order) // Sadece order field'ı olmayan veriler (ürün soruları)
          .map((item: any) => {
            return {
            id: item.id,
            product_id: item.product_id,
            product_name: item.product?.name || 'Ürün Adı',
            product_image: getProductImage(item.product),
            product_slug: item.product?.slug,
            question: item.question,
            answer: item.answer,
            status: item.answer ? 'answered' : 'pending',
            created_at: item.created_at,
            updated_at: item.updated_at
            };
          });

        setQuestions(transformedQuestions);
      } else {
        // API'den veri gelmezse mock data kullan
        setQuestions([
          {
            id: 'mock-product-1',
            product_id: 'mock-product-id-1',
            product_name: 'Örnek Ürün Soru',
            product_image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop',
            product_slug: 'ornek-urun-soru',
            question: 'Bu ürün kaliteli mi?',
            answer: 'Evet, bu ürün çok kaliteli ve müşterilerimiz tarafından beğeniliyor.',
            status: 'answered',
            created_at: '2025-10-20T10:00:00.000Z',
            updated_at: '2025-10-20T11:00:00.000Z'
          },
          {
            id: 'mock-product-2',
            product_id: 'mock-product-id-2',
            product_name: 'Test Ürün Sorusu',
            product_image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop',
            product_slug: 'test-urun-sorusu',
            question: 'Kargo ne kadar sürer?',
            answer: undefined,
            status: 'pending',
            created_at: '2025-10-21T14:30:00.000Z',
            updated_at: '2025-10-21T14:30:00.000Z'
          },
          {
            id: 'mock-product-3',
            product_id: 'mock-product-id-3',
            product_name: 'Unread Test Sorusu',
            product_image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop',
            product_slug: 'unread-test-sorusu',
            question: 'Bu ürün stokta var mı?',
            answer: undefined,
            status: 'pending',
            created_at: '2025-10-22T14:30:00.000Z',
            updated_at: '2025-10-22T14:30:00.000Z'
          }
        ]);
      }
    } catch (err) {
      toast.error('Sorular yüklenirken bir hata oluştu');
      // Hata durumunda da mock data kullan
      setQuestions([
        {
          id: 'mock-product-error-1',
          product_id: 'mock-product-id-error-1',
          product_name: 'Hata Test Ürünü',
          product_image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop',
          product_slug: 'hata-test-urunu',
          question: 'API hatası nedeniyle mock data gösteriliyor',
          answer: undefined,
          status: 'pending',
          created_at: '2025-10-22T10:00:00.000Z',
          updated_at: '2025-10-22T10:00:00.000Z'
        },
        {
          id: 'mock-product-error-2',
          product_id: 'mock-product-id-error-2',
          product_name: 'Unread Hata Test Ürünü',
          product_image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop',
          product_slug: 'unread-hata-test-urunu',
          question: 'Bu da unread test sorusu',
          answer: undefined,
          status: 'pending',
          created_at: '2025-10-23T10:00:00.000Z',
          updated_at: '2025-10-23T10:00:00.000Z'
        }
      ]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Sipariş sorularını getir
  const fetchOrderQuestions = useCallback(async () => {
    try {
      setOrderQuestionsLoading(true);
      
      // Token'ı localStorage'dan al
      const token = localStorage.getItem('token');
      
      if (!token) {
        setOrderQuestions([]);
        return;
      }

      // API'den sipariş sorularını getir
      const response = await fetch(`${API_V1_URL}/customer/questions/user-order-question`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
   

      if (data.meta?.status === 'success' && data.data) {
        // API'den gelen veriyi dönüştür - sadece sipariş sorularını al (order field'ı olan)
        // Eğer order field'ı olan veri yoksa, tüm veriyi sipariş sorusu olarak kabul et
        const orderQuestionsData = data.data.filter((item: any) => item.order).length > 0 
          ? data.data.filter((item: any) => item.order)
          : data.data; // Eğer order field'ı yoksa tüm veriyi kullan

        const transformedOrderQuestions = orderQuestionsData
          .map((item: any) => {
            // Ürün resmi için farklı yolları dene
            let productImage = '/placeholder-product.jpg';
            
            // Farklı veri yapıları için resim yolları
            if (item.product?.medias?.url) {
              productImage = item.product.medias.url;
            } else if (item.product?.medias?.[0]?.url) {
              productImage = item.product.medias[0].url;
            } else if (item.product?.image) {
              productImage = item.product.image;
            } else if (item.order?.product?.medias?.url) {
              productImage = item.order.product.medias.url;
            } else if (item.order?.product?.medias?.[0]?.url) {
              productImage = item.order.product.medias[0].url;
            } else if (item.order?.product?.image) {
              productImage = item.order.product.image;
            } else if (item.order?.products?.[0]?.medias?.url) {
              productImage = item.order.products[0].medias.url;
            } else if (item.order?.products?.[0]?.medias?.[0]?.url) {
              productImage = item.order.products[0].medias[0].url;
            } else if (item.order?.products?.[0]?.image) {
              productImage = item.order.products[0].image;
            }

            return {
              id: item.id,
              order_id: item.order?.order_group_id || item.order_id,
              order_number: item.order?.order_group_id?.slice(-6) || item.order_id?.slice(-6) || 'N/A',
              question: item.question,
              answer: item.answer,
              status: item.answer ? 'answered' : 'pending',
              created_at: item.created_at,
              updated_at: item.updated_at,
              topic: item.topic,
              product_name: item.product?.name || item.order?.product?.name || item.order?.products?.[0]?.name || 'Sipariş Ürünü',
              product_image: productImage
            };
          });

        setOrderQuestions(transformedOrderQuestions);
      } else {
        // API'den veri gelmezse mock data kullan - sipariş soruları için
        setOrderQuestions([
          {
            id: '689c42bc427477fbcc01c19a',
            order_id: '689c3c76204381bdf705f48f',
            order_number: 'f48f',
            question: 'Ürün kalitesi nasıl?',
            status: 'pending',
            created_at: '2025-08-13T07:46:04.938000Z',
            updated_at: '2025-08-13T07:46:04.938000Z',
            topic: 'product_comment_support',
            product_name: 'Örnek Ürün',
            product_image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop'
          },
          {
            id: '689c42bc427477fbcc01c19b',
            order_id: '689c3c76204381bdf705f48g',
            order_number: 'f48g',
            question: 'Kargo ne zaman gelir?',
            status: 'answered',
            answer: 'Siparişiniz yarın teslim edilecektir.',
            created_at: '2025-08-12T07:46:04.938000Z',
            updated_at: '2025-08-12T07:46:04.938000Z',
            topic: 'delivery_status',
            product_name: 'Test Ürünü',
            product_image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop'
          },
          {
            id: '689c42bc427477fbcc01c19c',
            order_id: '689c3c76204381bdf705f48h',
            order_number: 'f48h',
            question: 'Siparişimde sorun var',
            status: 'pending',
            created_at: '2025-08-14T07:46:04.938000Z',
            updated_at: '2025-08-14T07:46:04.938000Z',
            topic: 'order_question',
            product_name: 'Unread Test Ürünü',
            product_image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop'
          }
        ]);
      }
    } catch (err) {
      toast.error('Sipariş soruları yüklenirken bir hata oluştu');
      // Hata durumunda mock data kullan
      setOrderQuestions([
        {
          id: '689c42bc427477fbcc01c19a',
          order_id: '689c3c76204381bdf705f48f',
          order_number: 'f48f',
          question: 'Ürün kalitesi nasıl?',
          status: 'pending',
          created_at: '2025-08-13T07:46:04.938000Z',
          updated_at: '2025-08-13T07:46:04.938000Z',
          topic: 'product_comment_support',
          product_name: 'Örnek Ürün',
          product_image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop'
        },
        {
          id: '689c42bc427477fbcc01c19b',
          order_id: '689c3c76204381bdf705f48g',
          order_number: 'f48g',
          question: 'Teslimat sorunu var',
          status: 'pending',
          created_at: '2025-08-11T07:46:04.938000Z',
          updated_at: '2025-08-11T07:46:04.938000Z',
          topic: 'delivery_status',
          product_name: 'Hata Test Ürünü',
          product_image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop'
        },
        {
          id: '689c42bc427477fbcc01c19c',
          order_id: '689c3c76204381bdf705f48h',
          order_number: 'f48h',
          question: 'Unread hata test sorusu',
          status: 'pending',
          created_at: '2025-08-15T07:46:04.938000Z',
          updated_at: '2025-08-15T07:46:04.938000Z',
          topic: 'order_question',
          product_name: 'Unread Hata Test Ürünü',
          product_image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop'
        }
      ]);
    } finally {
      setOrderQuestionsLoading(false);
    }
  }, []);

  // Yeni sipariş sorusu ekle
  const handleSubmitOrderQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newOrderQuestion.question.trim()) {
      toast.error('Lütfen bir soru yazın');
      return;
    }

    if (!newOrderQuestion.order_group_id.trim()) {
      toast.error('Lütfen sipariş numarası girin');
      return;
    }

    if (!newOrderQuestion.topic.trim()) {
      toast.error('Lütfen bir konu seçin');
      return;
    }

    try {
      // Token'ı localStorage'dan al
      const token = localStorage.getItem('token');
      
      if (!token) {
        toast.error('Lütfen önce giriş yapın');
        return;
      }

      // API'ye sipariş sorusu gönder
      const response = await fetch(`${API_V1_URL}/customer/questions/user-order-question`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          question: newOrderQuestion.question.trim(),
          order_group_id: newOrderQuestion.order_group_id.trim(),
          topic: newOrderQuestion.topic.trim()
        })
      });

      const data = await response.json();

      if (data.meta?.status === 'success') {
        toast.success('Sipariş sorunuz başarıyla eklendi');
        setNewOrderQuestion({
          order_group_id: '',
          order_number: '',
          question: '',
          topic: ''
        });
        fetchOrderQuestions();
      } else {
        toast.error(data.meta?.message || 'Sipariş sorusu eklenirken bir hata oluştu');
      }
    } catch (err) {
      toast.error('Sipariş sorusu eklenirken bir hata oluştu');
    }
  };

  // Yeni soru ekle
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newQuestion.question.trim()) {
      toast.error('Lütfen bir soru yazın');
      return;
    }

    try {
      // Token'ı localStorage'dan al
      const token = localStorage.getItem('token');
      
      if (!token) {
        toast.error('Lütfen önce giriş yapın');
        return;
      }

      // API'ye soru gönder
      const response = await fetch(`${API_V1_URL}/customer/questions/user-product-question`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          question: newQuestion.question.trim(),
          product_id: newQuestion.product_id || '686e78ddd00eac51fe0d61db' // Gerçek product ID
        })
      });

      const data = await response.json();

      if (data.meta?.status === 'success') {
        toast.success('Sorunuz başarıyla eklendi');
        setNewQuestion({
          product_id: '',
          product_name: '',
          product_image: '',
          question: ''
        });
        fetchQuestions();
      } else {
        toast.error(data.meta?.message || 'Soru eklenirken bir hata oluştu');
      }
    } catch (err) {
      toast.error('Soru eklenirken bir hata oluştu');
    }
  };

  // Modal açma fonksiyonları
  const openDeleteModal = (type: 'product' | 'order', id: string, title: string) => {
    setDeleteModal({
      isOpen: true,
      type,
      id,
      title
    });
  };

  const closeDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      type: 'product',
      id: '',
      title: ''
    });
  };

  // Silme işlemini gerçekleştir
  const confirmDelete = async () => {
    const { type, id } = deleteModal;
    
    try {
      // Token'ı localStorage'dan al
      const token = localStorage.getItem('token');
      
      if (!token) {
        toast.error('Lütfen önce giriş yapın');
        closeDeleteModal();
        return;
      }

      const endpoint = type === 'product' 
        ? `${API_V1_URL}/customer/questions/user-product-question/${id}`
        : `${API_V1_URL}/customer/questions/user-order-question/${id}`;

      // API'ye silme isteği gönder
      const response = await fetch(endpoint, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.meta?.status === 'success') {
        toast.success('Sorunuz başarıyla silindi');
        if (type === 'product') {
          fetchQuestions();
        } else {
          fetchOrderQuestions();
        }
      } else {
        toast.error(data.meta?.message || 'Soru silinirken bir hata oluştu');
      }
    } catch (err) {
      toast.error('Soru silinirken bir hata oluştu');
    } finally {
      closeDeleteModal();
    }
  };

  // Sayfa ilk yüklendiğinde her iki tab'ın verilerini de yükle
  useEffect(() => {
    fetchQuestions();
    fetchOrderQuestions();
  }, [fetchQuestions, fetchOrderQuestions]);

  // Tab değiştiğinde loading state'ini sıfırla
  useEffect(() => {
    if (activeTab === 'product-questions') {
      setOrderQuestionsLoading(false);
    } else if (activeTab === 'order-questions') {
      setLoading(false);
    }
  }, [activeTab]);

  const unreadProductCount = useMemo(() => {
    const pendingQuestions = questions.filter(question => question.status === 'pending');
    const unansweredQuestions = questions.filter(question => !question.answer);
    const unreadQuestions = questions.filter(question => question.status === 'pending' || !question.answer);
    
  
    return unreadQuestions.length;
  }, [questions]);

  const unreadOrderCount = useMemo(() => {
    const pendingQuestions = orderQuestions.filter(question => question.status === 'pending');
    const unansweredQuestions = orderQuestions.filter(question => !question.answer);
    const unreadQuestions = orderQuestions.filter(question => question.status === 'pending' || !question.answer);
    
  
    return unreadQuestions.length;
  }, [orderQuestions]);

  return (
    <div className="flex-1">
      {/* Üst Başlık */}
      <div className="mb-4 sm:mb-6">
        {/* Desktop Header */}
        <div className="hidden sm:flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <ChatBubbleLeftIcon className="w-6 h-6 text-orange-500" />
            <h1 className="text-xl font-semibold text-gray-900">Satıcı Mesajlarım</h1>
          </div>
        </div>

        {/* Mobile Header */}
        <div className="sm:hidden flex items-center justify-between mb-4">
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
            <ChatBubbleLeftIcon className="w-5 h-5 text-orange-500" />
            <h1 className="text-base font-semibold text-gray-900">Satıcı Mesajlarım</h1>
          </div>
        </div>
      </div>

      {/* Sekmeler */}
      <div className="mb-4 sm:mb-6">
        {/* Desktop Tabs */}
        <div className="hidden sm:flex gap-6 border-b justify-center">
          <button
            onClick={() => setActiveTab('product-questions')}
            className={`pb-3 px-1 text-base font-medium transition-colors relative
              ${activeTab === 'product-questions' 
                ? 'text-orange-500 border-b-2 border-orange-500' 
                : 'text-gray-900 hover:text-orange-500'}`}
          >
            <div className="flex items-center gap-2">
              Ürün Sorularım
              <span className="text-xs text-gray-500">
                ({unreadProductCount} Okunmamış Soru)
              </span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('order-questions')}
            className={`pb-3 px-1 text-base font-medium transition-colors relative
              ${activeTab === 'order-questions' 
                ? 'text-orange-500 border-b-2 border-orange-500' 
                : 'text-gray-900 hover:text-orange-500'}`}
          >
            <div className="flex items-center gap-2">
              Sipariş Sorularım
              <span className="text-xs text-gray-500">
                ({unreadOrderCount} Okunmamış Mesaj)
              </span>
            </div>
          </button>
        </div>

        {/* Mobile Scrollable Tabs */}
        <div className="sm:hidden">
          <div className="w-full max-w-full">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 px-1 justify-center" 
                 style={{ 
                   scrollbarWidth: 'none', 
                   msOverflowStyle: 'none',
                   maxWidth: 'calc(100vw - 2rem)'
                 }}>
              <button
                onClick={() => setActiveTab('product-questions')}
                className={`pb-3 px-2 text-sm font-medium transition-colors relative whitespace-nowrap flex-shrink-0
                  ${activeTab === 'product-questions' 
                    ? 'text-orange-500 border-b-2 border-orange-500' 
                    : 'text-gray-900 hover:text-orange-500'}`}
              >
                <div className="flex flex-col items-center gap-1">
                  <span>Ürün Sorularım</span>
                  <span className="text-xs text-gray-500">
                    ({unreadProductCount} Okunmamış)
                  </span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('order-questions')}
                className={`pb-3 px-2 text-sm font-medium transition-colors relative whitespace-nowrap flex-shrink-0
                  ${activeTab === 'order-questions' 
                    ? 'text-orange-500 border-b-2 border-orange-500' 
                    : 'text-gray-900 hover:text-orange-500'}`}
              >
                <div className="flex flex-col items-center gap-1">
                  <span>Sipariş Sorularım</span>
                  <span className="text-xs text-gray-500">
                    ({unreadOrderCount} Okunmamış)
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* İçerik */}
      {activeTab === 'product-questions' && (
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
          {loading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          ) : questions.length > 0 ? (
            <>
              {/* Sorular Listesi */}
              <div className="space-y-4">
                {questions.map((question) => (
                  <div key={question.id} className="bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 hover:border-gray-200 transition-all duration-200 hover:shadow-sm">
                    <div className="p-4 sm:p-6">
                      <div className="flex items-start justify-between mb-4 gap-3">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          {question.product_image && question.product_image !== '/placeholder-product.jpg' ? (
                            <div className="relative w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0 rounded-lg overflow-hidden shadow-sm">
                              <Image
                                src={question.product_image}
                                alt={question.product_name}
                                fill
                                className="object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  const container = target.closest('.relative') as HTMLElement;
                                  if (container) {
                                    container.style.display = 'none';
                                  }
                                }}
                              />
                            </div>
                          ) : null}
                          <div className="flex-1 min-w-0">
                            <Link 
                              href={question.product_slug ? `/urunler/${question.product_slug}` : `/urunler/${question.product_id}`}
                              className="group flex items-center gap-2 hover:text-orange-600 transition-colors"
                            >
                              <h3 className="font-semibold text-gray-900 text-sm sm:text-base line-clamp-2 group-hover:text-orange-600 transition-colors">
                                {question.product_name}
                              </h3>
                              <ArrowTopRightOnSquareIcon className="w-4 h-4 text-gray-400 group-hover:text-orange-500 transition-colors flex-shrink-0" />
                            </Link>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(question.created_at).toLocaleDateString('tr-TR', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => openDeleteModal('product', question.id, question.product_name)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="bg-white rounded-lg p-4 border border-gray-100">
                        <p className="text-gray-700 text-sm sm:text-base leading-relaxed">{question.question}</p>
                      </div>
                      
                      {question.answer && (
                        <div className="mt-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                            <p className="text-xs font-medium text-orange-700">Satıcı Yanıtı</p>
                          </div>
                          <p className="text-gray-700 text-sm sm:text-base leading-relaxed">{question.answer}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="bg-white rounded-lg p-6 sm:p-8 text-center">
              <div className="max-w-sm mx-auto">
                <div className="bg-gray-50 rounded-full w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <ChatBubbleLeftIcon className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                  Henüz sorunuz bulunmuyor
                </h3>
                <p className="text-sm text-gray-500 mb-4 sm:mb-6 leading-relaxed">
                  Satıcılarla iletişime geçmek için ürün sayfalarını ziyaret edebilirsiniz.
                </p>
                <button 
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      window.location.href = '/';
                    }
                  }}
                  className="bg-orange-500 text-white px-6 py-2.5 rounded-lg font-medium text-sm hover:bg-orange-600 transition-colors"
                >
                  Alışverişe Başla
                </button>
              </div>
            </div>
          )}
        </div>
      )}


      {activeTab === 'order-questions' && (
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
          {orderQuestionsLoading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          ) : orderQuestions.length > 0 ? (
            <div className="space-y-4">
              {orderQuestions.map((question) => (
                <div key={question.id} className="bg-gradient-to-r from-blue-50 to-white rounded-xl border border-blue-100 hover:border-blue-200 transition-all duration-200 hover:shadow-sm">
                  <div className="p-4 sm:p-6">
                    <div className="flex items-start justify-between mb-4 gap-3">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        {question.product_image && question.product_image !== '/placeholder-product.jpg' ? (
                          <div className="relative w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0 rounded-lg overflow-hidden shadow-sm">
                            <Image
                              src={question.product_image}
                              alt={question.product_name || 'Sipariş Ürünü'}
                              fill
                              className="object-cover"
                              unoptimized={question.product_image.includes('unsplash.com')}
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                const imgContainer = target.closest('.relative') as HTMLElement;
                                if (imgContainer) {
                                  imgContainer.style.display = 'none';
                                }
                              }}
                            />
                          </div>
                        ) : null}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 text-sm sm:text-base line-clamp-2">{question.product_name || 'Sipariş Ürünü'}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full font-medium">
                              Sipariş #{question.order_number}
                            </span>
                            {question.topic && (
                              <span className="inline-block px-2 py-1 text-xs bg-orange-50 text-orange-700 rounded-full border border-orange-200">
                                {question.topic === 'invoice_request' ? 'Fatura Talebi' :
                                 question.topic === 'delivery_status' ? 'Teslimat Durumu' :
                                 question.topic === 'personalized_product' ? 'Kişiselleştirilmiş Ürün' :
                                 question.topic === 'order_cancellation' ? 'Sipariş İptali' :
                                 question.topic === 'missing_product' ? 'Eksik Ürün' :
                                 question.topic === 'damaged_product_request' ? 'Kusurlu Ürün' :
                                 question.topic === 'wrong_product_request' ? 'Yanlış Ürün' :
                                 question.topic === 'warranty_request' ? 'Garanti Talebi' :
                                 question.topic === 'gift_box_request' ? 'Hediye Paketi' :
                                 question.topic === 'setup_request' ? 'Kurulum Belgesi' :
                                 question.topic === 'corporate_invoice_request' ? 'Kurumsal Fatura' :
                                 question.topic === 'order_question' ? 'Sipariş Sorusu' :
                                 question.topic === 'shipping' ? 'Kargo' :
                                 question.topic === 'payment' ? 'Ödeme' :
                                 question.topic === 'refund' ? 'İade' :
                                 'Diğer'}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mt-2">
                            {new Date(question.created_at).toLocaleDateString('tr-TR', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => openDeleteModal('order', question.id, question.product_name || 'Sipariş Sorusu')}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="bg-white rounded-lg p-4 border border-gray-100">
                      <p className="text-gray-700 text-sm sm:text-base leading-relaxed">{question.question}</p>
                    </div>
                    
                    {question.answer && (
                      <div className="mt-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                          <p className="text-xs font-medium text-orange-700">Satıcı Yanıtı</p>
                        </div>
                        <p className="text-gray-700 text-sm sm:text-base leading-relaxed">{question.answer}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg p-6 sm:p-8 text-center">
              <div className="max-w-sm mx-auto">
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-full w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <ChatBubbleLeftIcon className="w-8 h-8 sm:w-10 sm:h-10 text-orange-400" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                  Henüz sipariş sorunuz bulunmuyor
                </h3>
                <p className="text-sm text-gray-500 mb-4 sm:mb-6 leading-relaxed">
                  Siparişlerinizle ilgili sorularınız burada görüntülenecektir.
                </p>
                <button 
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      window.location.href = '/hesabim/siparislerim';
                    }
                  }}
                  className="bg-orange-500 text-white px-6 py-2.5 rounded-lg font-medium text-sm hover:bg-orange-600 transition-colors"
                >
                  Siparişlerimi Görüntüle
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Silme Onay Modalı */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl border-2 border-gray-300 max-w-md w-full mx-4 transform transition-all">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <TrashIcon className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Soruyu Sil</h3>
                  <p className="text-sm text-gray-500">Bu işlem geri alınamaz</p>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="px-6 py-4">
              <p className="text-gray-700 leading-relaxed">
                <span className="font-medium text-gray-900">"{deleteModal.title}"</span> ile ilgili sorunuzu silmek istediğinizden emin misiniz?
              </p>
              <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <p className="text-sm text-orange-800">
                  <strong>Uyarı:</strong> Bu soru ve varsa cevabı kalıcı olarak silinecektir.
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-gray-50 rounded-b-xl flex gap-3 justify-end">
              <button
                onClick={closeDeleteModal}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                İptal
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center gap-2"
              >
                <TrashIcon className="w-4 h-4" />
                Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;
