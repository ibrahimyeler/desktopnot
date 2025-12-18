import { TrashIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import Link from 'next/link';
import { createProductUrl } from '@/utils/productUrl';

interface BasketItem {
  id: string;
  product_id: string;
  quantity: number;
  price: number;
  name: string;
  image?: string;
}

interface BasketItemListProps {
  items: BasketItem[];
  onQuantityChange: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
}

export default function BasketItemList({
  items,
  onQuantityChange,
  onRemoveItem
}: BasketItemListProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(price);
  };

  if (!items?.length) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Sepetinizde ürün bulunmamaktadır.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div
          key={item.id}
          className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200"
        >
          <Link href={createProductUrl(item.product_id)} className="relative w-20 h-20 flex-shrink-0 hover:opacity-80 transition-opacity">
            {item.image ? (
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover rounded cursor-pointer"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
                <span className="text-gray-400 text-xs">Resim yok</span>
              </div>
            )}
          </Link>

          <div className="flex-grow">
            <Link href={createProductUrl(item.product_id)} className="block">
              <h3 className="text-sm font-medium text-black hover:text-orange-500 transition-colors cursor-pointer">{item.name}</h3>
            </Link>
            <p className="text-sm font-semibold text-orange-500 mt-1">
              {formatPrice(item.price)}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center border border-gray-200 rounded">
              <button
                onClick={() => onQuantityChange(item.id, item.quantity - 1)}
                className="px-3 py-1 text-gray-500 hover:text-orange-500 disabled:opacity-50"
                disabled={item.quantity <= 1}
              >
                -
              </button>
              <span className="px-3 py-1 text-sm text-black">{item.quantity}</span>
              <button
                onClick={() => onQuantityChange(item.id, item.quantity + 1)}
                className="px-3 py-1 text-gray-500 hover:text-orange-500"
              >
                +
              </button>
            </div>

            <button
              onClick={() => onRemoveItem(item.id)}
              className="text-gray-400 hover:text-red-500"
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
} 