"use client";

import { useEffect } from 'react';

export const useCategoryStickyManagement = (category: string) => {
  useEffect(() => {
    let isFixed = false;
    let fixTimeout: NodeJS.Timeout;
    
    const fixStickyParents = () => {
      if (isFixed) return;
      
      const stickyElement = document.querySelector('.sticky.top-24') as HTMLElement;
      if (!stickyElement) {
        fixTimeout = setTimeout(fixStickyParents, 200);
        return;
      }
      
      const headerHeight = typeof window !== 'undefined' 
        ? getComputedStyle(document.documentElement).getPropertyValue('--header-height') || '96px'
        : '96px';
      
      const headerElement = document.querySelector('header, [role="banner"], .header') as HTMLElement;
      let actualHeaderHeight = 96;
      
      if (headerElement) {
        const headerRect = headerElement.getBoundingClientRect();
        actualHeaderHeight = headerRect.height;
      } else if (headerHeight && headerHeight !== '') {
        const heightMatch = headerHeight.match(/(\d+)/);
        if (heightMatch) {
          actualHeaderHeight = parseInt(heightMatch[1]);
        }
      }
      
      const stickyTop = Math.max(80, actualHeaderHeight - 10);
      
      stickyElement.style.setProperty('position', 'sticky', 'important');
      stickyElement.style.setProperty('top', `${stickyTop}px`, 'important');
      stickyElement.style.setProperty('z-index', '10', 'important');
      stickyElement.style.setProperty('will-change', 'transform', 'important');
      
      const gridColumn = stickyElement.closest('.lg\\:col-span-3') as HTMLElement;
      const gridContainerElement = gridColumn?.parentElement as HTMLElement;
      
      if (gridColumn) {
        gridColumn.style.setProperty('align-self', 'start', 'important');
        gridColumn.style.setProperty('overflow', 'visible', 'important');
        gridColumn.style.setProperty('position', 'relative', 'important');
        const rightColumn = gridContainerElement?.querySelector('.lg\\:col-span-9') as HTMLElement;
        if (rightColumn) {
          const rightColumnHeight = rightColumn.scrollHeight || rightColumn.offsetHeight;
          if (rightColumnHeight > 0) {
            gridColumn.style.setProperty('height', `${rightColumnHeight}px`, 'important');
            gridColumn.style.setProperty('min-height', `${rightColumnHeight}px`, 'important');
          }
        }
      }
      
      if (gridContainerElement) {
        gridContainerElement.style.setProperty('overflow', 'visible', 'important');
        gridContainerElement.style.setProperty('position', 'relative', 'important');
        const rightColumn = gridContainerElement.querySelector('.lg\\:col-span-9') as HTMLElement;
        if (rightColumn) {
          const rightColumnHeight = rightColumn.scrollHeight || rightColumn.offsetHeight;
          if (rightColumnHeight > 0) {
            gridContainerElement.style.setProperty('min-height', `${rightColumnHeight}px`, 'important');
          }
        }
      }
      
      let parent = stickyElement.parentElement;
      const parentsToFix: HTMLElement[] = [];
      
      while (parent && parent !== document.body && parent !== document.documentElement) {
        parentsToFix.push(parent as HTMLElement);
        parent = parent.parentElement;
      }
      
      const nextContainer = document.getElementById('__next');
      const mainElement = document.querySelector('main');
      const gridContainer = document.querySelector('.grid.grid-cols-1');
      const htmlElement = document.documentElement;
      const bodyElement = document.body;
      
      if (nextContainer) parentsToFix.push(nextContainer);
      if (mainElement) parentsToFix.push(mainElement as HTMLElement);
      if (gridContainer) parentsToFix.push(gridContainer as HTMLElement);
      if (htmlElement) parentsToFix.push(htmlElement);
      if (bodyElement) parentsToFix.push(bodyElement);
      
      parentsToFix.forEach(el => {
        const computed = window.getComputedStyle(el);
        
        if (computed.overflow !== 'visible' || computed.overflowX !== 'visible' || computed.overflowY !== 'visible') {
          el.style.setProperty('overflow', 'visible', 'important');
          el.style.setProperty('overflow-x', 'visible', 'important');
          el.style.setProperty('overflow-y', 'visible', 'important');
        }
        
        if (el.id === '__next' && computed.display !== 'block') {
          el.style.setProperty('display', 'block', 'important');
          el.style.setProperty('flex-direction', 'column', 'important');
        }
        
        if (el.tagName === 'MAIN' && computed.flex !== 'none') {
          el.style.setProperty('display', 'block', 'important');
          el.style.setProperty('flex', 'none', 'important');
        }
        
        if (el.classList.contains('grid') && computed.overflow !== 'visible') {
          el.style.setProperty('overflow', 'visible', 'important');
          el.style.setProperty('align-items', 'start', 'important');
        }
      });
      
      isFixed = true;
    };
    
    fixTimeout = setTimeout(fixStickyParents, 100);
    
    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        isFixed = false;
        fixStickyParents();
      }, 300);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      clearTimeout(fixTimeout);
      clearTimeout(resizeTimeout);
      window.removeEventListener('resize', handleResize);
    };
  }, [category]);
};

