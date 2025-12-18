"use client";

import React from 'react';
import Link from 'next/link';

const suggestedItems = [
  "iPhone 15", "Flo", "Watsons", "GS Store", "Airfryer", 
  "Dyson Süpürge", "Stanley Termos", "Koltuk Takımı", "Kurutma Makinesi", 
  "Playstation 5", "Kuzine Soba", "Aura Cleanmax", "Arçelik Bulaşık Makinesi", 
  "Pandora", "Zara", "Sweatshirt", "Philips Airfryer", "Decathlon", "IKEA", 
  "Siemens Bulaşık Makinesi", "Gant", "Under Armour", "Bambi Yatak", 
  "Baget Yüzük", "Adidas Samba", "Atasay", "Bargello", "Cep Telefonu", "UGG", 
  "Nike Air Force"
];


const SuggestionItems = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-wrap gap-2 justify-center">
        {suggestedItems.map((item, index) => (
          <Link
            key={index}
            href={`/search?q=${encodeURIComponent(item)}`}
            className="px-3 sm:px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-xs sm:text-sm text-gray-700 transition-colors"
          >
            {item}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SuggestionItems;
