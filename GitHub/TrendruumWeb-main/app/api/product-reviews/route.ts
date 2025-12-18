import { NextResponse } from 'next/server';
import { API_V1_URL } from '@/lib/config';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    const productSlug = searchParams.get('productSlug');

    if (!productId && !productSlug) {
      return NextResponse.json({
        meta: {
          status: 'error',
          message: 'Product ID or slug is required',
          code: 400,
        },
        data: []
      }, { status: 400 });
    }

    // Get token from request headers (client will send it)
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      // If no token, return empty reviews array
      return NextResponse.json({
        meta: {
          status: 'success',
          message: 'No authentication token found',
          code: 200,
        },
        data: []
      });
    }

    // Fetch reviews from external API
    const response = await fetch(`${API_V1_URL}/customer/reviews/`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      return NextResponse.json({
        meta: {
          status: 'error',
          message: 'Failed to fetch reviews',
          code: response.status,
        },
        data: []
      }, { status: response.status });
    }

    const data = await response.json();

    if (data?.meta?.status === 'success') {
      // Filter reviews for the specific product
      const productReviews = data.data.filter((review: any) => 
        review.reference_id === productId || review.reference_id === productSlug
      );

      return NextResponse.json({
        meta: {
          status: 'success',
          message: 'Reviews fetched successfully',
          code: 200,
        },
        data: productReviews
      });
    } else {
      return NextResponse.json({
        meta: {
          status: 'error',
          message: data?.meta?.message || 'Failed to fetch reviews',
          code: 500,
        },
        data: []
      }, { status: 500 });
    }

  } catch (error) {
    return NextResponse.json({
      meta: {
        status: 'error',
        message: 'Internal server error',
        code: 500,
      },
      data: []
    }, { status: 500 });
  }
} 