"use client";

import React from 'react';

interface ProductHighlightsProps {
  product: {
    attributes?: Array<{
      name: string;
      value_name?: string;
      value?: string;
      value_slug?: string;
      slug?: string;
      updated_at?: string;
      created_at?: string;
    }>;
    brand?: {
      name?: string;
    };
    category?: {
      name?: string;
    };
    stock?: number;
    status?: string;
  };
}

interface ProductAttribute {
  label: string;
  value: string;
}

const ProductHighlights = ({ product }: ProductHighlightsProps) => {
  // Ürün özelliklerini al (öne çıkan özellikler için)
  const getProductInfo = (): ProductAttribute[] => {
    const info: ProductAttribute[] = [];
    
    // Tüm ürün özelliklerini dinamik olarak al
    if (product.attributes && product.attributes.length > 0) {
      product.attributes.forEach(attr => {
        if (attr.name && (attr.value_name || attr.value)) {
          info.push({ 
            label: attr.name, 
            value: attr.value_name || attr.value || '' 
          });
        }
      });
    }
    
    // Eğer attributes yoksa, temel ürün bilgilerini kullan
    if (info.length === 0) {
      if (product.brand?.name) {
        info.push({ label: 'Marka', value: product.brand.name });
      }
      if (product.category?.name) {
        info.push({ label: 'Kategori', value: product.category.name });
      }
      if (product.stock !== undefined) {
        info.push({ 
          label: 'Stok', 
          value: product.stock > 0 ? `${product.stock} adet` : 'Stokta yok' 
        });
      }
      if (product.status) {
        info.push({ 
          label: 'Durum', 
          value: product.status === 'active' ? 'Aktif' : 'Pasif' 
        });
      }
    }
    
    // İlk 8 özelliği al (4 sütun x 2 satır)
    return info.slice(0, 8);
  };

  const productInfo = getProductInfo();

  // Eğer özellik yoksa hiçbir şey gösterme
  if (productInfo.length === 0) {
    return null;
  }

  const handleOtherFeaturesClick = () => {
    const productDetailsSection = document.getElementById('product-details');
    if (productDetailsSection) {
      productDetailsSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <div className="space-y-3">
      {/* Başlık ve Buton - Yan yana */}
      <div className="flex items-center justify-between">
        <h3 className="text-xs sm:text-sm font-medium text-gray-900">Öne Çıkan Özellikler</h3>
        <button
          onClick={handleOtherFeaturesClick}
          className="inline-flex items-center px-1.5 py-0.5 sm:px-3 sm:py-1.5 bg-orange-50 hover:bg-orange-100 text-orange-700 text-[9px] sm:text-xs font-medium rounded-md sm:rounded-lg border border-orange-200 hover:border-orange-300 transition-colors duration-200"
        >
          <svg className="w-2 h-2 sm:w-4 sm:h-4 mr-0.5 sm:mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
          <span className="sm:inline">Ürünün Diğer Özellikleri</span>
        </button>
      </div>
    
      {/* Desktop - Grid Layout (4 sütun x 2 satır) */}
      <div className="hidden sm:block bg-gradient-to-br from-orange-50 to-white rounded-xl border border-orange-100 p-2 shadow-sm">
        <div className="grid grid-cols-4 gap-2">
          {productInfo.map((info, index) => {
            // Desktop için karakter sınırı
            const truncateText = (text: string, maxLength: number = 12) => {
              if (text.length <= maxLength) return text;
              return text.substring(0, maxLength) + '...';
            };

            const truncatedLabel = truncateText(info.label, 12);
            const truncatedValue = truncateText(info.value, 12);

            return (
              <div 
                key={index}
                className="text-center p-2 bg-white rounded-lg border border-orange-200 shadow-sm hover:shadow-md transition-all duration-200 hover:border-orange-300"
              >
                <div 
                  className="text-[10px] font-bold text-orange-700 mb-0.5 truncate"
                  title={info.label} // Tooltip için tam metin
                >
                  {truncatedLabel}
                </div>
                <div 
                  className="text-[10px] text-gray-800 font-medium truncate"
                  title={info.value} // Tooltip için tam metin
                >
                  {truncatedValue}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile - Horizontal Scroll Layout */}
      <div className="sm:hidden">
        <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-hide">
          {productInfo.map((info, index) => (
            <div 
              key={index}
              className="flex-shrink-0 bg-white rounded-lg border border-orange-200/60 shadow-sm p-2 min-w-[90px] flex flex-col items-center justify-center text-center"
            >
              <div className="text-[9px] font-bold text-orange-700 mb-0.5 truncate w-full">
                {info.label}
              </div>
              <div className="text-[9px] text-gray-800 font-medium truncate leading-tight w-full">
                {info.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductHighlights;
