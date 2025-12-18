import { NextResponse } from 'next/server';
import { API_V1_URL } from '@/lib/config';

export async function GET() {
  try {
    const response = await fetch(`${API_V1_URL}/navigation/top`);
    const data = await response.json();

    if (!response.ok) {
      // API'den hata durumunda varsayılan menüyü döndür
      return NextResponse.json({
        meta: {
          status: 'success',
          message: 'Default navigation loaded'
        },
        data: [
          { name: 'Yardım', path: '/yardim' },
          { name: 'İletişim', path: '/iletisim' },
          { name: 'Hakkımızda', path: '/hakkimizda' }
        ]
      });
    }

    return NextResponse.json(data);
  } catch (error) {
    
    // Hata durumunda varsayılan menüyü döndür
    return NextResponse.json({
      meta: {
        status: 'success',
        message: 'Default navigation loaded'
      },
      data: [
        { name: 'Yardım', path: '/yardim' },
        { name: 'İletişim', path: '/iletisim' },
        { name: 'Hakkımızda', path: '/hakkimizda' }
      ]
    });
  }
} 