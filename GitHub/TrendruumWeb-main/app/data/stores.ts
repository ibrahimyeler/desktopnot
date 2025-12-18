export interface Store {
  id: string;
  name: string;
  slug: string;
  image?: string;
}

export const staticStores: Store[] = [
  {
    id: "68bec607bacf7ee9eb0a9b63",
    name: "BUKET DÜNYASI",
    slug: "/magaza/buket-dunyasi",
    image: "/images/stores/elektro-gunluk.jpg"
  },
  {
    id: "68be8e33b771669aa40e9f1a", 
    name: "EU/EMİNE ÜRKMEZ",
    slug: "/magaza/euemine-urkmez",
    image: "/images/stores/elektrohan.jpg"
  },
  {
    id: "68bdb417d46ac7d0880e6a9c",
    name: "Ufak düşler atölyesi",
    slug: "/magaza/ufak-dusler-atolyesi",
    image: "/images/stores/teknoloji-dunyasi.jpg"
  },
  {
    id: "68bd8e87587822d27d0b9ffd",
    name: "Blackbag",
    slug: "/magaza/blackbag",
    image: "/images/stores/elektrik-market.jpg"
  },
  {
    id: "store-5",
    name: "Sanat bahçesi",
    slug: "ev-aletleri-merkezi",
    image: "/images/stores/ev-aletleri-merkezi.jpg"
  },
  {
    id: "68bc32fcfe1e090c9909cfb8",
    name: "GoldDiamonds Store",
    slug: "/magaza/golddiamonds-store",
    image: "/images/stores/elektronik-plus.jpg"
  },
  {
    id: "store-7",
    name: "Gadget Store",
    slug: "gadget-store",
    image: "/images/stores/gadget-store.jpg"
  },
  {
    id: "store-8",
    name: "Tekno Market",
    slug: "tekno-market",
    image: "/images/stores/tekno-market.jpg"
  },
  {
    id: "store-9",
    name: "Elektrikli Aletler",
    slug: "elektrikli-aletler",
    image: "/images/stores/elektrikli-aletler.jpg"
  },
  {
    id: "store-10",
    name: "Modern Ev",
    slug: "modern-ev",
    image: "/images/stores/modern-ev.jpg"
  },
  {
    id: "store-11",
    name: "Akıllı Ev Çözümleri",
    slug: "akilli-ev-cozumleri",
    image: "/images/stores/akilli-ev-cozumleri.jpg"
  },
  {
    id: "store-12",
    name: "Elektrik Malzemeleri",
    slug: "elektrik-malzemeleri",
    image: "/images/stores/elektrik-malzemeleri.jpg"
  },
  {
    id: "store-13",
    name: "Güvenlik Sistemleri",
    slug: "guvenlik-sistemleri",
    image: "/images/stores/guvenlik-sistemleri.jpg"
  },
  {
    id: "store-14",
    name: "Aydınlatma Merkezi",
    slug: "aydinlatma-merkezi",
    image: "/images/stores/aydinlatma-merkezi.jpg"
  },
  {
    id: "store-15",
    name: "Elektrik Tesisat",
    slug: "elektrik-tesisat",
    image: "/images/stores/elektrik-tesisat.jpg"
  },
  {
    id: "store-16",
    name: "Otomotiv Elektrik",
    slug: "otomotiv-elektrik",
    image: "/images/stores/otomotiv-elektrik.jpg"
  },
  {
    id: "store-17",
    name: "Endüstriyel Elektrik",
    slug: "endustriyel-elektrik",
    image: "/images/stores/endustriyel-elektrik.jpg"
  },
  {
    id: "store-18",
    name: "Elektrikli Araçlar",
    slug: "elektrikli-araclar",
    image: "/images/stores/elektrikli-araclar.jpg"
  },
  {
    id: "store-19",
    name: "Güneş Enerjisi",
    slug: "gunes-enerjisi",
    image: "/images/stores/gunes-enerjisi.jpg"
  },
  {
    id: "store-20",
    name: "Elektrik Panoları",
    slug: "elektrik-panolari",
    image: "/images/stores/elektrik-panolari.jpg"
  }
];

/**
 * Mağaza arama fonksiyonu
 */
export function searchStores(query: string, limit: number = 10): Store[] {
  if (!query.trim()) {
    return [];
  }

  const queryLower = query.toLowerCase();
  
  // Mağaza adında query geçenleri filtrele
  const matchingStores = staticStores.filter(store => 
    store.name.toLowerCase().includes(queryLower)
  );

  // Öncelik sırasına göre sırala
  const sortedStores = matchingStores.sort((a, b) => {
    const aNameLower = a.name.toLowerCase();
    const bNameLower = b.name.toLowerCase();
    
    // Tam eşleşme öncelikli
    const aExactMatch = aNameLower === queryLower;
    const bExactMatch = bNameLower === queryLower;
    
    if (aExactMatch && !bExactMatch) return -1;
    if (!aExactMatch && bExactMatch) return 1;
    
    // Başlangıç eşleşmesi
    const aStartsWith = aNameLower.startsWith(queryLower);
    const bStartsWith = bNameLower.startsWith(queryLower);
    
    if (aStartsWith && !bStartsWith) return -1;
    if (!aStartsWith && bStartsWith) return 1;
    
    // İçinde geçme
    const aIncludes = aNameLower.includes(queryLower);
    const bIncludes = bNameLower.includes(queryLower);
    
    if (aIncludes && !bIncludes) return -1;
    if (!aIncludes && bIncludes) return 1;
    
    // Aynı öncelik seviyesindeyse alfabetik sırala
    return a.name.localeCompare(b.name, 'tr');
  });

  return sortedStores.slice(0, limit);
}
