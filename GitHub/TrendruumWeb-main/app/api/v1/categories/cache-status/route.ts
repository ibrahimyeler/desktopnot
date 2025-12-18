import { NextRequest, NextResponse } from 'next/server';
import { getCacheStatus, getSubcategories } from '@/app/utils/categoryCache';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get('category');
    
    if (categorySlug) {
      // Belirli bir kategori için alt kategorileri getir
      const subcategories = await getSubcategories(categorySlug);
      return NextResponse.json({
        category: categorySlug,
        subcategories,
        count: subcategories.length
      });
    } else {
      // Tüm cache durumunu getir
      const cacheStatus = getCacheStatus();
      return NextResponse.json({
        cacheStatus,
        totalCachedCategories: Object.keys(cacheStatus).length
      });
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Cache durumu alınamadı' },
      { status: 500 }
    );
  }
}
