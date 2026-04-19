import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md';
  className?: string;
}

const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';

const variantClasses = {
  default: 'bg-surface text-text',
  success: 'bg-green-100 text-green-800',
  warning: 'bg-yellow-100 text-yellow-800',
  error: 'bg-red-100 text-red-800',
  info: 'bg-blue-100 text-blue-800',
};

const sizeClasses = {
  sm: 'text-xs',
  md: 'text-sm',
};

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
}) => {
  return (
    <span
      className={[
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className,
      ].join(' ')}
    >
      {children}
    </span>
  );
};

export default Badge;