import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    const { searchParams } = new URL(request.url);
    
    // API base URL'ini al
    const API_BASE_URL = 'https://api.trendruum.com';
    
    // Query parametrelerini al
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '24';
    
    // Diğer query parametrelerini topla
    const queryParams = new URLSearchParams();
    searchParams.forEach((value, key) => {
      if (key !== 'page' && key !== 'limit') {
        queryParams.append(key, value);
      }
    });
    
    // API URL'ini oluştur
    let apiUrl = `${API_BASE_URL}/api/v1/brands/${slug}/products?page=${page}&limit=${limit}`;
    if (queryParams.toString()) {
      apiUrl += `&${queryParams.toString()}`;
    }
    
    // Marka ürünlerini getir
    const productsResponse = await fetch(apiUrl);
    
    if (!productsResponse.ok) {
      return NextResponse.json(
        { error: 'Ürünler yüklenemedi' },
        { status: productsResponse.status }
      );
    }
    
    const productsData = await productsResponse.json();
    
    return NextResponse.json(productsData);
    
  } catch (error) {
    return NextResponse.json(
      { 
        error: 'Ürünler alınamadı'
      },
      { status: 500 }
    );
  }
}
