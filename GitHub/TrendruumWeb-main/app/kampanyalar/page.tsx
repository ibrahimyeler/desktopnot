import React from 'react';
import CampaignsPageClient from './CampaignsPageClient';

interface Campaign {
  id: string;
  name: string;
  slug: string;
  description: string;
  type: 'price_discount' | 'percentage_discount' | 'buy_x_pay_y' | 'nth_product_discount' | string;
  start_date: string;
  end_date: string;
  small_banner: string;
  large_banner: string;
  is_active: boolean;
  commission_rate: number;
  category_ids: string[];
}

// Server-side data fetching function
async function getCampaigns(): Promise<Campaign[] | null> {
  try {
    const axios = require('axios');
    
    const response = await axios.get('https://api.trendruum.com/api/v1/campaigns?is_active=true', {
      timeout: 10000,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (response.data?.meta?.status === 'success' && response.data.data) {
      return response.data.data.map((campaign: any) => ({
        id: campaign.id,
        name: campaign.name,
        slug: campaign.slug,
        description: campaign.description,
        type: campaign.type,
        start_date: campaign.start_date,
        end_date: campaign.end_date,
        small_banner: campaign.small_banner,
        large_banner: campaign.large_banner,
        is_active: campaign.is_active,
        commission_rate: campaign.commission_rate,
        category_ids: campaign.category_ids
      }));
    }
    
    return null;
  } catch (error) {
    return null;
  }
}

// Server component
export default async function CampaignsPage() {
  const initialCampaigns = await getCampaigns();
  
  return (
    <CampaignsPageClient 
      initialCampaigns={initialCampaigns}
    />
  );
}