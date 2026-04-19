import React from 'react';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
  className?: string;
}

const baseClasses = 'rounded-lg border bg-white flex flex-col';

const variantClasses = {
  default: 'border-surface shadow-sm',
  elevated: 'border-surface shadow-md',
  outlined: 'border-surface bg-transparent',
};

const Card: React.FC<CardProps> = ({
  title,
  children,
  header,
  footer,
  variant = 'default',
  className = '',
}) => {
  return (
    <div className={[baseClasses, variantClasses[variant], className].join(' ')}>
      {header ? (
        header
      ) : title ? (
        <div className="p-6 pb-4 border-b border-surface">
          <h3 className="text-xl font-semibold text-text font-display">{title}</h3>
        </div>
      ) : null}
      <div className="p-6 flex-grow">{children}</div>
      {footer && <div className="p-6 pt-4 border-t border-surface">{footer}</div>}
    </div>
  );
};

export default Card;