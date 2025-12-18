"use client";

import { useState } from 'react';
import { ChatBubbleOvalLeftIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';

const TrendruumAsistan = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Merhaba! Trendruum Asistan ile görüşüyorsunuz. Size nasıl yardımcı olabilirim?",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const handleSendMessage = () => {
    if (inputMessage.trim() === '') return;

    const newMessage = {
      id: messages.length + 1,
      text: inputMessage,
      isBot: false,
      timestamp: new Date()
    };

    setMessages([...messages, newMessage]);
    setInputMessage('');

    // Simulate bot response
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        text: "Mesajınızı aldım. Size en kısa sürede yardımcı olmaya çalışacağım.",
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-t-2xl border-b-4 border-orange-500 p-6 mb-0">
          <div className="flex items-center space-x-4">
            <div className="bg-orange-500 rounded-full p-3">
              <ChatBubbleOvalLeftIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-black">Trendruum Asistan</h1>
              <p className="text-gray-600 mt-1">7/24 Size Yardımcı Olmaya Hazır</p>
            </div>
          </div>
        </div>

        {/* Chat Container */}
        <div className="bg-white rounded-b-2xl shadow-lg">
          {/* Messages Area */}
          <div className="h-96 overflow-y-auto p-6 space-y-4 border-b border-gray-200">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                    message.isBot
                      ? 'bg-orange-500 text-white'
                      : 'bg-black text-white'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <span className={`text-xs mt-1 block ${
                    message.isBot ? 'text-orange-100' : 'text-gray-300'
                  }`}>
                    {message.timestamp.toLocaleTimeString('tr-TR', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-6">
            <div className="flex space-x-4">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Mesajınızı yazın..."
                className="flex-1 border-2 border-gray-200 rounded-full px-6 py-3 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-colors"
              />
              <button
                onClick={handleSendMessage}
                disabled={inputMessage.trim() === ''}
                className={`bg-orange-500 text-white rounded-full p-3 transition-colors ${
                  inputMessage.trim() === ''
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-orange-600 active:bg-orange-700'
                }`}
              >
                <PaperAirplaneIcon className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="px-6 pb-6">
            <h3 className="text-lg font-semibold text-black mb-4">Hızlı Yardım</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <button className="bg-orange-50 border-2 border-orange-200 rounded-lg p-4 text-left hover:bg-orange-100 hover:border-orange-300 transition-colors">
                <h4 className="font-semibold text-black mb-2">📦 Sipariş Durumu</h4>
                <p className="text-sm text-gray-600">Siparişinizin durumunu öğrenin</p>
              </button>
              
              <button className="bg-orange-50 border-2 border-orange-200 rounded-lg p-4 text-left hover:bg-orange-100 hover:border-orange-300 transition-colors">
                <h4 className="font-semibold text-black mb-2">↩️ İade İşlemleri</h4>
                <p className="text-sm text-gray-600">İade sürecinizi başlatın</p>
              </button>
              
              <button className="bg-orange-50 border-2 border-orange-200 rounded-lg p-4 text-left hover:bg-orange-100 hover:border-orange-300 transition-colors">
                <h4 className="font-semibold text-black mb-2">💳 Ödeme Sorunları</h4>
                <p className="text-sm text-gray-600">Ödeme ile ilgili yardım alın</p>
              </button>
              
              <button className="bg-orange-50 border-2 border-orange-200 rounded-lg p-4 text-left hover:bg-orange-100 hover:border-orange-300 transition-colors">
                <h4 className="font-semibold text-black mb-2">👤 Hesap İşlemleri</h4>
                <p className="text-sm text-gray-600">Hesap ayarlarınızı yönetin</p>
              </button>
              
              <button className="bg-orange-50 border-2 border-orange-200 rounded-lg p-4 text-left hover:bg-orange-100 hover:border-orange-300 transition-colors">
                <h4 className="font-semibold text-black mb-2">🚚 Kargo Takibi</h4>
                <p className="text-sm text-gray-600">Kargonuzu takip edin</p>
              </button>
              
              <button className="bg-orange-50 border-2 border-orange-200 rounded-lg p-4 text-left hover:bg-orange-100 hover:border-orange-300 transition-colors">
                <h4 className="font-semibold text-black mb-2">❓ Genel Sorular</h4>
                <p className="text-sm text-gray-600">Sıkça sorulan sorular</p>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-6 text-center">
          <p className="text-gray-500 text-sm">
            Trendruum Asistan 7/24 hizmetinizdedir. Ortalama yanıt süresi: <span className="font-semibold text-orange-500">2-3 dakika</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default TrendruumAsistan; 