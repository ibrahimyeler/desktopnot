"use client";

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { StarIcon, ChevronDownIcon } from '@heroicons/react/24/solid';
import { EyeIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import BuyerReviews from './BuyerReviews';
import { API_V1_URL } from '@/lib/config';
import toast from 'react-hot-toast';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface Review {
  id: string;
  userName: string;
  date: string;
  dateISO?: string; // Sıralama için ISO string
  rating: number;
  comment: string;
  images?: string[];
  likes: number;
  dislikes: number;
}

interface ApiReview {
  id: string;
  type: string;
  reference_id: string;
  user_id: string | null;
  seller_id: string;
  rating: string;
  comment: string;
  status: string;
  created_at: string;
  updated_at: string;
  product: {
    name: string;
    price: number;
    id: string;
  };
  user?: {
    _id: string | null;
    name: string;
    lastname: string;
    email: string | null;
  };
  user_name?: string;
  name?: string;
  lastname?: string;
  ai_yorum?: boolean;
  likes?: number;
  dislikes?: number;
}

interface CustomerReviewsProps {
  productId?: string;
  productSlug?: string;
  rating?: number;
  totalReviews?: number;
  satisfactionRate?: number;
  onRatingUpdate?: (rating: number, totalReviews: number) => void;
  productName?: string;
  productImage?: string;
  productPrice?: number;
}

// Ad soyad sansürleme fonksiyonu
const censorUserName = (userName: string): string => {
  if (!userName || userName.trim() === '') return 'K***';
  
  const nameParts = userName.trim().split(' ');
  if (nameParts.length === 1) {
    // Tek isim
    const name = nameParts[0];
    if (name.length <= 2) return 'K***';
    return name.charAt(0) + '*'.repeat(name.length - 1);
  } else {
    // Ad ve soyad
    const firstName = nameParts[0];
    const lastName = nameParts[nameParts.length - 1];
    
    const censoredFirstName = firstName.length <= 2 
      ? firstName.charAt(0) + '*'.repeat(Math.max(1, firstName.length - 1))
      : firstName.charAt(0) + '*'.repeat(firstName.length - 1);
    
    const censoredLastName = lastName.length <= 2
      ? lastName.charAt(0) + '*'.repeat(Math.max(1, lastName.length - 1))
      : lastName.charAt(0) + '*'.repeat(lastName.length - 1);
    
    return `${censoredFirstName} ${censoredLastName}`;
  }
};

const CustomerReviews = ({ productId, productSlug, rating = 0, totalReviews = 0, satisfactionRate = 0, onRatingUpdate, productName, productImage, productPrice }: CustomerReviewsProps) => {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const [sortBy, setSortBy] = useState('En güncel');
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [selectedRatingFilter, setSelectedRatingFilter] = useState<number | null>(null);
  
  // API state'leri
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actualTotalReviews, setActualTotalReviews] = useState(totalReviews);
  const [actualRating, setActualRating] = useState(rating);

  // Değerlendirme modal state'leri
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [userHasReviewed, setUserHasReviewed] = useState<boolean>(false); // Varsayılan: false (buton görünsün)
  const [checkingReview, setCheckingReview] = useState(false);
  const mobileReviewsScrollRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  
  // onRatingUpdate callback'ini ref ile sakla (dependency sorununu önlemek için)
  const onRatingUpdateRef = useRef(onRatingUpdate);
  useEffect(() => {
    onRatingUpdateRef.current = onRatingUpdate;
  }, [onRatingUpdate]);

  // iOS Safari için body scroll lock
  useEffect(() => {
    if (showReviewModal) {
      const scrollY = window.scrollY;
      const body = document.body;
      const html = document.documentElement;
      
      body.style.position = 'fixed';
      body.style.top = `-${scrollY}px`;
      body.style.width = '100%';
      body.style.overflow = 'hidden';
      body.style.touchAction = 'none';
      (body.style as any).webkitOverflowScrolling = 'none';
      
      html.style.overflow = 'hidden';
      html.style.height = '100%';

      return () => {
        body.style.position = '';
        body.style.top = '';
        body.style.width = '';
        body.style.overflow = '';
        body.style.touchAction = '';
        (body.style as any).webkitOverflowScrolling = '';
        
        html.style.overflow = '';
        html.style.height = '';
        
        window.scrollTo(0, scrollY);
      };
    }
  }, [showReviewModal]);

  // API'den yorumları getir
  const fetchReviews = useCallback(async () => {
    // productSlug veya productId olmalı
    if (!productSlug && !productId) {
      setError('Ürün bilgisi bulunamadı');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // API'den yorumları getir
      try {
        const controller = new AbortController();
        let timeoutId: NodeJS.Timeout | null = null;
        
        // Slug varsa slug endpoint'i kullan, yoksa ID endpoint'i kullan
        const endpoint = productId
          ? `${API_V1_URL}/products/${productId}/reviews`
          : `${API_V1_URL}/products/${productSlug}/reviews`;
        
        if (process.env.NODE_ENV === 'development') {
        }
        
        // Timeout mekanizması - 15 saniye
        timeoutId = setTimeout(() => {
          controller.abort();
          if (process.env.NODE_ENV === 'development') {
          }
        }, 15000);
        
        let response: Response;
        try {
          response = await fetch(endpoint, {
            signal: controller.signal
          });
          
          // Timeout'u temizle - başarılı response geldi
          if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutId = null;
          }
        } catch (fetchError: any) {
          // Timeout'u temizle
          if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutId = null;
          }
          
          // AbortError durumunda sessizce devam et (timeout veya kullanıcı iptali)
          if (fetchError.name === 'AbortError' || fetchError.message?.includes('aborted')) {
            if (process.env.NODE_ENV === 'development') {
            }
            // AbortError durumunda boş array set et ve sessizce devam et
            setReviews([]);
            setLoading(false);
            setError(null);
            return;
          }
          
          if (process.env.NODE_ENV === 'development') {
          }
          throw fetchError;
        }
        
        let dynamicReviews: Review[] = [];
        
        if (!response.ok) {
          // Response başarısız ise hata mesajını al
          let errorMessage = 'Yorumlar yüklenirken bir hata oluştu';
          try {
            const errorData = await response.json();
            errorMessage = errorData?.meta?.message || errorData?.message || errorMessage;
          } catch {
            errorMessage = `HTTP ${response.status}: ${response.statusText}`;
          }
          throw new Error(errorMessage);
        }

        let data: any;
        try {
          data = await response.json();
          if (process.env.NODE_ENV === 'development') {
            if (data.data && typeof data.data === 'object' && !Array.isArray(data.data)) {
              if (data.data.data) {
              }
            }
          }
        } catch (jsonError) {
          if (process.env.NODE_ENV === 'development') {
          }
          throw new Error('API yanıtı geçersiz JSON formatında');
        }
        
        // API response formatını kontrol et ve uygun şekilde parse et
        let reviewsData: ApiReview[] = [];
          
          if (data.meta?.status === 'success' && data.data) {
          // Farklı response formatlarını destekle
          if (Array.isArray(data.data.data)) {
            // Format: { meta: {...}, data: { data: [...], pagination: {...} } }
            reviewsData = data.data.data;
            if (process.env.NODE_ENV === 'development') {
            }
          } else if (Array.isArray(data.data)) {
            // Format: { meta: {...}, data: [...] }
            reviewsData = data.data;
            if (process.env.NODE_ENV === 'development') {
            }
          } else if (data.data.data && Array.isArray(data.data.data)) {
            // Format: { meta: {...}, data: { data: [...] } } - nested data
            reviewsData = data.data.data;
            if (process.env.NODE_ENV === 'development') {
            }
          } else if (Array.isArray(data.data.reviews)) {
            // Format: { meta: {...}, data: { reviews: [...] } }
            reviewsData = data.data.reviews;
            if (process.env.NODE_ENV === 'development') {
            }
          } else if (data.data && typeof data.data === 'object') {
            // data.data bir obje ise, içinde array aramaya çalış
            const keys = Object.keys(data.data);
            for (const key of keys) {
              if (Array.isArray(data.data[key])) {
                reviewsData = data.data[key];
                if (process.env.NODE_ENV === 'development') {
                }
                break;
              }
            }
          }
        } else if (Array.isArray(data.data)) {
          // Direkt array formatı
          reviewsData = data.data;
          if (process.env.NODE_ENV === 'development') {
          }
        } else if (Array.isArray(data)) {
          // En üst seviye array
          reviewsData = data;
          if (process.env.NODE_ENV === 'development') {
          }
        }
        
        if (process.env.NODE_ENV === 'development') {
          if (reviewsData.length > 0) {
          }
        }

            // Sadece onaylanmış yorumları filtrele ve component formatına dönüştür
        const approvedReviews = reviewsData.filter((apiReview: ApiReview) => {
          // Status kontrolü: 'approved' veya başka bir format olabilir
          const status = apiReview.status?.toLowerCase();
          return status === 'approved' || status === 'active' || !status || status === 'true';
        });
        
        if (process.env.NODE_ENV === 'development') {
        }
        
        dynamicReviews = approvedReviews.map((apiReview: ApiReview) => {
          // Kullanıcı adını belirle: user_name varsa onu kullan, yoksa name + lastname, yoksa user?.name + user?.lastname
          let userName = '';
          if (apiReview.user_name) {
            userName = apiReview.user_name;
          } else if (apiReview.name && apiReview.lastname) {
            userName = `${apiReview.name} ${apiReview.lastname}`;
          } else if (apiReview.user?.name && apiReview.user?.lastname) {
            userName = `${apiReview.user.name} ${apiReview.user.lastname}`;
          } else if (apiReview.user?.name) {
            userName = apiReview.user.name;
          } else if (apiReview.user_id) {
            userName = `Kullanıcı ${apiReview.user_id.slice(-6)}`;
          } else {
            userName = 'Kullanıcı';
          }
          
          const createdDate = new Date(apiReview.created_at);
          
          return {
              id: apiReview.id,
            userName: censorUserName(userName),
            date: createdDate.toLocaleDateString('tr-TR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }),
            dateISO: apiReview.created_at, // Sıralama için ISO string
              rating: parseInt(apiReview.rating) || 0,
              comment: apiReview.comment || '',
              images: [], // API'de image varsa buraya eklenebilir
              likes: apiReview.likes || 0,
              dislikes: apiReview.dislikes || 0
          };
        });

        if (process.env.NODE_ENV === 'development') {
        }
        
        // Önce loading'i false yap, sonra state'leri güncelle
        setLoading(false);
        setError(null);
        setReviews(dynamicReviews);
        setActualTotalReviews(dynamicReviews.length);
        
        // Ortalama rating hesapla
        if (dynamicReviews.length > 0) {
          const avgRating = dynamicReviews.reduce((sum, review) => sum + review.rating, 0) / dynamicReviews.length;
          const newRating = Math.round(avgRating * 10) / 10; // 1 ondalık basamak
          setActualRating(newRating);
          
          // Parent component'e yeni rating bilgisini gönder
          onRatingUpdateRef.current?.(newRating, dynamicReviews.length);
        } else {
          // Yorum yoksa da state'i güncelle
          setActualRating(0);
          setActualTotalReviews(0);
        }
      } catch (apiError) {
        const errorMessage = apiError instanceof Error ? apiError.message : 'Yorumlar yüklenirken bir hata oluştu';
        setError(errorMessage);
        setLoading(false);
        toast.error(errorMessage);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Yorumlar yüklenirken bir hata oluştu';
      setError(errorMessage);
      setLoading(false);
      toast.error(errorMessage);
    }
  }, [productSlug, productId]);

  // Component mount edildiğinde yorumları getir
  useEffect(() => {
    if (!productSlug && !productId) {
      return;
    }

    let isMounted = true;
    
    const loadReviews = async () => {
      try {
        await fetchReviews();
      } catch (err) {
        if (isMounted && process.env.NODE_ENV === 'development') {
        }
      }
    };

    loadReviews();

    // Cleanup: component unmount olduğunda isMounted false yap
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productSlug, productId]); // fetchReviews'i dependency'den çıkarıyoruz çünkü useCallback ile tanımlı

  // Kullanıcının bu ürün için değerlendirme yapıp yapmadığını kontrol et
  const checkUserReview = useCallback(async () => {
    if (!isLoggedIn || (!productId && !productSlug)) {
      // Login değilse veya ürün bilgisi yoksa, varsayılan olarak false (buton görünsün)
      setUserHasReviewed(false);
      return;
    }

    try {
      setCheckingReview(true);
      const token = localStorage.getItem('token');
      if (!token) {
        // Token yoksa, varsayılan olarak false (buton görünsün)
        setUserHasReviewed(false);
        return;
      }

      // Kullanıcının tüm ürün değerlendirmelerini getir (empty status)
      const response = await fetch(`${API_V1_URL}/customer/reviews?type=product&status=empty`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.meta?.status === 'success' && data.data) {
          // Bu ürün için empty status'lu bir review var mı kontrol et
          const referenceId = productSlug || productId;
          const hasEmptyReview = data.data.some((review: any) => {
            const reviewRefId = review.reference_id?.toString() || '';
            const productIdStr = productId?.toString() || '';
            const productSlugStr = productSlug?.toString() || '';
            const refIdStr = referenceId?.toString() || '';
            
            return reviewRefId === refIdStr || 
                   reviewRefId === productIdStr || 
                   reviewRefId === productSlugStr ||
                   reviewRefId.includes(productIdStr) ||
                   reviewRefId.includes(productSlugStr);
          });
          
          if (process.env.NODE_ENV === 'development') {
        
          }
          
          // Eğer empty review varsa, kullanıcı değerlendirme yapmamış demektir (false)
          // Eğer empty review yoksa, kullanıcı değerlendirme yapmış olabilir ama kesin değil
          // Bu yüzden sadece kesin olarak değerlendirme yapmışsa true yap, yoksa false/null bırak
          if (hasEmptyReview) {
            setUserHasReviewed(false); // Empty review var = değerlendirme yapmamış, buton görünsün
          } else {
            // Empty review yok, ama değerlendirme yapmış mı kontrol et (approved status)
            const approvedReviewsResponse = await fetch(`${API_V1_URL}/customer/reviews?type=product&status=approved`, {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              },
            });
            
            if (approvedReviewsResponse.ok) {
              const approvedData = await approvedReviewsResponse.json();
              if (approvedData.meta?.status === 'success' && approvedData.data) {
                const referenceId = productSlug || productId;
                const hasApprovedReview = approvedData.data.some((review: any) => {
                  const reviewRefId = review.reference_id?.toString() || '';
                  const productIdStr = productId?.toString() || '';
                  const productSlugStr = productSlug?.toString() || '';
                  const refIdStr = referenceId?.toString() || '';
                  
                  return reviewRefId === refIdStr || 
                         reviewRefId === productIdStr || 
                         reviewRefId === productSlugStr ||
                         reviewRefId.includes(productIdStr) ||
                         reviewRefId.includes(productSlugStr);
                });
                setUserHasReviewed(hasApprovedReview); // Eğer approved review varsa true, yoksa false
              } else {
                setUserHasReviewed(false); // Kesin bilgi yok, buton göster
              }
            } else {
              setUserHasReviewed(false); // API hatası, buton göster
            }
          }
        } else {
          // Veri yoksa, varsayılan olarak false (buton görünsün)
          setUserHasReviewed(false);
        }
      } else {
        // Response başarısız olursa false bırak, buton görünsün
        setUserHasReviewed(false);
      }
    } catch (error) {
      // Hata durumunda false (buton görünsün)
      setUserHasReviewed(false);
    } finally {
      setCheckingReview(false);
    }
  }, [isLoggedIn, productId, productSlug]);

  // Login durumu veya productId/productSlug değiştiğinde kontrol et
  useEffect(() => {
    checkUserReview();
  }, [checkUserReview]);

  // Değerlendirme gönder
  const submitReview = async () => {
    if (!isLoggedIn) {
      router.push('/giris');
      toast.error('Değerlendirme yapmak için giriş yapmalısınız');
      return;
    }

    if (reviewRating === 0 || !reviewComment.trim()) {
      toast.error('Lütfen yıldız sayısı ve yorum alanını doldurun');
      return;
    }

    if (!productId && !productSlug) {
      toast.error('Ürün bilgisi bulunamadı');
      return;
    }

    try {
      setSubmittingReview(true);
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/giris');
        toast.error('Oturum bulunamadı');
        return;
      }

      // Önce empty status'lu review'u bul
      const referenceId = productSlug || productId;
      const emptyReviewsResponse = await fetch(`${API_V1_URL}/customer/reviews?type=product&status=empty`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
      });

      let reviewId: string | null = null;
      if (emptyReviewsResponse.ok) {
        const emptyReviewsData = await emptyReviewsResponse.json();
        if (emptyReviewsData.meta?.status === 'success' && emptyReviewsData.data) {
          const emptyReview = emptyReviewsData.data.find((review: any) => 
            review.reference_id === referenceId || review.reference_id === productId || review.reference_id === productSlug
          );
          if (emptyReview) {
            reviewId = emptyReview.id;
          }
        }
      }

      if (!reviewId) {
        toast.error('Değerlendirme kaydı bulunamadı');
        return;
      }

      // Değerlendirmeyi gönder
      const response = await fetch(`${API_V1_URL}/customer/reviews/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          rating: reviewRating.toString(),
          comment: reviewComment.trim(),
          review_id: reviewId
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
        setReviewRating(0);
        setReviewComment('');
        setUserHasReviewed(true);
        // Yorumları yenile
        await fetchReviews();
        await checkUserReview();
      } else {
        throw new Error(data.meta?.message || 'Değerlendirme gönderilemedi');
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Değerlendirme gönderilirken bir hata oluştu');
    } finally {
      setSubmittingReview(false);
    }
  };

  // Değerlendir butonuna tıklandığında
  const handleReviewButtonClick = () => {
    if (!isLoggedIn) {
      router.push('/giris');
      toast.error('Değerlendirme yapmak için giriş yapmalısınız');
      return;
    }
    setShowReviewModal(true);
  };

  // Sıralama işlemi
  const sortedReviews = useMemo(() => {
    if (process.env.NODE_ENV === 'development') {
    }
    
    if (reviews.length === 0) {
      return [];
    }
    
    const sorted = [...reviews];
    switch (sortBy) {
      case 'En eski':
        return sorted.sort((a, b) => {
          const dateA = a.dateISO ? new Date(a.dateISO).getTime() : new Date(a.date).getTime();
          const dateB = b.dateISO ? new Date(b.dateISO).getTime() : new Date(b.date).getTime();
          return dateA - dateB;
        });
      case 'En yüksek puan':
        return sorted.sort((a, b) => b.rating - a.rating);
      case 'En düşük puan':
        return sorted.sort((a, b) => a.rating - b.rating);
      case 'En güncel':
      default:
        return sorted.sort((a, b) => {
          const dateA = a.dateISO ? new Date(a.dateISO).getTime() : new Date(a.date).getTime();
          const dateB = b.dateISO ? new Date(b.dateISO).getTime() : new Date(b.date).getTime();
          return dateB - dateA;
        });
    }
  }, [reviews, sortBy]);

  const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'md') => {
    const sizeClasses = {
      sm: 'w-3 h-3',
      md: 'w-4 h-4',
      lg: 'w-5 h-5'
    };
    return Array.from({ length: 5 }, (_, i) => (
      <StarIcon
        key={i}
        className={`${sizeClasses[size]} ${i < rating ? 'text-yellow-400' : 'text-gray-200'}`}
        data-clarity-region="ignore"
      />
    ));
  };

  // Yıldız dağılımını hesapla
  const starDistribution = useMemo(() => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      const starCount = Math.floor(review.rating);
      if (starCount >= 1 && starCount <= 5) {
        distribution[starCount as keyof typeof distribution]++;
      }
    });
    return distribution;
  }, [reviews]);

  // Yorum yoksa veya loading/error durumunda padding'i azalt
  const isEmptyState = !loading && !error && sortedReviews.length === 0;

  // Mobil yorum listesinin kaydırılabilirliğini kontrol et (sağa/sola buton gösterimi)
  useEffect(() => {
    const el = mobileReviewsScrollRef.current;
    if (!el) return;

    const updateScrollButtons = () => {
      if (!mobileReviewsScrollRef.current) return;
      const { scrollLeft, scrollWidth, clientWidth } = mobileReviewsScrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
    };

    updateScrollButtons();

    el.addEventListener('scroll', updateScrollButtons);
    window.addEventListener('resize', updateScrollButtons);

    return () => {
      el.removeEventListener('scroll', updateScrollButtons);
      window.removeEventListener('resize', updateScrollButtons);
    };
  }, [sortedReviews, selectedRatingFilter]);

  return (
    <div className={`bg-white border ${isEmptyState ? 'rounded-xl border-gray-100/80 p-4 shadow-sm hover:shadow-md transition-shadow duration-200' : 'rounded-2xl border-gray-200 p-6'} overflow-visible`}>
      {/* Mobil: Başlık ve Rating - Başlık Sol, Rating Sağ */}
      <div className="md:hidden mb-2">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm text-gray-900">Değerlendirmeler</h3>
          {/* Rating Bölümü - Sağda, Küçük Punto */}
          <div className="flex items-center gap-2">
            {/* Küçük Turuncu Gradient Dairesel Badge */}
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 via-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-md flex-shrink-0">
              <span className="text-sm font-bold text-white">{actualRating.toFixed(1)}</span>
          </div>
          
            {/* Yıldızlar ve Rating - Küçük */}
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-1">
                {renderStars(Math.floor(actualRating), 'sm')}
                <span className="text-xs font-semibold text-gray-900">{Math.floor(actualRating)}</span>
            </div>
              <p className="text-[10px] text-gray-600">{actualTotalReviews} inceleme</p>
            </div>
          </div>
        </div>
      </div>

      <div className={`grid lg:grid-cols-2 ${isEmptyState ? 'gap-4' : 'gap-8'} overflow-visible`}>
        {/* Sol Kolon - ALICI YORUMLARI */}
        <BuyerReviews 
          rating={actualRating}
          totalReviews={actualTotalReviews}
          satisfactionRate={satisfactionRate}
          reviews={reviews}
          renderActionButton={() => !userHasReviewed ? (
            <button
              onClick={handleReviewButtonClick}
              className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-orange-500 text-white text-[9px] font-medium rounded hover:bg-orange-600 transition-colors"
            >
              <StarIconSolid className="w-2 h-2" />
              Değerlendir
            </button>
          ) : null}
        />

        {/* Sağ Kolon - MÜŞTERİ YORUMLARI */}
        <div className={`${isEmptyState ? 'space-y-3' : 'space-y-4'} overflow-visible`}>
          {!isEmptyState && (
            <div className="hidden md:flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                {loading ? 'Yükleniyor...' : `${actualTotalReviews} inceleme`}
              </span>
            </div>
              {/* Değerlendir Butonu - Sadece değerlendirme yapmamışsa göster */}
              {!userHasReviewed && (
                <button
                  onClick={handleReviewButtonClick}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-orange-500 text-white text-xs font-medium rounded-lg hover:bg-orange-600 transition-colors"
                >
                  <StarIconSolid className="w-3.5 h-3.5" />
                  Değerlendir
                </button>
              )}
          </div>
          )}

          {/* Loading State */}
          {(() => {
            if (process.env.NODE_ENV === 'development') {
            }
            return null;
          })()}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            </div>
          ) : error ? (
            /* Error State */
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-lg font-medium text-gray-900 mb-2">Yorumlar yüklenemedi</h4>
              <p className="text-sm text-gray-500 mb-6">{error}</p>
              <button 
                onClick={fetchReviews}
                className="inline-flex items-center px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 transition-colors"
              >
                Tekrar Dene
              </button>
            </div>
          ) : sortedReviews.length > 0 ? (
            <div className="relative overflow-visible">
              {/* Navigasyon Butonları - Sadece Desktop'ta, 2'den fazla yorum varsa göster */}
              {sortedReviews.length > 2 && (
                <>
                  <button
                    onClick={() => setCurrentReviewIndex(Math.max(0, currentReviewIndex - 2))}
                    disabled={currentReviewIndex === 0}
                    className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 z-10 bg-white rounded-full p-2.5 shadow-lg border border-gray-200 hover:bg-gray-50 hover:shadow-xl transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:shadow-lg"
                    aria-label="Önceki yorumlar"
                  >
                    <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setCurrentReviewIndex(Math.min(sortedReviews.length - 2, currentReviewIndex + 2))}
                    disabled={currentReviewIndex >= sortedReviews.length - 2}
                    className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 z-10 bg-white rounded-full p-2.5 shadow-lg border border-gray-200 hover:bg-gray-50 hover:shadow-xl transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:shadow-lg"
                    aria-label="Sonraki yorumlar"
                  >
                    <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}

              {/* Mobil: Yeni Tasarım - Görseldeki gibi */}
              <div className="md:hidden space-y-5">
                {/* Filtrele Bölümü */}
                <div>
                  <div
                    className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide"
                    style={{
                      scrollbarWidth: 'none',
                      msOverflowStyle: 'none',
                      WebkitOverflowScrolling: 'touch'
                    }}
                  >
                    {[5, 4, 3, 2, 1].map((stars) => {
                      const count = starDistribution[stars as keyof typeof starDistribution];
                      const isSelected = selectedRatingFilter === stars;
                      return (
                        <button
                          key={stars}
                          onClick={() => setSelectedRatingFilter(isSelected ? null : stars)}
                          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border transition-colors flex-shrink-0 ${
                            isSelected
                              ? 'bg-orange-50 border-orange-500 text-orange-700'
                              : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center gap-0.5">
                            {renderStars(stars, 'sm')}
                          </div>
                          <span className="text-sm font-medium">{count}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* ŞUNA GÖRE SIRALA Bölümü - Filtrele'nin Altında */}
                <div className="flex items-center gap-3">
                  <h3 className="text-sm font-semibold text-gray-900 flex-shrink-0">ŞUNA GÖRE SIRALA</h3>
                  <div className="relative flex-1">
                    <select
                      value={sortBy}
                      onChange={(e) => {
                        setSortBy(e.target.value);
                        setCurrentReviewIndex(0); // Sıralama değiştiğinde ilk sayfaya dön
                      }}
                      className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-3 py-2 pr-8 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="En güncel">En güncel</option>
                      <option value="En eski">En eski</option>
                      <option value="En yüksek puan">En yüksek puan</option>
                      <option value="En düşük puan">En düşük puan</option>
                    </select>
                    <ChevronDownIcon className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Değerlendirmeler Bölümü */}
                <div className="relative">
                  <div
                    ref={mobileReviewsScrollRef}
                    className="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide snap-x snap-mandatory"
                    style={{
                      scrollbarWidth: 'none',
                      msOverflowStyle: 'none',
                      WebkitOverflowScrolling: 'touch'
                    }}
                  >
                    {(selectedRatingFilter 
                      ? sortedReviews.filter(r => Math.floor(r.rating) === selectedRatingFilter)
                      : sortedReviews
                    ).map((review) => (
                      <div key={review.id} className="border border-gray-200 rounded-xl px-4 py-5 bg-white flex-shrink-0 w-[70%] min-w-[70%] max-w-[70%] snap-start last:mr-4">
                        {/* Kullanıcı Bilgisi ve Tarih */}
                        <div className="flex items-start gap-3 mb-3">
                          {/* Profil Resmi */}
                          <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">
                              {review.userName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-1">
                              <span className="text-sm font-semibold text-gray-900">
                                {review.userName}
                              </span>
                              <div className="flex items-center gap-1">
                                {renderStars(review.rating, 'sm')}
                              </div>
                            </div>
                            <span className="text-xs text-gray-500">{review.date}</span>
                            {review.comment && review.comment.trim().length > 0 ? (
                              <p
                                className="text-sm text-gray-700 leading-relaxed mt-2 whitespace-pre-line"
                                style={{
                                  display: '-webkit-box',
                                  WebkitLineClamp: 4,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden'
                                }}
                              >
                                {review.comment}
                              </p>
                            ) : (
                              <p
                                className="text-sm text-gray-700 leading-relaxed mt-2"
                                style={{
                                  display: '-webkit-box',
                                  WebkitLineClamp: 4,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden'
                                }}
                              >
                                Bu değerlendirmede yalnızca puan verilmiş, yorum metni bulunmuyor.
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Mobil sağ/sol kaydırma butonları - PopularProducts mobil görünümüne benzer */}
                  {/* Mobilde butonları kaldırdık; sadece parmakla kaydırma aktif */}
                </div>
              </div>

              {/* Desktop: ŞUNA GÖRE SIRALA */}
              <div className="hidden md:block mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">ŞUNA GÖRE SIRALA</span>
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => {
                        setSortBy(e.target.value);
                        setCurrentReviewIndex(0); // Sıralama değiştiğinde ilk sayfaya dön
                      }}
                      className="appearance-none bg-white border border-gray-300 rounded-lg px-3 py-1.5 pr-8 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="En güncel">En güncel</option>
                      <option value="En eski">En eski</option>
                      <option value="En yüksek puan">En yüksek puan</option>
                      <option value="En düşük puan">En düşük puan</option>
                    </select>
                    <ChevronDownIcon className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Desktop: Yorumlar Grid */}
              <div className="hidden md:grid md:grid-cols-2 gap-4 relative">
                {sortedReviews.slice(currentReviewIndex, currentReviewIndex + 2).map((review) => (
                  <div 
                    key={review.id} 
                    className="border border-gray-100 rounded-xl p-5 bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
                  >
                    {/* Kullanıcı Bilgisi ve Tarih */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-semibold text-gray-900">
                          {review.userName}
                        </span>
                        <span className="text-xs text-gray-400">{review.date}</span>
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-4" data-clarity-region="ignore">
                      {renderStars(review.rating, 'md')}
                    </div>

                    {/* Yorum Metni */}
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {review.comment}
                    </p>

                    {/* Resimler */}
                    {review.images && review.images.length > 0 && (
                      <div className="flex gap-2 mt-4">
                        {review.images.map((image, index) => (
                          <div key={index} className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                            <EyeIcon className="w-6 h-6 text-gray-400" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Sayfa Göstergesi - Sadece Desktop'ta */}
              {sortedReviews.length > 2 && (
                <div className="hidden md:flex justify-center items-center mt-6 gap-2">
                  {Array.from({ length: Math.ceil(sortedReviews.length / 2) }, (_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentReviewIndex(index * 2)}
                      className={`transition-all duration-200 ${
                        Math.floor(currentReviewIndex / 2) === index 
                          ? 'w-8 h-2 bg-orange-500 rounded-full' 
                          : 'w-2 h-2 bg-gray-300 rounded-full hover:bg-gray-400'
                      }`}
                      aria-label={`Sayfa ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : null}

        </div>
      </div>

      {/* Değerlendirme Modal */}
      {showReviewModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[999999] p-4"
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
            overscrollBehavior: 'contain'
          }}
        >
          <div 
            className="bg-white rounded-xl max-w-md w-full p-6"
            style={{
              maxHeight: '90dvh',
              overflowY: 'auto',
              WebkitOverflowScrolling: 'touch',
              overscrollBehavior: 'contain',
              paddingBottom: 'env(safe-area-inset-bottom, 0)'
            }}
          >
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Ürünü Değerlendirin</h3>
              {/* Ürün Bilgileri */}
              {(productName || productImage || productPrice !== undefined) && (
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <div className="flex items-center gap-3">
                    {productImage ? (
                      <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={productImage}
                          alt={productName || 'Ürün'}
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
                      <p className="font-medium text-gray-900 text-sm">{productName || 'Ürün'}</p>
                      {productPrice !== undefined && (
                        <p className="text-gray-500 text-xs">{productPrice.toLocaleString('tr-TR')} TL</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Yıldız Seçimi */}
            <div className="mb-4" data-clarity-region="ignore">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Değerlendirmeniz (1-5 yıldız)
              </label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewRating(star)}
                    className="focus:outline-none"
                  >
                    <StarIconSolid
                      className={`w-8 h-8 ${
                        star <= reviewRating ? 'text-orange-500' : 'text-gray-200'
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
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Ürün hakkındaki düşüncelerinizi paylaşın..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
                rows={4}
              />
            </div>

            {/* Butonlar */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowReviewModal(false);
                  setReviewRating(0);
                  setReviewComment('');
                }}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                İptal
              </button>
              <button
                type="button"
                onClick={submitReview}
                disabled={submittingReview || reviewRating === 0 || !reviewComment.trim()}
                className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {submittingReview ? 'Gönderiliyor...' : 'Gönder'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerReviews; 
