import Image from 'next/image';

const PaymentMethods = () => {
  const paymentMethods = [
    {
      id: 1,
      name: 'Troy',
      image: '/payment/troy.webp',
      alt: 'Troy Ödeme Sistemi'
    },
    {
      id: 2,
      name: 'Mastercard',
      image: '/payment/mastercard.webp',
      alt: 'Mastercard'
    },
    {
      id: 3,
      name: 'Visa',
      image: '/payment/visa.webp',
      alt: 'Visa'
    },
    {
      id: 4,
      name: 'American Express',
      image: '/payment/amex.webp',
      alt: 'American Express'
    }
  ];

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center justify-center gap-2">
        {paymentMethods.map((method) => (
          <div 
            key={method.id} 
            className="relative w-[80px] h-[80px] bg-white rounded-lg p-2"
          >
            <Image
              src={method.image}
              alt={method.alt}
              fill
              className="object-contain p-1"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentMethods; 