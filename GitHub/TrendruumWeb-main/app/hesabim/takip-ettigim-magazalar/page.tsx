import React from 'react';
import FollowedStoresPageClient from './FollowedStoresPageClient';

interface FollowedStore {
  id: string;
  name: string;
  slug: string;
  follow_count: number;
  updated_at: string;
  created_at: string;
}

// Server-side data fetching function
async function getFollowedStores(): Promise<FollowedStore[] | null> {
  try {
    // Server-side'da token'a erişim olmadığı için bu fonksiyon şimdilik boş bırakıldı.
    // Client-side'da localStorage'dan token alınıp fetch işlemi yapılacak.
    // Bu, SSR'ın ilk render'ında followedStores'ın null olacağı anlamına gelir.
    // Client component yüklendiğinde fetchFollowedStores çağrılacak.
    return null;
  } catch (error) {
    return null;
  }
}

// Server component
export default async function FollowedStoresPage() {
  const initialFollowedStores = await getFollowedStores();
  
  return (
    <FollowedStoresPageClient 
      initialFollowedStores={initialFollowedStores}
    />
  );
}