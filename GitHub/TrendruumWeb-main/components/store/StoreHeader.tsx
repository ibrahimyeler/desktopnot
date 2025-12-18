"use client";
import React, { useState, useEffect } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { API_V1_URL } from '@/lib/config';
import UnfollowConfirmModal from '@/components/common/UnfollowConfirmModal';

interface HeaderField {
  slug: string;
  items: Array<{
    slug: string;
    value: string;
    type?: string;
  }>;
}

interface HeaderSection {
  fields: HeaderField[];
}

interface StoreHeaderProps {
  seller: {
    id: string;
    name: string;
    rating?: number;
    follower_count?: number;
    [key: string]: any;
  };
  headerSection: HeaderSection;
  onSellerProfileClick?: () => void;
  onSearchClick?: () => void;
}

const StoreHeader = ({ seller, headerSection, onSellerProfileClick, onSearchClick }: StoreHeaderProps) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [loadingFollow, setLoadingFollow] = useState(false);
  const [showUnfollowModal, setShowUnfollowModal] = useState(false);
  

  // Check follow status on mount
  useEffect(() => {
    const checkFollowStatus = async () => {
      const token = localStorage.getItem('token');
      if (!token || !seller.id) return;

      try {
        const response = await fetch(`${API_V1_URL}/customer/follows`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();
        if (data.meta?.status === 'success') {
          const isFollowed = data.data.some((store: any) => store.id === seller.id);
          setIsFollowing(isFollowed);
        }
      } catch (error) {
      }
    };

    checkFollowStatus();
  }, [seller.id]);



  // Header section'dan dinamik veriler
  const mobileSection = headerSection?.fields.find((f) => f.slug === 'mobile');
  const desktopSection = headerSection?.fields.find((f) => f.slug === 'desktop');
  const logoField = headerSection?.fields.find((f) => f.slug === 'logo');
  const headerColorField = headerSection?.fields.find((f) => f.slug === 'header-color');
  const headerPreferenceField = headerSection?.fields.find((f) => f.slug === 'header-preference');

  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Mobil cover image - mobile section'dan dinamik
  const mobileCoverImage = mobileSection?.items?.find((i) => i.slug === 'mobile-cover-image' || i.type === 'image')?.value;
  
  // Desktop cover image - desktop section'dan dinamik
  const desktopCoverImage = desktopSection?.items?.find((i) => i.slug === 'mobile-cover-image' || i.type === 'image')?.value;

  const coverImage = isMobile ? mobileCoverImage : desktopCoverImage;
  
  // Header color - mobile/desktop ayrımı (cover image yoksa kullanılacak)
  const mobileHeaderColor = mobileSection?.items?.find((i) => i.slug === 'header-color')?.value;
  const desktopHeaderColor = desktopSection?.items?.find((i) => i.slug === 'header-color')?.value;
  const headerColor = isMobile 
    ? (mobileHeaderColor || headerColorField?.items?.[0]?.value || '#fff')
    : (desktopHeaderColor || headerColorField?.items?.[0]?.value || '#fff');
  
  const headerPreference = headerPreferenceField?.items?.find((i) => i.slug === 'preference')?.value || 'gradient';
  
  // Logo - API response'unda logo field'ındaki ilk item'ın value'su
  const logo = logoField?.items?.find((i) => i.slug === 'logo')?.value || logoField?.items?.[0]?.value;
  
  // Text color field from header section - mobile/desktop ayrımı
  const textColorField = isMobile 
    ? mobileSection?.items?.find((i) => i.slug === 'text-color')
    : desktopSection?.items?.find((i) => i.slug === 'text-color');
  const textColor = textColorField?.value || '#000000';
  

  // Add follow/unfollow logic
  const handleFollow = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      const currentPath = typeof window !== 'undefined' ? window.location.pathname + window.location.search : '/';
      window.location.href = `/giris?redirect=${encodeURIComponent(currentPath)}`;
      return;
    }
    setLoadingFollow(true);
    try {
      const storeId = seller.id;
      if (!storeId) {
        alert('Mağaza ID bulunamadı.');
        setLoadingFollow(false);
        return;
      }
      const res = await fetch(`${API_V1_URL}/customer/follows`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ store_id: storeId })
      });
      const data = await res.json();
      if (data.meta?.status === 'success') {
        setIsFollowing(true);
        // Toast mesajı eklenebilir
      } else {
        alert(data.meta?.message || 'Bir hata oluştu');
      }
    } catch (e) {
      alert('Bir hata oluştu');
    } finally {
      setLoadingFollow(false);
    }
  };

  const handleUnfollow = async () => {
    setShowUnfollowModal(true);
  };

  const confirmUnfollow = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      const currentPath = typeof window !== 'undefined' ? window.location.pathname + window.location.search : '/';
      window.location.href = `/giris?redirect=${encodeURIComponent(currentPath)}`;
      return;
    }
    
    setLoadingFollow(true);
    try {
      const storeId = seller.id;
      if (!storeId) {
        alert('Mağaza ID bulunamadı.');
        setLoadingFollow(false);
        return;
      }
      const res = await fetch(`${API_V1_URL}/customer/follows/${storeId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.meta?.status === 'success') {
        setIsFollowing(false);
        setShowUnfollowModal(false);
        // Toast mesajı eklenebilir
      } else {
        alert(data.meta?.message || 'Bir hata oluştu');
      }
    } catch (e) {
      alert('Bir hata oluştu');
    } finally {
      setLoadingFollow(false);
    }
  };

  // Format follower count
  const formatFollowerCount = (count?: number) => {
    if (!count) return '0';
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  return (
    <div className="w-full md:py-0 lg:py-0 xl:py-0">
      {/* Mobil: Tam genişlik - Dinamik arka plan */}
      <div className="block sm:hidden w-screen">
        {/* Dinamik arka plan (API'den gelen image veya gradient) */}
        <div 
          className="relative w-full -mx-0"
          style={{ 
            backgroundImage: mobileCoverImage ? `url(${mobileCoverImage})` : 'none',
            backgroundColor: mobileCoverImage ? 'transparent' : headerColor,
            background: mobileCoverImage 
              ? `url(${mobileCoverImage})`
              : (headerPreference === 'gradient' 
                ? 'linear-gradient(to right, #f97316, #fb923c, #facc15)' 
                : headerColor),
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            aspectRatio: '8 / 1'
          }}
        >
          {/* İçerik - mobil */}
          <div className="relative flex items-center justify-between h-full px-3 py-3">
            {/* Sol: Logo, Mağaza Adı */}
            <div className="flex items-center gap-2 flex-1 min-w-0">
              {logo && logo !== 'null' ? (
                <div className="relative w-10 h-10 flex-shrink-0">
                  <Image
                    src={logo}
                    alt="Mağaza Logo"
                    fill
                    className="rounded-full object-cover border-2 border-white bg-white"
                    sizes="40px"
                  />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white text-sm font-bold text-orange-600 border-2 border-white flex-shrink-0">
                  {seller.name?.[0] || '?'}
                </div>
              )}
              <div className="flex items-center gap-1.5 flex-1 min-w-0">
                <span className="text-sm font-semibold truncate" style={{ color: textColor }}>{seller.name}</span>
                {/* Rating (yeşil) */}
                {seller.rating && (
                  <div className="bg-green-500 text-white text-xs font-semibold px-2 py-0.5 rounded flex items-center gap-1 flex-shrink-0">
                    <span>{seller.rating.toFixed(1)}</span>
                  </div>
                )}
              </div>
            </div>
            {/* Sağ: Takip Et butonu */}
            <div className="flex flex-col items-end gap-1 flex-shrink-0 ml-2">
              <button
                onClick={isFollowing ? handleUnfollow : handleFollow}
                disabled={loadingFollow}
                className={`text-[9px] font-medium px-1.5 py-0.5 rounded flex items-center gap-0.5 transition-all touch-manipulation active:scale-95 ${
                  isFollowing 
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 active:from-orange-700 active:to-orange-800' 
                    : 'bg-transparent hover:bg-white/10 active:bg-white/20'
                }`}
                style={!isFollowing ? { color: textColor } : {}}
              >
                {loadingFollow ? (
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <>
                    <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isFollowing ? "M5 13l4 4L19 7" : "M12 4v16m8-8H4"} />
                    </svg>
                    <span>{isFollowing ? 'Takip Ediliyor' : 'Takip Et'}</span>
                  </>
                )}
              </button>
              {seller.follower_count && (
                <span className="text-[10px]" style={{ color: textColor }}>{formatFollowerCount(seller.follower_count)} Takipçi</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Desktop: Mobil ile aynı tasarım */}
      <div className="hidden sm:block w-full">
        {/* Dinamik arka plan (API'den gelen image veya gradient) */}
        <div 
          className="relative w-full -mx-0"
          style={{ 
            backgroundImage: desktopCoverImage ? `url(${desktopCoverImage})` : 'none',
            backgroundColor: desktopCoverImage ? 'transparent' : headerColor,
            background: desktopCoverImage 
              ? `url(${desktopCoverImage})`
              : (headerPreference === 'gradient' 
                ? 'linear-gradient(to right, #f97316, #fb923c, #facc15)' 
                : headerColor),
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            aspectRatio: desktopCoverImage ? '8 / 1' : 'auto'
          }}
        >
          {/* İçerik - desktop */}
          <div className="relative flex items-center justify-between h-full px-4 md:px-6 lg:px-8 py-4 md:py-6 lg:py-8">
            {/* Sol: Logo, Mağaza Adı */}
            <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
              {logo && logo !== 'null' ? (
                <div className="relative w-12 h-12 md:w-14 md:h-14 flex-shrink-0">
                  <Image
                    src={logo}
                    alt="Mağaza Logo"
                    fill
                    className="rounded-full object-cover border-2 border-white bg-white"
                    sizes="56px"
                  />
                </div>
              ) : (
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center bg-white text-base md:text-lg font-bold text-orange-600 border-2 border-white flex-shrink-0">
                  {seller.name?.[0] || '?'}
                </div>
              )}
              <div className="flex items-center gap-2 md:gap-2.5 flex-1 min-w-0">
                <span className="text-base md:text-lg lg:text-xl font-semibold truncate" style={{ color: textColor }}>{seller.name}</span>
                {/* Rating (yeşil) */}
                {seller.rating && (
                  <div className="bg-green-500 text-white text-xs md:text-sm font-semibold px-2 md:px-2.5 py-0.5 md:py-1 rounded flex items-center gap-1 flex-shrink-0">
                    <span>{seller.rating.toFixed(1)}</span>
                  </div>
                )}
              </div>
            </div>
            {/* Sağ: Takip Et butonu */}
            <div className="flex flex-col items-end gap-1 md:gap-1.5 flex-shrink-0 ml-2 md:ml-4">
              <button
                onClick={isFollowing ? handleUnfollow : handleFollow}
                disabled={loadingFollow}
                className={`text-xs md:text-sm font-medium px-2 md:px-3 py-1 md:py-1.5 rounded flex items-center gap-1 md:gap-1.5 transition-all touch-manipulation active:scale-95 ${
                  isFollowing 
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 active:from-orange-700 active:to-orange-800' 
                    : 'bg-transparent hover:bg-white/10 active:bg-white/20'
                }`}
                style={!isFollowing ? { color: textColor } : {}}
              >
                {loadingFollow ? (
                  <div className="flex items-center gap-1 md:gap-2">
                    <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                    <span>Yükleniyor...</span>
                  </div>
                ) : (
                  <>
                    <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isFollowing ? "M5 13l4 4L19 7" : "M12 4v16m8-8H4"} />
                    </svg>
                    <span>{isFollowing ? 'Takip Ediliyor' : 'Takip Et'}</span>
                  </>
                )}
              </button>
              {seller.follower_count && (
                <span className="text-xs md:text-sm" style={{ color: textColor }}>{formatFollowerCount(seller.follower_count)} Takipçi</span>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Unfollow Confirm Modal */}
      <UnfollowConfirmModal
        isOpen={showUnfollowModal}
        onClose={() => setShowUnfollowModal(false)}
        onConfirm={confirmUnfollow}
        sellerName={seller.name}
        isLoading={loadingFollow}
      />
    </div>
  );
};

export default StoreHeader; 