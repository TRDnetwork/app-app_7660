import React, { useState, useRef, useEffect } from 'react';

export interface TooltipProps {
  content: string;
  children: React.ReactNode;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
}

export const Tooltip = ({ 
  content, 
  children, 
  placement = 'top',
  delay = 500 
}: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLSpanElement>(null);
  let timeoutId: NodeJS.Timeout;

  const calculatePosition = () => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;

    let top = 0;
    let left = 0;

    switch (placement) {
      case 'top':
        top = triggerRect.top - tooltipRect.height - 8 + scrollY;
        left = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2 + scrollX;
        break;
      case 'bottom':
        top = triggerRect.bottom + 8 + scrollY;
        left = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2 + scrollX;
        break;
      case 'left':
        top = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2 + scrollY;
        left = triggerRect.left - tooltipRect.width - 8 + scrollX;
        break;
      case 'right':
        top = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2 + scrollY;
        left = triggerRect.right + 8 + scrollX;
        break;
    }

    // Ensure tooltip stays in viewport
    left = Math.max(8, Math.min(left, window.innerWidth - tooltipRect.width - 8));
    top = Math.max(8, Math.min(top, window.innerHeight - tooltipRect.height - 8));

    setPosition({ top, left });
  };

  const showTooltip = () => {
    timeoutId = setTimeout(() => {
      setIsVisible(true);
      setTimeout(calculatePosition, 0);
    }, delay);
  };

  const hideTooltip = () => {
    clearTimeout(timeoutId);
    setIsVisible(false);
  };

  useEffect(() => {
    if (isVisible) {
      calculatePosition();
      window.addEventListener('resize', calculatePosition);
      window.addEventListener('scroll', calculatePosition, true);
      return () => {
        window.removeEventListener('resize', calculatePosition);
        window.removeEventListener('scroll', calculatePosition, true);
      };
    }
  }, [isVisible]);

  return (
    <span ref={triggerRef} onMouseEnter={showTooltip} onMouseLeave={hideTooltip} className="inline-block">
      {children}
      {isVisible && (
        <div
          ref={tooltipRef}
          className="fixed bg-text text-white px-3 py-1.5 rounded text-sm z-50 pointer-events-none whitespace-nowrap"
          style={{ top: position.top, left: position.left }}
          role="tooltip"
        >
          {content}
        </div>
      )}
    </span>
  );
};

export default Tooltip;
---