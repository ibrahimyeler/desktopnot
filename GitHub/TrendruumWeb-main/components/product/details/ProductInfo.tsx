"use client";

import React, { useState } from 'react';
import DOMPurify from 'dompurify';

interface ProductInfoProps {
  product: {
    description?: string;
    attributes?: Array<{
      name: string;
      value_name: string;
      value_slug: string;
      slug: string;
      updated_at: string;
      created_at: string;
    }>;
    seller?: {
      name: string;
    };
    stock?: number;
    price?: number;
  };
}

interface ProductAttribute {
  label: string;
  value: string;
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  // Ürün bilgileri bölümüne scroll yapma fonksiyonu
  const scrollToProductDetails = () => {
    const productDetailsElement = document.getElementById('product-details');
    if (productDetailsElement) {
      productDetailsElement.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };



  // Ürün özelliklerini al (öne çıkan özellikler için)
  const getProductInfo = (): ProductAttribute[] => {
    const info: ProductAttribute[] = [];
    
    // Tüm ürün özelliklerini dinamik olarak al
    if (product.attributes && product.attributes.length > 0) {
      product.attributes.forEach(attr => {
        if (attr.value_name) {
          info.push({ 
            label: attr.name, 
            value: attr.value_name 
          });
        }
      });
    }
    
    // İlk 8 özelliği al (4 sütun x 2 satır)
    return info.slice(0, 8);
  };

  // Tüm ürün özelliklerini al (detay sayfası için)
  const getAllProductAttributes = (): ProductAttribute[] => {
    const info: ProductAttribute[] = [];
    
    if (product.attributes && product.attributes.length > 0) {
      product.attributes.forEach(attr => {
        if (attr.value_name) {
          info.push({ 
            label: attr.name, 
            value: attr.value_name 
          });
        }
      });
    }
    
    return info;
  };

  const productInfo = getProductInfo();

  // Satıcı bilgilerini al
  const getSellerInfo = () => {
    const info = [];
    
    if (product.seller?.name) {
      info.push(`Bu ürün **${product.seller.name}** tarafından gönderilecektir.`);
    }
    
    // if (product.stock !== undefined) {
    //   const stockText = product.stock > 100 
    //     ? `Kampanya fiyatından satılmak üzere ${product.stock} adetten fazla stok sunulmuştur.`
    //     : product.stock > 0 
    //     ? `${product.stock} adet stok mevcuttur.`
    //     : "Stok tükenmiştir.";
      
    //   info.push(stockText);
    // }
    
    if (product.price !== undefined) {
      info.push("İncelemiş olduğunuz ürünün satış fiyatını satıcı belirlemektedir.");
    }
    
    return info;
  };

  const sellerInfo = getSellerInfo();

  return (
    <div className="space-y-6">

       {/* Satıcı Bilgileri */}
       {sellerInfo.length > 0 && (
         <div className="space-y-3">
           <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
             <ul className="space-y-2">
               {sellerInfo.map((info, index) => (
                 <li key={index} className="flex items-start gap-2">
                   <span className="flex-shrink-0 w-1.5 h-1.5 bg-orange-500 rounded-full mt-2"></span>
                   <span 
                     className="text-sm text-gray-700 leading-relaxed"
                     dangerouslySetInnerHTML={{ 
                       __html: info.replace(/\*\*(.*?)\*\*/g, '<strong><u>$1</u></strong>')
                     }}
                   />
                 </li>
               ))}
             </ul>
           </div>
           
                      {/* Ürünün Tüm Özellikleri Butonu */}
           <button 
             onClick={scrollToProductDetails}
             className="w-full py-2 px-4 bg-white border border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:bg-orange-50 hover:border-orange-300 hover:text-orange-700 transition-all duration-200 flex items-center justify-center gap-2 mt-2"
           >
             Ürünün Tüm Özellikleri
           </button>
         </div>
       )}

       
    </div>
  );
};

export default ProductInfo; 