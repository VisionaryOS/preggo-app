import { useState, useEffect, useCallback } from 'react';
import { useSearchStore, SearchItem } from '@/store/search-store';
import { getSearchIndex, performCombinedSearch, clearSearchIndex } from '@/lib/search';
import { useRouter } from 'next/navigation';

/**
 * Custom hook for handling search functionality using FlexSearch
 * This hook encapsulates all search-related logic in one place
 */
export function useSearch() {
  const router = useRouter();
  const {
    searchQuery,
    setSearchQuery,
    showResults,
    setShowResults,
    searchResults,
    setSearchResults,
    selectedResultIndex,
    setSelectedResultIndex,
    activeFilters,
    toggleFilter,
    setActiveFilters,
    addRecentSearch,
    setSearchTime,
    setSearchStage,
    setSearchProgress,
    resetSearch,
    clearSearchResults,
    closeSearchWithoutReset,
    isSearching,
    setIsSearching
  } = useSearchStore();

  // Handle search input change
  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
    
    // Only show results if query has at least 2 characters
    if (query.trim().length >= 2) {
      setShowResults(true);
      performSearch(query);
    } else {
      setShowResults(false);
      setSearchResults([]);
    }
  }, [setSearchQuery, setShowResults, setSearchResults]);

  // Perform the actual search
  const performSearch = useCallback((query: string) => {
    setSearchStage('searching');
    const startTime = performance.now();

    try {
      // Get the current pathname to provide context for search
      const pathname = window.location.pathname;

      // Perform the search with the given query and filters
      const results = performCombinedSearch(query, activeFilters, pathname);
      
      // Update search results in store
      setSearchResults(results);
      
      // Reset selected result index
      setSelectedResultIndex(-1);
      
      // Record search performance
      const endTime = performance.now();
      setSearchTime(endTime - startTime);
      
      // Mark search as complete
      setSearchStage('complete');
      setSearchProgress(100);
    } catch (error) {
      console.error('Search error:', error);
      setSearchStage('idle');
      setSearchProgress(0);
      setSearchResults([]);
    }
  }, [activeFilters, setSearchResults, setSelectedResultIndex, setSearchTime, setSearchStage, setSearchProgress]);

  // Handle navigation when a search result is clicked
  const handleResultClick = useCallback((path: string) => {
    if (!path) return;
    
    // Add the search query to recent searches
    addRecentSearch(searchQuery);
    
    // Close the search overlay
    closeSearchWithoutReset();
    
    // Navigate to the result path
    router.push(path);
  }, [addRecentSearch, closeSearchWithoutReset, router, searchQuery]);

  // Initialize search index when component mounts
  useEffect(() => {
    // Initialize the search index if it hasn't been initialized yet
    getSearchIndex();
    
    // Clean up search index when component unmounts
    return () => {
      // No need to clear the index on unmount as it's a singleton
    };
  }, []);

  // Re-run search when filters change
  useEffect(() => {
    if (searchQuery.trim().length >= 2) {
      performSearch(searchQuery);
    }
  }, [activeFilters, performSearch, searchQuery]);

  // Reset search when ESC key is pressed
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSearching) {
        resetSearch();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearching, resetSearch]);

  return {
    // Search state
    searchQuery,
    showResults,
    searchResults,
    selectedResultIndex,
    activeFilters,
    isSearching,
    
    // Search actions
    handleSearchChange,
    performSearch,
    handleResultClick,
    setSelectedResultIndex,
    toggleFilter,
    setActiveFilters,
    
    // Search control functions
    openSearch: () => setIsSearching(true),
    closeSearch: resetSearch,
    clearResults: clearSearchResults,
    closeSearchWithoutReset,
    refreshSearchIndex: () => {
      clearSearchIndex();
      getSearchIndex();
    }
  };
} 