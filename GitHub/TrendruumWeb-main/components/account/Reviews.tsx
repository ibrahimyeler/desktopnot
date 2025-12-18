"use client";

import { useState, useEffect, useCallback } from 'react';
import { StarIcon, ChatBubbleLeftIcon, ArrowLeftIcon, Bars3Icon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { reviewService, Review } from '@/app/services/reviewService';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { API_V1_URL } from '@/lib/config';

interface ReviewItem {
  type: string;
  reference_id: string;
  user_id: string;
  seller_id: string;
  rating: string | null;
  comment: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  id: string;
  product?: {
    name: string;
    price: number;
    id: string;
    images?: Array<{
      url: string;
    }>;
  };
  seller?: {
    name: string;
    id: string;
    logo?: string;
  };
}

interface ReviewsProps {
  onMenuClick?: () => void;
}

const Reviews = ({ onMenuClick }: ReviewsProps) => {
  const router = useRouter();
  const [activeMainTab, setActiveMainTab] = useState<'product' | 'seller'>('product');
  const [activeSubTab, setActiveSubTab] = useState<'pending' | 'waiting' | 'approved' | 'rejected' | 'deleted'>('pending');
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [productImages, setProductImages] = useState<{[key: string]: string}>({});
  
  // Değerlendirme modal state'leri
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState<ReviewItem | null>(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Ürün resimlerini getir
  const fetchProductImages = async (productIds: string[]) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const imagePromises = productIds.map(async (productId) => {
        try {
          const response = await fetch(`${API_V1_URL}/products/${productId}`, {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            if (data.meta?.status === 'success' && data.data?.medias?.[0]?.url) {
              return { productId, imageUrl: data.data.medias[0].url };
            }
          }
        } catch (error) {
        }
        return null;
      });

      const results = await Promise.all(imagePromises);
      const imageMap: {[key: string]: string} = {};
      
      results.forEach(result => {
        if (result) {
          imageMap[result.productId] = result.imageUrl;
        }
      });

      setProductImages(prev => ({ ...prev, ...imageMap }));
    } catch (error) {
    }
  };

  // Değerlendirmeleri getir
  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Oturum bulunamadı');
      }

      // Alt sekmeye göre status parametresi belirle
      const statusMap = {
        pending: 'empty',     // Değerlendir -> empty (boş olanlar)
        waiting: 'pending',   // Bekleyen -> pending
        approved: 'approved', // Onaylanan -> approved
        rejected: 'rejected', // Reddedilen -> rejected
        deleted: 'deleted'    // Silinen -> deleted
      };

      const status = statusMap[activeSubTab];
      const apiUrl = `${API_V1_URL}/customer/reviews?type=${activeMainTab}&status=${status}`;
      

      const response = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
      });


      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.meta?.message || 'Değerlendirmeler yüklenemedi');
      }

      const data = await response.json();

      if (data.meta?.status === 'success') {
        setReviews(data.data);
        
        // Ürün resimlerini getir
        if (activeMainTab === 'product' && data.data.length > 0) {
          const productIds = data.data
            .map((review: any) => review.product?.id)
            .filter((id: string) => id);
          
          if (productIds.length > 0) {
            fetchProductImages(productIds);
          }
        }
      } else {
        throw new Error(data.meta?.message || 'Değerlendirmeler yüklenemedi');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Değerlendirmeler yüklenirken bir hata oluştu');
      toast.error(err instanceof Error ? err.message : 'Değerlendirmeler yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  }, [activeMainTab, activeSubTab]);

  // Değerlendirme gönder
  const submitReview = async () => {
    if (!selectedReview || rating === 0 || !comment.trim()) {
      toast.error('Lütfen yıldız sayısı ve yorum alanını doldurun');
      return;
    }

    try {
      setSubmitting(true);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Oturum bulunamadı');
      }

      const response = await fetch(`${API_V1_URL}/customer/reviews/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          rating: rating.toString(),
          comment: comment.trim(),
          review_id: selectedReview.id
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.meta?.message || 'Değerlendirme gönderilemedi');
      }

      const data = await response.json();
      if (data.meta?.status === 'success') {
        toast.success('Değerlendirmeniz başarıyla gönderildi!');
        setShowReviewModal(false);
        setSelectedReview(null);
        setRating(0);
        setComment('');
        await fetchReviews(); // Listeyi güncelle
      } else {
        throw new Error(data.meta?.message || 'Değerlendirme gönderilemedi');
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Değerlendirme gönderilirken bir hata oluştu');
    } finally {
      setSubmitting(false);
    }
  };

  // Değerlendirme sil
  const deleteReview = async (reviewId: string) => {
    try {
      await reviewService.deleteReview(reviewId);
      await fetchReviews();
      toast.success('Değerlendirmeniz başarıyla silindi');
    } catch (err) {
      toast.error('Değerlendirme silinirken bir hata oluştu');
    }
  };

  // Değerlendirme modal'ını aç
  const openReviewModal = (review: ReviewItem) => {
    setSelectedReview(review);
    setRating(0);
    setComment('');
    setShowReviewModal(true);
  };

  // Tab değiştiğinde soruları getir
  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="flex-1">
      {/* Üst Başlık */}
      <div className="mb-4 sm:mb-6 -mt-2 sm:mt-0">
        {/* Desktop Header */}
        <div className="hidden sm:flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <StarIcon className="w-6 h-6 text-orange-500" />
            <h1 className="text-xl font-semibold text-gray-900">Tüm Değerlendirmelerim</h1>
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
            <StarIcon className="w-5 h-5 text-orange-500" />
            <h1 className="text-base font-semibold text-gray-900">Tüm Değerlendirmelerim</h1>
          </div>
        </div>
      </div>

      {/* Ana Sekmeler */}
      <div className="mb-4 sm:mb-6">
        {/* Desktop Tabs */}
        <div className="hidden sm:flex gap-6 border-b">
          <button
            onClick={() => setActiveMainTab('product')}
            className={activeMainTab === 'product'
              ? 'pb-3 px-1 text-sm font-medium transition-colors relative text-orange-500 border-b-2 border-orange-500'
              : 'pb-3 px-1 text-sm font-medium transition-colors relative text-gray-900 hover:text-orange-500'}
          >
            Ürün Değerlendirmelerim
          </button>
          <button
            onClick={() => setActiveMainTab('seller')}
            className={activeMainTab === 'seller'
              ? 'pb-3 px-1 text-sm font-medium transition-colors relative flex items-center gap-2 text-orange-500 border-b-2 border-orange-500'
              : 'pb-3 px-1 text-sm font-medium transition-colors relative flex items-center gap-2 text-gray-900 hover:text-orange-500'}
          >
            Satıcı Değerlendirmelerim
            <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
              YENİ
            </span>
          </button>
        </div>

        {/* Mobile Tabs */}
        <div className="sm:hidden">
          <div className="flex gap-2 border-b overflow-x-auto scrollbar-hide pb-3">
            <button
              onClick={() => setActiveMainTab('product')}
              className={activeMainTab === 'product'
                ? 'pb-3 px-2 text-sm font-medium transition-colors relative text-orange-500 border-b-2 border-orange-500 whitespace-nowrap'
                : 'pb-3 px-2 text-sm font-medium transition-colors relative text-gray-900 hover:text-orange-500 whitespace-nowrap'}
            >
              Ürün
            </button>
            <button
              onClick={() => setActiveMainTab('seller')}
              className={activeMainTab === 'seller'
                ? 'pb-3 px-2 text-sm font-medium transition-colors relative flex items-center gap-1 text-orange-500 border-b-2 border-orange-500 whitespace-nowrap'
                : 'pb-3 px-2 text-sm font-medium transition-colors relative flex items-center gap-1 text-gray-900 hover:text-orange-500 whitespace-nowrap'}
            >
              Satıcı
              <span className="bg-red-500 text-white text-xs px-1 py-0.5 rounded-full">
                YENİ
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Alt Sekmeler */}
      <div className="mb-4 sm:mb-6">
        {/* Desktop Tabs */}
        <div className="hidden sm:flex gap-4">
          <button
            onClick={() => setActiveSubTab('pending')}
            className={activeSubTab === 'pending'
              ? 'px-4 py-2 rounded-full text-sm font-medium transition-colors bg-orange-50 text-orange-500'
              : 'px-4 py-2 rounded-full text-sm font-medium transition-colors text-gray-900 hover:bg-gray-50'}
          >
            Değerlendir
          </button>
          <button
            onClick={() => setActiveSubTab('waiting')}
            className={activeSubTab === 'waiting'
              ? 'px-4 py-2 rounded-full text-sm font-medium transition-colors bg-orange-50 text-orange-500'
              : 'px-4 py-2 rounded-full text-sm font-medium transition-colors text-gray-900 hover:bg-gray-50'}
          >
            Bekleyen
          </button>
          <button
            onClick={() => setActiveSubTab('approved')}
            className={activeSubTab === 'approved'
              ? 'px-4 py-2 rounded-full text-sm font-medium transition-colors bg-orange-50 text-orange-500'
              : 'px-4 py-2 rounded-full text-sm font-medium transition-colors text-gray-900 hover:bg-gray-50'}
          >
            Onaylanan
          </button>
          <button
            onClick={() => setActiveSubTab('rejected')}
            className={activeSubTab === 'rejected'
              ? 'px-4 py-2 rounded-full text-sm font-medium transition-colors bg-orange-50 text-orange-500'
              : 'px-4 py-2 rounded-full text-sm font-medium transition-colors text-gray-900 hover:bg-gray-50'}
          >
            Reddedilen
          </button>
          <button
            onClick={() => setActiveSubTab('deleted')}
            className={activeSubTab === 'deleted'
              ? 'px-4 py-2 rounded-full text-sm font-medium transition-colors bg-orange-50 text-orange-500'
              : 'px-4 py-2 rounded-full text-sm font-medium transition-colors text-gray-900 hover:bg-gray-50'}
          >
            Silinen
          </button>
        </div>

        {/* Mobile Scrollable Tabs */}
        <div className="sm:hidden">
          <div className="w-full max-w-full">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 px-1" 
                 style={{ 
                   scrollbarWidth: 'none', 
                   msOverflowStyle: 'none',
                   maxWidth: 'calc(100vw - 2rem)'
                 }}>
              <button
                onClick={() => setActiveSubTab('pending')}
                className={activeSubTab === 'pending'
                  ? 'px-3 py-2 rounded-full text-xs font-medium transition-colors bg-orange-50 text-orange-500 whitespace-nowrap flex-shrink-0'
                  : 'px-3 py-2 rounded-full text-xs font-medium transition-colors text-gray-900 hover:bg-gray-50 whitespace-nowrap flex-shrink-0'}
              >
                Değerlendir
              </button>
              <button
                onClick={() => setActiveSubTab('waiting')}
                className={activeSubTab === 'waiting'
                  ? 'px-3 py-2 rounded-full text-xs font-medium transition-colors bg-orange-50 text-orange-500 whitespace-nowrap flex-shrink-0'
                  : 'px-3 py-2 rounded-full text-xs font-medium transition-colors text-gray-900 hover:bg-gray-50 whitespace-nowrap flex-shrink-0'}
              >
                Bekleyen
              </button>
              <button
                onClick={() => setActiveSubTab('approved')}
                className={activeSubTab === 'approved'
                  ? 'px-3 py-2 rounded-full text-xs font-medium transition-colors bg-orange-50 text-orange-500 whitespace-nowrap flex-shrink-0'
                  : 'px-3 py-2 rounded-full text-xs font-medium transition-colors text-gray-900 hover:bg-gray-50 whitespace-nowrap flex-shrink-0'}
              >
                Onaylanan
              </button>
              <button
                onClick={() => setActiveSubTab('rejected')}
                className={activeSubTab === 'rejected'
                  ? 'px-3 py-2 rounded-full text-xs font-medium transition-colors bg-orange-50 text-orange-500 whitespace-nowrap flex-shrink-0'
                  : 'px-3 py-2 rounded-full text-xs font-medium transition-colors text-gray-900 hover:bg-gray-50 whitespace-nowrap flex-shrink-0'}
              >
                Reddedilen
              </button>
              <button
                onClick={() => setActiveSubTab('deleted')}
                className={activeSubTab === 'deleted'
                  ? 'px-3 py-2 rounded-full text-xs font-medium transition-colors bg-orange-50 text-orange-500 whitespace-nowrap flex-shrink-0'
                  : 'px-3 py-2 rounded-full text-xs font-medium transition-colors text-gray-900 hover:bg-gray-50 whitespace-nowrap flex-shrink-0'}
              >
                Silinen
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Değerlendirme Listesi veya Boş Durum */}
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </div>
      ) : error ? (
        <div className="text-red-500 text-center py-8">{error}</div>
      ) : reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map(review => (
            <div key={review.id} className="bg-white border border-orange-100 rounded-xl p-4 sm:p-6 hover:border-orange-200 transition-colors">
              {/* Ürün/Satıcı Bilgisi */}
              {activeMainTab === 'product' && review.product && (
                <div className="mb-4 pb-4 border-b border-gray-100">
                  <div className="flex items-start gap-3">
                    {/* Ürün Resmi */}
                    {productImages[review.product.id] ? (
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={productImages[review.product.id]}
                          alt={review.product.name}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-gray-400 text-xs">📦</span>
                      </div>
                    )}
                    
                    {/* Ürün Bilgileri */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 mb-1 line-clamp-2">{review.product.name}</h3>
                      <p className="text-sm text-gray-500">{review.product.price.toLocaleString('tr-TR')} TL</p>
                    </div>
                  </div>
                </div>
              )}

              {activeMainTab === 'seller' && review.seller && (
                <div className="mb-4 pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    {/* Satıcı Logosu */}
                    {review.seller.logo ? (
                      <div className="w-12 h-12 bg-gray-100 rounded-full overflow-hidden flex-shrink-0">
                        <Image
                          src={review.seller.logo}
                          alt={review.seller.name}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-600 font-semibold text-sm">
                          {review.seller.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    
                    {/* Satıcı Bilgileri */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 mb-1">{review.seller.name}</h3>
                    </div>
                  </div>
                </div>
              )}

              {/* Değerlendirme Durumuna Göre İçerik */}
              {activeSubTab === 'pending' && review.status === 'empty' ? (
                // Boş değerlendirme - Değerlendir butonu göster
                <div className="text-center py-4">
                  <div className="mb-4">
                    <StarIcon className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">Bu ürün için henüz değerlendirme yapmadınız</p>
                  </div>
                  <button
                    onClick={() => openReviewModal(review)}
                    className="bg-orange-500 text-white px-6 py-2 rounded-lg font-medium text-sm hover:bg-orange-600 transition-colors"
                  >
                    Değerlendir
                  </button>
                </div>
              ) : (
                // Mevcut değerlendirme - Normal görünüm
                <>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <StarIconSolid
                            key={i}
                            className={i < parseInt(review.rating || '0') ? 'w-4 h-4 sm:w-5 sm:h-5 text-orange-500' : 'w-4 h-4 sm:w-5 sm:h-5 text-gray-200'}
                          />
                        ))}
                      </div>
                      <span className="text-xs sm:text-sm text-gray-500">{formatDate(review.created_at)}</span>
                    </div>
                    <button
                      onClick={() => deleteReview(review.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  <p className="text-gray-700 mb-4 text-sm sm:text-base leading-relaxed">{review.comment}</p>
                </>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl p-6 sm:p-8 text-center border border-orange-100">
          <div className="max-w-sm mx-auto">
            <div className="bg-orange-50 rounded-full w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <ChatBubbleLeftIcon className="w-8 h-8 sm:w-10 sm:h-10 text-orange-400" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
              {activeMainTab === 'product' 
                ? 'Henüz ürün değerlendirmesi yapmamışsınız'
                : 'Henüz satıcı değerlendirmesi yapmamışsınız'
              }
            </h3>
            <p className="text-sm text-gray-500 mb-4 sm:mb-6 leading-relaxed">
              {activeMainTab === 'product'
                ? 'Satın aldığınız ürünler için değerlendirme yaparak diğer müşterilere yardımcı olabilirsiniz.'
                : 'Alışveriş yaptığınız satıcılar için değerlendirme yaparak diğer müşterilere yardımcı olabilirsiniz.'
              }
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

      {/* Değerlendirme Modal */}
      {showReviewModal && selectedReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {activeMainTab === 'product' ? 'Ürünü Değerlendirin' : 'Satıcıyı Değerlendirin'}
              </h3>
              {activeMainTab === 'product' && selectedReview.product && (
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <div className="flex items-center gap-3">
                    {selectedReview.product.images && selectedReview.product.images.length > 0 ? (
                      <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={selectedReview.product.images[0].url}
                          alt={selectedReview.product.name}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-gray-400 text-xs">📦</span>
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{selectedReview.product.name}</p>
                      <p className="text-gray-500 text-xs">{selectedReview.product.price.toLocaleString('tr-TR')} TL</p>
                    </div>
                  </div>
                </div>
              )}
              {activeMainTab === 'seller' && selectedReview.seller && (
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <div className="flex items-center gap-3">
                    {selectedReview.seller.logo ? (
                      <div className="w-12 h-12 bg-gray-100 rounded-full overflow-hidden flex-shrink-0">
                        <Image
                          src={selectedReview.seller.logo}
                          alt={selectedReview.seller.name}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-600 font-semibold text-sm">
                          {selectedReview.seller.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{selectedReview.seller.name}</p>
                      <p className="text-gray-500 text-xs">Satıcı</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Yıldız Seçimi */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Değerlendirmeniz (1-5 yıldız)
              </label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="focus:outline-none"
                  >
                    <StarIconSolid
                      className={`w-8 h-8 ${
                        star <= rating ? 'text-orange-500' : 'text-gray-200'
                      } hover:text-orange-400 transition-colors`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Yorum Alanı */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Yorumunuz
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Ürün hakkındaki düşüncelerinizi paylaşın..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
                rows={4}
              />
            </div>

            {/* Butonlar */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowReviewModal(false)}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                İptal
              </button>
              <button
                type="button"
                onClick={submitReview}
                disabled={submitting || rating === 0 || !comment.trim()}
                className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {submitting ? 'Gönderiliyor...' : 'Gönder'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reviews;
