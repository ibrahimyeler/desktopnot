"use client";

import { useRouter } from 'next/navigation';

interface Link {
  title: string;
  color: string;
  link: string;
  textColor: string;
}

interface QuickLinksProps {
  links?: Link[];
  category?: string;
}

export default function QuickLinks({ links = [], category }: QuickLinksProps) {
  const router = useRouter();

  const handleClick = (link: string) => {
    if (link) {
      // Eğer link bir kategori slug'ı ise, kategori sayfasına yönlendir
      if (link.startsWith('/')) {
        router.push(link);
      } else if (link.includes('=')) {
        // Eğer link query parametreleri içeriyorsa, flash-urunler sayfasına yönlendir
        router.push(`/flash-urunler?${link}`);
      } else {
        // Basit kategori slug'ı ise kategori sayfasına yönlendir
        router.push(`/${link}`);
      }
    }
  };

  if (!links || links.length === 0) return null;

  return (
    <div className="bg-white py-2 mb-5">
      <div className="container mx-auto px-2 sm:px-3 lg:px-4 xl:px-6 2xl:px-8">
        <div className="flex flex-col items-stretch justify-center gap-1 sm:flex-row sm:items-center sm:gap-1 max-w-7xl mx-auto" style={{ flexDirection: 'column' }}>
          <style jsx>{`
            @media (min-width: 640px) {
              div {
                flex-direction: row !important;
              }
            }
          `}</style>
          {links.map((link, index) => (
            <button 
              key={index}
              onClick={() => handleClick(link.link)}
              className="block w-full rounded-lg px-4 py-3 text-center transition-colors cursor-pointer sm:flex-1 sm:px-6 sm:py-4 lg:px-10"
              style={{ 
                backgroundColor: link.color,
                color: link.textColor
              }}
            >
              <span className="text-sm font-extrabold sm:text-base lg:text-lg xl:text-xl 2xl:text-2xl">
                {link.title}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}