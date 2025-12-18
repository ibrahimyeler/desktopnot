import React from 'react';

interface StarFilterProps {
  isVisible: boolean;
  onToggle: () => void;
  selectedStars: string[];
  onStarChange: (star: string, checked: boolean) => void;
}

const StarFilter: React.FC<StarFilterProps> = ({
  isVisible,
  onToggle,
  selectedStars,
  onStarChange
}) => {
  if (!isVisible) return null;

  const starOptions = [
    { value: '5', label: '5 Yıldız', stars: 5 },
    { value: '4', label: '4 Yıldız ve üzeri', stars: 4 },
    { value: '3', label: '3 Yıldız ve üzeri', stars: 3 },
    { value: '2', label: '2 Yıldız ve üzeri', stars: 2 },
    { value: '1', label: '1 Yıldız ve üzeri', stars: 1 }
  ];

  const renderStars = (count: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <svg
        key={index}
        className={`w-3 h-3 ${
          index < count 
            ? 'text-yellow-400 fill-current' 
            : 'text-gray-300'
        }`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (
    <div className="px-3 pb-3">
      <div className="space-y-2">
        {starOptions.map((option) => (
          <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedStars.includes(option.value)}
              onChange={(e) => onStarChange(option.value, e.target.checked)}
              className="w-4 h-4 text-orange-500 bg-white border-2 border-gray-300 rounded focus:ring-orange-500 focus:ring-2 checked:bg-orange-500 checked:border-orange-500 hover:border-orange-400 transition-colors [&:checked]:accent-orange-500"
            />
            <div className="flex items-center space-x-1">
              {renderStars(option.stars)}
            </div>
            <span className="text-sm text-gray-700 flex-1">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default StarFilter;
