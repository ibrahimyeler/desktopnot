"use client";

import { useState, useEffect } from 'react';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { productQuestionService, ProductQuestion } from '@/app/services/productQuestionService';
import toast from 'react-hot-toast';
import Image from 'next/image';

const ProductQuestions = () => {
  const [questions, setQuestions] = useState<ProductQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<ProductQuestion | null>(null);
  const [newQuestion, setNewQuestion] = useState({
    product_id: '',
    product_name: '',
    product_image: '',
    question: ''
  });

  // Soruları getir
  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const data = await productQuestionService.getUserProductQuestions();
      setQuestions(data);
    } catch (err) {
      toast.error('Sorular yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  // Yeni soru ekle
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await productQuestionService.createUserProductQuestion(newQuestion);
      toast.success('Sorunuz başarıyla eklendi');
      setNewQuestion({
        product_id: '',
        product_name: '',
        product_image: '',
        question: ''
      });
      fetchQuestions();
    } catch (err) {
      toast.error('Soru eklenirken bir hata oluştu');
    }
  };

  // Soru güncelle
  const handleUpdate = async () => {
    if (!editingQuestion) return;
    try {
      await productQuestionService.updateUserProductQuestion(editingQuestion.id, {
        question: editingQuestion.question
      });
      toast.success('Sorunuz başarıyla güncellendi');
      setEditingQuestion(null);
      fetchQuestions();
    } catch (err) {
      toast.error('Soru güncellenirken bir hata oluştu');
    }
  };

  // Soru sil
  const handleDelete = async (id: string) => {
    if (!confirm('Bu soruyu silmek istediğinizden emin misiniz?')) return;
    try {
      await productQuestionService.deleteUserProductQuestion(id);
      toast.success('Sorunuz başarıyla silindi');
      fetchQuestions();
    } catch (err) {
      toast.error('Soru silinirken bir hata oluştu');
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 bg-white rounded-lg border border-gray-200 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Ürün Sorularım</h2>

      {/* Yeni Soru Formu */}
      <form onSubmit={handleSubmit} className="mb-8 p-4 border rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Yeni Soru Sor</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Soru
            </label>
            <textarea
              value={newQuestion.question}
              onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F27A1A] focus:border-transparent"
              rows={3}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#F27A1A] text-white py-2 px-4 rounded-md hover:bg-[#F27A1A]/90 transition-colors"
          >
            Soru Sor
          </button>
        </div>
      </form>

      {/* Sorular Listesi */}
      <div className="space-y-6">
        {questions.map((question) => (
          <div key={question.id} className="border-b pb-6 last:border-b-0">
            {editingQuestion?.id === question.id ? (
              <div className="space-y-4">
                <textarea
                  value={editingQuestion.question}
                  onChange={(e) => setEditingQuestion({ ...editingQuestion, question: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F27A1A] focus:border-transparent"
                  rows={3}
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleUpdate}
                    className="bg-[#F27A1A] text-white py-2 px-4 rounded-md hover:bg-[#F27A1A]/90 transition-colors"
                  >
                    Kaydet
                  </button>
                  <button
                    onClick={() => setEditingQuestion(null)}
                    className="bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    İptal
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="relative w-16 h-16">
                      <Image
                        src={question.product_image}
                        alt={question.product_name}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{question.product_name}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(question.created_at).toLocaleDateString('tr-TR')}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setEditingQuestion(question)}
                      className="p-2 text-gray-500 hover:text-[#F27A1A] transition-colors"
                    >
                      <PencilIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(question.id)}
                      className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <p className="text-gray-600">{question.question}</p>
                {question.answer && (
                  <div className="mt-4 pl-4 border-l-2 border-gray-200">
                    <p className="text-sm text-gray-500">Satıcı Yanıtı:</p>
                    <p className="text-gray-600">{question.answer}</p>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductQuestions; 