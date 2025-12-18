export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('tr-TR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(price);
};

// Türkiye standartlarına uygun fiyat formatı (nokta ile ondalık ayırıcı)
export const formatPriceTR = (price: number): string => {
  return price.toLocaleString('tr-TR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    useGrouping: true
  });
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

export const getStatusText = (status: string): string => {
  const statusMap: { [key: string]: string } = {
    'pending': 'Beklemede',
    'in_progress': 'Kargoya Hazırlanıyor',
    'shipping': 'Kargoya Verildi',
    'delivered': 'Teslim Edildi',
    'canceled': 'İptal Edildi',
    'return_requested': 'İade Talep Edildi',
    'return_pending': 'İade Bekleniyor',
    'returned': 'İade Ulaştı'
  };
  return statusMap[status] || status;
};

export const getStatusColor = (status: string): string => {
  const colorMap: { [key: string]: string } = {
    'pending': 'bg-orange-100 text-orange-800',
    'in_progress': 'bg-blue-100 text-blue-800',
    'shipping': 'bg-purple-100 text-purple-800',
    'delivered': 'bg-green-100 text-green-800',
    'canceled': 'bg-red-100 text-red-800',
    'return_requested': 'bg-yellow-100 text-yellow-800',
    'return_pending': 'bg-indigo-100 text-indigo-800',
    'returned': 'bg-gray-100 text-gray-800'
  };
  return colorMap[status] || 'bg-gray-100 text-gray-800';
}; 