import React from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  isOpen: boolean;
  onClose: () => void;
  autoDismiss?: boolean;
  duration?: number;
}

const baseClasses =
  'fixed bottom-4 right-4 max-w-xs rounded-lg shadow-lg flex items-center z-50 px-4 py-3 text-white';

const typeClasses = {
  success: 'bg-green-600',
  error: 'bg-red-600',
  warning: 'bg-yellow-500 text-text',
  info: 'bg-blue-600',
};

const Toast: React.FC<ToastProps> = ({
  message,
  type,
  isOpen,
  onClose,
  autoDismiss = true,
  duration = 4000,
}) => {
  useEffect(() => {
    if (!isOpen || !autoDismiss) return;

    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [isOpen, autoDismiss, duration, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className={[baseClasses, typeClasses[type]].join(' ')}
      role="alert"
      aria-live="polite"
    >
      <span className="flex-grow">{message}</span>
      <button
        type="button"
        className="ml-4 text-white hover:text-gray-200"
        onClick={onClose}
        aria-label="Dismiss notification"
      >
        ✕
      </button>
    </div>
  );
};

export default Toast;