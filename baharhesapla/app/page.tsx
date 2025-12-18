"use client";

import { useState, useMemo } from "react";

interface ProductRow {
  id: string;
  productName: string;
  width: number;
  thickness: number;
  length: number;
  quantity: number;
  currency: string;
  price: number;
  vatRate: number;
  unit: string;
}

export default function Home() {
  const [formData, setFormData] = useState({
    // Müşteri Bilgileri
    customerCompany: "ÖRNEK MÜŞTERİ TİCARET A.Ş.",
    customerAuthorized: "Müşteri Yetkilisi",
    customerAddress: "Müşteri Adresi Buraya",
    customerPhone: "+90 5XX XXX XX XX",
    offerNo: "2025-001",
    shipping: "Nakliye Hariç Müşteri Araç üstü te",
    payment: "İş teslimi Nakit veya havale",
    // Firma Bilgileri
    companyTitle: "",
    companyAuthorized: "",
    companyAddress: "",
    companyPhone: "",
    companyEmail: "",
    companyWebsite: "",
    companyTaxOffice: "",
    companyIban: "",
  });

  // Döviz kurları ve tarih
  const [dollarRate, setDollarRate] = useState("42,4899");
  const [euroRate, setEuroRate] = useState("49,2927");
  const [transactionDate, setTransactionDate] = useState("28.11.2025");

  // Ürün satırları
  const [products, setProducts] = useState<ProductRow[]>([
    {
      id: "1",
      productName: "Sibirya Sarı Çam",
      width: 10,
      thickness: 10,
      length: 400,
      quantity: 1,
      currency: "TL",
      price: 15000,
      vatRate: 20,
      unit: "M3",
    },
    {
      id: "2",
      productName: "İnş. Çam Kereste Yerli",
      width: 15,
      thickness: 2,
      length: 400,
      quantity: 1,
      currency: "USD",
      price: 20,
      vatRate: 8,
      unit: "Metre",
    },
  ]);

  // Müşteri ödemesi
  const [customerPayment, setCustomerPayment] = useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProductChange = (id: string, field: keyof ProductRow, value: string | number) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === id ? { ...product, [field]: value } : product
      )
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((product) => product.id !== id));
  };

  const addProductRow = () => {
    const newProduct: ProductRow = {
      id: Date.now().toString(),
      productName: "",
      width: 0,
      thickness: 0,
      length: 0,
      quantity: 1,
      currency: "TL",
      price: 0,
      vatRate: 20,
      unit: "M3",
    };
    setProducts((prev) => [...prev, newProduct]);
  };

  // Hesaplamalar
  const calculations = useMemo(() => {
    let totalVat = 0;
    let totalAmount = 0;
    let totalVolume = 0;

    products.forEach((product) => {
      const volume = (product.width * product.thickness * product.length * product.quantity) / 1000000; // cm3 to m3
      totalVolume += volume;

      let basePrice = product.price;
      if (product.currency === "USD") {
        basePrice = product.price * parseFloat(dollarRate.replace(",", "."));
      } else if (product.currency === "EUR") {
        basePrice = product.price * parseFloat(euroRate.replace(",", "."));
      }

      const subtotal = basePrice * product.quantity;
      const vatAmount = (subtotal * product.vatRate) / 100;
      const rowTotal = subtotal + vatAmount;

      totalVat += vatAmount;
      totalAmount += rowTotal;
    });

    const subtotalExcludingVat = totalAmount - totalVat;
    const remainingBalance = totalAmount - customerPayment;

    return {
      subtotalExcludingVat: subtotalExcludingVat.toFixed(2).replace(".", ","),
      totalVat: totalVat.toFixed(2).replace(".", ","),
      totalAmount: totalAmount.toFixed(2).replace(".", ","),
      totalVolume: totalVolume.toFixed(3).replace(".", ","),
      remainingBalance: remainingBalance.toFixed(2).replace(".", ","),
    };
  }, [products, dollarRate, euroRate, customerPayment]);

  const calculateRowTotal = (product: ProductRow) => {
    let basePrice = product.price;
    if (product.currency === "USD") {
      basePrice = product.price * parseFloat(dollarRate.replace(",", "."));
    } else if (product.currency === "EUR") {
      basePrice = product.price * parseFloat(euroRate.replace(",", "."));
    }

    const subtotal = basePrice * product.quantity;
    const vatAmount = (subtotal * product.vatRate) / 100;
    const rowTotal = subtotal + vatAmount;

    return {
      vatAmount: vatAmount.toFixed(2).replace(".", ","),
      total: rowTotal.toFixed(2).replace(".", ","),
      volume: ((product.width * product.thickness * product.length * product.quantity) / 1000000).toFixed(3).replace(".", ","),
    };
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Ana Container */}
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Üst Buton Bar ve Döviz Kurları */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          {/* Butonlar */}
          <div className="flex flex-wrap gap-2">
            <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
              PDF Olarak Kaydet
            </button>
            <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors flex items-center gap-2">
              <span>💾</span>
              Verileri Kaydet
            </button>
            <button className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors flex items-center gap-2">
              <span>📁</span>
              Dosyadan Yükle
            </button>
            <button className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors flex items-center gap-2">
              <span>ℹ️</span>
              Hakkında
            </button>
          </div>

          {/* Döviz Kurları ve Tarih */}
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Dolar Kuru:</label>
              <input
                type="text"
                value={dollarRate}
                onChange={(e) => setDollarRate(e.target.value)}
                className="w-24 px-2 py-1 border border-gray-300 rounded text-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Euro Kuru:</label>
              <input
                type="text"
                value={euroRate}
                onChange={(e) => setEuroRate(e.target.value)}
                className="w-24 px-2 py-1 border border-gray-300 rounded text-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">İşlem Tarihi:</label>
              <input
                type="text"
                value={transactionDate}
                onChange={(e) => setTransactionDate(e.target.value)}
                className="w-32 px-2 py-1 border border-gray-300 rounded text-sm"
              />
              <span>📅</span>
            </div>
          </div>
        </div>

        {/* Başlık */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">
            Kereste Hesaplama Teklifi
          </h1>
          <div className="h-1 w-full bg-blue-500"></div>
        </div>

        {/* Form Container - İki Sütunlu */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Sol Sütun - Müşteri Bilgileri */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Firma Adı:
              </label>
              <input
                type="text"
                name="customerCompany"
                value={formData.customerCompany}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Yetkili:
              </label>
              <input
                type="text"
                name="customerAuthorized"
                value={formData.customerAuthorized}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Adres:
              </label>
              <input
                type="text"
                name="customerAddress"
                value={formData.customerAddress}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Telefon:
              </label>
              <input
                type="text"
                name="customerPhone"
                value={formData.customerPhone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teklif No:
              </label>
              <input
                type="text"
                name="offerNo"
                value={formData.offerNo}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nakliye:
              </label>
              <select
                name="shipping"
                value={formData.shipping}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white cursor-pointer"
              >
                <option value="Nakliye Hariç Müşteri Araç üstü te">
                  Nakliye Hariç Müşteri Araç üstü te
                </option>
                <option value="Nakliye Dahil">Nakliye Dahil</option>
                <option value="Nakliye Ayrı">Nakliye Ayrı</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ödeme:
              </label>
              <select
                name="payment"
                value={formData.payment}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white cursor-pointer"
              >
                <option value="İş teslimi Nakit veya havale">
                  İş teslimi Nakit veya havale
                </option>
                <option value="Peşin">Peşin</option>
                <option value="Vadeli">Vadeli</option>
              </select>
            </div>
          </div>

          {/* Sağ Sütun - Firma Bilgileri */}
          <div className="space-y-4">
            <div>
              <input
                type="text"
                name="companyTitle"
                value={formData.companyTitle}
                onChange={handleChange}
                placeholder="Firmanızın ünvanı"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <input
                type="text"
                name="companyAuthorized"
                value={formData.companyAuthorized}
                onChange={handleChange}
                placeholder="Firma Yetkilisi"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <input
                type="text"
                name="companyAddress"
                value={formData.companyAddress}
                onChange={handleChange}
                placeholder="Firmanızın Adresi"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <input
                type="text"
                name="companyPhone"
                value={formData.companyPhone}
                onChange={handleChange}
                placeholder="+90 532 xxx xx xx"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <input
                type="email"
                name="companyEmail"
                value={formData.companyEmail}
                onChange={handleChange}
                placeholder="e-posta@outlook.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <input
                type="text"
                name="companyWebsite"
                value={formData.companyWebsite}
                onChange={handleChange}
                placeholder="www.webadresi.com.tr"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <input
                type="text"
                name="companyTaxOffice"
                value={formData.companyTaxOffice}
                onChange={handleChange}
                placeholder="vd.: / vno:"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <input
                type="text"
                name="companyIban"
                value={formData.companyIban}
                onChange={handleChange}
                placeholder="TRxx xxxx xxxx xxxx xxxx xx"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Ürün Tablosu */}
        <div className="mt-8 overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">Ürün Adı</th>
                <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">En cm</th>
                <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">Kln cm</th>
                <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">Boy cm</th>
                <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">Adet</th>
                <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">Döviz</th>
                <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">Fiyat</th>
                <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">KDV(%)</th>
                <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">KDV Tutarı</th>
                <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">Tutar</th>
                <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">Hacim</th>
                <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">Birimi</th>
                <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">Sil</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const rowCalc = calculateRowTotal(product);
                return (
                  <tr key={product.id}>
                    <td className="border border-gray-300 px-3 py-2">
                      <select
                        value={product.productName}
                        onChange={(e) => handleProductChange(product.id, "productName", e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      >
                        <option value="Sibirya Sarı Çam">Sibirya Sarı Çam</option>
                        <option value="İnş. Çam Kereste Yerli">İnş. Çam Kereste Yerli</option>
                        <option value="">Seçiniz</option>
                      </select>
                    </td>
                    <td className="border border-gray-300 px-3 py-2">
                      <input
                        type="number"
                        value={product.width}
                        onChange={(e) => handleProductChange(product.id, "width", parseFloat(e.target.value) || 0)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    </td>
                    <td className="border border-gray-300 px-3 py-2">
                      <input
                        type="number"
                        value={product.thickness}
                        onChange={(e) => handleProductChange(product.id, "thickness", parseFloat(e.target.value) || 0)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    </td>
                    <td className="border border-gray-300 px-3 py-2">
                      <input
                        type="number"
                        value={product.length}
                        onChange={(e) => handleProductChange(product.id, "length", parseFloat(e.target.value) || 0)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    </td>
                    <td className="border border-gray-300 px-3 py-2">
                      <input
                        type="number"
                        value={product.quantity}
                        onChange={(e) => handleProductChange(product.id, "quantity", parseFloat(e.target.value) || 0)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    </td>
                    <td className="border border-gray-300 px-3 py-2">
                      <select
                        value={product.currency}
                        onChange={(e) => handleProductChange(product.id, "currency", e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      >
                        <option value="TL">TL</option>
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                      </select>
                    </td>
                    <td className="border border-gray-300 px-3 py-2">
                      <input
                        type="number"
                        value={product.price}
                        onChange={(e) => handleProductChange(product.id, "price", parseFloat(e.target.value) || 0)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    </td>
                    <td className="border border-gray-300 px-3 py-2">
                      <select
                        value={product.vatRate}
                        onChange={(e) => handleProductChange(product.id, "vatRate", parseFloat(e.target.value) || 0)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      >
                        <option value="0">0</option>
                        <option value="1">1</option>
                        <option value="8">8</option>
                        <option value="18">18</option>
                        <option value="20">20</option>
                      </select>
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-sm">{rowCalc.vatAmount}</td>
                    <td className="border border-gray-300 px-3 py-2 text-sm">{rowCalc.total}</td>
                    <td className="border border-gray-300 px-3 py-2 text-sm">{rowCalc.volume}</td>
                    <td className="border border-gray-300 px-3 py-2">
                      <select
                        value={product.unit}
                        onChange={(e) => handleProductChange(product.id, "unit", e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      >
                        <option value="M3">M3</option>
                        <option value="Metre">Metre</option>
                        <option value="Adet">Adet</option>
                      </select>
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-center">
                      <button
                        onClick={() => deleteProduct(product.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                );
              })}
              {/* Toplam Satırı */}
              <tr className="bg-gray-50 font-semibold">
                <td colSpan={8} className="border border-gray-300 px-3 py-2 text-right">
                  Toplam :
                </td>
                <td className="border border-gray-300 px-3 py-2 text-sm">{calculations.totalVat}</td>
                <td className="border border-gray-300 px-3 py-2 text-sm">{calculations.totalAmount}</td>
                <td className="border border-gray-300 px-3 py-2 text-sm">{calculations.totalVolume}</td>
                <td colSpan={2} className="border border-gray-300 px-3 py-2"></td>
              </tr>
            </tbody>
          </table>
          <button
            onClick={addProductRow}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors flex items-center gap-2"
          >
            <span>+</span>
            Satır Ekle
          </button>
        </div>

        {/* Özet Bölümü */}
        <div className="mt-8 flex justify-end">
          <div className="w-full max-w-md space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Ara Toplam (KDV Hariç) (₺):</label>
              <input
                type="text"
                value={calculations.subtotalExcludingVat}
                readOnly
                className="w-40 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Toplam KDV (₺):</label>
              <input
                type="text"
                value={calculations.totalVat}
                readOnly
                className="w-40 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Genel Toplam (KDV Dahil) (₺):</label>
              <input
                type="text"
                value={calculations.totalAmount}
                readOnly
                className="w-40 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm font-semibold"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Müşteri Ödemesi (₺):</label>
              <input
                type="number"
                value={customerPayment}
                onChange={(e) => setCustomerPayment(parseFloat(e.target.value) || 0)}
                className="w-40 px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Kalan Bakiye (₺):</label>
              <input
                type="text"
                value={calculations.remainingBalance}
                readOnly
                className="w-40 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm font-semibold"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
