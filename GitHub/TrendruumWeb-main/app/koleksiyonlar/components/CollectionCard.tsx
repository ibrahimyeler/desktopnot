import { useState, useEffect } from 'react';
import { BookmarkIcon, EllipsisVerticalIcon, PlusIcon, PencilIcon, TrashIcon, XMarkIcon, Square2StackIcon, CheckIcon } from '@heroicons/react/24/outline';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import axios from 'axios';
import { API_V1_URL } from '@/lib/config';
import toast from 'react-hot-toast';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface Product {
  id: string;
  name: string;
  price: number;
  images?: { url: string }[];
  medias?: { url: string }[];
  isSelected?: boolean;
}

interface CollectionProduct {
  id: string;
  name: string;
  price: number;
  images?: { url: string }[];
  medias?: { url: string }[];
}

interface CollectionCardProps {
  name: string;
  description?: string;
  emoji?: string;
  productCount?: number;
  collectionId: string;
  onEdit: (newName: string, newDescription?: string) => void;
  onDelete: () => void;
  onProductAdded?: () => void;
}

export default function CollectionCard({ 
  name, 
  description, 
  emoji = "📁", 
  productCount = 0, 
  collectionId,
  onEdit, 
  onDelete,
  onProductAdded 
}: CollectionCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showAddProductPopup, setShowAddProductPopup] = useState(false);
  const [editName, setEditName] = useState(name);
  const [editDescription, setEditDescription] = useState(description || '');
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [collectionProducts, setCollectionProducts] = useState<CollectionProduct[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  // Koleksiyon ürünlerini getir
  const fetchCollectionProducts = async () => {
    try {
      setLoadingProducts(true);
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await axios.get(`${API_V1_URL}/customer/likes/collections/products/${collectionId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (response.data?.meta?.status === 'success') {
        setCollectionProducts(response.data.data || []);
      }
    } catch (error) {
    } finally {
      setLoadingProducts(false);
    }
  };

  // Component mount olduğunda koleksiyon ürünlerini getir
  useEffect(() => {
    fetchCollectionProducts();
  }, [collectionId]);

  // Favorileri getir
  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
        return;
      }

      const response = await axios.get(`${API_V1_URL}/customer/likes`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (response.data?.meta?.status === 'success') {
        setFavorites(response.data.data || []);
      }
    } catch (error) {
      toast.error('Favoriler yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  // Ürün seçimi toggle
  const toggleProductSelection = (productId: string) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  // Seçili ürünleri koleksiyona ekle
  const handleAddSelectedProducts = async () => {
    if (selectedProducts.length === 0) {
      toast.error('Lütfen en az bir ürün seçin');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
        return;
      }

      // Her seçili ürün için API çağrısı yap
      const promises = selectedProducts.map(productId =>
        axios.post(
          `${API_V1_URL}/customer/likes/collections/products/${collectionId}`,
          { product_id: productId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          }
        )
      );

      await Promise.all(promises);
      
      toast.success(`${selectedProducts.length} ürün koleksiyona eklendi`);
      setShowAddProductPopup(false);
      setSelectedProducts([]);
      onProductAdded?.();
      // Koleksiyon ürünlerini yenile
      fetchCollectionProducts();
    } catch (error: any) {
      toast.error('Ürünler eklenirken bir hata oluştu');
    }
  };

  const handleEdit = () => {
    onEdit(editName, editDescription);
    setShowEditPopup(false);
    setShowMenu(false);
  };

  const handleDelete = () => {
    onDelete();
    setShowDeleteConfirm(false);
    setShowMenu(false);
  };

  // Popup açıldığında favorileri getir
  useEffect(() => {
    if (showAddProductPopup) {
      fetchFavorites();
    }
  }, [showAddProductPopup]);

  return (
    <>
      <div className="bg-white rounded-md border border-gray-200">
        {/* Collection Header */}
        <div className="px-2.5 py-2 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2 flex-1">
            <div className="text-center flex-1">
              <h3 className="text-sm font-medium text-gray-900">{name}</h3>
              {description && (
                <p className="text-xs text-gray-500 mt-0.5">{description}</p>
              )}
            </div>
          </div>
          <div className="relative">
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="text-gray-400 hover:text-gray-600 p-0.5"
            >
              <EllipsisVerticalIcon className="w-4 h-4" />
            </button>

            {/* Dropdown Menu */}
            {showMenu && (
              <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-md border border-gray-200 z-10">
                <div className="py-0.5">
                  <button 
                    onClick={() => {
                      setShowAddProductPopup(true);
                      setShowMenu(false);
                    }}
                    className="w-full px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-1.5"
                  >
                    <PlusIcon className="w-3.5 h-3.5" />
                    Ürün Ekle
                  </button>
                  <button 
                    onClick={() => {
                      setShowEditPopup(true);
                      setShowMenu(false);
                    }}
                    className="w-full px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-1.5"
                  >
                    <PencilIcon className="w-3.5 h-3.5" />
                    Koleksiyon Adı Düzenle
                  </button>
                  <button 
                    onClick={() => {
                      setShowDeleteConfirm(true);
                      setShowMenu(false);
                    }}
                    className="w-full px-3 py-1.5 text-xs text-red-600 hover:bg-gray-50 flex items-center gap-1.5"
                  >
                    <TrashIcon className="w-3.5 h-3.5" />
                    Koleksiyonu Sil
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Collection Content */}
        <div className="relative">
          {loadingProducts ? (
            <div className="aspect-square bg-gray-50 flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#F27A1A]"></div>
            </div>
          ) : collectionProducts.length > 0 ? (
            collectionProducts.length <= 5 ? (
              // 5 veya daha az ürün varsa grid göster
              <div className="grid grid-cols-5 gap-1 p-2">
                {collectionProducts.map((product) => (
                  <div key={product.id} className="relative aspect-square">
                    <img
                      src={product.images?.[0]?.url || product.medias?.[0]?.url || '/placeholder-product.jpg'}
                      alt={product.name}
                      className="w-full h-full object-cover rounded-md"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder-product.jpg';
                      }}
                    />
                  </div>
                ))}
              </div>
            ) : (
              // 5'ten fazla ürün varsa Swiper göster
              <div className="relative">
                <Swiper
                  modules={[Navigation, Pagination]}
                  spaceBetween={4}
                  slidesPerView={5}
                  navigation={{
                    nextEl: '.swiper-button-next-collection',
                    prevEl: '.swiper-button-prev-collection',
                  }}
                  pagination={{ clickable: true }}
                  className="collection-swiper"
                >
                  {collectionProducts.map((product) => (
                    <SwiperSlide key={product.id}>
                      <div className="relative aspect-square">
                        <img
                          src={product.images?.[0]?.url || product.medias?.[0]?.url || '/placeholder-product.jpg'}
                          alt={product.name}
                          className="w-full h-full object-cover rounded-md"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/placeholder-product.jpg';
                          }}
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
                
                {/* Custom Navigation Buttons */}
                <div className="swiper-button-prev-collection absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 rounded-full p-1 shadow-md cursor-pointer">
                  <svg className="w-3 h-3 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </div>
                
                <div className="swiper-button-next-collection absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 rounded-full p-1 shadow-md cursor-pointer">
                  <svg className="w-3 h-3 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>

                {/* Custom Swiper Styles */}
                <style jsx>{`
                  .collection-swiper .swiper-pagination-bullet {
                    background-color: rgba(255, 255, 255, 0.8);
                    opacity: 0.5;
                    width: 6px;
                    height: 6px;
                  }
                  
                  .collection-swiper .swiper-pagination-bullet-active {
                    background-color: #F27A1A;
                    opacity: 1;
                  }
                `}</style>
              </div>
            )
          ) : (
            <div className="grid grid-cols-5 gap-1 p-2">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="aspect-square bg-gray-50 flex items-center justify-center rounded-md">
                  <div className="text-center">
                    <BookmarkIcon className="w-4 h-4 text-gray-300 mx-auto mb-1" />
                    <p className="text-xs text-gray-400">Boş</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Product Count */}
        <div className="px-2.5 py-1.5 border-t border-gray-100">
          <span className="text-xs text-gray-500">
            {collectionProducts.length} Ürün
          </span>
        </div>
      </div>

      {/* Edit Collection Popup */}
      {showEditPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-md mx-4 relative">
            <button 
              onClick={() => setShowEditPopup(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>

            <div className="p-5">
              <div className="w-14 h-14 mx-auto mb-5 bg-[#FFF8F3] rounded-full flex items-center justify-center">
                <BookmarkIcon className="w-7 h-7 text-[#F27A1A]" />
              </div>

              <h2 className="text-xl font-semibold text-center text-gray-900 mb-6">
                KOLEKSİYON ADI SEÇİN
              </h2>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Koleksiyon Adı
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#F27A1A] focus:border-[#F27A1A] outline-none text-gray-900 placeholder-gray-500"
                  placeholder="Koleksiyon adını yazın"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Açıklama (İsteğe bağlı)
                </label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#F27A1A] focus:border-[#F27A1A] outline-none text-gray-900 placeholder-gray-500 resize-none"
                  placeholder="Koleksiyon açıklamasını yazın"
                  rows={3}
                />
              </div>

              <button
                onClick={handleEdit}
                disabled={!editName.trim()}
                className={`w-full py-2.5 rounded-md text-white text-base font-medium
                  ${editName.trim() 
                    ? 'bg-[#F27A1A] hover:bg-[#F27A1A]/90' 
                    : 'bg-gray-300 cursor-not-allowed'}`}
              >
                Koleksiyon Güncelle
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Popup */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-md mx-4 p-5 relative">
            <button 
              onClick={() => setShowDeleteConfirm(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>

            <div className="text-center">
              <div className="w-14 h-14 mx-auto mb-4 bg-red-50 rounded-full flex items-center justify-center">
                <TrashIcon className="w-7 h-7 text-red-600" />
              </div>

              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Koleksiyonu Silmek İstediğinize Emin misiniz?
              </h3>
              <p className="text-sm text-gray-500 mb-2">
                <strong>"{name}"</strong> koleksiyonu kalıcı olarak silinecek.
              </p>
              <p className="text-sm text-gray-500 mb-6">
                Bu işlem geri alınamaz ve koleksiyondaki tüm ürünler de silinecektir.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm font-medium"
                >
                  Vazgeç
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm font-medium"
                >
                  Sil
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Product Popup */}
      {showAddProductPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-4xl mx-4 relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setShowAddProductPopup(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>

            <div className="p-6">
              <div className="w-14 h-14 mx-auto mb-5 bg-[#FFF8F3] rounded-full flex items-center justify-center">
                <PlusIcon className="w-7 h-7 text-[#F27A1A]" />
              </div>

              <h2 className="text-xl font-semibold text-center text-gray-900 mb-6">
                Favorilerinden Ürün Seç
              </h2>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F27A1A]"></div>
                </div>
              ) : favorites.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 mb-4">Favorilerinizde ürün bulunamadı.</p>
                  <p className="text-sm text-gray-400">Koleksiyonunuza ürün eklemek için önce favorilerinize ürün eklemelisiniz.</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
                    {favorites.map(product => (
                      <div
                        key={product.id}
                        className={`relative border-2 rounded-lg p-3 cursor-pointer ${
                          selectedProducts.includes(product.id) 
                            ? 'border-[#F27A1A] bg-[#FFF8F3]' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => toggleProductSelection(product.id)}
                      >
                        {/* Checkbox */}
                        <div className={`absolute top-2 left-2 w-5 h-5 rounded border-2 flex items-center justify-center ${
                          selectedProducts.includes(product.id)
                            ? 'bg-[#F27A1A] border-[#F27A1A]'
                            : 'bg-white border-gray-300'
                        }`}>
                          {selectedProducts.includes(product.id) && (
                            <CheckIcon className="w-3 h-3 text-white" />
                          )}
                        </div>

                        {/* Product Image */}
                        <div className="aspect-square bg-gray-100 rounded-md mb-3 flex items-center justify-center">
                          {product.images?.[0] || product.medias?.[0] ? (
                            <img
                              src={product.images?.[0]?.url || product.medias?.[0]?.url}
                              alt={product.name}
                              className="w-full h-full object-cover rounded-md"
                            />
                          ) : (
                            <BookmarkIcon className="w-8 h-8 text-gray-400" />
                          )}
                        </div>

                        {/* Product Info */}
                        <div className="text-center">
                          <h3 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2">
                            {product.name}
                          </h3>
                          <p className="text-sm font-bold text-[#F27A1A]">
                            {product.price?.toLocaleString('tr-TR')}₺
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between border-t pt-4">
                    <p className="text-sm text-gray-600">
                      {selectedProducts.length} ürün seçildi
                    </p>
                    <button
                      onClick={handleAddSelectedProducts}
                      disabled={selectedProducts.length === 0}
                      className={`px-6 py-2 rounded-md text-white font-medium ${
                        selectedProducts.length > 0
                          ? 'bg-[#F27A1A] hover:bg-[#F27A1A]/90'
                          : 'bg-gray-300 cursor-not-allowed'
                      }`}
                    >
                      Koleksiyona Ekle
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
} 