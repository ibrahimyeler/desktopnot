import React from 'react';

const SeoContentSection = () => {
  return (
    <section 
      className="w-full bg-white py-6 sm:py-8 md:py-10 lg:py-12"
      itemScope 
      itemType="https://schema.org/WebPage"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <article 
          className="max-w-none"
          itemScope 
          itemType="https://schema.org/Article"
        >
          {/* Ana Başlık */}
          <h1 
            className="text-lg font-bold text-gray-900 mb-4 text-center"
            itemProp="headline"
          >
            Tüm İhtiyaçlarınız İçin Tek İhtiyacınız Trendruum!
          </h1>

          {/* Giriş Paragrafı */}
          <div className="space-y-3 sm:space-y-4" itemProp="articleBody">
            <p className="text-xs text-gray-600 leading-relaxed font-light">
              Türkiye'nin önemli online alışveriş adreslerinden biri olan <strong itemProp="name">Trendruum</strong>, modayı ve ihtiyaçlarınızı herkes için ulaşılabilir kılmak amacıyla kuruldu. Giyimden aksesuara, ayakkabıdan kozmetiğe kadar pek çok ürünle beğeni kazanır. Platform, gelişen pazar hacminde büyük söz sahibi olur. Hem farklı zevklere hem de bütçelere hitap eder. Kolay ve güvenli bir alışveriş deneyimi sunar.
            </p>

            <p className="text-xs text-gray-600 leading-relaxed font-light">
              Üst ve alt giyim kategorilerinde çeşitli modeller hazırlanır. Bu koleksiyonlar uygun fiyat avantajıyla sunulur. Her mevsime uygun ürün seçenekleri bulunur. Kışlık seçimlerde kazak, mont, hırka, ceket gibi ürünler baskındır. Yaz kombinlerinde renkli ve sade tişört modelleri sıklıkla kullanılır. İnce kumaştan üretilen jeanlar ve kapriler de yine yaz ayları için ideal seçimler olarak değerlendirilir. Yaz tatili için de bikini takımlarından satın alabilirsiniz. Geniş beden aralığı sayesinde istediğiniz ürünü tercih edebilirsiniz.
            </p>
          </div>

          {/* Modern Tasarımlar Bölümü */}
          <h2 className="text-base font-bold text-gray-900 mt-6 sm:mt-8 mb-2">
            Modern Tasarımlarıyla Dikkat Çeken Trendruum Markaları
          </h2>

          <div className="space-y-3 sm:space-y-4">
            <p className="text-xs text-gray-600 leading-relaxed font-light">
              Kıyafet kombinleri seçilen ayakkabıyla tamamlanır. Günlük ayakkabı, spor ayakkabı, topuklu ayakkabı, sandalet, bot ve çizme olmak üzere geniş bir ürün skalası hazırlanır. Kıyafet tasarımları ise hedef kitlenin beklentilerine göre şekillendirilir. Elbiseden gömleğe, tunikten eşofman takımına kadar pek çok kategoride üretim yapılır. Sade, modern, kaliteli ve şık tasarımlar ilgiyle takip edilir. Sezonun trend renkleri ve modelleri hazırlanan kreasyonlarda hissedilir.
            </p>

            <p className="text-xs text-gray-600 leading-relaxed font-light">
              Üretici markalar çocuklar için farklı tasarımlara imza atarlar. Birbirinden rahat, renkli ve eğlenceli modeller hazırlanır. Kız ve erkek çocukları için farklı kategoriler bulunur. Mevcut çeşitlilik beklentilerin karşılanması noktasında önemlidir. Giyim markaları arasından kendiniz veya çocuğunuz için ideal ürünleri seçebilirsiniz.
            </p>
          </div>

          {/* Özel Gün İndirimleri Bölümü */}
          <h2 className="text-base font-bold text-gray-900 mt-6 sm:mt-8 mb-2">
            Trendruum Özel Gün İndirimleriyle Kaçırılmayacak Fırsatlar
          </h2>

          <div className="space-y-3 sm:space-y-4">
            <p className="text-xs text-gray-600 leading-relaxed font-light">
              Toplumdaki sosyal bilincin oluşmasına katkı sağlayan Trendruum, farklı kategorilerde faaliyet gösteren sivil toplum kuruluşlarına ait ürünlerin satışını yapar. Böylece yardım zinciri oluşturulur. Yapılan tüm alışverişlerde avantaj elde etmek için ise devreye Trendruum özel fırsatları girer. Özel hizmet ve ayrıcalıklar ilgi çekici bulunur.
            </p>

            <p className="text-xs text-gray-600 leading-relaxed font-light">
              Evden çıkmadan yapacağınız alışverişlerinizde Trendruum'un sunduğu hızlı teslimat seçeneklerinden yararlanabilirsiniz. Temel gıdadan atıştırmalıklara, sebzeden meyveye pek çok kategoride istediğiniz ürünleri bulabilirsiniz. Trendruum tarafından düzenlenen indirimler sayesinde alışveriş fırsatlarını değerlendirmek mümkündür.
            </p>
          </div>

          {/* Modaya Uygun Parçalar Bölümü */}
          <h2 className="text-base font-bold text-gray-900 mt-6 sm:mt-8 mb-2">
            Modaya Uygun Trend Parçalar
          </h2>

          <div className="space-y-3 sm:space-y-4">
            <p className="text-xs text-gray-600 leading-relaxed font-light">
              Ev yaşam ürünlerinde, giyimde, kozmetikte, elektronikte, oyuncu ekipmanlarında, pratik mutfak eşyalarında, bebek & çocuk ürünlerinde ve süpermarket kategorilerinde yapacağınız alışverişlerde uygun fiyat avantajından yararlanabilirsiniz. Belirli zamanlarda yapılan kampanyalar sayesinde sezonun moda kıyafetlerine ulaşabilir ve evinizin ihtiyaçlarını tamamlayabilirsiniz.
            </p>

            <p className="text-xs text-gray-600 leading-relaxed font-light">
              Yaz tatilinin bitmesiyle başlayan okul telaşı Trendruum ile sorun olmaktan çıkar. Okul öncesi, ilkokul, ortaokul, lise, üniversite olarak kategorilere ayrılan kırtasiye ürünleri ihtiyaçların karşılanması için listelenir. Aynı zamanda mevsim geçişlerinde yapılan alışverişler için de çeşitli fırsatlar oluşturulur. Mevcut fırsatlar sayesinde hazırlık yapabilir, eksiklerinizi tamamlayabilirsiniz. Yapılan indirimlerde yer alan ürün çeşitliliği oldukça fazladır.
            </p>
          </div>

          {/* Elektronik Eşyalar Bölümü */}
          <h2 className="text-base font-bold text-gray-900 mt-6 sm:mt-8 mb-2">
            Elektronik Eşyalarda Uygun Fiyatlar
          </h2>

          <div className="space-y-3 sm:space-y-4">
            <p className="text-xs text-gray-600 leading-relaxed font-light">
              Ayakkabı & Çanta ürünleri ile günlük kombinlere şıklık katmak mümkündür. Sneaker, casual, topuklu ayakkabı, bot, çizme, kol ve sırt çantası modelleri başta olmak üzere geniş bir tasarım yelpazesi oluşturulur. Spor & Outdoor kategorisinde yer alan parçalar da aynı şekilde sahip oldukları çeşitlilikle dikkat çekerler. Giyim eşyaları ve ekipmanlar farklı başlıklar altında gruplandırılır.
            </p>

            <p className="text-xs text-gray-600 leading-relaxed font-light">
              Yapılan gruplandırmada hedef kitlenin özellikleri belirleyici kriter olarak kabul edilir. İlgili kategoride farklı markaların ürünlerinin olması öncelikle seçim kolaylığı sağlar. Sonraki aşamada ise farklı bütçelere hitap edilmesini destekler. Karar aşamasında kişinin üründen ne beklediğini belirlemesi gerekir. Ayrıca kaliteli markaların tercih edilmesi, kullanım konforu açısından önemlidir. Üretim aşamasında seçilen malzemelerin, tasarım çizgilerinin ve işçiliğin göz önüne alınması tavsiye edilir. Nitelikli ürün seçimi sayesinde kullanım konforu yükselir. Hem kendiniz hem de sevdikleriniz için tercihinizi rahat, şık ve kaliteli modellerden yana kullanabilirsiniz.
            </p>
          </div>

          {/* Tüm İhtiyaçlar Bölümü */}
          <h2 className="text-base font-bold text-gray-900 mt-6 sm:mt-8 mb-2">
            Tüm İhtiyaçların Trendruum'da!
          </h2>

          <div className="space-y-3 sm:space-y-4">
            <p className="text-xs text-gray-600 leading-relaxed font-light">
              Ev & Mobilya kategorisinde yer alan ev tekstili, sofra & mutfak, aydınlatma, banyo, ev dekorasyon, mobilya, ev gereçleri, hobi, kırtasiye & ofis, yapı & market, oto & motosiklet ürünlerini indirim günlerinde yapılan kampanyalarla uygun fiyata satın alabilirsiniz. Bu kategori, yeni evlenecek çiftler ve evini yenilemek isteyenler için farklı markaları ve ürün çeşitlerini bir arada sunar. Bu sayede ihtiyaçlar kolay bir şekilde tamamlanır.
            </p>

            <p className="text-xs text-gray-600 leading-relaxed font-light">
              Elektronik kategori içerisinde ise beyaz eşya, küçük ev aletleri, TV & görüntü, ses, giyilebilir teknoloji, tablet & bilgisayar, elektronik aksesuarlar, kişisel bakım aletleri, oyunculara özel ürünler yer alır. İlgili başlık altında satılan akıllı cep telefonları da geniş model yelpazeleri ile ön plana çıkar. Model çeşitliliği fiyat noktasında da kendini gösterir. İndirim günlerini takip ederek yapılan ayrıcalıklardan yararlanabilirsiniz.
            </p>

            <p className="text-xs text-gray-600 leading-relaxed font-light">
              Kişisel bakımınızı da kozmetik kategorisinde yer alan makyaj, cilt bakımı, parfüm & deodorant, saç bakımı, epilasyon & tıraş ve genel bakım ürünleri sayesinde yerine getirebilirsiniz. Marka çeşitliliği bu kategori için de geçerlidir. Teknolojik ürünlerin haricinde hazırlanan Saat & Aksesuar grubu da ilgiyle takip edilir. Kadın, erkek ve çocuklar için üretilen birçok tasarım mevcuttur.
            </p>
          </div>

          {/* En Yeni Ürünler Bölümü */}
          <h2 className="text-base font-bold text-gray-900 mt-6 sm:mt-8 mb-2">
            En Yeni Ürünlerle İlginizi Çekebilecek Kategoriler
          </h2>

          <div className="space-y-3 sm:space-y-4">
            <p className="text-xs text-gray-600 leading-relaxed font-light">
              Trendruum'da geniş bir ürün yelpazesi bulunmaktadır. Elektronik kategorisinde öne çıkan ürünler arasında akıllı telefon modelleri yer almaktadır. iPhone serisi modelleri de dahil olmak üzere birçok marka ve model seçeneği mevcuttur. iPhone 15, iPhone 15 Pro, iPhone 15 Pro Max, iPhone 15 Plus, iPhone 16 Pro, iPhone 16 Pro Max, iPhone 14 Pro, iPhone 14 Plus, iPhone 14 Pro Max, iPhone 14, iPhone 17 Pro, iPhone 17 Pro Max, iPhone 17 Air, iPhone 17, iPhone 16, iPhone 16e gibi güncel modelleri Trendruum'da bulabilirsiniz.
            </p>

            <p className="text-xs text-gray-600 leading-relaxed font-light">
              Tüm bu ürünlerde uygun fiyat avantajları ve güvenli ödeme seçenekleri sunulmaktadır. Trendruum, müşteri memnuniyetini ön planda tutarak kaliteli hizmet sunmayı hedefler. Hızlı kargo ve güvenli alışveriş deneyimi için Trendruum'u tercih edebilirsiniz.
            </p>
          </div>
        </article>
      </div>
    </section>
  );
};

export default SeoContentSection;

