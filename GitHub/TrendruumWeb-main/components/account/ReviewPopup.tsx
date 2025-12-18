import { useState } from 'react';
import Image from 'next/image';
import { StarIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { formatPrice } from '@/app/utils/format';

interface ReviewProduct {
  id: string;
  name: string;
  image: string;
  price: number;
}

interface ReviewPopupProps {
  isOpen: boolean;
  onClose: () => void;
  product: ReviewProduct | null;
  onSubmit: (rating: number, comment: string) => void;
}

export const ReviewPopup = ({ isOpen, onClose, product, onSubmit }: ReviewPopupProps) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hoverRating, setHoverRating] = useState(0);

  if (!isOpen || !product) return null;

  const handleSubmit = () => {
    onSubmit(rating, comment);
    setRating(0);
    setComment('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-sm border border-gray-200">
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-black">Ürün Değerlendirmesi</h3>
            <button onClick={onClose} className="text-black hover:text-gray-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex items-center space-x-3 mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="relative w-16 h-16">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover rounded-lg"
              />
            </div>
            <div>
              <h4 className="font-medium text-black text-sm">{product.name}</h4>
              <p className="text-xs text-black mt-1">{formatPrice(product.price)} TL</p>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-xs font-medium text-black mb-2">Puanınız</label>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="focus:outline-none"
                >
                  {star <= (hoverRating || rating) ? (
                    <StarIconSolid className="w-7 h-7 text-orange-500" />
                  ) : (
                    <StarIcon className="w-7 h-7 text-gray-300" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="comment" className="block text-xs font-medium text-black mb-1">
              Yorumunuz
            </label>
            <textarea
              id="comment"
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 text-black placeholder-gray-400 text-xs"
              placeholder="Ürün hakkında düşüncelerinizi paylaşın..."
            />
          </div>

          <div className="flex justify-end space-x-2">
            <button
              onClick={onClose}
              className="px-3 py-2 text-xs font-medium text-black bg-gray-100 rounded-lg hover:bg-gray-200 border border-gray-200"
            >
              İptal
            </button>
            <button
              onClick={handleSubmit}
              disabled={rating === 0}
              className="px-3 py-2 text-xs font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Değerlendir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 