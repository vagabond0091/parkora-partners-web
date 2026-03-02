import type { ReactNode } from 'react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export interface ModalTitleProps {
  children: ReactNode;
  onClose?: () => void;
}

export interface ModalContentProps {
  children: ReactNode;
  className?: string;
}

export interface ModalActionsProps {
  children: ReactNode;
}
