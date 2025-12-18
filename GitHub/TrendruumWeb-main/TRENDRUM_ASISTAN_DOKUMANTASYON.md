# 🤖 Trendruum Asistanı - Detaylı Dokümantasyon

Bu dokümantasyon, Trendruum Asistanı'nın nasıl göründüğünü, nasıl çalıştığını ve tüm teknik detaylarını açıklamaktadır.

---

## 📋 İçindekiler

1. [Genel Bakış](#genel-bakış)
2. [Sayfa Yapısı ve Görünüm](#sayfa-yapısı-ve-görünüm)
3. [Component Yapısı](#component-yapısı)
4. [API Entegrasyonu](#api-entegrasyonu)
5. [Çalışma Mantığı](#çalışma-mantığı)
6. [State Yönetimi](#state-yönetimi)
7. [Akış Diyagramları](#akış-diyagramları)
8. [Özellikler ve Limitler](#özellikler-ve-limitler)

---

## 🔍 Genel Bakış

**Açıklama:** Trendruum Asistanı, OpenAI GPT-3.5-turbo modelini kullanarak kullanıcılara 7/24 müşteri hizmetleri desteği sağlayan bir chatbot sistemidir.

**Kullanım Yerleri:**
- Hesabım sayfası (AccountSidebar'dan açılır)
- Yardım-Destek sayfaları
- Minimize edilmiş buton (sağ alt köşe)

**Teknoloji:**
- **AI Model:** OpenAI GPT-3.5-turbo
- **Backend:** Next.js API Route (`/api/chat`)
- **Frontend:** React + Headless UI (Dialog/Transition)
- **State Management:** React useState

**Dosya Yapısı:**
- Modal Component: `components/common/TrendruumAsistanModal.tsx`
- Minimize Button: `components/common/MinimizedAsistanButton.tsx`
- Yardım-Destek Component: `components/yardim-destek/trendruum-asistan/TrendruumAsistan.tsx`
- API Endpoint: `app/api/chat/route.ts`
- Yardım Kartı: `components/account/AssistantHelp.tsx`

---

## 📄 Sayfa Yapısı ve Görünüm

### Modal Görünümü (Desktop)

```
┌─────────────────────────────────────────┐
│  [─] [×]                                │
│  💬 Trendruum Asistan                   │
│      7/24 Hizmetinizdeyiz               │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ 💬 Merhaba! Trendruum Asistan    │   │
│  │    ile görüşüyorsunuz. Size      │   │
│  │    nasıl yardımcı olabilirim?    │   │
│  │    14:30                         │   │
│  └─────────────────────────────────┘   │
│                                         │
│              ┌─────────────────────┐   │
│              │ Kullanıcı mesajı    │   │
│              │ 14:31               │   │
│              └─────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ 💬 Bot yanıtı burada görünür    │   │
│  │    14:32                         │   │
│  └─────────────────────────────────┘   │
│                                         │
├─────────────────────────────────────────┤
│  [Mesajınızı yazın...] [✈️]            │
├─────────────────────────────────────────┤
│  Hızlı Yardım                           │
│  ┌──────────┐ ┌──────────┐            │
│  │ 📦 Sipariş│ │ ↩️ İade   │            │
│  │ Sipariş  │ │ İade     │            │
│  │ durumu   │ │ işlemleri│            │
│  └──────────┘ └──────────┘            │
│  ┌──────────┐ ┌──────────┐            │
│  │ 💳 Ödeme │ │ 🚚 Kargo  │            │
│  │ Ödeme    │ │ Kargo    │            │
│  │ yardımı  │ │ takibi   │            │
│  └──────────┘ └──────────┘            │
├─────────────────────────────────────────┤
│  7/24 hizmetinizdeyiz. Yanıt süresi:   │
│  2-3 dk                                 │
└─────────────────────────────────────────┘
```

### Modal Görünümü (Mobile)

```
┌──────────────────────────┐
│  [─] [×]                 │
│  💬 Trendruum Asistan     │
│     7/24 Hizmetinizdeyiz │
├──────────────────────────┤
│                          │
│  ┌───────────────────┐  │
│  │ 💬 Merhaba! ...   │  │
│  │    14:30          │  │
│  └───────────────────┘  │
│                          │
│        ┌─────────────┐  │
│        │ Kullanıcı   │  │
│        │ 14:31       │  │
│        └─────────────┘  │
│                          │
├──────────────────────────┤
│  [Mesaj...] [✈️]         │
├──────────────────────────┤
│  Hızlı Yardım            │
│  ┌──────┐ ┌──────┐      │
│  │ 📦   │ │ ↩️   │      │
│  └──────┘ └──────┘      │
│  ┌──────┐ ┌──────┐      │
│  │ 💳   │ │ 🚚   │      │
│  └──────┘ └──────┘      │
└──────────────────────────┘
```

### Minimize Edilmiş Buton

```
┌─────────────────────────────┐
│  💬 Trendruum Asistan        │
│  (Sağ alt köşe, fixed)       │
└─────────────────────────────┘
```

### Yardım-Destek Sayfası Görünümü

```
┌─────────────────────────────────────────┐
│  💬 Trendruum Asistan                    │
│     7/24 Size Yardımcı Olmaya Hazır     │
├─────────────────────────────────────────┤
│                                         │
│  [Mesaj alanı - daha büyük]            │
│                                         │
│  Hızlı Yardım                           │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐│
│  │ 📦       │ │ ↩️       │ │ 💳       ││
│  │ Sipariş  │ │ İade     │ │ Ödeme    ││
│  └──────────┘ └──────────┘ └──────────┘│
│  ┌──────────┐ ┌──────────┐ ┌──────────┐│
│  │ 👤       │ │ 🚚       │ │ ❓       ││
│  │ Hesap    │ │ Kargo    │ │ Genel    ││
│  └──────────┘ └──────────┘ └──────────┘│
└─────────────────────────────────────────┘
```

---

## 🧩 Component Yapısı

### 1. TrendruumAsistanModal

**Dosya:** `components/common/TrendruumAsistanModal.tsx`

**Açıklama:** Ana modal component. Hesabım sayfasından açılır.

**Props:**
```typescript
interface TrendruumAsistanModalProps {
  isOpen: boolean;           // Modal açık mı?
  onClose: () => void;       // Modal kapatma callback'i
  onMinimize?: () => void;   // Modal minimize etme callback'i
}
```

**Özellikler:**
- ✅ Headless UI Dialog kullanır
- ✅ Transition animasyonları
- ✅ Mesaj geçmişi yönetimi
- ✅ API entegrasyonu
- ✅ Loading state
- ✅ Hızlı yardım butonları
- ✅ Otomatik scroll (yeni mesaj geldiğinde)
- ✅ Enter tuşu ile mesaj gönderme

**State'ler:**
```typescript
const [messages, setMessages] = useState([...]);  // Mesaj listesi
const [inputMessage, setInputMessage] = useState('');  // Input değeri
const [isLoading, setIsLoading] = useState(false);  // Loading durumu
const messagesEndRef = useRef<HTMLDivElement>(null);  // Scroll için ref
```

**Başlangıç Mesajı:**
```typescript
{
  id: 1,
  text: "Merhaba! Trendruum Asistan ile görüşüyorsunuz. Size nasıl yardımcı olabilirim?",
  isBot: true,
  timestamp: new Date()
}
```

### 2. MinimizedAsistanButton

**Dosya:** `components/common/MinimizedAsistanButton.tsx`

**Açıklama:** Modal minimize edildiğinde gösterilen buton.

**Props:**
```typescript
interface MinimizedAsistanButtonProps {
  onMaximize: () => void;  // Modal'ı tekrar açma callback'i
}
```

**Görünüm:**
- Sağ alt köşede fixed pozisyon
- Turuncu arka plan
- Chat icon + "Trendruum Asistan" yazısı
- Hover efekti

### 3. TrendruumAsistan (Yardım-Destek Sayfası)

**Dosya:** `components/yardim-destek/trendruum-asistan/TrendruumAsistan.tsx`

**Açıklama:** Yardım-destek sayfalarında kullanılan standalone component.

**Özellikler:**
- Modal değil, sayfa içinde gösterilir
- Daha büyük mesaj alanı
- Simüle edilmiş bot yanıtları (gerçek API kullanmıyor)
- 6 adet hızlı yardım butonu

**Not:** Bu component gerçek API kullanmıyor, sadece UI gösterimi için.

### 4. AssistantHelp

**Dosya:** `components/account/AssistantHelp.tsx`

**Açıklama:** Hesap sayfasında gösterilen yardım kartı.

**Görünüm:**
- Turuncu arka plan
- Chat icon
- "Trendruum Asistan'a Sor" başlığı
- "7/24 Sorularınızı Cevaplar" alt yazısı
- Link: `/account/assistant` (muhtemelen henüz oluşturulmamış)

---

## 🔌 API Entegrasyonu

### Endpoint: `POST /api/chat`

**Dosya:** `app/api/chat/route.ts`

**Açıklama:** OpenAI GPT-3.5-turbo modelini kullanarak chatbot yanıtları üretir.

**Request Body:**
```json
{
  "message": "Sipariş durumumu nasıl öğrenebilirim?",
  "conversationHistory": [
    {
      "id": 1,
      "text": "Merhaba! Trendruum Asistan ile görüşüyorsunuz...",
      "isBot": true,
      "timestamp": "2024-01-01T12:00:00.000Z"
    },
    {
      "id": 2,
      "text": "Sipariş durumumu nasıl öğrenebilirim?",
      "isBot": false,
      "timestamp": "2024-01-01T12:01:00.000Z"
    }
  ]
}
```

**Response (Başarılı):**
```json
{
  "response": "Sipariş durumunuzu öğrenmek için hesabım sayfasından 'Siparişlerim' bölümüne gidebilirsiniz...",
  "timestamp": "2024-01-01T12:01:30.000Z"
}
```

**Response (API Key Yok):**
```json
{
  "response": "Merhaba! Şu anda asistanımız bakımda. Lütfen daha sonra tekrar deneyin.",
  "timestamp": "2024-01-01T12:01:30.000Z"
}
```

**Response (Hata):**
```json
{
  "error": "Internal server error"
}
```

**Status Codes:**
- `200` - Başarılı
- `400` - Message eksik
- `500` - Server hatası

### OpenAI Konfigürasyonu

**Model:** `gpt-3.5-turbo`

**Parametreler:**
```typescript
{
  model: "gpt-3.5-turbo",
  messages: [...],  // System + conversation history + user message
  max_tokens: 500,  // Maksimum yanıt uzunluğu
  temperature: 0.7  // Yaratıcılık seviyesi (0-1)
}
```

**System Prompt:**
```
Sen Trendruum e-ticaret platformunun müşteri hizmetleri asistanısın. 
Türkçe konuşuyorsun ve kullanıcılara sipariş, iade, ödeme, kargo gibi konularda yardım ediyorsun.
Kısa, net ve yardımcı cevaplar ver. Trendruum markasına uygun profesyonel bir dil kullan.
Eğer kullanıcı sipariş durumu soruyorsa, hesabım sayfasından kontrol edebileceğini söyle.
İade işlemleri için müşteri hizmetleri ile iletişime geçmesini öner.
Ödeme sorunları için banka ile iletişime geçmesini veya farklı ödeme yöntemi denemesini öner.
```

**Environment Variable:**
```env
OPENAI_API_KEY=sk-...
```

---

## ⚙️ Çalışma Mantığı

### 1. Modal Açılma

**Yer:** `components/account/AccountSidebar.tsx`

**Akış:**
```typescript
// State tanımlama
const [showAsistanModal, setShowAsistanModal] = useState(false);
const [isAsistanMinimized, setIsAsistanMinimized] = useState(false);

// Buton tıklama
<button
  onClick={() => {
    setShowAsistanModal(true);
    setIsAsistanMinimized(false);
  }}
>
  Trendruum Asistan
</button>

// Modal render
<TrendruumAsistanModal 
  isOpen={showAsistanModal} 
  onClose={() => setShowAsistanModal(false)}
  onMinimize={() => {
    setShowAsistanModal(false);
    setIsAsistanMinimized(true);
  }}
/>
```

### 2. Mesaj Gönderme

**Akış:**
```typescript
const handleSendMessage = async () => {
  // 1. Validasyon
  if (inputMessage.trim() === '' || isLoading) return;

  // 2. Kullanıcı mesajını state'e ekle
  const userMessage = {
    id: messages.length + 1,
    text: inputMessage,
    isBot: false,
    timestamp: new Date()
  };
  setMessages(prev => [...prev, userMessage]);
  setInputMessage('');
  setIsLoading(true);

  // 3. API'ye istek gönder
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: inputMessage,
        conversationHistory: messages
      }),
    });

    // 4. Yanıtı al ve state'e ekle
    const data = await response.json();
    const botMessage = {
      id: messages.length + 2,
      text: data.response,
      isBot: true,
      timestamp: new Date(data.timestamp)
    };
    setMessages(prev => [...prev, botMessage]);
  } catch (error) {
    // 5. Hata durumunda hata mesajı göster
    const errorMessage = {
      id: messages.length + 2,
      text: "Üzgünüm, şu anda size yardım edemiyorum. Lütfen daha sonra tekrar deneyin.",
      isBot: true,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, errorMessage]);
  } finally {
    setIsLoading(false);
  }
};
```

### 3. API İşleme (Backend)

**Akış:**
```typescript
export async function POST(request: NextRequest) {
  // 1. API key kontrolü
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({
      response: "Merhaba! Şu anda asistanımız bakımda...",
      timestamp: new Date().toISOString()
    });
  }

  // 2. Request body'yi parse et
  const body = await request.json();
  const { message, conversationHistory = [] } = body;

  // 3. Conversation context'i oluştur
  const messages = [
    {
      role: 'system',
      content: 'Sen Trendruum e-ticaret platformunun...'
    },
    ...conversationHistory.map((msg: any) => ({
      role: msg.isBot ? 'assistant' : 'user',
      content: msg.text
    })),
    {
      role: 'user',
      content: message
    }
  ];

  // 4. OpenAI API'ye istek gönder
  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages,
    max_tokens: 500,
    temperature: 0.7,
  });

  // 5. Yanıtı döndür
  const botResponse = completion.choices[0]?.message?.content || 'Üzgünüm...';
  return NextResponse.json({
    response: botResponse,
    timestamp: new Date().toISOString()
  });
}
```

### 4. Hızlı Yardım Butonları

**Butonlar:**
1. **📦 Sipariş** - "Sipariş durumumu nasıl öğrenebilirim?"
2. **↩️ İade** - "İade işlemi nasıl yapılır?"
3. **💳 Ödeme** - "Ödeme ile ilgili sorun yaşıyorum, yardım eder misiniz?"
4. **🚚 Kargo** - "Kargo takip numaramı nasıl öğrenebilirim?"

**Çalışma:**
```typescript
const handleQuickHelp = (question: string) => {
  setInputMessage(question);  // Input alanına soruyu yaz
  // Kullanıcı Enter'a basabilir veya gönder butonuna tıklayabilir
};
```

### 5. Otomatik Scroll

**Mantık:**
```typescript
const messagesEndRef = useRef<HTMLDivElement>(null);

const scrollToBottom = () => {
  messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
};

useEffect(() => {
  scrollToBottom();  // Her yeni mesaj geldiğinde scroll yap
}, [messages]);
```

### 6. Minimize/Maximize

**Minimize:**
```typescript
// Modal'ı kapat
onMinimize={() => {
  setShowAsistanModal(false);
  setIsAsistanMinimized(true);
}}
```

**Maximize:**
```typescript
// Minimize butonuna tıklama
<MinimizedAsistanButton 
  onMaximize={() => {
    setShowAsistanModal(true);
    setIsAsistanMinimized(false);
  }}
/>
```

---

## 📊 State Yönetimi

### TrendruumAsistanModal State

```typescript
// Mesaj listesi
const [messages, setMessages] = useState([
  {
    id: 1,
    text: "Merhaba! Trendruum Asistan ile görüşüyorsunuz...",
    isBot: true,
    timestamp: new Date()
  }
]);

// Input değeri
const [inputMessage, setInputMessage] = useState('');

// Loading durumu
const [isLoading, setIsLoading] = useState(false);

// Scroll için ref
const messagesEndRef = useRef<HTMLDivElement>(null);
```

### AccountSidebar State

```typescript
// Modal açık/kapalı
const [showAsistanModal, setShowAsistanModal] = useState(false);

// Minimize durumu
const [isAsistanMinimized, setIsAsistanMinimized] = useState(false);
```

### Mesaj Formatı

```typescript
interface Message {
  id: number;              // Unique ID
  text: string;            // Mesaj içeriği
  isBot: boolean;          // Bot mesajı mı?
  timestamp: Date;         // Zaman damgası
}
```

---

## 🔄 Akış Diyagramları

### Mesaj Gönderme Akışı

```
Kullanıcı mesaj yazar
    ↓
Enter tuşuna basar veya gönder butonuna tıklar
    ↓
handleSendMessage() çağrılır
    ↓
Validasyon (boş mu? loading mi?)
    ├─ Evet → İşlem durdurulur
    └─ Hayır → Devam
        ↓
Kullanıcı mesajı state'e eklenir
    ↓
Input temizlenir
    ↓
Loading state = true
    ↓
POST /api/chat isteği gönderilir
    ├─ Request Body:
    │   - message: "Kullanıcı mesajı"
    │   - conversationHistory: [tüm mesajlar]
    ↓
API İşleme:
    ├─ API key kontrolü
    │   ├─ Yok → Bakım mesajı döndür
    │   └─ Var → Devam
    │       ↓
    │   Conversation context oluşturulur
    │       - System prompt
    │       - Conversation history
    │       - User message
    │       ↓
    │   OpenAI API'ye istek gönderilir
    │       - Model: gpt-3.5-turbo
    │       - Max tokens: 500
    │       - Temperature: 0.7
    │       ↓
    │   Bot yanıtı alınır
    ↓
Response alınır
    ├─ Başarılı → Bot mesajı state'e eklenir
    └─ Hata → Hata mesajı state'e eklenir
    ↓
Loading state = false
    ↓
Otomatik scroll (yeni mesaj görünür)
```

### Modal Açılma/Kapanma Akışı

```
Kullanıcı "Trendruum Asistan" butonuna tıklar
    ↓
AccountSidebar'da onClick handler çalışır
    ↓
setShowAsistanModal(true)
setIsAsistanMinimized(false)
    ↓
TrendruumAsistanModal render edilir
    ↓
Headless UI Dialog açılır (Transition animasyonu)
    ↓
Kullanıcı mesajlaşır
    ↓
Kullanıcı minimize butonuna tıklar
    ├─ onMinimize() çağrılır
    ├─ setShowAsistanModal(false)
    ├─ setIsAsistanMinimized(true)
    └─ MinimizedAsistanButton gösterilir
    ↓
Kullanıcı minimize butonuna tıklar
    ├─ onMaximize() çağrılır
    ├─ setShowAsistanModal(true)
    ├─ setIsAsistanMinimized(false)
    └─ Modal tekrar açılır
    ↓
Kullanıcı kapat butonuna tıklar
    ├─ onClose() çağrılır
    ├─ setShowAsistanModal(false)
    └─ Modal kapanır
```

### Hızlı Yardım Akışı

```
Kullanıcı hızlı yardım butonuna tıklar
    ↓
handleQuickHelp(question) çağrılır
    ↓
setInputMessage(question)
    ↓
Input alanına soru yazılır
    ↓
Kullanıcı Enter'a basar veya gönder butonuna tıklar
    ↓
handleSendMessage() çağrılır
    ↓
Normal mesaj gönderme akışı başlar
```

---

## 🎨 UI/UX Özellikleri

### Mesaj Görünümü

**Bot Mesajı:**
- Arka plan: Turuncu (`bg-orange-500`)
- Metin: Beyaz
- Konum: Sol taraf
- Zaman: Turuncu açık ton (`text-orange-100`)

**Kullanıcı Mesajı:**
- Arka plan: Siyah (`bg-black`)
- Metin: Beyaz
- Konum: Sağ taraf
- Zaman: Gri açık ton (`text-gray-300`)

**Zaman Formatı:**
```typescript
message.timestamp.toLocaleTimeString('tr-TR', { 
  hour: '2-digit', 
  minute: '2-digit' 
})
// Örnek: "14:30"
```

### Input Alanı

**Özellikler:**
- Placeholder: "Mesajınızı yazın..." (normal) / "Yanıt bekleniyor..." (loading)
- Disabled: Loading durumunda
- Enter tuşu: Mesaj gönderir
- Focus: Turuncu border (`focus:border-orange-500`)

**Gönder Butonu:**
- Normal: PaperAirplaneIcon
- Loading: Spinner animasyonu
- Disabled: Opacity 50%, cursor not-allowed

### Hızlı Yardım Butonları

**Görünüm:**
- Grid layout: 2x2 (mobile) / 2x2 (desktop)
- Arka plan: Turuncu açık (`bg-orange-50`)
- Border: Turuncu (`border-orange-200`)
- Hover: Daha koyu turuncu (`hover:bg-orange-100`)

**İçerik:**
- Emoji icon
- Başlık (kısa)
- Açıklama (kısa)

### Loading State

**Gösterim:**
- Input disabled
- Placeholder değişir: "Yanıt bekleniyor..."
- Gönder butonunda spinner
- Mesaj gönderilemez

### Error State

**Gösterim:**
- Bot mesajı olarak hata mesajı gösterilir
- Mesaj: "Üzgünüm, şu anda size yardım edemiyorum. Lütfen daha sonra tekrar deneyin."

---

## 🔒 Güvenlik ve Hata Yönetimi

### API Key Kontrolü

**Backend:**
```typescript
if (!process.env.OPENAI_API_KEY) {
  return NextResponse.json({
    response: "Merhaba! Şu anda asistanımız bakımda. Lütfen daha sonra tekrar deneyin.",
    timestamp: new Date().toISOString()
  });
}
```

**Frontend:**
- API key yoksa kullanıcıya bakım mesajı gösterilir
- Hata durumunda kullanıcıya bilgilendirme yapılır

### Hata Senaryoları

**1. API Key Yok:**
- Response: Bakım mesajı
- Status: 200 (kullanıcıya hata göstermemek için)

**2. Network Hatası:**
- Catch bloğu çalışır
- Hata mesajı gösterilir
- Loading state kapatılır

**3. API Hatası:**
- Response.ok kontrolü
- Hata mesajı gösterilir

**4. Mesaj Eksik:**
- Status: 400
- Error: "Message is required"

---

## 📱 Responsive Tasarım

### Desktop (≥ 640px)

- Modal genişliği: `max-w-md` (448px)
- Mesaj alanı yüksekliği: `h-60` (240px)
- Padding: `p-4 sm:p-5`
- Font boyutları: Daha büyük

### Mobile (< 640px)

- Modal genişliği: `max-w-sm` (384px)
- Mesaj alanı yüksekliği: `h-64` (256px)
- Padding: `p-3 sm:p-4`
- Font boyutları: Daha küçük
- Hızlı yardım butonları: 2x2 grid

---

## 🎯 Özellikler

### ✅ Mevcut Özellikler

1. **AI Destekli Chatbot:**
   - OpenAI GPT-3.5-turbo entegrasyonu
   - Context-aware yanıtlar
   - Türkçe dil desteği

2. **Conversation History:**
   - Tüm mesajlar context olarak gönderilir
   - Bot konuşma geçmişini hatırlar

3. **Hızlı Yardım Butonları:**
   - 4 adet önceden tanımlı soru
   - Tek tıkla soru gönderme

4. **Minimize/Maximize:**
   - Modal minimize edilebilir
   - Minimize butonu sağ alt köşede

5. **Otomatik Scroll:**
   - Yeni mesaj geldiğinde otomatik scroll
   - Smooth animasyon

6. **Loading State:**
   - Gönder butonunda spinner
   - Input disabled durumu

7. **Error Handling:**
   - Hata durumlarında kullanıcıya bilgilendirme
   - Graceful degradation

8. **Responsive:**
   - Mobile ve desktop için optimize
   - Touch-friendly butonlar

### ❌ Eksik Özellikler (İyileştirme Önerileri)

1. **Mesaj Geçmişi Saklama:**
   - LocalStorage'da saklanmıyor
   - Sayfa yenilendiğinde kaybolur

2. **Dosya Gönderme:**
   - Resim/PDF gönderme yok

3. **Sesli Mesaj:**
   - Ses kaydı gönderme yok

4. **Emoji Picker:**
   - Emoji seçici yok

5. **Mesaj Düzenleme:**
   - Gönderilen mesajlar düzenlenemez

6. **Mesaj Silme:**
   - Mesaj silme özelliği yok

7. **Kopyalama:**
   - Mesaj kopyalama yok

8. **Paylaşma:**
   - Konuşma paylaşma yok

---

## 📊 Performans

### API İstekleri

**Her Mesaj İçin:**
- 1 POST isteği `/api/chat`
- OpenAI API'ye 1 istek
- Ortalama yanıt süresi: 2-3 saniye

**Optimizasyon:**
- Conversation history gönderilir (context için)
- Max tokens: 500 (kısa yanıtlar)
- Temperature: 0.7 (tutarlı yanıtlar)

### State Güncellemeleri

- Her mesaj state'e eklenir
- Re-render: Mesaj sayısı kadar
- Optimizasyon: React.memo kullanılabilir

---

## 🔧 Konfigürasyon

### Environment Variables

```env
# .env.local
OPENAI_API_KEY=sk-...
```

### API Parametreleri

```typescript
{
  model: "gpt-3.5-turbo",  // Model seçimi
  max_tokens: 500,          // Maksimum yanıt uzunluğu
  temperature: 0.7          // Yaratıcılık (0-1)
}
```

### System Prompt

System prompt değiştirilerek asistanın davranışı özelleştirilebilir:
- Dil stili
- Yardım konuları
- Yönlendirmeler

---

## 📚 İlgili Dosyalar

- `components/common/TrendruumAsistanModal.tsx` - Ana modal component
- `components/common/MinimizedAsistanButton.tsx` - Minimize butonu
- `components/yardim-destek/trendruum-asistan/TrendruumAsistan.tsx` - Yardım-destek sayfası component
- `app/api/chat/route.ts` - API endpoint
- `components/account/AccountSidebar.tsx` - Modal'ı açan component
- `components/account/AssistantHelp.tsx` - Yardım kartı

---

## 🚀 İyileştirme Önerileri

1. **Mesaj Geçmişi Saklama:**
   - LocalStorage'da saklama
   - Sayfa yenilendiğinde geri yükleme

2. **Rate Limiting:**
   - Kullanıcı başına istek limiti
   - Spam önleme

3. **Typing Indicator:**
   - Bot yazıyor göstergesi
   - Daha iyi UX

4. **Mesaj Timestamp:**
   - Tarih bilgisi ekleme
   - "Bugün", "Dün" formatı

5. **Mesaj Arama:**
   - Geçmiş mesajlarda arama
   - Filtreleme

6. **Çoklu Dil:**
   - İngilizce desteği
   - Dil seçimi

7. **Analytics:**
   - Mesaj sayısı takibi
   - En çok sorulan sorular

8. **Feedback:**
   - Mesaj beğeni/beğenmeme
   - İyileştirme önerileri

---

**Son Güncelleme:** 2024

