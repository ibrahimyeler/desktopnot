import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    
    // API base URL'ini al
    const API_BASE_URL = 'https://api.trendruum.com';
    
    // Kategori bilgilerini getir
    const categoryResponse = await fetch(`${API_BASE_URL}/api/v1/categories/${slug}`);
    
    if (!categoryResponse.ok) {
      return NextResponse.json(
        { error: 'Kategori bulunamadı' },
        { status: 404 }
      );
    }
    
    const categoryData = await categoryResponse.json();
    
    // Kategori ürünlerini getir
    const productsResponse = await fetch(`${API_BASE_URL}/api/v1/categories/${slug}/products`);
    
    if (!productsResponse.ok) {
      return NextResponse.json(
        { error: 'Ürünler yüklenemedi' },
        { status: 500 }
      );
    }
    
    const productsData = await productsResponse.json();
    
    // Birleştirilmiş response
    const response = {
      meta: {
        status: 'success',
        message: 'Kategori ve ürünler başarıyla getirildi'
      },
      data: {
        category: categoryData.data,
        products: productsData.data,
        meta: productsData.meta
      }
    };
    
    return NextResponse.json(response);
    
  } catch (error) {
    return NextResponse.json(
      { 
        meta: {
          status: 'error',
          message: 'Sunucu hatası'
        },
        error: 'Kategori bilgileri alınamadı'
      },
      { status: 500 }
    );
  }
}
