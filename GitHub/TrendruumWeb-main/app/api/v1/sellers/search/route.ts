import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // API base URL'ini al
    const API_BASE_URL = 'https://api.trendruum.com';
    
    // Query parametrelerini al
    const name = searchParams.get('name') || '';
    
    // API URL'ini oluştur
    let apiUrl = `${API_BASE_URL}/api/v1/sellers/search`;
    if (name) {
      apiUrl += `?name=${encodeURIComponent(name)}`;
    }
    
    // Mağazaları getir
    const sellersResponse = await fetch(apiUrl, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    if (!sellersResponse.ok) {
      return NextResponse.json(
        { error: 'Mağazalar yüklenemedi' },
        { status: sellersResponse.status }
      );
    }
    
    const sellersData = await sellersResponse.json();
    
    return NextResponse.json(sellersData);
    
  } catch (error) {
    return NextResponse.json(
      { 
        error: 'Mağazalar alınamadı'
      },
      { status: 500 }
    );
  }
}
