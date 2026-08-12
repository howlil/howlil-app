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
          className='aspect-video w-full cursor-zoom-in overflow-hidden rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2'
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
        className='group relative aspect-video w-full overflow-hidden rounded-lg'
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
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.25 }}
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
          className='absolute left-3 top-1/2 z-10 flex min-h-[44px] min-w-[44px] -translate-y-1/2 items-center justify-center rounded-full bg-black/55 p-3 text-white opacity-100 transition-colors hover:bg-black/75 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-white sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100'
          aria-label='Previous image'
        >
          <ChevronLeft size={20} aria-hidden='true' />
        </button>

        <button
          type='button'
          onClick={goToNext}
          className='absolute right-3 top-1/2 z-10 flex min-h-[44px] min-w-[44px] -translate-y-1/2 items-center justify-center rounded-full bg-black/55 p-3 text-white opacity-100 transition-colors hover:bg-black/75 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-white sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100'
          aria-label='Next image'
        >
          <ChevronRight size={20} aria-hidden='true' />
        </button>

        <div className='absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 gap-1' role='group' aria-label='Choose image'>
          {images.map((_, index) => (
            <button
              key={index}
              type='button'
              onClick={() => setCurrentIndex(index)}
              className='flex min-h-[36px] min-w-[36px] items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-white'
              aria-label={`Go to image ${index + 1}`}
              aria-pressed={index === currentIndex}
            >
              <span
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex ? 'w-6 bg-white' : 'w-2 bg-white/60'
                }`}
                aria-hidden='true'
              />
            </button>
          ))}
        </div>

        <div className='absolute right-3 top-3 z-10 rounded-full bg-black/55 px-3 py-1 text-sm text-white' aria-live='polite'>
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
