import React from 'react'
import PaymentSuccessClient from './PaymentSuccessClient';

// Server-side data fetching function
async function getOrderDetails(orderId: string, token: string) {
  try {
    const axios = require('axios');
    const response = await axios.get(`https://api.trendruum.com/api/v1/customer/orders/${orderId}`, {
      timeout: 10000,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    if (response.data.meta?.status === 'success') {
      return response.data.data;
    }
    return null;
  } catch (error) {
    return null;
  }
}

// Server component
export default async function PaymentSuccessPage({ 
  searchParams 
}: { 
  searchParams: { [key: string]: string | string[] | undefined } 
}) {
  const orderId = searchParams.merchant_oid as string;
  
  // Note: In a real application, you would get the token from cookies or session
  // For now, we'll pass null and let the client component handle the API call
  const orderDetails = orderId ? null : null; // We'll fetch this on the client side since we need localStorage token

  return (
    <PaymentSuccessClient 
      orderId={orderId}
      initialOrderDetails={orderDetails}
    />
  );
}