'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useMenu } from '../../app/context/MenuContext';

interface MenuItem {
  name: string;
  url: string;
  type: string;
  slug: string;
  children?: MenuItem[];
  badge?: string;
}

export default function TrendruumMenu() {
  const pathname = usePathname();
  const { trendruumMenu, isLoading } = useMenu();

  // Fallback static menu items if API fails
  const fallbackMenuItems = [
    {
      id: { $oid: '1' },
      name: 'Biz Kimiz',
      url: '/s/biz-kimiz',
      type: 'custom',
      slug: 'biz-kimiz'
    },
    {
      id: { $oid: '2' },
      name: 'Kariyer',
      url: '/s/kariyer',
      type: 'custom',
      slug: 'kariyer'
    },
    {
      id: { $oid: '3' },
      name: 'Sürdürülebilirlik',
      url: '/s/surdurulebilirlik',
      type: 'custom',
      slug: 'surdurulebilirlik'
    },
    {
      id: { $oid: '4' },
      name: 'İletişim',
      url: '/s/iletisim',
      type: 'custom',
      slug: 'iletisim'
    }
  ];

  const menuItems = trendruumMenu.length > 0 ? trendruumMenu : fallbackMenuItems;
  const loading = isLoading;

  return (
    <div className="w-64 bg-white rounded-lg border p-4">
      <h2 className="text-xl font-medium mb-4 text-gray-900">Trendruum</h2>
      <nav>
        <ul className="space-y-2">
          {loading ? (
            // Loading skeleton
            [...Array(4)].map((_, i) => (
              <li key={i}>
                <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
              </li>
            ))
          ) : (
            menuItems.map((item) => (
              <li key={item.id.$oid}>
                <Link
                  href={item.url.startsWith('http') ? item.url : item.url}
                  className={`block px-4 py-2 rounded-lg transition-colors ${
                    pathname === item.url
                      ? 'bg-orange-50 text-[#F27A1A]'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  target={item.url.startsWith('http') ? '_blank' : '_self'}
                >
                  {item.name}
                </Link>
              </li>
            ))
          )}
        </ul>
      </nav>
    </div>
  );
} 