"use client";

import { useState, useEffect } from 'react';
import { ChevronUpIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
// import { API_V1_URL } from '@/lib/config';


interface Category {
  id: string;
  name: string;
  slug: string;
  children?: Category[];
}

// Statik kategori listesi - resimdeki gibi
const STATIC_CATEGORIES = [
  { id: '1', name: 'Elektronik', slug: 'elektronik' },
  { id: '2', name: 'Moda', slug: 'moda' },
  { id: '3', name: 'Ev, Yaşam, Kırtasiye, Ofis', slug: 'ev-yasam-kirtasiye-ofis' },
  { id: '4', name: 'Oto, Bahçe, Yapı Market', slug: 'oto-bahce-yapi-market' },
  { id: '5', name: 'Anne, Bebek, Oyuncak', slug: 'anne-bebek-oyuncak' },
  { id: '6', name: 'Spor, Outdoor', slug: 'spor-outdoor' },
  { id: '7', name: 'Kozmetik, Kişisel Bakım', slug: 'kozmetik-kisisel-bakim' },
  { id: '8', name: 'Süpermarket, Pet Shop', slug: 'supermarket-pet-shop' },
  { id: '9', name: 'Kitap, Müzik, Film, Hobi', slug: 'kitap-muzik-film-hobi' }
];

export default function RelatedCategories() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showOnlyActive, setShowOnlyActive] = useState(false);
  
  const params = useParams();
  const router = useRouter();
  const categorySlug = params.category as string;
  
  // Sayfa yüklendiğinde mevcut kategori slug'ını active olarak ayarla
  useEffect(() => {
    if (categorySlug) {
      setActiveCategory(categorySlug);
      // Sayfa yüklendiğinde showOnlyActive'i false yap
      // böylece kullanıcı sayfayı yenilediğinde tüm kategoriler görünür
      setShowOnlyActive(false);
    }
  }, [categorySlug]);
  
  useEffect(() => {
    // Statik kategorileri kullan - API çağrısı yorum satırına alındı
    setLoading(true);
    
    // Statik kategorileri set et
    setCategories(STATIC_CATEGORIES);
    setError(null);
    setLoading(false);
    
    /* 
    // API çağrısı yorum satırına alındı
    const fetchCategories = async () => {
      if (!categorySlug) {
        setLoading(false);
        setError('Kategori bulunamadı');
        return;
      }
      
      try {
        setLoading(true);
        
        // Tüm kategorileri çekelim
        const allCategoriesResponse = await fetch(`${API_V1_URL}/categories`);
        const allCategoriesData = await allCategoriesResponse.json();
        
        if (allCategoriesData?.meta?.status === 'success' && allCategoriesData?.data) {
          const allCategories = allCategoriesData.data;
          
          // Breadcrumb'dan kategori yolunu alalım - hata kontrolü ekleyelim
          let breadcrumbTexts: string[] = [];
          try {
            const breadcrumbPath = document.querySelectorAll('.breadcrumb-item');
            breadcrumbTexts = Array.from(breadcrumbPath).map(item => item.textContent?.trim()).filter(Boolean) as string[];
          } catch (e) {
          }
          
          // Kategori ağacını dolaşarak slug'a göre kategoriyi bulalım
          const findCategoryBySlug = (categories: Category[], slug: string): Category | null => {
            for (const category of categories) {
              if (category.slug === slug) {
                return category;
              }
              
              if (category.children && category.children.length > 0) {
                const found = findCategoryBySlug(category.children, slug);
                if (found) return found;
              }
            }
            
            return null;
          };
          
          // Mevcut kategoriyi slug'a göre bulalım
          let targetCategory = findCategoryBySlug(allCategories, categorySlug);
          
          // Eğer slug ile kategori bulunamazsa ve breadcrumb varsa, breadcrumb ile arayalım
          if (!targetCategory && breadcrumbTexts.length > 0) {
            // Kategori ağacını dolaşarak breadcrumb'a göre kategoriyi bulalım
            const findCategoryByName = (categories: Category[], name: string): Category | null => {
              for (const category of categories) {
                // Kategori adı breadcrumb ile eşleşiyor mu?
                if (category.name && name && 
                    category.name.toLowerCase() === name.toLowerCase()) {
                  return category;
                }
                
                // Alt kategorilerde arama yapalım
                if (category.children && category.children.length > 0) {
                  const found = findCategoryByName(category.children, name);
                  if (found) return found;
                }
              }
              
              return null;
            };
            
            // Breadcrumb'daki son kategoriyi alalım
            const currentBreadcrumb = breadcrumbTexts[breadcrumbTexts.length - 1];
            targetCategory = findCategoryByName(allCategories, currentBreadcrumb);
          }
          
          // Eğer mevcut kategori bulunduysa, alt kategorilerini gösterelim
          if (targetCategory && targetCategory.children && targetCategory.children.length > 0) {
            const childCategories = targetCategory.children;
            
            const formattedCategories = childCategories.map(child => ({
              id: child.id || '',
              name: child.name || '',
              slug: child.slug || ''
            }));
            
            setCategories(formattedCategories);
            setError(null);
          } 
          // Eğer mevcut kategori bulunamadıysa veya alt kategorileri yoksa
          else {
            // Alt kategorisi yoksa, "İlgili kategori bulunamadı" mesajını gösterelim
            setCategories([]);
            setError('İlgili kategori bulunamadı');
          }
        } else {
          setCategories([]);
          setError('İlgili kategori bulunamadı');
        }
      } catch (error) {
        setCategories([]);
        setError('İlgili kategori bulunamadı');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
    */
  }, [categorySlug]);

  const visibleCategories = isExpanded ? categories : (categories || []).slice(0, 5);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
    // Eğer kapatılıyorsa, genişletilmiş durumu da sıfırla
    if (isOpen) {
      setIsExpanded(false);
    }
  };
  
  // Kategori linkine tıklandığında çağrılacak fonksiyon
  const handleCategoryClick = (categorySlug: string) => {
    setActiveCategory(categorySlug);
    setShowOnlyActive(true); // Sadece aktif kategoriyi göster
    
    // URL'i güncelle
    router.push(`/${categorySlug}`);
  };
  
  // Önceki kategorilere dön butonuna tıklandığında çağrılacak fonksiyon
  const handleBackToCategories = () => {
    setShowOnlyActive(false);
  };

  if (loading) {
    return (
      <div className="bg-white p-2.5 rounded-lg shadow-sm w-full max-w-[220px]">
        <div className="flex items-center justify-between mb-1.5">
          <h2 className="text-sm font-semibold text-gray-800">Tüm Kategoriler</h2>
        </div>
        <div className="animate-pulse space-y-2">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-3 rounded-lg w-full max-w-[240px] font-sans border border-orange-100">
      <div
        className="flex items-center justify-between mb-2 cursor-pointer"
        onClick={toggleOpen}
      >
        <h2 className="text-base font-semibold text-gray-700">Tüm Kategoriler</h2>
        <div className="flex items-center">
          <button
            className="p-1 hover:bg-orange-100 rounded-full transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              toggleOpen();
            }}
          >
            <ChevronUpIcon
              className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${
                isOpen ? "" : "rotate-180"
              }`}
            />
          </button>
        </div>
      </div>

      {isOpen && (
        <>
          {categories.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-2.5">
                {showOnlyActive ? (
                  // Sadece aktif kategoriyi göster
                  <>
                    {categories
                      .filter((category) => category.id === activeCategory)
                      .map((category) => (
                        <Link
                          key={category.id}
                          href={`?id=${category.id}`}
                          className="block w-full text-left text-sm bg-orange-50 text-orange-700 py-2 px-3 rounded transition-colors font-medium"
                        >
                          {category.name}
                        </Link>
                      ))}
                    <button
                      onClick={handleBackToCategories}
                      className="flex items-center mt-3 text-gray-600 hover:text-orange-500 transition-colors text-sm"
                    >
                      <ArrowLeftIcon className="w-4 h-4 mr-1" />
                    </button>
                  </>
                ) : (
                  // Tüm kategorileri göster
                  visibleCategories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/${category.slug}?id=${category.id}`}
                      className={`block w-full text-left text-sm py-2 px-3 rounded transition-colors hover:bg-orange-50 hover:text-orange-700 ${
                        activeCategory === category.id
                          ? "bg-orange-50 text-orange-700 font-medium"
                          : "text-gray-700"
                      }`}
                      onClick={(e) => {
                        e.preventDefault();
                        handleCategoryClick(category.slug);
                      }}
                    >
                      {category.name}
                    </Link>
                  ))
                )}
              </div>

              {!showOnlyActive && !isExpanded && categories.length > 5 && (
                <button
                  onClick={() => setIsExpanded(true)}
                  className="mt-3 text-orange-500 font-medium hover:text-orange-600 transition-colors text-sm w-full text-center"
                >
                  DAHA FAZLA GÖSTER
                </button>
              )}

              {!showOnlyActive && isExpanded && (
                <button
                  onClick={() => setIsExpanded(false)}
                  className="mt-3 text-orange-500 font-medium hover:text-orange-600 transition-colors text-sm w-full text-center"
                >
                  DAHA AZ GÖSTER
                </button>
              )}
            </>
          ) : (
            <div className="text-sm text-gray-500 py-2 px-3">
              {error || "İlgili kategori bulunamadı"}
            </div>
          )}
        </>
      )}
    </div>
  );
}
