import React from 'react';

export type BadgeVariant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error';
export type BadgeSize = 'sm' | 'md' | 'lg';

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-surface text-text',
  primary: 'bg-accent text-white',
  secondary: 'bg-text text-white',
  success: 'bg-green-600 text-white',
  warning: 'bg-yellow-500 text-white',
  error: 'bg-red-600 text-white',
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-2.5 py-1',
  lg: 'text-base px-3 py-1',
};

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  rounded?: boolean;
}

export const Badge = ({ 
  children, 
  variant = 'default', 
  size = 'md', 
  rounded = true,
  className = '',
  ...props 
}: BadgeProps) => {
  return (
    <span
      className={`
        inline-flex items-center font-medium
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${rounded ? 'rounded-full' : 'rounded'}
        ${className}
      `}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;
---