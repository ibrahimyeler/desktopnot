"use client";
import { useState, useEffect } from "react";
import Tabs from "./Tabs";
import CartProducts from "./CartProducts";
import OrderSummary from "./OrderSummary";
import AddressSection from "./AddressSection";
import AddressPopup from "@/components/cart/AddressPopup";
import { useBasket } from '@/app/context/BasketContext';
import PaymentOptions from "./PaymentOptions";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";

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

interface ContainerProps {
  initialCheckoutData: CheckoutData;
  initialToken: string;
}

export default function Container({ initialCheckoutData, initialToken }: ContainerProps) {
  const [activeTab, setActiveTab] = useState("address");
  const [showAddressPopup, setShowAddressPopup] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<{ id: string } | null>(null);
  const { refreshBasket } = useBasket();
  const [hasAddress, setHasAddress] = useState(false);
  const [selectedInstallment, setSelectedInstallment] = useState<{ count: number; rate: number } | null>(null);
  // Kart bilgileri (PayTR'ye gönderilmek için)
  const [cardType, setCardType] = useState('');
  const [cardInfo, setCardInfo] = useState({
    cardNumber: '',
    cardOwner: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    secure3d: false
  });
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  // Sayfa yüklendiğinde sepeti yenile
  useEffect(() => {
    // Guest kullanıcılar için her zaman basket'i yenile
    // Customer kullanıcılar için sadece initial basket yoksa yenile
    if (!initialCheckoutData.basket || initialCheckoutData.basket.basket_groups.length === 0) {
      refreshBasket();
    }
  }, []); // refreshBasket dependency'sini kaldırdık

  // Initial address'i set et
  useEffect(() => {
    if (!isLoggedIn) {
      setSelectedAddress(null);
      return;
    }

    if (initialCheckoutData.addresses.length > 0) {
      const defaultAddress = initialCheckoutData.addresses.find(addr => addr.is_default) || initialCheckoutData.addresses[0];
      setSelectedAddress({ id: defaultAddress.id });
    }
  }, [initialCheckoutData.addresses, isLoggedIn]);

  useEffect(() => {
    if (!isLoggedIn) {
      setShowLoginPopup(true);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (selectedAddress) setHasAddress(true);
    else setHasAddress(false);
  }, [selectedAddress]);

  // Tab değiştirme işlemi için yardımcı fonksiyon
  const handleTabChange = (tab: string) => {
    if (tab === "payment" && activeTab === "address") {
      if (hasAddress) {
        setActiveTab("payment");
      } else {
        setShowAddressPopup(true);
      }
    } else {
      setActiveTab(tab);
    }
  };

  return (
    <div className="w-full lg:w-5/6 mt-2 lg:mt-10 mx-auto grid grid-cols-1 lg:grid-cols-8 p-3 lg:p-5 gap-3 lg:gap-5">
      {showLoginPopup && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9998] backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-5 sm:p-6 max-w-md w-full mx-4 shadow-2xl border border-gray-100">
            <div className="flex justify-end">
              <button
                onClick={() => setShowLoginPopup(false)}
                className="inline-flex items-center justify-center rounded-full p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="text-center mb-5">
              <h2 className="text-xl sm:text-2xl font-medium mb-2 text-gray-900">
                Trendruum Hesabınız Yok Mu?
              </h2>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => {
                  setShowLoginPopup(false);
                  setShowAddressPopup(true);
                }}
                className="block w-full py-3 px-4 text-center border border-[#F27A1A] text-[#F27A1A] rounded-md hover:bg-[#F27A1A]/10 transition"
              >
                Üye Olmadan Devam Et
              </button>

              <button
                onClick={() => {
                  setShowLoginPopup(false);
                  router.push('/giris?redirect=/sepetim/odeme');
                }}
                className="block w-full py-3 px-4 text-center bg-[#F27A1A] text-white rounded-md hover:bg-[#F27A1A]/90 transition"
              >
                Giriş Yap / Üye Ol
              </button>
            </div>
          </div>
        </div>
      )}
      {showAddressPopup && (
        <AddressPopup
          onClose={() => setShowAddressPopup(false)}
          onSubmit={(formData: any) => {
            setSelectedAddress({ id: formData.id });
            setShowAddressPopup(false);
            setActiveTab("payment");
          }}
          hideGuestSavedAddresses={!isLoggedIn}
        />
      )}
      
      <div className="col-span-1 lg:col-span-6 flex flex-col gap-3 lg:gap-5">
        <Tabs 
          activeTab={activeTab} 
          setActiveTab={handleTabChange}
        />
        <CartProducts initialBasket={initialCheckoutData.basket} />
        {activeTab === "address" && (
          <AddressSection 
            setShowAddressPopup={setShowAddressPopup} 
            onAddressSelect={(addressId) => {
              setSelectedAddress({ id: addressId });
            }}
            initialAddresses={initialCheckoutData.addresses}
            initialUserProfile={initialCheckoutData.userProfile}
          />
        )}
        {activeTab === "payment" && (
          <PaymentOptions
            onInstallmentChange={setSelectedInstallment}
            cardType={cardType}
            setCardType={setCardType}
            onCardInfoChange={setCardInfo}
          />
        )}
      </div>

      <div className="col-span-1 lg:col-span-2">
        <div className="lg:sticky lg:top-5">
          <OrderSummary
            showPaymentButton={activeTab === "payment"}
            onContinue={() => {
              if (activeTab === "address") {
                if (hasAddress) {
                  setActiveTab("payment");
                } else {
                  setShowAddressPopup(true);
                }
              }
            }}
            hasAddress={hasAddress}
            selectedAddressId={selectedAddress?.id}
            selectedInstallment={selectedInstallment}
            cardType={cardType}
            cardInfo={cardInfo}
            initialBasket={initialCheckoutData.basket}
          />
        </div>
      </div>
    </div>
  );
}
