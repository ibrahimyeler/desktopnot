'use client';
import YardimMenu from '@/components/yardim-destek/YardimMenu';
import dynamic from 'next/dynamic';
import { IoPlayCircleOutline } from 'react-icons/io5';


const TrendruumAsistan = dynamic(
  () => import('@/components/yardim-destek/trendruum-asistan/TrendruumAsistan'),
  { ssr: false }
);

export default function Iade() {
  const iadeSteps = [
    '"Hesabım" > "Siparişlerim" > "Detaylar" > "İade Kargo Kodu Oluştur" adımlarını takip edip iade edilecek ürün ve iade nedenini seçin. Aynı üründen birden fazla satın aldıysanız iade edilecek ürün adedini de seçin.',
    'İade etmek istediğiniz ürünlerin uygunluğuna göre size önerilen iade seçeneklerinden birini seçin.',
    'Kargo seçiminizi yapın.',
    'Ekranda çıkan iade kargo kodunu not alın. İade kargo kodunuza siparişlerim sayfasından ve e-posta adresinize gönderilen bilgilendirme mesajından da ulaşabilirsiniz.',
    'İade kodu aynı olan ürünleri faturasıyla beraber aynı pakete koyun ve paketin sağlam olduğundan emin olun. İade kodu farklı olan ürünler aynı kargoya verilse bile farklı paketler halinde verilmelidir.'
  ];

  const iadeNot = {
    title: 'Faturanız yoksa aşağıdaki bilgileri boş bir kağıda yazıp iade paketinin içine koyup iadenizi yapabilirsiniz.',
    fields: [
      'Ad Soyadı:',
      'Sipariş No:',
      'İade Nedeni:'
    ]
  };

  const iadeUyari = 'Seçtiğiniz iade yöntemine göre 7 gün içinde paketinizi kargo şubesine veya seçtiğiniz gel al noktasına teslim edin. Eğer adresten iade seçeneğini seçtiyseniz paketinizi randevu gününde adresinize gelecek görevliye teslim edin. 7 günü geçirdiğiniz durumda yeniden iade kargo kodu almanız gerekir.';

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex gap-8">
        <YardimMenu  />

        <div className="flex-1">
          <div className="bg-white rounded-lg border p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-8">İade</h1>

            <div className="relative w-full h-[300px] bg-[#8B5E3C] rounded-lg mb-8 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="flex flex-col items-center gap-4">
                  <IoPlayCircleOutline size={64} className="cursor-pointer hover:text-gray-200" />
                  <div>
                    <h2 className="text-2xl mb-2">Trendruum</h2>
                    <p className="text-xl">Mutlu Müşteri</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold text-[#F27A1A] mb-4">
                Aldığım ürünleri nasıl iade edebilirim?
              </h2>
              <div className="space-y-4">
                {iadeSteps.map((step, index) => (
                  <p key={index} className="text-gray-700 leading-relaxed">
                    {step}
                  </p>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <p className="font-medium mb-3">{iadeNot.title}</p>
              <ul className="list-none space-y-2">
                {iadeNot.fields.map((field, index) => (
                  <li key={index} className="text-gray-700">{field}</li>
                ))}
              </ul>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700">{iadeUyari}</p>
            </div>

            <div className="mt-8">
              <button className="w-full text-left p-4 border rounded-lg flex justify-between items-center hover:border-[#F27A1A] transition-colors">
                <span className="text-gray-700">İade politikamız nedir?</span>
                <span className="text-[#F27A1A]">+</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <TrendruumAsistan />
    </main>
  );
} 