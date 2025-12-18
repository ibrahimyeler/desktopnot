const ProductPayment = () => {
  return (
    <div className="space-y-2">
      <h3 className="text-[#333333] text-[13px] font-medium">
        Ödeme Seçenekleri:
      </h3>

      <div className="bg-white rounded-sm border border-[#e6e6e6] p-2.5">
        <div className="flex items-center gap-2">
          <div className="flex-shrink-0">
            <svg className="w-8 h-8 text-[#7622da]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
            </svg>
          </div>
          <div>
            <div className="text-[13px] font-medium text-[#333333]">
              12 Aya Varan Taksit Fırsatı
            </div>
            <div className="text-[11px] text-[#666666]">
              Aylık 19,34 TL&apos;den başlayan 12 aya varan taksit fırsatı
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPayment; 