// Arama teriminden cinsiyet anahtar kelimelerini tespit eden utility fonksiyonları

export interface GenderDetectionResult {
  detectedGender: number | null; // 1: kadın, 2: erkek, null: belirsiz
  cleanedQuery: string; // Cinsiyet kelimeleri çıkarılmış temiz arama terimi
  genderApplied: string | null; // Uygulanan cinsiyet ("kadın" veya "erkek")
}

// Cinsiyet anahtar kelimeleri
const GENDER_KEYWORDS = {
  // Erkek anahtar kelimeleri
  erkek: 2,
  bay: 2,
  'bay ': 2, // "bay " ile başlayan kelimeler için
  
  // Kadın anahtar kelimeleri  
  kadin: 1,
  kadın: 1,
  bayan: 1,
  kiz: 1,
  kız: 1,
  'kız ': 1, // "kız " ile başlayan kelimeler için
  'kiz ': 1, // "kiz " ile başlayan kelimeler için
};

/**
 * Arama teriminden cinsiyet bilgisini tespit eder
 * @param searchTerm - Arama terimi
 * @returns GenderDetectionResult - Tespit edilen cinsiyet ve temizlenmiş arama terimi
 */
export function detectGenderFromSearchTerm(searchTerm: string): GenderDetectionResult {
  if (!searchTerm || typeof searchTerm !== 'string') {
    return {
      detectedGender: null,
      cleanedQuery: searchTerm || '',
      genderApplied: null
    };
  }

  const lowerTerm = searchTerm.toLowerCase().trim();
  let detectedGender: number | null = null;
  let genderApplied: string | null = null;
  let cleanedQuery = searchTerm;

  // Cinsiyet anahtar kelimelerini kontrol et
  for (const [keyword, genderCode] of Object.entries(GENDER_KEYWORDS)) {
    const keywordLower = keyword.toLowerCase();
    
    // Tam kelime olarak geçiyor mu kontrol et
    const regex = new RegExp(`\\b${keywordLower}\\b`, 'i');
    if (regex.test(lowerTerm)) {
      detectedGender = genderCode;
      genderApplied = genderCode === 1 ? 'kadın' : 'erkek';
      
      // Eğer arama terimi sadece cinsiyet kelimesiyse, arama terimini koru
      if (lowerTerm.trim() === keywordLower.trim()) {
        cleanedQuery = searchTerm; // Orijinal terimi koru
      } else {
        // Cinsiyet kelimesini arama teriminden çıkar
        cleanedQuery = searchTerm.replace(regex, '').trim();
        
        // Fazla boşlukları temizle
        cleanedQuery = cleanedQuery.replace(/\s+/g, ' ').trim();
      }
      
      break; // İlk eşleşen cinsiyet kelimesini kullan
    }
  }

  return {
    detectedGender,
    cleanedQuery,
    genderApplied
  };
}

/**
 * Arama terimi ve cinsiyet bilgisine göre URL oluşturur
 * @param searchTerm - Arama terimi
 * @param detectedGender - Tespit edilen cinsiyet (1: kadın, 2: erkek, null: belirsiz)
 * @returns string - Oluşturulan URL
 */
export function buildSearchUrl(searchTerm: string, detectedGender: number | null = null): string {
  const { cleanedQuery } = detectGenderFromSearchTerm(searchTerm);
  
  // Eğer cinsiyet tespit edilmediyse, orijinal terimi kullan
  const finalQuery = cleanedQuery || searchTerm;
  
  // Base URL
  let url = `/q?q=${encodeURIComponent(finalQuery)}`;
  
  // Cinsiyet parametresi ekle (Search sayfası gibi a_cinsiyet formatı)
  if (detectedGender !== null) {
    const genderValue = detectedGender === 1 ? 'kadin-kiz' : 'erkek';
    url += `&a_cinsiyet=${genderValue}`;
  }
  
  return url;
}

/**
 * Türkçe karakterleri İngilizce karşılıklarına çevirir
 * @param text - Çevrilecek metin
 * @returns string - Çevrilmiş metin
 */
function transliterateTurkish(text: string): string {
  const turkishToEnglish: { [key: string]: string } = {
    'ç': 'c', 'Ç': 'C',
    'ğ': 'g', 'Ğ': 'G',
    'ı': 'i', 'I': 'I',
    'ö': 'o', 'Ö': 'O',
    'ş': 's', 'Ş': 'S',
    'ü': 'u', 'Ü': 'U'
  };

  return text.replace(/[çÇğĞıIöÖşŞüÜ]/g, (char) => turkishToEnglish[char] || char);
}

/**
 * Arama terimini analiz edip doğru URL'yi oluşturur
 * @param searchTerm - Arama terimi
 * @returns string - Oluşturulan URL
 */
export function processSearchTerm(searchTerm: string): string {
  const { detectedGender, cleanedQuery } = detectGenderFromSearchTerm(searchTerm);
  
  // URL'de orijinal Türkçe karakterleri koru (transliteration yapma)
  return buildSearchUrl(cleanedQuery, detectedGender);
}

/**
 * Orijinal arama terimini döndürür (cinsiyet kelimeleri çıkarılmış ama Türkçe karakterler korunmuş)
 * @param searchTerm - Arama terimi
 * @returns string - Orijinal arama terimi
 */
export function getOriginalSearchTerm(searchTerm: string): string {
  const { cleanedQuery } = detectGenderFromSearchTerm(searchTerm);
  return cleanedQuery;
}
