import React from 'react';

interface SearchLoadingSpinnerProps {
  message?: string;
  subMessage?: string;
}

const SearchLoadingSpinner: React.FC<SearchLoadingSpinnerProps> = ({
  message,
  subMessage
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      {message && <p className="text-gray-600 text-lg font-medium mt-4">{message}</p>}
      {subMessage && <p className="text-gray-500 text-sm mt-2">{subMessage}</p>}
    </div>
  );
};

export default SearchLoadingSpinner;

