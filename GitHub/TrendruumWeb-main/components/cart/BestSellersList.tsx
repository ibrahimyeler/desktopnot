import React, { useEffect, useState, useMemo, useCallback, memo } from "react";
import Link from "next/link";
import { StarIcon } from '@heroicons/react/24/outline';
import { API_V1_URL } from '@/lib/config';
import { createProductUrl } from '@/utils/productUrl';

interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  rating?: number;
  review_count?: number;
  images?: { url: string }[];
  medias?: {
    name: string;
    fullpath: string;
    url: string;
    type: string;
    id?: string;
  }[];
}

const BestSellersList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_V1_URL}/products`)
      .then((res) => res.json())
      .then((data) => {
        if (data.meta?.status === "success" && Array.isArray(data.data)) {
          // Fiyatı 0 TL olan ürünleri filtrele
          const filteredProducts = data.data.filter((product: Product) => product.price > 0);
          setProducts(filteredProducts);
        }
      })
      .catch((error) => {
        setProducts([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const renderStars = useCallback((rating: number = 0) => {
    return Array.from({ length: 5 }, (_, index) => (
      <StarIcon
        key={index}
        className={`w-3 h-3 ${
          index < Math.floor(rating) 
            ? 'text-yellow-400 fill-current' 
            : 'text-gray-300'
        }`}
      />
    ));
  }, []);

  const showAllButton = useMemo(() => products.length > 20, [products.length]);

  if (loading) {
    return <div className="text-center text-gray-400 py-8">Yükleniyor...</div>;
  }

  // Memoized Product Card component
  const ProductCard = memo(({ product }: { product: Product }) => {
    // Resim URL'ini çoklu source'dan al
    const imageUrl = product.medias?.[0]?.url || 
                    product.images?.[0]?.url || 
                    "/placeholder.webp";
    
    return (
      <Link href={createProductUrl(product.slug)} className="flex flex-col items-center cursor-pointer rounded group">
        <div className="relative w-full aspect-[3/4] rounded-lg overflow-hidden mb-3">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/placeholder.webp";
            }}
          />
        </div>
        
        <div className="text-xs font-medium text-gray-800 text-center line-clamp-2 mb-2 w-full">{product.name}</div>
        
        {/* Yıldız Rating - Her zaman göster */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex">
            {renderStars(product.rating || 0)}
          </div>
          <span className="text-xs text-gray-500">({product.review_count || 0})</span>
        </div>
        
        <div className="text-sm text-black font-bold">{product.price.toLocaleString("tr-TR")} TL</div>
      </Link>
    );
  });

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold text-black mb-6">En Çok Satanlar</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
        {products.slice(0, 8).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      {showAllButton && (
        <div className="flex justify-center mt-6">
          <a
            href="/sana-ozel"
            className="px-6 py-2 bg-[#F27A1A] text-white rounded font-semibold hover:bg-[#e16c0e] transition-colors"
          >
            Tüm Ürünleri Gör
          </a>
        </div>
      )}
    </div>
  );
};

export default BestSellersList; 