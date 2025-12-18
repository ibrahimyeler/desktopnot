import Link from 'next/link';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';

export default function EmptyBasket() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto text-center">
        <ShoppingCartIcon className="w-16 h-16 mx-auto text-gray-400" />
        <h2 className="mt-4 text-2xl font-semibold text-black">
          Sepetiniz Boş
        </h2>
        <p className="mt-2 text-gray-500">
          Sepetinizde henüz ürün bulunmamaktadır. Alışverişe başlamak için aşağıdaki butonu kullanabilirsiniz.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-200"
        >
          Alışverişe Başla
        </Link>
      </div>
    </div>
  );
} 