const FeedbackButton = () => {
  return (
    <div className="w-full border border-gray-300 rounded-lg mt-4">
      <button className="w-full flex items-center justify-center gap-2 bg-white px-4 py-2 text-[13px] text-gray-700 hover:bg-gray-50">
        <svg 
          width="16" 
          height="16" 
          viewBox="0 0 16 16" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="text-gray-900"
        >
          <path 
            d="M2 2H14V11H3.17L2 12.17V2ZM2 0C0.9 0 0.00999999 0.9 0.00999999 2L0 16L4 12H14C15.1 12 16 11.1 16 10V2C16 0.9 15.1 0 14 0H2Z"
            fill="currentColor"
          />
        </svg>
        GERİ BİLDİRİM VER
      </button>
    </div>
  );
};

export default FeedbackButton; 