"use client";

export default function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center border rounded-xl bg-white p-6 sm:p-8 mb-6 sm:mb-8 w-full max-w-2xl mx-auto">
      <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-full p-4 sm:p-6 flex items-center justify-center mb-4">
        <svg width="32" height="32" className="sm:w-12 sm:h-12" fill="none" stroke="#F27A1A" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m6 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
        </svg>
      </div>
      <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">Sepetiniz Boş</h3>
      <p className="text-sm sm:text-base text-gray-600 text-center mb-6">Henüz sepetinize ürün eklemediniz. Hemen alışverişe başlayın!</p>
      <a href="/" className="bg-gradient-to-r from-[#F27A1A] to-[#e16c0e] hover:from-[#e16c0e] hover:to-[#d15a0a] text-white font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-sm sm:text-base transition-all duration-200 transform hover:scale-105">
        Alışverişe Başla
      </a>
    </div>
  );
}
