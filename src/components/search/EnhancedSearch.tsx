import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search,
  X,
  Filter,
  Check,
  Loader2,
  BookOpen,
  Wrench,
  FileText,
  BookCopy,
  Info,
  Mic,
  MicOff,
  Calendar,
  Clock
} from 'lucide-react';

// Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import SearchSuggestions from './SearchSuggestions';
import SearchOptions from './SearchOptions';
import SearchProgress from './SearchProgress';
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VisualSearchResults from './VisualSearchResults';
import SearchFilters from './SearchFilters';

// Utils and hooks
import { cn } from '@/lib/utils';
import { useSearch } from '@/hooks/useSearch';
import { SearchItem, useSearchStore } from '@/store/search-store';
import { addItemsToIndex } from '@/lib/search';

// Define necessary prop interfaces if they're not exported by the components
interface SearchProgressProps {
  isSearching: boolean;
  progress: number;
  searchStage: string;
  totalResults: number;
  searchTime: number;
}

interface SearchSuggestionsProps {
  recentSearches: string[];
  trendingSearches: string[];
  onSuggestionClick: (query: string) => void;
  onClearRecent: () => void;
}

interface EnhancedSearchProps {
  searchableItems: SearchItem[];
}

// Add missing types
declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognition;
    webkitSpeechRecognition?: new () => SpeechRecognition;
  }
  
  interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    onresult: (event: SpeechRecognitionEvent) => void;
    onerror: (event: SpeechRecognitionErrorEvent) => void;
    onend: () => void;
    start: () => void;
    stop: () => void;
  }
  
  interface SpeechRecognitionEvent {
    readonly results: SpeechRecognitionResultList;
  }
  
  interface SpeechRecognitionResultList {
    [index: number]: SpeechRecognitionResult;
    readonly length: number;
  }
  
  interface SpeechRecognitionResult {
    [index: number]: SpeechRecognitionAlternative;
    readonly isFinal: boolean;
    readonly length: number;
  }
  
  interface SpeechRecognitionAlternative {
    readonly transcript: string;
    readonly confidence: number;
  }
  
  interface SpeechRecognitionErrorEvent extends Event {
    readonly error: string;
    readonly message: string;
  }
}

// Update SearchItem interface to include tags property
interface EnhancedSearchItem extends SearchItem {
  tags?: string[];
}

const EnhancedSearch: React.FC<EnhancedSearchProps> = ({ searchableItems }) => {
  // Use our custom search hook instead of directly accessing the store
  const {
    searchQuery,
    showResults,
    searchResults,
    selectedResultIndex,
    activeFilters,
    isSearching,
    
    handleSearchChange,
    performSearch,
    handleResultClick,
    setSelectedResultIndex,
    toggleFilter,
    
    openSearch,
    closeSearch,
    clearResults,
    closeSearchWithoutReset,
    refreshSearchIndex
  } = useSearch();
  
  // Get store functions that aren't exposed by the hook
  const { 
    setSearchStage,
    setSearchProgress,
    setSearchTime,
    recentSearches,
    clearRecentSearches
  } = useSearchStore();
  
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchResultsRef = useRef<HTMLDivElement>(null);
  
  // Add state for voice search
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  
  // Add more state
  const [showFilters, setShowFilters] = useState(false);
  
  // Check if voice recognition is supported
  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      setVoiceSupported(true);
    }
  }, []);
  
  // Define trending searches
  const trendingSearches = [
    "nutrition during pregnancy",
    "baby development",
    "birth plan",
    "exercise",
    "morning sickness"
  ];
  
  // Initialize search index with provided items
  useEffect(() => {
    if (searchableItems.length > 0) {
      setSearchStage('indexing');
      setSearchProgress(0);
      
      // Simulate indexing progress
      let progress = 0;
      const progressInterval = setInterval(() => {
        progress += 5;
        if (progress >= 95) {
          clearInterval(progressInterval);
          progress = 100;
        }
        setSearchProgress(progress);
      }, 50);
      
      // Add items to index
      const indexTime = performance.now();
      addItemsToIndex(searchableItems);
      const endTime = performance.now();
      
      // After indexing completes
      setTimeout(() => {
        setSearchTime(Math.round(endTime - indexTime));
        setSearchStage('idle');
        setSearchProgress(100);
        
        clearInterval(progressInterval);
      }, 1200);
    }
    
    return () => {
      // Cleanup function
      setSearchStage('idle');
      setSearchProgress(0);
    };
  }, [searchableItems, setSearchProgress, setSearchStage, setSearchTime]);
  
  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't handle shortcuts if the target is an input or if we're already searching
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        isSearching
      ) {
        return;
      }
      
      // Only handle Command/Ctrl + K to open search
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        openSearch();
        // Clear any previous search results when opening via keyboard shortcut
        clearResults();
        // Add a small delay to ensure the DOM is updated before focusing
        setTimeout(() => {
          searchInputRef.current?.focus();
        }, 100);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isSearching, openSearch, clearResults]);
  
  // Focus management effect
  useEffect(() => {
    if (isSearching && searchInputRef.current) {
      // Focus the search input when the search modal opens
      searchInputRef.current.focus();
      
      // Create an interval to check if focus is lost and refocus if needed
      const focusInterval = setInterval(() => {
        if (isSearching && 
            document.activeElement !== searchInputRef.current &&
            document.activeElement?.tagName !== 'BUTTON') {
          searchInputRef.current?.focus();
        }
      }, 100);
      
      // Prevent the page from scrolling when the overlay is open
      document.body.style.overflow = 'hidden';
      
      return () => {
        clearInterval(focusInterval);
        document.body.style.overflow = '';
      };
    }
  }, [isSearching]);
  
  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isSearching && 
        searchContainerRef.current && 
        !searchContainerRef.current.contains(event.target as Node) &&
        !(event.target as HTMLElement).closest('[data-search-trigger]')
      ) {
        closeSearchWithoutReset();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSearching, closeSearchWithoutReset]);
  
  // Scroll selected result into view when it changes
  useEffect(() => {
    if (selectedResultIndex >= 0 && searchResultsRef.current) {
      const resultsContainer = searchResultsRef.current;
      const selectedElement = resultsContainer.querySelector(`[data-index="${selectedResultIndex}"]`);
      
      if (selectedElement) {
        selectedElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest'
        });
      }
    }
  }, [selectedResultIndex]);
  
  // Handle suggestion click
  const handleSuggestionClick = (query: string) => {
    handleSearchChange(query);
  };
  
  // Filter options based on results
  const filterOptions = [
    { id: 'tool', label: 'Tools', count: searchResults.filter(item => item.type === 'tool').length || 0 },
    { id: 'lesson', label: 'Lessons', count: searchResults.filter(item => item.type === 'lesson').length || 0 },
    { id: 'wiki', label: 'Wiki', count: searchResults.filter(item => item.type === 'wiki').length || 0 },
    { id: 'page', label: 'Page Content', count: searchResults.filter(item => item.type === 'page').length || 0 }
  ];
  
  // More advanced filter groups for the SearchFilters component
  const filterGroups = [
    {
      title: 'Content Type',
      icon: BookOpen,
      filters: [
        { id: 'tool', label: 'Tools', count: searchResults.filter(item => item.type === 'tool').length || 0 },
        { id: 'lesson', label: 'Lessons', count: searchResults.filter(item => item.type === 'lesson').length || 0 },
        { id: 'wiki', label: 'Wiki', count: searchResults.filter(item => item.type === 'wiki').length || 0 },
        { id: 'page', label: 'Page Content', count: searchResults.filter(item => item.type === 'page').length || 0 }
      ]
    },
    {
      title: 'Time Period',
      icon: Calendar,
      filters: [
        { id: 'recent', label: 'Recent', count: searchResults.length, icon: Clock },
        { id: 'today', label: 'Today', count: Math.round(searchResults.length * 0.7), icon: Calendar },
        { id: 'week', label: 'This Week', count: Math.round(searchResults.length * 0.9), icon: Calendar },
        { id: 'month', label: 'This Month', count: searchResults.length, icon: Calendar }
      ]
    }
  ];
  
  // Clear filters handler
  const clearFilters = () => {
    if (activeFilters.length > 0) {
      useSearchStore.getState().setActiveFilters([]);
    }
  };
  
  // Handle voice search
  const toggleVoiceSearch = () => {
    if (!voiceSupported) return;
    
    if (isListening) {
      // Stop listening
      setIsListening(false);
      return;
    }
    
    setIsListening(true);
    
    // Use WebkitSpeechRecognition as fallback if SpeechRecognition isn't available
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error('Speech recognition not supported');
      setIsListening(false);
      return;
    }
    
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      handleSearchChange(transcript);
      setIsListening(false);
    };
    
    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
    };
    
    recognition.onend = () => {
      setIsListening(false);
    };
    
    recognition.start();
  };
  
  // Group results by type for better organization
  const groupedResults = searchResults.reduce((groups, result) => {
    const type = result.type;
    if (!groups[type]) {
      groups[type] = [];
    }
    groups[type].push(result as EnhancedSearchItem);
    return groups;
  }, {} as Record<string, EnhancedSearchItem[]>);
  
  // Helper to get appropriate icon for result type
  const getResultIcon = (type: string) => {
    switch (type) {
      case 'tool': return Wrench;
      case 'lesson': return FileText;
      case 'wiki': return BookCopy;
      case 'page': return Info;
      default: return Info;
    }
  };
  
  // Helper to get type label
  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'tool': return 'Tools';
      case 'lesson': return 'Lessons';
      case 'wiki': return 'Wiki';
      case 'page': return 'Page Content';
      default: return 'Other';
    }
  };
  
  // Function to highlight matching text in results
  const highlightMatch = (text: string, query: string) => {
    if (!query || !text) return text;
    
    try {
      const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
      return text.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-900 rounded-sm px-0.5">$1</mark>');
    } catch (e) {
      return text;
    }
  };
  
  // Enhanced search result component with highlighting
  const SearchResult = ({ result, index }: { result: SearchItem; index: number }) => {
    const isSelected = selectedResultIndex === index;
    const ResultIcon = result.icon || getResultIcon(result.type);
    const enhancedResult = result as EnhancedSearchItem;
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: index * 0.03 }}
        data-index={index}
        className={cn(
          "flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all",
          isSelected ? "bg-primary text-primary-foreground scale-[1.02]" : "hover:bg-muted"
        )}
        onClick={() => handleResultClick(result.path)}
        onMouseEnter={() => setSelectedResultIndex(index)}
      >
        <div className={cn(
          "p-2 rounded-md",
          isSelected ? "bg-primary-foreground/20" : "bg-muted/50"
        )}>
          <ResultIcon className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div 
            className="font-medium" 
            dangerouslySetInnerHTML={{ 
              __html: highlightMatch(result.title, searchQuery) 
            }} 
          />
          {result.description && (
            <div 
              className={cn(
                "text-sm truncate mt-0.5", 
                isSelected
                  ? "text-primary-foreground/70"
                  : "text-muted-foreground"
              )}
              dangerouslySetInnerHTML={{ 
                __html: highlightMatch(result.description, searchQuery) 
              }}
            />
          )}
          {enhancedResult.tags && enhancedResult.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1.5">
              {enhancedResult.tags.slice(0, 3).map((tag: string, i: number) => (
                <span 
                  key={i}
                  className={cn(
                    "text-[10px] px-1.5 py-0.5 rounded-sm",
                    isSelected 
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "bg-muted-foreground/10 text-muted-foreground"
                  )}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    );
  };
  
  // Loading state for results
  const ResultSkeleton = () => (
    <div className="flex items-start gap-3 p-3">
      <Skeleton className="h-9 w-9 rounded-md" />
      <div className="flex-1">
        <Skeleton className="h-5 w-3/4 mb-2" />
        <Skeleton className="h-4 w-full" />
        <div className="flex gap-1 mt-1.5">
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-3 w-14" />
        </div>
      </div>
    </div>
  );
  
  // Render search overlay
  return (
    <>
      {/* Search trigger button */}
      <Button
        variant="ghost"
        size="icon"
        className="w-9 h-9 text-muted-foreground"
        onClick={() => openSearch()}
        data-search-trigger="true"
      >
        <Search className="h-5 w-5" />
      </Button>
      
      {/* Search overlay */}
      <AnimatePresence>
        {isSearching && (
          <motion.div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-start justify-center pt-[15vh]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              ref={searchContainerRef}
              className="w-full max-w-xl bg-background border shadow-lg rounded-lg overflow-hidden"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {/* Search header */}
              <div className="relative">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (searchQuery.trim().length >= 2 && searchResults.length > 0) {
                      handleResultClick(searchResults[selectedResultIndex >= 0 ? selectedResultIndex : 0].path);
                    }
                  }}
                  className="flex items-center px-4"
                >
                  <Search className="h-5 w-5 text-muted-foreground absolute left-4" />
                  <Input
                    ref={searchInputRef}
                    value={searchQuery}
                    onChange={(e) => {
                      handleSearchChange(e.target.value);
                    }}
                    placeholder="Search for tools, lessons, wiki entries..."
                    className="pl-10 py-6 text-lg bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    autoComplete="off"
                    autoCorrect="off"
                    spellCheck="false"
                    autoFocus
                    onClick={(e) => {
                      e.stopPropagation();
                      e.currentTarget.focus();
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Escape') {
                        e.preventDefault();
                        closeSearch();
                        return;
                      }
                      
                      if (e.key === 'ArrowDown') {
                        e.preventDefault();
                        if (searchResults.length > 0) {
                          const newIndex = selectedResultIndex < searchResults.length - 1 ? selectedResultIndex + 1 : 0;
                          setSelectedResultIndex(newIndex);
                        }
                        return;
                      }
                      
                      if (e.key === 'ArrowUp') {
                        e.preventDefault();
                        if (searchResults.length > 0) {
                          const newIndex = selectedResultIndex > 0 ? selectedResultIndex - 1 : searchResults.length - 1;
                          setSelectedResultIndex(newIndex);
                        }
                        return;
                      }
                      
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (searchQuery.trim().length >= 2 && searchResults.length > 0) {
                          handleResultClick(searchResults[selectedResultIndex >= 0 ? selectedResultIndex : 0].path);
                        }
                      }
                    }}
                  />
                  
                  {/* Voice search button */}
                  {voiceSupported && (
                    <button
                      type="button"
                      className={cn(
                        "absolute right-14 p-1.5 rounded-full focus:outline-none transition-colors",
                        isListening ? "bg-primary text-primary-foreground animate-pulse" : "text-muted-foreground hover:text-foreground"
                      )}
                      onClick={toggleVoiceSearch}
                      aria-label={isListening ? "Stop voice search" : "Start voice search"}
                    >
                      {isListening ? (
                        <MicOff className="h-4 w-4" />
                      ) : (
                        <Mic className="h-4 w-4" />
                      )}
                    </button>
                  )}
                  
                  {searchQuery && (
                    <button
                      type="button"
                      className="absolute right-20 focus:outline-none"
                      onClick={() => handleSearchChange('')}
                    >
                      <X className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
                    </button>
                  )}
                  
                  <Button
                    size="icon"
                    variant="ghost"
                    type="button"
                    className="absolute right-4"
                    onClick={() => closeSearch()}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </form>
                
                {/* Enhanced filters button */}
                {(searchQuery.trim().length >= 2 && searchResults.length > 0) && (
                  <div className="flex items-center px-4 pb-3 pt-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className={cn(
                        "h-8 gap-1.5 px-2.5 text-xs",
                        showFilters && "bg-muted"
                      )}
                      onClick={() => setShowFilters(!showFilters)}
                    >
                      <Filter className="h-3.5 w-3.5" />
                      <span>Filters</span>
                      {activeFilters.length > 0 && (
                        <Badge className="ml-1 h-5 px-1">{activeFilters.length}</Badge>
                      )}
                    </Button>
                    
                    {/* Quick filter pills */}
                    {!showFilters && (
                      <div className="flex flex-wrap gap-2 ml-2">
                        {filterOptions.map(filter => (
                          <Badge
                            key={filter.id}
                            variant={activeFilters.includes(filter.id) ? "default" : "outline"}
                            className={cn(
                              "cursor-pointer flex items-center gap-1 px-2",
                              filter.count === 0 && "opacity-50"
                            )}
                            onClick={() => filter.count > 0 && toggleFilter(filter.id)}
                          >
                            {activeFilters.includes(filter.id) && (
                              <Check className="h-3 w-3" />
                            )}
                            {filter.label}
                            <span className="text-xs">{filter.count}</span>
                          </Badge>
                        ))}
                      </div>
                    )}
                    
                    {/* Advanced search options button */}
                    <div className="ml-auto">
                      <SearchOptions
                        relevanceThreshold={60}
                        setRelevanceThreshold={() => {}}
                        fuzzyMatching={true}
                        setFuzzyMatching={() => {}}
                        searchScope="all"
                        setSearchScope={() => {}}
                        searchTimeframe="anytime"
                        setSearchTimeframe={() => {}}
                      />
                    </div>
                  </div>
                )}
                
                {/* Search progress */}
                <SearchProgress
                  isSearching={isSearching}
                  progress={100}
                  searchStage="idle" 
                  totalResults={searchResults.length}
                  searchTime={0}
                />
              </div>
              
              {/* Expanded filters */}
              {showFilters && searchQuery.trim().length >= 2 && (
                <AnimatePresence>
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <SearchFilters 
                      activeFilters={activeFilters}
                      toggleFilter={toggleFilter}
                      clearFilters={clearFilters}
                      filterGroups={filterGroups}
                      totalResults={searchResults.length}
                    />
                  </motion.div>
                </AnimatePresence>
              )}
              
              {/* Search results area with tabs */}
              {searchQuery.trim().length >= 2 && showResults ? (
                <div className={cn("border-t", showFilters && "border-none")}>
                  <Tabs 
                    defaultValue="all" 
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="w-full"
                  >
                    <div className="px-2 pt-2">
                      <TabsList className="w-full bg-muted/50 p-0.5">
                        <TabsTrigger 
                          value="all" 
                          className="flex-1 text-xs py-1.5"
                        >
                          All Results ({searchResults.length})
                        </TabsTrigger>
                        {Object.keys(groupedResults).map(type => {
                          if (groupedResults[type].length === 0) return null;
                          return (
                            <TabsTrigger 
                              key={type} 
                              value={type}
                              className="flex-1 text-xs py-1.5"
                            >
                              {getTypeLabel(type)} ({groupedResults[type].length})
                            </TabsTrigger>
                          );
                        })}
                      </TabsList>
                    </div>

                    <TabsContent value="all" className="max-h-[60vh] overflow-y-auto mt-0" ref={searchResultsRef}>
                      {searchResults.length > 0 ? (
                        <VisualSearchResults
                          results={searchResults as any}
                          query={searchQuery}
                          selectedIndex={selectedResultIndex}
                          onResultClick={handleResultClick}
                          onResultHover={setSelectedResultIndex}
                        />
                      ) : (
                        <div className="p-8 text-center">
                          <div className="text-muted-foreground font-medium mb-4">
                            No results found for "{searchQuery}"
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => refreshSearchIndex()}
                          >
                            Refresh Search Index
                          </Button>
                        </div>
                      )}
                    </TabsContent>

                    {/* Individual tabs for each result type */}
                    {Object.keys(groupedResults).map(type => (
                      <TabsContent key={type} value={type} className="max-h-[60vh] overflow-y-auto mt-0">
                        <VisualSearchResults
                          results={groupedResults[type] as any}
                          query={searchQuery}
                          selectedIndex={selectedResultIndex}
                          onResultClick={handleResultClick}
                          onResultHover={setSelectedResultIndex}
                        />
                      </TabsContent>
                    ))}
                  </Tabs>
                </div>
              ) : (
                <SearchSuggestions
                  recentSearches={recentSearches}
                  trendingSearches={trendingSearches}
                  onSuggestionClick={handleSuggestionClick}
                  onClearRecent={clearRecentSearches}
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default EnhancedSearch; 