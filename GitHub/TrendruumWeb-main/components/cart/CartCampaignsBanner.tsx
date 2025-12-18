"use client";

import { CartCampaignInfo } from './CartItem';

interface CartCampaignsBannerProps {
  cartCampaigns: CartCampaignInfo[];
}

export default function CartCampaignsBanner({ cartCampaigns }: CartCampaignsBannerProps) {
  const formatPrice = (price: number) => {
    return price.toLocaleString('tr-TR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  if (cartCampaigns.length === 0) return null;

  const hasPercentageDiscount = cartCampaigns.some(c => c.campaign.type === 'percentage_discount');
  const hasNthProductDiscount = cartCampaigns.some(c => c.campaign.type === 'nth_product_discount');
  const hasPriceDiscount = cartCampaigns.some(c => c.campaign.type === 'price_discount');

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            hasPercentageDiscount 
              ? 'bg-gradient-to-br from-red-500 to-pink-500' 
              : hasNthProductDiscount
                ? 'bg-gradient-to-br from-purple-500 to-violet-500'
                : hasPriceDiscount
                  ? 'bg-gradient-to-br from-blue-500 to-cyan-500'
                  : 'bg-gradient-to-br from-emerald-500 to-green-500'
          }`}>
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Kampanya Fırsatı</h3>
            <p className="text-xs text-gray-600">Sepetinizde aktif kampanya var</p>
          </div>
        </div>
        <div className="text-right">
          <div className="flex flex-wrap items-center gap-1.5 justify-end">
            {cartCampaigns.map((campaign, index) => (
              <span key={index} className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${
                campaign.campaign.type === 'percentage_discount'
                  ? 'bg-red-100 text-red-700' 
                  : campaign.campaign.type === 'nth_product_discount'
                    ? 'bg-purple-100 text-purple-700'
                    : campaign.campaign.type === 'price_discount'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-emerald-100 text-emerald-700'
              }`}>
                {campaign.campaign.type === 'percentage_discount'
                  ? `%${campaign.discountPercentage || 0} İndirim`
                  : campaign.campaign.type === 'nth_product_discount'
                    ? `${campaign.campaign.campaign_settings?.nth_product}. Ürün %${campaign.campaign.campaign_settings?.nth_discount_percentage} İndirim`
                    : campaign.campaign.type === 'price_discount'
                      ? `${campaign.campaign.campaign_settings?.discount_amount} TL İndirim`
                      : `${campaign.campaign.campaign_settings?.buy_quantity} Al ${campaign.campaign.campaign_settings?.pay_quantity} Öde`
                }
              </span>
            ))}
          </div>
          <div className={`text-xs font-medium mt-1 leading-tight ${
            hasPercentageDiscount ? 'text-red-600' : 'text-emerald-600'
          }`}>
            {formatPrice(cartCampaigns.reduce((total, campaign) => total + campaign.savings, 0))} TL indirim
          </div>
        </div>
      </div>
    </div>
  );
}

