/** @format */

import {useState} from 'react';
import {ChevronLeft, ChevronRight} from 'lucide-react';
import ImageModal from './ImageModal';

interface ImageSliderProps {
  images: string[];
  alt: string;
}

export default function ImageSlider({images, alt}: ImageSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [modalImage, setModalImage] = useState<string | null>(null);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  if (images.length === 0) return null;

  if (images.length === 1) {
    return (
      <>
        <div
          className='w-full aspect-video rounded-lg overflow-hidden cursor-pointer'
          onClick={() => setModalImage(images[0])}
        >
          <img
            src={images[0]}
            alt={alt}
            className='w-full h-full object-cover'
          />
        </div>
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
      <div className='relative w-full aspect-video rounded-lg overflow-hidden group'>
        {/* Main Image */}
        <img
          src={images[currentIndex]}
          alt={`${alt} - Image ${currentIndex + 1}`}
          className='w-full h-full object-cover transition-opacity duration-300 cursor-pointer'
          onClick={() => setModalImage(images[currentIndex])}
        />

        {/* Navigation Arrows */}
        <button
          onClick={goToPrevious}
          className='absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity'
          aria-label='Previous image'
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={goToNext}
          className='absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity'
          aria-label='Next image'
        >
          <ChevronRight size={20} />
        </button>

        {/* Dots Indicator */}
        <div className='absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2'>
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex
                  ? 'bg-white w-6'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Image Counter */}
        <div className='absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm'>
          {currentIndex + 1} / {images.length}
        </div>
      </div>

      {/* Image Modal */}
      {modalImage && (
        <ImageModal
          isOpen={!!modalImage}
          imageUrl={modalImage}
          alt={`${alt} - Image ${images.indexOf(modalImage) + 1}`}
          onClose={() => setModalImage(null)}
        />
      )}
    </>
  );
}
