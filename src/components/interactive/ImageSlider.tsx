/** @format */

import { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import ImageModal from './ImageModal';

interface ImageSliderProps {
  images: string[];
  alt: string;
}

export default function ImageSlider({ images, alt }: ImageSliderProps) {
  const reduceMotion = useReducedMotion();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [modalImage, setModalImage] = useState<string | null>(null);
  const imageButtonRef = useRef<HTMLButtonElement>(null);

  if (images.length === 0) return null;

  const navigate = (nextIndex: number, nextDirection: number) => {
    setDirection(nextDirection);
    setCurrentIndex(nextIndex);
  };

  const goToPrevious = () => {
    navigate(currentIndex === 0 ? images.length - 1 : currentIndex - 1, -1);
  };

  const goToNext = () => {
    navigate(currentIndex === images.length - 1 ? 0 : currentIndex + 1, 1);
  };

  const goToIndex = (index: number) => {
    if (index === currentIndex) return;
    navigate(index, index > currentIndex ? 1 : -1);
  };

  const openCurrentImage = () => setModalImage(images[currentIndex]);

  if (images.length === 1) {
    return (
      <>
        <motion.button
          ref={imageButtonRef}
          type='button'
          className='aspect-video w-full cursor-zoom-in overflow-hidden rounded-sm border border-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2'
          onClick={() => setModalImage(images[0])}
          aria-label={`View ${alt} in full size`}
          whileHover={reduceMotion ? undefined : { y: -2, scale: 1.004 }}
          whileTap={reduceMotion ? undefined : { scale: 0.995 }}
          transition={{ type: 'spring', stiffness: 360, damping: 30 }}
        >
          <motion.img
            src={images[0]}
            alt={alt}
            className='h-full w-full object-cover'
            loading='lazy'
            width='1280'
            height='720'
            whileHover={reduceMotion ? undefined : { scale: 1.015 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          />
        </motion.button>
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
      <motion.div
        className='group relative aspect-video w-full overflow-hidden rounded-sm border border-gray-200'
        aria-roledescription='carousel'
        aria-label={`${alt} image gallery`}
        whileHover={reduceMotion ? undefined : { y: -2 }}
        transition={{ type: 'spring', stiffness: 360, damping: 30 }}
      >
        <AnimatePresence mode='wait' initial={false}>
          <motion.button
            ref={imageButtonRef}
            key={images[currentIndex]}
            type='button'
            className='absolute inset-0 h-full w-full cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white'
            onClick={openCurrentImage}
            aria-label={`View ${alt} image ${currentIndex + 1} of ${images.length} in full size`}
            initial={reduceMotion ? false : { opacity: 0, x: direction * 18, scale: 0.995 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: direction * -12, scale: 0.995 }}
            transition={{ duration: reduceMotion ? 0.01 : 0.24, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.img
              src={images[currentIndex]}
              alt={`${alt} - Image ${currentIndex + 1}`}
              className='h-full w-full object-cover'
              loading='lazy'
              width='1280'
              height='720'
              whileHover={reduceMotion ? undefined : { scale: 1.015 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            />
          </motion.button>
        </AnimatePresence>

        <motion.button
          type='button'
          onClick={goToPrevious}
          className='absolute left-2 top-1/2 z-10 flex min-h-[40px] min-w-[40px] -translate-y-1/2 items-center justify-center rounded-sm bg-black/60 p-2 text-white opacity-100 transition-colors hover:bg-black/80 focus:outline-none focus:ring-2 focus:ring-white sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100'
          aria-label='Previous image'
          whileHover={reduceMotion ? undefined : { scale: 1.08, x: -2 }}
          whileTap={reduceMotion ? undefined : { scale: 0.92 }}
          transition={{ type: 'spring', stiffness: 430, damping: 28 }}
        >
          <ChevronLeft size={18} aria-hidden='true' />
        </motion.button>

        <motion.button
          type='button'
          onClick={goToNext}
          className='absolute right-2 top-1/2 z-10 flex min-h-[40px] min-w-[40px] -translate-y-1/2 items-center justify-center rounded-sm bg-black/60 p-2 text-white opacity-100 transition-colors hover:bg-black/80 focus:outline-none focus:ring-2 focus:ring-white sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100'
          aria-label='Next image'
          whileHover={reduceMotion ? undefined : { scale: 1.08, x: 2 }}
          whileTap={reduceMotion ? undefined : { scale: 0.92 }}
          transition={{ type: 'spring', stiffness: 430, damping: 28 }}
        >
          <ChevronRight size={18} aria-hidden='true' />
        </motion.button>

        <div className='absolute bottom-2 left-2 z-10 flex gap-1' role='group' aria-label='Choose image'>
          {images.map((_, index) => (
            <motion.button
              key={index}
              type='button'
              onClick={() => goToIndex(index)}
              className='flex min-h-[32px] min-w-[32px] items-center justify-center rounded-sm bg-black/45 focus:outline-none focus:ring-2 focus:ring-white'
              aria-label={`Go to image ${index + 1}`}
              aria-pressed={index === currentIndex}
              whileHover={reduceMotion ? undefined : { scale: 1.08 }}
              whileTap={reduceMotion ? undefined : { scale: 0.92 }}
            >
              <motion.span
                className={`h-1.5 ${index === currentIndex ? 'bg-white' : 'bg-white/60'}`}
                aria-hidden='true'
                animate={{ width: index === currentIndex ? 16 : 6 }}
                transition={reduceMotion ? { duration: 0.01 } : { type: 'spring', stiffness: 460, damping: 32 }}
              />
            </motion.button>
          ))}
        </div>

        <motion.div
          key={currentIndex}
          className='absolute right-2 top-2 z-10 rounded-sm bg-black/60 px-2 py-1 font-mono text-[10px] text-white'
          aria-live='polite'
          initial={reduceMotion ? false : { opacity: 0, y: -3 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0.01 : 0.16 }}
        >
          {currentIndex + 1} / {images.length}
        </motion.div>
      </motion.div>

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
