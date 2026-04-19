import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  header?: React.ReactNode;
  body?: React.ReactNode;
  footer?: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
  radius?: 'sm' | 'md' | 'lg';
  shadow?: 'sm' | 'md' | 'lg';
}

const baseStyles = 'bg-surface rounded-md overflow-hidden flex flex-col';

const variantStyles = {
  default: 'shadow-sm border border-surface',
  elevated: 'shadow-md hover:shadow-lg transition-shadow duration-200',
  outlined: 'border-2 border-surface shadow-sm',
};

const radiusStyles = {
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
};

const shadowStyles = {
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
};

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ header, body, footer, variant = 'default', radius = 'md', shadow, className = '', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`
          ${baseStyles}
          ${variantStyles[variant]}
          ${radiusStyles[radius]}
          ${shadow ? shadowStyles[shadow] : ''}
          ${className}
        `}
        {...props}
      >
        {header && <div className="px-6 py-4 border-b border-surface bg-white/50">{header}</div>}
        {body && <div className="p-6 flex-grow">{body}</div>}
        {children}
        {footer && <div className="px-6 py-4 border-t border-surface bg-white/50">{footer}</div>}
      </div>
    );
  }
);

Card.displayName = 'Card';

export default Card;
---