"use client";

import React from 'react';
import { 
  TagIcon, 
  CheckCircleIcon,
  ChevronRightIcon,
  DocumentTextIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

interface Attribute {
  name: string;
  value: string;
}


interface ProductFeaturesProps {
  product: {
    attributes?: Attribute[];
    description?: string;
    category?: {
      name: string;
      search_word?: string;
    };
  };
  attributes?: Attribute[];
}

const ProductFeatures = ({ product, attributes }: ProductFeaturesProps) => {
  const productAttributes = attributes || product.attributes || [];
  const categoryPath = product.category?.search_word ? product.category.search_word.split(' > ') : [];
  const descriptionParagraphs = product.description ? product.description.split('\n\n').filter(p => p.trim()) : [];

  return (
    <div className="mt-2.5 bg-gradient-to-br from-orange-50 via-amber-50 to-orange-50 rounded-2xl border border-orange-200 relative">
      {/* Başlık */}
      <div className="flex items-center gap-2 p-4 border-b border-orange-100 bg-gradient-to-r from-orange-500/10 to-amber-500/10 relative">
        <TagIcon className="w-5 h-5 text-orange-600" />
        <h3 className="text-base font-medium text-orange-900">Ürün Detayları</h3>
      </div>

      <div className="p-4 relative">
        <div className="grid lg:grid-cols-2 gap-6 relative">
          {/* Sol Kolon: Özellikler */}
          <div className="space-y-4">
            {/* Özellikler Başlığı */}
            <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-orange-100 to-amber-100 rounded-xl border border-orange-200">
              <SparklesIcon className="w-4 h-4 text-orange-600" />
              <span className="text-sm font-medium text-orange-800">Ürün Özellikleri</span>
            </div>

            {/* Kategori */}
            <div className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-50 to-fuchsia-50 rounded-xl border border-purple-200">
              <div className="flex items-center flex-wrap gap-1 text-xs text-purple-700">
                {categoryPath.map((cat, index) => (
                  <React.Fragment key={index}>
                    {index > 0 && <ChevronRightIcon className="w-3 h-3 text-purple-400" />}
                    <span className="hover:text-purple-500 cursor-pointer transition-colors">
                      {cat}
                    </span>
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Özellikler ve Varyantlar Grid */}
            <div className="grid gap-4">
              {/* Seçili Özellikler */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200">
                  <CheckCircleIcon className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-medium text-emerald-800">Seçili Özellikler</span>
                </div>
                <div className="grid gap-2">
                  {productAttributes.map((attr) => (
                    <div 
                      key={attr.name}
                      className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-200"
                    >
                      <CheckCircleIcon className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-sm text-emerald-800">
                        {attr.name}:{' '}
                        <span className="font-medium text-emerald-700">
                          {attr.value}
                        </span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Sağ Kolon: Ürün Açıklaması */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl border border-rose-200">
              <DocumentTextIcon className="w-4 h-4 text-rose-600" />
              <span className="text-xs font-medium text-rose-800">Ürün Açıklaması</span>
            </div>
            <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl border border-rose-200 p-4 space-y-3">
              {descriptionParagraphs.map((paragraph, index) => (
                <p key={index} className="text-sm leading-relaxed text-rose-800">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductFeatures; 