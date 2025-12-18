"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { API_V1_URL } from '@/lib/config';

interface Category {
  id: string;
  name: string;
  slug: string;
  children?: Category[];
}

interface ProductBreadcrumbProps {
  product: {
    id: string;
    name: string;
    categoryId: string;
  };
}

export default function ProductBreadcrumb({ product }: ProductBreadcrumbProps) {
  const [categoryPath, setCategoryPath] = useState<Array<{name: string, slug: string}>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryPath = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_V1_URL}/categories`);
        const data = await response.json();

        if (data.meta?.status === 'success') {
          // Kategori yolunu bulan yardımcı fonksiyon
          const findCategoryPath = (categories: Category[], targetId: string, currentPath: Category[] = []): Category[] | null => {
            for (const category of categories) {
              if (category.id === targetId) {
                return [...currentPath, category];
              }
              if (category.children?.length) {
                const found = findCategoryPath(category.children, targetId, [...currentPath, category]);
                if (found) return found;
              }
            }
            return null;
          };

          const path = findCategoryPath(data.data, product.categoryId);
          if (path) {
            setCategoryPath(path.map(cat => ({
              name: cat.name,
              slug: cat.slug
            })));
          }
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    if (product?.categoryId) {
      fetchCategoryPath();
    }
  }, [product?.categoryId]);

  if (loading) {
    return (
      <div className="flex items-center text-xs space-x-2">
        <div className="w-16 h-3 bg-gray-200 animate-pulse rounded"></div>
        <span className="text-orange-500">&gt;</span>
        <div className="w-20 h-3 bg-gray-200 animate-pulse rounded"></div>
      </div>
    );
  }

  return (
    <div className="flex items-center text-xs flex-wrap">
      <Link 
        href="/" 
        className="text-gray-500 hover:text-gray-800 relative group"
      >
        Trendruum
        <span className="absolute bottom-[-1px] left-0 w-full h-[1px] bg-black scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
      </Link>

      {categoryPath.map((category, index) => (
        <React.Fragment key={category.slug}>
          <span className="text-orange-500 mx-1 font-bold">&gt;</span>
          {index === categoryPath.length - 1 ? (
            <span className="text-gray-900">{category.name}</span>
          ) : (
            <Link 
              href={category.slug ? `/${category.slug}` : '#'}
              className="text-gray-500 hover:text-gray-800 relative group"
            >
              {category.name}
              <span className="absolute bottom-[-1px] left-0 w-full h-[1px] bg-black scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
            </Link>
          )}
        </React.Fragment>
      ))}

      <span className="text-orange-500 mx-1 font-bold">&gt;</span>
      <span className="text-gray-900">{product.name}</span>
    </div>
  );
} 