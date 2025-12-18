"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';

export default function YardimMerkeziPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const helpCategories = [
    {
      id: 'siparis',
      title: 'Sipariş ve Teslimat',
      icon: '📦',
      color: 'bg-blue-500',
      questions: [
        {
          question: 'Siparişimi nasıl takip edebilirim?',
          answer: 'Siparişinizi "Hesabım > Siparişlerim" bölümünden takip edebilirsiniz. Kargo takip numarası ile de kargo firmasının web sitesinden takip yapabilirsiniz.',
          tags: ['sipariş', 'takip', 'kargo']
        },
        {
          question: 'Siparişim ne zaman teslim edilecek?',
          answer: 'Siparişleriniz genellikle 1-3 iş günü içerisinde kargoya verilir. Teslimat süresi, bulunduğunuz bölgeye göre 1-3 iş günü arasında değişmektedir.',
          tags: ['teslimat', 'süre', 'kargo']
        },
        {
          question: 'Hangi kargo firması ile çalışıyorsunuz?',
          answer: 'Yurtiçi Kargo ile çalışmaktayız. Siparişiniz Yurtiçi Kargo ile gönderilir.',
          tags: ['kargo', 'yurtiçi']
        }
      ]
    },
    {
      id: 'iade',
      title: 'İade ve Değişim',
      icon: '🔄',
      color: 'bg-green-500',
      questions: [
        {
          question: 'Ürün iade süresi ne kadar?',
          answer: 'Ürünlerinizi teslim aldığınız tarihten itibaren 14 gün içerisinde iade edebilirsiniz.',
          tags: ['iade', 'süre', '14 gün']
        },
        {
          question: 'Hangi ürünler iade edilemez?',
          answer: 'Kişisel bakım ürünleri, iç çamaşırı, mayo, çorap gibi ürünler sağlık ve hijyen nedeniyle iade edilemez.',
          tags: ['iade edilemez', 'kişisel bakım']
        },
        {
          question: 'İade kargo ücreti kim tarafından karşılanır?',
          answer: 'Ürün hatası durumunda kargo ücreti firmamız tarafından karşılanır. Müşteri kaynaklı iadelerde kargo ücreti müşteri tarafından ödenir.',
          tags: ['kargo ücreti', 'iade']
        }
      ]
    },
    {
      id: 'odeme',
      title: 'Ödeme ve Güvenlik',
      icon: '💳',
      color: 'bg-purple-500',
      questions: [
        {
          question: 'Hangi ödeme yöntemlerini kabul ediyorsunuz?',
          answer: 'Kredi kartı, banka kartı ödeme seçeneklerini sunuyoruz. Tüm ödemeleriniz SSL sertifikası ile güvenle korunmaktadır.',
          tags: ['ödeme', 'kredi kartı', 'güvenlik']
        },
        {
          question: 'Ödeme bilgilerim güvende mi?',
          answer: 'Evet, tüm ödeme bilgileriniz 256-bit SSL şifreleme ile korunmaktadır. Kredi kartı bilgileriniz sistemimizde saklanmaz.',
          tags: ['güvenlik', 'şifreleme', 'SSL']
        }
      ]
    },
    {
      id: 'hesap',
      title: 'Hesap ve Üyelik',
      icon: '👤',
      color: 'bg-orange-500',
      questions: [
        {
          question: 'Üye olmadan alışveriş yapabilir miyim?',
          answer: 'Evet, misafir kullanıcı olarak da alışveriş yapabilirsiniz. Ancak üye olarak daha fazla avantajdan yararlanabilirsiniz.',
          tags: ['üyelik', 'misafir', 'avantaj']
        },
        {
          question: 'Şifremi unuttum, ne yapmalıyım?',
          answer: 'Giriş sayfasındaki "Şifremi Unuttum" linkine tıklayarak e-posta adresinize şifre sıfırlama linki gönderebiliriz.',
          tags: ['şifre', 'unuttum', 'sıfırlama']
        },
        {
          question: 'Hesap bilgilerimi nasıl güncelleyebilirim?',
          answer: 'Hesabım > Kullanıcı Bilgilerim bölümünden kişisel bilgilerinizi güncelleyebilirsiniz.',
          tags: ['hesap', 'güncelleme', 'bilgiler']
        }
      ]
    },
    {
      id: 'urun',
      title: 'Ürün ve Stok',
      icon: '🛍️',
      color: 'bg-red-500',
      questions: [
        {
          question: 'Ürün stokta yoksa ne yapabilirim?',
          answer: 'Stokta olmayan ürünler için "Stok Bildirimi" yapabilirsiniz. Ürün stoka girdiğinde size e-posta ile bilgilendirme yapılır.',
          tags: ['stok', 'bildirim', 'e-posta']
        },
        {
          question: 'Ürün fiyatları güncel mi?',
          answer: 'Evet, tüm ürün fiyatları güncel tutulmaktadır. Fiyat değişiklikleri anında sisteme yansıtılır.',
          tags: ['fiyat', 'güncel', 'değişiklik']
        },
        {
          question: 'Orijinal ürün garantisi var mı?',
          answer: 'Evet, tüm ürünlerimiz orijinaldir ve üretici garantisi kapsamındadır.',
          tags: ['orijinal', 'garanti', 'üretici']
        }
      ]
    },
    {
      id: 'teknik',
      title: 'Teknik Destek',
      icon: '🔧',
      color: 'bg-gray-500',
      questions: [
        {
          question: 'Sitenizde sorun yaşıyorum, ne yapmalıyım?',
          answer: 'Teknik sorunlar için destek@trendruum.com adresine e-posta gönderebilir veya 0850 242 11 44 numaralı telefonu arayabilirsiniz.',
          tags: ['teknik', 'sorun', 'destek']
        },
        {
          question: 'Mobil uygulamanız var mı?',
          answer: 'Evet, iOS ve Android için mobil uygulamamız mevcuttur. App Store ve Google Play\'den indirebilirsiniz.',
          tags: ['mobil', 'uygulama', 'iOS', 'Android']
        },
        {
          question: 'Hangi tarayıcıları destekliyorsunuz?',
          answer: 'Chrome, Firefox, Safari, Edge gibi tüm modern tarayıcıları destekliyoruz.',
          tags: ['tarayıcı', 'destek', 'modern']
        }
      ]
    }
  ];

  const allQuestions = helpCategories.flatMap(category => 
    category.questions.map(q => ({ ...q, category: category.title }))
  );

  const filteredQuestions = allQuestions.filter(question => {
    const matchesSearch = searchTerm === '' || 
      question.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      question.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      question.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || 
      helpCategories.find(cat => cat.id === selectedCategory)?.questions.includes(question);
    
    return matchesSearch && matchesCategory;
  });

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSearchTerm('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header showBackButton={true} onBackClick={() => window.history.back()} />
      
      <main className="flex-grow pb-4 md:pb-0 pt-24 md:pt-8">
        {/* Hero Section */}
        <div className="w-full px-4 md:px-5 relative pt-4 md:pt-0">
          <div 
            className="h-64 md:h-80 lg:h-96 rounded-lg relative overflow-hidden bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: 'url(/bg-trendruum.png)'
            }}
          >
            <div className="absolute inset-0 bg-black/40"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white px-4">
                <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-2">
                  Yardım Merkezi
                </h1>
                <p className="text-base md:text-lg lg:text-xl opacity-90 mb-6">
                  Aradığınız cevapları hızlıca bulun
                </p>
                
                {/* Search Bar */}
                <div className="max-w-2xl mx-auto">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Sorunu yaz veya anahtar kelime ara..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-6 py-4 text-gray-900 rounded-lg shadow-lg focus:ring-2 focus:ring-white focus:outline-none"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Breadcrumb */}
          <div className="absolute top-4 left-4 md:left-10">
            <div className="text-white text-xs md:text-sm">
              <span 
                className="hover:text-orange-300 cursor-pointer transition-colors"
                onClick={() => router.push('/')}
              >
                Anasayfa
              </span>
              <span className="mx-2">/</span>
              <span>Yardım Merkezi</span>
            </div>
          </div>
        </div>


        {/* Categories */}
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto">
            {/* Category Filter */}
            <div className="mb-8">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">Kategoriler</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
              <button
                onClick={() => handleCategoryClick('all')}
                className={`p-3 md:p-4 rounded-lg border-2 transition-all ${
                  selectedCategory === 'all' 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="text-center">
                  <div className="text-xl md:text-2xl mb-1 md:mb-2">📚</div>
                  <div className="text-xs md:text-sm font-medium text-gray-900">Tümü</div>
                </div>
              </button>
              
              {helpCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category.id)}
                  className={`p-3 md:p-4 rounded-lg border-2 transition-all ${
                    selectedCategory === category.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-xl md:text-2xl mb-1 md:mb-2">{category.icon}</div>
                    <div className="text-xs md:text-sm font-medium text-gray-900">{category.title}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

            {/* Search Results */}
            <div className="mb-8">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 md:mb-6 gap-2">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                  {searchTerm ? `"${searchTerm}" için sonuçlar` : 'Sık Sorulan Sorular'}
                </h2>
                <span className="text-sm md:text-base text-gray-600">
                  {filteredQuestions.length} sonuç
                </span>
              </div>

            {filteredQuestions.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Sonuç bulunamadı
                </h3>
                <p className="text-gray-600 mb-6">
                  Aradığınız terimle eşleşen sonuç bulunamadı. Farklı anahtar kelimeler deneyebilirsiniz.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                  }}
                  className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Tüm Soruları Gör
                </button>
              </div>
            ) : (
              <div className="space-y-3 md:space-y-4">
                {filteredQuestions.map((question, index) => (
                  <div key={index} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <details className="group">
                      <summary className="flex justify-between items-center p-4 md:p-6 cursor-pointer hover:bg-gray-50 transition-colors">
                        <div className="flex-1">
                          <h3 className="text-base md:text-lg font-semibold text-gray-900 pr-4">
                            {question.question}
                          </h3>
                          <p className="text-xs md:text-sm text-gray-500 mt-1">{question.category}</p>
                        </div>
                        <svg 
                          className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform flex-shrink-0" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </summary>
                      <div className="px-4 md:px-6 pb-4 md:pb-6">
                        <p className="text-sm md:text-base text-gray-700 leading-relaxed mb-4">
                          {question.answer}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {question.tags.map((tag, tagIndex) => (
                            <span
                              key={tagIndex}
                              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </details>
                  </div>
                ))}
              </div>
            )}
          </div>

            {/* Contact Section */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 md:p-8">
              <div className="text-center">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                  Hala Yardıma mı İhtiyacınız Var?
                </h2>
                <p className="text-sm md:text-base text-gray-600 mb-6">
                  Aradığınız cevabı bulamadıysanız, müşteri hizmetlerimizle iletişime geçebilirsiniz.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button 
                    onClick={() => router.push('/s/iletisim')}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    İletişime Geç
                  </button>
                  <button 
                    onClick={() => router.push('/s/sss')}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-900 px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    SSS'yi Görüntüle
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
