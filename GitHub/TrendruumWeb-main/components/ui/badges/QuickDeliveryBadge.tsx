import { FC } from 'react';
import { TbTruckDelivery } from 'react-icons/tb';

interface BadgeProps {
  className?: string;
}

const QuickDeliveryBadge: FC<BadgeProps> = ({ className = '' }) => {
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-green-50 text-green-600 ${className}`}>
      <TbTruckDelivery className="w-3 h-3" />
      Hızlı Teslimat
    </span>
  );
};

export default QuickDeliveryBadge; 