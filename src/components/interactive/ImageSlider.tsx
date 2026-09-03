/** @format */

import { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import ImageModal from './ImageModal';

interface ImageSliderProps {
  images: string[];
  alt: string;
}

export default function ImageSlider({ images, alt }: ImageSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [modalImage, setModalImage] = useState<string | null>(null);
  const imageButtonRef = useRef<HTMLButtonElement>(null);

  if (images.length === 0) return null;

  const goToPrevious = () => {
    setCurrentIndex((previous) => (previous === 0 ? images.length - 1 : previous - 1));
  };

  const goToNext = () => {
    setCurrentIndex((previous) => (previous === images.length - 1 ? 0 : previous + 1));
  };

  const openCurrentImage = () => setModalImage(images[currentIndex]);

  if (images.length === 1) {
    return (
      <>
        <button
          ref={imageButtonRef}
          type='button'
          className='aspect-video w-full cursor-zoom-in overflow-hidden rounded-sm border border-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2'
          onClick={() => setModalImage(images[0])}
          aria-label={`View ${alt} in full size`}
        >
          <img
            src={images[0]}
            alt={alt}
            className='h-full w-full object-cover'
            loading='lazy'
            width='1280'
            height='720'
          />
        </button>
        <ImageModal
          isOpen={modalImage === images[0]}
          imageUrl={images[0]}
          alt={alt}
          onClose={() => setModalImage(null)}
        />
      </>
    );
  }

  return (
    <>
      <div
        className='group relative aspect-video w-full overflow-hidden rounded-sm border border-gray-200'
        aria-roledescription='carousel'
        aria-label={`${alt} image gallery`}
      >
        <AnimatePresence mode='wait'>
          <motion.button
            ref={imageButtonRef}
            key={images[currentIndex]}
            type='button'
            className='absolute inset-0 h-full w-full cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white'
            onClick={openCurrentImage}
            aria-label={`View ${alt} image ${currentIndex + 1} of ${images.length} in full size`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <img
              src={images[currentIndex]}
              alt={`${alt} - Image ${currentIndex + 1}`}
              className='h-full w-full object-cover'
              loading='lazy'
              width='1280'
              height='720'
            />
          </motion.button>
        </AnimatePresence>

        <button
          type='button'
          onClick={goToPrevious}
          className='absolute left-2 top-1/2 z-10 flex min-h-[40px] min-w-[40px] -translate-y-1/2 items-center justify-center rounded-sm bg-black/60 p-2 text-white opacity-100 transition-colors hover:bg-black/80 focus:outline-none focus:ring-2 focus:ring-white sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100'
          aria-label='Previous image'
        >
          <ChevronLeft size={18} aria-hidden='true' />
        </button>

        <button
          type='button'
          onClick={goToNext}
          className='absolute right-2 top-1/2 z-10 flex min-h-[40px] min-w-[40px] -translate-y-1/2 items-center justify-center rounded-sm bg-black/60 p-2 text-white opacity-100 transition-colors hover:bg-black/80 focus:outline-none focus:ring-2 focus:ring-white sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100'
          aria-label='Next image'
        >
          <ChevronRight size={18} aria-hidden='true' />
        </button>

        <div className='absolute bottom-2 left-2 z-10 flex gap-1' role='group' aria-label='Choose image'>
          {images.map((_, index) => (
            <button
              key={index}
              type='button'
              onClick={() => setCurrentIndex(index)}
              className='flex min-h-[32px] min-w-[32px] items-center justify-center rounded-sm bg-black/45 focus:outline-none focus:ring-2 focus:ring-white'
              aria-label={`Go to image ${index + 1}`}
              aria-pressed={index === currentIndex}
            >
              <span
                className={`h-1.5 transition-all ${
                  index === currentIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/60'
                }`}
                aria-hidden='true'
              />
            </button>
          ))}
        </div>

        <div className='absolute right-2 top-2 z-10 rounded-sm bg-black/60 px-2 py-1 font-mono text-[10px] text-white' aria-live='polite'>
          {currentIndex + 1} / {images.length}
        </div>
      </div>

      {modalImage && (
        <ImageModal
          isOpen
          imageUrl={modalImage}
          alt={`${alt} - Image ${images.indexOf(modalImage) + 1}`}
          onClose={() => setModalImage(null)}
        />
      )}
    </>
  );
}
