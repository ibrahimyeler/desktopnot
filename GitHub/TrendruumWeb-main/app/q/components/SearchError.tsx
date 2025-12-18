"use client";

interface SearchErrorProps {
  error: string;
  onRetry: () => void;
}

export default function SearchError({ error, onRetry }: SearchErrorProps) {
  return (
    <div className="flex flex-col justify-center items-center h-64 text-gray-500">
      <p className="text-lg font-medium mb-2">{error}</p>
      <button
        onClick={onRetry}
        className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
      >
        Tekrar Dene
      </button>
    </div>
  );
}

