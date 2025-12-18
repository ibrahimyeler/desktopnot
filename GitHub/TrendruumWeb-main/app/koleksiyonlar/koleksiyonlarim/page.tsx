import React from 'react';
import CollectionsPageClient from './CollectionsPageClient';

interface Collection {
  id: string;
  name: string;
  description?: string;
  user_id: string;
  products: any[];
  created_at: string;
  updated_at: string;
}

// Server-side data fetching function
async function getCollections(token: string): Promise<Collection[] | null> {
  try {
    const axios = require('axios');
    
    const response = await axios.get('https://api.trendruum.com/api/v1/customer/likes/collections', {
      timeout: 10000,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      },
    });

    if (response.data?.meta?.status === 'success') {
      return response.data.data || [];
    }
    
    return null;
  } catch (error) {
    return null;
  }
}

// Server component
export default async function CollectionsPage() {
  // Note: In a real application, you would get the token from cookies or session
  // For now, we'll pass null and let the client component handle the API call
  const initialCollections = null; // We'll fetch this on the client side since we need localStorage token

  return (
    <CollectionsPageClient 
      initialCollections={initialCollections}
    />
  );
}