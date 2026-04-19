import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
  show: boolean;
  message: string;
  type: ToastType;
  onClose: () => void;
  autoDismiss?: boolean;
  duration?: number;
}

const typeStyles = {
  success: 'bg-green-600 text-white',
  error: 'bg-red-600 text-white',
  warning: 'bg-yellow-500 text-white',
  info: 'bg-blue-600 text-white',
};

export const Toast = ({ show, message, type, onClose, autoDismiss = true, duration = 4000 }: ToastProps) => {
  useEffect(() => {
    if (show && autoDismiss) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [show, autoDismiss, duration, onClose]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className={`fixed bottom-5 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-md shadow-lg flex items-center ${typeStyles[type]}`}
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          role="alert"
          aria-live="polite"
        >
          <span>{message}</span>
          <button
            onClick={onClose}
            className="ml-4 text-white opacity-70 hover:opacity-100 focus:outline-none"
            aria-label="Close notification"
          >
            ✕
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
---