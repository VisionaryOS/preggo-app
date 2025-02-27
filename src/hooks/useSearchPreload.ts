import { useEffect } from 'react';
import { getSearchIndex } from '@/lib/search';

/**
 * A hook that preloads the search index during application initialization
 * This ensures the search data is available immediately when needed
 */
export function useSearchPreload() {
  useEffect(() => {
    // Initialize search index on application load
    const initSearchIndex = async () => {
      try {
        console.log('Preloading search index...');
        // This will initialize the index and load sample data
        getSearchIndex();
        console.log('Search index preloaded successfully.');
      } catch (error) {
        console.error('Error preloading search index:', error);
      }
    };

    // Start preloading with a small delay to not block initial rendering
    const timer = setTimeout(() => {
      initSearchIndex();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // This hook doesn't return anything as it just performs the preloading
  return null;
} 