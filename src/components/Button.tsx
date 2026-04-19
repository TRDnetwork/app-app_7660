import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const baseClasses =
  'inline-flex items-center justify-center font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed';

const variantClasses = {
  primary: 'bg-accent text-white hover:bg-accent-alt focus:ring-accent',
  secondary:
    'bg-text text-white hover:bg-opacity-90 focus:ring-text border border-transparent',
  outline:
    'border border-text text-text hover:bg-surface focus:ring-accent focus:text-text',
  ghost:
    'text-text hover:bg-surface focus:ring-accent focus:text-text focus:bg-surface',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
};

const sizeClasses = {
  sm: 'text-sm px-3 py-1.5 min-h-8',
  md: 'text-base px-4 py-2 min-h-10',
  lg: 'text-lg px-6 py-3 min-h-12',
};

const fullWidthClass = 'w-full';

const spinnerClass = 'animate-spin mr-2';

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  ...props
}) => {
  return (
    <button
      className={[
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        fullWidth ? fullWidthClass : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && (
        <svg
          className={spinnerClass}
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      {leftIcon && !isLoading && <span className="mr-2">{leftIcon}</span>}
      {children}
      {rightIcon && !isLoading && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
};

export default Button;