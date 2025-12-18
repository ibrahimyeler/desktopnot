"use client";

import { useEffect } from 'react';

interface ImagePreloaderProps {
  images: string[];
  preloadCount?: number; // How many images to preload
}

const ImagePreloader: React.FC<ImagePreloaderProps> = ({ 
  images, 
  preloadCount = 2 
}) => {
  useEffect(() => {
    // Only preload the specified number of images
    const imagesToPreload = images.slice(0, preloadCount);
    
    imagesToPreload.forEach((imageSrc) => {
      const img = new Image();
      img.src = imageSrc;
    });
  }, [images, preloadCount]);

  return null; // This component doesn't render anything
};

export default ImagePreloader;
