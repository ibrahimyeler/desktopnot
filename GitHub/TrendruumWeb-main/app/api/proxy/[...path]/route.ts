import { NextRequest, NextResponse } from 'next/server';
import { API_V1_URL } from '@/lib/config';

const API_BASE_URL = API_V1_URL;

export async function GET(
  request: NextRequest,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { params }: any
) {
  return handleRequest(request, params.path, 'GET');
}

export async function POST(
  request: NextRequest,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { params }: any
) {
  return handleRequest(request, params.path, 'POST');
}

export async function PUT(
  request: NextRequest,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { params }: any
) {
  return handleRequest(request, params.path, 'PUT');
}

export async function DELETE(
  request: NextRequest,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { params }: any
) {
  return handleRequest(request, params.path, 'DELETE');
}

async function handleRequest(
  request: NextRequest,
  pathSegments: string[],
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
) {
  try {
    const path = pathSegments.join('/');
    const apiUrl = `${API_BASE_URL}/${path}`;

    const headers: HeadersInit = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    const authHeader = request.headers.get('authorization');
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }

    const requestOptions: RequestInit = {
      method,
      headers,
    };

    if (method === 'POST' || method === 'PUT') {
      const body = await request.json();
      requestOptions.body = JSON.stringify(body);
    }

    const response = await fetch(apiUrl, requestOptions);

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
  
      return NextResponse.json(
        {
          error: `API returned ${response.status}`,
          message: errorData?.message || response.statusText,
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        message:
          error instanceof Error ? error.message : 'An unexpected error occurred',
      },
      { status: 500 }
    );
  }
}