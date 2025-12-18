import { FC } from 'react';
import { MdLocalShipping } from 'react-icons/md';

interface BadgeProps {
  className?: string;
}

const FreeShippingBadge: FC<BadgeProps> = ({ className = '' }) => {
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-blue-50 text-blue-600 ${className}`}>
      <MdLocalShipping className="w-3 h-3" />
      Kargo Bedava
    </span>
  );
};

export default FreeShippingBadge; 