interface SuccessNotificationProps {
  message: string;
  onClose: () => void;
}

export const SuccessNotification = ({ message, onClose }: SuccessNotificationProps) => {
  return (
    <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg border-2 border-green-600 flex items-center space-x-3 z-[60]">
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
      <p>{message}</p>
      <button onClick={onClose} className="ml-4 hover:text-green-100">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}; 