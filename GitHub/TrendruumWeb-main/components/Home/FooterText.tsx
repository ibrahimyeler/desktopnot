import React from "react";

type FooterTextProps = {
  html: string;
};

const FooterText: React.FC<FooterTextProps> = ({ html }) => {
  return (
    <div
      className="footer-text w-full text-center text-xs sm:text-sm text-gray-500 mt-4 sm:mt-6 px-2 sm:px-4 leading-relaxed"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default FooterText;
