"use client"

import { useState, useEffect } from 'react';
import { useBasket } from '@/app/context/BasketContext';
import { addressService } from '@/app/services/addressService';
import { toast } from 'react-hot-toast';

interface GuestAddress {
  id: string;
  firstname: string;
  lastname: string;
  phone: string;
  address: {
    title: string;
    city: {
      name: string;
      slug: string;
      id: string;
    };
    district: {
      name: string;
      slug: string;
      id: string;
    };
    neighborhood?: {
      name: string;
      slug: string;
      id: string;
    };
    description: string;
  };
  invoice: {
    type: 'individual' | 'corporate';
    tax_office?: string;
    tax_number?: string;
    e_invoice: boolean;
  };
  created_at: string;
  updated_at: string;
}

interface GuestAddressListProps {
  onAddressSelect: (address: GuestAddress) => void;
  selectedAddressId?: string;
}

export default function GuestAddressList({ onAddressSelect, selectedAddressId }: GuestAddressListProps) {
  const { guestId } = useBasket();
  const [addresses, setAddresses] = useState<GuestAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Guest adreslerini getir
  const fetchGuestAddresses = async () => {
    if (!guestId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await addressService.getGuestAddresses(guestId);
      setAddresses(data);
    } catch (err) {
      setError('Adresler yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  // Adres silme
  const handleDeleteAddress = async (addressId: string) => {
    if (!guestId) return;
    
    try {
      await addressService.deleteGuestAddress(addressId, guestId);
      toast.success('Adres başarıyla silindi');
      fetchGuestAddresses(); // Listeyi yenile
    } catch (err) {
      toast.error('Adres silinirken hata oluştu');
    }
  };

  useEffect(() => {
    fetchGuestAddresses();
  }, [guestId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        <span className="ml-3 text-gray-600">Adresler yükleniyor...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-500 mb-2">{error}</div>
        <button 
          onClick={fetchGuestAddresses}
          className="text-orange-500 hover:underline"
        >
          Tekrar Dene
        </button>
      </div>
    );
  }

  if (addresses.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500 mb-4">Henüz adres eklenmemiş</div>
        <div className="text-sm text-gray-400">
          Yeni adres eklemek için formu kullanın
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
    
      
      <div className="space-y-3">
        {addresses.map((address) => (
          <div 
            key={address.id}
            className={`border rounded-lg p-4 cursor-pointer transition-colors ${
              selectedAddressId === address.id 
                ? 'border-orange-500 bg-orange-50' 
                : 'border-gray-200 hover:border-orange-300'
            }`}
            onClick={() => onAddressSelect(address)}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-medium text-gray-900">
                    {address.address.title}
                  </h4>
                  {selectedAddressId === address.id && (
                    <span className="text-xs bg-orange-500 text-white px-2 py-1 rounded">
                      Seçili
                    </span>
                  )}
                </div>
                
                <div className="text-sm text-gray-600 space-y-1">
                  <div>
                    <strong>{address.firstname} {address.lastname}</strong>
                  </div>
                  <div>{address.phone}</div>
                  <div>
                    {address.address.city.name} / {address.address.district.name}
                    {address.address.neighborhood && ` / ${address.address.neighborhood.name}`}
                  </div>
                  {address.address.description && (
                    <div className="text-gray-500">{address.address.description}</div>
                  )}
                </div>
                
                <div className="mt-2">
                  <span className={`text-xs px-2 py-1 rounded ${
                    address.invoice.type === 'corporate' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {address.invoice.type === 'corporate' ? 'Kurumsal' : 'Bireysel'}
                  </span>
                </div>
              </div>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm('Bu adresi silmek istediğinizden emin misiniz?')) {
                    handleDeleteAddress(address.id);
                  }
                }}
                className="text-red-500 hover:text-red-700 text-sm ml-2"
              >
                Sil
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
