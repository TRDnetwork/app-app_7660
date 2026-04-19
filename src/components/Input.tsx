import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helpText?: string;
  required?: boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  id,
  error,
  helpText,
  required = false,
  className = '',
  ...props
}) => {
  const inputId = id || label.toLowerCase().replace(/\s+/g, '-');
  const hasError = Boolean(error);

  return (
    <div className={className}>
      <label
        htmlFor={inputId}
        className="block text-text-dim font-medium mb-2"
      >
        {label}
        {required && <span className="text-red-600 ml-1">*</span>}
      </label>
      <input
        type="text"
        id={inputId}
        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-colors ${
          hasError
            ? 'border-red-500 focus:ring-red-500'
            : 'border-surface focus:ring-accent'
        } focus-glow`}
        aria-invalid={hasError}
        aria-describedby={
          [hasError ? `${inputId}-error` : '', helpText ? `${inputId}-help` : '']
            .filter(Boolean)
            .join(' ') || undefined
        }
        required={required}
        {...props}
      />
      {hasError && (
        <p id={`${inputId}-error`} className="mt-1 text-red-600 text-sm" role="alert">
          {error}
        </p>
      )}
      {!hasError && helpText && (
        <p id={`${inputId}-help`} className="mt-1 text-text-dim text-sm">
          {helpText}
        </p>
      )}
    </div>
  );
};

export default Input;