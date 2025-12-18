"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import SortingButton from './SortingButton';
import { Product } from '@/types/product';
import { API_V1_URL } from '@/lib/config';

interface ApiResponse {
  meta: {
    status: string;
    message: string;
    code: number;
  };
  data: Product[];
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export default function FlashUrunler() {
  const [products, setProducts] = useState<Product[]>([]);
  const [sortedProducts, setSortedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_V1_URL}/categories/elektronik/products`);
        const data: ApiResponse = await response.json();

        if (data.meta.status === 'success') {
          // Fiyatı 0 TL olan ürünleri filtrele
        const filteredProducts = data.data.filter((product: any) => product.price > 0);
        setProducts(filteredProducts);
          setSortedProducts(data.data);
        } else {
          throw new Error(data.meta.message);
        }
      } catch (error) {
        setError('Ürünler yüklenirken bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleSortedProducts = (newSortedProducts: Product[]) => {
    setSortedProducts(newSortedProducts);
  };

  if (loading) {
    return <div className="text-center py-8">Yükleniyor...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Flash Ürünler</h2>
        <SortingButton 
          products={products} 
          onSortedProducts={handleSortedProducts}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {sortedProducts.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative h-48 w-full">
              <Image
                src={product.images?.[0]?.url || '/placeholder.jpg'}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-medium text-gray-800 mb-2 line-clamp-2">
                {product.name}
              </h3>
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-orange-500">
                  {product.price.toLocaleString('tr-TR', {
                    style: 'currency',
                    currency: 'TRY'
                  })}
                </span>
                <span className="text-sm text-gray-500">
                  {product.seller?.name || 'Satıcı bilgisi yok'}
                </span>
              </div>
              <div className="mt-2 text-sm text-gray-600">
                <span className="block">
                  Kargo: {product.seller?.shipping_policy?.general?.shipping_fee?.toLocaleString('tr-TR', {
                    style: 'currency',
                    currency: 'TRY'
                  }) || 'Belirtilmemiş'}
                </span>
                <span className="block">
                  Teslimat: {product.seller?.shipping_policy?.general?.delivery_time || 'Belirtilmemiş'} gün
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
