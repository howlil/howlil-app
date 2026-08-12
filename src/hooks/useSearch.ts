/** @format */

import { useCallback, useRef, useState } from 'react';
import { withBase } from '../lib/paths';

export interface SearchResult {
  title: string;
  url: string;
  type: 'blog' | 'project';
  excerpt: string;
}

function isSearchResult(value: unknown): value is SearchResult {
  if (!value || typeof value !== 'object') return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item.title === 'string' &&
    typeof item.url === 'string' &&
    (item.type === 'blog' || item.type === 'project') &&
    typeof item.excerpt === 'string'
  );
}

export function useSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [allContent, setAllContent] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const hasFetchedRef = useRef(false);
  const inFlightRef = useRef<Promise<void> | null>(null);

  const fetchContent = useCallback(async (signal?: AbortSignal) => {
    if (hasFetchedRef.current) return;
    if (inFlightRef.current) return inFlightRef.current;

    setIsLoading(true);
    setHasError(false);

    const request = (async () => {
      try {
        const response = await fetch(withBase('/api/search.json'), { signal });
        if (!response.ok) {
          throw new Error(`Search index request failed with ${response.status}`);
        }

        const data: unknown = await response.json();
        if (!Array.isArray(data) || !data.every(isSearchResult)) {
          throw new Error('Search index response has an invalid shape');
        }

        if (!signal?.aborted) {
          setAllContent(data);
          hasFetchedRef.current = true;
        }
      } catch (error) {
        if (signal?.aborted || (error instanceof DOMException && error.name === 'AbortError')) {
          return;
        }

        console.error('Failed to load search index:', error);
        setAllContent([]);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    })();

    inFlightRef.current = request;
    try {
      await request;
    } finally {
      if (inFlightRef.current === request) {
        inFlightRef.current = null;
      }
    }
  }, []);

  const query = searchQuery.trim().toLocaleLowerCase('en-US');
  const results = query
    ? allContent.filter((item) => {
        const title = item.title.toLocaleLowerCase('en-US');
        const excerpt = item.excerpt.toLocaleLowerCase('en-US');
        return title.includes(query) || excerpt.includes(query);
      })
    : [];

  const updateSearchQuery = useCallback((value: string) => {
    setSearchQuery(value);
    setSelectedIndex(0);
  }, []);

  return {
    searchQuery,
    setSearchQuery: updateSearchQuery,
    results,
    selectedIndex,
    setSelectedIndex,
    allContent,
    isLoading,
    hasError,
    fetchContent,
  };
}
