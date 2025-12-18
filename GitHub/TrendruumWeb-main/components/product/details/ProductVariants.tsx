"use client";

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { CheckIcon, MagnifyingGlassIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

interface ProductVariantsProps {
  variants: any[];
  onVariantSelect: (variantId: string, value: string) => void;
  availableVariants?: any[]; // API'den gelen tüm variant kombinasyonları
  onProductChange?: (productSlug: string) => void;
  onProductUpdate?: (productData: any) => void;
  currentSlug?: string;
}

export default function ProductVariants({ 
  variants, 
  onVariantSelect, 
  availableVariants = [], 
  onProductChange, 
  onProductUpdate, 
  currentSlug 
}: ProductVariantsProps) {
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [selectedVariantNames, setSelectedVariantNames] = useState<Record<string, string>>({});
  const [sizeSearchQuery, setSizeSearchQuery] = useState<string>('');
  const [showAllSizes, setShowAllSizes] = useState<boolean>(false);
  const [isSizeDropdownOpen, setIsSizeDropdownOpen] = useState<boolean>(false);
  const sizeDropdownRef = useRef<HTMLDivElement>(null);

  // API'den gelen variant verilerini kontrol et
  if (!availableVariants || availableVariants.length === 0) {
    return (
      <div className="space-y-6">
        <div className="text-sm text-gray-500">
          Varyant bilgileri yükleniyor...
        </div>
      </div>
    );
  }

  // API'den gelen tüm aktif ürünleri al (her biri ayrı bir varyant)
  const activeVariants = availableVariants.filter((variant: any) => variant.status === "active");
  
  if (activeVariants.length === 0) {
    return (
      <div className="space-y-6">
        <div className="text-sm text-gray-500">
          Aktif varyant bulunamadı...
        </div>
      </div>
    );
  }

  // İlk ürünün variants bilgisini kontrol et
  const firstProduct = activeVariants[0];
  if (!firstProduct.variants || firstProduct.variants.length === 0) {
    return (
      <div className="space-y-6">
        <div className="text-sm text-gray-500">
          Varyant bilgileri bulunamadı...
        </div>
      </div>
    );
  }

  // Renk ve beden variantlarını bul
  const colorVariant = firstProduct.variants.find((v: any) => 
    v.name.toLowerCase().includes('renk') || v.name.toLowerCase().includes('color')
  );
  
  const sizeVariant = firstProduct.variants.find((v: any) => 
    v.slug === 'beden' ||
    v.name.toLowerCase().includes('beden') || 
    v.name.toLowerCase().includes('yaş') || 
    v.name.toLowerCase().includes('yas') ||
    v.name.toLowerCase().includes('boyut') || 
    v.name.toLowerCase().includes('ebat') || 
    v.name.toLowerCase().includes('boyutebat') ||
    v.name.toLowerCase().includes('ölçü') || 
    v.name.toLowerCase().includes('olcu') || 
    v.slug === 'olcu'
  );

  // Eğer hiç variant yoksa, component'i render etme
  if (!colorVariant && !sizeVariant) {
    return (
      <div className="space-y-6">
        <div className="text-sm text-gray-500">
          Varyant bilgileri bulunamadı...
        </div>
      </div>
    );
  }

  // Tüm variant kombinasyonlarını işle
  const productCombinations: any[] = [];
  
  activeVariants.forEach((product, productIndex) => {
    const colorVariant = product.variants?.find((v: any) => 
      v.name.toLowerCase().includes('renk') || v.name.toLowerCase().includes('color')
    );
    
    const sizeVariant = product.variants?.find((v: any) => 
      v.slug === 'beden' ||
      v.name.toLowerCase().includes('beden') || 
      v.name.toLowerCase().includes('yaş') || 
      v.name.toLowerCase().includes('yas') || 
      v.name.toLowerCase().includes('boyut') || 
      v.name.toLowerCase().includes('ebat') || 
      v.name.toLowerCase().includes('boyutebat') ||
      v.name.toLowerCase().includes('ölçü') || 
      v.name.toLowerCase().includes('olcu') || 
      v.slug === 'olcu'
    );
    
    const color = colorVariant ? {
      name: colorVariant.value_name,
      slug: colorVariant.value_slug
    } : { name: 'Varsayılan', slug: 'default' };
    
    const size = sizeVariant ? {
      name: sizeVariant.value_name,
      slug: sizeVariant.value_slug
    } : { name: 'Varsayılan', slug: 'default' };
    
    productCombinations.push({
      id: product.id,
      baseProduct: product,
      color: color,
      size: size,
      stock: product.stock,
      price: product.price,
      medias: product.medias
    });
  });

  // Mevcut slug'a göre doğru varyantı seç veya ilk varyantı varsayılan yap
  useEffect(() => {
    if (productCombinations.length > 0 && (!selectedVariants['color'] && !selectedVariants['size'])) {
      let targetCombination = productCombinations[0]; // Varsayılan
      
      // Eğer currentSlug varsa, ona uygun kombinasyonu bul
      if (currentSlug) {
        const matchingCombination = productCombinations.find(c => 
          c.baseProduct.slug === currentSlug
        );
        
        if (matchingCombination) {
          targetCombination = matchingCombination;
        }
      }
      
      const newSelectedVariants: Record<string, string> = {};
      const newSelectedVariantNames: Record<string, string> = {};
      
      // Renk variantı varsa ekle
      if (colorVariant) {
        newSelectedVariants['color'] = targetCombination.color.slug;
        newSelectedVariantNames['color'] = targetCombination.color.name;
      }
      
      // Beden variantı varsa ekle
      if (sizeVariant) {
        newSelectedVariants['size'] = targetCombination.size.slug;
        newSelectedVariantNames['size'] = targetCombination.size.name;
      }
      
      setSelectedVariants(newSelectedVariants);
      setSelectedVariantNames(newSelectedVariantNames);
      
      // Parent component'e ürün güncellemesini bildir
      if (onProductUpdate) {
        onProductUpdate({
          id: targetCombination.id,
          price: targetCombination.price,
          stock: targetCombination.stock,
          images: targetCombination.medias?.map((media: any) => ({
            id: media.id,
            name: media.name,
            fullpath: media.fullpath,
            url: media.url,
            type: media.type
          })) || [],
          selectedVariant: targetCombination
        });
      }
      
      // Variant seçimini bildir
      if (colorVariant) {
        onVariantSelect('color', targetCombination.color.slug);
      }
      if (sizeVariant) {
        onVariantSelect('size', targetCombination.size.slug);
      }
    }
  }, [productCombinations, selectedVariants, onVariantSelect, onProductUpdate, currentSlug, colorVariant, sizeVariant]);

  // Dropdown dışına tıklandığında kapat
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sizeDropdownRef.current && !sizeDropdownRef.current.contains(event.target as Node)) {
        setIsSizeDropdownOpen(false);
      }
    };

    if (isSizeDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSizeDropdownOpen]);

  // Benzersiz renkleri çıkar (tüm renkler, stok kontrolü ayrı yapılacak)
  const uniqueColors = [...new Set(productCombinations.map(c => c.color.slug))]
    .map(slug => productCombinations.find(c => c.color.slug === slug)?.color)
    .filter(Boolean);
    
  const availableColors = uniqueColors.map((colorValue: any, index: number) => ({
      name: colorValue.name,
      slug: colorValue.slug,
      index: index
  }));

  // Seçili renge göre mevcut bedenleri filtrele ve sırala
  const getAvailableSizesForColor = (selectedColorSlug: string) => {
    if (!selectedColorSlug) return [];
    
    const colorCombinations = productCombinations.filter(c => c.color.slug === selectedColorSlug);
    const uniqueSizes = [...new Set(colorCombinations.map(c => c.size.slug))]
      .map(slug => colorCombinations.find(c => c.size.slug === slug)?.size)
      .filter(Boolean);
    
    // Bedenleri küçükten büyüğe doğru sırala
    const sizeOrder = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50'];
    
    return uniqueSizes.sort((a, b) => {
      const aIndex = sizeOrder.indexOf(a.name.toUpperCase());
      const bIndex = sizeOrder.indexOf(b.name.toUpperCase());
      
      if (aIndex !== -1 && bIndex !== -1) {
        return aIndex - bIndex;
      }
      
      if (aIndex !== -1) return -1;
      if (bIndex !== -1) return 1;
      
      return a.name.localeCompare(b.name);
    });
  };

  // Tüm mevcut bedenler (renk seçilmediğinde gösterilecek)
  const allAvailableSizes = [...new Set(productCombinations.map(c => c.size.slug))]
    .map(slug => productCombinations.find(c => c.size.slug === slug)?.size)
    .filter(Boolean)
    .sort((a, b) => {
      const sizeOrder = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50'];
      const aIndex = sizeOrder.indexOf(a.name.toUpperCase());
      const bIndex = sizeOrder.indexOf(b.name.toUpperCase());
      
      if (aIndex !== -1 && bIndex !== -1) {
        return aIndex - bIndex;
      }
      
      if (aIndex !== -1) return -1;
      if (bIndex !== -1) return 1;
      
      return a.name.localeCompare(b.name);
    });
    
  // Seçili renge göre bedenleri belirle
  const availableSizes = selectedVariants['color'] 
    ? getAvailableSizesForColor(selectedVariants['color'])
    : allAvailableSizes;

  // Beden arama filtresi
  const filteredSizes = useMemo(() => {
    const sizes = availableSizes.filter(sizeValue => sizeValue.name !== 'Varsayılan');
    
    if (!sizeSearchQuery.trim()) {
      return sizes;
    }
    
    const query = sizeSearchQuery.toLowerCase().trim();
    return sizes.filter(size => 
      size.name.toLowerCase().includes(query) ||
      size.slug.toLowerCase().includes(query)
    );
  }, [availableSizes, sizeSearchQuery]);

  // Çok fazla beden varsa (20'den fazla) ilk başta sadece bir kısmını göster
  const INITIAL_SIZE_LIMIT = 20;
  const hasManySizes = filteredSizes.length > INITIAL_SIZE_LIMIT;
  const displayedSizes = showAllSizes || !hasManySizes 
    ? filteredSizes 
    : filteredSizes.slice(0, INITIAL_SIZE_LIMIT);

  // Beden formatını kontrol et - "100-x-200" formatında mı?
  // firstProduct.variants içindeki herhangi bir variant'ın value_name'ine bak
  const isDimensionFormat = useMemo(() => {
    // firstProduct ve variants yoksa false döndür
    if (!firstProduct || !firstProduct.variants || firstProduct.variants.length === 0) {
      return false;
    }
    
    // "100-x-200", "200-x-200", "100 x 200", "100x200", "100-X-200" gibi formatları yakala
    // "200-x-200" formatı için: rakam + "-" + "x" + "-" + rakam
    // Pattern: rakam, tire, x karakteri, tire, rakam
    const dimensionPattern = /^\d+\s*-\s*[xX×]\s*-\s*\d+/;
    
    // Tüm variant'ları kontrol et - herhangi birinin value_name'i dimension formatında mı?
    const hasDimensionFormat = firstProduct.variants.some((variant: any) => {
      if (!variant.value_name) return false;
      const matches = dimensionPattern.test(variant.value_name);
      return matches;
    });
    
    return hasDimensionFormat;
  }, [firstProduct]);

  // Renk seçimi için ürün kartı render fonksiyonu
  const renderColorProductCard = (colorValue: any, index: number, isMobile = false) => {
    // Bu renk için ilk ürünü bul
    const colorProduct = productCombinations.find(combo => 
      combo.color.slug === colorValue.slug
    );
    
    if (!colorProduct) return null;
    
    const isSelected = selectedVariants['color'] === colorValue.slug;
    
    const baseClasses = `
      relative border rounded-lg transition-all duration-300
      overflow-hidden
      ${isSelected 
        ? 'border-orange-400 bg-orange-50 cursor-pointer ring-1 ring-orange-100' 
        : 'border-gray-200 hover:border-orange-300 cursor-pointer hover:scale-105'
      }
    `;

    const sizeClasses = isMobile
      ? 'min-w-[68px] max-w-[68px] h-20 flex-shrink-0'
      : 'w-full md:w-20 md:h-24';

    return (
      <div
        key={`color-${index}`}
        className={`${baseClasses} ${sizeClasses}`}
        onClick={() => {
          // Renk değiştiğinde, seçili bedeni sıfırla
          const newAvailableSizes = getAvailableSizesForColor(colorValue.slug);
          const currentSelectedSize = selectedVariants['size'];
          const isSizeStillAvailable = newAvailableSizes.some(size => size.slug === currentSelectedSize);
          
          // Yeni seçili kombinasyonu bul
          const newSelectedSize = isSizeStillAvailable ? currentSelectedSize : (newAvailableSizes[0]?.slug || '');
          const selectedCombination = productCombinations.find(c => 
            c.color.slug === colorValue.slug && 
            (newSelectedSize ? c.size.slug === newSelectedSize : true)
          );
          
          setSelectedVariants(prev => ({
            ...prev,
            'color': colorValue.slug,
            'size': newSelectedSize
          }));
          setSelectedVariantNames(prev => ({
            ...prev,
            'color': colorValue.name,
            'size': newSelectedSize ? newAvailableSizes.find(s => s.slug === newSelectedSize)?.name || '' : ''
          }));
          
          // Renk değiştiğinde arama sorgusunu sıfırla ve dropdown'u kapat
          setSizeSearchQuery('');
          setShowAllSizes(false);
          setIsSizeDropdownOpen(false);
          
          // Parent component'e ürün güncellemesini bildir
          if (selectedCombination && onProductUpdate) {
            onProductUpdate({
              price: selectedCombination.price,
              stock: selectedCombination.stock,
              images: selectedCombination.medias?.map((media: any) => ({
                id: media.id,
                name: media.name,
                fullpath: media.fullpath,
                url: media.url,
                type: media.type
              })) || [],
              selectedVariant: selectedCombination
            });
          }
          
          // URL'yi varyant slug'ına göre değiştir
          if (selectedCombination?.baseProduct?.slug && onProductChange) {
            onProductChange(selectedCombination.baseProduct.slug);
          }
          
          onVariantSelect('color', colorValue.slug);
        }}
      >
        {/* Seçili işareti */}
        {isSelected && (
          <div className="absolute top-1 right-1 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center z-20">
            <CheckIcon className="w-3 h-3 text-white" />
          </div>
        )}

        {/* Ürün resmi */}
        <div className="relative h-full w-full">
          {colorProduct.medias && colorProduct.medias.length > 0 ? (
            <Image
              src={colorProduct.medias[0].url}
              alt={colorValue.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 56px, 80px"
            />
          ) : (
              <div className={`w-full h-full bg-gray-100 flex items-center justify-center`}>
              <svg className="w-3 h-3 md:w-4 md:h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Variant adına göre başlık belirle
  const getSizeVariantTitle = () => {
    if (!sizeVariant) return 'Boyut:';
    
    // Eğer dimension formatındaysa (100-x-200 gibi) "En x Boy:" döndür
    if (isDimensionFormat) {
      return 'En x Boy:';
    }
    
    const variantName = sizeVariant.name.toLowerCase();
    if (variantName.includes('beden') || variantName.includes('yaş') || variantName.includes('yas')) {
      return 'Beden:';
    } else if (variantName.includes('boyut') || variantName.includes('ebat') || variantName.includes('boyutebat')) {
      return 'Ölçü:';
    }
    return 'Boyut:';
  };

  return (
    <div className="space-y-4">
      {/* Renk Seçimi - Sadece renk variantı varsa göster */}
      {colorVariant && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-light text-gray-700">Renk:</span>
              <span className="text-sm text-orange-600 font-light">
                {selectedVariantNames['color'] || 'Seçiniz'}
              </span>
            </div>
            <span className="text-xs text-gray-500">
              {availableColors.filter(colorValue => colorValue?.name !== 'Varsayılan').length} Seçenek
            </span>
          </div>
          
          {availableColors.length > 0 ? (
            <>
              {/* Mobil: Yatay scroll */}
              <div 
                className="md:hidden flex gap-3 overflow-x-auto pb-2 -mx-3 px-3"
                style={{ WebkitOverflowScrolling: 'touch' }}
              >
                {availableColors.filter(colorValue => colorValue.name !== 'Varsayılan').map((colorValue: any, index: number) => 
                  renderColorProductCard(colorValue, index, true)
                )}
              </div>
              
              {/* Desktop: Grid */}
              <div className="hidden md:grid md:grid-cols-4 lg:grid-cols-6 gap-3">
                {availableColors.filter(colorValue => colorValue.name !== 'Varsayılan').map((colorValue: any, index: number) => 
                  renderColorProductCard(colorValue, index)
                )}
              </div>
            </>
          ) : (
            <div className="text-sm text-gray-500">
              Renk seçenekleri bulunamadı...
            </div>
          )}
        </div>
      )}

      {/* Beden Seçimi - Renk variantı varsa renk seçildikten sonra, yoksa direkt göster */}
      {sizeVariant && (
        (!colorVariant || selectedVariants['color']) && (
        <div>
          {/* Dimension Format (100-x-200) için Dropdown */}
          {isDimensionFormat ? (
            <div ref={sizeDropdownRef} className="relative">
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {getSizeVariantTitle()}
                </label>
                
                {/* Dropdown Trigger Button */}
                <button
                  type="button"
                  onClick={() => setIsSizeDropdownOpen(!isSizeDropdownOpen)}
                  className="w-full flex items-center justify-between px-4 py-2.5 text-left bg-white border border-gray-300 rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-colors"
                >
                  <span className={`text-sm ${selectedVariantNames['size'] ? 'text-gray-900' : 'text-gray-500'}`}>
                    {selectedVariantNames['size'] || 'Seçiniz'}
                  </span>
                  {isSizeDropdownOpen ? (
                    <ChevronUpIcon className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDownIcon className="w-5 h-5 text-gray-400" />
                  )}
                </button>
              </div>

              {/* Dropdown Menu */}
              {isSizeDropdownOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-[400px] overflow-hidden">
                  {/* Beden Listesi */}
                  <div className="max-h-[320px] overflow-y-auto custom-scrollbar">
                    {filteredSizes.length > 0 ? (
                      filteredSizes.map((sizeValue: any, index: number) => {
                        const isSelected = selectedVariants['size'] === sizeValue.slug;
                        
                        // Stok kontrolü
                        const selectedColor = selectedVariants['color'];
                        const combination = colorVariant 
                          ? productCombinations.find(c => 
                              c.color.slug === selectedColor && c.size.slug === sizeValue.slug
                            )
                          : productCombinations.find(c => 
                              c.size.slug === sizeValue.slug
                            );
                        
                        const stock = combination?.stock || 0;
                        const isOutOfStock = stock <= 0;
                        
                        return (
                          <button
                            key={`size-dropdown-${index}`}
                            type="button"
                            disabled={isOutOfStock}
                            onClick={() => {
                              if (isOutOfStock) return;
                              
                              const selectedCombination = colorVariant 
                                ? productCombinations.find(c => 
                                    c.color.slug === selectedColor && c.size.slug === sizeValue.slug
                                  )
                                : productCombinations.find(c => 
                                    c.size.slug === sizeValue.slug
                                  );
                              
                              setSelectedVariants(prev => ({
                                ...prev,
                                'size': sizeValue.slug
                              }));
                              setSelectedVariantNames(prev => ({
                                ...prev,
                                'size': sizeValue.name
                              }));
                              
                              if (selectedCombination && onProductUpdate) {
                                onProductUpdate({
                                  id: selectedCombination.id,
                                  price: selectedCombination.price,
                                  stock: selectedCombination.stock,
                                  images: selectedCombination.medias?.map((media: any) => ({
                                    id: media.id,
                                    name: media.name,
                                    fullpath: media.fullpath,
                                    url: media.url,
                                    type: media.type
                                  })) || [],
                                  selectedVariant: selectedCombination
                                });
                              }
                              
                              if (selectedCombination?.baseProduct?.slug && onProductChange) {
                                onProductChange(selectedCombination.baseProduct.slug);
                              }
                              
                              onVariantSelect('size', sizeValue.slug);
                              setIsSizeDropdownOpen(false);
                            }}
                            className={`
                              w-full px-4 py-2.5 text-left text-sm transition-colors
                              ${isOutOfStock
                                ? 'text-gray-400 cursor-not-allowed line-through'
                                : isSelected
                                  ? 'bg-orange-50 text-orange-600 font-medium'
                                  : 'text-gray-700 hover:bg-gray-50'
                              }
                            `}
                          >
                            <div className="flex items-center justify-between">
                              <span>{sizeValue.name}</span>
                              {isSelected && !isOutOfStock && (
                                <CheckIcon className="w-5 h-5 text-orange-600" />
                              )}
                            </div>
                          </button>
                        );
                      })
                    ) : (
                      <div className="px-4 py-8 text-center text-sm text-gray-500">
                        Sonuç bulunamadı
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Normal Format (S, M, L, XL vb.) için Eski Grid Yapısı */
            <>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-light text-gray-700">{getSizeVariantTitle()}</span>
                  <span className="text-sm text-orange-600 font-light">
                    {selectedVariantNames['size'] || 'Seçiniz'}
                  </span>
                </div>
                <span className="text-xs text-gray-500">
                  {filteredSizes.length} {sizeSearchQuery ? 'sonuç' : 'Seçenek'}
                </span>
              </div>

              {/* Beden Arama - Sadece çok fazla seçenek varsa göster */}
              {availableSizes.filter(sizeValue => sizeValue.name !== 'Varsayılan').length > 10 && (
                <div className="mb-3 relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Beden ara..."
                    value={sizeSearchQuery}
                    onChange={(e) => {
                      setSizeSearchQuery(e.target.value);
                      setShowAllSizes(true);
                    }}
                    className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                  />
                  {sizeSearchQuery && (
                    <button
                      onClick={() => {
                        setSizeSearchQuery('');
                        setShowAllSizes(false);
                      }}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm"
                    >
                      ✕
                    </button>
                  )}
                </div>
              )}
              
              {/* Mobil: Yatay scroll */}
              <div 
                className="md:hidden flex gap-2 overflow-x-auto pb-2 -mx-3 px-3"
                style={{ WebkitOverflowScrolling: 'touch' }}
              >
            {displayedSizes.map((sizeValue: any, index: number) => {
              const isSelected = selectedVariants['size'] === sizeValue.slug;
              
              // Stok kontrolü - renk variantı varsa renk+beden kombinasyonunu, yoksa sadece beden kombinasyonunu bul
              const selectedColor = selectedVariants['color'];
              const combination = colorVariant 
                ? productCombinations.find(c => 
                    c.color.slug === selectedColor && c.size.slug === sizeValue.slug
                  )
                : productCombinations.find(c => 
                    c.size.slug === sizeValue.slug
                  );
              
              const stock = combination?.stock || 0;
              const isOutOfStock = stock <= 0;
              
              return (
                <button
                  key={`size-${index}`}
                  disabled={isOutOfStock}
                  onClick={() => {
                    if (isOutOfStock) return;
                    
                    // Renk variantı varsa renk+beden kombinasyonunu, yoksa sadece beden kombinasyonunu bul
                    const selectedCombination = colorVariant 
                      ? productCombinations.find(c => 
                          c.color.slug === selectedColor && c.size.slug === sizeValue.slug
                        )
                      : productCombinations.find(c => 
                          c.size.slug === sizeValue.slug
                        );
                    
                    setSelectedVariants(prev => ({
                      ...prev,
                      'size': sizeValue.slug
                    }));
                    setSelectedVariantNames(prev => ({
                      ...prev,
                      'size': sizeValue.name
                    }));
                    
                    // Parent component'e ürün güncellemesini bildir
                    if (selectedCombination && onProductUpdate) {
                      onProductUpdate({
                        id: selectedCombination.id,
                        price: selectedCombination.price,
                        stock: selectedCombination.stock,
                        images: selectedCombination.medias?.map((media: any) => ({
                          id: media.id,
                          name: media.name,
                          fullpath: media.fullpath,
                          url: media.url,
                          type: media.type
                        })) || [],
                        selectedVariant: selectedCombination
                      });
                    }
                    
                    // URL'yi varyant slug'ına göre değiştir
                    if (selectedCombination?.baseProduct?.slug && onProductChange) {
                      onProductChange(selectedCombination.baseProduct.slug);
                    }
                    
                    onVariantSelect('size', sizeValue.slug);
                  }}
                  className={`
                    group min-w-16 h-9 px-2 rounded-lg border transition-all duration-300 relative flex items-center justify-center whitespace-nowrap font-light overflow-hidden flex-shrink-0
                    ${isOutOfStock
                      ? 'border-gray-200 bg-gray-100 cursor-not-allowed text-gray-400'
                      : isSelected 
                        ? 'border-orange-400 bg-orange-500 text-white' 
                        : 'border-gray-300 bg-white hover:border-orange-300 hover:scale-105 text-black'
                    }
                  `}
                >
                  {sizeValue.name !== 'Varsayılan' && (
                    <span className="text-[10px] font-light leading-tight">
                      {sizeValue.name}
                    </span>
                  )}
                  
                  {/* Stokta olmayan bedenler için tam container boyunca çizgi */}
                  {isOutOfStock && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-full h-0.5 bg-gray-400 transform rotate-12 origin-center"></div>
                    </div>
                  )}
                  
                  {/* Stokta Yok Tooltip - Hover'da görünür */}
                  {isOutOfStock && (
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                      Stokta Yok
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-800"></div>
                    </div>
                  )}
                </button>
              );
            })}
              </div>
              
              {/* Desktop: Scrollable Container with Grid */}
              <div className="hidden md:block">
                <div 
                  className="grid grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 max-h-[320px] overflow-y-auto pr-2 custom-scrollbar"
                  style={{
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#d1d5db #f3f4f6'
                  }}
                >
                  {displayedSizes.map((sizeValue: any, index: number) => {
                    const isSelected = selectedVariants['size'] === sizeValue.slug;
                    
                    // Stok kontrolü
                    const selectedColor = selectedVariants['color'];
                    const combination = colorVariant 
                      ? productCombinations.find(c => 
                          c.color.slug === selectedColor && c.size.slug === sizeValue.slug
                        )
                      : productCombinations.find(c => 
                          c.size.slug === sizeValue.slug
                        );
                    
                    const stock = combination?.stock || 0;
                    const isOutOfStock = stock <= 0;
                    
                    return (
                      <button
                        key={`size-desktop-${index}`}
                        disabled={isOutOfStock}
                        onClick={() => {
                          if (isOutOfStock) return;
                          
                          const selectedCombination = colorVariant 
                            ? productCombinations.find(c => 
                                c.color.slug === selectedColor && c.size.slug === sizeValue.slug
                              )
                            : productCombinations.find(c => 
                                c.size.slug === sizeValue.slug
                              );
                          
                          setSelectedVariants(prev => ({
                            ...prev,
                            'size': sizeValue.slug
                          }));
                          setSelectedVariantNames(prev => ({
                            ...prev,
                            'size': sizeValue.name
                          }));
                          
                          if (selectedCombination && onProductUpdate) {
                            onProductUpdate({
                              id: selectedCombination.id,
                              price: selectedCombination.price,
                              stock: selectedCombination.stock,
                              images: selectedCombination.medias?.map((media: any) => ({
                                id: media.id,
                                name: media.name,
                                fullpath: media.fullpath,
                                url: media.url,
                                type: media.type
                              })) || [],
                              selectedVariant: selectedCombination
                            });
                          }
                          
                          if (selectedCombination?.baseProduct?.slug && onProductChange) {
                            onProductChange(selectedCombination.baseProduct.slug);
                          }
                          
                          onVariantSelect('size', sizeValue.slug);
                        }}
                        className={`
                          group w-full h-8 px-1.5 rounded-md border transition-all duration-200 relative flex items-center justify-center whitespace-nowrap font-light overflow-hidden
                          ${isOutOfStock
                            ? 'border-gray-200 bg-gray-50 cursor-not-allowed text-gray-400'
                            : isSelected 
                              ? 'border-orange-400 bg-orange-500 text-white shadow-sm' 
                              : 'border-gray-200 bg-white hover:border-orange-300 hover:bg-orange-50 text-gray-700'
                          }
                        `}
                      >
                        {sizeValue.name !== 'Varsayılan' && (
                          <span className="text-[10px] font-light leading-tight truncate w-full text-center">
                            {sizeValue.name}
                          </span>
                        )}
                        
                        {/* Stokta olmayan bedenler için tam container boyunca çizgi */}
                        {isOutOfStock && (
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-full h-0.5 bg-gray-400 transform rotate-12 origin-center"></div>
                          </div>
                        )}
                        
                        {/* Stokta Yok Tooltip - Hover'da görünür */}
                        {isOutOfStock && (
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                            Stokta Yok
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-800"></div>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Daha Fazla Göster Butonu */}
                {hasManySizes && !showAllSizes && (
                  <button
                    onClick={() => setShowAllSizes(true)}
                    className="mt-3 w-full py-2 text-sm text-orange-600 hover:text-orange-700 border border-orange-300 rounded-lg hover:bg-orange-50 transition-colors duration-200"
                  >
                    + {filteredSizes.length - INITIAL_SIZE_LIMIT} Beden Daha Göster
                  </button>
                )}

                {/* Daha Az Göster Butonu */}
                {hasManySizes && showAllSizes && (
                  <button
                    onClick={() => {
                      setShowAllSizes(false);
                      const container = document.querySelector('.custom-scrollbar');
                      if (container) {
                        container.scrollTop = 0;
                      }
                    }}
                    className="mt-3 w-full py-2 text-sm text-gray-600 hover:text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    Daha Az Göster
                  </button>
                )}
              </div>
            </>
          )}
        </div>
        )
      )}
    </div>
  );
} 