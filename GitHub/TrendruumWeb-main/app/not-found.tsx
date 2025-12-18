"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MagnifyingGlassIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

const popularLinks = [
  { name: 'ÇOK SATANLAR', href: '/q?sort=best_selling' },
  { name: 'KARGO BEDAVA', href: '/q?filter=free_shipping' },
  { name: 'EN ÇOK BAKILAN ÜRÜNLER', href: '/q?sort=most_viewed' },
  { name: 'EN ÇOK ARANANLAR', href: '/q?sort=most_searched' },
  { name: 'EN BEĞENİLENLER', href: '/q?sort=most_liked' },
  { name: 'EN ÇOK SEPETE EKLENENLER', href: '/q?sort=most_added_to_cart' },

];

export default function NotFound() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    document.body.classList.add('not-found-page');
    return () => {
      document.body.classList.remove('not-found-page');
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/q?name=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#050505] via-[#0b0b10] to-[#070707] text-white">
      <div className="absolute top-6 left-6">
        <Link href="/" className="flex items-center">
          <svg
            width="120"
            height="42"
            viewBox="0 0 184 65"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-auto"
          >
            <path
              d="M108.645 47.4155V50.4336C107.367 50.3665 106.26 50.618 105.323 51.1881C104.386 51.7582 103.909 52.7139 103.909 54.0385V60.5274H100.57V47.6503H103.909V49.8132C104.744 48.2204 106.328 47.4155 108.645 47.4155Z"
              fill="white"
            />
            <path
              d="M147.473 47.6838V54.5583C147.473 55.799 147.166 56.738 146.535 57.3416C145.922 57.9452 145.104 58.247 144.099 58.247C143.094 58.247 142.447 57.9955 141.918 57.4757C141.39 56.956 141.118 56.235 141.118 55.2625V47.667H138.255V55.5308C138.255 57.1739 138.733 58.465 139.67 59.404C140.607 60.3429 141.833 60.8124 143.367 60.8124C144.9 60.8124 146.621 60.1585 147.49 58.8339V60.4771H150.352V47.667H147.49L147.473 47.6838Z"
              fill="white"
            />
            <path
              d="M125.699 47.6838V54.5583C125.699 55.799 125.393 56.738 124.762 57.3416C124.149 57.9452 123.331 58.247 122.326 58.247C121.321 58.247 120.673 57.9955 120.145 57.4757C119.617 56.956 119.344 56.235 119.344 55.2625V47.667H116.482V55.5308C116.482 57.1739 116.959 58.465 117.896 59.404C118.833 60.3429 120.06 60.8124 121.593 60.8124C123.127 60.8124 124.847 60.1585 125.716 58.8339V60.4771H128.578V47.667H125.716L125.699 47.6838Z"
              fill="white"
            />
            <path
              d="M179.553 48.6732C178.582 47.7175 177.287 47.248 175.686 47.248C174.084 47.248 172.313 47.9355 171.358 49.2936C170.49 47.9355 169.161 47.248 167.355 47.248C165.549 47.248 164.22 47.8852 163.317 49.1427V47.5834H160.267V60.5108H163.317V53.2674C163.317 52.144 163.607 51.3057 164.186 50.7188C164.765 50.1488 165.532 49.8469 166.452 49.8469C167.372 49.8469 167.951 50.0985 168.411 50.5847C168.871 51.0709 169.11 51.7752 169.11 52.6638V60.4941H172.159V53.2507C172.159 52.1105 172.432 51.2554 172.994 50.6853C173.556 50.1152 174.306 49.8302 175.243 49.8302C176.18 49.8302 176.759 50.0817 177.253 50.5679C177.747 51.0542 177.986 51.7584 177.986 52.6471V60.4773H181.035V52.4626C181.035 50.853 180.541 49.5787 179.57 48.6397L179.553 48.6732Z"
              fill="white"
            />
            <path
              d="M23.2385 49.8469V47.684H20.5978V60.5108H23.2385V53.7033C23.2385 52.2949 23.6985 51.2889 24.6356 50.6517C25.5726 50.0146 26.68 49.7295 27.9748 49.7798V47.4492C25.6919 47.4492 24.1244 48.2373 23.2556 49.8301L23.2385 49.8469Z"
              fill="white"
            />
            <path
              d="M67.5518 48.7737C66.5636 47.8347 65.2348 47.3652 63.5992 47.3652C61.9636 47.3652 60.0385 48.0862 59.0503 49.5282V47.7006H56.614V60.4268H59.0503V53.6864C59.0503 52.2612 59.4251 51.2049 60.1748 50.5174C60.9244 49.83 61.9125 49.4947 63.1222 49.4947C64.3318 49.4947 65.0644 49.7797 65.6777 50.3498C66.2911 50.9199 66.5977 51.7247 66.5977 52.7642V60.4603H69.034V52.6469C69.034 51.0372 68.5399 49.7629 67.5518 48.8072V48.7737Z"
              fill="white"
            />
            <path
              d="M88.5073 42.5197V49.8637C87.434 48.1702 85.8666 47.3151 83.8051 47.3151C81.7436 47.3151 80.5851 47.969 79.3584 49.2768C78.1318 50.5847 77.5184 52.1775 77.5184 54.0722C77.5184 55.9669 78.1318 57.5598 79.3584 58.8676C80.5851 60.1754 82.0673 60.8294 83.8051 60.8294C85.5429 60.8294 87.434 59.9742 88.5073 58.2808V60.494H90.671V42.5029H88.5073V42.5197ZM87.2466 57.3586C86.3947 58.2472 85.3555 58.6832 84.0947 58.6832C82.834 58.6832 81.8118 58.2472 80.9599 57.3586C80.1081 56.4867 79.6821 55.3801 79.6821 54.089C79.6821 52.7979 80.1081 51.6913 80.9599 50.8194C81.8118 49.9308 82.851 49.4948 84.0947 49.4948C85.3384 49.4948 86.4118 49.9308 87.2466 50.8194C88.0984 51.7081 88.5244 52.7979 88.5244 54.089C88.5244 55.3801 88.0984 56.4867 87.2466 57.3586Z"
              fill="white"
            />
            <path
              d="M45.7274 56.4867C45.5911 56.822 45.4208 57.1406 45.1993 57.4089C44.4496 58.3311 43.3422 58.8005 41.9111 58.8005C40.48 58.8005 39.7133 58.482 38.9126 57.8616C38.4356 57.4927 38.0437 57.0232 37.7711 56.4532C37.4815 55.8663 37.3622 55.1956 37.3622 54.5417V54.1896H47.9593C47.9593 52.3284 47.38 50.7523 46.2045 49.4277C45.0289 48.1031 43.5296 47.4492 41.6896 47.4492C39.8496 47.4492 38.163 48.0864 36.9363 49.3607C35.7096 50.635 35.0963 52.2446 35.0963 54.1561C35.0963 56.0675 35.7267 57.7107 36.9704 58.9682C38.2141 60.2425 39.8326 60.8797 41.8259 60.8797C43.8193 60.8797 46.1363 59.9239 47.363 57.9957C47.9082 57.258 47.9422 56.4028 47.9422 56.4028H45.7274C45.7274 56.4196 45.7104 56.4531 45.6934 56.4699L45.7274 56.4867ZM38.7933 50.5511C39.56 49.8804 40.5311 49.5451 41.7067 49.5451C42.8822 49.5451 43.5978 49.8637 44.3474 50.4841C44.9608 50.9871 45.3867 51.6913 45.6252 52.58H37.5156C37.7541 51.7584 38.18 51.0709 38.7933 50.5344V50.5511Z"
              fill="white"
            />
            <path
              d="M8.38219 49.4779V56.671C8.38219 57.3249 8.51848 57.7943 8.80811 58.0626C9.0807 58.3309 9.52367 58.4818 10.1029 58.4818C10.6822 58.4818 11.3977 58.4818 12.2496 58.4315V60.5106C10.0518 60.7789 8.4333 60.6112 7.39404 60.0244C6.37182 59.4375 5.8607 58.3141 5.8607 56.6542V49.4611H2.98145V47.2311H5.8607V43.5088H8.38219V47.2311H12.2496V49.4611H8.38219V49.4779Z"
              fill="white"
            />
            <path
              d="M130.861 17.2687C130.861 24.8307 124.643 30.9506 116.959 30.9506C109.276 30.9506 103.057 24.8307 103.057 17.2687C103.057 9.70674 109.276 3.60352 116.959 3.60352C124.643 3.60352 130.861 9.72351 130.861 17.2687Z"
              fill="#EC6D04"
            />
            <path
              d="M84.3844 17.2687C84.3844 24.8307 78.1659 30.9506 70.4822 30.9506C62.7985 30.9506 56.58 24.8307 56.58 17.2687C56.58 9.70674 62.7985 3.60352 70.4822 3.60352C78.1659 3.60352 84.3844 9.72351 84.3844 17.2687Z"
              fill="#F9AF02"
            />
            <path
              d="M108.219 17.2687C108.219 24.8307 102.001 30.9506 94.317 30.9506C86.6333 30.9506 80.4148 24.8307 80.4148 17.2687C80.4148 9.70674 86.6333 3.60352 94.317 3.60352C102.001 3.60352 108.219 9.72351 108.219 17.2687Z"
              fill="white"
            />
          </svg>
        </Link>
      </div>

      <div className="flex flex-col items-center justify-center min-h-screen px-4 py-16">
        <div className="max-w-4xl w-full text-center space-y-10">
          <div>
            <h1 className="mt-5 text-[80px] sm:text-[96px] font-semibold tracking-tight text-white">
              404
            </h1>
            <p className="mt-4 text-sm sm:text-base text-white/70">
              Aradığınız sayfa bulunamadı. Doğru URL’yi kullandığınızdan emin olun veya aşağıdaki kısayollardan devam edin.
            </p>
          </div>

          <form onSubmit={handleSearch} className="max-w-2xl mx-auto w-full">
            <div className="flex flex-col sm:flex-row items-stretch gap-3 p-3 border border-white/10 rounded-2xl bg-white/5 backdrop-blur">
              <div className="flex items-center flex-1 border border-white/5 rounded-xl px-3">
                <MagnifyingGlassIcon className="w-4 h-4 text-white/40" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ürün veya marka ara"
                  className="flex-1 bg-transparent px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-2 rounded-xl text-sm font-semibold bg-white text-gray-900 hover:bg-gray-100 transition-colors"
              >
                Ara
              </button>
            </div>
          </form>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="px-7 py-2.5 rounded-xl text-sm font-semibold bg-white text-gray-900 hover:bg-gray-100 transition-colors"
            >
              Ana sayfaya dön
            </Link>
            <Link
              href="/q"
              className="px-7 py-2.5 rounded-xl text-sm font-semibold border border-white/15 text-white hover:bg-white/10 transition-colors"
            >
              Ürünleri keşfet
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-3xl mx-auto">
            {popularLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="flex items-center justify-between px-5 py-3 rounded-2xl border border-white/10 hover:border-white/30 transition-colors text-xs sm:text-sm text-white/80"
              >
                {link.name}
                <ArrowRightIcon className="w-4 h-4 text-white/30" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      <style jsx global>{`
        body.not-found-page [data-component="desktop-footer"],
        body.not-found-page [data-component="mobile-footer"],
        body.not-found-page [data-component="mobile-tab-navigator"],
        body.not-found-page [data-component="scroll-to-top"] {
          display: none !important;
        }
      `}</style>
    </div>
  );
}
