import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Debug endpoint - sadece development'ta kullanılmalı
export async function GET() {
  const apiKey = process.env.OPENAI_API_KEY;
  const hasKey = !!apiKey && apiKey.trim() !== '';
  const keyLength = apiKey ? apiKey.length : 0;
  const keyPrefix = apiKey ? apiKey.substring(0, 7) : 'N/A';
  
  return NextResponse.json({
    hasApiKey: hasKey,
    keyLength: keyLength,
    keyPrefix: keyPrefix,
    message: hasKey 
      ? 'API key is configured' 
      : 'API key is missing or empty',
    timestamp: new Date().toISOString()
});
}

export async function POST(request: NextRequest) {
  try {
    // API key kontrolü - daha detaylı kontrol
    const apiKey = process.env.OPENAI_API_KEY;
    
    // Debug logging (production'da da çalışır, Dockerploy loglarında görülebilir)

    
    if (!apiKey || apiKey.trim() === '') {

      return NextResponse.json(
        { 
          response: "Merhaba! Şu anda asistanımız bakımda. Lütfen daha sonra tekrar deneyin.",
          timestamp: new Date().toISOString()
        },
        { status: 200 }
      );
    }

    const body = await request.json();
    const { message, conversationHistory = [] } = body;

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Conversation context'i oluştur
    const messages = [
      {
        role: 'system' as const,
        content: `Sen Trendruum e-ticaret platformunun müşteri hizmetleri asistanısın. 
        Türkçe konuşuyorsun ve kullanıcılara sipariş, iade, ödeme, kargo gibi konularda yardım ediyorsun.
        Kısa, net ve yardımcı cevaplar ver. Trendruum markasına uygun profesyonel bir dil kullan.
        Eğer kullanıcı sipariş durumu soruyorsa, hesabım sayfasından kontrol edebileceğini söyle.
        İade işlemleri için müşteri hizmetleri ile iletişime geçmesini öner.
        Ödeme sorunları için banka ile iletişime geçmesini veya farklı ödeme yöntemi denemesini öner.`
      },
      ...conversationHistory.map((msg: any) => ({
        role: msg.isBot ? 'assistant' as const : 'user' as const,
        content: msg.text
      })),
      {
        role: 'user' as const,
        content: message
      }
    ];

    const client = new OpenAI({
      apiKey: apiKey
    });

    const completion = await client.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages,
      max_tokens: 500,
      temperature: 0.7,
    });

    const botResponse = completion.choices[0]?.message?.content || 'Üzgünüm, şu anda size yardım edemiyorum.';

    return NextResponse.json({
      response: botResponse,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    
    // OpenAI API hatası için özel mesaj
    if (error?.status === 401 || error?.message?.includes('Invalid API key')) {
      return NextResponse.json(
        { 
          response: "Merhaba! Şu anda asistanımız bakımda. Lütfen daha sonra tekrar deneyin.",
          timestamp: new Date().toISOString()
        },
        { status: 200 }
      );
    }
    
    return NextResponse.json(
      { 
        response: "Üzgünüm, şu anda size yardım edemiyorum. Lütfen daha sonra tekrar deneyin.",
        timestamp: new Date().toISOString()
      },
      { status: 200 }
    );
  }
}
