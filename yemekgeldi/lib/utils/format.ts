/**
 * Format utility functions
 * Locale'i sabit tutarak hydration hatalarını önler
 */

const LOCALE = 'tr-TR';

/**
 * Sayıyı Türkçe formatında formatlar
 * @param value Formatlanacak sayı
 * @returns Formatlanmış string (örn: 5.432)
 */
export function formatNumber(value: number): string {
  return value.toLocaleString(LOCALE);
}

/**
 * Sayıyı Türkçe formatında formatlar (binlik ayırıcı olmadan)
 * @param value Formatlanacak sayı
 * @returns Formatlanmış string (örn: 5432)
 */
export function formatNumberCompact(value: number): string {
  return value.toString();
}

/**
 * Tarihi Türkçe formatında formatlar
 * @param date Formatlanacak tarih
 * @returns Formatlanmış string
 */
export function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString(LOCALE);
}

/**
 * Tarih ve saati Türkçe formatında formatlar
 * @param date Formatlanacak tarih
 * @returns Formatlanmış string
 */
export function formatDateTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleString(LOCALE);
}

/**
 * Para birimini formatlar
 * @param value Miktar
 * @param currency Para birimi (varsayılan: TRY)
 * @returns Formatlanmış string
 */
export function formatCurrency(value: number, currency: string = 'TRY'): string {
  return new Intl.NumberFormat(LOCALE, {
    style: 'currency',
    currency,
  }).format(value);
}

