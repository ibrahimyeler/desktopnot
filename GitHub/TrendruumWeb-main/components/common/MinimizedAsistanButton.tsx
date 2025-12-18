"use client";

import { ChatBubbleOvalLeftIcon } from '@heroicons/react/24/outline';

interface MinimizedAsistanButtonProps {
  onMaximize: () => void;
}

const MinimizedAsistanButton = ({ onMaximize }: MinimizedAsistanButtonProps) => {
  return (
    <div className="fixed bottom-4 right-16 z-50">
      <button
        onClick={onMaximize}
        className="bg-orange-500 hover:bg-orange-600 text-white rounded-lg px-4 py-3 shadow-lg transition-all duration-200 hover:scale-105 group flex items-center space-x-3"
        title="Trendruum Asistan'ı Aç"
      >
        <ChatBubbleOvalLeftIcon className="w-6 h-6 text-white" />
        <span className="font-bold text-white text-sm whitespace-nowrap">Trendruum Asistan</span>
      </button>
    </div>
  );
};

export default MinimizedAsistanButton;
