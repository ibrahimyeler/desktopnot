import React from 'react';
import Image from 'next/image';

const campaigns = [
  { id: 1, title: 'Kampanya 1', image: '/campaign1.png', description: 'Kampanya açıklaması 1' },
  { id: 2, title: 'Kampanya 2', image: '/campaign2.png', description: 'Kampanya açıklaması 2' },
  { id: 3, title: 'Kampanya 3', image: '/campaign3.png', description: 'Kampanya açıklaması 3' },
  { id: 4, title: 'Kampanya 4', image: '/campaign4.png', description: 'Kampanya açıklaması 4' },
];

const CampaignListSection = ({ title = 'Kampanya Başlığı', seeAllUrl = '#' }) => {
  return (
    <div className="w-full max-w-[1600px] mx-auto py-8">
      <h2 className="text-2xl font-bold text-gray-200 mb-4">Kampanyalar</h2>
      <div className="bg-gradient-to-b from-blue-500 to-purple-300 rounded-2xl p-8 shadow-lg">
        <div className="flex items-center justify-between mb-8">
          <span className="text-white text-2xl font-semibold">{title}</span>
          {/* <a href={seeAllUrl} className="bg-white text-gray-700 font-bold px-8 py-3 rounded-xl shadow hover:bg-gray-100 transition-all text-lg">Tümünü Gör</a> */}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-6">
          {campaigns.map((c) => (
            <div key={c.id} className="bg-gray-300 rounded-xl h-48 flex items-center justify-center relative">
              <div className="relative w-full h-32">
                <Image
                  src={c.image}
                  alt={c.title}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {campaigns.map((c) => (
            <div key={c.id} className="bg-gray-200 h-6 rounded-md" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CampaignListSection; 