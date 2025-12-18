"use client";

import React, { useState, useEffect } from 'react';
import { XMarkIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/app/context/AuthContext';
import toast from 'react-hot-toast';

interface AskQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  productName: string;
  sellerName: string;
  onQuestionSubmitted?: () => void;
}

export default function AskQuestionModal({
  isOpen,
  onClose,
  productId,
  productName,
  sellerName,
  onQuestionSubmitted
}: AskQuestionModalProps) {
  const [question, setQuestion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isLoggedIn } = useAuth();

  // iOS Safari için body scroll lock
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      const body = document.body;
      const html = document.documentElement;
      
      body.style.position = 'fixed';
      body.style.top = `-${scrollY}px`;
      body.style.width = '100%';
      body.style.overflow = 'hidden';
      body.style.touchAction = 'none';
      (body.style as any).webkitOverflowScrolling = 'none';
      
      html.style.overflow = 'hidden';
      html.style.height = '100%';

      return () => {
        body.style.position = '';
        body.style.top = '';
        body.style.width = '';
        body.style.overflow = '';
        body.style.touchAction = '';
        (body.style as any).webkitOverflowScrolling = '';
        
        html.style.overflow = '';
        html.style.height = '';
        
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLoggedIn) {
      toast.error('Soru sormak için giriş yapmalısınız');
      // Guest kullanıcıları login sayfasına yönlendir
      window.location.href = '/giris';
      return;
    }

    if (!question.trim()) {
      toast.error('Lütfen sorunuzu yazın');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://api.trendruum.com/api/v1/customer/questions/user-product-question/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          product_id: productId,
          question: question.trim()
        })
      });

      const data = await response.json();

      if (response.ok && data.meta?.status === 'success') {
        toast.success('Sorunuz başarıyla gönderildi! Satıcı en kısa sürede cevaplayacaktır.');
        setQuestion('');
        onClose();
        if (onQuestionSubmitted) {
          onQuestionSubmitted();
        }
      } else {
        // API'den gelen hata mesajını göster
        const errorMessage = data.meta?.message || data.message || 'Soru gönderilirken bir hata oluştu';
        
        // Authentication hatası için özel mesaj
        if (response.status === 401 || errorMessage.includes('Unauthenticated')) {
          toast.error('Soru sormak için giriş yapmalısınız');
        } else {
          toast.error(errorMessage);
        }
      }
    } catch (error) {
      toast.error('Soru gönderilirken bir hata oluştu');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[999999] flex items-center justify-center"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100dvh',
        transform: 'translateZ(0)',
        WebkitTransform: 'translateZ(0)',
        isolation: 'isolate',
        WebkitBackfaceVisibility: 'hidden',
        backfaceVisibility: 'hidden',
        touchAction: 'pan-y',
        overscrollBehavior: 'contain'
      }}
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          height: '100dvh',
          touchAction: 'none'
        }}
      />
      
      {/* Modal */}
      <div 
        className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90dvh] overflow-y-auto"
        style={{
          maxHeight: '90dvh',
          WebkitOverflowScrolling: 'touch',
          overscrollBehavior: 'contain',
          paddingBottom: 'env(safe-area-inset-bottom, 0)'
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <ChatBubbleLeftRightIcon className="w-6 h-6 text-orange-500 mr-3" />
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                Ürün Hakkında Soru Sor
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {sellerName} satıcısına soru sorun
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <XMarkIcon className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Product Info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="text-xs sm:text-sm font-medium text-gray-900 mb-2">
              Ürün:
            </h3>
            <p className="text-sm text-gray-700">{productName}</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-2">
                Sorunuz *
              </label>
              <textarea
                id="question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ürün hakkında merak ettiğiniz soruyu yazın..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none text-gray-900"
                rows={4}
                maxLength={500}
                required
              />
              <div className="flex justify-between items-center mt-2">
                <p className="text-xs text-gray-500">
                  Sorunuz satıcıya iletilecek ve cevaplandığında size bildirim gönderilecektir.
                </p>
                <span className={`text-xs ${question.length > 450 ? 'text-orange-500' : 'text-gray-400'}`}>
                  {question.length}/500
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={isSubmitting}
              >
                İptal
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !question.trim()}
                className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Gönderiliyor...
                  </>
                ) : (
                  <>
                    <ChatBubbleLeftRightIcon className="w-4 h-4 mr-2" />
                    Soruyu Gönder
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
