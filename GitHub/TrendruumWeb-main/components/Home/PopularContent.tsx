const PopularContent = () => {
  const popularBrands = [
    { name: 'Penti', link: '#' },
    { name: 'Watsons', link: '#' },
    { name: 'Stradivarius', link: '#' },
    { name: 'Columbia', link: '#' },
    { name: 'Puma', link: '#' },
    { name: 'Apple', link: '#' },
    { name: 'Xiaomi', link: '#' },
    { name: 'Birkenstock', link: '#' },
    { name: 'Adidas', link: '#' },
    { name: 'Lacoste', link: '#' },
    { name: 'Madame Coco', link: '#' },
    { name: 'Defacto', link: '#' },
    { name: 'Tchibo', link: '#' },
    { name: 'Network', link: '#' },
    { name: 'Kiğılı', link: '#' },
    { name: 'Mango', link: '#' },
    { name: 'English Home', link: '#' },
    { name: 'The North Face', link: '#' },
    { name: 'Samsung', link: '#' },
    { name: 'Mudo', link: '#' },
    { name: 'New Balance', link: '#' },
    { name: 'Oppo', link: '#' },
    { name: 'Arçelik', link: '#' },
    { name: 'Nike', link: '#' },
    { name: 'Avva', link: '#' },
    { name: 'Pull & Bear', link: '#' },
    { name: 'Mavi', link: '#' },
    { name: 'Farmasi', link: '#' },
    { name: 'Bosch', link: '#' },
    { name: 'Migros', link: '#' },
    { name: 'Vivense', link: '#' },
    { name: 'Bershka', link: '#' },
    { name: 'Beymen', link: '#' },
    { name: 'Lumberjack', link: '#' },
    { name: 'Derimod', link: '#' },
    { name: 'Huawei', link: '#' },
    { name: 'Monster Notebook', link: '#' },
    { name: 'DYSON', link: '#' },
    { name: 'Skechers', link: '#' },
    { name: 'Under Armour', link: '#' },
    { name: 'Koton', link: '#' },
    { name: 'Pierre Cardin', link: '#' },
    { name: 'Helly Hansen', link: '#' },
    { name: 'Karaca', link: '#' },
    { name: 'CAT', link: '#' },
  ];

  const popularPages = [
    { name: 'Bluetooth Kulaklık', link: '#' },
    { name: "Azerbaycan'dan Alışveriş", link: '#' },
    { name: 'Laptop', link: '#' },



    { name: 'iPhone 15 Plus', link: '#' },
    { name: 'Apple Watch', link: '#' },
    { name: 'iPhone 16 Pro Max', link: '#' },
    { name: 'iPhone 16', link: '#' },
    { name: 'Kadın Mont', link: '#' },
    { name: 'Televizyon', link: '#' },
    { name: 'Sneaker', link: '#' },
    { name: 'Popüler Aramalar', link: '#' },
    { name: 'Apple Airpods', link: '#' },
    { name: 'Trendruum Hungarian', link: '#' },
    { name: 'Trendruum Czech', link: '#' },
    { name: 'Trendruum Arabic', link: '#' },
    { name: 'iPhone', link: '#' },
    { name: 'Nike Air Max', link: '#' },
    { name: 'iPhone 15', link: '#' },
    { name: 'iPhone 15 Pro', link: '#' },
    { name: 'Bulaşık Makinesi', link: '#' },
    { name: 'iPhone 16 Pro', link: '#' },
    { name: 'Sırt Çantası', link: '#' },
    { name: 'Erkek Mont', link: '#' },
    { name: 'Kahve Makinesi', link: '#' },
    { name: 'Macbook', link: '#' },
    { name: 'Popüler Sayfalar', link: '#' },
    { name: 'Trendruum Blog', link: '#' },
    { name: 'Trendruum Greek', link: '#' },
    { name: 'Trendruum English', link: '#' },
    { name: 'Trendruum Deutsch', link: '#' },
    { name: 'Samsung Cep Telefonu', link: '#' },
    { name: 'Robot Süpürge', link: '#' },
    { name: 'Soba & Isıtıcı', link: '#' },
    { name: 'iPhone 15 Pro Max', link: '#' },
    { name: 'Buzdolabı', link: '#' },
    { name: 'iPhone 16 Plus', link: '#' },
    { name: 'Apple Watch Series 9', link: '#' },
    { name: 'Sınav Hazırlık ve Test Kita...', link: '#' },
    { name: 'Kitap', link: '#' },
    { name: 'Elbise', link: '#' },
    { name: 'Dyson Airwrap', link: '#' },
    { name: 'Markalar', link: '#' },
    { name: 'Trendruum Romanian', link: '#' },
    { name: 'Trendruum Slovak', link: '#' },
  ];

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Popüler Marka ve Mağazalar */}
          <div>
            <h2 className="text-lg sm:text-xl md:text-[22px] font-['source_sans_proregular'] text-[#333333] m-[10px_0px_20px] text-center md:text-left">
              Popüler Marka ve Mağazalar
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-2 gap-y-1.5">
              {popularBrands.map((brand) => (
                <a
                  key={brand.name}
                  href={brand.link}
                  className="text-xs sm:text-sm md:text-[13px] font-['source_sans_proregular'] text-[#333333] hover:underline decoration-[#333333] text-center md:text-left"
                >
                  {brand.name}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-lg sm:text-xl md:text-[22px] font-['source_sans_proregular'] text-[#333333] m-[10px_0px_20px] text-center md:text-left">
              Popüler Sayfalar
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-2 gap-y-1.5">
              {popularPages.map((page) => (
                <a
                  key={page.name}
                  href={page.link}
                  className="text-xs sm:text-sm md:text-[13px] font-['source_sans_proregular'] text-[#333333] hover:underline decoration-[#333333] text-center md:text-left"
                >
                  {page.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopularContent; 