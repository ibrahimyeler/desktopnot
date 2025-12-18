"use client";

import React from 'react';
import Image from 'next/image';

const CustomerServices = () => {
  return (
    <div className="bg-white rounded-lg border-2 border-gray-300 p-8 w-full max-w-md">
      <div className="flex flex-col items-center text-center">
        {/* Icon */}
        <div className="mb-4">
          <Image
            src="/communication/customerservices.svg"
            alt="Müşteri Hizmetleri"
            width={32}
            height={32}
            className="w-8 h-8"
          />
        </div>
        
        {/* Service Name */}
        <h3 className="text-lg font-light text-gray-800 mb-2">
          Müşteri Hizmetleri
        </h3>
        
        {/* Phone Number */}
        <p className="text-gray-900" style={{
          fontFamily: '"Source Sans Pro"',
          fontSize: '19px',
          fontStyle: 'normal',
          fontWeight: 600,
          lineHeight: '48px'
        }}>
          0850 242 11 44
        </p>
      </div>
    </div>
  );
};

export default CustomerServices; 