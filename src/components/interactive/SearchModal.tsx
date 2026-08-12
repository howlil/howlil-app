/** @format */

import { useEffect, useRef, type RefObject } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useDarkMode } from '../../hooks/useDarkMode';
import { useSearch } from '../../hooks/useSearch';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  returnFocusRef?: RefObject<HTMLElement | null>;
}

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

export default function SearchModal({ isOpen, onClose, returnFocusRef }: SearchModalProps) {
  const { isDark } = useDarkMode();
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const {
    searchQuery,
    setSearchQuery,
    results,
    selectedIndex,
    setSelectedIndex,
    allContent,
    isLoading,
    hasError,
    fetchContent,
  } = useSearch();

  useEffect(() => {
    if (!isOpen) return;

    const controller = new AbortController();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    void fetchContent(controller.signal);

    const focusFrame = window.requestAnimationFrame(() => inputRef.current?.focus());

    return () => {
      controller.abort();
      window.cancelAnimationFrame(focusFrame);
      document.body.style.overflow = previousOverflow;
      returnFocusRef?.current?.focus();
    };
  }, [isOpen, fetchContent, returnFocusRef]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key === 'Tab') {
        const focusable = Array.from(
          dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR) ?? [],
        ).filter((element) => !element.hasAttribute('disabled'));

        if (focusable.length === 0) {
          event.preventDefault();
          inputRef.current?.focus();
          return;
        }

        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const active = document.activeElement;

        if (event.shiftKey && active === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && active === last) {
          event.preventDefault();
          first.focus();
        }
        return;
      }

      if (results.length === 0) return;

      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setSelectedIndex((previous) => (previous + 1) % results.length);
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        setSelectedIndex((previous) => (previous - 1 + results.length) % results.length);
      } else if (event.key === 'Enter' && results[selectedIndex]) {
        event.preventDefault();
        window.location.assign(results[selectedIndex].url);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, results, selectedIndex, setSelectedIndex]);

  useEffect(() => {
    if (!isOpen) return;
    document.getElementById(`search-result-${selectedIndex}`)?.scrollIntoView({ block: 'nearest' });
  }, [isOpen, selectedIndex]);

  const activeDescendant = results[selectedIndex] ? `search-result-${selectedIndex}` : undefined;
  const statusMessage = isLoading
    ? 'Loading search index.'
    : hasError
      ? 'Search is temporarily unavailable.'
      : searchQuery.trim() && results.length === 0
        ? `No results found for ${searchQuery}.`
        : results.length > 0
          ? `${results.length} search result${results.length === 1 ? '' : 's'} available.`
          : allContent.length > 0
            ? 'Search index ready.'
            : '';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          role='dialog'
          aria-modal='true'
          aria-labelledby='search-dialog-title'
          className='fixed inset-0 z-50 flex items-start justify-center px-4 pt-20'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.button
            type='button'
            aria-label='Close search'
            className='absolute inset-0 h-full w-full cursor-default bg-black/50 backdrop-blur-sm'
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            ref={dialogRef}
            className='relative w-full max-w-2xl overflow-hidden rounded-lg shadow-2xl'
            style={{ backgroundColor: isDark ? '#2B2B2B' : '#FFFFFF' }}
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
          >
            <h2 id='search-dialog-title' className='sr-only'>
              Search blog posts and projects
            </h2>

            <div
              className='flex items-center gap-3 border-b p-4'
              style={{ borderColor: isDark ? '#3C3F41' : '#E5E7EB' }}
            >
              <svg
                className='h-5 w-5 text-gray-400'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
                aria-hidden='true'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                />
              </svg>
              <input
                ref={inputRef}
                type='search'
                role='combobox'
                aria-label='Search blog posts and projects'
                aria-expanded='true'
                aria-controls='search-results'
                aria-activedescendant={activeDescendant}
                aria-autocomplete='list'
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder='Search blog posts and projects...'
                className='flex-1 bg-transparent text-base outline-none placeholder-gray-400'
                style={{ color: isDark ? '#A9B7C6' : '#111827' }}
              />
              <kbd
                className='rounded px-2 py-1 text-xs'
                style={{
                  color: isDark ? '#A9B7C6' : '#6B7280',
                  backgroundColor: isDark ? '#3C3F41' : '#F3F4F6',
                }}
              >
                ESC
              </kbd>
            </div>

            <div id='search-status' role='status' aria-live='polite' className='sr-only'>
              {statusMessage}
            </div>

            <div id='search-results' role='listbox' className='max-h-96 overflow-y-auto'>
              {isLoading && (
                <div className='p-8 text-center text-gray-600'>Loading...</div>
              )}

              {!isLoading && hasError && (
                <div className='p-8 text-center text-gray-600'>
                  Search is temporarily unavailable. Close and reopen to retry.
                </div>
              )}

              {!isLoading && !hasError && searchQuery.trim() && results.length === 0 && (
                <div className='p-8 text-center text-gray-600'>
                  No results found for “{searchQuery}”.
                </div>
              )}

              {!isLoading && !hasError && !searchQuery.trim() && allContent.length > 0 && (
                <div className='p-8 text-center text-gray-600'>
                  Type to search blog posts and projects.
                </div>
              )}

              {results.map((result, index) => {
                const isSelected = index === selectedIndex;
                return (
                  <a
                    id={`search-result-${index}`}
                    key={result.url}
                    href={result.url}
                    role='option'
                    aria-selected={isSelected}
                    className='block border-b p-4 transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500'
                    style={{
                      borderColor: isDark ? '#3C3F41' : '#F3F4F6',
                      backgroundColor: isSelected
                        ? isDark
                          ? '#3C3F41'
                          : '#F9FAFB'
                        : 'transparent',
                    }}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    <div className='flex items-start gap-3'>
                      <span className='mt-1 text-xs uppercase tracking-wide text-gray-500'>
                        {result.type}
                      </span>
                      <div className='min-w-0 flex-1'>
                        <h3 className='font-semibold text-gray-800'>{result.title}</h3>
                        <p className='mt-1 line-clamp-1 text-sm text-gray-600'>{result.excerpt}</p>
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>

            {results.length > 0 && (
              <div
                className='flex items-center gap-4 border-t p-3 text-xs text-gray-600'
                style={{
                  backgroundColor: isDark ? '#3C3F41' : '#F9FAFB',
                  borderColor: isDark ? '#3C3F41' : '#E5E7EB',
                }}
              >
                <span>↑ ↓ navigate</span>
                <span>↵ select</span>
                <span>Esc close</span>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
