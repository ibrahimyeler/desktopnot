import { BookmarkIcon, XMarkIcon } from '@heroicons/react/24/outline';
import React from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface SuggestedCollection {
  name: string;
  emoji: string;
}

interface NewCollectionPopupProps {
  open: boolean;
  onClose: () => void;
  collectionName: string;
  setCollectionName: (name: string) => void;
  onCreate: () => void;
  suggestedCollections: SuggestedCollection[];
}

export default function NewCollectionPopup({ 
  open, 
  onClose, 
  collectionName, 
  setCollectionName, 
  onCreate, 
  suggestedCollections 
}: NewCollectionPopupProps) {
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  if (!open) return null;

  const handleCreateCollection = async () => {
    if (!isLoggedIn) {
      toast.error('Koleksiyon oluşturmak için giriş yapmalısınız');
      router.push('/giris');
      return;
    }

    // Ana sayfadaki onCreate fonksiyonunu çağır
    onCreate();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-xl sm:rounded-2xl w-full max-w-md mx-2 sm:mx-4 relative max-h-[90vh] overflow-y-auto">
        <button 
          onClick={onClose} 
          className="absolute right-3 sm:right-4 top-3 sm:top-4 text-gray-400 hover:text-gray-600 z-10"
        >
          <XMarkIcon className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
        <div className="p-4 sm:p-5">
          <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-4 sm:mb-5 bg-[#FFF8F3] rounded-full flex items-center justify-center">
            <BookmarkIcon className="w-6 h-6 sm:w-7 sm:h-7 text-[#F27A1A]" />
          </div>
          <h2 className="text-lg sm:text-xl font-semibold text-center text-gray-900 mb-4 sm:mb-6 pr-8">
            KOLEKSİYON ADI SEÇİN
          </h2>
          <div className="mb-4 sm:mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Koleksiyon Adı</label>
            <input
              type="text"
              value={collectionName}
              onChange={(e) => setCollectionName(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-md focus:ring-[#F27A1A] focus:border-[#F27A1A] outline-none text-gray-900 placeholder-gray-500 text-sm sm:text-base"
              placeholder="Koleksiyon adını yazın"
            />
          </div>
          <div className="mb-4 sm:mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2 sm:mb-3">Önerilen</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {suggestedCollections.map((collection, index) => (
                <button
                  key={index}
                  onClick={() => setCollectionName(collection.name)}
                  className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-md hover:border-[#F27A1A] hover:bg-[#FFF8F3] transition-colors text-left w-full"
                >
                  <span className="text-base">{collection.emoji}</span>
                  <span className="text-sm text-gray-900 truncate">{collection.name}</span>
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={handleCreateCollection}
            disabled={!collectionName.trim()}
            className={`w-full py-2.5 sm:py-3 rounded-md text-white text-sm sm:text-base font-medium transition-colors
              ${collectionName.trim() ? 'bg-[#F27A1A] hover:bg-[#F27A1A]/90' : 'bg-gray-300 cursor-not-allowed'}`}
          >
            Koleksiyon Oluştur
          </button>
        </div>
      </div>
    </div>
  );
}
