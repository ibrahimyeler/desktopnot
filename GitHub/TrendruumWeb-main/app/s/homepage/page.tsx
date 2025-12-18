'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomepagePage() {
  const router = useRouter();

  useEffect(() => {
    // Otomatik olarak ana sayfaya yönlendir
    router.replace('/');
  }, [router]);

  // Yönlendirme sırasında gösterilecek loading
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Ana sayfaya yönlendiriliyor...</p>
      </div>
    </div>
  );
} 