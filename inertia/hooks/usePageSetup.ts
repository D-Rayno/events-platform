import { useState, useEffect } from 'react';

/**
 * Infinite scroll React hook
 */
export function useInfiniteScroll(callback: () => void, threshold = 200) {
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  /**
   * Handle scroll event
   */
  const handleScroll = () => {
    if (isLoading || !hasMore) return;

    const scrollPosition = window.innerHeight + window.scrollY;
    const pageHeight = document.documentElement.scrollHeight;

    if (pageHeight - scrollPosition < threshold) {
      setIsLoading(true);
      callback();
    }
  };

  /**
   * Reset loading state
   */
  const resetLoading = () => {
    setIsLoading(false);
  };

  /**
   * Set has more flag
   * @param value - Has more items
   */
  const setHasMoreState = (value: boolean) => {
    setHasMore(value);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isLoading, hasMore]); // Dependencies to rebind event listener when state changes

  return {
    isLoading,
    hasMore,
    resetLoading,
    setHasMore: setHasMoreState,
  };
}