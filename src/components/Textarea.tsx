import React from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  required?: boolean;
}

const sizeStyles = {
  sm: 'text-sm px-3 py-1.5',
  md: 'text-base px-4 py-2',
  lg: 'text-lg px-4 py-3',
};

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, size = 'md', fullWidth = false, required = false, className = '', ...props }, ref) => {
    const id = props.id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = !!error;

    return (
      <div className={fullWidth ? 'w-full' : ''}>
        {label && (
          <label htmlFor={id} className="block text-text-dim font-medium mb-1.5">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={id}
          className={`
            w-full border rounded-md outline-none transition-all duration-200
            ${sizeStyles[size]}
            ${hasError 
              ? 'border-red-500 focus:ring-2 focus:ring-red-200 focus:border-red-500 bg-red-50' 
              : 'border-surface focus:ring-2 focus:ring-accent focus:ring-opacity-20 focus:border-accent bg-white'}
            ${className}
          `}
          aria-invalid={hasError}
          aria-describedby={
            [hasError && `${id}-error`, helperText && `${id}-helper`].filter(Boolean).join(' ') || undefined
          }
          required={required}
          {...props}
        />
        {hasError && (
          <p id={`${id}-error`} className="mt-1.5 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
        {!hasError && helperText && (
          <p id={`${id}-helper`} className="mt-1.5 text-sm text-text-dim">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;
---