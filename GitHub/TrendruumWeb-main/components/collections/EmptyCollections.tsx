export default function EmptyCollections() {
  return (
    <div className="text-center py-12">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 mb-4">
        <svg
          className="w-8 h-8 text-orange-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
          />
        </svg>
      </div>
      <h2 className="text-xl font-semibold text-gray-900 mb-2">
        Koleksiyonunuz Yok
      </h2>
      <p className="text-gray-600 mb-6">
        Koleksiyonları takip edebilir, sevdiklerinizle paylaşabilirsiniz!
      </p>
    </div>
  );
} 