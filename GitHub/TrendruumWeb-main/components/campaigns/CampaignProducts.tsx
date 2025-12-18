import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  old_price?: number;
  images: Array<{ url: string; name: string; id: string }>;
  brand?: {
    name: string;
    slug: string;
  };
  rating?: number;
  review_count?: number;
  stock: number;
  status: string;
  badges?: {
    fast_shipping: boolean;
    free_shipping: boolean;
    same_day: boolean;
    new_product: boolean;
    best_selling: boolean;
  };
}

interface CampaignProductsProps {
  products: Product[];
  loading?: boolean;
  campaignName?: string;
}

const CampaignProducts: React.FC<CampaignProductsProps> = ({ 
  products, 
  loading = false, 
  campaignName 
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {[...Array(10)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
            <div className="h-48 bg-gray-200"></div>
            <div className="p-3">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg mb-4">Kampanya ürünü bulunamadı</div>
        <p className="text-gray-400">
          {campaignName ? `${campaignName} kampanyasında` : 'Bu kampanyada'} henüz ürün bulunmamaktadır.
        </p>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(price);
  };

  const getDiscountPercentage = (price: number, oldPrice?: number) => {
    if (!oldPrice || oldPrice <= price) return null;
    const discount = ((oldPrice - price) / oldPrice) * 100;
    return Math.round(discount);
  };

  return (
    <div>
      {campaignName && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {campaignName} Kampanya Ürünleri
          </h2>
          <p className="text-gray-600">
            {products.length} ürün bulundu
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {products.map((product) => {
          const discountPercentage = getDiscountPercentage(product.price, product.old_price);
          
          return (
            <Link
              key={product.id}
              href={`/urunler/${product.slug}/${product.id}`}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="relative h-48">
                {product.images && product.images.length > 0 ? (
                  <Image
                    src={product.images[0].url}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400 text-sm">Resim Yok</span>
                  </div>
                )}

                {/* İndirim Badge */}
                {discountPercentage && (
                  <div className="absolute top-2 left-2">
                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                      %{discountPercentage} İndirim
                    </span>
                  </div>
                )}

                {/* Ürün Badge'leri */}
                {product.badges && (
                  <div className="absolute top-2 right-2 flex flex-col gap-1">
                    {product.badges.fast_shipping && (
                      <span className="bg-green-500 text-white text-xs px-1 py-0.5 rounded">
                        Hızlı
                      </span>
                    )}
                    {product.badges.free_shipping && (
                      <span className="bg-blue-500 text-white text-xs px-1 py-0.5 rounded">
                        Ücretsiz
                      </span>
                    )}
                    {product.badges.same_day && (
                      <span className="bg-purple-500 text-white text-xs px-1 py-0.5 rounded">
                        Aynı Gün
                      </span>
                    )}
                  </div>
                )}

                {/* Stok Durumu */}
                {product.stock <= 0 && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="text-white font-bold">Stokta Yok</span>
                  </div>
                )}
              </div>

              <div className="p-3">
                {/* Marka */}
                {product.brand && (
                  <div className="text-xs text-gray-500 mb-1">
                    {product.brand.name}
                  </div>
                )}

                {/* Ürün Adı */}
                <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2">
                  {product.name}
                </h3>

                {/* Fiyat */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg font-bold text-gray-900">
                    {formatPrice(product.price)}
                  </span>
                  {product.old_price && product.old_price > product.price && (
                    <span className="text-sm text-gray-500 line-through">
                      {formatPrice(product.old_price)}
                    </span>
                  )}
                </div>

                {/* Rating */}
                {product.rating && product.rating > 0 && (
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <span className="text-yellow-400">★</span>
                    <span>{product.rating.toFixed(1)}</span>
                    {product.review_count && (
                      <span>({product.review_count})</span>
                    )}
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default CampaignProducts;
