import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name');
    
    if (!name) {
      return NextResponse.json(
        { error: 'Name parameter is required' },
        { status: 400 }
      );
    }

    // Direct API call to external API with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000); // 12 second timeout (increased for better reliability)

    try {
      const response = await fetch(`https://api.trendruum.com/api/v1/products/search?name=${encodeURIComponent(name)}&limit=5`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }

      const data = await response.json();
      return NextResponse.json(data);
    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      
      if (fetchError.name === 'AbortError') {
        return NextResponse.json(
          { 
            meta: {
              status: 'error',
              message: 'Arama zaman aşımına uğradı. Lütfen tekrar deneyin.',
              code: 408
            }
          },
          { status: 408 }
        );
      }
      
      throw fetchError;
    }
  } catch (error) {
    return NextResponse.json(
      { 
        meta: {
          status: 'error',
          message: 'Ürün arama işlemi başarısız oldu. Lütfen tekrar deneyin.',
          code: 500
        }
      },
      { status: 500 }
    );
  }
}