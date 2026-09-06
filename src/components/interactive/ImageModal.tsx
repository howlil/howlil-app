/** @format */

import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';

interface ImageModalProps {
  isOpen: boolean;
  imageUrl: string;
  alt: string;
  onClose: () => void;
}

export default function ImageModal({ isOpen, imageUrl, alt, onClose }: ImageModalProps) {
  const reduceMotion = useReducedMotion();
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
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0.01 : 0.18 }}
          role='dialog'
          aria-modal='true'
          aria-label={alt ? `Image preview: ${alt}` : 'Image preview'}
        >
          <motion.button
            type='button'
            className='absolute inset-0 h-full w-full cursor-zoom-out bg-black/80 backdrop-blur-md'
            aria-label='Close image preview'
            onClick={onClose}
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.button
            ref={closeButtonRef}
            type='button'
            onClick={onClose}
            className='absolute right-4 top-4 z-20 flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-black/50 p-3 text-white transition-colors hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-white'
            aria-label='Close image preview'
            initial={reduceMotion ? false : { opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={reduceMotion ? undefined : { scale: 1.06, rotate: 4 }}
            whileTap={reduceMotion ? undefined : { scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 380, damping: 26 }}
          >
            <X size={24} aria-hidden='true' />
          </motion.button>

          <motion.div
            className='relative z-10 max-h-[90vh] w-full max-w-7xl'
            initial={reduceMotion ? false : { opacity: 0, y: 18, scale: 0.965 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.98 }}
            transition={reduceMotion ? { duration: 0.01 } : { type: 'spring', stiffness: 280, damping: 24, mass: 0.85 }}
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
