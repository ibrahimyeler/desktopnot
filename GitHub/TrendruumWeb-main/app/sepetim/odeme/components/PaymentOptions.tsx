"use client";

import { useState, useRef, useEffect } from "react";
import { useBasket } from '@/app/context/BasketContext';
import { IoInformationCircleOutline } from "react-icons/io5";
import Image from "next/image";

interface InstallmentOption {
  count: number;
  monthlyPayment: number;
}

// Güvenlik için sadece kart tipi alınıyor
interface PaymentOptionsProps {
  onInstallmentChange?: (installment: { count: number; rate: number } | null) => void;
  cardType: string;
  setCardType: (val: string) => void;
  onCardInfoChange?: (cardInfo: {
    cardNumber: string;
    cardOwner: string;
    expiryMonth: string;
    expiryYear: string;
    cvv: string;
    secure3d: boolean;
    isValid: boolean;
  }) => void;

  
}

export default function PaymentOptions({
  onInstallmentChange,
  cardType, setCardType,
  onCardInfoChange
}: PaymentOptionsProps) {
  const { basket, basketItems, totalPrice, shippingFee } = useBasket();
  const cartItems = basketItems || [];
  const cartTotal = totalPrice || 0;
  
  // Sepet toplamını kontrol etmek için log ekleyelim
  
  // Eğer cartTotal hook'tan doğru gelmiyorsa, manuel hesaplama yapalım
  const calculatedTotal = cartItems.reduce((sum: number, item: any) => 
    sum + ((item.price || 0) * (item.quantity || 1)), 0);
  
  // Hangisi dolu ise onu kullanalım
  const effectiveCartTotal = cartTotal > 0 ? cartTotal : calculatedTotal;
  
  // Kargo fiyatını dahil et
  const totalWithShipping = effectiveCartTotal + (shippingFee || 0);
  
  // Kart bilgileri local state (güvenlik için backend'e gönderilmiyor)
  const [cardNumber, setCardNumber] = useState('');
  const [cardOwner, setCardOwner] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('');
  const [expiryYear, setExpiryYear] = useState('');
  const [cvv, setCvv] = useState('');
  
  const [selectedPayment, setSelectedPayment] = useState<'card' | 'shopping'>('card');
  const [secure3d, setSecure3d] = useState(true);
  const [cardError, setCardError] = useState<string>('');
  const [binInfo, setBinInfo] = useState<any>(null);
  const [lastBin, setLastBin] = useState('');
  const [binLoading, setBinLoading] = useState(false);
  const binCache = useRef<{ [bin: string]: any }>({});
  const [instalmentRates, setInstalmentRates] = useState<any>(null);
  const [instalmentLoading, setInstalmentLoading] = useState(false);
  // 2. Taksit seçimi radio inputlarında onChange ile state ve callback güncelle
  // Tek çekim varsayılan olarak seçili olsun
  const [selectedInstallment, setSelectedInstallment] = useState<{ count: number; rate: number } | null>({ count: 1, rate: 0});
  
  // Kart validasyon state'leri
  const [cardOwnerError, setCardOwnerError] = useState<string>('');
  const [cardNumberError, setCardNumberError] = useState<string>('');
  const [expiryError, setExpiryError] = useState<string>('');
  const [cvvError, setCvvError] = useState<string>('');

  // Kart bilgileri değiştiğinde parent'a bildir
  useEffect(() => {
    if (onCardInfoChange) {
      // Kart bilgilerinin geçerliliğini kontrol et
      const cardNumberClean = cardNumber.replace(/\s/g, '');
      const isCardNumberValid = cardNumberClean.length === 16;
      const isCardOwnerValid = cardOwner.trim().length >= 2;
      const isExpiryValid = expiryMonth && expiryYear;
      const isCvvValid = cvv.length === 3;
      
      // Son kullanma tarihi geçerlilik kontrolü
      let isExpiryDateValid = false;
      if (expiryMonth && expiryYear) {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1;
        const selectedYear = parseInt(expiryYear);
        const selectedMonth = parseInt(expiryMonth);
        
        isExpiryDateValid = selectedYear > currentYear || 
          (selectedYear === currentYear && selectedMonth >= currentMonth);
      }
      
      const isValid: boolean = Boolean(isCardNumberValid && isCardOwnerValid && isExpiryValid && isCvvValid && isExpiryDateValid);
      
      const cardInfo = {
        cardNumber,
        cardOwner,
        expiryMonth,
        expiryYear,
        cvv,
        secure3d,
        isValid
      };
      onCardInfoChange(cardInfo);
    }
  }, [cardNumber, cardOwner, expiryMonth, expiryYear, cvv, secure3d, onCardInfoChange]);

  // Taksit oranlarını component mount'ta çek
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    
    setInstalmentLoading(true);
    
    // Guest kullanıcılar için de taksit oranlarını çek (token olmadan)
    const headers: any = {
      'Content-Type': 'application/json'
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    fetch('/api/v1/customer/payments/instalment-query', {
      method: 'POST',
      headers: headers
    })
      .then(res => res.json())
      .then(data => {
        if (data.meta?.status === 'success') {
          setInstalmentRates(data.data.oranlar);
        } else {
          // API'den veri gelmezse taksit oranlarını gösterme
          setInstalmentRates(null);
        }
      })
      .catch((error) => {
        // Hata durumunda taksit oranlarını gösterme
        setInstalmentRates(null);
      })
      .finally(() => setInstalmentLoading(false));
  }, []);

  // Component mount olduğunda tek çekim seçimini parent'a bildir
  useEffect(() => {
    if (onInstallmentChange && selectedInstallment) {
      onInstallmentChange(selectedInstallment);
    }
  }, [onInstallmentChange, selectedInstallment]);


  // Sadece rakam girişi için yardımcı fonksiyon
  const onlyNumbers = (value: string) => value.replace(/\D/g, '');

  // Kart numarası formatlaması (4'lü gruplar halinde)
  const formatCardNumber = (value: string) => {
    const numbers = onlyNumbers(value);
    return numbers.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
  };

  // Kart türüne göre görsel getir
  const getCardImage = (brand: string) => {
    if (!brand) return null;
    
    const cardImages: { [key: string]: string } = {
      'bonus': '/bonus.png', // Bonus kartı için PNG dosyasını kullan
      'axess': '/axess.png', // Axess kartı için PNG dosyasını kullan
      'world': '/payment/world.svg',
      'maximum': '/payment/maximum.svg',
      'cardfinans': '/payment/card-finans.svg',
      'card-finans': '/payment/card-finans.svg',
      'visa': '/payment/visa.svg',
      'mastercard': '/payment/cart1.svg',
      'master': '/payment/cart1.svg',
      'ziraat': '/payment/ziraat.svg'
    };

    const brandLower = brand.toLowerCase().replace(/\s+/g, ''); // Boşlukları kaldır
    return cardImages[brandLower] || cardImages['visa']; // Varsayılan olarak visa
  };

  // Kart türüne göre boyut getir
  const getCardImageSize = (brand: string) => {
    const brandLower = brand.toLowerCase();
    // PNG kartlar için küçük boyut
    if (brandLower === 'bonus' || brandLower === 'axess') {
      return { width: 32, height: 20 };
    }
    // SVG kartlar için standart boyut
    return { width: 40, height: 24 };
  };

  // Guest kullanıcılar için basit kart türü tespiti
  const getGuestBinInfo = (bin: string) => {
    const binNumber = parseInt(bin);
    
    // Visa: 4 ile başlar
    if (bin.startsWith('4')) {
      return { brand: 'visa', bank: 'Visa' };
    }
    // Mastercard: 5 ile başlar veya 2221-2720 arası
    else if (bin.startsWith('5') || (binNumber >= 222100 && binNumber <= 272099)) {
      return { brand: 'mastercard', bank: 'Mastercard' };
    }
    // Bonus: 4355 ile başlar
    else if (bin.startsWith('4355')) {
      return { brand: 'bonus', bank: 'Bonus' };
    }
    // Axess: 4356 ile başlar
    else if (bin.startsWith('4356')) {
      return { brand: 'axess', bank: 'Axess' };
    }
    // Varsayılan olarak Visa
    else {
      return { brand: 'visa', bank: 'Visa' };
    }
  };

  // Kart numarası değişikliği
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCardNumber(e.target.value);
    setCardNumber(formattedValue);

    // Kart numarası validasyonu
    const numbers = onlyNumbers(formattedValue);
    if (numbers.length === 0) {
      setCardNumberError('Kart numarası zorunludur');
    } else if (numbers.length < 16) {
      setCardNumberError('Kart numarası 16 haneli olmalıdır');
    } else {
      setCardNumberError('');
      
    }

    const bin = numbers.slice(0, 6);
    if (bin.length === 6 && bin !== lastBin) {
      setLastBin(bin);
      setBinInfo(null);
      if (binCache.current[bin]) {
        setBinInfo(binCache.current[bin]);
        setCardType(binCache.current[bin]?.brand || '');
        return;
      }
      setBinLoading(true);
      
      // Guest kullanıcılar için de BIN sorgusu yap (token olmadan)
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      
      const headers: any = {
        'Content-Type': 'application/json'
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      fetch('/api/v1/customer/payments/bin-query', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ bin_number: bin })
      })
        .then(res => res.json())
        .then(data => {
          if (data.meta?.status === 'success') {
            setBinInfo(data.data);
            setCardType(data.data?.brand || '');
            binCache.current[bin] = data.data;
          } else {
            // API'den veri gelmezse guest kart türü tespiti kullan
            const guestBinInfo = getGuestBinInfo(bin);
            setBinInfo(guestBinInfo);
            setCardType(guestBinInfo?.brand || '');
            binCache.current[bin] = guestBinInfo;
          }
        })
        .catch((error) => {
          // Hata durumunda guest kart türü tespiti kullan
          const guestBinInfo = getGuestBinInfo(bin);
          setBinInfo(guestBinInfo);
          setCardType(guestBinInfo?.brand || '');
          binCache.current[bin] = guestBinInfo;
        })
        .finally(() => setBinLoading(false));
    }
  };

  // CVV değişikliği
  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = onlyNumbers(e.target.value);
    setCvv(value);
    
    // CVV validasyonu
    if (value.length === 0) {
      setCvvError('CVV zorunludur');
    } else if (value.length < 3) {
      setCvvError('CVV 3 haneli olmalıdır');
    } else {
      setCvvError('');
    }
  };

  // Tarih validasyonu
  const validateExpiryDate = (month: string, year: string): boolean => {
    if (!month || !year) {
      setExpiryError('Son kullanma tarihi zorunludur');
      return false;
    }

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // JavaScript'te aylar 0'dan başlar

    const selectedYear = parseInt(year);
    const selectedMonth = parseInt(month);

    if (selectedYear < currentYear || 
        (selectedYear === currentYear && selectedMonth < currentMonth)) {
      setExpiryError('Geçersiz son kullanma tarihi');
      return false;
    }

    setExpiryError('');
    return true;
  };

  // Tarih değişikliği
  const handleExpiryMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMonth = e.target.value;
    setExpiryMonth(newMonth);
    validateExpiryDate(newMonth, expiryYear);
  };

  const handleExpiryYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newYear = e.target.value;
    setExpiryYear(newYear);
    validateExpiryDate(expiryMonth, newYear);
  };

  // Kart sahibi adı değişikliği
  const handleCardOwnerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCardOwner(value);
    
    // Kart sahibi adı validasyonu
    if (value.length === 0) {
      setCardOwnerError('Kart sahibi adı zorunludur');
    } else if (value.length < 2) {
      setCardOwnerError('Kart sahibi adı en az 2 karakter olmalıdır');
    } else {
      setCardOwnerError('');
    }
  };

  // Sepet toplamı 0'dan büyükse taksit seçeneklerini oluştur
  const installmentOptions: InstallmentOption[] = effectiveCartTotal > 0 ? [
    { count: 1, monthlyPayment: effectiveCartTotal },
    { count: 2, monthlyPayment: effectiveCartTotal / 2 },
    { count: 3, monthlyPayment: effectiveCartTotal / 3 },
    { count: 4, monthlyPayment: effectiveCartTotal / 4 },
    { count: 6, monthlyPayment: effectiveCartTotal / 6 },
    { count: 8, monthlyPayment: effectiveCartTotal / 8 },
    { count: 9, monthlyPayment: effectiveCartTotal / 9 },
    { count: 12, monthlyPayment: effectiveCartTotal / 12 },
  ] : [];

  const formatPrice = (price: number) => {
    return price.toLocaleString('tr-TR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="rounded-md border p-3 sm:p-4">
        <h2 className="text-base sm:text-lg font-medium mb-3 sm:mb-4">Ödeme Seçenekleri</h2>
        <div className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
          <span className="font-medium">Banka/Kredi Kartı</span> veya{" "}
          <span className="font-medium">Alışveriş Kredisi</span> ile ödemenizi güvenle yapabilirsiniz.
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
          {/* Sol Taraf - Ödeme Bilgileri */}
          <div className="space-y-3 sm:space-y-4">
            <div 
              className={`p-3 sm:p-4 border rounded-md cursor-pointer ${
                selectedPayment === 'card' ? 'border-orange-500' : ''
              }`}
              onClick={() => setSelectedPayment('card')}
            >
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={selectedPayment === 'card'}
                  onChange={() => setSelectedPayment('card')}
                  className="accent-orange-500"
                />
                <span className="font-medium text-sm sm:text-base">Kart ile Öde</span>
              </div>
              <p className="text-xs sm:text-sm text-gray-500 mt-1 ml-6">
                Kart ile ödemeyi seçtiniz. Banka veya Kredi Kartı kullanarak ödemenizi güvenle yapabilirsiniz.
              </p>
            </div>

            {selectedPayment === 'card' && (
              <div className="space-y-3 sm:space-y-4 p-3 sm:p-4 border rounded-md">
             
                <div className="space-y-3 sm:space-y-4">
                  {cardError && (
                    <div className="p-2 bg-red-50 text-red-600 rounded-md text-xs sm:text-sm">
                      {cardError}
                    </div>
                  )}
                  <div>
                    <label className="block text-xs sm:text-sm font-medium mb-1">
                      Kart Sahibi Adı <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="cc_owner"
                      autoComplete="off"
                      className={`w-full p-2 border rounded-md text-sm ${
                        cardOwnerError ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Kart Sahibi Adı"
                      value={cardOwner}
                      onChange={handleCardOwnerChange}
                      required
                    />
                    {cardOwnerError && (
                      <div className="text-red-500 text-[10px] sm:text-xs mt-1">{cardOwnerError}</div>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium mb-1">
                      Kart Numarası <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="card_number"
                        autoComplete="off"
                        maxLength={19} // 16 rakam + 3 boşluk
                        className={`w-full p-2 pr-16 sm:pr-20 border rounded-md text-sm ${
                          cardNumberError ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="0000 0000 0000 0000"
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        required
                      />
                      {/* Kart Görseli */}
                      {binInfo && binInfo.brand && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <div className="w-12 h-8 flex items-center justify-center bg-white rounded border shadow-sm">
                            <Image
                              src={getCardImage(binInfo.brand) || '/payment/visa.svg'}
                              alt={binInfo.brand}
                              width={getCardImageSize(binInfo.brand).width}
                              height={getCardImageSize(binInfo.brand).height}
                              className="object-contain"
                              onError={(e) => {
                                // Hata durumunda varsayılan görsel
                                const img = e.target as HTMLImageElement;
                                img.src = '/payment/visa.svg';
                              }}
                            />
                          </div>
                        </div>
                      )}
                      {/* Loading Göstergesi */}
                      {binLoading && (
                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                          <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      )}
                    </div>
                    {cardNumberError && (
                      <div className="text-red-500 text-xs mt-1">{cardNumberError}</div>
                    )}
                    {binLoading && <div className="text-xs text-gray-500 mt-1">Kart tipi sorgulanıyor...</div>}
                    {binInfo && binInfo.brand && (
                      <div className="text-xs text-green-600 mt-1">
                        <span className="font-medium">{binInfo.brand.toUpperCase()}</span> kartı tespit edildi
                        {binInfo.bank && <span className="ml-1 text-gray-500">({binInfo.bank})</span>}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <div className="flex-1">
                      <label className="block text-xs sm:text-sm font-medium mb-1">
                        Son Kullanma Tarihi <span className="text-red-500">*</span>
                      </label>
                      <div className="flex gap-2">
                        <select 
                          className={`flex-1 p-2 border rounded-md text-sm ${
                            expiryError ? 'border-red-500' : 'border-gray-300'
                          }`}
                          name="expiry_month"
                          autoComplete="off"
                          value={expiryMonth}
                          onChange={handleExpiryMonthChange}
                          required
                        >
                          <option value="">Ay</option>
                          {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                            <option key={month} value={month.toString().padStart(2, '0')}>
                              {month.toString().padStart(2, '0')}
                            </option>
                          ))}
                        </select>
                        <select
                          className={`flex-1 p-2 border rounded-md text-sm ${
                            expiryError ? 'border-red-500' : 'border-gray-300'
                          }`}
                          name="expiry_year"
                          autoComplete="off"
                          value={expiryYear}
                          onChange={handleExpiryYearChange}
                          required
                        >
                          <option value="">Yıl</option>
                          {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map(year => (
                            <option key={year} value={year}>{year}</option>
                          ))}
                        </select>
                      </div>
                      {expiryError && (
                        <div className="text-red-500 text-[10px] sm:text-xs mt-1">{expiryError}</div>
                      )}
                    </div>
                    <div className="w-full sm:w-1/3">
                      <label className="block text-xs sm:text-sm font-medium mb-1">
                        CVV <span className="text-red-500">*</span>
                        <IoInformationCircleOutline className="inline ml-1" />
                      </label>
                      <input
                        type="text"
                        name="cvv"
                        autoComplete="off"
                        maxLength={3}
                        className={`w-full p-2 border rounded-md text-sm ${
                          cvvError ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="000"
                        value={cvv}
                        onChange={handleCvvChange}
                        required
                      />
                      {cvvError && (
                        <div className="text-red-500 text-[10px] sm:text-xs mt-1">{cvvError}</div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={secure3d}
                      disabled
                      className="accent-orange-500"
                    />
                    <label className="text-sm">3D Secure ile ödemek istiyorum</label>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sağ Taraf - Taksit Seçenekleri */}
          {selectedPayment === 'card' && (
            <div className="border rounded-md p-4">
              <h3 className="font-medium mb-2">Taksit Seçenekleri</h3>
              <p className="text-sm text-gray-600 mb-2">Kartınıza uygun taksit seçeneğini seçiniz</p>
              {instalmentLoading && <div className="text-xs text-gray-500">Taksit oranları yükleniyor...</div>}
              {/* Taksit seçeneklerini göster - Guest kullanıcılar için de */}
              {instalmentRates ? (() => {
                // Kart brand'i varsa onu kullan, yoksa varsayılan olarak visa kullan
                const brandKey = binInfo && binInfo.brand 
                  ? Object.keys(instalmentRates).find(
                      key => key.toLowerCase() === binInfo.brand.toLowerCase()
                    )
                  : 'visa';
                
                const selectedBrand = brandKey && instalmentRates[brandKey] 
                  ? instalmentRates[brandKey] 
                  : instalmentRates['visa'];
                
                if (selectedBrand) {
                  return (
                    <div className="overflow-x-auto">
                      <table className="min-w-full border rounded-md text-sm">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="py-2 px-4 text-left font-medium">Taksit Sayısı</th>
                            <th className="py-2 px-4 text-left font-medium">Aylık Ödeme</th>
                            <th className="py-2 px-4 text-left font-medium">Toplam Tutar</th>
                            <th className="py-2 px-4 text-left font-medium">Faiz Oranı</th>
                          </tr>
                        </thead>
                        <tbody>
                          {/* Tek Çekim */}
                          <tr>
                            <td className="py-2 px-4 flex items-center gap-2">
                              <input
                                type="radio"
                                name="installment"
                                className="accent-orange-500"
                                checked={selectedInstallment?.count === 1}
                                onChange={() => {
                                  setSelectedInstallment({ count: 1, rate: 0 });
                                  if (onInstallmentChange) onInstallmentChange({ count: 1, rate: 0 });
                                }}
                              />
                              <span className="font-semibold">Tek Çekim</span>
                            </td>
                            <td className="py-2 px-4 font-semibold text-orange-500">
                              {totalWithShipping.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL
                            </td>
                            <td className="py-2 px-4 font-semibold text-orange-500">
                              {totalWithShipping.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL
                            </td>
                            <td className="py-2 px-4 font-semibold text-green-600">
                              %0
                            </td>
                          </tr>
                          {/* Taksitli Seçenekler */}
                          {Object.entries(selectedBrand).map(([taksitKey, rate]: [string, any]) => {
                            const count = Number(taksitKey.replace('taksit_', ''));
                            if (isNaN(count)) return null;
                            const oran = Number(rate);
                            
                            // Taksit oranı hesaplama: oran yüzde olarak geliyor, faiz tutarını hesapla
                            const faizTutari = (totalWithShipping * oran) / 100;
                            const toplamTutar = totalWithShipping + faizTutari;
                            const aylikTutar = toplamTutar / count;
                            
                            return (
                              <tr key={count}>
                                <td className="py-2 px-4 flex items-center gap-2">
                                  <input
                                    type="radio"
                                    name="installment"
                                    className="accent-orange-500"
                                    checked={selectedInstallment?.count === count}
                                    onChange={() => {
                                      setSelectedInstallment({ count, rate: oran });
                                      if (onInstallmentChange) onInstallmentChange({ count, rate: oran });
                                    }}
                                  />
                                  <span>{count} Taksit</span>
                                </td>
                                <td className="py-2 px-4">
                                  {aylikTutar.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL
                                </td>
                                <td className="py-2 px-4">
                                  {toplamTutar.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL
                                </td>
                                <td className="py-2 px-4 text-red-600">
                                  %{oran.toFixed(2)}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  );
                }
                return !instalmentLoading && <div className="text-center p-4 text-gray-500">Taksit seçenekleri yükleniyor...</div>;
              })() : (
                !instalmentLoading && <div className="text-center p-4 text-gray-500">Taksit seçenekleri yükleniyor...</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}