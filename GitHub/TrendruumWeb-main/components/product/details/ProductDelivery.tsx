"use client";

import { 
  TruckIcon, 
  InformationCircleIcon,
  ClockIcon,
  GlobeEuropeAfricaIcon,
  MapPinIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/outline';

interface ProductDeliveryProps {
  product: {
    attributes?: Array<{
      name: string;
      selected: {
        name: string;
      };
    }>;
  };
}

const ProductDelivery = ({ product }: ProductDeliveryProps) => {
  // Menşei bilgisini bul
  const origin = product.attributes?.find(attr => 
    attr.name === "Mensei"
  )?.selected.name;

  return (
    <div className="space-y-2">
      {/* Kargoya Teslim */}
      <div className="flex items-start gap-2 bg-gradient-to-r from-emerald-50 to-teal-50 p-2.5 rounded-lg border border-emerald-100">
        <div className="p-1.5 bg-emerald-500 rounded-md">
          <TruckIcon className="w-3.5 h-3.5 text-white" />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-medium text-emerald-800">
              Tahmini Kargoya Teslim:
            </span>
            <div className="flex items-center gap-1 px-1.5 py-0.5 bg-emerald-100 rounded">
              <ClockIcon className="w-3 h-3 text-emerald-600" />
              <span className="text-[10px] font-medium text-emerald-700">
                2 iş günü içinde
              </span>
            </div>
          </div>
          {origin && (
            <div className="flex items-center gap-1.5 text-[10px] text-emerald-600">
              <GlobeEuropeAfricaIcon className="w-3 h-3" />
              <span>Ürün Menşei: <span className="font-medium">{origin}</span></span>
            </div>
          )}
        </div>
      </div>

      {/* Teslimat Bilgisi */}
      <div className="flex items-start gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 p-2.5 rounded-lg border border-blue-100">
        <div className="p-1.5 bg-blue-500 rounded-md">
          <CheckBadgeIcon className="w-3.5 h-3.5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-medium text-blue-900">
                  Tahmini Teslim:
                </span>
                <InformationCircleIcon className="w-3 h-3 text-blue-400" />
                
              </div>
              <div className="flex items-center gap-1.5 px-1.5 py-0.5 bg-blue-100 rounded">
                <ClockIcon className="w-3 h-3 text-blue-600" />
                <p className="text-[10px] font-medium text-blue-700">
                  27 Mayıs Salı günü kapında!
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-1 bg-blue-100 rounded">
              <MapPinIcon className="w-3 h-3 text-blue-600" />
              <span className="text-[10px] text-blue-700 font-medium whitespace-nowrap">
                İstanbul/Üsküdar
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDelivery; 