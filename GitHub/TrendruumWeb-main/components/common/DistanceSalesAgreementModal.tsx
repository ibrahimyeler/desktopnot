"use client";

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface DistanceSalesAgreementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept?: () => void;
  sellerInfo?: {
    name?: string;
    address?: string;
    phone?: string;
    taxNumber?: string;
    email?: string;
  };
  customerInfo?: {
    name?: string;
    address?: string;
    email?: string;
  };
  productInfo?: {
    name?: string;
    price?: number;
    quantity?: number;
  };
  orderInfo?: {
    subtotal?: number;
    shippingCost?: number;
    total?: number;
    paymentMethod?: string;
  };
}

const DistanceSalesAgreementModal = ({ 
  isOpen, 
  onClose, 
  onAccept,
  sellerInfo = {}, 
  customerInfo = {}, 
  productInfo = {},
  orderInfo = {}
}: DistanceSalesAgreementModalProps) => {
  const [isLoading, setIsLoading] = useState(false);

  // Body scroll'u kontrol et
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    // Cleanup
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAccept = () => {
    setIsLoading(true);
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
      // onAccept callback'ini çağır (checkbox'ı işaretlemek için)
      if (onAccept) {
        onAccept();
      }
      onClose();
    }, 1000);
  };

  const modalContent = (
    <div className="fixed inset-0 z-[10000]">
      <div className="absolute inset-0 bg-black/50" />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="relative z-[10001] max-w-4xl w-full max-h-[90vh] overflow-hidden rounded-lg bg-white shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Mesafeli Satış Sözleşmesi</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-140px)] p-6 bg-white">
            <div className="prose prose-sm max-w-none">
              {/* Header */}
              <div className="text-center mb-8 pb-4 border-b-2 border-black">
                <h1 className="text-2xl font-bold text-black mb-2">MESAFELİ SATIŞ SÖZLEŞMESİ</h1>
                <h2 className="text-lg font-semibold text-black">TRENDRUUM PLATFORMU MESAFELİ SATIŞ SÖZLEŞMESİ</h2>
              </div>

              {/* Parties Section */}
              <div className="mb-8">
                <h3 className="text-lg font-bold text-black mb-4 border-l-4 border-black pl-3">1. 📋 TARAFLAR</h3>
                
                <div className="bg-gray-50 p-6 rounded-lg border border-black mb-6">
                  {/* Seller */}
                  <div className="mb-6">
                    <div className="font-bold text-black mb-3">🏢 SATICI</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <div><span className="font-semibold">Satıcı İsim/Unvanı:</span> {sellerInfo.name || 'Sipariş sırasında belirtilecek'}</div>
                      <div><span className="font-semibold">Satıcı'nın Açık Adresi:</span> {sellerInfo.address || 'Sipariş sırasında belirtilecek'}</div>
                      <div><span className="font-semibold">Satıcı'nın Telefonu:</span> {sellerInfo.phone || 'Sipariş sırasında belirtilecek'}</div>
                      <div><span className="font-semibold">Satıcı Mersis/Vergi No:</span> {sellerInfo.taxNumber || 'Sipariş sırasında belirtilecek'}</div>
                      <div><span className="font-semibold">Satıcı E-Posta Adresi:</span> {sellerInfo.email || 'Sipariş sırasında belirtilecek'}</div>
                    </div>
                  </div>

                  {/* Intermediary Service Provider */}
                  <div className="mb-6">
                    <div className="font-bold text-black mb-3">🌐 ARACI HİZMET SAĞLAYICI</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <div><span className="font-semibold">UNVANI:</span> BECEM ELEKTRONİK TİCARET VE BİLİŞİM HİZMETLERİ ANONİM ŞİRKETİ</div>
                      <div><span className="font-semibold">ADRES:</span> BARBAROS HAYRETİN PAŞA MAH. 1992.SOKAK NO:30 K:5 ESENYURT / İSTANBUL</div>
                      <div><span className="font-semibold">VERGİ DAİRESİ:</span> ESENYURT VERGİ DAİRESİ</div>
                      <div><span className="font-semibold">VERGİ NO:</span> 1600690111</div>
                      <div><span className="font-semibold">MERSİS:</span> 0160069011100016</div>
                      <div><span className="font-semibold">Web Sitesi:</span> www.trendruum.com</div>
                      <div><span className="font-semibold">E-Posta:</span> destek@trendruum.com</div>
                    </div>
                  </div>

                  {/* Customer */}
                  <div>
                    <div className="font-bold text-black mb-3">👤 ALICI</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <div><span className="font-semibold">Adı – Soyadı:</span> {customerInfo.name || 'Sipariş sırasında belirtilecek'}</div>
                      <div><span className="font-semibold">Adresi:</span> {customerInfo.address || 'Sipariş sırasında belirtilecek'}</div>
                      <div><span className="font-semibold">E-Posta:</span> {customerInfo.email || 'Sipariş sırasında belirtilecek'}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contract Subject */}
              <div className="mb-8">
                <h3 className="text-lg font-bold text-black mb-4 border-l-4 border-black pl-3">2. 📄 SÖZLEŞME'NİN KONUSU VE KAPSAMI</h3>
                <div className="text-sm text-justify space-y-3">
                  <p>2.1. İşbu Mesafeli Satış Sözleşmesi ("Sözleşme") 6502 Sayılı Tüketicinin Korunması Hakkında Kanun ("Kanun") ve Mesafeli Sözleşmeler Yönetmeliği'ne uygun olarak düzenlenmiştir.</p>
                  <p>2.2. Becem Elektronik Ticaret ve Bilişim Hizmetleri Anonim Şirketi, işbu Sözleşme'de "Trendruum" olarak anılacaktır.</p>
                  <p>2.3. İşbu Sözleşme'nin konusunu; Alıcı'nın, Trendruum'e ait www.trendruum.com alan adlı web sitesinden ("Websitesi" veya "Platform") Satıcı'ya ait mal veya hizmetin satın alınmasına yönelik elektronik olarak sipariş verdiği, Sözleşme'de belirtilen niteliklere sahip mal veya hizmetin satışı ve teslimi ile ilgili olarak Kanun ve Mesafeli Sözleşmeler Yönetmeliği hükümleri gereğince tarafların hak ve yükümlülüklerinin belirlenmesi oluşturur.</p>
                </div>
              </div>

              {/* Product Information */}
              <div className="mb-8">
                <h3 className="text-lg font-bold text-black mb-4 border-l-4 border-black pl-3">3. 🛒 SÖZLEŞME KONUSU MAL VE HİZMETİN TEMEL NİTELİKLERİ VE FİYATI (KDV DAHİL)</h3>
                
                <div className="bg-white border border-black p-4 rounded mb-4">
                  <strong>📦 Ürün/Hizmet Detayları:</strong><br/>
                  <div className="mt-2 space-y-1 text-sm">
                    <div><span className="font-semibold">Ürün Adı:</span> {productInfo.name || 'Sipariş sırasında belirtilecek'}</div>
                    <div><span className="font-semibold">Birim Fiyatı:</span> {productInfo.price ? `${productInfo.price.toLocaleString('tr-TR')} TL` : 'Sipariş sırasında belirtilecek'}</div>
                    <div><span className="font-semibold">Adet:</span> {productInfo.quantity || 'Sipariş sırasında belirtilecek'}</div>
                  </div>
                </div>

                              <div className="text-sm space-y-2">
                <div className="flex items-center">
                  <span className="mr-2">➢</span>
                  <span>Kargo hariç toplam ürün bedeli: {orderInfo.subtotal ? `${orderInfo.subtotal.toLocaleString('tr-TR')} TL` : (productInfo.price ? `${productInfo.price.toLocaleString('tr-TR')} TL` : 'Sipariş sırasında belirtilecek')}</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-2">➢</span>
                  <span>Kargo Ücreti: {orderInfo.shippingCost ? `${orderInfo.shippingCost.toLocaleString('tr-TR')} TL` : 'Sipariş sırasında belirtilecek'}</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-2">➢</span>
                  <span>Kargo Dahil Toplam Bedeli: {orderInfo.total ? `${orderInfo.total.toLocaleString('tr-TR')} TL` : 'Sipariş sırasında belirtilecek'}</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-2">➢</span>
                  <span>Ödeme Şekli ve Planı: {orderInfo.paymentMethod || 'Sipariş sırasında belirtilecek'}</span>
                </div>
              </div>
              </div>

              {/* Key Sections */}
              <div className="mb-8">
                <h3 className="text-lg font-bold text-black mb-4 border-l-4 border-black pl-3">4. 🚚 MALIN TESLİMİ VE TESLİM ŞEKLİ</h3>
                <div className="text-sm text-justify">
                  Sözleşme Alıcı tarafından elektronik ortamda onaylanmakla yürürlüğe girmiş olup, Alıcı'nın Satıcı'dan satın almış olduğu mal veya hizmetin Alıcı'ya teslim edilmesiyle ifa edilmiş olur.
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-bold text-black mb-4 border-l-4 border-black pl-3">5. 💰 TESLİMAT MASRAFLARI VE İFASI</h3>
                <div className="text-sm text-justify space-y-3">
                  <p>5.1. Malın teslimat masrafları aksine bir hüküm yoksa Alıcı'ya aittir.</p>
                  <p>5.2. Malın teslimatı; ödemenin gerçekleşmesinden sonra taahhüt edilen sürede yapılır.</p>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-bold text-black mb-4 border-l-4 border-black pl-3">6. 👤 ALICI'NIN BEYAN VE TAAHHÜTLERİ</h3>
                <div className="text-sm text-justify space-y-3">
                  <p>6.1. Alıcı, Platform'da yer alan Sözleşme konusu mal veya hizmetin temel nitelikleri, satış fiyatı ve ödeme şekli ile teslimat ve kargo bedeline ilişkin olarak Satıcı tarafından yüklenen ön bilgileri okuyup bilgi sahibi olduğunu ve elektronik ortamda gerekli teyidi verdiğini beyan eder.</p>
                  <p>6.2. Alıcılar, tüketici sıfatıyla talep ve şikayetlerini yukarıda yer alan Satıcı iletişim bilgilerini kullanarak ve/veya Platform'da yer alan Hesabım &gt; Ürün Sorularım üzerinden ulaştırabilirler.</p>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-bold text-black mb-4 border-l-4 border-black pl-3">7. 🏢 SATICI'NIN BEYAN VE TAAHHÜTLERİ</h3>
                <div className="text-sm text-justify space-y-3">
                  <p>7.1. Satıcı, Sözleşme konusu mal veya hizmetin tüketici mevzuatına uygun olarak, sağlam, eksiksiz, siparişte belirtilen niteliklere uygun ve varsa garanti belgeleri ve kullanım kılavuzları ile Alıcı'ya teslim edilmesinden sorumludur.</p>
                  <p>7.2. Satıcı, sipariş konusu mal veya hizmetin ediminin yerine getirilmesinin imkansızlaştığı haller saklı kalmak kaydıyla, mal veya hizmeti, Alıcı tarafından mal veya hizmetin sipariş edilmesinden itibaren 30 (otuz) gün içinde teslim eder.</p>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-bold text-black mb-4 border-l-4 border-black pl-3">8. 🌐 TRENDRUUM'UN BEYAN VE TAAHHÜTLERİ</h3>
                <div className="text-sm text-justify space-y-3">
                  <p>8.1. Trendruum'un işbu Sözleşme konusu mal veya hizmetin doğrudan Alıcı'ya satışını yaptığı hallerde, işbu Sözleşme'de yer alan Satıcı'nın Beyan ve Taahhütleri geçerli olacak olup, Satıcı'ya yapılan tüm atıflar Trendruum'a yapılmış sayılacaktır.</p>
                  <div className="bg-white border border-black p-4 rounded">
                    <strong>⚠️ Aracı Hizmet Sağlayıcı Durumu:</strong><br/>
                    Trendruum'un ARACI HİZMET SAĞLAYICI OLDUĞU HALLERDE, TRENDRUUM İŞBU MESAFELİ SATIŞ SÖZLEŞMESİ'NİN TARAFI OLMADIĞINDAN, SÖZLEŞME KAPSAMINDA ALICI VE SATICININ YÜKÜMLÜLÜKLERİNİ YERİNE GETİRMELERİ İLE İLGİLİ, AKSİ MEVZUATTA DÜZENLENEN HALLER HARİÇ OLMAK ÜZERE, HERHANGİ BİR SORUMLULUĞU VE TAAHHÜDÜ BULUNMAMAKTADIR.
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-bold text-black mb-4 border-l-4 border-black pl-3">9. 🔄 CAYMA HAKKI</h3>
                <div className="bg-white border border-black p-4 rounded mb-4">
                  <strong>✅ Cayma Hakkınız:</strong><br/>
                  Alıcı, hiçbir gerekçe göstermeksizin, mal satışına ilişkin işlemlerde teslimat tarihinden itibaren, hizmet satışına ilişkin işlemlerde satın alma tarihinden itibaren 14 (on dört) gün içinde cayma hakkını kullanabilir.
                </div>
                <div className="text-sm space-y-2">
                  <div className="flex items-center">
                    <span className="mr-2">➢</span>
                    <span>Alıcı'nın cayma hakkını kullandığı tarihten itibaren 10 (on) gün içinde malı geri göndermesi gerekmektedir</span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2">➢</span>
                    <span>Mal ile beraber faturasının, malın kutusunun, ambalajının, varsa standart aksesuarları, mal ile birlikte hediye edilen diğer ürünlerin de eksiksiz ve hasarsız olarak iade edilmesi gerekmektedir</span>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-bold text-black mb-4 border-l-4 border-black pl-3">10. ❌ CAYMA HAKKININ KULLANILAMAYACAĞI HALLER</h3>
                <div className="text-sm text-justify mb-4">
                  Mevzuat uyarınca Alıcı aşağıdaki hallerde cayma hakkını kullanamaz:
                </div>
                <div className="text-sm space-y-2">
                  <div className="flex items-center">
                    <span className="mr-2">➢</span>
                    <span>Fiyatı finansal piyasalardaki dalgalanmalara bağlı olarak değişen ve Satıcı'nın kontrolünde olmayan mal veya hizmetlere ilişkin sözleşmeler</span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2">➢</span>
                    <span>Alıcı'nın istekleri veya kişisel ihtiyaçları doğrultusunda hazırlanan mallara ilişkin sözleşmeler</span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2">➢</span>
                    <span>Çabuk bozulabilen veya son kullanma tarihi geçebilecek malların teslimine ilişkin sözleşmeler</span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2">➢</span>
                    <span>Tesliminden sonra ambalaj, bant, mühür, paket gibi koruyucu unsurları açılmış olan mallardan; iadesi sağlık ve hijyen açısından uygun olmayanların teslimine ilişkin sözleşmeler</span>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-bold text-black mb-4 border-l-4 border-black pl-3">11. ⚖️ UYUŞMAZLIKLARIN ÇÖZÜMÜ</h3>
                <div className="text-sm text-justify space-y-3">
                  <p>11.1. Kanun ve Mesafeli Sözleşmeler Yönetmeliği kapsamında satılan mal veya hizmete ilişkin sorumluluk bizzat Satıcı'ya aittir.</p>
                  <p>11.2. İşbu Mesafeli Satış Sözleşme ile ilgili çıkacak ihtilaflarda; her yıl Ticaret Bakanlığı tarafından ilan edilen değere kadar Alıcı'nın yerleşim yerindeki ürünü satın aldığı veya ikametgâhının bulunduğu yerdeki İl veya İlçe Tüketici Sorunları Hakem Heyetleri, söz konusu değerin üzerindeki ihtilaflarda ise Tüketici Mahkemeleri yetkilidir.</p>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-bold text-black mb-4 border-l-4 border-black pl-3">12. 💰 MAL/HİZMETİN FİYATI</h3>
                <div className="text-sm text-justify">
                  Malın peşin veya vadeli satış fiyatı, sipariş formunda yer almakla birlikte, sipariş sonu gönderilen bilgilendirme e-postası ve ürün ile birlikte müşteriye gönderilen fatura içeriğinde mevcut olan fiyattır.
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-bold text-black mb-4 border-l-4 border-black pl-3">13. ⚠️ TEMERRÜT HALİ VE HUKUKİ SONUÇLARI</h3>
                <div className="text-sm text-justify">
                  Herhangi bir nedenle Alıcı tarafından mal veya hizmetin bedeli ödenmez veya yapılan ödeme banka kayıtlarında iptal edilir ise, Satıcı mal veya hizmetin teslimi yükümlülüğünden kurtulmuş kabul edilir.
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-bold text-black mb-4 border-l-4 border-black pl-3">14. 📞 BİLDİRİMLER VE DELİL SÖZLEŞMESİ</h3>
                <div className="text-sm text-justify space-y-3">
                  <p>14.1. İşbu Sözleşme tahtında taraflar arasında yapılacak her türlü yazışma, mevzuatta sayılan zorunlu haller dışında, Platform'da yer alan Hesabım sayfasından veya elektronik posta aracılığıyla yapılacaktır.</p>
                  <p>14.2. Alıcı, tüketici sıfatıyla talep ve şikayetlerini yukarıda yer alan Satıcı iletişim bilgilerini kullanarak ve/veya Platform'da yer alan Hesabım sayfası üzerinden, Trendruum Çağrı Merkezi'ni arayarak, yukarıda belirten e-posta adresinden veya Platform'daki canlı destek alanından ulaştırabilir.</p>
                  <p>14.3. Alıcı, işbu Sözleşme'den doğabilecek ihtilaflarda Satıcı'nın ve Trendruum'un resmi defter ve ticari kayıtlarıyla, kendi veri tabanında, sunucularında tuttuğu elektronik bilgilerin ve bilgisayar kayıtlarının, bağlayıcı, kesin ve münhasır delil teşkil edeceğini, bu maddenin Hukuk Muhakemeleri Kanunu'nun 193. maddesi anlamında delil sözleşmesi niteliğinde olduğunu kabul, beyan ve taahhüt eder.</p>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-bold text-black mb-4 border-l-4 border-black pl-3">15. ✅ YÜRÜRLÜK</h3>
                <div className="text-sm text-justify mb-4">
                  15 (on beş) maddeden ibaret bu Sözleşme, taraflarca okunarak, işlem tarihinde, Alıcı tarafından elektronik ortamda onaylanmak suretiyle akdedilmiş ve yürürlüğe girmiştir.
                </div>
                <div className="bg-white border border-black p-3 rounded italic text-sm">
                  <strong>Yasal Dayanak:</strong> 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve 
                  Mesafeli Sözleşmeler Yönetmeliği uyarınca hazırlanmıştır.
                </div>
              </div>

              <div className="text-center mt-8 pt-4 border-t-2 border-black font-bold text-black">
                📅 Güncellenme Tarihi: 15.08.2025
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
            <button
              onClick={onClose}
              className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
            >
              İptal
            </button>
            <button
              onClick={handleAccept}
              disabled={isLoading}
              className={`px-6 py-2 text-white rounded-lg transition-colors ${
                isLoading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-orange-600 hover:bg-orange-700'
              }`}
            >
              {isLoading ? 'Onaylanıyor...' : 'Sözleşmeyi Onaylıyorum'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return isOpen ? createPortal(modalContent, document.body) : null;
};

export default DistanceSalesAgreementModal;
