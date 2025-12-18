import { NextRequest, NextResponse } from 'next/server';

// Ödeme sağlayıcısı başarısız işlemler için genelde POST ile döner.
// Bu route hem GET hem POST isteklerini alıp public klasöründeki
// statik `basarisiz.html` sayfasına yönlendirir.

// Localhost kontrolü
const isLocalhost = (request: NextRequest): boolean => {
  const host = request.headers.get('host') || '';
  return host.includes('localhost') || host.includes('127.0.0.1') || host.includes('0.0.0.0');
};

export async function GET(request: NextRequest) {
  // Localhost'tan test ederken production URL'ine yönlendir
  if (isLocalhost(request)) {
    const searchParams = request.nextUrl.searchParams.toString();
    const redirectUrl = searchParams 
      ? `https://trendruum.com/basarisiz.html?${searchParams}`
      : 'https://trendruum.com/basarisiz.html';
    return NextResponse.redirect(redirectUrl, { status: 302 });
  }
  
  // Production'da direkt statik HTML dosyasını serve et
  // Next.js'in public klasöründeki statik dosyayı serve etmesi için rewrite yap
  try {
    const url = request.nextUrl.clone();
    url.pathname = '/basarisiz.html';
    // Query parametrelerini koru - zaten request.nextUrl'de var
    return NextResponse.rewrite(url);
  } catch (error) {
    // Hata durumunda direkt statik dosyaya redirect yap
    const protocol = request.headers.get('x-forwarded-proto') || 'https';
    const host = request.headers.get('host') || 'trendruum.com';
    const baseUrl = `${protocol}://${host}`;
    const redirectUrl = new URL('/basarisiz.html', baseUrl);
    if (request.nextUrl.search) {
      redirectUrl.search = request.nextUrl.search;
    }
    return NextResponse.redirect(redirectUrl.toString(), { status: 302 });
  }
}

export async function POST(request: NextRequest) {
  // Localhost'tan test ederken production URL'ine yönlendir
  if (isLocalhost(request)) {
    const searchParams = request.nextUrl.searchParams.toString();
    const redirectUrl = searchParams 
      ? `https://trendruum.com/basarisiz.html?${searchParams}`
      : 'https://trendruum.com/basarisiz.html';
    return NextResponse.redirect(redirectUrl, { status: 302 });
  }
  
  // Production'da POST isteği geldiğinde GET'e dönüştür ve statik dosyayı serve et
  const url = request.nextUrl.clone();
  url.pathname = '/basarisiz.html';
  
  // POST isteğini GET'e çevir ve statik dosyayı serve et
  return NextResponse.rewrite(url);
}


