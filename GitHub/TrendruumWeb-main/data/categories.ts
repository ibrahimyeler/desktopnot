// Statik kategori verileri - API'den çekilen gerçek verilerle güncellendi

export interface Category {
  id: string;
  name: string;
  slug: string;
  children?: Category[];
}

export interface CategoryData {
  id: string;
  name: string;
  slug: string;
  children: Category[];
}

// Ana kategoriler ve alt kategorileri - API'den çekilen gerçek veriler
export const STATIC_CATEGORIES: { [key: string]: CategoryData } = {

  'elektronik': {
  id: '689f312ebc7c381f4a07f541',
  name: 'Elektronik',
  slug: 'elektronik',
  children: [
    {
        id: '689f312ebc7c381f4a07f542',
        name: 'Elektrikli Ev Aletleri',
        slug: 'elektrikli-ev-aletleri',
     

        children: [
          { 
            id: '689f312ebc7c381f4a07f543', 
            name: 'Dikiş Makinesi', 
            slug: 'dikis-makinesi',
            children: [
            ]
          },
         
          { 
            id: '689f312ebc7c324324544', 
            name: 'Kahve Makinesi', 
            slug: 'kahve-makinesi',
            children: [
              { id: '689f312ebc7c381f4a07f5b1', name: 'Kahve & Baharat Öğütücü', slug: 'kahve-baharat-ogutucu' },
              { id: '689f312e431212381f4a07f5b1', name: 'Elektronik Kahve Öğütücü', slug: 'elektronik-kahve-ogutucu' }


            ]
          },
          { 
            id: '689f312ebc7c381f4a07f5c1', 
            name: 'Kahve Makine Türleri', 
            slug: 'kahve-makine-turleri',
            children: [
            ]
          },

          { 
            id: '689f312ebc7c381f4a07f5d1', 
            name: 'Elektrikli Ev Aletleri Aksesuar', 
            slug: 'elektrikli-ev-aletleri-aksesuar',
            children: [
              { id: '689f312ebc7c381f4a07f5d2', name: 'Süpürge Aksesuarı', slug: 'supurge-aksesuari' },
              { id: '689f312ebc7c381f4a07f5d3', name: 'Dikiş Makinesi Aksesuarı', slug: 'dikis-makinesi-aksesuari' },
              { id: '689f312ebc7c381f4a07f5d4', name: 'Çay & Kahve Makinesi Aksesuar', slug: 'cay-kahve-makinesi-aksesuar' },
              { id: '689f312ebc7c381f4a07f5d5', name: 'Blender Yedek Parça', slug: 'blender-yedek-parca' },
              { id: '689f312ebc7c381f4a07f5d6', name: 'Ütü Yedek Parça', slug: 'utu-yedek-parca' }
            ]
          },
          { id: '68976ebc7c381f4a07f547', name: 'Yiyecek & İçecek Hazırlama', slug: 'yiyecek-icecek-hazirlama',
            children: [
              { id: '689f312ebc7c381f4a07f54f', name: 'Yiyecek Hazırlama', slug: 'yiyecek-hazirlama' },
              { id: '689f312ebc7c381f4a07f564', name: 'İçecek Hazırlama', slug: 'icecek-hazirlama' }
            ]
           },
          { id: '689f365ebc7c381f4a07f548', name: 'Süpürge & Ütü', slug: 'supurge-utu',
            children: [
              { id: '689f312ebc7c381f4a07f56d', name: 'Ütü', slug: 'utu' },
              { id: '689f312ebc7c381f4a07f571', name: 'Süpürge', slug: 'supurge' }
            ]
           }
        ],
    
      },
          {
        id: '689f312ebc7c381f4a07f577',
        name: 'Foto & Kamera',
        slug: 'foto-kamera',

        children: [
          { id: '689f312ebc7c381f4a07f578', name: 'Foto & Kamera Aksesuarı', slug: 'foto-kamera-aksesuari' },
          { id: '689f312ebc7c381f4a07f579', name: 'Dijital Kameralar', slug: 'dijital-kameralar',
            children: [
              { id: '689f312ebc7c381f4a07f57a', name: 'Video Kamera', slug: 'video-kamera' },
              { id: '689f312ebc7c381f4a07f57b', name: 'Aynasız Fotoğraf Makinesi', slug: 'aynasiz-fotograf-makinesi' },
              { id: '689f312ebc7c381f4a07f57c', name: 'Dijital Fotoğraf Makinesi', slug: 'dijital-fotograf-makinesi' },
              { id: '689f312ebc7c381f4a07f57d', name: 'DSLR Fotoğraf Makinesi', slug: 'dslr-fotograf-makinesi' }
            ]
           },
          { id: '689f312ebc7c381f4a07f57e', name: 'Fotoğraf Makinesi Aksesuarları', slug: 'fotograf-makinesi-aksesuarlari' }
        ],
      
      },
          {
        id: '689f312ebc7c381f4a07f57f',
        name: 'Oyun & Oyun Konsolları',
        slug: 'oyun-oyun-konsollari',
      
        children: [
          { id: '689f312ebc7c381f4a07f580', name: 'Konsol Aksesuarları', slug: 'konsol-aksesuarlari',
            children: [
              { id: '689f312ebc7c381f4a07f581', name: 'Konsol Gamepad ve Joystick', slug: 'konsol-gamepad-ve-joystick' },
              { id: '689f312ebc7c381f4a07f582', name: 'Mobil Oyun Aksesuarı', slug: 'mobil-oyun-aksesuari' }
            ]
           },
          { id: '689f312ebc7c381f4a07f583', name: 'Bilgisayar Oyunu', slug: 'bilgisayar-oyunu' },
          { id: '689f312ebc7c381f4a07f584', name: 'Diğer Oyun Konsolları', slug: 'diger-oyun-konsollari' },
          { id: '689f312ebc7c381f4a07f585', name: 'Playstation Konsolları', slug: 'playstation-konsollari',
            children: [
              { id: '689f312ebc7c381f4a07f586', name: 'Playstation 3', slug: 'playstation-3' },
              { id: '689f312ebc7c381f4a07f587', name: 'Playstation 4', slug: 'playstation-4' },
              { id: '689f312ebc7c381f4a07f588', name: 'Playstation 5', slug: 'playstation-5' },
              { id: '689f312ebc7c381f4a07f589', name: 'Playstation Aksesuarı', slug: 'playstation-aksesuari' }
            ]
           },
          { id: '689f312ebc7c381f4a07f58a', name: 'PSP & Vita Konsolu', slug: 'psp-vita-konsolu' },
          { id: '689f312ebc7c381f4a07f58b', name: 'Nintendo Oyunu', slug: 'nintendo-oyunu' },
          { id: '689f312ebc7c381f4a07f58c', name: 'Playstation Oyunları', slug: 'playstation-oyunlari',
            children: [
              { id: '689f312ebc7c381f4a07f58d', name: 'PS5 Oyunu', slug: 'ps5-oyunu' },
              { id: '689f312ebc7c381f4a07f58e', name: 'PS4 Oyunu', slug: 'ps4-oyunu' },
              { id: '689f312ebc7c381f4a07f58f', name: 'PS3 Oyunu', slug: 'ps3-oyunu' }, 
              { id: '689f312ebc7c381f4a07f590', name: 'PS2 Oyunları', slug: 'ps2-oyunlari' }
            ]
           },
          { id: '689f312fbc7c381f4a07f591', name: 'PSP & Vita Oyunu', slug: 'psp-vita-oyunu' },
          { id: '689f312fbc7c381f4a07f592', name: 'Xbox Oyunu', slug: 'xbox-oyunu' },
          { id: '689f312fbc7c381f4a07f593', name: 'Nintendo Konsolları ve Aksesuarları', slug: 'nintendo-konsollari-ve-aksesuarlari',
            children: [
              { id: '689f312fbc7c381f4a07f594', name: 'Nintendo Konsolu', slug: 'nintendo-konsolu' },
              { id: '689f312fbc7c381f4a07f595', name: 'Nintendo Aksesuarı', slug: 'nintendo-aksesuari' }
            ]
           },
          { id: '689f312fbc7c381f4a07f596', name: 'Xbox Konsolları ve Aksesuarları', slug: 'xbox-konsollari-ve-aksesuarlari' }
        ]
      },
      {
        id: '689f312fbc7c381f4a07f599',
        name: 'Beyaz Eşya & İklimlendirme',
        slug: 'beyaz-esya-iklimlendirme',
        children: [
          { id: '689f312fbc7c381f4a07f59a', name: 'İklimlendirme', slug: 'iklimlendirme',
            children: [
              { id: '689f312fbc7c381f4a07f59b', name: 'Hava Perdesi', slug: 'hava-perdesi' }
            ]
           },
          { id: '689f312fbc7c381f4a07f5aa', name: 'Beyaz Eşya Yedek Parça', slug: 'beyaz-esya-yedek-parca' },
          { id: '689f312fbc7c381f4a07f5ab', name: 'Beyaz Eşya', slug: 'beyaz-esya',
            children: [
              { id: '689f312fbc7c381f4a07f5ad', name: 'Aspiratör', slug: 'aspirator' },
              { id: '689f312fbc7c381f4a07f5ae', name: 'Bulaşık Makinesi', slug: 'bulasik-makinesi' },
              { id: '689f312fbc7c381f4a07f5af', name: 'Buzdolabı', slug: 'buzdolabi' },
              { id: '689f312fbc7c381f4a07f5b0', name: 'Çamaşır Makinesi', slug: 'camasir-makinesi' },
              { id: '689f312fbc7c381f4a07f5b1', name: 'Davlumbaz', slug: 'davlumbaz' },
              { id: '689f312fbc7c381f4a07f5b2', name: 'Derin Dondurucu', slug: 'derin-dondurucu' },
              { id: '689f312fbc7c381f4a07f5b3', name: 'Fırın', slug: 'firin' },
              { id: '689f312fbc7c381f4a07f5b4', name: 'Kurutma Makinesi', slug: 'kurutma-makinesi' },
              { id: '689f312fbc7c381f4a07f5b5', name: 'Ocak', slug: 'ocak' },
              { id: '689f312fbc7c381f4a07f5b6', name: 'Su Sebili', slug: 'su-sebili' },
              { id: '689f312fbc7c381f4a07f5b7', name: 'Mikrodalga Fırın', slug: 'mikrodalga-firin' },
              { id: '689f312fbc7c381f4a07f5b8', name: 'Mini & Midi Fırın', slug: 'mini-midi-firin' },
              { id: '689f312fbc7c381f4a07f5b9', name: 'Beyaz Eşya Set', slug: 'beyaz-esya-set' }
            ]
           }
        ],
   
      },
          {
        id: '689f312fbc7c381f4a07f5ba',
        name: 'Bilgisayar Grubu',
        slug: 'bilgisayar-grubu',
        children: [
          { id: '689f312fbc7c381f4a07f5bb', name: 'Yazıcı & Tarayıcı', slug: 'yazici-tarayici',
            children: [
              { id: '689f312fbc7c381f4a07f5bc', name: 'Yazıcılar', slug: 'yazicilar' },
              { id: '689f312fbc7c381f4a07f5c3', name: 'Tarayıcılar', slug: 'tarayicilar' }
            ]
           },
          { id: '689f312fbc7c381f4a07f5c6', name: 'Bileşenler', slug: 'bilesenler',
            children: [
              { id: '689f312fbc7c381f4a07f5c7', name: 'Bilgisayar Yedek Parça', slug: 'bilgisayar-yedek-parca' },
              { id: '689f312fbc7c381f4a07f5c8', name: 'Temel Bileşenler', slug: 'temel-bilesenler' },
              { id: '689f312fbc7c381f4a07f5d1', name: 'Yan Bileşenler', slug: 'yan-bilesenler' },
              { id: '689f312fbc7c381f4a07f5d8', name: 'Garanti ve Ek Hizmet Paketleri', slug: 'garanti-ve-ek-hizmet-paketleri' }
            ]
           },
          { id: '689f312fbc7c381f4a07f5d9', name: 'Bilgisayarlar', slug: 'bilgisayarlar' },
          { id: '689f312fbc7c381f4a07f5ea', name: 'Monitörler', slug: 'monitorler' }
        ]
      },
          {
        id: '689f312fbc7c381f4a07f5ed',
        name: 'Giyilebilir Teknoloji',
        slug: 'giyilebilir-teknoloji',
        children: [
          { id: '689f312fbc7c381f4a07f5ee', name: 'Kulaklıklar', slug: 'kulakliklar',
            children: [
              { id: '689f312fbc7c381f4a07f5ef', name: 'Kulak içi TWS Bluetooth Kulaklık', slug: 'kulak-ici-tws-bluetooth-kulaklik' },
              { id: '689f312fbc7c381f4a07f5f0', name: 'Kulak İçi Kablolu Kulaklık', slug: 'kulak-ici-kablolu-kulaklik' },
              { id: '689f312fbc7c381f4a07f5f1', name: 'Kulak Üstü Kablolu Kulaklık', slug: 'kulak-ustu-kablolu-kulaklik' },
              { id: '689f312fbc7c381f4a07f5f2', name: 'Kulak üstü Bluetooth Kulaklık', slug: 'kulak-ustu-bluetooth-kulaklik' },
              { id: '689f312fbc7c381f4a07f5f3', name: 'Boyun Bantlı Bluetooth kulaklık', slug: 'boyun-bantli-bluetooth-kulaklik' }
            ]
           },
          { id: '689f312fbc7c381f4a07f5f4', name: 'Akıllı Bileklik', slug: 'akilli-bileklik' },
          { id: '689f312fbc7c381f4a07f5f5', name: 'Akıllı Saat', slug: 'akilli-saat' },
          { id: '689f312fbc7c381f4a07f5f6', name: 'Sanal Gerçeklik Gözlüğü', slug: 'sanal-gerceklik-gozlugu' },
          { id: '689f312fbc7c381f4a07f5f7', name: 'Akıllı Çocuk Saati', slug: 'akilli-cocuk-saati' },
          { id: '689f312fbc7c381f4a07f5f8', name: 'Yenilenmiş Akıllı Saatler', slug: 'yenilenmis-akilli-saatler',
            children: [
              { id: '689f312fbc7c381f4a07f5f9', name: 'Yenilenmiş Akıllı Saat', slug: 'yenilenmis-akilli-saat' },
              { id: '689f312fbc7c381f4a07f5fa', name: 'Yenilenmiş Akıllı Çocuk Saati', slug: 'yenilenmis-akilli-cocuk-saati' }
            ]
           }
        ]
      },
          {
        id: '689f312fbc7c381f4a07f5fb',
        name: 'Kişisel Bakım Aletleri',
        slug: 'kisisel-bakim-aletleri',
        children: [
          { id: '689f312fbc7c381f4a07f5fc', name: 'Tıraş Makinesi', slug: 'tiras-makinesi' },
          { id: '689f312fbc7c381f4a07f5fd', name: 'Saç Kurutma Makinesi', slug: 'sac-kurutma-makinesi' },
          { id: '689f312fbc7c381f4a07f5fe', name: 'Saç Düzleştirici', slug: 'sac-duzlestirici' },
          { id: '689f312fbc7c381f4a07f5ff', name: 'Saç Maşası', slug: 'sac-masasi' },
          { id: '689f312fbc7c381f4a07f600', name: 'Epilatör', slug: 'epilator' },
          { id: '689f312fbc7c381f4a07f601', name: 'Tartı', slug: 'tarti' },
          { id: '689f312fbc7c381f4a07f602', name: 'IPL Lazer Epilasyon Aleti', slug: 'ipl-lazer-epilasyon-aleti' },
          { id: '689f312fbc7c381f4a07f603', name: 'Kişisel Bakım Yedek Parça', slug: 'kisisel-bakim-yedek-parca' }
        ]
      },
          {
        id: '689f312fbc7c381f4a07f604',
        name: 'Dijital Kod & Ürünler',
        slug: 'dijital-kod-urunler',
        children: [
          { id: '689f312fbc7c381f4a07f605', name: 'Dijital Kart & Kupon', slug: 'dijital-kart-kupon',
            children: [
              { id: '689f312fbc7c381f4a07f606', name: 'E-pin & Cüzdan Kodu', slug: 'E-pin & Cüzdan Kodu' },
              { id: '689f312fbc7c381f4a07f607', name: 'Hediye Kartı', slug: 'hediye-karti' },
              { id: '689f312fbc7c381f4a07f608', name: 'Dijital Ürünler', slug: 'dijital-urunler' },
              { id: '689f312fbc7c381f4a07f609', name: 'Hediye Çeki', slug: 'hediye-ceki' },
              { id: '689f312fbc7c381f4a07f60a', name: 'Yazılım ve Program', slug: 'yazilim-ve-program' },
              { id: '689f312fbc7c381f4a07f60b', name: 'Dijital Eğitim', slug: 'dijital-egitim' },
              { id: '689f312fbc7c381f4a07f60c', name: 'GSM Paket ve Tarifeler', slug: 'gsm-paket-ve-tarifeler' }
            ]
           },
          { id: '689f312fbc7c381f4a07f60f', name: 'Dijital Destek Kartı', slug: 'dijital-destek-karti' },
          { id: '689f312fbc7c381f4a07f610', name: 'Ön Ödemeli Kart', slug: 'on-odemeli-kart' },
          { id: '689f312fbc7c381f4a07f611', name: 'Hizmetler', slug: 'hizmetler',
            children: [
              { id: '689f312fbc7c381f4a07f612', name: 'Güzellik ve Sağlık', slug: 'Güzellik ve Sağlık' },
              { id: '689f312fbc7c381f4a07f613', name: 'Eğitim ve Kurs', slug: 'egitim-ve-kurs' },
              { id: '689f312fbc7c381f4a07f614', name: 'Araç Bakım ve Lastik', slug: 'arac-bakim-ve-lastik' },
              { id: '689f312fbc7c381f4a07f615', name: 'Asistans Hizmetleri', slug: 'asistans-hizmetleri' },
              { id: '689f312fbc7c381f4a07f616', name: 'Temizlik & Tadilat & Tamir', slug: 'temizlik-tadilat-tamir' }
            ]
           }
        ]
      },
          {
        id: '689f312fbc7c381f4a07f617',
        name: 'Elektronik Aksesuarlar',
        slug: 'elektronik-aksesuarlar',
        children: [
          { id: '689f312fbc7c381f4a07f618', name: 'TV & Görüntü & Ses Sistemleri', slug: 'tv-goruntu-ses-sistemleri',
            children: [
              { id: '689f312fbc7c381f4a07f619', name: 'Ev Sinema Sistemi', slug: 'ev-sinema-sistemi' },
              { id: '689f312fbc7c381f4a07f61a', name: 'Görüntü ve Ses Kabloları', slug: 'goruntu-ve-ses-kablolari' },
              { id: '689f312fbc7c381f4a07f620', name: 'TV Aksesuarları', slug: 'tv-aksesuarlari' },
              { id: '689f312fbc7c381f4a07f626', name: 'Uydu Alıcı', slug: 'uydu-alici' },
              { id: '689f312fbc7c381f4a07f627', name: 'Uydu Alıcı ve Aksesuarları', slug: 'uydu-alici-ve-aksesuarlari' },
              { id: '689f312fbc7c381f4a07f62f', name: 'Hoparlör Ayak & Askısı', slug: 'hoparlor-ayak-askisi' },
              { id: '689f312fbc7c381f4a07f630', name: 'Kablosuz Ses & Görüntü Aktarıcı', slug: 'kablosuz-ses-goruntu-aktarici' },
              { id: '689f312fbc7c381f4a07f631', name: 'Projeksiyon Cihazı ve Aksuarları', slug: 'projeksiyon-cihazi-ve-aksuarlari' },
              { id: '689f312fbc7c381f4a07f635', name: 'Ses Sistemleri', slug: 'ses-sistemleri' },
              { id: '689f312fbc7c381f4a07f63e', name: 'Uydu Alıcı Aksesuarları', slug: 'uydu-alici-aksesuarlari' }
            ]
           },
          { id: '689f312fbc7c381f4a07f63f', name: 'Cep Telefonu Aksesuarları', slug: 'cep-telefonu-aksesuarlari',
            children: [ 
              { id: '689f312fbc7c381f4a07f640', name: 'Kapak & Kılıf', slug: 'kapak-kilif' },
              { id: '689f312fbc7c381f4a07f641', name: 'Araç İçi Telefon Tutucu', slug: 'arac-ici-telefon-tutucu' },
              { id: '689f312fbc7c381f4a07f642', name: 'Cep Telefonu Yedek Parçaları', slug: 'cep-telefonu-yedek-parcalari' },
              { id: '689f312fbc7c381f4a07f643', name: 'Ekran Koruyucu Film', slug: 'ekran-koruyucu-film' },
              { id: '689f312fbc7c381f4a07f644', name: 'Selfie Çubuğu', slug: 'selfie-cubugu' },
              { id: '689f312fbc7c381f4a07f645', name: 'Kulaklık Kılıfı', slug: 'kulaklik-kilifi' },
              { id: '689f312fbc7c381f4a07f646', name: 'Güç Ürünleri', slug: 'guc-urunleri' },
              { id: '689f312fbc7c381f4a07f647', name: 'Akıllı Takip Cihazı', slug: 'akilli-takip-cihazi' },
              { id: '689f312fbc7c381f4a07f648', name: 'Şarj Cihazları', slug: 'sarj-cihazlari' },
              { id: '689f312fbc7c381f4a07f649', name: 'Şarj Kabloları', slug: 'sarj-kablolari' },
              { id: '689f312fbc7c381f4a07f64a', name: 'Kulaklık Aksesuarı', slug: 'kulaklik-aksesuari' },
              { id: '689f312fbc7c381f4a07f64b', name: 'Kamera Lens Koruyucu', slug: 'kamera-lens-koruyucu' }
            ]
           },
          { id: '689f312fbc7c381f4a07f658', name: 'Bilgisayar Aksesuarları', slug: 'bilgisayar-aksesuarlari' },
          { id: '689f312fbc7c381f4a07f699', name: 'Tablet Aksesuarları', slug: 'tablet-aksesuarlari' },
          { id: '689f312fbc7c381f4a07f69e', name: 'Giyilebilir Teknoloji Aksesuarları', slug: 'giyilebilir-teknoloji-aksesuarlari' }
        ]
      },
      {
        id: '3242423234234324',
        name: 'Tablet Grubu',
        slug: 'tablet-grubu',
        children: [
          { id: '689f312fbc7c381f4a07f618', name: 'TV & Görüntü & Ses Sistemleri', slug: 'tv-goruntu-ses-sistemleri' },
          { id: '689f312fbc7c381f4a07f63f', name: 'Cep Telefonu Aksesuarları', slug: 'cep-telefonu-aksesuarlari' },
          { id: '689f312fbc7c381f4a07f658', name: 'Bilgisayar Aksesuarları', slug: 'bilgisayar-aksesuarlari' },
          { id: '689f312fbc7c381f4a07f699', name: 'Tablet Aksesuarları', slug: 'tablet-aksesuarlari' },
          { id: '689f312fbc7c381f4a07f69e', name: 'Giyilebilir Teknoloji Aksesuarları', slug: 'giyilebilir-teknoloji-aksesuarlari' }
        ]
      },
      {
        id: '324324324123111',
        name: 'Telefon',
        slug: 'telefon',
        children: [
          { id: '689f312fbc7c381f4a07f618', name: 'TV & Görüntü & Ses Sistemleri', slug: 'tv-goruntu-ses-sistemleri' },
          { id: '689f312fbc7c381f4a07f63f', name: 'Cep Telefonu Aksesuarları', slug: 'cep-telefonu-aksesuarlari' },
          { id: '689f312fbc7c381f4a07f658', name: 'Bilgisayar Aksesuarları', slug: 'bilgisayar-aksesuarlari' },
          { id: '689f312fbc7c381f4a07f699', name: 'Tablet Aksesuarları', slug: 'tablet-aksesuarlari' },
          { id: '689f312fbc7c381f4a07f69e', name: 'Giyilebilir Teknoloji Aksesuarları', slug: 'giyilebilir-teknoloji-aksesuarlari' }
        ]
      },
      {
        id: '689f312fbc1231231rw2317',
        name: 'Akıllı Ev Aletleri',
        slug: 'akilli-ev-aletleri',
        children: [
          { id: '689f312fbc7c381f4a07f618', name: 'TV & Görüntü & Ses Sistemleri', slug: 'tv-goruntu-ses-sistemleri' },
          { id: '689f312fbc7c381f4a07f63f', name: 'Cep Telefonu Aksesuarları', slug: 'cep-telefonu-aksesuarlari' },
          { id: '689f312fbc7c381f4a07f658', name: 'Bilgisayar Aksesuarları', slug: 'bilgisayar-aksesuarlari' },
          { id: '689f312fbc7c381f4a07f699', name: 'Tablet Aksesuarları', slug: 'tablet-aksesuarlari' },
          { id: '689f312fbc7c381f4a07f69e', name: 'Giyilebilir Teknoloji Aksesuarları', slug: 'giyilebilir-teknoloji-aksesuarlari' }
        ]
      },
      {
        id: '689f312fbc7c381f4a07f6ba',
        name: 'Hoparlör & Projeksiyon Sistemleri',
        slug: 'hoparlor-projeksiyon-sistemleri',
        children: [
          { id: '689f312fbc7c381f4a07f618', name: 'TV & Görüntü & Ses Sistemleri', slug: 'tv-goruntu-ses-sistemleri' },
          { id: '689f312fbc7c381f4a07f63f', name: 'Cep Telefonu Aksesuarları', slug: 'cep-telefonu-aksesuarlari' },
          { id: '689f312fbc7c381f4a07f658', name: 'Bilgisayar Aksesuarları', slug: 'bilgisayar-aksesuarlari' },
          { id: '689f312fbc7c381f4a07f699', name: 'Tablet Aksesuarları', slug: 'tablet-aksesuarlari' },
          { id: '689f312fbc7c381f4a07f69e', name: 'Giyilebilir Teknoloji Aksesuarları', slug: 'giyilebilir-teknoloji-aksesuarlari' }
        ]
      }
        ]
},
  'ev-mobilya': {
    id: 'ev-mobilya',
    name: 'Ev & Mobilya',
    slug: 'ev-mobilya',
    children: [
        {
            id: '689f312fbc7c381f4a07f6c6',
            name: 'Mobilya',
            slug: 'mobilya',
            children: [
              { id: '689f3130bc7c381f4a07f6c7', name: 'Halı / Kilim', slug: 'hali-kilim' },
              { id: '689f3130bc7c381f4a07f6d0', name: 'Elektrik & Aydınlatma', slug: 'elektrik-aydinlatma' },
              { id: '689f3130bc7c381f4a07f6d6', name: 'Perde', slug: 'perde' },
              { id: '689f3130bc7c381f4a07f6dc', name: 'Ofis Mobilyaları', slug: 'ofis-mobilyalari' },
              { id: '689f3130bc7c381f4a07f6e8', name: 'Antre & Hol', slug: 'antre-hol' },
              { id: '689f3130bc7c381f4a07f6ef', name: 'Çalışma Odası', slug: 'calisma-odasi' },
              { id: '689f3130bc7c381f4a07f6f5', name: 'Bahçe Mobilyaları', slug: 'bahce-mobilyalari' },
              { id: '689f3130bc7c381f4a07f701', name: 'Salon & Oturma Odası', slug: 'salon-oturma-odasi' },
              { id: '689f3130bc7c381f4a07f712', name: 'Yatak Odası', slug: 'yatak-odasi' },
              { id: '689f3130bc7c381f4a07f71f', name: 'Yemek Odası', slug: 'yemek-odasi' },
              { id: '689f3130bc7c381f4a07f725', name: 'Mutfak & Banyo Mobilyası', slug: 'mutfak-banyo-mobilyasi' },
              { id: '689f3130bc7c381f4a07f734', name: 'Bebek & Çocuk Odası Mobilyası', slug: 'bebek-cocuk-odasi-mobilyasi' }
            ]
          },
          {
            id: '689f3130bc7c381f4a07f744',
            name: 'Ev',
            slug: 'ev',
            children: [
              { id: '689f3130bc7c381f4a07f745', name: 'Banyo', slug: 'banyo' },
              { id: '689f3130bc7c381f4a07f757', name: 'Ev Dekorasyon', slug: 'ev-dekorasyon' },
              { id: '689f3130bc7c381f4a07f77c', name: 'Ev Gereçleri', slug: 'ev-gerecleri' },
              { id: '689f3130bc7c381f4a07f795', name: 'Ev Tekstili', slug: 'ev-tekstili' },
              { id: '689f3131bc7c381f4a07f7ca', name: 'Sofra & Mutfak', slug: 'sofra-mutfak' }
            ]
          }
          
    ]
  },
  'giyim': {
    id: 'giyim',
    name: 'Giyim',
    slug: 'giyim?g=1',
    children: [
      {
        id: '689f3131bc7c381f4a07f81c',
        name: 'Abiye & Mezuniyet Elbisesi',
        slug: 'abiye-mezuniyet-elbisesi',
        children: []
      },
      {
        id: '689f3131bc7c381f4a07f81d',
        name: 'Gelinlik',
        slug: 'gelinlik',
        children: []
      },
      {
        id: '689f3131bc7c381f4a07f81e',
        name: 'İç Giyim',
        slug: 'ic-giyim',
        children: [
          { id: '689f3131bc7c381f4a07f81f', name: 'Çorap', slug: 'corap' },
          { id: '689f3131bc7c381f4a07f820', name: 'Babydoll', slug: 'babydoll' },
          { id: '689f3131bc7c381f4a07f821', name: 'Kombinezon', slug: 'kombinezon' },
          { id: '689f3131bc7c381f4a07f822', name: 'Jartiyer', slug: 'jartiyer' },
          { id: '689f3131bc7c381f4a07f823', name: 'Korse', slug: 'korse' },
          { id: '689f3131bc7c381f4a07f824', name: 'Sütyen', slug: 'sutyen' },
          { id: '689f3131bc7c381f4a07f825', name: 'Boxer', slug: 'boxer' },
          { id: '689f3131bc7c381f4a07f826', name: 'Slip', slug: 'slip' },
          { id: '689f3131bc7c381f4a07f827', name: 'String', slug: 'string' },
          { id: '689f3131bc7c381f4a07f828', name: 'İç Giyim Aksesuarı', slug: 'ic-giyim-aksesuari' },
          { id: '689f3131bc7c381f4a07f829', name: 'Atlet', slug: 'atlet' },
          { id: '689f3131bc7c381f4a07f82a', name: 'Külot', slug: 'kulot' },
          { id: '689f3131bc7c381f4a07f82b', name: 'Spor Sütyeni', slug: 'spor-sutyeni' },
          { id: '689f3131bc7c381f4a07f82c', name: 'Termal Giyim İçlik', slug: 'termal-giyim-iclik' },
          { id: '689f3131bc7c381f4a07f82d', name: 'Fanila', slug: 'fanila' },
          { id: '689f3131bc7c381f4a07f82e', name: 'İç Çamaşırı Takımı', slug: 'ic-camasiri-takimi' },
          { id: '689f3131bc7c381f4a07f82f', name: 'Diyabetik Çorap', slug: 'diyabetik-corap' }
        ]
      },
      {
        id: '689f3131bc7c381f4a07f830',
        name: 'Plaj Giyim',
        slug: 'plaj-giyim',
        children: [
          { id: '689f3131bc7c381f4a07f831', name: 'Bikini Altı', slug: 'bikini-alti' },
          { id: '689f3131bc7c381f4a07f832', name: 'Bikini Takımı', slug: 'bikini-takimi' },
          { id: '689f3131bc7c381f4a07f833', name: 'Bikini Üstü', slug: 'bikini-ustu' },
          { id: '689f3131bc7c381f4a07f834', name: 'Deniz Şortu', slug: 'deniz-sortu' },
          { id: '689f3131bc7c381f4a07f835', name: 'Mayo', slug: 'mayo' },
          { id: '689f3131bc7c381f4a07f836', name: 'Pareo', slug: 'pareo' },
          { id: '689f3131bc7c381f4a07f837', name: 'Tankini', slug: 'tankini' },
          { id: '689f3131bc7c381f4a07f838', name: 'Plaj Elbisesi', slug: 'plaj-elbisesi' },
          { id: '689f3131bc7c381f4a07f839', name: 'Mayokini', slug: 'mayokini' },
          { id: '689f3131bc7c381f4a07f83a', name: 'Slip Mayo', slug: 'slip-mayo' },
          { id: '689f3131bc7c381f4a07f83b', name: 'Plaj Havlusu', slug: 'plaj-havlusu' },
          { id: '689f3131bc7c381f4a07f83c', name: 'Plaj Giyim Seti', slug: 'plaj-giyim-seti' }
        ]
      },
      {
        id: '689f3131bc7c381f4a07f83d',
        name: 'Takımlar',
        slug: 'takimlar',
        children: [
          { id: '689f3131bc7c381f4a07f83e', name: 'Alt - Üst Takım', slug: 'alt-ust-takim' },

        ]
      },
      {
        id: '689f3131bc7c381f4a07f83f',
        name: 'Takım Elbise',
        slug: 'takim-elbise',
        children: []
      },
      {
        id: '689f3131bc7c381f4a07f840',
        name: 'Kimono & Kaftan',
        slug: 'kimono-kaftan',
        children: []
      },
      {
        id: '689f3131bc7c381f4a07f841',
        name: 'Bebek Giyim',
        slug: 'bebek-giyim',
        children: [
          { id: '689f3131bc7c381f4a07f842', name: 'Bebek Body & Zıbın', slug: 'bebek-body-zibin' },
          { id: '689f3131bc7c381f4a07f843', name: 'Bebek Takımı', slug: 'bebek-takimi' },
          { id: '689f3131bc7c381f4a07f844', name: 'Hastane Çıkışı', slug: 'hastane-cikisi' },
          { id: '689f3131bc7c381f4a07f845', name: 'Bebek Tulumu', slug: 'bebek-tulumu' },
          { id: '689f3131bc7c381f4a07f846', name: 'Muslin Bez', slug: 'muslin-bez' }
        ]
      },
      {
        id: '689f3131bc7c381f4a07f849',
        name: 'Elbise',
        slug: 'elbise',
        children: []
      },
      {
        id: '689f3131bc7c381f4a07f84a',
        name: 'Kostüm',
        slug: 'kostum',
        children: []
      },
      {
        id: '689f3131bc7c381f4a07f84b',
        name: 'Salopet & Tulum',
        slug: 'salopet-tulum',
        children: []
      },
      {
        id: '689f3131bc7c381f4a07f84e',
        name: 'Hamile Giyim',
        slug: 'hamile-giyim',
        children: [
       ]
      },
      {
        id: '689f3131bc7c381f4a07f882',
        name: 'Mezuniyet Elbisesi',
        slug: 'mezuniyet-elbisesi',
        children: []
      },
      {
        id: '689f3131bc7c381f4a07f883',
        name: 'Tesettür Giyim',
        slug: 'tesettur-giyim',
        children: []
      },
      {
        id: '689f3131bc7c381f4a07f8b1',
        name: 'Dış Giyim',
        slug: 'dis-giyim',
        children: []
      },
      {
        id: '689f3131bc7c381f4a07f8c0',
        name: 'Alt Giyim',
        slug: 'alt-giyim',
        children: []
      },
      {
        id: '689f3132bc7c381f4a07f8ca',
        name: 'Ev Giyim',
        slug: 'ev-giyim',
        children: []
      },
      {
        id: '689f3132bc7c381f4a07f8d1',
        name: 'Üst Giyim',
        slug: 'ust-giyim',
        children: []
      },
      {
        id: '689f3132bc7c381f4a07f8e0',
        name: 'Büyük Beden',
        slug: 'buyuk-beden',
        children: []
      },
      {
        id: '689f3132bc7c381f4a07f914',
        name: 'Fantezi Giyim',
        slug: 'fantezi-giyim',
        children: []
      },
      {
        id: '689f3132bc7c381f4a07f925',
        name: 'Spor Giyim',
        slug: 'spor-giyim',
        children: []
      },
      {
        id: '689f3132bc7c381f4a07f963',
        name: 'Spor Tulum',
        slug: 'spor-tulum',
        children: []
      },
      {
        id: '689f3132bc7c381f4a07f964',
        name: 'Smokin',
        slug: 'smokin',
        children: []
      }
    ]
  },
  

  'anne-bebek-cocuk': {
    id: 'anne-bebek-cocuk',
    name: 'Anne & Bebek & Çocuk',
    slug: 'anne-bebek-cocuk',
    children: [
        {
            id: '689f312dbc7c381f4a07f33d',
            name: 'Çocuk Gereçleri',
            slug: 'cocuk-gerecleri',
            children: [
              { id: '689f312dbc7c381f4a07f33e', name: 'Bebek Arabası & Puset', slug: 'bebek-arabasi-puset' },
              { id: '689f312dbc7c381f4a07f346', name: 'Ana Kucağı', slug: 'ana-kucagi' },
              { id: '689f312dbc7c381f4a07f347', name: 'Portbebe & Kanguru', slug: 'portbebe-kanguru' },
              { id: '689f312dbc7c381f4a07f348', name: 'Yürüteç', slug: 'yurutec' },
              { id: '689f312dbc7c381f4a07f349', name: 'Bebek & Çocuk Odası', slug: 'bebek-cocuk-odasi' },
              { id: '689f312dbc7c381f4a07f34b', name: 'Güvenlik', slug: 'guvenlik' },
              { id: '689f312dbc7c381f4a07f351', name: 'Bebek Salıncağı & Hoppala', slug: 'bebek-salincagi-hoppala' },
              { id: '689f312dbc7c381f4a07f352', name: 'Park Yatak & Oyun Parkı', slug: 'park-yatak-oyun-parki' },
              { id: '689f312dbc7c381f4a07f353', name: 'Bebek Bakım Çantası', slug: 'bebek-bakim-cantasi' },
              { id: '689f312dbc7c381f4a07f354', name: 'Mama Sandalyesi & Aksesuarları', slug: 'mama-sandalyesi-aksesuarlari' },
              { id: '689f312dbc7c381f4a07f357', name: 'Oto Koltuğu ve Aksesuarları', slug: 'oto-koltugu-ve-aksesuarlari' }
            ]
          },
          
          {
            id: '689f312dbc7c381f4a07f35b',
            name: 'Oyuncak',
            slug: 'oyuncak',
            children: [
              { id: '689f312dbc7c381f4a07f35c', name: 'Eğitici Oyuncak', slug: 'egitici-oyuncak' },
              { id: '689f312dbc7c381f4a07f35d', name: 'Peluş Oyuncak', slug: 'pelus-oyuncak' },
              { id: '689f312dbc7c381f4a07f35e', name: 'Akülü & Pedallı Araçlar', slug: 'akulu-pedalli-araclar' },
              { id: '689f312dbc7c381f4a07f362', name: 'Scooterlar', slug: 'scooterlar' },
              { id: '689f312dbc7c381f4a07f367', name: 'Bahçe Oyuncakları', slug: 'bahce-oyuncaklari' },
              { id: '689f312dbc7c381f4a07f368', name: 'Deniz & Plaj Malzemeleri', slug: 'deniz-plaj-malzemeleri' },
              { id: '689f312dbc7c381f4a07f36c', name: 'Lego & Yapı Oyuncakları', slug: 'lego-yapi-oyuncaklari' },
              { id: '689f312dbc7c381f4a07f36d', name: 'Oyuncak Bebek ve Aksesuarı', slug: 'oyuncak-bebek-ve-aksesuari' },
              { id: '689f312dbc7c381f4a07f36e', name: 'Çocuk Puzzle & Yapboz', slug: 'cocuk-puzzle-yapboz' },
              { id: '689f312dbc7c381f4a07f36f', name: 'Oyun Hamuru', slug: 'oyun-hamuru' },
              { id: '689f312dbc7c381f4a07f370', name: 'Bebek & Okul Öncesi Oyuncaklar', slug: 'bebek-okul-oncesi-oyuncaklar' },
              { id: '689f312dbc7c381f4a07f37c', name: 'Oyuncak Silah & Su Tabancası', slug: 'oyuncak-silah-su-tabancasi' },
              { id: '689f312dbc7c381f4a07f37d', name: 'Kutu Oyunu', slug: 'kutu-oyunu' },
              { id: '689f312dbc7c381f4a07f37e', name: 'Ahşap Oyuncak', slug: 'ahsap-oyuncak' },
              { id: '689f312dbc7c381f4a07f37f', name: 'Bahçe & Dış Mekan Oyuncakları', slug: 'bahce-dis-mekan-oyuncaklari' },
              { id: '689f312dbc7c381f4a07f386', name: 'Figür Oyuncaklar', slug: 'figur-oyuncaklar' },
              { id: '689f312dbc7c381f4a07f38b', name: 'Oyun Setleri', slug: 'oyun-setleri' },
              { id: '689f312dbc7c381f4a07f391', name: 'Oyuncak Araçlar', slug: 'oyuncak-araclar' },
              { id: '689f312dbc7c381f4a07f398', name: 'Oyuncak Bebek', slug: 'oyuncak-bebek' }
            ]
          },
          
      {
        id: '689f312dbc7c381f4a07f39c',
        name: 'Bebek Hediyelik',
        slug: 'bebek-hediyelik',
        children: [
            { id: '689f312dbc7c381f4a07f35c', name: 'Eğitici Oyuncak', slug: 'egitici-oyuncak' },
        ]
      },
      {
        id: '689f312dbc7c381f4a07f39d',
        name: 'Anne Bebek Ürünleri',
        slug: 'anne-bebek-urunleri',
        children: [
          { id: '689f312dbc7c381f4a07f39e', name: 'Bebek Banyo & Tuvalet', slug: 'bebek-banyo-tuvalet' },
          { id: '689f312dbc7c381f4a07f3a2', name: 'Bebek Beslenme Ürünleri', slug: 'bebek-beslenme-urunleri' },
          { id: '689f312dbc7c381f4a07f3ac', name: 'Emzirme Ürünleri', slug: 'emzirme-urunleri' }
        ]
      }
      
    ]
  },
  'kozmetik-kisisel-bakim': {
  id: '689f3135bc7c381f4a07fb33',
  name: 'Kozmetik & Kişisel Bakım',
  slug: 'kozmetik-kisisel-bakim',
  children: [
    {
        id: '689f3135bc7c381f4a07fb34',
        name: 'Makyaj',
        slug: 'makyaj',
        children: [
          { id: '689f3135bc7c381f4a07fb35', name: 'Dudak Makyajı', slug: 'dudak-makyaji' },
          { id: '689f3135bc7c381f4a07fb39', name: 'Göz Makyajı', slug: 'goz-makyaji' },
          { id: '689f3135bc7c381f4a07fb44', name: 'Makyaj Seti', slug: 'makyaj-seti' },
          { id: '689f3135bc7c381f4a07fb45', name: 'Ten Makyajı', slug: 'ten-makyaji' },
          { id: '689f3135bc7c381f4a07fb4f', name: 'Makyaj Paleti', slug: 'makyaj-paleti' },
          { id: '689f3135bc7c381f4a07fb50', name: 'Makyaj Aksesuarları', slug: 'makyaj-aksesuarlari' },
          { id: '689f3135bc7c381f4a07fb56', name: 'Tırnak', slug: 'tirnak' }
        ]
      },
      {
        id: '689f3135bc7c381f4a07fb5c',
        name: 'Ağız Bakım',
        slug: 'agiz-bakim',
        children: [
          { id: '689f3135bc7c381f4a07fb5d', name: 'Diş Fırçası', slug: 'dis-fircasi' },
          { id: '689f3135bc7c381f4a07fb61', name: 'Diş Macunu', slug: 'dis-macunu' },
          { id: '689f3135bc7c381f4a07fb62', name: 'Diş Beyazlatma Ürünü', slug: 'dis-beyazlatma-urunu' },
          { id: '689f3135bc7c381f4a07fb63', name: 'Diş İpi ve Kürdanı', slug: 'dis-ipi-ve-kurdani' },
          { id: '689f3135bc7c381f4a07fb64', name: 'Ağız Çalkalama Suyu', slug: 'agiz-calkalama-suyu' },
          { id: '689f3135bc7c381f4a07fb65', name: 'Diş Fırçası Yedek Başlığı', slug: 'dis-fircasi-yedek-basligi' },
          { id: '689f3135bc7c381f4a07fb66', name: 'Protez Diş Bakım', slug: 'protez-dis-bakim' },
          { id: '689f3135bc7c381f4a07fb67', name: 'Dil Temizleyici', slug: 'dil-temizleyici' }
        ]
      },
      {
        id: '689f3135bc7c381f4a07fb68',
        name: 'Cilt Bakım',
        slug: 'cilt-bakim',
        children: [
          { id: '689f3135bc7c381f4a07fb69', name: 'Dudak Kremi ve Peelingi', slug: 'dudak-kremi-ve-peelingi' },
          { id: '689f3135bc7c381f4a07fb6a', name: 'Göz Bakım', slug: 'goz-bakim' },
          { id: '689f3135bc7c381f4a07fb6f', name: 'Banyo & Duş Ürünleri', slug: 'banyo-dus-urunleri' },
          { id: '689f3135bc7c381f4a07fb71', name: 'Vücut Bakımı', slug: 'vucut-bakimi' },
          { id: '689f3135bc7c381f4a07fb78', name: 'Cilt Bakım Seti', slug: 'cilt-bakim-seti' },
          { id: '689f3135bc7c381f4a07fb79', name: 'Göz Kremi', slug: 'goz-kremi' },
          { id: '689f3135bc7c381f4a07fb7a', name: 'Cilt Bakım Aleti', slug: 'cilt-bakim-aleti' },
          { id: '689f3135bc7c381f4a07fb7b', name: 'Güneş Ürünü', slug: 'gunes-urunu' },
          { id: '689f3135bc7c381f4a07fb81', name: 'Banyo ve Duş Ürünleri', slug: 'banyo-ve-dus-urunleri' },
          { id: '689f3135bc7c381f4a07fb89', name: 'El ve Ayak Bakımı', slug: 'el-ve-ayak-bakimi' },
          { id: '689f3135bc7c381f4a07fb92', name: 'Yüz Bakım', slug: 'yuz-bakim' },
          { id: '689f3135bc7c381f4a07fba2', name: 'Cilt Bakım Yağları', slug: 'cilt-bakim-yaglari' }
        ]
      },
      {
        id: '689f3135bc7c381f4a07fba6',
        name: 'Kadın Hijyen',
        slug: 'kadin-hijyen',
        children: [
          { id: '689f3135bc7c381f4a07fba7', name: 'Hijyenik Ped', slug: 'hijyenik-ped' },
          { id: '689f3135bc7c381f4a07fba8', name: 'İntim Bakım Ürünü', slug: 'intim-bakim-urunu' },
          { id: '689f3135bc7c381f4a07fba9', name: 'Tampon', slug: 'tampon' },
          { id: '689f3135bc7c381f4a07fbaa', name: 'Günlük Ped', slug: 'gunluk-ped' },
          { id: '689f3135bc7c381f4a07fbab', name: 'Menstrual Kap', slug: 'menstrual-kap' }
        ]
      },
      {
        id: '689f3135bc7c381f4a07fbac',
        name: 'Saç Bakım',
        slug: 'sac-bakim',
        children: [
          { id: '689f3135bc7c381f4a07fbad', name: 'Saç Boyası', slug: 'sac-boyasi' },
          { id: '689f3135bc7c381f4a07fbae', name: 'Saç Serum ve Yağı', slug: 'sac-serum-ve-yagi' },
          { id: '689f3135bc7c381f4a07fbaf', name: 'Saç Bakım Seti', slug: 'sac-bakim-seti' },
          { id: '689f3135bc7c381f4a07fbb0', name: 'Saç Fırçası ve Tarak', slug: 'sac-fircasi-ve-tarak' },
          { id: '689f3135bc7c381f4a07fbb1', name: 'Saç Şekillendirici Ürünler', slug: 'sac-sekillendirici-urunler' },
          { id: '689f3135bc7c381f4a07fbb6', name: 'Şampuan', slug: 'sampuan' },
          { id: '689f3135bc7c381f4a07fbb7', name: 'Saç Kremi', slug: 'sac-kremi' },
          { id: '689f3135bc7c381f4a07fbb8', name: 'Boya Açıcı', slug: 'boya-acici' },
          { id: '689f3135bc7c381f4a07fbb9', name: 'Kuru Şampuan', slug: 'kuru-sampuan' },
          { id: '689f3135bc7c381f4a07fbba', name: 'Saç Maskesi', slug: 'sac-maskesi' },
          { id: '689f3135bc7c381f4a07fbbb', name: 'Saç Açıcı Sprey', slug: 'sac-acici-sprey' },
          { id: '689f3135bc7c381f4a07fbbc', name: 'Saç Kesim Makası', slug: 'sac-kesim-makasi' },
          { id: '689f3135bc7c381f4a07fbbd', name: 'Saç Toniği', slug: 'sac-tonigi' },
          { id: '689f3135bc7c381f4a07fbbe', name: 'Saç Vitamini', slug: 'sac-vitamini' },
          { id: '689f3135bc7c381f4a07fbbf', name: 'Saç Parfümü', slug: 'sac-parfumu' }
        ]
      },
      {
        id: '689f3135bc7c381f4a07fbc0',
        name: 'Parfüm ve Deodorant',
        slug: 'parfum-ve-deodorant',
        children: [
          { id: '689f3135bc7c381f4a07fbc1', name: 'Kolonya', slug: 'kolonya' },
          { id: '689f3135bc7c381f4a07fbc2', name: 'Parfüm', slug: 'parfum' },
          { id: '689f3135bc7c381f4a07fbc3', name: 'Parfüm Seti', slug: 'parfum-seti' },
          { id: '689f3135bc7c381f4a07fbc4', name: 'Vücut Spreyi', slug: 'vucut-spreyi' },
          { id: '689f3135bc7c381f4a07fbc5', name: 'Deodorant ve Roll On', slug: 'deodorant-ve-roll-on' },
          { id: '689f3135bc7c381f4a07fbc6', name: 'Parfüm Esansı', slug: 'parfum-esansi' }
        ]
      },
      {
        id: '689f3135bc7c381f4a07fbc7',
        name: 'Diğer Kişisel Bakım Ürünleri',
        slug: 'diger-kisisel-bakim-urunleri',
        children: [
          { id: '689f3135bc7c381f4a07fbc8', name: 'Pamuk & Disk', slug: 'pamuk-disk' }
        ]
      },
      {
        id: '689f3135bc7c381f4a07fbc9',
        name: 'Tıraş, Ağda ve Epilasyon',
        slug: 'tiras-agda-ve-epilasyon',
        children: [
          { id: '689f3135bc7c381f4a07fbca', name: 'Islak Tıraş', slug: 'islak-tiras' },
          { id: '689f3135bc7c381f4a07fbcf', name: 'Ağda & Tüy Dökücü', slug: 'agda-tuy-dokucu' },
          { id: '689f3135bc7c381f4a07fbd3', name: 'Cımbız', slug: 'cimbiz' },
          { id: '689f3135bc7c381f4a07fbd4', name: 'Kaş Makası', slug: 'kas-makasi' },
          { id: '689f3136bc7c381f4a07fbd5', name: 'Tüy Sarartıcı', slug: 'tuy-sarartici' },
          { id: '689f3136bc7c381f4a07fbd6', name: 'Tüy Azaltıcı', slug: 'tuy-azaltici' }
        ]
      }
        ]
},

  'spor-outdoor': {
    id: 'spor-outdoor',
    name: 'Spor & Outdoor',
    slug: 'spor-outdoor',
    children: [
        {
            id: '689f3137bc7c381f4a07fd6d',
            name: 'Ekipman & Aksesuar',
            slug: 'ekipman-aksesuar',
            children: [
              { id: '689f3137bc7c381f4a07fd6e', name: 'Boks Ekipmanı', slug: 'boks-ekipmani' },
              { id: '689f3137bc7c381f4a07fd6f', name: 'Fitness & Kondisyon', slug: 'fitness-kondisyon' },
              { id: '689f3137bc7c381f4a07fd70', name: 'Kayak & Snowboard', slug: 'kayak-snowboard' },
              { id: '689f3137bc7c381f4a07fd81', name: 'Top', slug: 'top' },
              { id: '689f3137bc7c381f4a07fd82', name: 'Fitness & Vücut Geliştirme', slug: 'fitness-vucut-gelistirme' },
              { id: '689f3138bc7c381f4a07fd9d', name: 'Bisiklet & Aksesuar', slug: 'bisiklet-aksesuar' },
              { id: '689f3138bc7c381f4a07fdb5', name: 'Dalış Ürünleri', slug: 'dalis-urunleri' },
              { id: '689f3138bc7c381f4a07fdcc', name: 'Kamp', slug: 'kamp' },
              { id: '689f3138bc7c381f4a07fdfa', name: 'Su Sporu', slug: 'su-sporu' },
              { id: '689f3138bc7c381f4a07fe0d', name: 'Tırmanış', slug: 'tirmanis' },
              { id: '689f3138bc7c381f4a07fe11', name: 'Av & Balıkçılık', slug: 'av-balikcilik' },
              { id: '689f3138bc7c381f4a07fe22', name: 'Okçuluk', slug: 'okculuk' },
              { id: '689f3138bc7c381f4a07fe23', name: 'Paintball', slug: 'paintball' },
              { id: '689f3138bc7c381f4a07fe24', name: 'Paten & Kaykay', slug: 'paten-kaykay' },
              { id: '689f3138bc7c381f4a07fe2c', name: 'Tenis', slug: 'tenis' },
              { id: '689f3138bc7c381f4a07fe37', name: 'Voleybol', slug: 'voleybol' },
              { id: '689f3138bc7c381f4a07fe3e', name: 'Koruyucu & Aksesuar', slug: 'koruyucu-aksesuar' },
              { id: '689f3139bc7c381f4a07fe44', name: 'Pilates & Yoga', slug: 'pilates-yoga' },
              { id: '689f3139bc7c381f4a07fe5c', name: 'Bilardo & Bilardo Malzemesi', slug: 'bilardo-bilardo-malzemesi' },
              { id: '689f3139bc7c381f4a07fe5d', name: 'Spor Bileklik', slug: 'spor-bileklik' },
              { id: '689f3139bc7c381f4a07fe5e', name: 'Sporcu Saç Bandı', slug: 'sporcu-sac-bandi' },
              { id: '689f3139bc7c381f4a07fe5f', name: 'Spor Kolluk', slug: 'spor-kolluk' },
              { id: '689f3139bc7c381f4a07fe60', name: 'Voleybol Dizlik', slug: 'voleybol-dizlik' },
              { id: '689f3139bc7c381f4a07fe61', name: 'Spor Matara', slug: 'spor-matara' },
              { id: '689f3139bc7c381f4a07fe62', name: 'Futbol', slug: 'futbol' },
              { id: '689f3139bc7c381f4a07fe6c', name: 'Basketbol', slug: 'basketbol' },
              { id: '689f3139bc7c381f4a07fe76', name: 'Atlama İpi', slug: 'atlama-ipi' },
              { id: '689f3139bc7c381f4a07fe77', name: 'Dart', slug: 'dart' },
              { id: '689f3139bc7c381f4a07fe7e', name: 'Badminton', slug: 'badminton' },
              { id: '689f3139bc7c381f4a07fe83', name: 'Top Çantası', slug: 'top-cantasi' },
              { id: '689f3139bc7c381f4a07fe84', name: 'Beyzbol', slug: 'beyzbol' },
              { id: '689f3139bc7c381f4a07fe89', name: 'Kronometre', slug: 'kronometre' },
              { id: '689f3139bc7c381f4a07fe8a', name: 'Skorbord', slug: 'skorbord' },
              { id: '689f3139bc7c381f4a07fe8b', name: 'Suluk', slug: 'suluk' },
              { id: '689f3139bc7c381f4a07fe8c', name: 'Düdük', slug: 'duduk' },
              { id: '689f3139bc7c381f4a07fe8d', name: 'Düdük İpi', slug: 'duduk-ipi' },
              { id: '689f3139bc7c381f4a07fe8e', name: 'Top Sepeti', slug: 'top-sepeti' },
              { id: '689f3139bc7c381f4a07fe8f', name: 'Top İğnesi', slug: 'top-ignesi' },
              { id: '689f3139bc7c381f4a07fe90', name: 'Top Filesi', slug: 'top-filesi' },
              { id: '689f3139bc7c381f4a07fe91', name: 'Sağlık Topu', slug: 'saglik-topu' },
              { id: '689f3139bc7c381f4a07fe92', name: 'Avcılık', slug: 'avcilik' },
              { id: '689f3139bc7c381f4a07fe95', name: 'Spor Dirseklik', slug: 'spor-dirseklik' },
              { id: '689f3139bc7c381f4a07fe96', name: 'Ayak Bilekliği', slug: 'ayak-bilekligi' },
              { id: '689f3139bc7c381f4a07fe97', name: 'Güreş', slug: 'gures' },
              { id: '689f3139bc7c381f4a07fe9a', name: 'Crossfit', slug: 'crossfit' },
              { id: '689f3139bc7c381f4a07fea3', name: 'Amerikan Futbolu', slug: 'amerikan-futbolu' },
              { id: '689f3139bc7c381f4a07fea8', name: 'Hokey', slug: 'hokey' },
              { id: '689f3139bc7c381f4a07feb0', name: 'Muay Thai', slug: 'muay-thai' },
              { id: '689f3139bc7c381f4a07feb3', name: 'Kasık Koruyucu', slug: 'kasik-koruyucu' },
              { id: '689f3139bc7c381f4a07feb4', name: 'Kaval Koruyucu', slug: 'kaval-koruyucu' },
              { id: '689f3139bc7c381f4a07feb5', name: 'Boks', slug: 'boks' },
              { id: '689f3139bc7c381f4a07fec8', name: 'Trambolin', slug: 'trambolin' },
              { id: '689f3139bc7c381f4a07fec9', name: 'El Bilek Ateli', slug: 'el-bilek-ateli' },
              { id: '689f3139bc7c381f4a07feca', name: 'Hulahop', slug: 'hulahop' },
              { id: '689f3139bc7c381f4a07fecb', name: 'Denge Tahtası', slug: 'denge-tahtasi' },
              { id: '689f3139bc7c381f4a07fecc', name: 'Bocce Seti', slug: 'bocce-seti' },
              { id: '689f3139bc7c381f4a07fecd', name: 'Badminton Filesi', slug: 'badminton-filesi' },
              { id: '689f3139bc7c381f4a07fece', name: 'Squash', slug: 'squash' },
              { id: '689f3139bc7c381f4a07fed2', name: 'Frizbi', slug: 'frizbi' },
              { id: '689f3139bc7c381f4a07fed3', name: 'Dövüş Sporları', slug: 'dovus-sporlari' },
              { id: '689f3139bc7c381f4a07fed9', name: 'Bowling', slug: 'bowling' },
              { id: '689f3139bc7c381f4a07fede', name: 'Langırt', slug: 'langirt' },
              { id: '689f3139bc7c381f4a07fedf', name: 'Golf Malzemeleri', slug: 'golf-malzemeleri' },
              { id: '689f3139bc7c381f4a07fee5', name: 'Stafet Çubuğu', slug: 'stafet-cubugu' },
              { id: '689f3139bc7c381f4a07fee6', name: 'Koşu Bandı Spreyi', slug: 'kosu-bandi-spreyi' },
              { id: '689f3139bc7c381f4a07fee7', name: 'Sporcu Bandı', slug: 'sporcu-bandi' },
              { id: '689f3139bc7c381f4a07fee8', name: 'Ayak Tenisi Masası', slug: 'ayak-tenisi-masasi' },
              { id: '689f3139bc7c381f4a07fee9', name: 'Deprem Çantası', slug: 'deprem-cantasi' },
              { id: '689f3139bc7c381f4a07feea', name: 'Okçuluk Sporu', slug: 'okculuk-sporu' },
              { id: '689f313abc7c381f4a07ff0e', name: 'Zıplayan Ayakkabı', slug: 'ziplayan-ayakkabi' },
              { id: '689f313abc7c381f4a07ff0f', name: 'Bale Barı', slug: 'bale-bari' },
              { id: '689f313abc7c381f4a07ff10', name: 'Ağırlık Çantası', slug: 'agirlik-cantasi' },
              { id: '689f313abc7c381f4a07ff11', name: 'Jimnastik', slug: 'jimnastik' },
              { id: '689f313abc7c381f4a07ff14', name: 'Hentbol', slug: 'hentbol' },
              { id: '689f313abc7c381f4a07ff16', name: 'Binicilik Ekipmanları', slug: 'binicilik-ekipmanlari' },
              { id: '689f313abc7c381f4a07ff1f', name: 'Tekne & Yat Ekipmanları', slug: 'tekne-yat-ekipmanlari' },
              { id: '689f313abc7c381f4a07ff2a', name: 'Elektrikli Scooter & Aksesuar', slug: 'elektrikli-scooter-aksesuar' },
              { id: '689f313abc7c381f4a07ff2e', name: 'Elektrikli Bisiklet & Aksesuar', slug: 'elektrikli-bisiklet-aksesuar' }
            ]
          },
          
          {
            id: '689f313abc7c381f4a07ff31',
            name: 'Acil Durum & Güvenlik Ekipman',
            slug: 'acil-durum-guvenlik-ekipman',
            children: [
              { id: '689f313abc7c381f4a07ff32', name: 'Yardım Düdüğü', slug: 'yardim-dudugu' },
              { id: '689f313abc7c381f4a07ff33', name: 'İlk Yardım Seti', slug: 'ilk-yardim-seti' },
              { id: '689f313abc7c381f4a07ff34', name: 'Güvenlik Kiti', slug: 'guvenlik-kiti' }
            ]
          }
          
    ]
  },
  'supermarket': {
  id: '689f313abc7c381f4a07ff35',
  name: 'Süpermarket',
  slug: 'supermarket',
  children: [
    {
        id: '689f313abc7c381f4a07ff36',
        name: 'Pet Shop',
        slug: 'pet-shop',
        children: [
          { id: '689f313abc7c381f4a07ff37', name: 'Kedi Ürünleri', slug: 'kedi-urunleri' },
          { id: '689f313abc7c381f4a07ff4f', name: 'Köpek Ürünleri', slug: 'kopek-urunleri' },
          { id: '689f313abc7c381f4a07ff64', name: 'Akvaryum Ürünleri', slug: 'akvaryum-urunleri' },
          { id: '689f313abc7c381f4a07ff70', name: 'Kuş Ürünleri', slug: 'kus-urunleri' },
          { id: '689f313abc7c381f4a07ff7e', name: 'Kemirgen Ürünleri', slug: 'kemirgen-urunleri' },
          { id: '689f313abc7c381f4a07ff82', name: 'Sürüngen Ürünleri', slug: 'surungen-urunleri' },
          { id: '689f313abc7c381f4a07ff8b', name: 'Evcil Hayvan Ürünleri', slug: 'evcil-hayvan-urunleri' },
          { id: '689f313abc7c381f4a07ff92', name: 'Çiftlik Hayvanı Ürünleri', slug: 'ciftlik-hayvani-urunleri' }
        ]
      },
      {
        id: '689f313abc7c381f4a07ff96',
        name: 'Ev Bakım ve Temizlik',
        slug: 'ev-bakim-ve-temizlik',
        children: [
          { id: '689f313abc7c381f4a07ff97', name: 'Kağıt Ürünleri', slug: 'kagit-urunleri' },
          { id: '689f313abc7c381f4a07ff9e', name: 'Bulaşık Yıkama', slug: 'bulasik-yikama' },
          { id: '689f313abc7c381f4a07ffa6', name: 'Çamaşır Yıkama', slug: 'camasir-yikama' },
          { id: '689f313bbc7c381f4a07ffb1', name: 'Ev ve Temizlik Gereçleri', slug: 'ev-ve-temizlik-gerecleri' },
          { id: '689f313bbc7c381f4a07ffc7', name: 'Ev Temizlik', slug: 'ev-temizlik' },
          { id: '689f313bbc7c381f4a07ffd5', name: 'Poşet', slug: 'poset' },
          { id: '689f313bbc7c381f4a07ffd6', name: 'Bez Poşet', slug: 'bez-poset' }
        ]
      },
          { id: '689f313bbc7c381f4a07ffd7', name: 'Ev Tüketim Malzemesi', slug: 'ev-tuketim-malzemesi', children: [] },
          {
            id: '689f313bbc7c381f4a07ffd8',
            name: 'Gıda & İçecek',
            slug: 'gida-icecek',
            children: [
              { id: '689f313bbc7c381f4a07ffd9', name: 'Gıda Paketleri', slug: 'gida-paketleri' },
              { id: '689f313bbc7c381f4a07ffdc', name: 'Atıştırmalık', slug: 'atistirmalik' },
              { id: '689f313bbc7c381f4a080009', name: 'Hazır Gıda', slug: 'hazir-gida' },
              { id: '689f313bbc7c381f4a080024', name: 'Manav', slug: 'manav' },
              { id: '689f313bbc7c381f4a080027', name: 'Çay', slug: 'cay' },
              { id: '689f313bbc7c381f4a080036', name: 'Gazlı İçecek', slug: 'gazli-icecek' },
              { id: '689f313bbc7c381f4a08003b', name: 'Kahve', slug: 'kahve' },
              { id: '689f313bbc7c381f4a080045', name: 'Özel Gıda Ürünü', slug: 'ozel-gida-urunu' },
              { id: '689f313bbc7c381f4a08004e', name: 'Kuru Gıda', slug: 'kuru-gida' },
              { id: '689f313cbc7c381f4a080098', name: 'Yağ ve Sos', slug: 'yag-ve-sos' },
              { id: '689f313cbc7c381f4a0800a3', name: 'Gazsız İçecek', slug: 'gazsiz-icecek' },
              { id: '689f313cbc7c381f4a0800b2', name: 'Et & Tavuk & Balık Ürünleri', slug: 'et-tavuk-balik-urunleri' },
              { id: '689f313cbc7c381f4a0800b6', name: 'Süt ve Kahvaltılık', slug: 'sut-ve-kahvaltilik' },
              { id: '689f313cbc7c381f4a0800da', name: 'Temel Gıda Kolisi', slug: 'temel-gida-kolisi' }
            ]
          },
          {
            id: '689f313cbc7c381f4a0800db',
            name: 'Sağlık',
            slug: 'saglik',
            children: [
              { id: '689f313cbc7c381f4a0800dc', name: 'Cinsel Sağlık', slug: 'cinsel-saglik' },
              { id: '689f313cbc7c381f4a0800f2', name: 'Sporcu Besini & Supplementler', slug: 'sporcu-besini-supplementler' },
              { id: '689f313cbc7c381f4a080100', name: 'Gıda Takviyesi ve Vitamin', slug: 'gida-takviyesi-ve-vitamin' },
              { id: '689f313cbc7c381f4a08010a', name: 'Genel Sağlık', slug: 'genel-saglik' },
              { id: '689f313dbc7c381f4a08012b', name: 'Hasta Bezi ve Temizlik', slug: 'hasta-bezi-ve-temizlik' },
              { id: '689f313dbc7c381f4a080133', name: 'Medikal Ekipman', slug: 'medikal-ekipman' },
              { id: '689f313dbc7c381f4a080151', name: 'Hasta Bakım ve Hareket Destek', slug: 'hasta-bakim-ve-hareket-destek' },
              { id: '689f313dbc7c381f4a08015c', name: 'Maske', slug: 'maske' },
              { id: '689f313dbc7c381f4a080162', name: 'Masaj Aleti', slug: 'masaj-aleti' }
            ]
          },
          {
            id: '689f313dbc7c381f4a08016a',
            name: 'Anne ve Bebek Bakım',
            slug: 'anne-ve-bebek-bakim',
            children: [
              { id: '689f313dbc7c381f4a08016b', name: 'Anne Bakım', slug: 'anne-bakim' },
              { id: '689f313dbc7c381f4a08016f', name: 'Bebek Bakım ve Kozmetik', slug: 'bebek-bakim-ve-kozmetik' },
              { id: '689f313dbc7c381f4a08017e', name: 'Bebek Sağlık Ürünleri', slug: 'bebek-saglik-urunleri' },
              { id: '689f313dbc7c381f4a080183', name: 'Bebek Beslenme ve Emzirme', slug: 'bebek-beslenme-ve-emzirme' },
              { id: '689f313dbc7c381f4a08018f', name: 'Bebek Temizlik', slug: 'bebek-temizlik' }
            ]
          }
            ]
},

'otomobil-motosiklet': {
  id: '689f3136bc7c381f4a07fbd7',
  name: 'Otomobil & Motosiklet',
  slug: 'otomobil-motosiklet',
  children: [
    {
        id: '689f3136bc7c381f4a07fbd8',
        name: 'Otomobil',
        slug: 'otomobil',
        children: [
          { id: '689f3136bc7c381f4a07fbd9', name: 'Araç Dış Aksesuar', slug: 'arac-dis-aksesuar' },
          { id: '689f3136bc7c381f4a07fbe2', name: 'Araç İçi Aksesuarı', slug: 'arac-ici-aksesuari' },
          { id: '689f3136bc7c381f4a07fbf5', name: 'Araç Güvenliği', slug: 'arac-guvenligi' },
          { id: '689f3136bc7c381f4a07fbf9', name: 'Diğer', slug: 'diger' },
          { id: '689f3136bc7c381f4a07fbfb', name: 'Kış Ürünleri', slug: 'kis-urunleri' },
          { id: '689f3136bc7c381f4a07fc04', name: 'Motor Bakım Ürünleri', slug: 'motor-bakim-urunleri' },
          { id: '689f3136bc7c381f4a07fc08', name: 'Oto Bagaj Ürünleri', slug: 'oto-bagaj-urunleri' },
          { id: '689f3136bc7c381f4a07fc0b', name: 'Oto Akü ve Aksesuarları', slug: 'oto-aku-ve-aksesuarlari' },
          { id: '689f3136bc7c381f4a07fc0f', name: 'Oto Bakım & Temizlik', slug: 'oto-bakim-temizlik' },
          { id: '689f3136bc7c381f4a07fc1d', name: 'Modifiye Ürünleri', slug: 'modifiye-urunleri' },
          { id: '689f3136bc7c381f4a07fc29', name: 'Elektrikli Araç Şarj Ekipmanları', slug: 'elektrikli-arac-sarj-ekipmanlari' }
        ]
      },
      {
        id: '689f3136bc7c381f4a07fc2c',
        name: 'Oto Ses Görüntü Sistemleri',
        slug: 'oto-ses-goruntu-sistemleri',
        children: [
          { id: '689f3136bc7c381f4a07fc2d', name: 'Araç İçi Kamera', slug: 'arac-ici-kamera' },
          { id: '689f3136bc7c381f4a07fc2e', name: 'Araç İçi Monitör', slug: 'arac-ici-monitor' },
          { id: '689f3136bc7c381f4a07fc2f', name: 'Araç Takip Sistemi', slug: 'arac-takip-sistemi' },
          { id: '689f3136bc7c381f4a07fc30', name: 'Arka Görüş Kamerası', slug: 'arka-gorus-kamerasi' },
          { id: '689f3136bc7c381f4a07fc31', name: 'Fm Transmitter Cihazı', slug: 'fm-transmitter-cihazi' },
          { id: '689f3136bc7c381f4a07fc32', name: 'Hazır Sistem', slug: 'hazir-sistem' },
          { id: '689f3136bc7c381f4a07fc33', name: 'Oto Hoparlör', slug: 'oto-hoparlor' },
          { id: '689f3136bc7c381f4a07fc34', name: 'Marine Ürünü', slug: 'marine-urunu' },
          { id: '689f3136bc7c381f4a07fc35', name: 'Oto Teyp', slug: 'oto-teyp' },
          { id: '689f3136bc7c381f4a07fc36', name: 'Teyp Çerçevesi', slug: 'teyp-cercevesi' },
          { id: '689f3136bc7c381f4a07fc37', name: 'USB - SD Çevirici Modül', slug: 'usb-sd-cevirici-modul' },
          { id: '689f3136bc7c381f4a07fc38', name: 'GPS & Navigasyon', slug: 'gps-navigasyon' },
          { id: '689f3136bc7c381f4a07fc39', name: 'Multimedya & Görüntü Sistemi', slug: 'multimedya-goruntu-sistemi' },
          { id: '689f3136bc7c381f4a07fc3a', name: 'Intercom', slug: 'intercom' },
          { id: '689f3136bc7c381f4a07fc3b', name: 'Oto Amfi', slug: 'oto-amfi' }
        ]
      },
      {
        id: '689f3136bc7c381f4a07fc3c',
        name: 'Motosiklet',
        slug: 'motosiklet',
        children: [
          { id: '689f3136bc7c381f4a07fc3d', name: 'Motosiklet Aksesuarları', slug: 'motosiklet-aksesuarlari' },
          { id: '689f3136bc7c381f4a07fc4e', name: 'Motosiklet Ekipmanları', slug: 'motosiklet-ekipmanlari' },
          { id: '689f3136bc7c381f4a07fc54', name: 'Motosiklet Koruma Ekipmanları', slug: 'motosiklet-koruma-ekipmanlari' },
          { id: '689f3136bc7c381f4a07fc5d', name: 'Motosiklet Yedek Parçalar', slug: 'motosiklet-yedek-parcalar' },
          { id: '689f3136bc7c381f4a07fc5e', name: 'Motosiklet Giyim', slug: 'motosiklet-giyim' },
          { id: '689f3136bc7c381f4a07fc69', name: 'Motosiklet Bakım', slug: 'motosiklet-bakim' },
          { id: '689f3136bc7c381f4a07fc6b', name: 'Motosiklet Yedek Parça', slug: 'motosiklet-yedek-parca' },
          { id: '689f3136bc7c381f4a07fc8d', name: 'Elektrikli Motosiklet', slug: 'elektrikli-motosiklet' },
          { id: '689f3136bc7c381f4a07fc8e', name: 'Benzinli Motosiklet', slug: 'benzinli-motosiklet' }
        ]
      },
      {
        id: '689f3136bc7c381f4a07fc8f',
        name: 'Otomobil Yedek Parça',
        slug: 'otomobil-yedek-parca',
        children: [
          { id: '689f3136bc7c381f4a07fc90', name: 'Ateşleme Sistemi', slug: 'atesleme-sistemi' },
          { id: '689f3136bc7c381f4a07fc99', name: 'Yürüyen Aksam & Direksiyon', slug: 'yuruyen-aksam-direksiyon' },
          { id: '689f3136bc7c381f4a07fcac', name: 'Kaporta', slug: 'kaporta' },
          { id: '689f3137bc7c381f4a07fccd', name: 'Filtre', slug: 'filtre' },
          { id: '689f3137bc7c381f4a07fcd4', name: 'Elektrik Aksam', slug: 'elektrik-aksam' },
          { id: '689f3137bc7c381f4a07fcff', name: 'Fren & Debriyaj', slug: 'fren-debriyaj' },
          { id: '689f3137bc7c381f4a07fd0a', name: 'Mekanik Aksam', slug: 'mekanik-aksam' },
          { id: '689f3137bc7c381f4a07fd2f', name: 'Motor Aksamı', slug: 'motor-aksami' },
          { id: '689f3137bc7c381f4a07fd5d', name: 'Otomobil Ayna', slug: 'otomobil-ayna' },
          { id: '689f3137bc7c381f4a07fd60', name: 'LPG Ekipmanları', slug: 'lpg-ekipmanlari' }
        ]
      },
      {
        id: '689f3137bc7c381f4a07fd65',
        name: 'Lastik & Jant',
        slug: 'lastik-jant',
        children: [
          { id: '689f3137bc7c381f4a07fd66', name: 'Lastik', slug: 'lastik' },
          { id: '689f3137bc7c381f4a07fd67', name: 'Lastik Bakım Ürünü', slug: 'lastik-bakim-urunu' },
          { id: '689f3137bc7c381f4a07fd68', name: 'Motosiklet Lastikleri', slug: 'motosiklet-lastikleri' },
          { id: '689f3137bc7c381f4a07fd69', name: 'Jant Kapağı', slug: 'jant-kapagi' },
          { id: '689f3137bc7c381f4a07fd6a', name: 'Jant', slug: 'jant' },
          { id: '689f3137bc7c381f4a07fd6b', name: 'Araç Kompresörü', slug: 'arac-kompresoru' }
        ]
      }
        ]
},

  'aksesuar': {
  id: '689f312cbc7c381f4a07f2a2',
  name: 'Aksesuar',
  slug: 'aksesuar',
  children: [
    { id: '689f312cbc7c381f4a07f2a3', name: 'Saat', slug: 'saat', children: [] },
    { id: '689f312cbc7c381f4a07f2a4', name: 'Şapka', slug: 'sapka', children: [] },
    {
        id: '689f312cbc7c381f4a07f2a5',
        name: 'Takı & Mücevher',
        slug: 'taki-mucevher',
        children: [
          { id: '689f312cbc7c381f4a07f2a6', name: 'Bileklik', slug: 'bileklik' },
          { id: '689f312cbc7c381f4a07f2b0', name: 'Kolye', slug: 'kolye' },
          { id: '689f312cbc7c381f4a07f2bb', name: 'Küpe', slug: 'kupe' },
          { id: '689f312cbc7c381f4a07f2c5', name: 'Yüzük', slug: 'yuzuk' },
          { id: '689f312cbc7c381f4a07f2d2', name: 'Şahmeran', slug: 'sahmeran' },
          { id: '689f312cbc7c381f4a07f2d6', name: 'Halhal & Ayak Aksesuarları', slug: 'halhal-ayak-aksesuarlari' },
          { id: '689f312cbc7c381f4a07f2db', name: 'Vücut Aksesuarı', slug: 'vucut-aksesuari' },
          { id: '689f312cbc7c381f4a07f2dc', name: 'Choker', slug: 'choker' },
          { id: '689f312cbc7c381f4a07f2dd', name: 'Set & Takım', slug: 'set-takim' },
          { id: '689f312cbc7c381f4a07f2e6', name: 'Bilezik', slug: 'bilezik' },
          { id: '689f312cbc7c381f4a07f2e7', name: 'Hızma', slug: 'hizma' },
          { id: '689f312cbc7c381f4a07f2e8', name: 'Piercing', slug: 'piercing' },
          { id: '689f312cbc7c381f4a07f2e9', name: 'Kıkırdak Küpe', slug: 'kikirdak-kupe' },
          { id: '689f312cbc7c381f4a07f2ee', name: 'İnci Set', slug: 'inci-set' },
          { id: '689f312cbc7c381f4a07f2ef', name: 'Charm', slug: 'charm' },
          { id: '689f312cbc7c381f4a07f2f0', name: 'Charm Taşıyıcı', slug: 'charm-tasiyici' },
          { id: '689f312cbc7c381f4a07f2f1', name: 'Kolye Ucu', slug: 'kolye-ucu' }
        ]
      },
      {
        id: '689f312cbc7c381f4a07f2f2',
        name: 'Çanta',
        slug: 'canta',
        children: [
          { id: '689f312cbc7c381f4a07f2f3', name: 'Abiye Çanta', slug: 'abiye-canta' },
          { id: '689f312cbc7c381f4a07f2f4', name: 'Laptop & Evrak Çantası', slug: 'laptop-evrak-cantasi' },
          { id: '689f312cbc7c381f4a07f2f5', name: 'Portföy & Clutch Çanta', slug: 'portfoy-clutch-canta' },
          { id: '689f312cbc7c381f4a07f2f6', name: 'Postacı Çantası', slug: 'postaci-cantasi' },
          { id: '689f312cbc7c381f4a07f2f7', name: 'Sırt Çantası', slug: 'sirt-cantasi' },
          { id: '689f312cbc7c381f4a07f2f8', name: 'Spor Çantası', slug: 'spor-cantasi' },
          { id: '689f312cbc7c381f4a07f2f9', name: 'Valiz & Bavul', slug: 'valiz-bavul' },
          { id: '689f312cbc7c381f4a07f2fa', name: 'Plaj Çantası', slug: 'plaj-cantasi' },
          { id: '689f312cbc7c381f4a07f2fb', name: 'Omuz Çantası', slug: 'omuz-cantasi' },
          { id: '689f312cbc7c381f4a07f2fc', name: 'Beslenme Çantası', slug: 'beslenme-cantasi' },
          { id: '689f312cbc7c381f4a07f2fd', name: 'Okul Çantası', slug: 'okul-cantasi' },
          { id: '689f312cbc7c381f4a07f2fe', name: 'Bel Çantası', slug: 'bel-cantasi' },
          { id: '689f312cbc7c381f4a07f2ff', name: 'Cüzdan', slug: 'cuzdan' },
          { id: '689f312cbc7c381f4a07f300', name: 'Kartlık', slug: 'kartlik' },
          { id: '689f312cbc7c381f4a07f301', name: 'Çanta Aksesuarı', slug: 'canta-aksesuari' },
          { id: '689f312cbc7c381f4a07f302', name: 'El Çantası', slug: 'el-cantasi' },
          { id: '689f312cbc7c381f4a07f303', name: 'Valiz Kılıfı', slug: 'valiz-kilifi' }
        ]
      },
      {
        id: '689f312cbc7c381f4a07f304',
        name: 'Atkı & Bere & Eldiven',
        slug: 'atki-bere-eldiven',
        children: [
          { id: '689f312cbc7c381f4a07f305', name: 'Atkı', slug: 'atki' },
          { id: '689f312cbc7c381f4a07f306', name: 'Bere', slug: 'bere' },
          { id: '689f312cbc7c381f4a07f307', name: 'Eldiven', slug: 'eldiven' },
          { id: '689f312cbc7c381f4a07f308', name: 'Boyunluk', slug: 'boyunluk' },
          { id: '689f312cbc7c381f4a07f309', name: 'Atkı & Bere & Eldiven Set', slug: 'atki-bere-eldiven-set' },
          { id: '689f312cbc7c381f4a07f30a', name: 'Atkı & Bere Set', slug: 'atki-bere-set' }
        ]
      },
      {
        id: '689f312cbc7c381f4a07f30b',
        name: 'Kemer & Pantolon Askısı',
        slug: 'kemer-pantolon-askisi',
        children: [
          { id: '689f312cbc7c381f4a07f30c', name: 'Kemer', slug: 'kemer' },
          { id: '689f312cbc7c381f4a07f30d', name: 'Pantolon Askısı', slug: 'pantolon-askisi' }
        ]
      },
      {
        id: '689f312cbc7c381f4a07f30e',
        name: 'Kravat & Kol Düğmesi',
        slug: 'kravat-kol-dugmesi',
        children: [
          { id: '689f312cbc7c381f4a07f30f', name: 'Kol Düğmesi', slug: 'kol-dugmesi' },
          { id: '689f312cbc7c381f4a07f310', name: 'Mendil', slug: 'mendil' },
          { id: '689f312cbc7c381f4a07f311', name: 'Papyon', slug: 'papyon' },
          { id: '689f312cbc7c381f4a07f312', name: 'Kravat', slug: 'kravat' }
        ]
      },
      {
        id: '689f312dbc7c381f4a07f313',
        name: 'Altın',
        slug: 'altin',
        children: [
          { id: '689f312dbc7c381f4a07f314', name: 'Tam Altın', slug: 'tam-altin' },
          { id: '689f312dbc7c381f4a07f315', name: 'Yarım Altın', slug: 'yarim-altin' },
          { id: '689f312dbc7c381f4a07f316', name: 'Çeyrek Altın', slug: 'ceyrek-altin' },
          { id: '689f312dbc7c381f4a07f317', name: 'Gram Altın', slug: 'gram-altin' },
          { id: '689f312dbc7c381f4a07f318', name: 'Cumhuriyet Altını', slug: 'cumhuriyet-altini' },
          { id: '689f312dbc7c381f4a07f319', name: 'Reşat Altın', slug: 'resat-altin' },
          { id: '689f312dbc7c381f4a07f31a', name: 'Ata Altın', slug: 'ata-altin' },
          { id: '689f312dbc7c381f4a07f31b', name: 'Yatırımlık Altın Bilezik', slug: 'yatirimlik-altin-bilezik' },
          { id: '689f312dbc7c381f4a07f31c', name: 'Gram Gümüş', slug: 'gram-gumus' },
          { id: '689f312dbc7c381f4a07f31d', name: 'Sarrafiyeli Takı', slug: 'sarrafiyeli-taki' }
        ]
      },
      {
        id: '689f312dbc7c381f4a07f31e',
        name: 'Diğer Aksesuar',
        slug: 'diger-aksesuar',
        children: [
          { id: '689f312dbc7c381f4a07f31f', name: 'Diğer Aksesuarlar', slug: 'diger-aksesuarlar' },
          { id: '689f312dbc7c381f4a07f320', name: 'Şemsiye', slug: 'semsiye' },
          { id: '689f312dbc7c381f4a07f321', name: 'Gelin Aksesuarı', slug: 'gelin-aksesuari' },
          { id: '689f312dbc7c381f4a07f322', name: 'Tesbih', slug: 'tesbih' },
          { id: '689f312dbc7c381f4a07f323', name: 'Anahtarlık', slug: 'anahtarlik' },
          { id: '689f312dbc7c381f4a07f324', name: 'Geçici Dövme', slug: 'gecici-dovme' },
          { id: '689f312dbc7c381f4a07f325', name: 'Broş', slug: 'bros' },
          { id: '689f312dbc7c381f4a07f326', name: 'Yaka İğnesi', slug: 'yaka-ignesi' },
          { id: '689f312dbc7c381f4a07f327', name: 'Peruk', slug: 'peruk' },
          { id: '689f312dbc7c381f4a07f328', name: 'Rozet', slug: 'rozet' },
          { id: '689f312dbc7c381f4a07f329', name: 'Saat Kordonu', slug: 'saat-kordonu' }
        ]
      },
      {
        id: '689f312dbc7c381f4a07f32a',
        name: 'Şal & Fular',
        slug: 'sal-fular',
        children: [
          { id: '689f312dbc7c381f4a07f32b', name: 'Fular', slug: 'fular' },
          { id: '689f312dbc7c381f4a07f32c', name: 'Şal', slug: 'sal' }
        ]
      },
      {
        id: '689f312dbc7c381f4a07f32d',
        name: 'Gözlük',
        slug: 'gozluk',
        children: [
          { id: '689f312dbc7c381f4a07f32e', name: 'Güneş Gözlüğü', slug: 'gunes-gozlugu' },
          { id: '689f312dbc7c381f4a07f32f', name: 'Gözlük Kabı', slug: 'gozluk-kabi' },
          { id: '689f312dbc7c381f4a07f330', name: 'Gözlük Aksesuarı', slug: 'gozluk-aksesuari' },
          { id: '689f312dbc7c381f4a07f331', name: 'Mavi Işık Korumalı Gözlük', slug: 'mavi-isik-korumali-gozluk' },
          { id: '689f312dbc7c381f4a07f332', name: 'Gözlük Çerçevesi', slug: 'gozluk-cercevesi' }
        ]
      },
      {
        id: '689f312dbc7c381f4a07f333',
        name: 'Saç Aksesuarı',
        slug: 'sac-aksesuari',
        children: [
          { id: '689f312dbc7c381f4a07f334', name: 'Diğer Saç Aksesuarları', slug: 'diger-sac-aksesuarlari' },
          { id: '689f312dbc7c381f4a07f335', name: 'Bandana', slug: 'bandana' },
          { id: '689f312dbc7c381f4a07f336', name: 'Taç', slug: 'tac' },
          { id: '689f312dbc7c381f4a07f337', name: 'Toka', slug: 'toka' },
          { id: '689f312dbc7c381f4a07f338', name: 'Saç Bandı', slug: 'sac-bandi' }
        ]
      },
          { id: '689f312dbc7c381f4a07f339', name: 'Aksesuar Set', slug: 'aksesuar-set', children: [] },
    { id: '689f312dbc7c381f4a07f33a', name: 'Saat Seti', slug: 'saat-seti', children: [] },
    { id: '689f312dbc7c381f4a07f33b', name: 'Gavroş', slug: 'gavros', children: [] }
  ]
},

//  'ayakkabi': {
//   id: '689f312dbc7c381f4a07f3b1',
//   name: 'Ayakkabı',
//   slug: 'ayakkabi',
//   children: [
//     {
//         id: '689f312dbc7c381f4a07f3b2',
//         name: 'Bot & Çizme',
//         slug: 'bot-cizme',
//         children: [
//           { id: '689f312dbc7c381f4a07f3b3', name: 'Bot & Bootie', slug: 'bot-bootie' },
//           { id: '689f312dbc7c381f4a07f3b4', name: 'Çizme', slug: 'cizme' },
//           { id: '689f312dbc7c381f4a07f3b5', name: 'Kar Botu', slug: 'kar-botu' }
//         ]
//       },
      
//       { 
//         id: '689f312dbc7c381f4a07f3b6',
//         name: 'Sandalet ve Terlik',
//         slug: 'sandalet-ve-terlik',
//         children: [
//           { id: '689f312dbc7c381f4a07f3b7', name: 'Sandalet', slug: 'sandalet' },
//           { id: '689f312dbc7c381f4a07f3b8', name: 'Terlik', slug: 'terlik' },
//           { id: '689f312dbc7c381f4a07f3b9', name: 'Deniz Ayakkabısı', slug: 'deniz-ayakkabisi' },
//           { id: '689f312dbc7c381f4a07f3ba', name: 'Spor Sandalet', slug: 'spor-sandalet' },
//           { id: '689f312dbc7c381f4a07f3bb', name: 'Spor Terlik', slug: 'spor-terlik' }
//         ]
//       },
//       {
//         id: '689f312dbc7c381f4a07f3bc',
//         name: 'Spor Ayakkabı',
//         slug: 'spor-ayakkabi',
//         children: [
//           { id: '689f312dbc7c381f4a07f3bd', name: 'Basketbol Ayakkabısı', slug: 'basketbol-ayakkabisi' },
//           { id: '689f312dbc7c381f4a07f3be', name: 'Fitness & Antreman Ayakkabısı', slug: 'fitness-antreman-ayakkabisi' },
//           { id: '689f312dbc7c381f4a07f3bf', name: 'Koşu Ayakkabısı', slug: 'kosu-ayakkabisi' },
//           { id: '689f312dbc7c381f4a07f3c0', name: 'Halı Saha Ayakkabısı', slug: 'hali-saha-ayakkabisi' },
//           { id: '689f312dbc7c381f4a07f3c1', name: 'Outdoor Ayakkabı', slug: 'outdoor-ayakkabi' },
//           { id: '689f312dbc7c381f4a07f3c2', name: 'Tenis Ayakkabısı', slug: 'tenis-ayakkabisi' },
//           { id: '689f312dbc7c381f4a07f3c3', name: 'Yürüyüş Ayakkabısı', slug: 'yuruyus-ayakkabisi' },
//           { id: '689f312dbc7c381f4a07f3c4', name: 'Sneaker', slug: 'sneaker' },
//           { id: '689f312dbc7c381f4a07f3c5', name: 'Voleybol Ayakkabısı', slug: 'voleybol-ayakkabisi' },
//           { id: '689f312dbc7c381f4a07f3c6', name: 'Güreş Ayakkabısı', slug: 'gures-ayakkabisi' },
//           { id: '689f312dbc7c381f4a07f3c7', name: 'Boks Ayakkabısı', slug: 'boks-ayakkabisi' },
//           { id: '689f312dbc7c381f4a07f3c8', name: 'Krampon', slug: 'krampon' },
//           { id: '689f312dbc7c381f4a07f3c9', name: 'Bisiklet Ayakkabısı', slug: 'bisiklet-ayakkabisi' },
//           { id: '689f312dbc7c381f4a07f3ca', name: 'Futsal Ayakkabı', slug: 'futsal-ayakkabi' },
//           { id: '689f312dbc7c381f4a07f3cb', name: 'Kaykay Ayakkabıları', slug: 'kaykay-ayakkabilari' },
//           { id: '689f312dbc7c381f4a07f3cc', name: 'Yelken Ayakkabıları', slug: 'yelken-ayakkabilari' },
//           { id: '689f312dbc7c381f4a07f3cd', name: 'Jimnastik Ayakkabıları', slug: 'jimnastik-ayakkabilari' }
//         ]
//       },
//       {
//         id: '689f312dbc7c381f4a07f3ce',
//         name: 'Topuklu Ayakkabı',
//         slug: 'topuklu-ayakkabi',
//         children: [
//           { id: '689f312dbc7c381f4a07f3cf', name: 'Abiye Ayakkabı', slug: 'abiye-ayakkabi' },
//           { id: '689f312dbc7c381f4a07f3d0', name: 'Dolgu Topuklu Ayakkabı', slug: 'dolgu-topuklu-ayakkabi' },
//           { id: '689f312dbc7c381f4a07f3d1', name: 'Klasik Topuklu Ayakkabı', slug: 'klasik-topuklu-ayakkabi' },
//           { id: '689f312dbc7c381f4a07f3d2', name: 'Stiletto', slug: 'stiletto' }
//         ]
//       },
//       {
//         id: '689f312dbc7c381f4a07f3d3',
//         name: 'Ev Terliği & Botu',
//         slug: 'ev-terligi-botu',
//         children: [
//           { id: '689f312dbc7c381f4a07f3d4', name: 'Panduf', slug: 'panduf' },
//           { id: '689f312dbc7c381f4a07f3d5', name: 'Ev Terliği', slug: 'ev-terligi' },
//           { id: '689f312dbc7c381f4a07f3d6', name: 'Patik', slug: 'patik' },
//           { id: '689f312dbc7c381f4a07f3d7', name: 'Ev Botu', slug: 'ev-botu' }
//         ]
//       },
//       {
//         id: '689f312dbc7c381f4a07f3d8',
//         name: 'Günlük Ayakkabı',
//         slug: 'gunluk-ayakkabi',
//         children: [
//           { id: '689f312dbc7c381f4a07f3d9', name: 'Babet', slug: 'babet' },
//           { id: '689f312dbc7c381f4a07f3da', name: 'Casual Ayakkabı', slug: 'casual-ayakkabi' },
//           { id: '689f312dbc7c381f4a07f3db', name: 'Espadril', slug: 'espadril' },
//           { id: '689f312dbc7c381f4a07f3dc', name: 'Klasik Ayakkabı', slug: 'klasik-ayakkabi' },
//           { id: '689f312dbc7c381f4a07f3dd', name: 'Oxford Ayakkabı', slug: 'oxford-ayakkabi' },
//           { id: '689f312dbc7c381f4a07f3de', name: 'Loafer Ayakkabı', slug: 'loafer-ayakkabi' }
//         ]
//       },
//       {
//         id: '689f312dbc7c381f4a07f3df',
//         name: 'Diğer Ayakkabı Ürünleri',
//         slug: 'diger-ayakkabi-urunleri',
//         children: [
//           { id: '689f312dbc7c381f4a07f3e0', name: 'Ayakkabı Boyası', slug: 'ayakkabi-boyasi' },
//           { id: '689f312dbc7c381f4a07f3e1', name: 'Ayakkabı Cilasý', slug: 'ayakkabi-cilasi' },
//           { id: '689f312dbc7c381f4a07f3e2', name: 'Ayakkabı Spreyi', slug: 'ayakkabi-spreyi' },
//           { id: '689f312dbc7c381f4a07f3e3', name: 'Ayakkabı Bakım Süngeri', slug: 'ayakkabi-bakim-sungeri' },
//           { id: '689f312dbc7c381f4a07f3e4', name: 'Ayakkabı Kalıbı', slug: 'ayakkabi-kalibi' },
//           { id: '689f312dbc7c381f4a07f3e5', name: 'Ayakkabı Bağcığı', slug: 'ayakkabi-bagcigi' }
//         ]
//       },
//         ]
// },

};

// Kategori slug'ına göre kategori verisini döndüren fonksiyon
export function getCategoryBySlug(slug: string): CategoryData | null {
  return STATIC_CATEGORIES[slug] || null;
}

// Tüm ana kategorileri döndüren fonksiyon
export function getAllMainCategories(): CategoryData[] {
  return Object.values(STATIC_CATEGORIES);
}