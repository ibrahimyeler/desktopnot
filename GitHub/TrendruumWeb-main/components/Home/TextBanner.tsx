import React from "react";

type TextBannerProps = {
  header: string;
  backgroundImage: string;
  text: string;
  headerColor?: string;
};

const TextBanner: React.FC<TextBannerProps> = ({ header, backgroundImage, text, headerColor }) => {
  return (
    <div className="w-full mb-8">
      {/* Background Image with Title Overlay */}
      <div
        className="w-full rounded-lg overflow-hidden relative flex flex-col justify-center items-center min-h-[220px] sm:min-h-[320px] p-6 sm:p-12"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/30 z-0" />
        <div className="relative z-10 w-full max-w-2xl text-center">
          <h2
            className="text-2xl sm:text-4xl font-bold mb-4"
            style={{ color: headerColor || "#fff" }}
          >
            {header}
          </h2>
        </div>
      </div>
      
      {/* Text Content Below Image */}
      {text && (
        <div className="w-full max-w-4xl mx-auto mt-6 p-6 bg-white rounded-lg shadow-sm">
          <div
            className="text-base sm:text-lg text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: text }}
          />
        </div>
      )}
    </div>
  );
};

export default TextBanner; 