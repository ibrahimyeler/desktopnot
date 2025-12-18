import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value

  // PAYTR başarısız ödeme dönüşü genelde /basarisiz.html adresine POST ile geliyor.
  // Statik HTML dosyaları POST methodunu desteklemediği için 405 alınıyor.
  // Bu middleware, tüm methodlar (GET/POST vs.) için /basarisiz.html isteklerini
  // /basarisiz route'una rewrite eder. Oradaki route handler da 302 ile
  // tekrar /basarisiz.html'e yönlendirerek tarayıcı tarafında GET'e düşmesini sağlar.
  // Localhost kontrolü için helper fonksiyon
  const isLocalhostRequest = (request: NextRequest): boolean => {
    const host = request.headers.get('host') || '';
    return host.includes('localhost') || host.includes('127.0.0.1') || host.includes('0.0.0.0');
  };

  // /basarisiz.html için sadece localhost kontrolü ve POST işlemi
  if (request.nextUrl.pathname === '/basarisiz.html') {
    // Localhost'tan test ederken direkt production URL'ine yönlendir
    if (isLocalhostRequest(request)) {
      const searchParams = request.nextUrl.searchParams.toString();
      const targetPath = '/basarisiz.html';
      const targetUrl = new URL(targetPath, 'https://trendruum.com');
      
      if (searchParams) {
        targetUrl.search = searchParams;
      }
      
      return NextResponse.redirect(targetUrl.toString(), { status: 302 });
    }
    
    // Production'da GET istekleri için hiçbir şey yapma - direkt statik dosyayı serve et
    // Sadece POST istekleri için rewrite yap
    if (request.method === 'POST') {
      const url = request.nextUrl.clone()
      url.pathname = '/basarisiz'
      return NextResponse.rewrite(url)
    }
    
    // GET istekleri için hiçbir şey yapma - Next.js statik dosyayı otomatik serve eder
    return;
  }
  
  // /basarisiz route'una gelen istekler için
  if (request.nextUrl.pathname === '/basarisiz') {
    // Localhost'tan test ederken direkt production URL'ine yönlendir
    if (isLocalhostRequest(request)) {
      const searchParams = request.nextUrl.searchParams.toString();
      const targetUrl = new URL('/basarisiz.html', 'https://trendruum.com');
      
      if (searchParams) {
        targetUrl.search = searchParams;
      }
      
      return NextResponse.redirect(targetUrl.toString(), { status: 302 });
    }
    
    // Production'da /basarisiz route'una gelen istekler için route.ts'e bırak
    // Route.ts statik dosyayı serve edecek
  }
  
  if (token) {
    if (request.nextUrl.pathname === '/girs' || request.nextUrl.pathname === '/kayit-ol') {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  const { pathname } = request.nextUrl;

  // Kategori redirect'leri kaldırıldı

  // Butik listesi URL'lerini yakala
  if (pathname.startsWith('/butik/liste/')) {
    // URL'den kategori ID ve slug'ı çıkar
    const matches = pathname.match(/\/butik\/liste\/(\d+)\/(.+)/);
    if (matches) {
      const [, categoryId, slug] = matches;
      
      // Kategori slug'ına göre yönlendirme yap
      const categoryMap: { [key: string]: string } = {
        'kadin': '/kadin',
        'erkek': '/erkek',
        'anne-cocuk': '/anne-cocuk',
        'ev-yasam': '/ev-yasam',
        'supermarket': '/supermarket',
        'kozmetik': '/kozmetik',
        'ayakkabi-canta': '/ayakkabi-canta',
        'elektronik': '/elektronik',
        'categories': '/kategoriler'
      };

      const targetPath = categoryMap[slug];
      if (targetPath) {
        const url = request.nextUrl.clone();
        url.pathname = targetPath;
        url.searchParams.set('categoryId', categoryId);
        return NextResponse.rewrite(url);
      }
    }
  }

  // Ürün detay sayfaları için slug kontrolü KALDIRILDI
  // ProductPage component zaten ürün bulunamadığında uygun hata sayfasını gösteriyor
  // Bu kontrol seller panel'den "Detaya Git" butonlarının çalışmasını engelliyordu
}

export const config = {
  matcher: ['/login', '/signup', '/butik/liste/:path*', '/basarisiz.html', '/basarisiz']
} 