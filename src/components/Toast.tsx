import React, { useEffect } from 'react';
import { CheckCircle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export function Toast({ message, isVisible, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-28 left-1/2 -translate-x-1/2 z-[200] animate-slide-up px-4 w-full max-w-md pointer-events-none">
      <div className="bg-[#2E2E2E] text-white rounded-xl px-4 py-3 shadow-2xl flex items-center gap-3 pointer-events-auto">
        <CheckCircle size={20} className="text-[#5E8C6A] flex-shrink-0" />
        <p className="text-sm flex-1">{message}</p>
        <button onClick={onClose} className="flex-shrink-0 hover:opacity-70 transition-opacity">
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
