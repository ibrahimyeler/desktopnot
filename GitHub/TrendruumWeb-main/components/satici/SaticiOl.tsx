"use client";

import React from 'react';
import Link from 'next/link';

const SaticiOl = () => {
  return (
    <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12 lg:py-16 pt-24 md:pt-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Main Content */}
          <div className="space-y-8 text-center">
            {/* Main Headline */}
            <div className="space-y-4">
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 leading-tight">
                Trendruum'da hemen satıcı ol
              </h1>
              <p className="text-lg lg:text-xl text-gray-700">
                Ürünlerini milyonlarca müşteriye ulaştır!
              </p>
            </div>

            {/* Call to Action Buttons */}
            <div className="flex justify-center">
              <a
                href="https://seller.trendruum.com/onboarding/satici-formu/pazaryeri"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-4 bg-orange-400 text-white font-semibold rounded-lg hover:bg-orange-500 transition-colors duration-200 text-lg"
              >
                Satıcı Ol
              </a>
            </div>
          </div>

          {/* Right Side - Promotional Offers */}
          <div className="grid grid-cols-2 gap-4">
            {/* Commission Rate */}
            <div className="w-48 h-48">
              <img src="/satici/2.png" alt="%10 Komisyon" className="w-full h-full object-contain" />
            </div>

            {/* Payment Period */}
            <div className="w-48 h-48">
              <img src="/satici/3.png" alt="15 İş Günü" className="w-full h-full object-contain" />
            </div>

            {/* Return Shipping Support */}
            <div className="w-48 h-48">
              <img src="/satici/4.png" alt="İade Kargo" className="w-full h-full object-contain" />
            </div>

            {/* Free Sponsored Ads */}
            <div className="w-48 h-48">
              <img src="/satici/5.png" alt="Ücretsiz Reklam" className="w-full h-full object-contain" />
            </div>
          </div>
        </div>
      </div>


    </div>
  );
};

export default SaticiOl;
