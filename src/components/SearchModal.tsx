/** @format */

import {useEffect, useState} from 'react';

interface SearchResult {
  title: string;
  url: string;
  type: 'blog' | 'project';
  excerpt: string;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({isOpen, onClose}: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isDark, setIsDark] = useState(false);
  const [allContent, setAllContent] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all content from API
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch('/api/search.json');
        if (response.ok) {
          const data = await response.json();
          setAllContent(data);
        } else {
          console.error('Failed to fetch search content');
          setAllContent([]);
        }
      } catch (error) {
        console.error('Error fetching search content:', error);
        setAllContent([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, []);

  useEffect(() => {
    // Check initial dark mode state
    const checkDarkMode = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };

    checkDarkMode();

    // Watch for changes in body class
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isLoading || searchQuery.trim() === '') {
      setResults([]);
      return;
    }

    const filtered = allContent.filter((item) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(searchLower) ||
        item.excerpt.toLowerCase().includes(searchLower)
      );
    });

    setResults(filtered);
    setSelectedIndex(0);
  }, [searchQuery, allContent, isLoading]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % results.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(
          (prev) => (prev - 1 + results.length) % results.length
        );
      } else if (e.key === 'Enter' && results[selectedIndex]) {
        window.location.href = results[selectedIndex].url;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, onClose]);

  if (!isOpen) return null;

  return (
    <div className='fixed  inset-0 z-50 flex items-start justify-center pt-20 px-4'>
      {/* Backdrop with blur */}
      <div
        className='search-modal-backdrop absolute inset-0 bg-black/50 backdrop-blur-sm'
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div
        className='search-modal-content relative w-full max-w-2xl rounded-lg shadow-2xl overflow-hidden'
        style={{
          backgroundColor: isDark ? '#2B2B2B' : '#FFFFFF',
        }}
      >
        {/* Search Input */}
        <div
          className='search-modal-border flex items-center gap-3 p-4 border-b'
          style={{
            borderColor: isDark ? '#3C3F41' : '#E5E7EB',
          }}
        >
          <svg
            className='w-5 h-5 text-gray-400'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
            />
          </svg>
          <input
            type='text'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder='Search blog posts and projects...'
            className='flex-1 text-base outline-none placeholder-gray-400'
            style={{
              color: isDark ? '#A9B7C6' : '#111827',
              backgroundColor: 'transparent',
            }}
            autoFocus
          />
          <kbd
            className='px-2 py-1 text-xs rounded'
            style={{
              color: isDark ? '#A9B7C6' : '#6B7280',
              backgroundColor: isDark ? '#3C3F41' : '#F3F4F6',
            }}
          >
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className='max-h-96 overflow-y-auto'>
          {isLoading && (
            <div
              className='p-8 text-center'
              style={{
                color: isDark ? '#9C9C9C' : '#374151',
              }}
            >
              Loading...
            </div>
          )}
          {!isLoading && searchQuery && results.length === 0 && (
            <div
              className='p-8 text-center'
              style={{
                color: isDark ? '#9C9C9C' : '#374151',
              }}
            >
              No results found for "{searchQuery}"
            </div>
          )}

          {results.map((result, index) => {
            const isSelected = index === selectedIndex;
            return (
              <a
                key={result.url}
                href={result.url}
                className='search-modal-result block p-4 border-b transition-colors'
                style={{
                  borderColor: isDark ? '#3C3F41' : '#F3F4F6',
                  backgroundColor: isSelected
                    ? isDark
                      ? '#3C3F41'
                      : '#F9FAFB'
                    : 'transparent',
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.backgroundColor = isDark
                      ? '#3C3F41'
                      : '#F9FAFB';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <div className='flex items-start gap-3'>
                  <div className='flex-shrink-0 mt-1'>
                    {result.type === 'blog' ? (
                      <svg
                        className='w-5 h-5 text-gray-400'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                        />
                      </svg>
                    ) : (
                      <svg
                        className='w-5 h-5 text-gray-400'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10'
                        />
                      </svg>
                    )}
                  </div>
                  <div className='flex-1 min-w-0'>
                    <div className='flex items-center gap-2 mb-1'>
                      <h3
                        className='font-semibold'
                        style={{
                          color: isDark ? '#A9B7C6' : '#1F2937',
                        }}
                      >
                        {result.title}
                      </h3>
                      <span
                        className='px-2 py-0.5 text-xs rounded-full'
                        style={{
                          backgroundColor: isDark ? '#3C3F41' : '#F3F4F6',
                          color: isDark ? '#A9B7C6' : '#4B5563',
                        }}
                      >
                        {result.type}
                      </span>
                    </div>
                    <p
                      className='text-sm line-clamp-1'
                      style={{
                        color: isDark ? '#9C9C9C' : '#374151',
                      }}
                    >
                      {result.excerpt}
                    </p>
                  </div>
                </div>
              </a>
            );
          })}
        </div>

        {/* Footer */}
        {results.length > 0 && (
          <div
            className='search-modal-footer flex items-center justify-between p-3 border-t text-xs'
            style={{
              backgroundColor: isDark ? '#3C3F41' : '#F9FAFB',
              borderColor: isDark ? '#3C3F41' : '#E5E7EB',
              color: isDark ? '#A9B7C6' : '#4B5563',
            }}
          >
            <div className='flex items-center gap-4'>
              <span className='flex items-center gap-1'>
                <kbd
                  className='px-1.5 py-0.5 border rounded'
                  style={{
                    backgroundColor: isDark ? '#2B2B2B' : '#FFFFFF',
                    borderColor: isDark ? '#3C3F41' : '#D1D5DB',
                  }}
                >
                  ↑
                </kbd>
                <kbd
                  className='px-1.5 py-0.5 border rounded'
                  style={{
                    backgroundColor: isDark ? '#2B2B2B' : '#FFFFFF',
                    borderColor: isDark ? '#3C3F41' : '#D1D5DB',
                  }}
                >
                  ↓
                </kbd>
                navigate
              </span>
              <span className='flex items-center gap-1'>
                <kbd
                  className='px-1.5 py-0.5 border rounded'
                  style={{
                    backgroundColor: isDark ? '#2B2B2B' : '#FFFFFF',
                    borderColor: isDark ? '#3C3F41' : '#D1D5DB',
                  }}
                >
                  ↵
                </kbd>
                select
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
