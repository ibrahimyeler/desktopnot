"use client";

import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import ScrollToTop from '@/components/ui/ScrollToTop';
import CustomerServices from '@/components/iletisim/CustomerServices';
import AddressInfo from '@/components/iletisim/AddressInfo';
import EmailInfo from '@/components/iletisim/EmailInfo';
import ContactForm from '@/components/iletisim/ContactForm';

const ContactPageClient = () => {
  const [isClient, setIsClient] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header showBackButton={true} onBackClick={() => window.history.back()} />
      
      <main className="flex-grow pb-4 md:pb-0 pt-24 md:pt-8">
        {/* Hero Section */}
        <div className="w-full px-4 md:px-5 relative pt-4 md:pt-0">
          <div 
            className="h-48 md:h-56 lg:h-64 rounded-lg relative overflow-hidden bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: 'url(/bg-trendruum.png)'
            }}
          >
            <div className="absolute inset-0 bg-black/40"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white px-4">
                <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-2">
                  İletişim
                </h1>
                <p className="text-base md:text-lg lg:text-xl opacity-90">
                  Sorularınız için bizimle iletişime geçebilirsiniz
                </p>
              </div>
            </div>
          </div>
          
          {/* Breadcrumb */}
          <div className="absolute top-4 left-4 md:left-10">
            <div className="text-white text-xs md:text-sm">
              <span 
                className="hover:text-orange-300 cursor-pointer transition-colors"
                onClick={() => window.location.href = '/'}
              >
                Anasayfa
              </span>
              <span className="mx-2">/</span>
              <span>İletişim</span>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-2 sm:px-3 lg:px-4 xl:px-6 2xl:px-8 py-4 sm:py-6 lg:py-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex gap-6 lg:gap-8">
              {/* Sidebar */}
              <div className="hidden lg:block w-72 flex-shrink-0">
                <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-100 p-6 sticky top-24">
                  <div className="mb-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-2">Yardım & Destek</h2>
                    <p className="text-sm text-gray-600">Size yardımcı olabilecek sayfalar</p>
                  </div>
                  
                  <nav className="space-y-2">
                    <a
                      href="/iletisim"
                      className="group flex items-center px-4 py-3 text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg transition-all duration-200 hover:from-orange-600 hover:to-orange-700"
                    >
                      <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                      İletişim
                    </a>
                    
                    <div className="border-t border-gray-200 my-4"></div>
                    
                    <a
                      href="/s/güvenlik"
                      className="group flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 rounded-lg transition-all duration-200 hover:text-gray-900"
                    >
                      <div className="w-2 h-2 bg-transparent group-hover:bg-orange-400 rounded-full mr-3 transition-colors duration-200"></div>
                      Güvenlik
                    </a>
                    <a
                      href="/kvkk"
                      className="group flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 rounded-lg transition-all duration-200 hover:text-gray-900"
                    >
                      <div className="w-2 h-2 bg-transparent group-hover:bg-orange-400 rounded-full mr-3 transition-colors duration-200"></div>
                      Kişisel Verilerin Korunması
                    </a>
                    <a
                      href="/kayit-ol/uyelik-kosullari.html"
                      className="group flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 rounded-lg transition-all duration-200 hover:text-gray-900"
                    >
                      <div className="w-2 h-2 bg-transparent group-hover:bg-orange-400 rounded-full mr-3 transition-colors duration-200"></div>
                      Üyelik Sözleşmesi
                    </a>
                    <a
                      href="/public/cerez-politikasi.html"
                      className="group flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 rounded-lg transition-all duration-200 hover:text-gray-900"
                    >
                      <div className="w-2 h-2 bg-transparent group-hover:bg-orange-400 rounded-full mr-3 transition-colors duration-200"></div>
                      Çerez Politikası
                    </a>
                    <a
                      href="/iletisim/aydinlatma.html"
                      className="group flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 rounded-lg transition-all duration-200 hover:text-gray-900"
                    >
                      <div className="w-2 h-2 bg-transparent group-hover:bg-orange-400 rounded-full mr-3 transition-colors duration-200"></div>
                      İletişim Aydınlatma Metni
                    </a>
                    <a
                      href="/s/kullanim-kosullari"
                      className="group flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 rounded-lg transition-all duration-200 hover:text-gray-900"
                    >
                      <div className="w-2 h-2 bg-transparent group-hover:bg-orange-400 rounded-full mr-3 transition-colors duration-200"></div>
                      Kullanım Koşulları
                    </a>
                    <a
                      href="/s/islem-rehberi"
                      className="group flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 rounded-lg transition-all duration-200 hover:text-gray-900"
                    >
                      <div className="w-2 h-2 bg-transparent group-hover:bg-orange-400 rounded-full mr-3 transition-colors duration-200"></div>
                      İşlem Rehberi
                    </a>
                    <a
                      href="/s/ticari-iletisim-bilgilendirme-metni"
                      className="group flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 rounded-lg transition-all duration-200 hover:text-gray-900"
                    >
                      <div className="w-2 h-2 bg-transparent group-hover:bg-orange-400 rounded-full mr-3 transition-colors duration-200"></div>
                      Ticari İletişim Bilgilendirme Metni
                    </a>
                    <a
                      href="https://seller.trendruum.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 rounded-lg transition-all duration-200 hover:text-gray-900"
                    >
                      <div className="w-2 h-2 bg-transparent group-hover:bg-orange-400 rounded-full mr-3 transition-colors duration-200"></div>
                      İş Ortaklığı
                    </a>
                  </nav>
                  
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center mr-3">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">Canlı Destek</p>
                          <p className="text-xs text-gray-600">7/24 Yardım</p>
                        </div>
                      </div>
                      <button className="w-full bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors duration-200">
                        Sohbete Başla
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="flex-1">
                {/* Company Info Section - Sleek Tasarım */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-8">
                  {/* Sol Kolon - Şirket Bilgileri */}
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 lg:p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-4 border-b-2 border-gray-200">
                      Şirket Bilgileri
                    </h2>
                    
                    <div className="space-y-5">
                      {/* Unvan */}
                      <div>
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">UNVAN</div>
                        <div className="text-base text-gray-900 font-semibold leading-relaxed">
                          BECEM ELEKTRONİK TİCARET VE BİLİŞİM HİZMETLERİ ANONİM ŞİRKETİ
                        </div>
                      </div>

                      {/* Firma Adres Bilgisi */}
                      <div>
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">FİRMA ADRES BİLGİSİ</div>
                        <div className="text-sm text-gray-700 leading-relaxed">
                          BARBAROS HAYRETİN PAŞA MAH. 1992.SOKAK NO:30 K:5 ESENYURT / İSTANBUL
                        </div>
                      </div>

                      {/* Bilgiler Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* MERSİS No */}
                        <div>
                          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">MERSİS NO</div>
                          <div className="text-sm text-gray-900 font-medium">
                            0160069011100016
                          </div>
                        </div>

                        {/* Ticaret Sicil No */}
                        <div>
                          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">TİCARET SİCİL NO / DOSYA NO</div>
                          <div className="text-sm text-gray-900 font-medium">
                            960426-0
                          </div>
                        </div>

                        {/* Vergi Dairesi */}
                        <div className="sm:col-span-2">
                          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">VERGİ DAİRESİ / NO</div>
                          <div className="text-sm text-gray-900 font-medium">
                            ESENYURT VERGİ DAİRESİ / 1600690111
                          </div>
                        </div>

                        {/* Ticaret Sicili Müdürlüğü */}
                        <div className="sm:col-span-2">
                          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">TİCARET SİCİLİ MÜDÜRLÜĞÜ</div>
                          <div className="text-sm text-gray-900 font-medium">
                            İSTANBUL TİCARET SİCİLİ MÜDÜRLÜĞÜ
                          </div>
                        </div>

                        {/* Sorumlu Kişi */}
                        <div className="sm:col-span-2">
                          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">SORUMLU KİŞİ</div>
                          <div className="text-sm text-gray-900 font-medium">
                            Erkan Soğukbulak
                          </div>
                        </div>

                        {/* Elektronik Tebligat Adresi */}
                        <div className="sm:col-span-2">
                          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">ELEKTRONİK TEBLİGAT ADRESİ</div>
                          <div className="text-sm text-gray-900 font-medium">
                            25939-93888-89092
                          </div>
                          <div className="text-sm text-orange-600 font-medium mt-1">
                            becem@hs02.kep.tr
                          </div>
                        </div>
                      </div>

                      {/* Yasal Bilgilendirme */}
                      <div className="pt-5 mt-5 border-t border-gray-200">
                        <p className="text-xs text-gray-600 leading-relaxed mb-2">
                          İstanbul Ticaret Odası üyelerinin uyulması gereken meslek kurallarına{' '}
                          <a 
                            href="https://www.ito.org.tr" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-orange-600 hover:text-orange-700 font-medium underline"
                          >
                            www.ito.org.tr
                          </a>
                          {' '}adresinden ulaşabilirsiniz.
                        </p>
                        <p className="text-xs text-gray-600 leading-relaxed">
                          Yasal bildirimler ve arabuluculuk başvuruları için:{' '}
                          <span className="text-gray-900 font-medium">becem.hukuk@hs02.kep.tr</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Sağ Kolon - Müşteri Hizmetleri */}
                  <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200 shadow-sm p-6 lg:p-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
                      Müşteri Hizmetleri
                    </h2>
                    
                    <div className="space-y-5">
                      {/* Çalışma Saatleri */}
                      <div className="bg-white rounded-lg p-5 border border-gray-100">
                        <div className="flex items-start mb-3">
                          <svg className="w-5 h-5 text-orange-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <div>
                            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Çalışma Saatleri</div>
                            <div className="text-sm text-gray-900 leading-relaxed">
                              Hafta içi ve hafta sonu<br />
                              <span className="font-semibold text-gray-900">08.30 - 24.00</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Telefon Numarası */}
                      <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg px-5 py-3 border border-orange-200">
                        <div className="flex items-center">
                          <svg className="w-5 h-5 text-orange-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <div>
                            <a 
                              href="tel:08502421144" 
                              className="text-lg text-gray-900 font-bold hover:text-orange-600 transition-colors"
                            >
                              0850 242 11 44
                            </a>
                          </div>
                        </div>
                      </div>

                      {/* Canlı Yardım Butonu */}
                      <button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-sm font-medium py-2.5 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                        <div className="flex items-center justify-center">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                          CANLI YARDIM DESTEĞİ
                        </div>
                      </button>

                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 text-center">
                        <p className="text-xs text-gray-600">
                          Markanızı{' '}
                          <a 
                            href="https://www.trendruum.com" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-orange-600 hover:text-orange-700 font-semibold underline"
                          >
                            Trendruum.com
                          </a>
                          {' '}da görmek için{' '}
                          <a 
                            href="https://www.trendruum.com" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-orange-600 hover:text-orange-700 font-semibold underline"
                          >
                            tıklayınız
                          </a>
                          .
                        </p>
                      </div>

                      {/* Konumumuz */}
                      <div className="bg-white rounded-lg border border-gray-100 overflow-hidden mt-5">
                        <div className="p-4 border-b border-gray-100">
                          <div className="flex items-center">
                            <svg className="w-5 h-5 text-orange-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <h3 className="text-sm font-semibold text-gray-900">Konumumuz</h3>
                          </div>
                        </div>
                        <div className="p-4">
                          {/* Harita */}
                          <div className="w-full h-64 rounded-lg overflow-hidden mb-3 border border-gray-200">
                            {isClient ? (
                              <iframe
                                src="https://www.google.com/maps?q=Maslak+Bilim+Sk.+Sun+Plaza+No:5+K:13+34398+Sarıyer+İstanbul&output=embed"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Trendruum Ofis Konumu"
                                className="w-full h-full"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                <div className="text-gray-500 text-sm">Harita yükleniyor...</div>
                              </div>
                            )}
                          </div>
                          <p className="text-sm text-gray-700 leading-relaxed mb-3">
                            Maslak, Bilim Sk. Sun Plaza No:5 K:13, 34398 Sarıyer/İstanbul
                          </p>
                          <a
                            href="https://www.google.com/maps/search/?api=1&query=Maslak+Bilim+Sk.+Sun+Plaza+No:5+K:13+34398+Sarıyer+İstanbul"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-sm text-orange-600 hover:text-orange-700 font-medium"
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            Haritada Görüntüle
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Contact Info Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-6 sm:mb-8">
                  <CustomerServices />
                  <AddressInfo />
                  <EmailInfo />
                </div>
                
                {/* İletişim Butonu */}
                <div className="w-full">
                  <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200 shadow-sm p-8 flex flex-col items-center justify-center min-h-[400px]">
                    <svg className="w-16 h-16 text-orange-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center">
                      Bizimle İletişime Geçin
                    </h3>
                    <p className="text-gray-600 mb-6 text-center max-w-md">
                      Sorularınız, önerileriniz veya destek talepleriniz için bize ulaşabilirsiniz
                    </p>
                    <button
                      onClick={openModal}
                      className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    >
                      İletişim Formunu Aç
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* İletişim Formu Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
            onClick={closeModal}
          ></div>

          {/* Modal */}
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
            <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4 flex items-center justify-between">
                <h3 className="text-xl font-bold text-white" id="modal-title">
                  Bize Ulaşın
                </h3>
                <button
                  onClick={closeModal}
                  className="text-white hover:text-gray-200 transition-colors"
                  aria-label="Kapat"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Form Content */}
              <div className="bg-white px-6 py-6">
                <ContactForm onSuccess={closeModal} />
              </div>
            </div>
          </div>
        </div>
      )}
      
      <ScrollToTop />
    </div>
  );
};

export default ContactPageClient;
