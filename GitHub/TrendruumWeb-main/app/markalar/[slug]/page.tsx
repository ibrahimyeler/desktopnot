import React from 'react'
import BrandPageClient from './BrandPageClient';

// Server-side data fetching functions
async function getBrandProducts(brandSlug: string, page: number = 1, perPage: number = 24) {
  try {
    const axios = require('axios');
    const response = await axios.get(`https://api.trendruum.com/api/v1/brands/${brandSlug}/products`, {
      timeout: 10000,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      params: {
        page,
        per_page: perPage
      }
    });
    
    if (response.data.meta.status === 'success') {
      return response.data;
    }
    return null;
  } catch (error) {
    return null;
  }
}

async function getBrandFilters(brandSlug: string) {
  try {
    const axios = require('axios');
    const response = await axios.get(`https://api.trendruum.com/api/v1/brands/${brandSlug}/filters`, {
      timeout: 10000,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    if (response.data.meta.status === 'success') {
      return response.data.data;
    }
    return null;
  } catch (error) {
    return null;
  }
}

// Server component
export default async function BrandPage({ params }: { params: { slug: string } }) {
  const brandSlug = decodeURIComponent(params.slug);
  
  // Server-side data fetching
  const [productsData, filtersData] = await Promise.all([
    getBrandProducts(brandSlug, 1, 24),
    getBrandFilters(brandSlug)
  ]);

  // Check if brand exists
  if (!productsData) {
    return (
      <BrandPageClient 
        brandSlug={brandSlug}
        initialProductsData={null}
        initialFiltersData={null}
        initialBrandData={null}
        brandNotFound={true}
      />
    );
  }

  // Format brand data
  let brandName = brandSlug;
  if (brandSlug.includes('_')) {
    brandName = brandSlug.split('_')[0];
  }
  
  let formattedBrandName = brandName
    .replace(/%20/g, ' ')
    .split('-')
    .map(word => {
      const turkishChars: { [key: string]: string } = {
        'i%c5%9f%c4%b1l': 'Işıl',
        'isil': 'Işıl',
        'işıl': 'Işıl',
        'aksesuar': 'Aksesuar'
      };
      
      const lowerWord = word.toLowerCase();
      for (const [encoded, correct] of Object.entries(turkishChars)) {
        if (lowerWord.includes(encoded) || lowerWord === correct.toLowerCase()) {
          return correct;
        }
      }
      
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
  
  const specialBrands: { [key: string]: string } = {
    'kinsmart': 'Kinsmart',
    '2mstore': '2M Store'
  };
  
  Object.keys(specialBrands).forEach(key => {
    if (brandName.toLowerCase().includes(key)) {
      formattedBrandName = formattedBrandName.replace(
        new RegExp(key, 'gi'), 
        specialBrands[key]
      );
    }
  });

  const brandData = {
    id: brandSlug,
    name: formattedBrandName,
    slug: brandSlug,
    product_count: productsData.pagination?.total || 0
  };

  return (
    <BrandPageClient 
      brandSlug={brandSlug}
      initialProductsData={productsData}
      initialFiltersData={filtersData}
      initialBrandData={brandData}
      brandNotFound={false}
    />
  );
}