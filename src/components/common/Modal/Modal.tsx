import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { clsx } from 'clsx';
import type { ModalProps, ModalTitleProps, ModalContentProps, ModalActionsProps } from '@/types/components/modal.types';

export const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-md bg-[#1b2335] rounded-xl shadow-2xl border border-gray-800 overflow-hidden transform transition-all flex flex-col max-h-[90vh]">
        {children}
      </div>
    </div>,
    document.body
  );
};

Modal.Title = ({ children, onClose }: ModalTitleProps) => (
  <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
    <h3 className="text-lg font-semibold text-white">{children}</h3>
    {onClose && (
      <button
        type="button"
        onClick={onClose}
        className="text-gray-400 hover:text-white transition-colors focus:outline-none"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    )}
  </div>
);

Modal.Content = ({ children, className }: ModalContentProps) => (
  <div className={clsx('p-6 overflow-y-auto min-h-0', className)}>
    {children}
  </div>
);

Modal.Actions = ({ children }: ModalActionsProps) => (
  <div className="px-6 py-4 border-t border-gray-800 bg-[#161c2a] flex justify-end gap-3 shrink-0">
    {children}
  </div>
);
