import React from 'react';
import Image from 'next/image';

interface BannerItem {
  slug: string;
  value: string;
}

interface BannerField {
  slug: string;
  items: BannerItem[];
}

interface SingleBannerSection {
  fields: BannerField[];
}

const SingleBanner = ({ section }: { section: SingleBannerSection }) => {
  // API'den gelen section'dan image'i parse et
  const bannerField = section.fields.find((f) => f.slug === 'single-banner');
  const image = bannerField?.items.find((item) => item.slug === 'banner-image')?.value;

  if (!image) return null;

  return (
    <div className="w-full max-w-[1600px] mx-auto">
      <div className="relative w-full h-[250px] sm:h-[300px] md:h-[350px] overflow-hidden rounded-lg">
      <Image
        src={image}
        alt="Banner"
        fill
        className="object-cover"
        sizes="100vw"
        priority
        unoptimized
      />
      </div>
    </div>
  );
};

export default SingleBanner;
