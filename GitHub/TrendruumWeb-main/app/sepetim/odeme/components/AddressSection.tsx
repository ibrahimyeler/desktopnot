"use client";

import { useState, useEffect, useCallback } from "react";
import { FaUserAlt } from "react-icons/fa";
import { MdOutlinePhoneIphone } from "react-icons/md";
import { HiLocationMarker } from "react-icons/hi";
import { FiTrash2 } from "react-icons/fi";
import { useAuth } from "@/app/context/AuthContext";

interface UserProfile {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  birth_date?: string;
  gender?: string;
  created_at: string;
  updated_at: string;
}

interface InitialAddress {
  id: string;
  title: string;
  firstname: string;
  lastname: string;
  phone: string;
  city: {
    id: string;
    name: string;
    slug: string;
  };
  district: {
    id: string;
    name: string;
    slug: string;
  };
  neighborhood: {
    id: string;
    name: string;
    slug: string;
  };
  description: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

interface Address {
  id: {
    $oid: string;
  };
  firstname: string;
  lastname: string;
  phone: string;
  invoice: {
    type: string;
  };
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
    neighborhood: {
      name: string;
      slug: string;
      id: string;
    };
    description: string;
  };
  updated_at: string;
  created_at: string;
}

interface AddressSectionProps {
  setShowAddressPopup: (bool: boolean) => void;
  onAddressSelect?: (addressId: string) => void;
  initialAddresses?: InitialAddress[];
  initialUserProfile?: UserProfile | null;
}

export default function AddressSection({
  setShowAddressPopup,
  onAddressSelect,
  initialAddresses = [],
  initialUserProfile
}: AddressSectionProps) {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [loading, setLoading] = useState(!initialAddresses.length);
  const { isLoggedIn } = useAuth();

  const fetchAddresses = useCallback(async () => {
      try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await fetch('/api/v1/customer/profile/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
        const data = await response.json();

        if (data.meta?.status === 'success' && data.data?.addresses) {
        setAddresses(data.data.addresses);
        if (data.data.addresses.length > 0 && !selectedAddressId) {
          setSelectedAddressId(data.data.addresses[0].id.$oid);
          if (onAddressSelect) {
            onAddressSelect(data.data.addresses[0].id.$oid);
          }
        }
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    }, [selectedAddressId, onAddressSelect]);

  useEffect(() => {
    if (!isLoggedIn) {
      // guest kullanıcılar için kaydedilmiş adresleri göstermeyelim
      setAddresses([]);
      setSelectedAddressId(null);
      setLoading(false);
      return;
    }

    if (initialAddresses.length > 0) {
      // Initial addresses'i format et
      const formattedAddresses = initialAddresses.map(addr => ({
        id: { $oid: addr.id },
        firstname: addr.firstname,
        lastname: addr.lastname,
        phone: addr.phone,
        invoice: { type: 'individual' },
        address: {
          title: addr.title,
          city: addr.city,
          district: addr.district,
          neighborhood: addr.neighborhood,
          description: addr.description
        },
        is_default: addr.is_default,
        created_at: addr.created_at,
        updated_at: addr.updated_at
      }));
      setAddresses(formattedAddresses);
      setLoading(false);
    } else {
      fetchAddresses();
    }
  }, [initialAddresses, isLoggedIn, fetchAddresses]);

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

  const handleAddressSelect = async (addressId: string) => {
    setSelectedAddressId(addressId);
    if (onAddressSelect) {
      onAddressSelect(addressId);
    }

    if (!isLoggedIn) {
      return;
    }

    // Seçilen adresi backend'e bildir
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      const response = await fetch('/api/v1/customer/profile/me-update', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          selected_address_id: addressId
        })
      });
      
      const data = await response.json();
      if (data.meta?.status !== 'success') {
      }
    } catch (error) {
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (!isLoggedIn) return;
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const response = await fetch(`/api/v1/customer/profile/addresses/${addressId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.meta?.status === 'success') {
        let newAddresses = addresses.filter(addr => addr.id.$oid !== addressId);
        setAddresses(newAddresses);
        if (selectedAddressId === addressId) {
          if (newAddresses.length > 0) {
            setSelectedAddressId(newAddresses[0].id.$oid);
            if (onAddressSelect) onAddressSelect(newAddresses[0].id.$oid);
          } else {
            setSelectedAddressId(null);
            if (onAddressSelect) onAddressSelect('');
          }
        }
      }
    } catch (error) {
    }
  };

  const renderAddressBlock = () => {
    if (loading) {
      return (
        <div className="h-32 w-full flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" />
        </div>
      );
    }

    if (!addresses.length) {
      return (
        <div
          onClick={() => setShowAddressPopup(true)}
          className="h-32 cursor-pointer w-full flex flex-col items-center justify-center border rounded-md bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <p className="text-center text-[14px] text-gray-600">
            Henüz adres bilgisi bulunmamaktadır.
            <br />
            <span className="text-orange-500 font-medium">Adres eklemek için tıklayın.</span>
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-3 sm:space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {addresses.map((address) => (
            <div key={address.id.$oid} className="relative group">
              <div className="absolute -left-2 top-1/2 -translate-y-1/2 z-10">
                <input
                  type="radio"
                  name="address"
                  checked={selectedAddressId === address.id.$oid}
                  onChange={() => handleAddressSelect(address.id.$oid)}
                  className="w-4 h-4 accent-orange-500 cursor-pointer"
                />
              </div>
              <button
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500"
                onClick={e => { e.stopPropagation(); handleDeleteAddress(address.id.$oid); }}
                title="Adresi Sil"
              >
                <FiTrash2 size={18} />
              </button>
              <div 
                className={`rounded-lg border p-3 sm:p-4 ml-4 cursor-pointer transition-all ${
                  selectedAddressId === address.id.$oid
                    ? 'border-orange-500 bg-orange-50' 
                    : 'border-gray-200 hover:border-orange-300'
                }`}
                onClick={() => handleAddressSelect(address.id.$oid)}
              >
                <div className="flex items-center gap-2 mb-2">
                  <HiLocationMarker className="text-orange-500" size={16} />
                  <span className="font-medium text-xs sm:text-sm">{address.address?.title || 'Adres'}</span>
                </div>
                <div className="text-[10px] sm:text-xs text-gray-600 space-y-1">
                  <p className="truncate">{address.address?.description || ''}</p>
                  <p>
                    {address.address?.neighborhood?.name && `${address.address.neighborhood.name}, `}
                    {address.address?.district?.name}
                  </p>
                  <p>{address.address?.city?.name}</p>
                </div>
                <div className="mt-2 pt-2 border-t text-[10px] sm:text-xs text-gray-500">
                  <p>{address.firstname || ''} {address.lastname || ''}</p>
                  <p>{address.phone || ''}</p>
                </div>
          </div>
          </div>
          ))}
        </div>
        {addresses.length < 4 ? (
        <button
          onClick={() => setShowAddressPopup(true)}
          className="w-full text-center text-sm text-orange-500 hover:text-orange-600 underline mt-2"
        >
          + Yeni Adres Ekle
        </button>
        ) : (
          <div className="text-center text-sm text-gray-500 mt-2">
            Maksimum 4 adres kaydedebilirsiniz. Yeni adres eklemek için mevcut bir adresi silin.
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="rounded-lg border shadow-sm w-full">
      <div className="p-3 sm:p-5">
            <h1 className="text-base sm:text-[18px] font-[500] text-black mb-3 sm:mb-4">Teslimat Adresi</h1>
            {renderAddressBlock()}
      </div>
    </div>
  );
}
