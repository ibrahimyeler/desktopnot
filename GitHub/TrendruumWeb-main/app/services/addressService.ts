import axios from 'axios';

interface AddressPayload {
  title: string;
  first_name: string;
  last_name: string;
  phone: string;
  country_id: number;
  city_id: number;
  district_id: number;
  neighborhood_id: number;
  address: string;
  postal_code?: string;
  is_default?: boolean;
}

// Guest adres payload'u için yeni interface
interface GuestAddressPayload {
  user: {
    firstname: string;
    lastname: string;
    phone: string;
  };
  address: {
    title: string;
    city: string;
    district: string;
    neighborhood: string;
    description: string;
  };
  invoice: {
    type: 'individual' | 'corporate';
    tax_office?: string;
    tax_number?: string;
    e_invoice: boolean;
  };
}

interface Address extends AddressPayload {
  id: string;
  created_at: string;
  updated_at: string;
}

const API_BASE = 'https://api.trendruum.com/api/v1';

// Yeni axios instance'ı oluştur
const axiosInstance = axios.create();
axiosInstance.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    // Önce token'ı dene, yoksa access_token'ı dene
    const token = localStorage.getItem('token') || localStorage.getItem('access_token');
    if (token) {
      config.headers = config.headers || {};
      config.headers['Authorization'] = `Bearer ${token}`;
    }
  }
  return config;
});

export const addressService = {
  // Customer için adres listesi
  getAddresses: async () => {
    try {
      const response = await axiosInstance.get(`${API_BASE}/customer/addresses`);
      
      // 404 ise boş array döndür
      if (response.status === 404) {
        return [];
      }
      
      if (response.data?.meta?.status === 'success' && response.data.data) {
        return response.data.data;
      }
      
      return response.data?.data || [];
    } catch (error: any) {
      // 404 veya 500 hatası durumunda boş array döndür
      if (error?.response?.status === 404 || error?.response?.status === 500) {
        return [];
      }
      // Diğer hatalar için throw et
      throw error;
    }
  },

  // Guest için adres listesi
  getGuestAddresses: async (guestId: string) => {
    const response = await axiosInstance.get(`${API_BASE}/addresses`, {
      headers: {
        'Guest-ID': guestId
      }
    });
    return response.data?.data || [];
  },

  // Customer için adres ekleme
  async addAddress(payload: AddressPayload): Promise<Address> {
    const res = await axiosInstance.post(`${API_BASE}/customer/profile/addresses`, payload);
    return res.data.data;
  },

  // Guest için adres ekleme
  async addGuestAddress(payload: GuestAddressPayload, guestId: string): Promise<any> {
    const res = await axiosInstance.post(`${API_BASE}/addresses`, payload, {
      headers: {
        'Guest-ID': guestId
      }
    });
    return res.data.data;
  },

  // Guest için adres güncelleme
  async updateGuestAddress(addressId: string, payload: GuestAddressPayload, guestId: string): Promise<any> {
    const res = await axiosInstance.put(`${API_BASE}/addresses/${addressId}`, payload, {
      headers: {
        'Guest-ID': guestId
      }
    });
    return res.data.data;
  },

  // Guest için adres silme
  async deleteGuestAddress(addressId: string, guestId: string): Promise<void> {
    const res = await axiosInstance.delete(`${API_BASE}/addresses/${addressId}`, {
      headers: {
        'Guest-ID': guestId
      }
    });
    return res.data;
  },

  // Guest için tek adres getirme
  async getGuestAddress(addressId: string, guestId: string): Promise<any> {
    const res = await axiosInstance.get(`${API_BASE}/addresses/${addressId}`, {
      headers: {
        'Guest-ID': guestId
      }
    });
    return res.data.data;
  },

  async updateAddress(id: string, payload: Partial<AddressPayload>): Promise<Address> {
    const res = await axiosInstance.put(`${API_BASE}/customer/profile/addresses/${id}`, payload);
    return res.data.data;
  },

  async deleteAddress(id: string): Promise<void> {
    const res = await axiosInstance.delete(`${API_BASE}/customer/profile/addresses/${id}`);
    return res.data;
  },

  // Türkiye'nin slug'ı sabit: 'turkiye'
  async getCities() {
    const res = await axiosInstance.get(`${API_BASE}/locations/countries/turkiye`);
    return res.data.data.cities;
  },

  async getDistricts(citySlug: string) {
    const res = await axiosInstance.get(`${API_BASE}/locations/cities/${citySlug}`);
    return res.data.data.districts;
  },

  async getNeighborhoods(districtSlug: string) {
    const res = await axiosInstance.get(`${API_BASE}/locations/districts/${districtSlug}`);
    return res.data.data.neighborhoods;
  },
}; 