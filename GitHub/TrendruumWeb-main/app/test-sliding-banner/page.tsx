import React from 'react';
import SlidingBanner from '@/components/Home/SlidingBanner';

// Test verileri - API'den gelen gerçek veri yapısına uygun
const testData = {
  leftSliders: [
    {
      slug: 'banner-link',
      value: [
        {
          slug: 'banner-link',
          type: 'text',
          value: 'https://example.com/banner1'
        },
        {
          slug: 'banner-image',
          type: 'image',
          value: 'https://tr-126.b-cdn.net/sections/687a0ade5038aaea3b07bcd7/ec4a0603-8aa7-46f6-9e7d-78220d718859.jpg'
        }
      ]
    },
    {
      slug: 'banner-link',
      value: [
        {
          slug: 'banner-link',
          type: 'text',
          value: 'https://example.com/banner2'
        },
        {
          slug: 'banner-image',
          type: 'image',
          value: 'https://tr-126.b-cdn.net/sections/687a0ade5038aaea3b07bcd7/726f7da7-6dec-4e34-9275-81b7e4199749.jpg'
        }
      ]
    },
    {
      slug: 'banner-link',
      value: [
        {
          slug: 'banner-link',
          type: 'text',
          value: 'https://example.com/banner3'
        },
        {
          slug: 'banner-image',
          type: 'image',
          value: 'https://tr-126.b-cdn.net/sections/687a0ade5038aaea3b07bcd7/ada52451-8727-4898-8b7e-6ac17ef6066a.jpg'
        }
      ]
    }
  ],
  campaignProducts: [
    {
      id: '68c2be5fc4294c6f3e0850fa',
      slug: 'test-urun-deneme-68c2be5fc4294c6f3e0850fa',
      name: 'Test Ürün Deneme Ferit',
      price: 100,
      discounted_price: 80,
      medias: [
        {
          url: 'https://tr-126.b-cdn.net/products/68c2be5fc4294c6f3e0850fa/bec2a9b6-e02c-488b-97a9-c76d1a5a11e2.jpg',
          type: 'image'
        }
      ],
      seller: {
        id: '68b936daae551bb2270b2ffa',
        name: 'KSK STORE'
      },
      brand: {
        name: 'Test Brand',
        slug: 'test-brand'
      },
      stock: 10,
      status: 'active',
      rating: 4.5,
      review_count: 25
    },
    {
      id: '68c2be5fc4294c6f3e0850fb',
      slug: 'test-urun-2',
      name: 'İkinci Test Ürünü',
      price: 150,
      discounted_price: null,
      medias: [
        {
          url: 'https://tr-126.b-cdn.net/products/68c2be5fc4294c6f3e0850fa/bec2a9b6-e02c-488b-97a9-c76d1a5a11e2.jpg',
          type: 'image'
        }
      ],
      seller: {
        id: '68b936daae551bb2270b2ffa',
        name: 'KSK STORE'
      },
      stock: 5,
      status: 'active',
      rating: 4.2,
      review_count: 18
    },
    {
      id: '68c2be5fc4294c6f3e0850fc',
      slug: 'test-urun-3',
      name: 'Üçüncü Test Ürünü',
      price: 200,
      discounted_price: 160,
      medias: [
        {
          url: 'https://tr-126.b-cdn.net/products/68c2be5fc4294c6f3e0850fa/bec2a9b6-e02c-488b-97a9-c76d1a5a11e2.jpg',
          type: 'image'
        }
      ],
      seller: {
        id: '68b936daae551bb2270b2ffa',
        name: 'KSK STORE'
      },
      stock: 0,
      status: 'active',
      rating: 4.8,
      review_count: 32
    }
  ],
  campaignBackgroundImage: 'https://tr-126.b-cdn.net/sections/687a0ade5038aaea3b07bcd7/e061ec7b-4e71-4bc8-8783-2aa5018daae5.jpg'
};

export default function TestSlidingBanner() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Sliding Banner Test Sayfası
        </h1>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            API'den Gelen Gerçek Veri ile Test
          </h2>
          <SlidingBanner
            leftSliders={testData.leftSliders}
            campaignProducts={testData.campaignProducts}
            campaignBackgroundImage={testData.campaignBackgroundImage}
          />
        </div>

        <div className="bg-white rounded-lg p-6 shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Test Verileri:</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-700">Left Sliders:</h4>
              <p className="text-sm text-gray-600">
                {testData.leftSliders.length} adet slider
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-700">Campaign Products:</h4>
              <p className="text-sm text-gray-600">
                {testData.campaignProducts.length} adet ürün
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-700">Background Image:</h4>
              <p className="text-sm text-gray-600">
                {testData.campaignBackgroundImage ? 'Mevcut' : 'Yok'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
