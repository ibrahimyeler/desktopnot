import React from 'react';
import ForgotPasswordPageClient from './ForgotPasswordPageClient';
import { cookies } from 'next/headers';

// Server component
export default async function ForgotPasswordPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value || '';
  
  return (
    <ForgotPasswordPageClient 
      initialToken={token}
    />
  );
}