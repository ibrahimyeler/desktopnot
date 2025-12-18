"use client";

import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

interface ContactFormProps {
  onSuccess?: () => void;
}

const ContactForm = ({ onSuccess }: ContactFormProps = {}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    privacy: false
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subjects, setSubjects] = useState<{[key: string]: string}>({});
  const [isLoadingSubjects, setIsLoadingSubjects] = useState(true);

  // Konu seçeneklerini yükle
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await fetch('https://api.trendruum.com/api/v1/contact/subjects', {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          setSubjects(data.data.subjects);
        } else {
          // Fallback olarak statik seçenekler
          setSubjects({
            'Genel Bilgi': 'Genel Bilgi',
            'Sipariş Takibi': 'Sipariş Takibi',
            'İade ve Değişim': 'İade ve Değişim',
            'Teknik Destek': 'Teknik Destek',
            'Öneri ve Şikayet': 'Öneri ve Şikayet',
            'Diğer': 'Diğer'
          });
        }
      } catch (error) {
        // Fallback olarak statik seçenekler
        setSubjects({
          'Genel Bilgi': 'Genel Bilgi',
          'Sipariş Takibi': 'Sipariş Takibi',
          'İade ve Değişim': 'İade ve Değişim',
          'Teknik Destek': 'Teknik Destek',
          'Öneri ve Şikayet': 'Öneri ve Şikayet',
          'Diğer': 'Diğer'
        });
      } finally {
        setIsLoadingSubjects(false);
      }
    };

    fetchSubjects();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });

    // Hata mesajını temizle
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Ad Soyad alanı zorunludur';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'E-posta alanı zorunludur';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Geçerli bir e-posta adresi giriniz';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefon alanı zorunludur';
    } else if (!/^(\+90|0)?[5][0-9]{9}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Geçerli bir telefon numarası giriniz';
    }

    if (!formData.subject) {
      newErrors.subject = 'Konu seçimi zorunludur';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Mesaj alanı zorunludur';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Mesaj en az 10 karakter olmalıdır';
    }

    if (!formData.privacy) {
      newErrors.privacy = 'Gizlilik politikasını kabul etmelisiniz';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Lütfen tüm zorunlu alanları doldurunuz');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('https://api.trendruum.com/api/v1/contact', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: formData.subject,
          message: formData.message,
          privacy_policy: formData.privacy
        })
      });

      const result = await response.json();

      if (response.ok && result.meta.status === 'success') {
        toast.success('Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.');
        
        // Formu temizle
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
          privacy: false
        });
        
        // Modal'ı kapat
        if (onSuccess) {
          setTimeout(() => {
            onSuccess();
          }, 1000);
        }
      } else {
        // API'den gelen hata mesajlarını göster
        if (result.errors) {
          const errorMessages = Object.values(result.errors).flat();
          toast.error(errorMessages.join(', '));
        } else {
          toast.error(result.meta.message || 'Mesaj gönderilirken bir hata oluştu.');
        }
      }
      
    } catch (error) {
      toast.error('Mesaj gönderilirken bir hata oluştu. Lütfen tekrar deneyiniz.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-full">
      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Ad Soyad *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Adınız ve soyadınız"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              E-posta *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="ornek@email.com"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              Telefon *
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                errors.phone ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="+90 (5XX) XXX XX XX"
            />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
          </div>

          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
              Konu *
            </label>
            <select
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              disabled={isLoadingSubjects}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                errors.subject ? 'border-red-500' : 'border-gray-300'
              } ${isLoadingSubjects ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            >
              <option value="">
                {isLoadingSubjects ? 'Konu seçenekleri yükleniyor...' : 'Konu seçiniz'}
              </option>
              {Object.entries(subjects).map(([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))}
            </select>
            {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
            Mesajınız *
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={6}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none ${
              errors.message ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Mesajınızı buraya yazınız..."
          />
          {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
        </div>

        <div className="flex items-start">
          <input
            type="checkbox"
            id="privacy"
            name="privacy"
            checked={formData.privacy}
            onChange={handleChange}
            className={`w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500 mt-1 ${
              errors.privacy ? 'border-red-500' : ''
            }`}
          />
          <div className="ml-2">
            <label htmlFor="privacy" className="text-sm text-gray-600">
              <a href="/s/gizlilik" className="text-orange-500 hover:underline">
                Gizlilik Politikası
              </a>
              'nı okudum ve kabul ediyorum. *
            </label>
            {errors.privacy && <p className="text-red-500 text-xs mt-1">{errors.privacy}</p>}
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
            isSubmitting 
              ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
              : 'bg-orange-500 text-white hover:bg-orange-600'
          }`}
        >
          {isSubmitting ? 'Gönderiliyor...' : 'Mesaj Gönder'}
        </button>
      </form>
    </div>
  );
};

export default ContactForm; 