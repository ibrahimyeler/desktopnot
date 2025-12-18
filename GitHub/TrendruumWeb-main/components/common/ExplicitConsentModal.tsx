import React, { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface ExplicitConsentModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'consent' | 'clarification' | 'membership';
}

const tabs = [
  { key: 'membership', label: 'Üyelik Sözleşmesi' },
  { key: 'clarification', label: 'Aydınlatma Metni' },
  { key: 'consent', label: 'Açık Rıza Metni' },
];

const tabContents: Record<string, React.ReactNode> = {
  membership: (
    <div>
      <h2 className="text-xl font-bold text-black mb-4">Üyelik Sözleşmesi</h2>
      <p className="text-black mb-2 text-sm">Trendruum platformuna üye olarak aşağıdaki şartları kabul etmiş olursunuz:</p>
      <ul className="list-disc pl-6 text-black mb-2 text-sm">
        <li>Hesabınızın güvenliğinden siz sorumlusunuz.</li>
        <li>Yanlış veya eksik bilgi vermeniz durumunda üyeliğiniz askıya alınabilir.</li>
        <li>Platform kurallarına uymakla yükümlüsünüz.</li>
      </ul>
      <p className="text-black text-sm">Daha fazla bilgi için lütfen <span className="text-orange-500 font-semibold">İletişim</span> sayfamızı ziyaret edin.</p>
    </div>
  ),
  clarification: (
    <div>
      <h2 className="text-xl font-bold text-black mb-4">Aydınlatma Metni</h2>
      <p className="text-black mb-2 text-sm">Kişisel verileriniz, 6698 sayılı KVK Kanunu kapsamında, Trendruum tarafından aşağıdaki amaçlarla işlenmektedir:</p>
      <ul className="list-disc pl-6 text-black mb-2 text-sm">
        <li>Hizmetlerin sunulması ve geliştirilmesi</li>
        <li>Müşteri memnuniyetinin artırılması</li>
        <li>Yasal yükümlülüklerin yerine getirilmesi</li>
      </ul>
      <p className="text-black text-sm">Detaylı bilgi için <span className="text-orange-500 font-semibold">Gizlilik Politikası</span> sayfamızı inceleyebilirsiniz.</p>
    </div>
  ),
  consent: (
    <div>
      <h2 className="text-xl font-bold text-orange-500 mb-4">AÇIK RIZANIZA YÖNELİK BİLGİLENDİRME METNİ</h2>
    <p className="text-black mb-2 text-sm"></p>
      <p className="text-black mb-2 underline font-semibold text-sm">Ürün ve hizmetlerin geliştirilmesine yönelik faaliyetlerin yürütülmesi ve tarafınıza avantajlı ve özel tekliflerin sunulabilmesi amaçlarıyla kişisel verilerinizin işlenmesine yönelik açık rızanızın bulunması halinde</p>
      <p className="text-black mb-2 text-sm">Segmentasyon bilgileriniz, Şirketimize ait internet sitesi ve/veya mobil uygulama vasıtasıyla üyelik hesabınızın kullanımı sırasında gerçekleştirdiğiniz işlemler sonucunda oluşan skor ve profillerle bilgileriniz işlenmektedir. Açık rıza vermeniz halinde, tarafınıza yönelik oluşturulacak skor ve profille bilginiz, Şirket tarafından size özel avantajlı tekliflerin sunulabilmesi, sizleri daha iyi tanıyarak memnuniyetinizin artırılmasına yönelik faaliyetlerin yürütülmesi, tercihlerinize uygun ürün veya hizmet tekliflerinin sunulması, veri zenginleştirmesinin sağlanması amaçlarıyla işlenmektedir.</p>
    </div>
  ),
};

const ExplicitConsentModal: React.FC<ExplicitConsentModalProps> = ({ isOpen, onClose, initialTab = 'consent' }) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab, isOpen]);
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-0 max-w-2xl w-full mx-4 relative max-h-[90vh] overflow-y-auto border-2 border-orange-500">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-orange-500 transition-colors"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
        <div className="flex border-b border-gray-200">
          {tabs.map(tab => (
            <button
              key={tab.key}
              className={`flex-1 py-4 text-lg font-semibold text-center transition-colors border-b-2
                ${activeTab === tab.key ? 'text-orange-500 border-orange-500 bg-orange-50' : 'text-black border-transparent hover:text-orange-500 hover:bg-orange-50'}`}
              onClick={() => setActiveTab(tab.key as 'consent' | 'clarification' | 'membership')}
              style={{ outline: 'none' }}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="p-8">{tabContents[activeTab]}</div>
        <button
          onClick={onClose}
          className="mt-2 mb-6 mx-8 w-[calc(100%-4rem)] bg-orange-500 text-white py-3 rounded-lg font-semibold text-lg hover:bg-orange-600 transition-colors shadow"
        >
          Kapat
        </button>
      </div>
    </div>
  );
};

export default ExplicitConsentModal; 