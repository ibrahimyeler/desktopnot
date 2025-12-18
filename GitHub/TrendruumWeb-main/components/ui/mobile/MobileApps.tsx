import Image from 'next/image';
import Link from 'next/link';

const MobileApps = () => {
  const appStores = [
    {
      id: 1,
      name: 'App Store',
      image: '/mobile/app-store.webp',
      link: 'https://apps.apple.com/app/trendruum',
      alt: "App Store'dan İndirin",
      className: 'bg-black'
    },
    {
      id: 2,
      name: 'Google Play',
      image: '/mobile/google-play.webp',
      link: 'https://play.google.com/store/apps/details?id=trendruum',
      alt: "Google Play'den Alın",
      className: 'bg-black'
    },
    {
      id: 3,
      name: 'AppGallery',
      image: '/mobile/app-gallery.webp',
      link: 'https://appgallery.huawei.com/app/trendruum',
      alt: 'AppGallery ile Keşfedin',
      className: 'bg-black'
    }
  ];

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center justify-center gap-2">
        {appStores.map((store) => (
          <Link 
            key={store.id}
            href={store.link}
            target="_blank"
            rel="noopener noreferrer"
            className={`
              relative w-[135px] h-[40px] rounded-[20px] overflow-hidden
              hover:opacity-80 transition-opacity
              ${store.className}
            `}
          >
            <Image
              src={store.image}
              alt={store.alt}
              fill
              className="object-contain"
            />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MobileApps; 