'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { IoMdHeartEmpty } from 'react-icons/io';
import { FaStar, FaStarHalf } from 'react-icons/fa';
import { DiscountBadge, FlashSaleBadge, FreeShippingBadge, LimitedTimeBadge, MultipleDiscountBadge, QuickDeliveryBadge } from '../ui/badges';


interface Product {
  id: number;
  rank: number;
  brand: string;
  name: string;
  rating: number;
  reviewCount: number;
  price: number;
  image?: string;
  badges?: {
    hasQuickDelivery?: boolean;
    hasFreeShipping?: boolean;
    hasDiscount?: boolean;
    hasFlashSale?: boolean;
    hasLimitedTime?: boolean;
    hasMultipleDiscount?: boolean;
  };
  soldCount?: number;
  cartCount?: number;
  viewCount?: number;
  favoriteCount?: number;
}

const messages = [
  (count: number) => `🚀 Son 3 günde ${count}+ adet ürün satıldı!!`,
  (count: number) => `🛒 ${count} kişinin sepetinde, tükenmeden al!`,
  (count: number) => `👀 Popüler ürün! Son 24 saatte ${count} kişi görüntüledi!`,
  (count: number) => `🧡 Sevilen ürün! ${count} kişi favoriledi!`
];

const ProductStatusMessage = ({ product }: { product: Product }) => {
  const [messageIndex, setMessageIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {

      setIsVisible(false);
      
      setTimeout(() => {
        setMessageIndex((current) => (current + 1) % messages.length);
        setIsVisible(true);
      }, 200); 
      
    }, 3000); 

    return () => clearInterval(interval);
  }, []);

  const counts = [
    product.soldCount,
    product.cartCount,
    product.viewCount,
    product.favoriteCount
  ];

  return (
    <div 
      className={`
        text-sm text-gray-500 mt-2 bg-[#fff6f0] p-2 rounded-lg
        transition-opacity duration-200 ease-in-out
        ${isVisible ? 'opacity-100' : 'opacity-0'}
      `}
    >
      {messages[messageIndex](counts[messageIndex] || 0)}
    </div>
  );
};

const Urunler = () => {
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} className="text-orange-400" />);
    }

    if (hasHalfStar) {
      stars.push(<FaStarHalf key="half" className="text-orange-400" />);
    }

    return stars;
  };

  const products: Product[] = [
    {
      id: 1,
      rank: 1,
      brand: "Tonny Black",
      name: "Kadın Orijinal Mini Urban Çapraz Ayarlanabilir Askılı Fermuarlı Çanta",
      rating: 4.6,
      reviewCount: 25879,
      price: 279.90,
      image: "/coksatanlar-urun1.webp",
      badges: {
        hasQuickDelivery: true,
        hasMultipleDiscount: true,
        hasFreeShipping: true
      },
      soldCount: 1500,
      cartCount: 1131,
      viewCount: 503,
      favoriteCount: 422247
    },
    {
      id: 2,
      rank: 2,
      brand: "Genel Markalar",
      name: "Kadın Fermuarlı Ve Çıtçıtlı Bozuk Para Bölmeli Şık Turuncu Cüzdan",
      rating: 4.3,
      reviewCount: 878,
      price: 104,
      image: "/coksatanlar-urun2.webp",
      badges: {
        hasQuickDelivery: true
      },
      soldCount: 1000
    },
    {
      id: 3,
      rank: 3,
      brand: "Garbalia",
      name: "Vegan Deri Bozuk Para Gözlü Bol Kartlıklı Mini Turuncu Kadın Cüzdanı",
      rating: 4.8,
      reviewCount: 1859,
      price: 299.50,
      image: "/coksatanlar-urun3.webp",
      badges: {
        hasDiscount: true
      },
      soldCount: 500
    },
    {
      id: 4,
      rank: 4,
      brand: "bag&more",
      name: "Kadın Siyah Trend Kare Çanta,Basit Mini Crossbody Çanta,Mini El Çantası",
      rating: 3.7,
      reviewCount: 1049,
      price: 113.70,
      image: "/coksatanlar-urun4.webp",
      soldCount: 500
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      {products.map((product) => (
        <div key={product.id} className="relative bg-white rounded-lg p-4 hover:shadow-lg transition-shadow">

          <div className="absolute top-2 left-2 z-10 w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center">
            <span className="text-white font-bold">{product.rank}</span>
          </div>

          <button className="absolute top-2 right-2 z-10">
            <IoMdHeartEmpty className="text-2xl text-gray-400 hover:text-red-500" />
          </button>

          <div className="flex gap-4">
            <div className="relative w-32 h-32 flex-shrink-0">
              <Image
                src={product.image || "/placeholder.png"}
                alt={product.name}
                fill
                className="object-cover rounded-lg"
              />
            </div>

            <div className="flex-1 space-y-2">
              <h3 className="font-semibold text-gray-700">{product.brand}</h3>
              <p className="text-sm text-gray-600 line-clamp-2">{product.name}</p>
              
              <div className="flex items-center gap-1">
                <div className="flex">
                  {renderStars(product.rating)}
                </div>
                <span className="text-sm text-gray-500">({product.reviewCount})</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {product.badges?.hasQuickDelivery && <QuickDeliveryBadge />}
                {product.badges?.hasFreeShipping && <FreeShippingBadge />}
                {product.badges?.hasDiscount && <DiscountBadge />}
                {product.badges?.hasFlashSale && <FlashSaleBadge />}
                {product.badges?.hasLimitedTime && <LimitedTimeBadge />}
                {product.badges?.hasMultipleDiscount && <MultipleDiscountBadge />}
              </div>

              <div className="text-xl font-bold text-orange-500">
                {product.price.toFixed(2)} TL
              </div>

              <ProductStatusMessage product={product} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Urunler;
