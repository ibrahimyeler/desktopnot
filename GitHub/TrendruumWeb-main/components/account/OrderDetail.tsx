import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatDate, formatPrice, getStatusText, getStatusColor } from '@/app/utils/format';
import { ReviewPopup } from './ReviewPopup';
import AskOrderQuestionModal from './AskOrderQuestionModal';
import { API_V1_URL } from '@/lib/config';
import { createProductUrl } from '@/utils/productUrl';
import toast from 'react-hot-toast';
import { useBasket } from '@/app/context/BasketContext';

interface Media {
  name: string;
  fullpath: string;
  url: string;
  type: string;
  updated_at: string;
  created_at: string;
  id: string;
}

interface Product {
  name: string;
  price: number;
  medias: Media;
  slug: string;
  updated_at: string;
  created_at: string;
  id: string;
}

interface OrderGroupItem {
  order_group_id: string;
  product_id: string;
  quantity: number;
  price: number;
  product: Product;
  updated_at: string;
  created_at: string;
  id: string;
}

interface Address {
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
}

interface Invoice {
  type: 'individual' | 'corporate';
}



interface OrderAddress {
  firstname: string;
  lastname: string;
  phone: string;
  invoice: Invoice;
  address: Address;
  updated_at: string;
  created_at: string;
  id: string;
}

interface OrderGroup {
  order_id: string;
  status: string;
  address: OrderAddress;
  payment: any[];
  total_price: number;
  updated_at: string;
  created_at: string;
  id: string;
  order_group_items: OrderGroupItem[];
  order_number?: string;
  tracking_number?: string;
}

interface Order {
  user_id: string;
  status: string;
  payment: any[];
  address: OrderAddress;
  total_price: number;
  updated_at: string;
  created_at: string;
  id: string;
  order_number?: string;
  order_groups: OrderGroup[];
}

interface ReviewProduct {
  id: string;
  name: string;
  image: string;
  price: number;
}

interface OrderDetailProps {
  order: Order;
  onClose: () => void;
}

const OrderDetail = ({ order, onClose }: OrderDetailProps) => {
  const [showReviewPopup, setShowReviewPopup] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ReviewProduct | null>(null);
  const [showOrderQuestionModal, setShowOrderQuestionModal] = useState(false);
  const { addToBasket } = useBasket();

  const handleReviewClick = (item: OrderGroupItem) => {
    setSelectedProduct({
      id: item.product.id,
      name: item.product.name,
      image: item.product.medias.url,
      price: item.product.price
    });
    setShowReviewPopup(true);
  };

  const handleReorder = async (item: OrderGroupItem) => {
    try {
      // BasketContext'teki addToBasket fonksiyonunu kullan
      await addToBasket(item.product.id, item.quantity);
      
    } catch (error) {
   
      // Hata mesajı BasketContext'te yönetiliyor, burada ekstra alert göstermeye gerek yok
    }
  };

  const handleReviewSubmit = async (rating: number, comment: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token || !selectedProduct) return;

      const requestBody = {
        rating: rating.toString(),
        comment,
        reference_id: selectedProduct.id,
        type: 'product'
      };



      const response = await fetch(`${API_V1_URL}/customer/reviews/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestBody),
      });

 
      if (!response.ok) {
        let errorMessage = 'Değerlendirme gönderilemedi';
        try {
          const errorData = await response.json();
          errorMessage = errorData.meta?.message || errorMessage;
        } catch (e) {
        }
        throw new Error(errorMessage);
      }

      let data;
      try {
        data = await response.json();
      } catch (e) {
        throw new Error('Sunucu yanıtı işlenemedi');
      }

      if (data.meta?.status === 'success') {
        toast.success('Değerlendirme başarıyla gönderildi!');
      } else {
        throw new Error(data.meta?.message || 'Değerlendirme gönderilemedi');
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Değerlendirme gönderilemedi');
    }
  };

  // Sipariş iptal fonksiyonu
  const handleCancelOrder = async (orderId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
        return;
      }



      const response = await fetch(`${API_V1_URL}/customer/orders/${orderId}/cancel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          reason: 'Müşteri talebi'
        })
      });



      if (!response.ok) {
        let errorMessage = 'Sipariş iptal edilemedi';
        try {
          const errorData = await response.json();
          errorMessage = errorData.meta?.message || errorData.message || errorMessage;
        } catch (e) {
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      
      if (data.meta?.status === 'success') {
        toast.success('Sipariş başarıyla iptal edildi!');
        onClose(); // Modal'ı kapat
      } else {
        throw new Error(data.meta?.message || 'Sipariş iptal edilemedi');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Sipariş iptal edilemedi');
    }
  };

  // Ürün iptal fonksiyonu
  const handleCancelItem = async (orderId: string, itemId: string, productName: string) => {
    if (!confirm(`${productName} ürününü iptal etmek istediğinizden emin misiniz?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
        return;
      }


      const response = await fetch(`${API_V1_URL}/customer/orders/${orderId}/items/${itemId}/cancel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          reason: 'Müşteri talebi'
        })
      });

      if (!response.ok) {
        let errorMessage = 'Ürün iptal edilemedi';
        try {
          const errorData = await response.json();
          errorMessage = errorData.meta?.message || errorData.message || errorMessage;
        } catch (e) {
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      
      if (data.meta?.status === 'success') {
        toast.success('Ürün başarıyla iptal edildi!');
        onClose(); // Modal'ı kapat
        window.location.reload(); // Sayfayı yenile
      } else {
        throw new Error(data.meta?.message || 'Ürün iptal edilemedi');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Ürün iptal edilemedi');
    }
  };

  // Ürün iade fonksiyonu
  const handleReturnItem = async (orderId: string, itemId: string, productName: string) => {
    if (!confirm(`${productName} ürününü iade etmek istediğinizden emin misiniz?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
        return;
      }


      const response = await fetch(`${API_V1_URL}/customer/orders/${orderId}/items/${itemId}/return`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          reason: 'Müşteri talebi'
        })
      });

      if (!response.ok) {
        let errorMessage = 'Ürün iade edilemedi';
        try {
          const errorData = await response.json();
          errorMessage = errorData.meta?.message || errorData.message || errorMessage;
        } catch (e) {
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      
      if (data.meta?.status === 'success') {
        toast.success('Ürün iade talebi başarıyla oluşturuldu!');
        onClose(); // Modal'ı kapat
        window.location.reload(); // Sayfayı yenile
      } else {
        throw new Error(data.meta?.message || 'Ürün iade edilemedi');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Ürün iade edilemedi');
    }
  };

  // Sipariş iade fonksiyonu
  const handleReturnOrder = async (orderId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
        return;
      }


      const response = await fetch(`${API_V1_URL}/customer/orders/${orderId}/return`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          reason: 'Müşteri talebi'
        })
      });

 

      if (!response.ok) {
        let errorMessage = 'Sipariş iade edilemedi';
        try {
          const errorData = await response.json();
          errorMessage = errorData.meta?.message || errorData.message || errorMessage;
        } catch (e) {
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      
      if (data.meta?.status === 'success') {
        toast.success('Sipariş iade talebi başarıyla oluşturuldu!');
        onClose(); // Modal'ı kapat
      } else {
        throw new Error(data.meta?.message || 'Sipariş iade edilemedi');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Sipariş iade edilemedi');
    }
  };

  // Sipariş durumuna göre hangi butonun gösterileceğini belirle
  const getOrderActionButton = (order: Order) => {
    const orderDate = new Date(order.created_at);
    const currentDate = new Date();
    const daysDiff = Math.floor((currentDate.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24));

    // Sipariş alındı ancak kargo henüz ulaşmadıysa - İptal
    if (order.status === 'pending' || order.status === 'confirmed' || order.status === 'processing') {
      return (
        <button
          onClick={() => handleCancelOrder(order.id)}
          className="px-3 py-2 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 w-full sm:w-auto"
        >
          Siparişi İptal Et
        </button>
      );
    }

    // Kargo ulaştı ancak 14 gün geçmediyse - İade
    if ((order.status === 'shipped' || order.status === 'delivered' || order.status === 'completed') && daysDiff <= 14) {
      return (
        <button
          onClick={() => handleReturnOrder(order.id)}
          className="px-3 py-2 text-xs font-medium text-orange-600 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 w-full sm:w-auto"
        >
          Siparişi İade Et
        </button>
      );
    }

    // 14 günden fazla geçtiyse hiçbir buton gösterme
    return null;
  };

  // Ürün durumuna göre hangi butonun gösterileceğini belirle
  const getItemActionButton = (order: Order, item: any) => {
    const orderDate = new Date(order.created_at);
    const currentDate = new Date();
    const daysDiff = Math.floor((currentDate.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24));

    // Sipariş alındı ancak kargo henüz ulaşmadıysa - Ürün İptal
    if (order.status === 'pending' || order.status === 'confirmed' || order.status === 'processing') {
      return (
        <button
          onClick={() => handleCancelItem(order.id, item.id, item.product.name)}
          className="px-3 py-2 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 w-full sm:w-auto"
        >
          Ürünü İptal Et
        </button>
      );
    }

    // Kargo ulaştı ancak 14 gün geçmediyse - Ürün İade
    if ((order.status === 'shipped' || order.status === 'delivered' || order.status === 'completed') && daysDiff <= 14) {
      return (
        <button
          onClick={() => handleReturnItem(order.id, item.id, item.product.name)}
          className="px-3 py-2 text-xs font-medium text-orange-600 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 w-full sm:w-auto"
        >
          Ürünü İade Et
        </button>
      );
    }

    return null;
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] sm:max-h-[85vh] overflow-y-auto border border-gray-200">
        <div className="p-3 sm:p-4 pb-5">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1 min-w-0">
              <h2 className="text-lg sm:text-xl font-bold text-black truncate">
                {order.order_groups?.[0]?.order_number ? `Sipariş Numarası #${order.order_groups[0].order_number}` : `Sipariş Numarası #${order.order_groups?.[0]?.order_id?.slice(-6) || order.id.slice(-6)}`}
              </h2>
              <p className="text-xs text-black mt-1 sm:mt-2">
                {formatDate(order.created_at)}
              </p>
            </div>
            <div className="flex items-center gap-2 sm:gap-4 ml-2">
              <span className={`px-2 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-semibold ${getStatusColor(order.status)}`}>
                {getStatusText(order.status)}
              </span>
              <button
                onClick={onClose}
                className="text-black hover:text-gray-600 p-1"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-3 mb-4 border border-gray-200">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
              <div>
                <p className="text-xs font-medium text-black">Sipariş Durumu</p>
                <p className="text-base sm:text-lg font-bold text-black mt-1">{getStatusText(order.status)}</p>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-xs font-medium text-black">Toplam Tutar</p>
                <p className="text-base sm:text-lg font-bold text-black mt-1">{formatPrice(order.total_price)} TL</p>
              </div>
            </div>
            <div className="mt-3 flex justify-center">
              <button
                onClick={() => setShowOrderQuestionModal(true)}
                className="inline-flex items-center px-3 py-2 text-xs font-medium text-black bg-gray-100 rounded-lg hover:bg-gray-200 border border-gray-200 w-full sm:w-auto justify-center"
              >
                <svg className="w-3 h-3 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="truncate">Sipariş Hakkında Soru Sor</span>
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {order.order_groups.map((group) => (
              <div key={group.id} className="border border-gray-200 rounded-lg p-3 bg-white">
                <div className="space-y-3">
                  {group.order_group_items.map((item) => (
                    <div key={item.id} className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <Link href={createProductUrl(item.product.slug)} className="relative w-16 h-16 sm:w-12 sm:h-12 rounded-lg overflow-hidden bg-white border border-gray-200 hover:opacity-80 transition-opacity flex-shrink-0">
                          {(() => {
                            const imageUrl = item.product.medias?.url || (Array.isArray(item.product.medias) ? item.product.medias[0]?.url : null);
                            return imageUrl && imageUrl.trim() !== '' ? (
                              <Image
                                src={imageUrl}
                                alt={item.product.name}
                                fill
                                className="object-contain"
                              />
                            ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-100">
                              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                            );
                          })()}
                        </Link>
                        <div className="flex-1 min-w-0">
                          <Link href={createProductUrl(item.product.slug)} className="block">
                            <h4 className="text-sm font-semibold text-black hover:text-orange-600 transition-colors cursor-pointer line-clamp-2">
                              {item.product.name}
                            </h4>
                          </Link>
                          <p className="text-xs text-black mt-1">
                            {item.quantity} adet x {formatPrice(item.price)} TL
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                        {group.status === 'completed' && (
                          <button
                            onClick={() => handleReviewClick(item)}
                            className="px-3 py-2 text-xs font-medium text-orange-500 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 w-full sm:w-auto"
                          >
                            Değerlendir
                          </button>
                        )}
                        {getItemActionButton(order, item)}
                        <button
                          onClick={() => handleReorder(item)}
                          className="px-3 py-2 text-xs font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600 w-full sm:w-auto"
                        >
                          Tekrar Satın Al
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 space-y-2">
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="text-sm font-semibold text-black mb-2">Teslimat Adresi</h4>
              <div className="text-xs text-black space-y-1">
                <p className="font-medium">{order.address.firstname} {order.address.lastname}</p>
                <p>{order.address.phone}</p>
                <p className="break-words">{order.address.address.description}</p>
                <p className="break-words">
                  {order.address.address.neighborhood?.name || ''}, {order.address.address.district?.name || ''}, {order.address.address.city?.name || ''}
                </p>
              </div>
            </div>

            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="text-sm font-semibold text-black mb-1">Fatura Bilgileri</h4>
              <p className="text-xs text-black">
                {order.address.invoice.type === 'individual' ? 'Bireysel' : 'Kurumsal'}
              </p>
            </div>
          </div>
        </div>

        <ReviewPopup
          isOpen={showReviewPopup}
          onClose={() => {
            setShowReviewPopup(false);
            setSelectedProduct(null);
          }}
          product={selectedProduct}
          onSubmit={handleReviewSubmit}
        />



        <AskOrderQuestionModal
          isOpen={showOrderQuestionModal}
          onClose={() => setShowOrderQuestionModal(false)}
          orderId={order.order_groups[0]?.id || order.order_groups[0]?.order_id || order.id}
          orderNumber={order.order_groups[0]?.order_number || order.order_groups[0]?.order_id?.slice(-6) || order.order_groups[0]?.id?.slice(-6) || order.id.slice(-6)}
        />
      </div>
    </div>
  );
};

export default OrderDetail; 