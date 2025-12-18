"use client";

import Link from 'next/link';
import { ChatBubbleOvalLeftIcon } from '@heroicons/react/24/outline';

const AssistantHelp = () => {
  return (
    <div className="bg-orange-50 rounded-lg border border-orange-200 p-6">
      <Link 
        href="/account/assistant"
        className="flex flex-col items-center text-center"
      >
        <ChatBubbleOvalLeftIcon className="w-8 h-8 text-orange-500 mb-3" />
        <h3 className="text-lg font-semibold text-orange-500 mb-2">
          Trendruum Asistan&apos;a Sor
        </h3>
        <p className="text-sm text-gray-600">
          7/24 Sorularınızı Cevaplar
        </p>
      </Link>
    </div>
  );
};

export default AssistantHelp; 