"use client";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { MenuProvider } from './context/MenuContext';
import toast from 'react-hot-toast';

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000,
        refetchOnWindowFocus: false,
      },
    },
  }));

  // Global error handler için toast listener
  useEffect(() => {
    const handleToastError = (event: CustomEvent) => {
      toast.error(event.detail.message);
    };

    window.addEventListener('show-toast-error', handleToastError as EventListener);

    return () => {
      window.removeEventListener('show-toast-error', handleToastError as EventListener);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <MenuProvider>
        {children}
      </MenuProvider>
    </QueryClientProvider>
  );
} 


