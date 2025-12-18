import React, { Suspense } from 'react';
import { useBasket } from '@/app/context/BasketContext';

const CartPage = () => {
  const { basket } = useBasket();

  // Loading state'ini Suspense ile yönet
  if (!basket) {
    return <div>Loading...</div>;
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div>Cart Content</div>
    </Suspense>
  );
};

export default CartPage;
