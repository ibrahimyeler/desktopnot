/**
 * Ürün URL'sini oluşturur
 * @param slug Ürün slug'ı
 * @returns Ürün URL'si
 */
export function createProductUrl(slug: string): string {
  return `/urunler/${slug}`;
}

/**
 * Ürün slug'ından URL oluşturur (ID yoksa slug kullanır)
 * @param slug Ürün slug'ı
 * @returns Ürün URL'si
 */
export function createProductUrlFromSlug(slug: string): string {
  return `/urunler/${slug}`;
}

/**
 * Ürün ID'sinden URL oluşturur (slug yoksa ID kullanır)
 * @param id Ürün ID'si
 * @returns Ürün URL'si
 */
export function createProductUrlFromId(id: string): string {
  return `/urunler/${id}`;
}
