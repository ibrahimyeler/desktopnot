import React from "react";

type TextSectionProps = {
  text: string;
};

const TextSection: React.FC<TextSectionProps> = ({ text }) => {
  return (
    <div className="w-full max-w-4xl mx-auto px-2 sm:px-4 py-4 sm:py-8">
      <div
        className="prose prose-sm sm:prose-lg max-w-none text-gray-900 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: text }}
      />
    </div>
  );
};

export default TextSection; 