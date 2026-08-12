/** @format */

import { useEffect, useState, useRef } from 'react';
import { withBase } from '../lib/paths';

interface SearchResult {
  title: string;
  url: string;
  type: 'blog' | 'project';
  excerpt: string;
}

export function useSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [allContent, setAllContent] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const hasFetchedRef = useRef(false);

  const fetchContent = async () => {
    if (hasFetchedRef.current) {
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    setIsLoading(true);

    try {
      const response = await fetch(withBase('/api/search.json'));
      if (!cancelled && response.ok) {
        const data = await response.json();
        setAllContent(data);
      } else if (!cancelled) {
        setAllContent([]);
      }
    } catch {
      if (!cancelled) setAllContent([]);
    } finally {
      if (!cancelled) {
        setIsLoading(false);
        hasFetchedRef.current = true;
      }
    }

    return () => {
      cancelled = true;
    };
  };

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

  return {
    searchQuery,
    setSearchQuery,
    results,
    selectedIndex,
    setSelectedIndex,
    allContent,
    isLoading,
    fetchContent,
  };
}
