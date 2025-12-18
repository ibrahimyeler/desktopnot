"use client"

import Container from './components/Container';
import Header from '@/components/layout/Header';
import ScrollToTop from '@/components/ui/ScrollToTop';
import { BasketProvider } from '@/app/context/BasketContext';

interface UserProfile {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  birth_date?: string;
  gender?: string;
  created_at: string;
  updated_at: string;
}

interface Address {
  id: string;
  title: string;
  firstname: string;
  lastname: string;
  phone: string;
  city: {
    id: string;
    name: string;
    slug: string;
  };
  district: {
    id: string;
    name: string;
    slug: string;
  };
  neighborhood: {
    id: string;
    name: string;
    slug: string;
  };
  description: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

interface BasketItem {
  id: string;
  product_id: string;
  quantity: number;
  price: number;
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    original_price?: number;
    campaign_price?: number;
    discount_percentage?: number;
    images: Array<{
      url: string;
      name: string;
      id: string;
    }>;
    brand?: {
      id: string;
      name: string;
      slug: string;
    };
    seller?: {
      id: string;
      name: string;
      slug: string;
    };
  };
}

interface BasketGroup {
  id: string;
  seller_id: string;
  seller_name: string;
  basket_group_items: BasketItem[];
}

interface Basket {
  id: string;
  user_id?: string;
  basket_groups: BasketGroup[];
  total_price: number;
  total_items: number;
}

interface CheckoutData {
  userProfile: UserProfile | null;
  addresses: Address[];
  basket: Basket | null;
}

interface CheckoutPageClientProps {
  initialCheckoutData: CheckoutData;
  initialToken: string;
}

export default function CheckoutPageClient({ initialCheckoutData, initialToken }: CheckoutPageClientProps) {
  return (
    <>
      <Header showBackButton={true} onBackClick={() => window.history.back()} />
      <main className="min-h-screen bg-gray-50 text-black pt-20 md:pt-0">
        <Container 
          initialCheckoutData={initialCheckoutData}
          initialToken={initialToken}
        />
      </main>
      <ScrollToTop />
    </>
  );
}
