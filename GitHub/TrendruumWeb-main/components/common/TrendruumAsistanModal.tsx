"use client";

import { useState, Fragment, useEffect, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, ChatBubbleOvalLeftIcon, PaperAirplaneIcon, MinusIcon } from '@heroicons/react/24/outline';
import { API_BASE_URL } from '@/lib/config';

interface TrendruumAsistanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMinimize?: () => void;
}

const TrendruumAsistanModal = ({ isOpen, onClose, onMinimize }: TrendruumAsistanModalProps) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Merhaba! Trendruum Asistan ile görüşüyorsunuz. Size nasıl yardımcı olabilirim?",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (inputMessage.trim() === '' || isLoading) return;

    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

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

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      
      // API'den gelen response'u kontrol et
      if (data.error) {
        throw new Error(data.error);
      }
      
      const botMessage = {
        id: messages.length + 2,
        text: data.response || "Üzgünüm, şu anda size yardım edemiyorum. Lütfen daha sonra tekrar deneyin.",
        isBot: true,
        timestamp: new Date(data.timestamp || new Date().toISOString())
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error: any) {
      
      // Hata durumunda API'den gelen response'u kontrol et
      let errorText = "Üzgünüm, şu anda size yardım edemiyorum. Lütfen daha sonra tekrar deneyin.";
      
      try {
        // Eğer response varsa ve parse edilebiliyorsa
        if (error.response) {
          const errorData = await error.response.json();
          if (errorData.response) {
            errorText = errorData.response;
          }
        }
      } catch {
        // Response parse edilemezse varsayılan mesajı kullan
      }
      
      const errorMessage = {
        id: messages.length + 2,
        text: errorText,
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickHelp = (question: string) => {
    setInputMessage(question);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto pointer-events-none">
          <div className="flex min-h-full items-end justify-end p-2 sm:p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 translate-x-4"
              enterTo="opacity-100 translate-y-0 translate-x-0"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 translate-x-0"
              leaveTo="opacity-0 translate-y-4 translate-x-4"
            >
              <Dialog.Panel className="w-full max-w-sm sm:max-w-md transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all pointer-events-auto">
                {/* Header */}
                <div className="bg-white border-b-4 border-orange-500 p-4 sm:p-5 relative">
                  <button
                    type="button"
                    className="absolute top-3 right-8 text-gray-400 hover:text-gray-600 transition-colors p-1"
                    onClick={onMinimize}
                  >
                    <MinusIcon className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors p-1"
                    onClick={onClose}
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                  
                  <div className="flex items-center space-x-3 pr-16">
                    <div className="bg-orange-500 rounded-full p-2.5 sm:p-3">
                      <ChatBubbleOvalLeftIcon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h1 className="text-lg sm:text-xl font-bold text-black truncate">Trendruum Asistan</h1>
                      <p className="text-gray-600 text-sm sm:text-base">7/24 Hizmetinizdeyiz</p>
                    </div>
                  </div>
                </div>

                {/* Chat Container */}
                <div className="bg-white">
                  {/* Messages Area */}
                  <div className="h-64 sm:h-60 overflow-y-auto p-3 sm:p-4 space-y-3 border-b border-gray-200">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                      >
                        <div
                          className={`max-w-[85%] sm:max-w-xs px-3 py-2.5 rounded-xl ${
                            message.isBot
                              ? 'bg-orange-500 text-white'
                              : 'bg-black text-white'
                          }`}
                        >
                          <p className="text-sm sm:text-xs leading-relaxed">{message.text}</p>
                          <span className={`text-xs mt-1.5 block opacity-75 ${
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
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input Area */}
                  <div className="p-3 sm:p-4">
                    <div className="flex space-x-2 sm:space-x-3">
                      <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder={isLoading ? "Yanıt bekleniyor..." : "Mesajınızı yazın..."}
                        disabled={isLoading}
                        className="flex-1 border-2 border-gray-200 rounded-full px-3 sm:px-4 py-2.5 sm:py-2 text-sm text-black focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                      <button
                        onClick={handleSendMessage}
                        disabled={inputMessage.trim() === '' || isLoading}
                        className={`bg-orange-500 text-white rounded-full p-2.5 sm:p-2 transition-colors ${
                          inputMessage.trim() === '' || isLoading
                            ? 'opacity-50 cursor-not-allowed'
                            : 'hover:bg-orange-600 active:bg-orange-700'
                        }`}
                      >
                        {isLoading ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <PaperAirplaneIcon className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="px-3 sm:px-4 pb-4">
                    <h3 className="text-sm font-semibold text-black mb-3">Hızlı Yardım</h3>
                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                      <button 
                        onClick={() => handleQuickHelp("Sipariş durumumu nasıl öğrenebilirim?")}
                        className="bg-orange-50 border border-orange-200 rounded-lg p-2.5 sm:p-2 text-left hover:bg-orange-100 hover:border-orange-300 transition-colors"
                      >
                        <h4 className="font-medium text-black text-xs mb-1">📦 Sipariş</h4>
                        <p className="text-xs text-gray-600">Sipariş durumu</p>
                      </button>
                      
                      <button 
                        onClick={() => handleQuickHelp("İade işlemi nasıl yapılır?")}
                        className="bg-orange-50 border border-orange-200 rounded-lg p-2.5 sm:p-2 text-left hover:bg-orange-100 hover:border-orange-300 transition-colors"
                      >
                        <h4 className="font-medium text-black text-xs mb-1">↩️ İade</h4>
                        <p className="text-xs text-gray-600">İade işlemleri</p>
                      </button>
                      
                      <button 
                        onClick={() => handleQuickHelp("Ödeme ile ilgili sorun yaşıyorum, yardım eder misiniz?")}
                        className="bg-orange-50 border border-orange-200 rounded-lg p-2.5 sm:p-2 text-left hover:bg-orange-100 hover:border-orange-300 transition-colors"
                      >
                        <h4 className="font-medium text-black text-xs mb-1">💳 Ödeme</h4>
                        <p className="text-xs text-gray-600">Ödeme yardımı</p>
                      </button>
                      
                      <button 
                        onClick={() => handleQuickHelp("Kargo takip numaramı nasıl öğrenebilirim?")}
                        className="bg-orange-50 border border-orange-200 rounded-lg p-2.5 sm:p-2 text-left hover:bg-orange-100 hover:border-orange-300 transition-colors"
                      >
                        <h4 className="font-medium text-black text-xs mb-1">🚚 Kargo</h4>
                        <p className="text-xs text-gray-600">Kargo takibi</p>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Footer Info */}
                <div className="bg-gray-50 px-3 sm:px-4 py-3 text-center border-t border-gray-200">
                  <p className="text-gray-500 text-xs">
                    7/24 hizmetinizdeyiz. Yanıt süresi: <span className="font-semibold text-orange-500">2-3 dk</span>
                  </p>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default TrendruumAsistanModal;
