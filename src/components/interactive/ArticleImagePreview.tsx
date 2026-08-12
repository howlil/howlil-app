/** @format */

import { useEffect, useState } from 'react';
import ImageModal from './ImageModal';

interface PreviewImage {
  url: string;
  alt: string;
}

export default function ArticleImagePreview() {
  const [preview, setPreview] = useState<PreviewImage | null>(null);

  useEffect(() => {
    const images = Array.from(
      document.querySelectorAll<HTMLImageElement>('#article-content img, #cover-image'),
    );

    const cleanups = images.map((image) => {
      const previousTabIndex = image.getAttribute('tabindex');
      const previousRole = image.getAttribute('role');
      const previousAriaLabel = image.getAttribute('aria-label');
      const previousCursor = image.style.cursor;

      image.tabIndex = 0;
      image.setAttribute('role', 'button');
      image.setAttribute('aria-label', `View ${image.alt || 'image'} in full size`);
      image.style.cursor = 'zoom-in';

      const open = () => {
        const url = image.currentSrc || image.src;
        if (url) setPreview({ url, alt: image.alt || 'Image preview' });
      };

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          open();
        }
      };

      image.addEventListener('click', open);
      image.addEventListener('keydown', handleKeyDown);

      return () => {
        image.removeEventListener('click', open);
        image.removeEventListener('keydown', handleKeyDown);
        image.style.cursor = previousCursor;
        if (previousTabIndex === null) image.removeAttribute('tabindex');
        else image.setAttribute('tabindex', previousTabIndex);
        if (previousRole === null) image.removeAttribute('role');
        else image.setAttribute('role', previousRole);
        if (previousAriaLabel === null) image.removeAttribute('aria-label');
        else image.setAttribute('aria-label', previousAriaLabel);
      };
    });

    return () => cleanups.forEach((cleanup) => cleanup());
  }, []);

  if (!preview) return null;

  return (
    <ImageModal
      isOpen
      imageUrl={preview.url}
      alt={preview.alt}
      onClose={() => setPreview(null)}
    />
  );
}
