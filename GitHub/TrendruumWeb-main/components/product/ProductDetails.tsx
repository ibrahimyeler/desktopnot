"use client";

import { useState } from 'react';
import { StarIcon, ShoppingCartIcon, PlusIcon, MinusIcon, BuildingStorefrontIcon, HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { HeartIcon } from '@heroicons/react/24/outline';
import { useBasket } from '@/app/context/BasketContext';
import ProductImages from './ProductImages';
import { useRouter } from 'next/navigation';
import { useFavorites } from '@/app/context/FavoriteContext';
import { useAuth } from '@/app/context/AuthContext';
import { toast } from 'react-hot-toast';

interface ProductImage {
  id: string;
  url: string;
  name?: string;
}

interface Product {
  id: string | number;
  name: string;
  price: number;
  original_price?: number;
  images?: ProductImage[];
  medias?: { url: string }[];
  image?: {
    url: string;
  };
  rating?: number;
  review_count?: number;
  stock?: number;
  seller?: {
    id: string;
    name: string;
  };
  description?: string;
}

interface ProductDetailsProps {
  product: Product;
  onAddToCart?: () => Promise<void>;
}

const ProductDetails = ({ product, onAddToCart }: ProductDetailsProps) => {
  const [quantity, setQuantity] = useState(1);
  const { addToBasket } = useBasket();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { addToFavorites, removeFavorite: removeFromFavorites, isInFavorites } = useFavorites();
  const { isLoggedIn } = useAuth();
  const isFavorited = isInFavorites(String(product.id));

  // Fiyat bilgisi
  const price = product.price || 0;
  
  // Ürün adı
  const name = product.name || 'Ürün Adı';
  
  // Satıcı bilgisi
  const seller = product.seller?.name || 'Satıcı bilgisi bulunamadı';
  
  // Stok durumu kontrolü
  const inStock = product.stock === undefined || product.stock > 0;

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= (product.stock || Infinity)) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    if (!product.id || loading || !inStock) return;
    
    setLoading(true);
    try {
      await addToBasket(String(product.id), quantity);
      // Toast mesajı BasketContext'te yönetiliyor
      onAddToCart?.();
      // Sepete yönlendirme kaldırıldı - kullanıcı alışverişe devam edebilir
    } catch (error) {
      // Hata mesajı BasketContext'te yönetiliyor
    } finally {
      setLoading(false);
    }
  };

  const handleFavoriteClick = async () => {
    if (!isLoggedIn) {
      toast.error('Favorilere eklemek için giriş yapmalısınız');
      router.push('/giris');
      return;
    }

    try {
      if (isFavorited) {
        await removeFromFavorites(String(product.id));
        toast.success('Ürün favorilerden kaldırıldı');
      } else {
        await addToFavorites(String(product.id));
        toast.success('Ürün favorilere eklendi');
      }
    } catch (error) {
      toast.error('İşlem sırasında bir hata oluştu');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
      {/* Ürün Görselleri */}
      <div className="sticky top-4">
        <ProductImages 
          images={
            (product.images && product.images.length > 0) 
              ? product.images.map(img => img.url)
              : (product.medias && product.medias.length > 0)
                ? product.medias.map(media => media.url)
                : []
          } 
          productName={name}
          stock={product.stock}
          status={product.stock === 0 ? 'out_of_stock' : 'in_stock'}
        />
      </div>

      {/* Ürün Bilgileri */}
      <div className="space-y-8">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">{name}</h1>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="flex">
                {[0, 1, 2, 3, 4].map((rating) => (
                  <StarIcon
                    key={`star-${rating}-${product.id}`}
                    className={`h-5 w-5 ${
                      (product.rating || 0) > rating ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="ml-2 text-sm text-gray-500">
                {product.review_count ? `(${product.review_count} değerlendirme)` : '(0 değerlendirme)'}
              </span>
            </div>
            <span className="text-gray-300">|</span>
            <div className="flex items-center space-x-2">
              <BuildingStorefrontIcon className="h-5 w-5 text-gray-400" />
              <p className="text-sm text-gray-600">{seller}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-xl p-6 space-y-4">
          <div className="flex items-end space-x-4">
            <div className="text-4xl font-bold text-gray-900">{price.toLocaleString('tr-TR')} TL</div>
            {product.original_price && product.original_price > price && (
              <div className="flex flex-col">
                <span className="text-lg text-gray-500 line-through">
                  {product.original_price.toLocaleString('tr-TR')} TL
                </span>
                <span className="text-sm font-medium text-green-600">
                  %{Math.round(((product.original_price - price) / product.original_price) * 100)} İndirim
                </span>
              </div>
            )}
          </div>
          
          {price > 0 && (
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <span className="text-gray-700 font-medium">Adet:</span>
                <div className="flex items-center border rounded-lg bg-white shadow-sm">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1 || loading}
                    className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-50"
                  >
                    <MinusIcon className="h-4 w-4" />
                  </button>
                  <span className="px-4 py-2 text-gray-900 font-medium border-x">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= (product.stock || Infinity) || loading}
                    className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-50"
                  >
                    <PlusIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="flex-1 flex space-x-4">
            {/* Mobile: Favori butonu solunda */}
            <div className="md:hidden flex-shrink-0">
              <button
                onClick={handleFavoriteClick}
                className={`p-3 rounded-lg border-2 transition-colors ${
                  isFavorited
                    ? 'bg-red-50 border-red-300 text-red-500 hover:bg-red-100'
                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                }`}
              >
                {isFavorited ? (
                  <HeartSolidIcon className="h-6 w-6 text-red-500" />
                ) : (
                  <HeartIcon className="h-6 w-6 text-gray-500" />
                )}
              </button>
            </div>

            {/* Sepete Ekle Butonu - 0 TL ürünlerde gizli */}
            {price > 0 && (
              <button
                onClick={handleAddToCart}
                disabled={loading || !inStock}
                className={`flex-1 flex items-center justify-center space-x-2 px-6 py-3 rounded-lg text-white font-medium transition-colors
                  ${loading || !inStock
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-orange-500 hover:bg-orange-600'
                  }`}
              >
                <ShoppingCartIcon className="h-5 w-5" />
                <span>{loading ? 'Ekleniyor...' : inStock ? 'Sepete Ekle' : 'Stokta Yok'}</span>
              </button>
            )}

            {/* Desktop: Favori butonu sağında */}
            <div className="hidden md:block">
              <button
                onClick={handleFavoriteClick}
                className={`p-3 rounded-lg border transition-colors ${
                  isFavorited
                    ? 'bg-red-50 border-red-200 text-red-500 hover:bg-red-100'
                    : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'
                }`}
              >
                {isFavorited ? (
                  <HeartSolidIcon className="h-5 w-5" />
                ) : (
                  <HeartIcon className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Ürün Açıklaması */}
        <div className="prose max-w-none">
          <h2 className="text-xl font-semibold mb-4">Ürün Açıklaması</h2>
          <div className="text-gray-600" dangerouslySetInnerHTML={{ __html: product.description || 'Ürün açıklaması bulunmamaktadır.' }} />
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;