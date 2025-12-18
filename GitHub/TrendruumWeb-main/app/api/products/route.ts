import { NextResponse } from 'next/server';
import { API_V1_URL } from '@/lib/config';

export async function GET() {
  try {
    const response = await fetch(`${API_V1_URL}/products/`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
} 