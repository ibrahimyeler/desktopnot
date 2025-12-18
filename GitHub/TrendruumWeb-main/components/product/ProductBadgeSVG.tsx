import React, { useId } from 'react';

interface ProductBadgeSVGProps {
  className?: string;
  width?: number;
  height?: number;
  count?: number;
}

const ProductBadgeSVG: React.FC<ProductBadgeSVGProps> = ({ 
  className = '', 
  width = 50, 
  height = 24,
  count = 1
}) => {
  const id = useId();
  const bgGradientId = `bg-gradient-${id}`;
  const circleGradientId = `circle-gradient-${id}`;

  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 50 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        {/* Oval arka plan için gradient */}
        <linearGradient id={bgGradientId} x1="0" y1="0" x2="50" y2="0">
          <stop offset="0%" stopColor="#60A5FA" />
          <stop offset="50%" stopColor="#34D399" />
          <stop offset="100%" stopColor="#FBBF24" />
        </linearGradient>
        {/* Yuvarlaklar için gradient */}
        <linearGradient id={circleGradientId} x1="0" y1="0" x2="10" y2="0">
          <stop offset="0%" stopColor="#60A5FA" />
          <stop offset="50%" stopColor="#34D399" />
          <stop offset="100%" stopColor="#FBBF24" />
        </linearGradient>
      </defs>
      
      {/* Dikdörtgen arka plan - Beyaz */}
      <rect x="0" y="0" width="50" height="24" rx="12" ry="12" fill="#FFFFFF"/>
      
      {/* 1. Yuvarlak - Mavi */}
      <circle cx="12" cy="12" r="5" fill="#3B82F6"/>
      
      {/* 2. Yuvarlak - Yeşil (kısmen 1. yuvarlağın üzerinde) */}
      <circle cx="20" cy="12" r="5" fill="#10B981"/>
      
      {/* 3. Yuvarlak - Turuncu (kısmen 2. yuvarlağın üzerinde) */}
      <circle cx="28" cy="12" r="5" fill="#F59E0B"/>
      
      {/* Rakam - Sağ tarafa hizla */}
      <text 
        x="34" 
        y="14" 
        fill="#1F2937" 
        fontSize="12" 
        fontWeight="600" 
        textAnchor="start" 
        alignmentBaseline="middle"
      >
        {count}
      </text>
    </svg>
  );
};

export default ProductBadgeSVG;

