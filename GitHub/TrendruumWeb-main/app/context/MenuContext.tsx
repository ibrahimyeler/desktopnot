"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export interface MenuItem {
  name: string;
  url: string;
  type: string;
  slug: string;
  id?: string | { $oid: string };
  children?: MenuItem[];
  badge?: string;
  [key: string]: unknown;
}

export interface MenuSection {
  name: string;
  location: string;
  id?: string;
  status?: string;
  updated_at?: string;
  created_at?: string;
  menuItems: MenuItem[];
  [key: string]: unknown;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  children?: Category[];
  image?: {
    name: string;
    fullpath: string;
    url: string;
    type: string;
  };
}

interface MenuContextType {
  navigationLinks: MenuItem[];
  topNavLinks: MenuItem[];
  categories: Category[];
  megaMenuItems: MenuItem[];
  megaMenuSubItems: Record<string, MenuItem[]>;
  megaMenuDeepItems: Record<string, MenuItem[]>;
  menuSections: Record<string, MenuSection>;
  // Footer and TrendruumMenu menu data
  trendruumMenu: MenuItem[];
  yardimMenu: MenuItem[];
  bottomFooterMenu: MenuItem[];
  isLoading: boolean;
  error: string | null;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

// localStorage key ve cache süresi (24 saat)
const MENUS_STORAGE_KEY = 'trendruum_menus_cache';
const MENUS_CACHE_TIMESTAMP_KEY = 'trendruum_menus_cache_timestamp';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 saat (milisaniye)

// localStorage'dan menüleri oku
function getMenusFromStorage(): any | null {
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
function saveMenusToStorage(menuData: any): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(MENUS_STORAGE_KEY, JSON.stringify(menuData));
    localStorage.setItem(MENUS_CACHE_TIMESTAMP_KEY, Date.now().toString());
  } catch (error) {
    // localStorage'a yazma hatası (quota aşıldı vb.)
    console.error('Menü verilerini localStorage\'a kaydedilemedi:', error);
  }
}

async function fetchMenus() {
  const menusResponse = await axios.get('https://api.trendruum.com/api/v1/statics/menus', {
    headers: {
      Accept: 'application/json',
    },
  });
  // Categories API çağrısını kaldırdık - gereksiz istek, sadece navigationLinks kullanılıyor
  // categories array'i artık kullanılmıyor, mega menu için navigationLinks yeterli
  let navigationLinks: MenuItem[] = [];
  let topNavLinks: MenuItem[] = [];
  let categories: Category[] = []; // Boş array - artık API'den çekilmiyor
  let megaMenuItems: MenuItem[] = [];
  let megaMenuSubItems: Record<string, MenuItem[]> = {};
  let megaMenuDeepItems: Record<string, MenuItem[]> = {};
  let menuSections: Record<string, MenuSection> = {};
  let trendruumMenu: MenuItem[] = [];
  let yardimMenu: MenuItem[] = [];
  let bottomFooterMenu: MenuItem[] = [];
  
  if (menusResponse.data.meta?.status === 'success') {
    const topMenu = menusResponse.data.data['top-menu'][0];
    if (topMenu) topNavLinks = topMenu.menuItems;
    
    const mainMenu = menusResponse.data.data['main-menu'][0];
    if (mainMenu) navigationLinks = mainMenu.menuItems;
    
    // Fetch mega menu items from mega-menu-ana
    const megaMenu = menusResponse.data.data['mega-menu-ana'][0];
    if (megaMenu) megaMenuItems = megaMenu.menuItems;
    
    // Fetch mega menu sub items from mega-menu-1 to mega-menu-10
    for (let i = 1; i <= 10; i++) {
      const megaMenuKey = `mega-menu-${i}`;
      const megaMenuSub = menusResponse.data.data[megaMenuKey]?.[0];
      if (megaMenuSub && megaMenuSub.menuItems) {
        megaMenuSubItems[megaMenuKey] = megaMenuSub.menuItems;
      }
    }
    
    // Fetch deep level mega menu items (mega-menu-X-Y format)
    for (let i = 1; i <= 10; i++) {
      for (let j = 1; j <= 22; j++) { // Some categories have up to 22 subcategories
        const megaMenuDeepKey = `mega-menu-${i}-${j}`;
        const megaMenuDeep = menusResponse.data.data[megaMenuDeepKey]?.[0];
        if (megaMenuDeep && megaMenuDeep.menuItems) {
          megaMenuDeepItems[megaMenuDeepKey] = megaMenuDeep.menuItems;
        }
      }
    }
    
    // Fetch Footer and TrendruumMenu data
    const trendruumMenuData = menusResponse.data.data.trendruum?.[0]?.menuItems || [];
    const yardimMenuData = menusResponse.data.data.yardim?.[0]?.menuItems || [];
    const bottomFooterMenuData = menusResponse.data.data["bottom-footer"]?.[0]?.menuItems || [];
    
    trendruumMenu = trendruumMenuData;
    yardimMenu = yardimMenuData;
    bottomFooterMenu = bottomFooterMenuData;

    // Collect every section keyed by location (including new dynamic locations)
    Object.values(menusResponse.data.data).forEach((sectionGroup: any) => {
      if (Array.isArray(sectionGroup)) {
        sectionGroup.forEach((section: any) => {
          if (section?.location) {
            menuSections[section.location] = {
              ...section,
              menuItems: Array.isArray(section.menuItems) ? section.menuItems : [],
            };
          }
        });
      }
    });
  }
  
  // Categories API çağrısı kaldırıldı - gereksiz istek
  // categories array'i artık boş kalacak, sadece navigationLinks kullanılıyor
  
  return { 
    navigationLinks, 
    topNavLinks, 
    categories, 
    megaMenuItems, 
    megaMenuSubItems, 
    megaMenuDeepItems,
    menuSections,
    trendruumMenu,
    yardimMenu,
    bottomFooterMenu
  };
}

export const MenuProvider = ({ children }: { children: React.ReactNode }) => {
  const [menuData, setMenuData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // API'den menüleri çek
  const fetchMenusFromAPI = useCallback(async (): Promise<any> => {
    try {
      const menusResponse = await axios.get('https://api.trendruum.com/api/v1/statics/menus', {
        headers: {
          Accept: 'application/json',
        },
      });
      
      if (menusResponse.data.meta?.status === 'success') {
        // Menü verilerini işle (aynı mantık)
        let navigationLinks: MenuItem[] = [];
        let topNavLinks: MenuItem[] = [];
        let categories: Category[] = [];
        let megaMenuItems: MenuItem[] = [];
        let megaMenuSubItems: Record<string, MenuItem[]> = {};
        let megaMenuDeepItems: Record<string, MenuItem[]> = {};
        let menuSections: Record<string, MenuSection> = {};
        let trendruumMenu: MenuItem[] = [];
        let yardimMenu: MenuItem[] = [];
        let bottomFooterMenu: MenuItem[] = [];
        
        const topMenu = menusResponse.data.data['top-menu'][0];
        if (topMenu) topNavLinks = topMenu.menuItems;
        
        const mainMenu = menusResponse.data.data['main-menu'][0];
        if (mainMenu) navigationLinks = mainMenu.menuItems;
        
        const megaMenu = menusResponse.data.data['mega-menu-ana'][0];
        if (megaMenu) megaMenuItems = megaMenu.menuItems;
        
        for (let i = 1; i <= 10; i++) {
          const megaMenuKey = `mega-menu-${i}`;
          const megaMenuSub = menusResponse.data.data[megaMenuKey]?.[0];
          if (megaMenuSub && megaMenuSub.menuItems) {
            megaMenuSubItems[megaMenuKey] = megaMenuSub.menuItems;
          }
        }
        
        for (let i = 1; i <= 10; i++) {
          for (let j = 1; j <= 22; j++) {
            const megaMenuDeepKey = `mega-menu-${i}-${j}`;
            const megaMenuDeep = menusResponse.data.data[megaMenuDeepKey]?.[0];
            if (megaMenuDeep && megaMenuDeep.menuItems) {
              megaMenuDeepItems[megaMenuDeepKey] = megaMenuDeep.menuItems;
            }
          }
        }
        
        const trendruumMenuData = menusResponse.data.data.trendruum?.[0]?.menuItems || [];
        const yardimMenuData = menusResponse.data.data.yardim?.[0]?.menuItems || [];
        const bottomFooterMenuData = menusResponse.data.data["bottom-footer"]?.[0]?.menuItems || [];
        
        trendruumMenu = trendruumMenuData;
        yardimMenu = yardimMenuData;
        bottomFooterMenu = bottomFooterMenuData;

        Object.values(menusResponse.data.data).forEach((sectionGroup: any) => {
          if (Array.isArray(sectionGroup)) {
            sectionGroup.forEach((section: any) => {
              if (section?.location) {
                menuSections[section.location] = {
                  ...section,
                  menuItems: Array.isArray(section.menuItems) ? section.menuItems : [],
                };
              }
            });
          }
        });
        
        const processedData = {
          navigationLinks,
          topNavLinks,
          categories,
          megaMenuItems,
          megaMenuSubItems,
          megaMenuDeepItems,
          menuSections,
          trendruumMenu,
          yardimMenu,
          bottomFooterMenu
        };
        
        // localStorage'a kaydet
        saveMenusToStorage(processedData);
        
        return processedData;
      }
      
      return null;
    } catch (err) {
      throw err;
    }
  }, []);

  // İlk yükleme ve cache kontrolü
  useEffect(() => {
    const loadMenus = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Önce localStorage'dan oku
        const cachedMenus = getMenusFromStorage();
        
        if (cachedMenus) {
          // Cache'den veri var, kullan
          setMenuData(cachedMenus);
          setIsLoading(false);
          
          // Cache süresi dolmak üzereyse arka planda güncelle
          const cachedTimestamp = localStorage.getItem(MENUS_CACHE_TIMESTAMP_KEY);
          if (cachedTimestamp) {
            const timestamp = parseInt(cachedTimestamp, 10);
            const now = Date.now();
            const timeUntilExpiry = CACHE_DURATION - (now - timestamp);
            
            // Cache'in %80'i dolmuşsa arka planda güncelle
            if (timeUntilExpiry < CACHE_DURATION * 0.2) {
              // Arka planda güncelle (kullanıcıyı bloklamadan)
              fetchMenusFromAPI()
                .then((freshData) => {
                  if (freshData) {
                    setMenuData(freshData);
                  }
                })
                .catch(() => {
                  // Hata durumunda sessizce geç, cache'den devam et
                });
            }
          }
        } else {
          // Cache yok, API'den çek
          const freshData = await fetchMenusFromAPI();
          if (freshData) {
            setMenuData(freshData);
          } else {
            setError('Menü verileri yüklenemedi');
          }
          setIsLoading(false);
        }
      } catch (err) {
        // API hatası durumunda cache varsa onu kullan
        const cachedMenus = getMenusFromStorage();
        if (cachedMenus) {
          setMenuData(cachedMenus);
        } else {
          setError(err instanceof Error ? err.message : 'Menü verileri yüklenemedi');
        }
        setIsLoading(false);
      }
    };

    loadMenus();
  }, [fetchMenusFromAPI]);

  // Periyodik güncelleme (24 saatte bir)
  useEffect(() => {
    const interval = setInterval(() => {
      // Arka planda menüleri güncelle
      fetchMenusFromAPI()
        .then((freshData) => {
          if (freshData) {
            setMenuData(freshData);
          }
        })
        .catch(() => {
          // Hata durumunda sessizce geç
        });
    }, CACHE_DURATION); // 24 saatte bir

    return () => clearInterval(interval);
  }, [fetchMenusFromAPI]);

  const value: MenuContextType = {
    navigationLinks: menuData?.navigationLinks || [],
    topNavLinks: menuData?.topNavLinks || [],
    categories: menuData?.categories || [],
    megaMenuItems: menuData?.megaMenuItems || [],
    megaMenuSubItems: menuData?.megaMenuSubItems || {},
    megaMenuDeepItems: menuData?.megaMenuDeepItems || {},
    menuSections: menuData?.menuSections || {},
    trendruumMenu: menuData?.trendruumMenu || [],
    yardimMenu: menuData?.yardimMenu || [],
    bottomFooterMenu: menuData?.bottomFooterMenu || [],
    isLoading,
    error,
  };

  return (
    <MenuContext.Provider value={value}>
      {children}
    </MenuContext.Provider>
  );
};

export const useMenu = () => {
  const context = useContext(MenuContext);
  if (!context) throw new Error('useMenu must be used within a MenuProvider');
  return context;
}; 