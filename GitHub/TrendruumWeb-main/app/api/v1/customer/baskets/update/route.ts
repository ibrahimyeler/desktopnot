import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { product_id, quantity } = body;


    // TODO: Implement the logic to update the product quantity in the basket
    // For now, just return a success message with the new structure

    return NextResponse.json({
      meta: {
        status: 'success',
        message: 'Ürün miktarı başarıyla güncellendi.',
        code: 200,
      },
      data: {
        user_id: "684c09f592fd526bc806cbb2",
        status: "active",
        total_price: 1231 * quantity,
        updated_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        id: "684c0a0553ac3e43810a7ea2",
        basket_groups: [
          {
            basket_id: "684c0a0553ac3e43810a7ea2",
            seller_id: "684ac5772260ab66930798f0",
            seller: {
              name: "Seller1 Firması",
              id: "684ac5772260ab66930798f0"
            },
            updated_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
            total_price: 1231 * quantity,
            id: "684c0a2cc9df0022240f50e2",
            basket_group_items: [
              {
                basket_id: "684c0a0553ac3e43810a7ea2",
                basket_group_id: "684c0a2cc9df0022240f50e2",
                seller_id: "684ac5772260ab66930798f0",
                product_id: product_id,
                quantity: quantity,
                price: 1231,
                updated_at: new Date().toISOString(),
                created_at: new Date().toISOString(),
                product: {
                  name: "Test Ürün",
                  price: 1231,
                  medias: [],
                  status: "active",
                  slug: "test-urun",
                  updated_at: new Date().toISOString(),
                  created_at: new Date().toISOString(),
                  id: product_id
                },
                total_price: 1231 * quantity,
                id: "684c0a2cc9df0022240f50e3"
              }
            ]
          }
        ]
      },
    });
  } catch (error) {
    return NextResponse.json({
      meta: {
        status: 'error',
        message: 'Sepet güncellenirken bir hata oluştu.',
        code: 500,
      },
    }, { status: 500 });
  }
} 