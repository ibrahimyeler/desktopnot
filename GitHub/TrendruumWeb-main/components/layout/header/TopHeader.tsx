"use client";

import React from 'react';

interface TopHeaderProps {
  utilityLinks?: Array<{
    label: string;
    href: string;
  }>;
  leftContent?: React.ReactNode;
  backgroundColor?: string;
  height?: string;
  mobileHeight?: string;
}

const DEFAULT_UTILITY_LINKS = [
  { label: "Hakkımızda", href: "/s/hakkimizda" },
  { label: "Yardım Merkezi", href: "/s/yardim-merkezi" },
  { label: "Satıcı Ol", href: "https://seller.trendruum.com/onboarding/satici-formu/pazaryeri" },
];

const TopHeader = ({ 
  utilityLinks = DEFAULT_UTILITY_LINKS,
  leftContent,
  backgroundColor,
  height = '40px',
  mobileHeight = '15px'
}: TopHeaderProps) => {
  const containerStyle = {
    ...(backgroundColor && backgroundColor !== 'transparent' ? { background: backgroundColor } : {}),
    ['--top-header-mobile-height' as const]: mobileHeight,
    ['--top-header-desktop-height' as const]: height,
  };

  return (
    <div
      className="relative w-full flex-shrink-0 overflow-hidden h-[var(--top-header-mobile-height)] min-h-[var(--top-header-mobile-height)] md:h-[var(--top-header-desktop-height)] md:min-h-[var(--top-header-desktop-height)] bg-gradient-to-r from-orange-500 via-orange-400 to-yellow-400"
      style={containerStyle}
    >
      <div className="relative z-10 h-full w-full hidden md:block">
        <div className="mx-auto flex h-full w-full max-w-full items-center justify-between pl-[41px] pr-[35px] sm:pl-[39px] sm:pr-[35px] md:pl-[39px] md:pr-[44px] lg:pl-[47px] lg:pr-[52px] xl:pl-[55px] xl:pr-[60px] 2xl:pl-[63px] 2xl:pr-[68px]">
          <div className="flex items-center gap-2 text-xs font-medium text-white/95">
            {leftContent}
          </div>

          <div className="hidden md:flex items-center gap-4 text-[12px] font-medium">
            {(utilityLinks.length ? utilityLinks : DEFAULT_UTILITY_LINKS).map((link, index) => {
              if ((link.label || "").toLowerCase() === "satıcı ol") {
                return (
                  <a
                    key={index}
                    href="https://seller.trendruum.com/onboarding/satici-formu/pazaryeri"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full bg-black px-3.5 py-1 text-[12px] font-semibold text-white transition-transform duration-200 hover:scale-[1.02]"
                  >
                    {link.label}
                  </a>
                );
              }

              return (
                <a
                  key={index}
                  href={link.href}
                  className="text-white/95 transition-colors duration-200 hover:text-white"
                >
                  {link.label}
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopHeader;
