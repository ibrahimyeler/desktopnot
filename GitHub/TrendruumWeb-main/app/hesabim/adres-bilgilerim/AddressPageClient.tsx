"use client";

import { useState, useEffect, useCallback } from 'react';
import AccountSidebar from '@/components/account/AccountSidebar';
import AddressPopup from '@/components/cart/AddressPopup';
import { Bars3Icon, XMarkIcon, MapPinIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { addressService } from '@/app/services/addressService';
import { useAuth } from '@/app/context/AuthContext';
import toast from 'react-hot-toast';

interface AddressPageClientProps {
  initialLocationData: {
    cities: any[];
    districts: any;
    neighborhoods: any;
  };
}

const AddressPageClient = ({ initialLocationData }: AddressPageClientProps) => {
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [locationData, setLocationData] = useState(initialLocationData);
  const [loading, setLoading] = useState(false);
  const [addressesLoading, setAddressesLoading] = useState(true);
  const [showAddressPopup, setShowAddressPopup] = useState(false);
  const [editingAddress, setEditingAddress] = useState<any | null>(null);
  const { isLoggedIn } = useAuth();

  // Dinamik lokasyon verilerini çek (fallback)
  useEffect(() => {
    const fetchLocationData = async () => {
      try {
        setLoading(true);
        // İlleri çek (eğer server'dan gelmediyse)
        if (locationData.cities.length === 0) {
          const cities = await addressService.getCities();
          setLocationData(prev => ({ ...prev, cities }));
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchLocationData();
  }, [locationData.cities.length]);

  // Adresleri API'den çek fonksiyonu - sepetim/odeme sayfası ile aynı format
  const fetchAddresses = useCallback(async () => {
    try {
      setAddressesLoading(true);
      const token = localStorage.getItem('token') || localStorage.getItem('access_token');
      
      // Kullanıcı giriş yapmışsa API'den çek - sepetim/odeme ile aynı endpoint kullan
      if (token && isLoggedIn) {
        try {
          // sepetim/odeme sayfası ile aynı endpoint: /api/v1/customer/profile/me
          const response = await fetch('/api/v1/customer/profile/me', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          const data = await response.json();
          
          if (data.meta?.status === 'success' && data.data?.addresses) {
            // sepetim/odeme sayfası ile aynı formatta set et
            setSavedAddresses(data.data.addresses || []);
            
            // Başarılı bir şekilde API'den çekildiyse localStorage'ı temizle
            if (data.data.addresses && data.data.addresses.length > 0) {
              localStorage.removeItem('savedAddresses');
            }
          } else {
            setSavedAddresses([]);
          }
        } catch (error: any) {
          
          // 500 hatası veya diğer hatalar durumunda localStorage'dan dene (fallback)
          if (error?.response?.status === 500 || error?.response?.status === 404) {
            const saved = localStorage.getItem('savedAddresses');
            if (saved) {
              try {
                setSavedAddresses(JSON.parse(saved));
              } catch (parseError) {
                setSavedAddresses([]);
              }
            } else {
              setSavedAddresses([]);
            }
          } else {
            // Diğer hatalar için boş array set et
            setSavedAddresses([]);
          }
        }
      } else {
        // Guest kullanıcı için localStorage'dan çek
        const saved = localStorage.getItem('savedAddresses');
        if (saved) {
          setSavedAddresses(JSON.parse(saved));
        }
      }
    } catch (error) {
    } finally {
      setAddressesLoading(false);
      setIsClient(true);
    }
  }, [isLoggedIn]);

  // Adresleri API'den çek
  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  // Diğer sayfalardan adres eklendiğinde/güncellendiğinde/silindiğinde dinle
  useEffect(() => {
    const handleAddressChange = () => {
      // Adres eklendi/güncellendi/silindi, listeyi yeniden çek
      if (isLoggedIn) {
        fetchAddresses();
      }
    };

    window.addEventListener('address-added', handleAddressChange);
    window.addEventListener('address-updated', handleAddressChange);
    window.addEventListener('address-deleted', handleAddressChange);

    return () => {
      window.removeEventListener('address-added', handleAddressChange);
      window.removeEventListener('address-updated', handleAddressChange);
      window.removeEventListener('address-deleted', handleAddressChange);
    };
  }, [isLoggedIn, fetchAddresses]);

  const handleAddressSubmit = (addressData: any) => {
    // Adres eklendi/güncellendi, listeyi yeniden çek
    fetchAddresses();
    setShowAddressPopup(false);
    setEditingAddress(null);
    toast.success('Adres başarıyla kaydedildi');
  };

  const handleDeleteAddress = async (addressId: string) => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('access_token');
      
      // Kullanıcı giriş yapmışsa API'den sil
      if (token && isLoggedIn) {
        try {
          // sepetim/odeme sayfası ile aynı endpoint kullan
          const response = await fetch(`/api/v1/customer/profile/addresses/${addressId}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          const data = await response.json();
          
          if (data.meta?.status === 'success') {
            // Diğer sayfaları bildir (sepetim/odeme sayfası için)
            window.dispatchEvent(new CustomEvent('address-deleted'));
            
            // Listeyi yeniden çek
            fetchAddresses();
            toast.success('Adres silindi');
          } else {
            throw new Error(data.meta?.message || 'Adres silinemedi');
          }
        } catch (error) {
          toast.error('Adres silinirken bir hata oluştu');
        }
      } else {
        // State'i güncelle
        const updatedAddresses = savedAddresses.filter(addr => {
          const addrId = addr.id?.$oid || addr.id;
          return addrId !== addressId;
        });
        setSavedAddresses(updatedAddresses);
        localStorage.setItem('savedAddresses', JSON.stringify(updatedAddresses));
        toast.success('Adres silindi');
      }
    } catch (error) {
      toast.error('Adres silinirken bir hata oluştu');
    }
  };

  const handleEditAddress = (address: any) => {
    setEditingAddress(address);
    setShowAddressPopup(true);
  };

  // Only render content after client-side hydration
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="header-padding pt-0 sm:pt-0">
          <div className="w-full max-w-[88rem] xl:max-w-[96rem] 2xl:max-w-[110rem] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-20 pt-20 md:pt-0 pb-8 sm:py-12 lg:py-16 xl:py-20">
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
              <p className="text-gray-600 mt-4">Yükleniyor...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-gray-50"
      style={{
        minHeight: '100dvh',
        WebkitOverflowScrolling: 'touch'
      }}
    >
      <div className="header-padding pt-0 sm:pt-0">
        <div 
          className="w-full max-w-[88rem] xl:max-w-[96rem] 2xl:max-w-[110rem] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-20 pt-20 md:pt-0 pb-8 sm:py-12 lg:py-16 xl:py-20"
          style={{
            paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 80px)'
          }}
        >

      <div className="flex gap-4 lg:gap-6 xl:gap-8 2xl:gap-12 items-start">
        {/* Desktop Sidebar - Sticky positioned */}
        <div className="hidden lg:block flex-shrink-0">
          <AccountSidebar />
        </div>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setSidebarOpen(false)} />
            <div className="fixed left-0 top-0 h-full w-80 bg-white border-r border-gray-200 overflow-y-auto">
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Hesabım</h2>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="p-2 rounded-lg hover:bg-gray-100 "
                  >
                    <XMarkIcon className="w-6 h-6 text-gray-600" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <AccountSidebar onItemClick={() => setSidebarOpen(false)} />
              </div>
            </div>
          </div>
        )}

        {/* Main Content - Biraz daraltılmış */}
        <div className="flex-1 w-full max-w-4xl xl:max-w-5xl 2xl:max-w-6xl">
          {/* Header */}
          <div className="mb-6">
            <div className="hidden sm:flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <MapPinIcon className="w-6 h-6 text-orange-500" />
                <h1 className="text-xl font-semibold text-gray-900">Tüm Adres Bilgilerim</h1>
              </div>
              <button
                onClick={() => {
                  setEditingAddress(null);
                  setShowAddressPopup(true);
                }}
                className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-orange-600 transition-colors"
              >
                + Yeni Adres Ekle
              </button>
            </div>
            <div className="sm:hidden flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="p-2 rounded-lg hover:bg-gray-100"
                  aria-label="Menü"
                >
                  <Bars3Icon className="w-6 h-6 text-gray-600" />
                </button>
                <MapPinIcon className="w-5 h-5 text-orange-500" />
                <h1 className="text-base font-semibold text-gray-900">Tüm Adres Bilgilerim</h1>
              </div>
            </div>
            <button
              onClick={() => {
                setEditingAddress(null);
                setShowAddressPopup(true);
              }}
              className="sm:hidden w-full flex items-center justify-center gap-2 bg-orange-500 text-white px-4 py-3 rounded-lg font-medium text-sm hover:bg-orange-600 transition-colors"
            >
              + Yeni Adres Ekle
            </button>
          </div>

          {loading || addressesLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
              <p className="text-gray-600 mt-4">
                {addressesLoading ? 'Adresler yükleniyor...' : 'Lokasyon verileri yükleniyor...'}
              </p>
            </div>
          ) : savedAddresses.length === 0 ? (
            <div className="bg-white rounded-2xl p-6 sm:p-10 flex flex-col items-center justify-center border border-gray-100 max-w-lg mx-auto">
              <div className="bg-orange-50 rounded-full w-16 h-16 sm:w-24 sm:h-24 flex items-center justify-center mb-4 sm:mb-6">
                <MapPinIcon className="w-8 h-8 sm:w-12 sm:h-12 text-orange-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 tracking-tight">Henüz adres eklenmemiş</h3>
              <p className="text-sm sm:text-base text-gray-500 mb-4 text-center max-w-xs leading-relaxed">
                Adres ekleyerek siparişlerinizi daha hızlı ve kolay tamamlayabilirsiniz.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {savedAddresses.map((address: any) => {
                // sepetim/odeme sayfası ile aynı format: address.id.$oid veya address.id
                const addressId = address.id?.$oid || address.id;
                // sepetim/odeme sayfası formatı: address.address.title, address.address.description, etc.
                const addressTitle = address.address?.title || address.title || 'Adres';
                const addressDescription = address.address?.description || address.description || address.address || '';
                const firstName = address.firstname || address.first_name || '';
                const lastName = address.lastname || address.last_name || '';
                const phone = address.phone || '';
                const city = address.address?.city || address.city;
                const district = address.address?.district || address.district;
                const neighborhood = address.address?.neighborhood || address.neighborhood;
                
                return (
                  <div key={addressId} className="bg-white border border-orange-100 rounded-xl p-4 sm:p-5 flex flex-col gap-2 relative group transition-all duration-200 hover:border-orange-200">
                    <div className="flex items-start justify-between mb-2 gap-3">
                      <div className="font-semibold text-orange-500 text-sm sm:text-base flex-1 min-w-0 flex items-center gap-2">
                        <MapPinIcon className="w-4 h-4 text-orange-500 flex-shrink-0" />
                        <span>{addressTitle}</span>
                      </div>
                      <div className="flex gap-1 sm:gap-2 opacity-100 sm:opacity-80 sm:group-hover:opacity-100 transition-opacity flex-shrink-0">
                        {/* Adres güncelleme butonu yorum satırına alındı */}
                        {/* <button
                          className="p-1.5 sm:p-1 rounded hover:bg-orange-50 text-gray-500 hover:text-orange-500 transition-colors"
                          title="Düzenle"
                          onClick={() => handleEditAddress(address)}
                        >
                          <PencilIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button> */}
                        <button
                          className="p-1.5 sm:p-1 rounded hover:bg-red-50 text-gray-500 hover:text-red-500 transition-colors"
                          title="Sil"
                          onClick={() => {
                            if (confirm('Bu adresi silmek istediğinizden emin misiniz?')) {
                              handleDeleteAddress(addressId);
                            }
                          }}
                        >
                          <TrashIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                      </div>
                    </div>
                    <div className="text-[10px] sm:text-xs text-gray-600 space-y-1">
                      <p className="truncate">{addressDescription}</p>
                      {(neighborhood || district) && (
                        <p>
                          {neighborhood?.name && `${neighborhood.name}, `}
                          {district?.name}
                        </p>
                      )}
                      {city?.name && <p>{city.name}</p>}
                    </div>
                    <div className="mt-2 pt-2 border-t text-[10px] sm:text-xs text-gray-500">
                      <p>{firstName} {lastName}</p>
                      <p>{phone}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
        </div>
      </div>

      {/* Address Popup Modal */}
      {showAddressPopup && (
        <AddressPopup
          onClose={() => {
            setShowAddressPopup(false);
            setEditingAddress(null);
          }}
          onSubmit={handleAddressSubmit}
          initialAddress={editingAddress}
          isEditMode={!!editingAddress}
        />
      )}
    </div>
  );
};

export default AddressPageClient;
