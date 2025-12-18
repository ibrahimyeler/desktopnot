"use client";

import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { API_V1_URL } from '@/lib/config';
import toast from 'react-hot-toast';

interface AskOrderQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  orderNumber: string;
}

const orderOptions = [
  { name: "Tümü", slug: "all" },
  { name: "Eksik Ürün Talebi", slug: "missing_product" },
  { name: "Fatura Talebi", slug: "invoice_request" },
  { name: "Garanti Belgesi Talebi", slug: "warranty_request" },
  { name: "Hediye Paketi Talebi", slug: "gift_box_request" },
  { name: "Kurulum Belgesi Talebi", slug: "setup_request" },
  { name: "Kurumsal Fatura Talebi", slug: "corporate_invoice_request" },
  { name: "Kusurlu Ürün Talebi", slug: "damaged_product_request" },
  { name: "Satıcı Yorumu Desteği", slug: "seller_comment_support" },
  { name: "Sipariş İptali", slug: "order_cancellation" },
  { name: "Teslimat Durumu", slug: "delivery_status" },
  { name: "Ürün Yorumu Desteği", slug: "product_comment_support" },
  { name: "Yanlış Ürün Talebi", slug: "wrong_product_request" },
];

export default function AskOrderQuestionModal({ 
  isOpen, 
  onClose, 
  orderId, 
  orderNumber 
}: AskOrderQuestionModalProps) {
  const [question, setQuestion] = useState('');
  const [topic, setTopic] = useState('invoice_request');
  const [loading, setLoading] = useState(false);
  const [showName, setShowName] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!question.trim()) {
      toast.error('Lütfen bir soru yazın');
      return;
    }

    if (!acceptTerms) {
      toast.error('Lütfen şartları kabul edin');
      return;
    }

    try {
      setLoading(true);
      
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Lütfen önce giriş yapın');
        return;
      }

      const requestBody = {
        question: question.trim(),
        order_group_id: orderId,
        topic: topic.trim()
      };

      const response = await fetch(`${API_V1_URL}/customer/questions/user-order-question`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        let errorMessage = 'Soru gönderilirken bir hata oluştu';
        try {
          const errorData = await response.json();
          
          if (response.status === 404) {
            errorMessage = 'Sipariş bulunamadı. Lütfen sipariş numaranızı kontrol edin.';
          } else if (response.status === 401) {
            errorMessage = 'Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.';
          } else if (response.status === 403) {
            errorMessage = 'Bu işlem için yetkiniz bulunmuyor.';
          } else {
            errorMessage = errorData.meta?.message || errorData.message || errorMessage;
          }
        } catch (e) {
          if (response.status === 404) {
            errorMessage = 'Sipariş bulunamadı. Lütfen sipariş numaranızı kontrol edin.';
          }
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();

      if (data.meta?.status === 'success') {
        toast.success('Sorunuz başarıyla gönderildi');
        setQuestion('');
        setTopic('invoice_request');
        setShowName(false);
        setAcceptTerms(false);
        onClose();
      } else {
        throw new Error(data.meta?.message || 'Soru gönderilirken bir hata oluştu');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Soru gönderilirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto border border-orange-200">
        <div className="p-5">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-semibold text-black">Sipariş Hakkında Soru Sor</h3>
            <button
              onClick={onClose}
              className="text-black hover:text-gray-600"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          <div className="mb-5 p-3 bg-orange-50 rounded-lg border border-orange-200">
            <p className="text-xs font-medium text-black">
              <strong>Sipariş Numarası:</strong> #{orderNumber}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-black mb-1">
                Konu Seçin
              </label>
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full px-3 py-2 border border-orange-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-300 bg-white text-xs text-black"
                required
              >
                {orderOptions.map((option) => (
                  <option key={option.slug} value={option.slug}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-black mb-1">
                Sorunuz
              </label>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="w-full px-3 py-2 border border-orange-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-300 bg-white text-xs text-black"
                rows={3}
                placeholder="Siparişiniz hakkında detaylı sorunuzu yazın..."
                maxLength={2000}
                required
              />
              <p className="text-xs text-black mt-1">
                {question.length}/2000 karakter
              </p>
            </div>

            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={showName}
                  onChange={(e) => setShowName(e.target.checked)}
                  className="rounded border-orange-300 text-orange-600 focus:ring-orange-500"
                />
                <span className="ml-2 text-xs text-black">
                  Adımın görünmesine izin veriyorum
                </span>
              </label>

              <label className="flex items-start">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="rounded border-orange-300 text-orange-600 focus:ring-orange-500 mt-1"
                  required
                />
                <span className="ml-2 text-xs text-black">
                  <a href="/s/uyelik-kosullari" className="text-black underline">
                    Kullanım şartlarını
                  </a> kabul ediyorum
                </span>
              </label>
            </div>

            <div className="flex gap-2 pt-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-3 py-2 text-xs font-medium text-black bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                İptal
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-3 py-2 text-xs font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Gönderiliyor...' : 'Soru Gönder'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 