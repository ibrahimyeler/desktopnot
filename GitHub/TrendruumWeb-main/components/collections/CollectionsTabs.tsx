"use client";

import { PlusIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface CollectionsTabsProps {
  activeTab: string;
  collectionsCount: number;
  followingCount: number;
  onNewCollectionClick: () => void;
}

export default function CollectionsTabs({ activeTab, collectionsCount, followingCount, onNewCollectionClick }: CollectionsTabsProps) {
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  const handleNewCollectionClick = () => {
    if (!isLoggedIn) {
      toast.error('Koleksiyon oluşturmak için giriş yapmalısınız');
      router.push('/giris');
      return;
    }
    onNewCollectionClick();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-4 sm:px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
          <div className="flex space-x-4 sm:space-x-6 overflow-x-auto">
            <button
              className={`px-4 sm:px-6 py-2 text-sm font-medium rounded-lg whitespace-nowrap flex-shrink-0 ${
                activeTab === 'collections'
                  ? 'text-orange-500 bg-orange-50 border border-orange-200'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              Koleksiyonlarım ({collectionsCount})
            </button>
          
          
          </div>
          <button
            onClick={handleNewCollectionClick}
            className="inline-flex items-center justify-center px-4 sm:px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#F27A1A] hover:bg-[#F27A1A]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F27A1A] w-full sm:w-auto"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            <span className="hidden sm:inline">Koleksiyon Oluştur</span>
            <span className="sm:hidden">Oluştur</span>
          </button>
        </div>
      </div>
    </div>
  );
} 