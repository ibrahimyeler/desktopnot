import { FC } from 'react';
import { BsLightningChargeFill } from 'react-icons/bs';

interface BadgeProps {
  className?: string;
}

const FlashSaleBadge: FC<BadgeProps> = ({ className = '' }) => {
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-red-50 text-red-600 ${className}`}>
      <BsLightningChargeFill className="w-3 h-3" />
      Flaş İndirim
    </span>
  );
};

export default FlashSaleBadge; 