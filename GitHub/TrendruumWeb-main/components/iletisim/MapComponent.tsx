"use client";

import React, { useState, useEffect } from 'react';

const MapComponent = () => {
  const [isClient, setIsClient] = useState(false);
  const address = "Maslak, Bilim Sk. Sun Plaza No:5 K:13, 34398 Sarıyer/İstanbul";
  const encodedAddress = encodeURIComponent(address);
  // Google Maps Embed API anahtarlı URL, mobilde hata verdiği için
  // anahtarsız, iframe içinde çalışabilen klasik embed formatına geçildi.
  const mapUrl = `https://www.google.com/maps?q=${encodedAddress}&output=embed`;

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="w-full h-full">
      <div className="bg-white rounded-lg border border-gray-200 p-6 h-full flex flex-col">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Konumumuz</h3>
        <div className="w-full h-96 rounded-lg overflow-hidden">
          {isClient ? (
            <iframe
              src={mapUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Trendruum Ofis Konumu"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <div className="text-gray-500">Harita yükleniyor...</div>
            </div>
          )}
        </div>
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <p className="text-gray-700 font-medium">
            <strong>Adres:</strong> {address}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MapComponent; 