"use client";

import React from 'react';

interface SEOItem {
  title: string;
  description: string;
}

interface CategorySEOProps {
  seoTitle?: string | null;
  seoDesc?: SEOItem[] | null;
  seoKeywords?: string | null;
  keywords?: string[] | null;
  categoryName?: string;
}

const CategorySEO: React.FC<CategorySEOProps> = ({
  seoTitle,
  seoDesc,
  seoKeywords,
  keywords,
  categoryName
}) => {
  // SEO verisi yoksa component'i render etme
  if (!seoTitle && !seoDesc && !seoKeywords) {
    return null;
  }

  return (
    <div className="bg-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* SEO Title */}
        {seoTitle && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              {seoTitle}
            </h2>
          </div>
        )}

        {/* SEO Descriptions */}
        {seoDesc && Array.isArray(seoDesc) && seoDesc.length > 0 && (
          <div>
            {seoDesc.map((item, index) => (
              <div key={index} className="bg-white rounded-lg p-4 mb-2">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed font-light">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* SEO Keywords */}
        {seoKeywords && (
          <div className="mt-6 pt-6
          ">
            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-medium text-gray-500">Etiketler:</span>
              {seoKeywords.split(',').map((keyword, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {keyword.trim()}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Keywords Array */}
        {keywords && Array.isArray(keywords) && keywords.length > 0 && (
          <div className="mt-6 pt-6">
            <div className="flex flex-wrap gap-2 justify-center">
              {keywords.map((keyword, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Category Name Fallback */}
        {!seoTitle && !seoDesc && categoryName && (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              {categoryName} Kategorisi
            </h2>
            <p className="text-gray-600">
              {categoryName} kategorisindeki tüm ürünleri keşfedin ve en uygun fiyatlarla alışveriş yapın.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategorySEO;
