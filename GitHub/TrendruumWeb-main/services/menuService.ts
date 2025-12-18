interface MenuItem {
  name: string;
  url: string;
  type: string;
  slug: string;
  id: {
    $oid: string;
  };
}

interface Menu {
  name: string;
  status: string;
  location: string;
  menuItems: MenuItem[];
  id: string;
}

interface MenuResponse {
  trendruum: Menu[];
  yardim: Menu[];
  "bottom-footer": Menu[];
}

import { API_V1_URL } from '@/lib/config';

// localStorage key ve cache süresi (24 saat)
const MENUS_STORAGE_KEY = 'trendruum_menus_service_cache';
const MENUS_CACHE_TIMESTAMP_KEY = 'trendruum_menus_service_cache_timestamp';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 saat (milisaniye)

// localStorage'dan menüleri oku
function getMenusFromStorage(): { trendruumMenu: MenuItem[], yardimMenu: MenuItem[], bottomFooterMenu: MenuItem[] } | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const cachedData = localStorage.getItem(MENUS_STORAGE_KEY);
    const cachedTimestamp = localStorage.getItem(MENUS_CACHE_TIMESTAMP_KEY);
    
    if (!cachedData || !cachedTimestamp) {
      return null;
    }
    
    const timestamp = parseInt(cachedTimestamp, 10);
    const now = Date.now();
    
    // Cache süresi dolmuş mu kontrol et
    if (now - timestamp > CACHE_DURATION) {
      // Cache eski, temizle
      localStorage.removeItem(MENUS_STORAGE_KEY);
      localStorage.removeItem(MENUS_CACHE_TIMESTAMP_KEY);
      return null;
    }
    
    return JSON.parse(cachedData);
  } catch (error) {
    // Hata durumunda cache'i temizle
    localStorage.removeItem(MENUS_STORAGE_KEY);
    localStorage.removeItem(MENUS_CACHE_TIMESTAMP_KEY);
    return null;
  }
}

// Menüleri localStorage'a kaydet
function saveMenusToStorage(menuData: { trendruumMenu: MenuItem[], yardimMenu: MenuItem[], bottomFooterMenu: MenuItem[] }): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(MENUS_STORAGE_KEY, JSON.stringify(menuData));
    localStorage.setItem(MENUS_CACHE_TIMESTAMP_KEY, Date.now().toString());
  } catch (error) {
    // localStorage'a yazma hatası (quota aşıldı vb.)
    console.error('Menü verilerini localStorage\'a kaydedilemedi:', error);
  }
}

export const fetchMenus = async (): Promise<{ trendruumMenu: MenuItem[], yardimMenu: MenuItem[], bottomFooterMenu: MenuItem[] }> => {
  // Önce localStorage'dan kontrol et
  const cachedMenus = getMenusFromStorage();
  if (cachedMenus) {
    // Cache'den veri var, kullan
    // Arka planda güncelleme yap (kullanıcıyı bloklamadan)
    fetch(`${API_V1_URL}/statics/menus`)
      .then(res => res.json())
      .then(data => {
        if (data.meta?.status === 'success' && data.data) {
          const trendruumMenuData = data.data.trendruum?.[0]?.menuItems || [];
          const yardimMenuData = data.data.yardim?.[0]?.menuItems || [];
          const bottomFooterMenuData = data.data["bottom-footer"]?.[0]?.menuItems || [];
          
          const freshData = {
            trendruumMenu: trendruumMenuData,
            yardimMenu: yardimMenuData,
            bottomFooterMenu: bottomFooterMenuData
          };
          
          // Yeni veriyi localStorage'a kaydet
          saveMenusToStorage(freshData);
        }
      })
      .catch(() => {
        // Hata durumunda sessizce geç
      });
    
    return cachedMenus;
  }
  
  // Cache yok, API'den çek
  try {
    const res = await fetch(`${API_V1_URL}/statics/menus`);
    const data = await res.json();
    
    if (data.meta?.status === 'success' && data.data) {
      // API response structure: data.data.trendruum[0].menuItems, data.data.yardim[0].menuItems, and data.data["bottom-footer"][0].menuItems
      const trendruumMenuData = data.data.trendruum?.[0]?.menuItems || [];
      const yardimMenuData = data.data.yardim?.[0]?.menuItems || [];
      const bottomFooterMenuData = data.data["bottom-footer"]?.[0]?.menuItems || [];
      
      const menuData = {
        trendruumMenu: trendruumMenuData,
        yardimMenu: yardimMenuData,
        bottomFooterMenu: bottomFooterMenuData
      };
      
      // localStorage'a kaydet
      saveMenusToStorage(menuData);
      
      return menuData;
    }
    
    return {
      trendruumMenu: [],
      yardimMenu: [],
      bottomFooterMenu: []
    };
  } catch (error) {
    return {
      trendruumMenu: [],
      yardimMenu: [],
      bottomFooterMenu: []
    };
  }
};

export type { MenuItem, Menu, MenuResponse }; 