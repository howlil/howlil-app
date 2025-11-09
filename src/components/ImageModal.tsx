/** @format */

import {useEffect} from 'react';
import {X} from 'lucide-react';

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
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
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

  if (!isOpen) return null;

  return (
    <div
      className='fixed inset-0 z-[100] flex items-center justify-center p-4'
      onClick={onClose}
    >
      {/* Backdrop with blur */}
      <div className='absolute inset-0 bg-black/80 backdrop-blur-md' />

      {/* Close Button */}
      <button
        onClick={onClose}
        className='absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors'
        aria-label='Close image'
      >
        <X size={24} />
      </button>

      {/* Image Container */}
      <div
        className='relative z-10 max-w-7xl max-h-[90vh] w-full'
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={imageUrl}
          alt={alt}
          className='w-full h-full object-contain rounded-lg'
        />
      </div>
    </div>
  );
}
