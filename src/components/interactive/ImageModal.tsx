/** @format */

import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

interface ImageModalProps {
  isOpen: boolean;
  imageUrl: string;
  alt: string;
  onClose: () => void;
}

export default function ImageModal({ isOpen, imageUrl, alt, onClose }: ImageModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    previousActiveElement.current = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const focusFrame = window.requestAnimationFrame(() => closeButtonRef.current?.focus());

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key === 'Tab') {
        event.preventDefault();
        closeButtonRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previousActiveElement.current?.focus();
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className='fixed inset-0 z-[100] flex items-center justify-center p-4'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role='dialog'
          aria-modal='true'
          aria-label={alt ? `Image preview: ${alt}` : 'Image preview'}
        >
          <button
            type='button'
            className='absolute inset-0 h-full w-full cursor-zoom-out bg-black/80 backdrop-blur-md'
            aria-label='Close image preview'
            onClick={onClose}
          />

          <button
            ref={closeButtonRef}
            type='button'
            onClick={onClose}
            className='absolute right-4 top-4 z-20 flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-black/50 p-3 text-white transition-colors hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-white'
            aria-label='Close image preview'
          >
            <X size={24} aria-hidden='true' />
          </button>

          <motion.div
            className='relative z-10 max-h-[90vh] w-full max-w-7xl'
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
          >
            <img
              src={imageUrl}
              alt={alt}
              className='h-full w-full rounded-lg object-contain'
              loading='eager'
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
