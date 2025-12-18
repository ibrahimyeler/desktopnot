import React from 'react';
import { 
  ComputerDesktopIcon,
  TagIcon,
  HomeIcon,
  ShoppingBagIcon,
  DevicePhoneMobileIcon,
  BookOpenIcon,
  TruckIcon,
  HeartIcon,
  SparklesIcon,
  GiftIcon
} from '@heroicons/react/24/outline';

export const categoryIcons: { [key: string]: React.ReactElement } = {
  'elektronik': <ComputerDesktopIcon className="w-4 h-4 mr-2 transition-colors duration-200 group-hover:text-orange-500" />,
  'moda-ve-giyim': <TagIcon className="w-4 h-4 mr-2 transition-colors duration-200 group-hover:text-orange-500" />,
  'ev-ve-yasam': <HomeIcon className="w-4 h-4 mr-2 transition-colors duration-200 group-hover:text-orange-500" />,
  'spor-ve-outdoor': <ShoppingBagIcon className="w-4 h-4 mr-2 transition-colors duration-200 group-hover:text-orange-500" />,
  'telefon-ve-aksesuarlari': <DevicePhoneMobileIcon className="w-4 h-4 mr-2 transition-colors duration-200 group-hover:text-orange-500" />,
  'kitap-muzik-film': <BookOpenIcon className="w-4 h-4 mr-2 transition-colors duration-200 group-hover:text-orange-500" />,
  'otomotiv': <TruckIcon className="w-4 h-4 mr-2 transition-colors duration-200 group-hover:text-orange-500" />,
  'kozmetik': <HeartIcon className="w-4 h-4 mr-2 transition-colors duration-200 group-hover:text-orange-500" />,
  'oyuncak': <GiftIcon className="w-4 h-4 mr-2 transition-colors duration-200 group-hover:text-orange-500" />,
  'flash-urunler': <SparklesIcon className="w-4 h-4 mr-2 transition-colors duration-200 group-hover:text-orange-500" />,
}; 