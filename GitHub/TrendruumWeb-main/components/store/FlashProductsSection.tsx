import React from 'react';
import Image from 'next/image';

interface FlashProduct {
  id: number;
  name: string;
  image: string;
  price: string;
  oldPrice: string;
  discount: string;
}

const products: FlashProduct[] = [
  { id: 1, name: 'Flash Ürün 1', image: '/flash1.png', price: '199 TL', oldPrice: '299 TL', discount: '%33' },
  { id: 2, name: 'Flash Ürün 2', image: '/flash2.png', price: '149 TL', oldPrice: '199 TL', discount: '%25' },
  { id: 3, name: 'Flash Ürün 3', image: '/flash3.png', price: '99 TL', oldPrice: '149 TL', discount: '%34' },
  { id: 4, name: 'Flash Ürün 4', image: '/flash4.png', price: '299 TL', oldPrice: '399 TL', discount: '%25' },
  { id: 5, name: 'Flash Ürün 5', image: '/flash5.png', price: '89 TL', oldPrice: '129 TL', discount: '%31' },
];

interface FlashProductsSectionProps {
  title?: string;
  timer?: string;
}

const FlashProductsSection = ({ 
  title = 'Flash Ürünler', 
  timer = '00:12:34' 
}: FlashProductsSectionProps) => {
  return (
    <div className="w-full max-w-[1600px] mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        <div className="bg-orange-500 text-white px-6 py-2 rounded-lg font-mono text-lg font-bold tracking-widest">
          {timer}
        </div>
      </div>
      <div className="overflow-x-auto">
        <div className="flex gap-6 min-w-[600px]">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow p-4 min-w-[220px] flex-shrink-0 flex flex-col items-center relative"
            >
              <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                {product.discount}
              </div>
              <div className="relative w-28 h-28 mb-3">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 112px, 112px"
                />
              </div>
              <div className="text-gray-800 font-semibold text-base mb-1 text-center">{product.name}</div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-orange-500 font-bold text-lg">{product.price}</span>
                <span className="text-gray-400 line-through text-sm">{product.oldPrice}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FlashProductsSection; 