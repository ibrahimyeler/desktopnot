"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import FavoritesList from '@/components/favorites/FavoritesList';
import { useBasket } from '@/app/context/BasketContext';
import { useFavorites } from '@/app/context/FavoriteContext';
import toast from 'react-hot-toast';
import FavoritesTabs from '@/components/favorites/FavoritesTabs';
import { useAuth } from '@/app/context/AuthContext';
import { Bars3Icon, XMarkIcon, ArrowLeftIcon, HeartIcon } from '@heroicons/react/24/outline';
import Header from '@/components/layout/Header';
import ScrollToTop from '@/components/ui/ScrollToTop';
import AccountSidebar from '@/components/account/AccountSidebar';

export default function FavoritesPageClient() {
  const router = useRouter();
  const { isLoggedIn, checkAuth } = useAuth();
  const { addToBasket } = useBasket();
  const { refreshFavorites } = useFavorites();
  const [addedToCart, setAddedToCart] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuthentication = async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      
      if (!token) {
        const currentPath = window.location.pathname;
        router.replace(`/giris?redirect=${encodeURIComponent(currentPath)}`);
        return;
      }

      try {
        await checkAuth();
        if (!isLoggedIn) {
          const currentPath = window.location.pathname;
          router.replace(`/giris?redirect=${encodeURIComponent(currentPath)}`);
        }
      } catch (error) {
        const currentPath = window.location.pathname;
        router.replace(`/giris?redirect=${encodeURIComponent(currentPath)}`);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuthentication();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isCheckingAuth || isLoggedIn === undefined) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-8 sm:py-12 lg:py-16 xl:py-20">
          <div className="flex items-center justify-center py-24">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F27A1A]"></div>
          </div>
        </div>
      </div>
    );
  }

  if (isLoggedIn === false) {
    return null;
  }

  const handleRemove = async (productId: string) => {
    try {
      await refreshFavorites(); // Refresh the favorites list after removal
    } catch (error) {
      toast.error('Favoriler güncellenirken bir hata oluştu');
    }
  };

  const handleAddToCart = async (productId: string) => {
    try {
      await addToBasket(productId, 1);
      setAddedToCart(productId);
      // Success message is already handled in addToBasket function
    } catch (error) {
      // Only show error if it's not already handled by addToBasket
    }
  };

  return (
    <>
      <Header showBackButton={true} onBackClick={() => window.history.back()} />
      <div className="bg-white min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 pt-16 md:pt-0 pb-4 sm:py-8 lg:py-12 xl:py-16 2xl:py-20">
          {/* Desktop Header */}
          <div className="hidden sm:flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => window.history.back()}
                aria-label="Geri"
                className="p-1.5 rounded-md hover:bg-gray-100 transition-colors text-gray-600 hover:text-gray-900"
              >
                <ArrowLeftIcon className="w-5 h-5" />
              </button>
              <HeartIcon className="w-6 h-6 text-orange-500" />
              <h1 className="text-xl font-semibold text-gray-900">Favorilerim</h1>
            </div>
          </div>


          <div className="flex gap-4 lg:gap-6 xl:gap-8 2xl:gap-12 items-start">
            {/* Desktop Sidebar - Sticky positioned */}
            <div className="hidden lg:block flex-shrink-0">
              <AccountSidebar />
            </div>

            {/* Mobile Sidebar Overlay - Enhanced */}
            {sidebarOpen && (
              <div className="fixed inset-0 z-50 lg:hidden">
                {/* Backdrop */}
                <div 
                  className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300" 
                  onClick={() => setSidebarOpen(false)} 
                />
                
                {/* Sidebar */}
                <div className="fixed left-0 top-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out overflow-hidden">
                  {/* Sidebar Header */}
                  <div className="bg-white border-b border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">Favorilerim</h2>
                        <p className="text-gray-600 text-sm mt-1">Menüyü keşfedin</p>
                      </div>
                      <button
                        onClick={() => setSidebarOpen(false)}
                        className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-all"
                      >
                        <XMarkIcon className="w-6 h-6 text-gray-700" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Sidebar Content */}
                  <div className="flex-1 overflow-y-auto">
                    <div className="p-4">
                      <AccountSidebar onItemClick={() => setSidebarOpen(false)} />
                    </div>
                  </div>
                  
                  {/* Sidebar Footer */}
                  <div className="border-t border-gray-200 p-4 bg-white">
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Trendruum hesap yönetimi</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Main Content - Enhanced mobile spacing */}
            <div className="flex-1 w-full">
              <FavoritesTabs activeTab="favorites" />
              <div className="mt-4 sm:mt-6">
                <FavoritesList
                  onRemove={handleRemove}
                  onAddToCart={handleAddToCart}
                  addedToCart={addedToCart}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <ScrollToTop />
    </>
  );
}
