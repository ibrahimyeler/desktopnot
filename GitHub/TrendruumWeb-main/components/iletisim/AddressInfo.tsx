"use client";

import React from 'react';
import Image from 'next/image';

const AddressInfo = () => {
  return (
    <div className="bg-white rounded-lg border-2 border-gray-300 p-8 w-full max-w-md">
      <div className="flex flex-col items-center text-center">
        {/* Icon */}
        <div className="mb-4">
          <Image
            src="/communication/adresinfo.svg"
            alt="Adres Bilgisi"
            width={32}
            height={32}
            className="w-8 h-8"
          />
        </div>
        
        {/* Title */}
        <h3 className="text-lg font-light text-gray-800 mb-2">
          Adres Bilgisi
        </h3>
        
        {/* Address */}
        <p className="text-gray-900" style={{
          fontFamily: '"Source Sans Pro"',
          fontSize: '19px',
          fontStyle: 'normal',
          fontWeight: 600,
          lineHeight: '48px'
        }}>
          Maslak, Bilim Sk. Sun Plaza No:5 K:13, 34398 Sarıyer/İstanbul
        </p>
      </div>
    </div>
  );
};

export default AddressInfo; 