"use client";

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface PortalProps {
  children: React.ReactNode;
  /** Optional: custom mount node id */
  id?: string;
}

export default function Portal({ children, id = 'app-portal-root' }: PortalProps) {
  const [mounted, setMounted] = useState(false);
  const elRef = useRef<HTMLDivElement | null>(null);

  if (!elRef.current) {
    elRef.current = document.createElement('div');
    elRef.current.setAttribute('data-portal', id);
    // Make sure portal itself doesn't interfere with stacking/scroll
    elRef.current.style.position = 'relative';
    elRef.current.style.zIndex = '2147483647'; // Max safe z-index
  }

  useEffect(() => {
    const target = document.getElementById(id) || document.body;
    if (elRef.current && target) {
      target.appendChild(elRef.current);
      setMounted(true);
    }
    return () => {
      if (elRef.current && elRef.current.parentElement) {
        elRef.current.parentElement.removeChild(elRef.current);
      }
    };
  }, [id]);

  if (!mounted || !elRef.current) return null;
  return createPortal(children, elRef.current);
}

