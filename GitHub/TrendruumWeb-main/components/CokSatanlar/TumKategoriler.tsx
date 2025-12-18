"use client";

const TumKategoriler = () => {
  const accessoryCategories = [
    { id: 'taki', name: 'Takı & Mücevher' },
    { id: 'saat', name: 'Saat' },
    { id: 'canta', name: 'Çanta' },
    { id: 'anahtar', name: 'Anahtarlık' },
    { id: 'kol', name: 'Kol Düğmesi' },
    { id: 'semsiye', name: 'Şemsiye' },
    { id: 'cuzdan', name: 'Cüzdan & Kartlık' },
    { id: 'sal', name: 'Şal&Fular' },
    { id: 'sac', name: 'Saç Aksesuarları' },
    { id: 'gelin', name: 'Gelin Aksesuarı' },
    { id: 'sapka', name: 'Şapka' }
  ];

  return (
    <div className="bg-white border-b">
      <div className="container mx-auto">

        <div className="flex items-center h-12 px-4">
          <span className="text-gray-600">Tüm Kategoriler</span>
          <span className="mx-2 text-gray-400">{'>'}</span>
          <span className="text-orange-500">Aksesuar</span>
        </div>

        <div className="relative">
          <div className="flex items-center h-14 space-x-4 overflow-x-auto scrollbar-hide px-4">
            {accessoryCategories.map((category) => (
              <button
                key={category.id}
                className="text-sm px-4 py-2 rounded-full border whitespace-nowrap transition-colors duration-200
                  border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-orange-500 hover:text-orange-500 flex-shrink-0"
              >
                {category.name}
              </button>
            ))}
          </div>
          
          <div className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-white to-transparent w-12 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 bg-gradient-to-l from-white to-transparent w-12 pointer-events-none" />
        </div>
      </div>
    </div>
  );
};

export default TumKategoriler;