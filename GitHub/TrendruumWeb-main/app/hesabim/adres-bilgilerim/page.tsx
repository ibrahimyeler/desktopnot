import React from 'react'
import AddressPageClient from './AddressPageClient';
import Header from '@/components/layout/Header';
import ScrollToTop from '@/components/ui/ScrollToTop';
import { API_V1_URL } from '@/lib/config';

// Server-side data fetching function
async function getCities() {
  try {
    // Doğru endpoint'i kullan: /locations/countries/turkiye veya /countries/tr
    const response = await fetch(`${API_V1_URL}/locations/countries/turkiye`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      next: { revalidate: 3600 } // 1 saat cache
    });
    
    if (!response.ok) {
      // Eğer bu endpoint çalışmazsa alternatif endpoint'i dene
      const altResponse = await fetch(`${API_V1_URL}/countries/tr`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        next: { revalidate: 3600 }
      });
      
      if (!altResponse.ok) {
        return [];
      }
      
      const altData = await altResponse.json();
      if (altData.meta?.status === 'success') {
        return altData.data?.cities || altData.data || [];
      }
      return [];
    }
    
    const data = await response.json();
    if (data.meta?.status === 'success') {
      return data.data?.cities || data.data || [];
    }
    return [];
  } catch (error) {
    // Hata durumunda boş array döndür, sayfa yine de çalışsın
    if (process.env.NODE_ENV !== 'production') {
    }
    return [];
  }
}

// Server component
export default async function AddressesPage() {
  // Server-side data fetching
  const cities = await getCities();
  
  const locationData = {
    cities,
    districts: {},
    neighborhoods: {}
  };

  return (
    <>
      <Header showBackButton={false} />
      <AddressPageClient 
        initialLocationData={locationData}
      />
      <ScrollToTop />
    </>
  );
}
