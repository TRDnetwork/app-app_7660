import React, { useState } from 'react';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  placement?: 'top' | 'right' | 'bottom' | 'left';
}

const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  placement = 'top',
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const placementClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
  };

  return (
    <div
      className="inline-block relative"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div
          className={[
            'absolute z-50 whitespace-nowrap px-2 py-1 bg-text text-white text-xs rounded shadow-lg',
            placementClasses[placement],
          ].join(' ')}
          role="tooltip"
        >
          {content}
        </div>
      )}
    </div>
  );
};

export default Tooltip;