import { FC } from 'react';
import { TbDiscount } from 'react-icons/tb';

interface BadgeProps {
  className?: string;
}

const MultipleDiscountBadge: FC<BadgeProps> = ({ className = '' }) => {
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-orange-50 text-orange-600 ${className}`}>
      <TbDiscount className="w-3 h-3" />
      Çok Al Az Öde
    </span>
  );
};

export default MultipleDiscountBadge; 