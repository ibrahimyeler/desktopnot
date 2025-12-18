import { FC } from 'react';
import { FaRegClock } from 'react-icons/fa';

interface BadgeProps {
  className?: string;
}

const LimitedTimeBadge: FC<BadgeProps> = ({ className = '' }) => {
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-purple-50 text-purple-600 ${className}`}>
      <FaRegClock className="w-3 h-3" />
      Sınırlı Süre
    </span>
  );
};

export default LimitedTimeBadge; 