"use client";

import React from 'react';
import Image from 'next/image';

const EmailInfo = () => {
  return (
    <div className="bg-white rounded-lg border-2 border-gray-300 p-8 w-full max-w-md">
      <div className="flex flex-col items-center text-center">
        {/* Icon */}
        <div className="mb-4">
          <Image
            src="/communication/mail.svg"
            alt="E-Posta Adresi"
            width={32}
            height={32}
            className="w-8 h-8"
          />
        </div>
        
        {/* Title */}
        <h3 className="text-lg font-light text-gray-800 mb-2">
          E-Posta Adresi
        </h3>
        
        {/* Email */}
        <a 
          href="mailto:destek@trendruum.com?subject=Trendruum Destek Talebi&body=Merhaba,%0D%0A%0D%0ABu e-posta ile size ulaşmak istiyorum.%0D%0A%0D%0ASaygılarımla,"
          className="text-gray-900 hover:text-orange-500 transition-colors duration-200 cursor-pointer"
          style={{
            fontFamily: '"Source Sans Pro"',
            fontSize: '19px',
            fontStyle: 'normal',
            fontWeight: 600,
            lineHeight: '48px'
          }}
        >
          destek@trendruum.com
        </a>
      </div>
    </div>
  );
};

export default EmailInfo; 