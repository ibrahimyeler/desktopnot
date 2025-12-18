import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // API base URL'ini al
    const API_BASE_URL = 'https://api.trendruum.com';
    
    // Query parametrelerini al
    const name = searchParams.get('name') || '';
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '20';
    
    // API URL'ini oluştur
    let apiUrl = `${API_BASE_URL}/api/v1/campaigns?page=${page}&limit=${limit}`;
    if (name) {
      apiUrl += `&name=${encodeURIComponent(name)}`;
    }
    
    // Kampanyaları getir
    const campaignsResponse = await fetch(apiUrl, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    if (!campaignsResponse.ok) {
      return NextResponse.json(
        { error: 'Kampanyalar yüklenemedi' },
        { status: campaignsResponse.status }
      );
    }
    
    const campaignsData = await campaignsResponse.json();
    
    return NextResponse.json(campaignsData);
    
  } catch (error) {
    return NextResponse.json(
      { 
        error: 'Kampanyalar alınamadı'
      },
      { status: 500 }
    );
  }
}
