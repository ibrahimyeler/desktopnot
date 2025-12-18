import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // API base URL'ini al
    const API_BASE_URL = 'https://api.trendruum.com';
    
    // Query parametrelerini al
    const name = searchParams.get('name') || '';
    
    // API URL'ini oluştur
    let apiUrl = `${API_BASE_URL}/api/v1/brands/list`;
    if (name) {
      apiUrl += `?name=${encodeURIComponent(name)}`;
    }
    
    // Markaları getir
    const brandsResponse = await fetch(apiUrl);
    
    if (!brandsResponse.ok) {
      return NextResponse.json(
        { error: 'Markalar yüklenemedi' },
        { status: brandsResponse.status }
      );
    }
    
    const brandsData = await brandsResponse.json();
    
    return NextResponse.json(brandsData);
    
  } catch (error) {
    return NextResponse.json(
      { 
        error: 'Markalar alınamadı'
      },
      { status: 500 }
    );
  }
}
