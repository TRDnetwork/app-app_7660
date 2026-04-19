import React, { useState, useRef, useEffect } from 'react';

interface DropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  placement?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
}

const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  children,
  placement = 'bottom-left',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const placementClasses = {
    'bottom-left': 'origin-top-left left-0 top-full mt-2',
    'bottom-right': 'origin-top-right right-0 top-full mt-2',
    'top-left': 'origin-bottom-left left-0 bottom-full mb-2',
    'top-right': 'origin-bottom-right right-0 bottom-full mb-2',
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
      {isOpen && (
        <div
          className={[
            'absolute z-50 mt-1 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none',
            placementClasses[placement],
          ].join(' ')}
          role="menu"
          aria-orientation="vertical"
        >
          <div className="py-1" role="none">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;