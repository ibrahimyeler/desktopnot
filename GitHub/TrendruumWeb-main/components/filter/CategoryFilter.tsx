import React, { useState } from 'react';
import Link from 'next/link';
import { Category } from '../../types/category';
import { API_V1_URL } from '@/lib/config';

interface CategoryFilterProps {
  categories: Category[];
  currentCategory: string;
  selectedCategory: string | null;
  onCategorySelect: (slug: string) => void;
  showAllMainCategories: boolean;
  showAllSubcategories: boolean;
  onToggleMainCategories: () => void;
  onToggleSubcategories: () => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  currentCategory,
  selectedCategory,
  onCategorySelect,
  showAllMainCategories,
  showAllSubcategories,
  onToggleMainCategories,
  onToggleSubcategories
}) => {
  const [currentView, setCurrentView] = useState<'main' | 'sub'>('main');
  const [activeMainCategory, setActiveMainCategory] = useState<Category | null>(null);
  const [subcategories, setSubcategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  // Kategori detaylarını fetch et
  const fetchCategoryDetails = async (categorySlug: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_V1_URL}/categories/${categorySlug}`);
      const data = await response.json();
      
      if (data.meta.status === 'success' && data.data) {
        setActiveMainCategory(data.data);
        setSubcategories(data.data.children || []);
        setCurrentView('sub');
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  // Ana kategoriye tıklandığında alt kategorilere geç
  const handleMainCategoryClick = (category: Category, event: React.MouseEvent) => {
    event.preventDefault();
    // Her zaman API'den detayları fetch et
    fetchCategoryDetails(category.slug);
  };

  // Ana kategorilere geri dön
  const goBackToMain = () => {
    setCurrentView('main');
    setActiveMainCategory(null);
    setSubcategories([]);
  };

  // Ana kategorileri render et
  const renderMainCategories = () => {
    const displayCategories = showAllMainCategories 
      ? categories 
      : categories.slice(0, 10);
    const hasMoreCategories = categories.length > 10 && !showAllMainCategories;

    return (
      <>
        {displayCategories.map((cat: Category) => {
          if (!cat) return null;
          
          return (
            <div key={cat.id} className="space-y-1">
              <div 
                className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-1 rounded"
                onClick={(e) => handleMainCategoryClick(cat, e)}
              >
                <span className="text-xs text-gray-900">
                  {cat.name}
                </span>
                <div className="flex items-center">
                  {selectedCategory === cat.slug && (
                    <div className="w-1 h-3 bg-orange-500 rounded-full mr-2"></div>
                  )}
                  <svg 
                    className="w-3 h-3 text-gray-400"
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          );
        })}
        
        {/* Show more button */}
        {hasMoreCategories && (
          <button
            onClick={onToggleMainCategories}
            className="w-full text-left text-xs text-orange-500 hover:text-orange-600 font-medium p-1 rounded hover:bg-orange-50"
          >
            Tümünü Göster
          </button>
        )}
        
        {/* Show less button */}
        {showAllMainCategories && categories.length > 10 && (
          <button
            onClick={onToggleMainCategories}
            className="w-full text-left text-xs text-gray-500 hover:text-gray-600 font-medium p-1 rounded hover:bg-gray-50"
          >
            Daha az göster
          </button>
        )}
      </>
    );
  };

  // Alt kategorileri render et
  const renderSubCategories = () => {
    if (!activeMainCategory) return null;

    const displaySubCategories = showAllSubcategories 
      ? subcategories 
      : subcategories.slice(0, 10);
    const hasMoreSubCategories = subcategories.length > 10 && !showAllSubcategories;

    return (
      <>
        {/* Geri butonu */}
        <div className="mb-2">
          <button
            onClick={goBackToMain}
            className="flex items-center text-xs text-gray-600 hover:text-orange-500 p-1 rounded hover:bg-gray-50"
          >
            <svg 
              className="w-3 h-3 mr-1"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {activeMainCategory.name}
          </button>
        </div>

        {displaySubCategories.map((subCat: Category) => {
          if (!subCat) return null;
          
          return (
            <div key={subCat.id} className="space-y-1">
              <div 
                className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-1 rounded"
                onClick={() => {
                  onCategorySelect(subCat.slug);
                  window.location.href = `/${subCat.slug}`;
                }}
              >
                <span className="text-xs text-gray-600">
                  {subCat.name}
                </span>
                {selectedCategory === subCat.slug && (
                  <div className="w-1 h-3 bg-orange-500 rounded-full"></div>
                )}
              </div>
            </div>
          );
        })}
        
        {/* Show more button for subcategories */}
        {hasMoreSubCategories && (
          <button
            onClick={onToggleSubcategories}
            className="w-full text-left text-xs text-orange-500 hover:text-orange-600 font-medium p-1 rounded hover:bg-orange-50"
          >
            Tümünü Göster
          </button>
        )}
        
        {/* Show less button for subcategories */}
        {showAllSubcategories && subcategories.length > 10 && (
          <button
            onClick={onToggleSubcategories}
            className="w-full text-left text-xs text-gray-500 hover:text-gray-600 font-medium p-1 rounded hover:bg-gray-50"
          >
            Daha az göster
          </button>
        )}
      </>
    );
  };

  // Alt kategorileri ana kategoriler gibi render et (inline)
  const renderSubCategoriesInline = () => {
    if (!activeMainCategory) return null;

    const displaySubCategories = showAllSubcategories 
      ? subcategories 
      : subcategories.slice(0, 10);
    const hasMoreSubCategories = subcategories.length > 10 && !showAllSubcategories;

    return (
      <>
        {displaySubCategories.map((subCat: Category) => {
          if (!subCat) return null;
          
          return (
            <div key={subCat.id} className="space-y-1">
              <div 
                className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-1 rounded"
                onClick={() => {
                  onCategorySelect(subCat.slug);
                  window.location.href = `/${subCat.slug}`;
                }}
              >
                <span className="text-xs text-gray-900">
                  {subCat.name}
                </span>
                <div className="flex items-center">
                  {selectedCategory === subCat.slug && (
                    <div className="w-1 h-3 bg-orange-500 rounded-full mr-2"></div>
                  )}
                  <svg 
                    className="w-3 h-3 text-gray-400"
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          );
        })}
        
        {/* Show more button for subcategories */}
        {hasMoreSubCategories && (
          <button
            onClick={onToggleSubcategories}
            className="w-full text-left text-xs text-orange-500 hover:text-orange-600 font-medium p-1 rounded hover:bg-orange-50"
          >
            Tümünü Göster
          </button>
        )}
        
        {/* Show less button for subcategories */}
        {showAllSubcategories && subcategories.length > 10 && (
          <button
            onClick={onToggleSubcategories}
            className="w-full text-left text-xs text-gray-500 hover:text-gray-600 font-medium p-1 rounded hover:bg-gray-50"
          >
            Daha az göster
          </button>
        )}
      </>
    );
  };

  return (
    <div className="border-b border-gray-200">
      <div className="flex items-center justify-between p-3">
        <h3 className="font-medium text-gray-900 text-xs">
          {currentView === 'sub' && activeMainCategory ? activeMainCategory.name : 'Kategoriler'}
        </h3>
        <button className="w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center transition-transform duration-200">
          <svg className="w-2 h-2 text-white transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>
      </div>
      <div className="px-3 pb-3">
        <div className="space-y-1">
          {/* Geri butonu - sadece alt kategorilerdeyken göster */}
          {currentView === 'sub' && (
            <button
              onClick={goBackToMain}
              className="flex items-center text-xs text-gray-600 hover:text-orange-500 p-1 rounded hover:bg-gray-50 mb-2 w-full"
            >
              <svg 
                className="w-3 h-3 mr-1"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Ana Kategoriler
            </button>
          )}
          
          {loading ? (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500"></div>
              <span className="ml-2 text-xs text-gray-600">Yükleniyor...</span>
            </div>
          ) : (
            currentView === 'main' ? renderMainCategories() : renderSubCategoriesInline()
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryFilter;
