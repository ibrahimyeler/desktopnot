import React from 'react'
import CollectionsPageClient from './CollectionsPageClient';

// Server-side data fetching function
async function getCollections(token: string) {
  try {
    const axios = require('axios');
    const response = await axios.get('https://api.trendruum.com/api/v1/customer/likes/collections', {
      timeout: 10000,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    if (response.data?.meta?.status === 'success') {
      return response.data.data || [];
    }
    return [];
  } catch (error) {
    return [];
  }
}

// Server component
export default async function CollectionsPage() {
  // Note: In a real application, you would get the token from cookies or session
  // For now, we'll pass null and let the client component handle the API call
  const collections = null; // We'll fetch this on the client side since we need localStorage token

  return (
    <CollectionsPageClient 
      initialCollections={collections}
    />
  );
}