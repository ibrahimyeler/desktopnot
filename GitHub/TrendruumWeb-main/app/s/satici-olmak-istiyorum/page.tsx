"use client";

import Header from '@/components/layout/Header';
import SaticiOl from '@/components/satici/SaticiOl';
import SaticiTipiSecimi from '@/components/satici/SaticiTipiSecimi';
import SaticiOlmaAdimlari from '@/components/satici/SaticiOlmaAdimlari';

export default function SaticiOlPage() {
  return (
    <>
      <Header showBackButton={true} onBackClick={() => window.history.back()} />
      <SaticiOl />
     
      <SaticiOlmaAdimlari />
    </>
  );
}
