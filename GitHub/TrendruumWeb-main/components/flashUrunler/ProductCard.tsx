import Image from 'next/image';

interface ProductCardProps {
  image: string;
  title: string;
  price: string;
  rating: number;
  reviewCount: string;
  soldCount?: string;
  badges?: string[];
  specialTag?: string;
}

const ProductCard = ({
  image,
  title,
  price,
  rating,
  reviewCount,
  soldCount,
  badges,
  specialTag
}: ProductCardProps) => {
  return (
    <div className="rounded-lg overflow-hidden transition-all duration-300 hover:scale-[1.02]">
      {/* Ürün Resmi */}
      <div className="relative aspect-w-1 aspect-h-1 p-2">
        <Image
          src={image}
          alt={title}
          width={400}
          height={400}
          className="w-full h-48 object-contain rounded-lg"
          priority
        />
        {specialTag && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-medium">
            {specialTag}
          </div>
        )}
      </div>

      {/* Ürün Bilgileri */}
      <div className="pt-4">
        <h3 className="text-sm font-medium text-gray-700 line-clamp-2 min-h-[40px]">{title}</h3>
        
        {/* Rating ve Review */}
        <div className="mt-2 flex items-center">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`h-3.5 w-3.5 ${
                  i < rating ? 'text-yellow-400' : 'text-gray-200'
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="ml-1 text-xs text-gray-500">{reviewCount}</span>
        </div>

        {/* Fiyat */}
        <div className="mt-2">
          <span className="text-lg font-semibold text-gray-900">{price}</span>
        </div>

        {/* Satış Sayısı */}
        {soldCount && (
          <div className="mt-1 text-xs text-gray-500">
            {soldCount} satış
          </div>
        )}

        {/* Rozetler */}
        {badges && badges.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {badges.map((badge, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-50 text-orange-700"
              >
                {badge}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard; 