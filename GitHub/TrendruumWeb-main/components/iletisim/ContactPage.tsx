"use client";

import React from 'react';
import Header from '@/components/layout/Header';
import ScrollToTop from '@/components/ui/ScrollToTop';
import CustomerServices from './CustomerServices';
import AddressInfo from './AddressInfo';
import EmailInfo from './EmailInfo';
import MapComponent from './MapComponent';
import ContactForm from './ContactForm';

const ContactPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header showBackButton={true} onBackClick={() => window.history.back()} />
      
      <main className="flex-grow pb-4 md:pb-0 pt-24 md:pt-8">
        {/* Hero Section */}
        <div className="w-full px-4 md:px-5 relative pt-4 md:pt-0">
          <div 
            className="h-64 md:h-80 lg:h-96 rounded-lg relative overflow-hidden bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: 'url(/bg-trendruum.png)'
            }}
          >
            <div className="absolute inset-0 bg-black/40"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white px-4">
                <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-2">
                  İletişim
                </h1>
                <p className="text-base md:text-lg lg:text-xl opacity-90">
                  Sorularınız için bizimle iletişime geçebilirsiniz
                </p>
              </div>
            </div>
          </div>
          
          {/* Breadcrumb */}
          <div className="absolute top-4 left-4 md:left-10">
            <div className="text-white text-xs md:text-sm">
              <span 
                className="hover:text-orange-300 cursor-pointer transition-colors"
                onClick={() => window.location.href = '/'}
              >
                Anasayfa
              </span>
              <span className="mx-2">/</span>
              <span>İletişim</span>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-2 sm:px-3 lg:px-4 xl:px-6 2xl:px-8 py-4 sm:py-6 lg:py-8">
          <div className="max-w-7xl mx-auto">
            {/* Contact Info Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-6 sm:mb-8">
              <CustomerServices />
              <AddressInfo />
              <EmailInfo />
            </div>
            
            {/* Contact Form and Map Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              <div className="lg:col-span-2 h-full">
                <ContactForm />
              </div>
              <div className="lg:col-span-1 h-full">
                <MapComponent />
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <ScrollToTop />
    </div>
  );
};

export default ContactPage; 