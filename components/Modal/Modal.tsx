import { useEffect } from 'react';
import css from './Modal.module.css';
import { createPortal } from 'react-dom';
import clsx from 'clsx';

interface ModalProps {
  children: React.ReactNode;
  handleClose: () => void;
  className?: string;
}

function Modal({ children, handleClose, className = '' }: ModalProps) {
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [handleClose]);

  return createPortal(
    <div
      onClick={handleBackdropClick}
      className={css.backdrop}
      role="dialog"
      aria-modal="true"
    >
      <div className={clsx(css.modal, className)}>{children}</div>
    </div>,
    document.body
  );
}

export default Modal;
