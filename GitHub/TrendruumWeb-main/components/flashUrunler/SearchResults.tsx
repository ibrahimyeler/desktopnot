"use client";

interface SearchResultsProps {
  category?: string;
  count?: number;
}

export default function SearchResults({ category, count }: SearchResultsProps) {
  if (!category) {
    return (
      <div className="text-sm text-gray-700 ml-4">
        Arama sonucu bulunamadı
      </div>
    );
  }

  return (
    <div className="text-sm text-gray-700 ml-4">
      <span className="font-semibold">{category}</span> araması için sonuç listeleniyor
    </div>
  );
} 