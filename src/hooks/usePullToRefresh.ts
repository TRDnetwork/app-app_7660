import { useEffect } from 'react';

export function usePullToRefresh(refresh: () => void) {
  useEffect(() => {
    let startY = 0;
    let currentY = 0;
    let pulling = false;

    const handleTouchStart = (e: TouchEvent) => {
      if (window.scrollY === 0) {
        startY = e.touches[0].pageY;
        pulling = true;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!pulling) return;
      currentY = e.touches[0].pageY;
    };

    const handleTouchEnd = () => {
      if (!pulling) return;
      pulling = false;
      if (currentY - startY > 100) {
        refresh();
      }
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [refresh]);
}