import { NextResponse } from 'next/server';

// Basit bir in-memory storage (gerçek uygulamada veritabanı kullanılmalı)
const notificationPreferences = new Map<string, { type: string; enabled: boolean }[]>();

export async function GET() {
  try {
    // TODO: Gerçek kullanıcı kimlik doğrulaması eklenecek
    const userId = 'test-user'; // Geçici olarak sabit bir kullanıcı ID'si

    // Kullanıcının tercihlerini getir
    const userPreferences = notificationPreferences.get(userId) || [
      { type: 'email', enabled: false },
      { type: 'sms', enabled: false },
      { type: 'phone', enabled: false }
    ];

    return NextResponse.json(userPreferences);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    // TODO: Gerçek kullanıcı kimlik doğrulaması eklenecek
    const userId = 'test-user'; // Geçici olarak sabit bir kullanıcı ID'si

    const { preferences } = await request.json();

    // Tercihleri güncelle
    notificationPreferences.set(userId, preferences);

    return NextResponse.json({ 
      success: true, 
      preferences: preferences 
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 