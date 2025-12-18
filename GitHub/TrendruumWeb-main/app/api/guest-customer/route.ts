import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { API_V1_URL } from '@/lib/config';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const basketUUID = cookieStore.get('basketUUID')?.value;


    if (!basketUUID) {
      return NextResponse.json({
        meta: {
          status: 'error',
          message: 'Sepet bilgisi bulunamadı. Lütfen sepetinize ürün ekleyin.'
        }
      }, { status: 400 });
    }

    const apiUrl = `${API_V1_URL}/guest-customer/${basketUUID}`;

    const response = await fetch(apiUrl, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({
        meta: {
          status: 'error',
          message: data.message || 'Adres bilgileri alınamadı'
        }
      }, { status: response.status });
    }

    return NextResponse.json(data);

  } catch (error) {
    return NextResponse.json({
      meta: {
        status: 'error',
        message: error instanceof Error ? error.message : 'Sunucu hatası oluştu'
      }
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Request body validation
    if (!body.basket_uuid || !body.firstname || !body.lastname || !body.email || 
        !body.phone || !body.city || !body.district || !body.neighborhood || 
        !body.address_title || !body.address_detail) {
      return NextResponse.json(
        { 
          meta: { 
            status: 'error',
            message: 'Tüm alanların doldurulması zorunludur'
          }
        },
        { status: 400 }
      );
    }

    // API isteği için veriyi hazırla
    const requestData = {
      session_id: body.basket_uuid, // basket_uuid'yi session_id olarak gönder
      firstname: body.firstname,
      lastname: body.lastname,
      email: body.email,
      phone: body.phone,
      city: body.city,
      district: body.district,
      neighborhood: body.neighborhood,
      address_title: body.address_title,
      address_detail: body.address_detail
    };


    const response = await fetch(`${API_V1_URL}/guest-customer`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Origin': process.env.NEXT_PUBLIC_APP_URL || 'https://trendruum.bixcod.dev'
      },
      credentials: 'include',
      body: JSON.stringify(requestData)
    });

    const data = await response.json();
    
    if (!response.ok) {
   
      
      return NextResponse.json(
        { 
          meta: { 
            status: 'error',
            message: data.meta?.message || 'API isteği başarısız oldu'
          },
          errors: data.errors || {}
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { 
        meta: { 
          status: 'error',
          message: 'Sunucu hatası oluştu'
        }
      },
      { status: 500 }
    );
  }
} 