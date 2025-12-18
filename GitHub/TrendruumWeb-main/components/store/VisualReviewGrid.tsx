import React from 'react';
import Image from 'next/image';

const reviews = [
  {
    id: 1,
    rating: 5,
    comment: 'Ürün çok kaliteli ve hızlı geldi!',
    user: { name: 'Ayşe Y.', avatar: '/avatar1.png' },
    productImage: '/product1.png',
  },
  {
    id: 2,
    rating: 4,
    comment: 'Fiyat/performans ürünü, tavsiye ederim.',
    user: { name: 'Mehmet K.', avatar: '/avatar2.png' },
    productImage: '/product2.png',
  },
  {
    id: 3,
    rating: 5,
    comment: 'Çok memnun kaldım, tekrar alırım.',
    user: { name: 'Zeynep T.', avatar: '/avatar3.png' },
    productImage: '/product3.png',
  },
];

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex items-center mb-2">
    {[1,2,3,4,5].map((star) => (
      <svg
        key={star}
        className={`w-5 h-5 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.385-2.46a1 1 0 00-1.175 0l-3.385 2.46c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.045 9.394c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.967z" />
      </svg>
    ))}
  </div>
);

const VisualReviewGrid = () => {
  return (
    <div className="w-full py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-[1600px] mx-auto">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="bg-gray-200 rounded-xl p-6 flex flex-col shadow-sm hover:shadow-lg transition-all"
          >
            <StarRating rating={review.rating} />
            <div className="text-gray-600 text-base mb-4">
              &ldquo;{review.comment}&rdquo;
            </div>
            <div className="flex items-center mb-4">
              <div className="relative w-10 h-10 mr-3">
                <Image
                  src={review.user.avatar}
                  alt={review.user.name}
                  fill
                  className="rounded-full object-cover"
                  sizes="40px"
                />
              </div>
              <span className="text-gray-700 font-semibold">{review.user.name}</span>
            </div>
            <div className="relative w-full h-40 bg-gray-300 rounded-lg mt-auto">
              <Image
                src={review.productImage}
                alt="Ürün görseli"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VisualReviewGrid; 