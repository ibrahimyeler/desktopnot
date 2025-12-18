"use client";

import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';

export default function SSSPage() {
  const router = useRouter();

  const faqData = [
    {
      category: "Sipariş ve Teslimat",
      questions: [
        {
          question: "Siparişim ne zaman teslim edilecek?",
          answer: "Siparişleriniz genellikle 1-3 iş günü içerisinde kargoya verilir. Teslimat süresi, bulunduğunuz bölgeye göre 1-3 iş günü arasında değişmektedir."
        },
        {
          question: "Siparişimi nasıl takip edebilirim?",
          answer: "Siparişinizi 'Hesabım > Siparişlerim' bölümünden takip edebilirsiniz. Kargo takip numarası ile de kargo firmasının web sitesinden takip yapabilirsiniz."
        },
        {
          question: "Hangi kargo firması ile çalışıyorsunuz?",
          answer: "Yurtiçi Kargo ile çalışmaktayız. Siparişiniz Yurtiçi Kargo ile gönderilir."
        }
      ]
    },
    {
      category: "Ödeme ve Güvenlik",
      questions: [
        {
          question: "Hangi ödeme yöntemlerini kabul ediyorsunuz?",
          answer: "Visa, Mastercard, American Express, Troy, kredi kartı ve banka kartı ile güvenle ödeme yapabilirsiniz. Tüm ödemeleriniz SSL sertifikası ile korunmaktadır."
        },
        {
          question: "Ödeme bilgilerim güvende mi?",
          answer: "Ödeme bilgilerinizin güvenliği bizim için önceliklidir. Tüm işlemler 256-bit SSL şifreleme teknolojisiyle korunur ve üçüncü kişilerle paylaşılmaz. Kredi kartı bilgileriniz kesinlikle sistemimizde saklanmaz, yalnızca bankanız ve ödeme altyapısı üzerinden güvenli şekilde işlenir."
        },
        {
          question: "Esnaf vergi muafiyeti ile satış yapabilir miyim?",
          answer: "Esnaf vergi muafiyeti belgenizi Ad Soyadı/ VKN / TCKN / Ticari Unvanınızı da ekleyerek destek@trendruum.com adresine iletmeniz gerekmekte bu şekilde muafiyet belgesi ile satış yapabilirsiniz."
        }
      ]
    },
    {
      category: "İade ve Değişim",
      questions: [
        {
          question: "Ürün iade süresi ne kadar?",
          answer: "Ürünlerinizi teslim aldığınız tarihten itibaren 14 gün içerisinde iade edebilirsiniz."
        },
        {
          question: "Hangi ürünler iade edilemez?",
          answer: "Sağlık ve hijyen koşulları gereği kişisel bakım ürünleri, iç giyim, mayo, bikini, çorap ve benzeri ürünlerde iade veya değişim kabul edilmemektedir. Satın almadan önce ürün açıklamalarında belirtilen iade koşullarını dikkatle incelemenizi rica ederiz."
        }
      ]
    },
    {
      category: "Üyelik ve Hesap",
      questions: [
        {
          question: "Üye olmadan alışveriş yapabilir miyim?",
          answer: "Evet, misafir kullanıcı olarak da kolayca alışveriş yapabilirsiniz. Ancak siparişinizin size sorunsuz ve sağlıklı bir şekilde ulaştırılabilmesi için teslimat adresi ve iletişim bilgilerinizi eksiksiz girmeniz gerekmektedir. Bu bilgiler yalnızca siparişinizin kargolanması ve size ulaşabilmesi amacıyla kullanılmaktadır. Üye olarak alışveriş yapmayı tercih ettiğinizde ise siparişlerinizi daha kolay takip edebilir, adres ve iletişim bilgilerinizi tekrar tekrar girmek zorunda kalmaz, ayrıca kampanyalar ve avantajlardan da faydalanabilirsiniz."
        },
        {
          question: "Şifremi unuttum, ne yapmalıyım?",
          answer: "Şifrenizi unuttuysanız giriş sayfasındaki 'Şifremi Unuttum' linkine tıklayarak kayıtlı e-posta adresinize şifre sıfırlama bağlantısı gönderilebilir. Gelen e-postadaki yönlendirmeyi takip ederek yeni şifrenizi kolayca oluşturabilirsiniz. Ayrıca dilerseniz Trendruum Akademi sayfası üzerinden de şifre yenileme adımlarını takip edebilir, şifre oluşturma sürecinde detaylı yönergelerden yararlanabilirsiniz. Güvenliğiniz için yeni şifrenizin en az 8 karakterden oluşmasına, harf ve rakam kombinasyonu içermesine dikkat etmenizi öneririz."
        },
        {
          question: "Hesap bilgilerimi nasıl güncelleyebilirim?",
          answer: "Kişisel bilgilerinizi güncellemek için hesabınıza giriş yaptıktan sonra 'Hesabım > Kullanıcı Bilgilerim' bölümünü ziyaret edebilirsiniz. Buradan ad, soyad, iletişim bilgileri ve diğer kişisel verilerinizi güvenli bir şekilde değiştirebilir ya da güncelleyebilirsiniz. Yaptığınız değişiklikler anında hesabınıza yansıyacak olup, bilgileriniz yalnızca size daha iyi hizmet sunabilmemiz amacıyla kullanılmaktadır."
        }
      ]
    },
    {
      category: "Ürün ve Stok",
      questions: [
        {
          question: "Ürün stokta yoksa ne yapabilirim?",
          answer: "Stokta bulunmayan ürünler için ‘Stok Bildirimi’ talebi oluşturabilirsiniz. Talebiniz sonrasında ürün yeniden satışa sunulduğunda kayıtlı e-posta adresinize otomatik olarak bilgilendirme gönderilir."
        },
        {
          question: "Ürün fiyatları güncel mi?",
          answer: "Evet, tüm ürün fiyatları güncel tutulmaktadır. Fiyat değişiklikleri anında sisteme yansıtılır."
        }
      ]
    },
    {
      category: "Teknik Destek",
      questions: [
        {
          question: "Sitenizde sorun yaşıyorum, ne yapmalıyım?",
          answer: "Teknik sorunlar için destek@trendruum.com adresine e-posta gönderebilirsiniz."
        },
        {
          question: "Mobil uygulamanız var mı?",
          answer: "Evet, alışverişinizi daha hızlı ve kolay yapabilmeniz için iOS ve Android uyumlu mobil uygulamalarımız bulunmaktadır. Uygulamamızı App Store, Google Play ve Huawei AppGallery üzerinden ücretsiz olarak indirebilirsiniz. Mobil uygulamamız sayesinde kampanyaları anında takip edebilir, siparişlerinizi kolayca yönetebilir ve kişiselleştirilmiş bir alışveriş deneyimi yaşayabilirsiniz."
        }
      ]
    }
  ];

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
                  Sıkça Sorulan Sorular
                </h1>
                <p className="text-base md:text-lg lg:text-xl opacity-90">
                  Aradığınız cevapları burada bulabilirsiniz
                </p>
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
              <span>SSS</span>
            </div>
          </div>
        </div>


        {/* FAQ Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {faqData.map((category, categoryIndex) => (
              <div key={categoryIndex} className="mb-8 md:mb-12">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6 border-b-2 border-orange-500 pb-2">
                  {category.category}
                </h2>
                
                <div className="space-y-3 md:space-y-4">
                  {category.questions.map((item, questionIndex) => (
                    <div key={questionIndex} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                      <details className="group">
                        <summary className="flex justify-between items-center p-4 md:p-6 cursor-pointer hover:bg-gray-50 transition-colors">
                          <h3 className="text-base md:text-lg font-semibold text-gray-900 pr-4">
                            {item.question}
                          </h3>
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
                          <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                            {item.answer}
                          </p>
                        </div>
                      </details>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Contact Section */}
          <div className="max-w-4xl mx-auto mt-8 md:mt-12 bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8">
            <div className="text-center">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                Hala Sorunuz mu Var?
              </h2>
              <p className="text-sm md:text-base text-gray-600 mb-6">
                Aradığınız cevabı bulamadıysanız, bizimle iletişime geçebilirsiniz.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={() => router.push('/s/iletisim')}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  İletişime Geç
                </button>
                <button 
                  onClick={() => router.push('/s/yardim-merkezi')}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-900 px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Yardım Merkezi
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
