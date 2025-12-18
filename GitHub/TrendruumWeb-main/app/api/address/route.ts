import { NextResponse } from 'next/server';
import { API_V1_URL } from '@/lib/config';

const API_BASE = API_V1_URL;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const id = searchParams.get('id');
//testwe
  let url = '';

  switch (type) {
    case 'cities':
      url = `${API_BASE}/countries/tr`;
      break;
    case 'districts':
      url = `${API_BASE}/countries/tr/cities/${id}`;
      break;
    case 'neighborhoods':
      url = `${API_BASE}/countries/tr/districts/${id}`;
      break;
    default:
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  }


  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'API Error' }, { status: 500 });
  }
} 