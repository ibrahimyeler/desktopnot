import React from 'react';
import ResetPasswordPageClient from './ResetPasswordPageClient';
import { cookies } from 'next/headers';

// Server component
export default async function ResetPasswordPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value || '';
  
  return (
    <ResetPasswordPageClient 
      initialToken={token}
    />
  );
}