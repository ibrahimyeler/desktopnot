"use client";

import Link from 'next/link';
import React from 'react';
import Image from 'next/image';
import { useMenu } from '../../app/context/MenuContext';
import { usePathname } from 'next/navigation';

interface MenuItem {
  name: string;
  url: string;
  type: string;
  slug: string;
  children?: MenuItem[];
  badge?: string;
}

const Footer = () => {
  const { trendruumMenu, yardimMenu, bottomFooterMenu, isLoading } = useMenu();
  const loading = isLoading;
  const pathname = usePathname();
  const isHomepage = pathname === '/';
  const rootClasses = `bg-gray-100 text-gray-900 pb-20 sm:pb-0 hidden sm:block`;

  return (
    <footer className={rootClasses} data-component="desktop-footer">
      {/* Colored bars at the top */}
      <div className="flex">
        <div 
          style={{
            width: '33.333%',
            height: '12px',
            flexShrink: 0,
            background: '#F9AF02'
          }}
        ></div>
        <div 
          style={{
            width: '33.333%',
            height: '12px',
            flexShrink: 0,
            background: '#EC6D04'
          }}
        ></div>
        <div 
          style={{
            width: '33.333%',
            height: '12px',
            flexShrink: 0,
            background: '#000'
          }}
        ></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-4 sm:py-6 lg:py-8 pb-4 sm:pb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 xl:grid-cols-5 2xl:grid-cols-5 gap-4 sm:gap-4 lg:gap-6 xl:gap-8 2xl:gap-10 relative text-center sm:text-left">
          {/* Column 1: Trendruum Contact Information */}
          <div className="sm:col-span-2 lg:col-span-1 xl:col-span-1 border-b sm:border-b-0 border-gray-300 pb-4 sm:pb-0">
            <div className="mb-3 sm:mb-4 flex justify-center sm:justify-start">
              <svg width="150" height="52" viewBox="0 0 184 65" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-6 w-auto sm:h-8">
                <path d="M108.645 47.4155V50.4336C107.367 50.3665 106.26 50.618 105.323 51.1881C104.386 51.7582 103.909 52.7139 103.909 54.0385V60.5274H100.57V47.6503H103.909V49.8132C104.744 48.2204 106.328 47.4155 108.645 47.4155Z" fill="black"/>
                <path d="M147.473 47.6838V54.5583C147.473 55.799 147.166 56.738 146.535 57.3416C145.922 57.9452 145.104 58.247 144.099 58.247C143.094 58.247 142.447 57.9955 141.918 57.4757C141.39 56.956 141.118 56.235 141.118 55.2625V47.667H138.255V55.5308C138.255 57.1739 138.733 58.465 139.67 59.404C140.607 60.3429 141.833 60.8124 143.367 60.8124C144.9 60.8124 146.621 60.1585 147.49 58.8339V60.4771H150.352V47.667H147.49L147.473 47.6838Z" fill="black"/>
                <path d="M125.699 47.6838V54.5583C125.699 55.799 125.393 56.738 124.762 57.3416C124.149 57.9452 123.331 58.247 122.326 58.247C121.321 58.247 120.673 57.9955 120.145 57.4757C119.617 56.956 119.344 56.235 119.344 55.2625V47.667H116.482V55.5308C116.482 57.1739 116.959 58.465 117.896 59.404C118.833 60.3429 120.06 60.8124 121.593 60.8124C123.127 60.8124 124.847 60.1585 125.716 58.8339V60.4771H128.578V47.667H125.716L125.699 47.6838Z" fill="black"/>
                <path d="M179.553 48.6732C178.582 47.7175 177.287 47.248 175.686 47.248C174.084 47.248 172.313 47.9355 171.358 49.2936C170.49 47.9355 169.161 47.248 167.355 47.248C165.549 47.248 164.22 47.8852 163.317 49.1427V47.5834H160.267V60.5108H163.317V53.2674C163.317 52.144 163.607 51.3057 164.186 50.7188C164.765 50.1488 165.532 49.8469 166.452 49.8469C167.372 49.8469 167.951 50.0985 168.411 50.5847C168.871 51.0709 169.11 51.7752 169.11 52.6638V60.4941H172.159V53.2507C172.159 52.1105 172.432 51.2554 172.994 50.6853C173.556 50.1152 174.306 49.8302 175.243 49.8302C176.18 49.8302 176.759 50.0817 177.253 50.5679C177.747 51.0542 177.986 51.7584 177.986 52.6471V60.4773H181.035V52.4626C181.035 50.853 180.541 49.5787 179.57 48.6397L179.553 48.6732Z" fill="black"/>
                <path d="M23.2385 49.8469V47.684H20.5978V60.5108H23.2385V53.7033C23.2385 52.2949 23.6985 51.2889 24.6356 50.6517C25.5726 50.0146 26.68 49.7295 27.9748 49.7798V47.4492C25.6919 47.4492 24.1244 48.2373 23.2556 49.8301L23.2385 49.8469Z" fill="black"/>
                <path d="M67.5518 48.7737C66.5636 47.8347 65.2348 47.3652 63.5992 47.3652C61.9636 47.3652 60.0385 48.0862 59.0503 49.5282V47.7006H56.614V60.4268H59.0503V53.6864C59.0503 52.2612 59.4251 51.2049 60.1748 50.5174C60.9244 49.83 61.9125 49.4947 63.1222 49.4947C64.3318 49.4947 65.0644 49.7797 65.6777 50.3498C66.2911 50.9199 66.5977 51.7247 66.5977 52.7642V60.4603H69.034V52.6469C69.034 51.0372 68.5399 49.7629 67.5518 48.8072V48.7737Z" fill="black"/>
                <path d="M88.5073 42.5197V49.8637C87.434 48.1702 85.8666 47.3151 83.8051 47.3151C81.7436 47.3151 80.5851 47.969 79.3584 49.2768C78.1318 50.5847 77.5184 52.1775 77.5184 54.0722C77.5184 55.9669 78.1318 57.5598 79.3584 58.8676C80.5851 60.1754 82.0673 60.8294 83.8051 60.8294C85.5429 60.8294 87.434 59.9742 88.5073 58.2808V60.494H90.671V42.5029H88.5073V42.5197ZM87.2466 57.3586C86.3947 58.2472 85.3555 58.6832 84.0947 58.6832C82.834 58.6832 81.8118 58.2472 80.9599 57.3586C80.1081 56.4867 79.6821 55.3801 79.6821 54.089C79.6821 52.7979 80.1081 51.6913 80.9599 50.8194C81.8118 49.9308 82.851 49.4948 84.0947 49.4948C85.3384 49.4948 86.4118 49.9308 87.2466 50.8194C88.0984 51.7081 88.5244 52.7979 88.5244 54.089C88.5244 55.3801 88.0984 56.4867 87.2466 57.3586Z" fill="black"/>
                <path d="M45.7274 56.4867C45.5911 56.822 45.4208 57.1406 45.1993 57.4089C44.4496 58.3311 43.3422 58.8005 41.9111 58.8005C40.48 58.8005 39.7133 58.482 38.9126 57.8616C38.4356 57.4927 38.0437 57.0232 37.7711 56.4532C37.4815 55.8663 37.3622 55.1956 37.3622 54.5417V54.1896H47.9593C47.9593 52.3284 47.38 50.7523 46.2045 49.4277C45.0289 48.1031 43.5296 47.4492 41.6896 47.4492C39.8496 47.4492 38.163 48.0864 36.9363 49.3607C35.7096 50.635 35.0963 52.2446 35.0963 54.1561C35.0963 56.0675 35.7267 57.7107 36.9704 58.9682C38.2141 60.2425 39.8326 60.8797 41.8259 60.8797C43.8193 60.8797 46.1363 59.9239 47.363 57.9957C47.9082 57.258 47.9422 56.4028 47.9422 56.4028H45.7274C45.7274 56.4196 45.7104 56.4531 45.6934 56.4699L45.7274 56.4867ZM38.7933 50.5511C39.56 49.8804 40.5311 49.5451 41.7067 49.5451C42.8822 49.5451 43.5978 49.8637 44.3474 50.4841C44.9608 50.9871 45.3867 51.6913 45.6252 52.58H37.5156C37.7541 51.7584 38.18 51.0709 38.7933 50.5344V50.5511Z" fill="black"/>
                <path d="M8.38219 49.4779V56.671C8.38219 57.3249 8.51848 57.7943 8.80811 58.0626C9.0807 58.3309 9.52367 58.4818 10.1029 58.4818C10.6822 58.4818 11.3977 58.4818 12.2496 58.4315V60.5106C10.0518 60.7789 8.4333 60.6112 7.39404 60.0244C6.37182 59.4375 5.8607 58.3141 5.8607 56.6542V49.4611H2.98145V47.2311H5.8607V43.5088H8.38219V47.2311H12.2496V49.4611H8.38219V49.4779Z" fill="black"/>
                <path d="M130.861 17.2687C130.861 24.8307 124.643 30.9506 116.959 30.9506C109.276 30.9506 103.057 24.8307 103.057 17.2687C103.057 9.70674 109.276 3.60352 116.959 3.60352C124.643 3.60352 130.861 9.72351 130.861 17.2687Z" fill="#EC6D04"/>
                <path d="M84.3844 17.2687C84.3844 24.8307 78.1659 30.9506 70.4822 30.9506C62.7985 30.9506 56.58 24.8307 56.58 17.2687C56.58 9.70674 62.7985 3.60352 70.4822 3.60352C78.1659 3.60352 84.3844 9.72351 84.3844 17.2687Z" fill="#F9AF02"/>
                <path d="M108.219 17.2687C108.219 24.8307 102.001 30.9506 94.317 30.9506C86.6333 30.9506 80.4148 24.8307 80.4148 17.2687C80.4148 9.70674 86.6333 3.60352 94.317 3.60352C102.001 3.60352 108.219 9.72351 108.219 17.2687Z" fill="black"/>
              </svg>
            </div>
            <div className="space-y-2">
              <div>
                <span className="text-gray-500 text-xs sm:text-xs lg:text-sm xl:text-base">Email</span>
                <a 
                  href="mailto:destek@trendruum.com?subject=Trendruum Destek Talebi&body=Merhaba,%0D%0A%0D%0ABu e-posta ile size ulaşmak istiyorum.%0D%0A%0D%0ASaygılarımla,"
                  className="text-black text-sm sm:text-xs lg:text-sm xl:text-base hover:text-orange-500 transition-colors duration-200 cursor-pointer block"
                >
                  destek@trendruum.com    
                </a>
              </div>
              <div>
                <span className="text-gray-500 text-xs sm:text-xs lg:text-sm xl:text-base">Telefon</span>
                <a 
                  href="tel:+908502421144"
                  className="text-black text-sm sm:text-xs lg:text-sm xl:text-base hover:text-orange-500 transition-colors duration-200 cursor-pointer block"
                >
                  0850 242 11 44
                </a>
              </div>
              <div>
             
              </div>
            </div>
          </div>

          {/* Column 2: Trendruum Links */}
          <div className="lg:col-span-1 xl:col-span-1 border-b sm:border-b-0 border-gray-300 pb-4 sm:pb-0">
            <h3 className="text-black font-bold mb-3 sm:mb-4 text-sm sm:text-xs lg:text-sm xl:text-base">Trendruum</h3>
            <ul className="space-y-1 sm:space-y-2">
              {loading ? (
                // Loading skeleton
                [...Array(4)].map((_, i) => (
                  <li key={i}>
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-20"></div>
                  </li>
                ))
              ) : trendruumMenu.length > 0 ? (
                trendruumMenu.map((item, index) => (
                  <li key={index}>
                    <Link 
                      href={`/s/${item.url}`}
                      prefetch={false}
                      className="text-gray-500 text-sm sm:text-xs lg:text-sm xl:text-base hover:text-orange-500 transition-colors block"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))
              ) : (
                // Fallback static links if API fails
                <>
                  <li>
                                      <Link href="/s/biz-kimiz" prefetch={false} className="text-gray-500 text-sm sm:text-xs hover:text-orange-500 transition-colors block">
                    Biz Kimiz
                  </Link>
                </li>
                <li>
                  <Link href="/s/kariyer" prefetch={false} className="text-gray-500 text-sm sm:text-xs hover:text-orange-500 transition-colors block">
                    Kariyer
                  </Link>
                </li>
                <li>
                  <Link href="/s/surdurulebilirlik" prefetch={false} className="text-gray-500 text-sm sm:text-xs hover:text-orange-500 transition-colors block">
                    Sürdürülebilirlik
                  </Link>
                </li>
                <li>
                  <Link href="/s/iletisim" prefetch={false} className="text-gray-500 text-sm sm:text-xs hover:text-orange-500 transition-colors block">
                    İletişim
                  </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Column 3: Help Links */}
          <div className="lg:col-span-1 xl:col-span-1 border-b sm:border-b-0 border-gray-300 pb-4 sm:pb-0">
            <h3 className="text-black font-bold mb-3 sm:mb-4 text-sm sm:text-xs lg:text-sm xl:text-base">Yardım</h3>
            <ul className="space-y-1 sm:space-y-2">
              {loading ? (
                // Loading skeleton
                [...Array(3)].map((_, i) => (
                  <li key={i}>
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-24"></div>
                  </li>
                ))
              ) : yardimMenu.length > 0 ? (
                yardimMenu.map((item, index) => (
                  <li key={index}>
                    <Link 
                      href={item.url.startsWith('http') ? item.url : `/s/${item.url}`}
                      prefetch={false}
                      className="text-gray-500 text-sm sm:text-xs lg:text-sm xl:text-base hover:text-orange-500 transition-colors block"
                      target={item.url.startsWith('http') ? '_blank' : '_self'}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))
              ) : (
                // Fallback static links if API fails
                <>
                  <li>
                                      <Link href="/s/sikca-sorulan-sorular" prefetch={false} className="text-gray-500 text-sm sm:text-xs hover:text-orange-500 transition-colors block">
                    Sıkça Sorulan Sorular
                  </Link>
                </li>
                <li>
                  <Link href="/s/canli-destek" prefetch={false} className="text-gray-500 text-sm sm:text-xs hover:text-orange-500 transition-colors block">
                    Canlı Destek
                  </Link>
                </li>
                <li>
                  <Link href="/s/iade" prefetch={false} className="text-gray-500 text-sm sm:text-xs hover:text-orange-500 transition-colors block">
                    İade
                  </Link>
                  </li>
                </>
              )}
            </ul>
          </div>



          {/* Column 5: Social Media */}
          <div className="lg:col-span-1 xl:col-span-1 border-b sm:border-b-0 border-gray-300 pb-4 sm:pb-0">
            <h3 className="text-black font-bold mb-2 sm:mb-3 text-sm sm:text-xs lg:text-sm xl:text-base">Sosyal Medya</h3>
            <div className="flex justify-center sm:justify-start lg:justify-start space-x-2 flex-wrap gap-2 sm:gap-0 sm:space-x-2">
              <a href="https://www.instagram.com/trendruum/" target="_blank" rel="noopener noreferrer">
                <Image 
                  src="/sosyal/instagram.png" 
                  alt="Instagram" 
                  width={28} 
                  height={28} 
                  className="w-7 h-7 hover:opacity-80 transition-opacity cursor-pointer"
                />
              </a>
              <a href="https://x.com/trendruum" target="_blank" rel="noopener noreferrer">
                <Image 
                  src="/sosyal/x.png" 
                  alt="X (Twitter)" 
                  width={28} 
                  height={28} 
                  className="w-7 h-7 hover:opacity-80 transition-opacity cursor-pointer"
                />
              </a>
              <a href="https://www.facebook.com/trendruumcom" target="_blank" rel="noopener noreferrer">
                <Image 
                  src="/sosyal/facebook.png" 
                  alt="Facebook" 
                  width={28} 
                  height={28} 
                  className="w-7 h-7 hover:opacity-80 transition-opacity cursor-pointer"
                />
              </a>
              <a href="https://www.youtube.com/channel/UCg_b_FnRblF6qvY5CLKEGmA" target="_blank" rel="noopener noreferrer">
                <Image 
                  src="/sosyal/youtube.png" 
                  alt="YouTube" 
                  width={28} 
                  height={28} 
                  className="w-7 h-7 hover:opacity-80 transition-opacity cursor-pointer"
                />
              </a>
              <a href="https://www.tiktok.com/@trendruum.com" target="_blank" rel="noopener noreferrer">
                <Image 
                  src="/sosyal/tiktok.png" 
                  alt="TikTok" 
                  width={28} 
                  height={28} 
                  className="w-7 h-7 hover:opacity-80 transition-opacity cursor-pointer"
                />
              </a>
              <a href="https://www.linkedin.com/company/trendruum" target="_blank" rel="noopener noreferrer">
                <Image 
                  src="/sosyal/linkedin.png" 
                  alt="LinkedIn" 
                  width={28} 
                  height={28} 
                  className="w-7 h-7 hover:opacity-80 transition-opacity cursor-pointer"
                />
              </a>
            </div>
          </div>

          {/* Column 6: Mobile Apps */}
          <div className="lg:col-span-1 xl:col-span-1 border-b sm:border-b-0 border-gray-300 pb-4 sm:pb-0">
          <h3 className="text-black font-bold mb-3 sm:mb-4 text-sm sm:text-xs lg:text-sm xl:text-base">Mobil Uygulama</h3>
            <div className="space-y-2 sm:space-y-2">
              <div className="flex flex-col space-y-2 items-center sm:items-start lg:items-start">
                <a 
                  href="https://apps.apple.com/tr/app/trendruum-online-al%C4%B1%C5%9Fveri%C5%9F/id6458739916"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-80 transition-opacity cursor-pointer"
                >
                  <Image src="/mobile/app-store.webp" alt="App Store" width={120} height={40} className="w-24 h-8 sm:w-28 sm:h-9" />
                </a>
                <a 
                  href="https://play.google.com/store/apps/details?id=com.trendruum.mobile&hl=tr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-80 transition-opacity cursor-pointer"
                >
                  <Image src="/mobile/google-play.webp" alt="Google Play" width={120} height={40} className="w-24 h-8 sm:w-28 sm:h-9" />
                </a>
                <Image src="/mobile/app-gallery.webp" alt="App Gallery" width={120} height={40} className="w-24 h-8 sm:w-28 sm:h-9" />
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* Payment Methods and Security Certificates Section */}
      <div className="bg-gray-100 border-t border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="text-center">
            <div className="flex justify-center items-center gap-2 sm:gap-3 lg:gap-4 overflow-x-auto whitespace-nowrap">
              {/* Güvenlik Sertifikaları ve Ödeme Yöntemleri - Tekrarlanan logolar kaldırıldı */}
              <Image src="/bonus.svg" alt="Bonus" width={20} height={13} className="h-2.5 sm:h-3 lg:h-4 w-auto object-contain flex-shrink-0" />
              <Image src="/maximum.svg" alt="Maximum" width={20} height={13} className="h-2.5 sm:h-3 lg:h-4 w-auto object-contain flex-shrink-0" />
              <Image src="/world.svg" alt="World" width={20} height={13} className="h-2.5 sm:h-3 lg:h-4 w-auto object-contain flex-shrink-0" />
              <Image src="/ziraat.svg" alt="Ziraat" width={20} height={13} className="h-2.5 sm:h-3 lg:h-4 w-auto object-contain flex-shrink-0" />
              <Image src="/card-finans.svg" alt="Card Finans" width={20} height={13} className="h-2.5 sm:h-3 lg:h-4 w-auto object-contain flex-shrink-0" />
              <Image src="/axess.svg" alt="Axess" width={20} height={13} className="h-2.5 sm:h-3 lg:h-4 w-auto object-contain flex-shrink-0" />
              <Image src="/kuveyt-turk.svg" alt="Kuveyt Türk" width={20} height={13} className="h-2.5 sm:h-3 lg:h-4 w-auto object-contain flex-shrink-0" />
              <Image src="/paraf.svg" alt="Paraf" width={20} height={13} className="h-2.5 sm:h-3 lg:h-4 w-auto object-contain flex-shrink-0" />
              <Image src="/visa.svg" alt="Visa" width={20} height={13} className="h-2.5 sm:h-3 lg:h-4 w-auto object-contain flex-shrink-0" />
              <Image src="/master-card.svg" alt="Mastercard" width={20} height={13} className="h-2.5 sm:h-3 lg:h-4 w-auto object-contain flex-shrink-0" />
              <Image src="/troy.svg" alt="Troy" width={26} height={17} className="h-3.5 sm:h-4 lg:h-5 w-auto object-contain flex-shrink-0" />
              <Image src="/guvenli-alisveris.svg" alt="Güvenli Alışveriş" width={34} height={22} className="h-4.5 sm:h-5 lg:h-6.5 w-auto object-contain flex-shrink-0" />
              <Image src="/certificates/pci.webp" alt="PCI DSS" width={34} height={22} className="h-4.5 sm:h-5 lg:h-6.5 w-auto object-contain flex-shrink-0" />
              {/* <Image src="/iso-icon.webp" alt="ISO" width={34} height={22} className="h-4.5 sm:h-5 lg:h-6.5 w-auto object-contain flex-shrink-0" /> */}
             
              
              <a 

                href="https://www.guvendamgasi.org.tr/view/uye/detay.php?Guid=94b194b3-47c9-11ee-99c6-48df373f4850"
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity cursor-pointer flex-shrink-0"
                title="Güven Damgası Bilgilerini Görüntüle"
              >
                <Image src="/certificates/trgo.webp" alt="TRGO" width={34} height={22} className="h-4.5 sm:h-5 lg:h-6.5 w-auto object-contain" />
              </a>
              <a 
                href="https://etbis.ticaret.gov.tr/tr/Home/SearchSiteResult?siteId=31f5d2c4-849f-40ce-95f3-300d5015c383"
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity cursor-pointer flex-shrink-0"
                title="ETBİS Kayıt Bilgilerini Görüntüle"
              >
                <Image src="/certificates/etbis.jpg" alt="ETBİS" width={34} height={22} className="h-4.5 sm:h-5 lg:h-6.5 w-auto object-contain" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* New black footer section */}
      <div 
        className="w-full bg-black flex items-center"
        style={{
          minHeight: '58px',
          flexShrink: 0
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 w-full h-full flex flex-col sm:flex-row items-center justify-between py-3 sm:py-0 gap-2 sm:gap-0">
          {/* Left - Copyright */}
          <div className="text-white text-[10px] sm:text-[10px] lg:text-xs xl:text-xs text-center sm:text-left leading-relaxed flex items-center">
            ©2025 Trendruum Tüm Hakları Saklıdır.<br className="sm:hidden" />
            <span className="hidden sm:inline"> </span>
          </div>
          
          {/* Right - Legal Links */}
          <div className="flex items-center gap-1.5 sm:gap-6 flex-wrap justify-center sm:justify-end">
            {loading ? (
              // Loading skeleton for legal links
              [...Array(4)].map((_, i) => (
                <div key={i} className="h-3 bg-gray-600 rounded animate-pulse w-16"></div>
              ))
            ) : bottomFooterMenu.length > 0 ? (
              bottomFooterMenu.map((item, index) => (
                <Link 
                  key={index}
                  href={`/s/${item.url}`}
                  prefetch={false}
                  className="text-white text-[10px] sm:text-[10px] lg:text-xs xl:text-xs hover:text-orange-500 transition-colors"
                >
                  {item.name}
                </Link>
              ))
            ) : (
              // Fallback static links if API fails
              <>
                <Link href="/s/aydinlatma-metni" prefetch={false} className="text-white text-[10px] sm:text-[10px] lg:text-xs xl:text-xs hover:text-orange-500 transition-colors">
                  Aydınlatma Metni
                </Link>
                <Link href="/s/cerez-politikasi" prefetch={false} className="text-white text-[10px] sm:text-[10px] lg:text-xs xl:text-xs hover:text-orange-500 transition-colors">
                  Çerez Politikası
                </Link>
                <Link href="/s/kvkk" prefetch={false} className="text-white text-[10px] sm:text-[10px] lg:text-xs xl:text-xs hover:text-orange-500 transition-colors">
                  KVKK
                </Link>
                <Link href="/s/gizlilik" prefetch={false} className="text-white text-[10px] sm:text-[10px] lg:text-xs xl:text-xs hover:text-orange-500 transition-colors">
                  Gizlilik
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default React.memo(Footer);