interface SearchResult {
  id: string;
  name: string;
  slug: string;
}

interface SearchDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  results: SearchResult[];
  isLoading: boolean;
}

export default function SearchDropdown({ isOpen, onClose, results, isLoading }: SearchDropdownProps) {
  if (!isOpen) return null;

  return (
    <div className="absolute left-0 right-0 top-full bg-white border-2 border-t-0 border-orange-500 rounded-b-lg shadow-lg z-50">
      {isLoading ? (
        <div className="p-4 text-center text-black">
          Aranıyor...
        </div>
      ) : results.length > 0 ? (
        <div className="max-h-96 overflow-y-auto">
          {results.map((result) => (
            <Link
              key={result.id}
              href={`/urun/${result.slug}`}
              className="flex items-center p-3 hover:bg-gray-50 transition-colors"
              onClick={onClose}
            >
              <div className="ml-3">
                <div className="text-sm font-medium text-black">{result.name}</div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="p-4 text-center text-black">
          Sonuç bulunamadı
        </div>
      )}
    </div>
  );
} 