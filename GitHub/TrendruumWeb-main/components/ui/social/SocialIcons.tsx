import Link from 'next/link';
import Image from 'next/image';

const SocialIcons = () => {
  return (
    <div className="flex space-x-4">
      <Link 
        href="https://www.instagram.com/trendruum/" 
        target="_blank"
        rel="noopener noreferrer"
        className="hover:opacity-80 transition-opacity"
      >
        <Image
          src="/social/instagram.webp"
          alt="Instagram"
          width={40}
          height={40}
          className="rounded-full"
        />
      </Link>
      
      <Link 
        href="https://www.facebook.com/trendruumcom"
        target="_blank"
        rel="noopener noreferrer" 
        className="hover:opacity-80 transition-opacity"
      >
        <Image
          src="/social/facebook.webp"
          alt="Facebook"
          width={40}
          height={40}
          className="rounded-full"
        />
      </Link>
      
      <Link 
        href="https://www.youtube.com/channel/UCg_b_FnRblF6qvY5CLKEGmA"
        target="_blank"
        rel="noopener noreferrer" 
        className="hover:opacity-80 transition-opacity"
      >
        <Image
          src="/social/youtube.webp"
          alt="Youtube"
          width={40}
          height={40}
          className="rounded-full"
        />
      </Link>
      
      <Link 
        href="https://www.tiktok.com/@trendruum.com"
        target="_blank"
        rel="noopener noreferrer" 
        className="hover:opacity-80 transition-opacity"
      >
        <Image
          src="/social/tiktok.webp"
          alt="TikTok"
          width={40}
          height={40}
          className="rounded-full"
        />
      </Link>
      
      <Link 
        href="https://www.linkedin.com/company/trendruum"
        target="_blank"
        rel="noopener noreferrer" 
        className="hover:opacity-80 transition-opacity"
      >
        <Image
          src="/social/linkedin.webp"
          alt="LinkedIn"
          width={40}
          height={40}
          className="rounded-full"
        />
      </Link>
      
      <Link 
        href="https://x.com/trendruum"
        target="_blank"
        rel="noopener noreferrer" 
        className="hover:opacity-80 transition-opacity"
      >
        <Image
          src="/social/x.webp"
          alt="X"
          width={40}
          height={40}
          className="rounded-full"
        />
      </Link>
    </div>
  );
};

export default SocialIcons; 