/** @format */

import {useEffect, useRef} from 'react';
import {X} from 'lucide-react';
import {AnimatePresence, motion} from 'framer-motion';

interface ImageModalProps {
  isOpen: boolean;
  imageUrl: string;
  alt: string;
  onClose: () => void;
}

export default function ImageModal({
  isOpen,
  imageUrl,
  alt,
  onClose,
}: ImageModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;
      document.body.style.overflow = 'hidden';
      modalRef.current?.focus();
    } else {
      document.body.style.overflow = '';
      previousActiveElement.current?.focus();
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={modalRef}
          className='fixed inset-0 z-[100] flex items-center justify-center p-4'
          onClick={onClose}
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          exit={{opacity: 0}}
          role="dialog"
          aria-modal="true"
          aria-label="Image preview modal"
          tabIndex={-1}
        >
          {/* Backdrop with blur */}
          <motion.div
            className='absolute inset-0 bg-black/80 backdrop-blur-md'
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            aria-hidden="true"
          />

          {/* Close Button - 44x44px touch target */}
          <button
            onClick={onClose}
            className='absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white p-3 min-w-[44px] min-h-[44px] rounded-full transition-colors cursor-pointer'
            aria-label='Close image preview'
          >
            <X size={24} aria-hidden="true" />
          </button>

          {/* Image Container */}
          <motion.div
            className='relative z-10 max-w-7xl max-h-[90vh] w-full'
            onClick={(e) => e.stopPropagation()}
            initial={{opacity: 0, y: 16, scale: 0.97}}
            animate={{opacity: 1, y: 0, scale: 1}}
            exit={{opacity: 0, y: 16, scale: 0.97}}
            transition={{type: 'spring', stiffness: 260, damping: 22}}
          >
            <img
              src={imageUrl}
              alt={alt}
              className='w-full h-full object-contain rounded-lg'
              loading="lazy"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
