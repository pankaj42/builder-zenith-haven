import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertTriangle, Info, X } from 'lucide-react';

interface ToastNotificationProps {
  message: string;
  type?: 'success' | 'warning' | 'info' | 'error';
  duration?: number;
  position?: {
    x: number;
    y: number;
  };
  onClose?: () => void;
}

export const ToastNotification: React.FC<ToastNotificationProps> = ({
  message,
  type = 'success',
  duration = 3000,
  position,
  onClose
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose?.(), 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default:
        return <Info className="w-4 h-4 text-blue-600" />;
    }
  };

  const getColorClasses = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  const style = position ? {
    position: 'fixed' as const,
    left: `${Math.min(position.x, window.innerWidth - 250)}px`,
    top: `${Math.max(position.y - 50, 10)}px`,
    zIndex: 9999,
  } : {
    position: 'fixed' as const,
    top: '20px',
    right: '20px',
    zIndex: 9999,
  };

  return (
    <div
      style={style}
      className={`
        ${getColorClasses()}
        border rounded-lg shadow-lg p-3 flex items-center gap-2 min-w-[200px] max-w-[300px]
        transition-all duration-300 transform
        ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'}
      `}
    >
      {getIcon()}
      <span className="text-sm font-medium flex-1">{message}</span>
      <button
        onClick={() => {
          setIsVisible(false);
          setTimeout(() => onClose?.(), 300);
        }}
        className="text-gray-400 hover:text-gray-600 ml-2"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
};

// Hook for managing toasts
export const useToast = () => {
  const [toasts, setToasts] = useState<Array<{
    id: string;
    message: string;
    type: 'success' | 'warning' | 'info' | 'error';
    position?: { x: number; y: number };
  }>>([]);

  const showToast = (
    message: string, 
    type: 'success' | 'warning' | 'info' | 'error' = 'success',
    position?: { x: number; y: number }
  ) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type, position }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const ToastContainer = () => (
    <>
      {toasts.map(toast => (
        <ToastNotification
          key={toast.id}
          message={toast.message}
          type={toast.type}
          position={toast.position}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </>
  );

  return { showToast, ToastContainer };
};

// Utility function to show copy success near an element
export const showCopySuccess = (element: HTMLElement, message: string = 'Copied!') => {
  // Safety check to ensure element is valid
  if (!element || typeof element.getBoundingClientRect !== 'function') {
    console.warn('Invalid element passed to showCopySuccess, using default position');
    // Use default position in top-right corner
    const position = { x: window.innerWidth - 150, y: 20 };
    createToast(position, message);
    return;
  }

  const rect = element.getBoundingClientRect();
  const position = {
    x: rect.right + 10,
    y: rect.top + rect.height / 2
  };

  createToast(position, message);
};

// Helper function to create toast
const createToast = (position: { x: number; y: number }, message: string) => {

  // Create temporary toast
  const toastId = Date.now().toString();
  const toastElement = document.createElement('div');
  toastElement.style.cssText = `
    position: fixed;
    left: ${Math.min(position.x, window.innerWidth - 120)}px;
    top: ${Math.max(position.y - 20, 10)}px;
    z-index: 9999;
    background: #10b981;
    color: white;
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 500;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    pointer-events: none;
    transform: translateY(-5px);
    transition: all 0.3s ease;
  `;
  toastElement.textContent = message;
  
  document.body.appendChild(toastElement);
  
  // Animate in
  setTimeout(() => {
    toastElement.style.transform = 'translateY(0)';
    toastElement.style.opacity = '1';
  }, 10);
  
  // Remove after delay
  setTimeout(() => {
    toastElement.style.transform = 'translateY(-5px)';
    toastElement.style.opacity = '0';
    setTimeout(() => {
      document.body.removeChild(toastElement);
    }, 300);
  }, 2000);
};
