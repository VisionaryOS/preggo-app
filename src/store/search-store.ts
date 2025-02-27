import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Define the types for search results
export interface SearchItem {
  id: string;
  title: string;
  type: 'tool' | 'lesson' | 'page' | 'wiki';
  path: string;
  icon?: any;
  description?: string;
}

// Define the search store state
interface SearchState {
  // Search input and state
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  // UI state
  isSearching: boolean;
  setIsSearching: (isSearching: boolean) => void;
  showResults: boolean;
  setShowResults: (show: boolean) => void;
  
  // Results and selection
  searchResults: SearchItem[];
  setSearchResults: (results: SearchItem[]) => void;
  selectedResultIndex: number;
  setSelectedResultIndex: (index: number) => void;
  
  // Filtering
  activeFilters: string[];
  setActiveFilters: (filters: string[]) => void;
  toggleFilter: (filter: string) => void;
  
  // Search scope/context
  searchMode: 'global' | 'page' | 'both';
  setSearchMode: (mode: 'global' | 'page' | 'both') => void;
  
  // Recent searches (persisted)
  recentSearches: string[];
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
  
  // Advanced search options
  relevanceThreshold: number;
  setRelevanceThreshold: (threshold: number) => void;
  fuzzyMatching: boolean;
  setFuzzyMatching: (enabled: boolean) => void;
  searchScope: 'all' | 'current' | 'recent';
  setSearchScope: (scope: 'all' | 'current' | 'recent') => void;
  searchTimeframe: 'anytime' | 'today' | 'week' | 'month';
  setSearchTimeframe: (timeframe: 'anytime' | 'today' | 'week' | 'month') => void;
  
  // Search performance metrics
  searchTime: number;
  setSearchTime: (time: number) => void;
  searchStage: 'indexing' | 'searching' | 'processing' | 'complete' | 'idle';
  setSearchStage: (stage: 'indexing' | 'searching' | 'processing' | 'complete' | 'idle') => void;
  searchProgress: number;
  setSearchProgress: (progress: number) => void;
  
  // Reset functions with different levels of control
  resetSearch: () => void;
  clearSearchResults: () => void;
  closeSearchWithoutReset: () => void;
}

// Create the store with initial state and actions, using persist middleware for recent searches
export const useSearchStore = create<SearchState>()(
  persist(
    (set) => ({
      // Initial state
      searchQuery: '',
      isSearching: false,
      showResults: false,
      searchResults: [],
      selectedResultIndex: -1,
      activeFilters: [],
      searchMode: 'both',
      recentSearches: [],
      relevanceThreshold: 60,
      fuzzyMatching: true,
      searchScope: 'all',
      searchTimeframe: 'anytime',
      searchTime: 0,
      searchStage: 'idle',
      searchProgress: 0,
      
      // Actions
      setSearchQuery: (query: string) => set({ searchQuery: query }),
      
      setIsSearching: (isSearching: boolean) => set({ isSearching }),
      
      setShowResults: (show: boolean) => set({ showResults: show }),
      
      setSearchResults: (results: SearchItem[]) => set({ searchResults: results }),
      
      setSelectedResultIndex: (index: number) => set({ selectedResultIndex: index }),
      
      setActiveFilters: (filters: string[]) => set({ activeFilters: filters }),
      
      toggleFilter: (filter: string) => set((state) => ({
        activeFilters: state.activeFilters.includes(filter)
          ? state.activeFilters.filter(f => f !== filter)
          : [...state.activeFilters, filter]
      })),
      
      setSearchMode: (mode: 'global' | 'page' | 'both') => set({ searchMode: mode }),
      
      // Manage recent searches
      addRecentSearch: (query: string) => set((state) => {
        if (!query || query.trim().length < 2) return state;
        
        const normalizedQuery = query.trim();
        const filteredSearches = state.recentSearches.filter(
          item => item.toLowerCase() !== normalizedQuery.toLowerCase()
        );
        
        return {
          recentSearches: [normalizedQuery, ...filteredSearches].slice(0, 5)
        };
      }),
      
      clearRecentSearches: () => set({ recentSearches: [] }),
      
      // Advanced search options
      setRelevanceThreshold: (threshold: number) => set({ relevanceThreshold: threshold }),
      
      setFuzzyMatching: (enabled: boolean) => set({ fuzzyMatching: enabled }),
      
      setSearchScope: (scope: 'all' | 'current' | 'recent') => set({ searchScope: scope }),
      
      setSearchTimeframe: (timeframe: 'anytime' | 'today' | 'week' | 'month') => set({ searchTimeframe: timeframe }),
      
      // Search performance tracking
      setSearchTime: (time: number) => set({ searchTime: time }),
      
      setSearchStage: (stage: 'indexing' | 'searching' | 'processing' | 'complete' | 'idle') => set({ searchStage: stage }),
      
      setSearchProgress: (progress: number) => set({ searchProgress: progress }),
      
      // Reset search state to defaults - completely resets everything
      resetSearch: () => set({
        searchQuery: '',
        isSearching: false,
        showResults: false,
        searchResults: [],
        selectedResultIndex: -1,
        activeFilters: [],
        searchStage: 'idle',
        searchProgress: 0
      }),
      
      // Clear only the search results but keep the modal open
      clearSearchResults: () => set({
        searchQuery: '',
        showResults: false,
        searchResults: [],
        selectedResultIndex: -1,
        searchStage: 'idle',
        searchProgress: 0
      }),
      
      // Close the search modal without resetting the query
      closeSearchWithoutReset: () => set({ 
        isSearching: false,
        showResults: false,
        searchStage: 'idle'
      })
    }),
    {
      name: 'preggo-search-storage',
      partialize: (state) => ({ 
        recentSearches: state.recentSearches,
        relevanceThreshold: state.relevanceThreshold,
        fuzzyMatching: state.fuzzyMatching,
        searchScope: state.searchScope,
        searchTimeframe: state.searchTimeframe
      })
    }
  )
); 