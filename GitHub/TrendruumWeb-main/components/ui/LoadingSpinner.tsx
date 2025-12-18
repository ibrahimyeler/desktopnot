export default function LoadingSpinner() {
  return (
    <div className="min-h-[calc(100vh-300px)] flex justify-center items-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F27A1A]"></div>
    </div>
  );
} 