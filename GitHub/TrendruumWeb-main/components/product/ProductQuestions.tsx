"use client";

import React, { useState } from 'react';
import { StarIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/solid';

interface Question {
  id: string;
  question: string;
  answer?: string;
  userName: string;
  date: string;
  isAnswered: boolean;
  category?: string;
  likes?: number;
  dislikes?: number;
}

interface ProductQuestionsProps {
  productId?: string;
  questions: Question[];
  totalQuestions?: number;
  onShowAllQuestions?: () => void;
  loading?: boolean;
  sellerName?: string;
  onAskQuestion?: () => void; // Soru sorma modal'ını açmak için
}

export default function ProductQuestions({ 
  productId,
  questions, 
  totalQuestions = questions.length, 
  onShowAllQuestions,
  loading = false,
  sellerName = 'Satıcı',
  onAskQuestion
}: ProductQuestionsProps) {

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const displayedQuestions = questions;

  const handleShowAllQuestions = () => {
    if (onShowAllQuestions) {
      onShowAllQuestions();
    } else {
      // Ürün slug'ını al ve sorular sayfasına yönlendir
      const currentPath = window.location.pathname;
      const pathSegments = currentPath.split('/');
      
      // URL formatı: /urunler/[slug]/[id]
      // pathSegments: ['', 'urunler', 'slug', 'id']
      if (pathSegments.length >= 4 && pathSegments[1] === 'urunler') {
        const productSlug = pathSegments[2];
        const productId = pathSegments[3];
        window.location.href = `/urunler/${productSlug}/${productId}/sorular`;
      }
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center mb-4">
          <ChatBubbleLeftRightIcon className="w-6 h-6 text-gray-400 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Ürün Soru ve Cevapları</h3>
        </div>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Sorular yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <ChatBubbleLeftRightIcon className="w-5 h-5 text-gray-400 mr-2" />
            <h3 className="text-base font-semibold text-gray-900">Ürün Soru ve Cevapları</h3>
          </div>
          {onAskQuestion && (
            <button
              onClick={onAskQuestion}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-xs font-medium"
            >
              <ChatBubbleLeftRightIcon className="w-3.5 h-3.5" />
              Soru Sor
            </button>
          )}
        </div>
        <div className="text-center py-4">
          <ChatBubbleLeftRightIcon className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-500">Henüz soru sorulmamış</p>
          <p className="text-xs text-gray-400 mt-1">Bu ürün hakkında ilk soruyu siz sorun!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <ChatBubbleLeftRightIcon className="w-6 h-6 text-blue-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Ürün Soru ve Cevapları</h3>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-500">
              {totalQuestions} soru
            </div>
            {onAskQuestion && (
              <button
                onClick={onAskQuestion}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium"
              >
                <ChatBubbleLeftRightIcon className="w-4 h-4" />
                Soru Sor
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Questions Carousel */}
      <div className="relative p-6">
        {/* Navigation Buttons */}
        {questions.length > 3 && (
          <>
            <button
              onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 3))}
              disabled={currentQuestionIndex === 0}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => setCurrentQuestionIndex(Math.min(questions.length - 3, currentQuestionIndex + 3))}
              disabled={currentQuestionIndex >= questions.length - 3}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Questions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {questions.slice(currentQuestionIndex, currentQuestionIndex + 3).map((question) => (
            <div key={question.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              {/* Question */}
              <div className="mb-3">
                <p className="text-sm font-medium text-gray-900 mb-2">
                  {question.question}
                </p>
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <span>{question.userName}</span>
                  <span>•</span>
                  <span>{question.date}</span>
                </div>
              </div>

              {/* Answer */}
              {question.answer && (
                <div className="bg-white rounded-lg p-3 border border-gray-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-orange-600">{sellerName.charAt(0).toUpperCase()}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{sellerName} satıcısının cevabı</span>
                  </div>
                  <p className="text-sm text-gray-700">
                    {question.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

      </div>

      {/* Show All Questions Button - Container'ın alt çizgisinin ortasından geçsin */}
      {questions.length > 0 && (
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center">
            <button
              onClick={handleShowAllQuestions}
              className="inline-flex items-center justify-center px-6 py-3 bg-white text-gray-700 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200 font-medium shadow-sm"
            >
              <ChatBubbleLeftRightIcon className="w-4 h-4 mr-2" />
              TÜM SORULARI GÖSTER
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 