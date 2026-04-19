import React, { useState, useRef, useEffect } from 'react';

export interface DropdownOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

export interface DropdownProps {
  options: DropdownOption[];
  onSelect: (option: DropdownOption) => void;
  placeholder?: string;
  value?: string;
  disabled?: boolean;
  fullWidth?: boolean;
}

export const Dropdown = ({ 
  options, 
  onSelect, 
  placeholder = 'Select an option', 
  value, 
  disabled = false,
  fullWidth = false
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (option: DropdownOption) => {
    onSelect(option);
    setIsOpen(false);
  };

  return (
    <div className={fullWidth ? 'w-full' : ''} ref={dropdownRef}>
      <button
        type="button"
        className={`
          w-full flex items-center justify-between px-4 py-2 text-left border rounded-md
          ${disabled ? 'bg-surface text-text-dim cursor-not-allowed' : 'bg-white hover:bg-surface focus:outline-none focus:ring-2 focus:ring-accent'}
        `}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span>{selectedOption?.label || placeholder}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-5 w-5 text-text-dim transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <ul
          className="absolute z-10 mt-1 w-full bg-white border border-surface rounded-md shadow-lg max-h-60 overflow-auto focus:outline-none"
          role="listbox"
          aria-labelledby="dropdown-label"
        >
          {options.map((option) => (
            <li
              key={option.value}
              className={`
                px-4 py-2 cursor-pointer hover:bg-surface flex items-center
                ${value === option.value ? 'bg-accent text-white' : 'text-text'}
              `}
              onClick={() => handleSelect(option)}
              role="option"
              aria-selected={value === option.value}
            >
              {option.icon && <span className="mr-3">{option.icon}</span>}
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
---