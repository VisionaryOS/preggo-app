'use client';

import { useState, useEffect, useRef, useCallback, useMemo, memo } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { cn, formatDate } from '@/lib/utils';
import { useTheme } from 'next-themes';
import {
  Calendar,
  Baby,
  Heart,
  CheckSquare,
  ShoppingBag,
  BookOpen as BookOpenIcon,
  Clock,
  UserCircle,
  LayoutDashboard,
  Settings,
  Menu,
  BookCopy,
  Sparkles,
  Zap,
  Brain,
  Scale,
  PenTool,
  UserPlus,
  MessageCircle,
  Users,
  LogOut,
  ChevronRight,
  Info,
  Bookmark,
  Award,
  Medal,
  HelpCircle,
  AlertCircle,
  Bell,
  Search,
  Loader2,
  LayoutGrid,
  X,
  Apple,
  Sun,
  Moon
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SideNav } from '@/components/dashboard/SideNav';
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { performCombinedSearch, addItemsToIndex } from '@/lib/search';
import { useSearchStore, SearchItem } from '@/store/search-store';

// Baby size by week (sample data)
const babySizeEmojis: Record<number, string> = {
  1: '🫐', 2: '🫐', 3: '🫐', 4: '🌱', 5: '🌱', 6: '🌱', 7: '🫑', 8: '🫑', 9: '🫑',
  10: '🍓', 11: '🍓', 12: '🍋', 13: '🍋', 14: '🍊', 15: '🍊', 16: '🥑', 17: '🥑',
  18: '🥒', 19: '🥒', 20: '🍌', 21: '🍌', 22: '🥕', 23: '🥕', 24: '🌽', 25: '🌽',
  26: '🥬', 27: '🥬', 28: '🥦', 29: '🥦', 30: '🍍', 31: '🍍', 32: '🍉', 33: '🍉',
  34: '🎃', 35: '🎃', 36: '🎃', 37: '👶', 38: '👶', 39: '👶', 40: '👶'
};

// Sample upcoming appointments data - displaying in top navbar
const upcomingAppointments = [
  { id: 1, title: 'OB-GYN Check-up', date: new Date(2023, 6, 15, 10, 30), location: 'Dr. Smith Clinic' },
  { id: 2, title: 'Ultrasound', date: new Date(2023, 6, 22, 14, 0), location: 'City Hospital' },
];

// Sample notifications data
const notifications = [
  { id: 1, title: 'New appointment scheduled', message: 'Your OB-GYN check-up is confirmed for July 15th', read: false, time: '2 hours ago' },
  { id: 2, title: 'Reminder: Take vitamins', message: 'Don\'t forget your daily prenatal vitamins', read: true, time: '1 day ago' },
  { id: 3, title: 'New article available', message: 'Check out our latest article on nutrition during pregnancy', read: true, time: '3 days ago' },
];

// Optimized navigation structures
const dashboardMenu = {
  title: "Dashboard",
  description: "Navigate your personalized pregnancy journey",
  featured: [
    { name: "Weekly Overview", href: "/dashboard", icon: LayoutDashboard, description: "View your pregnancy progress" },
    { name: "Health Tracking", href: "/dashboard/health", icon: Heart, description: "Record symptoms and vitals" }
  ],
  sections: [
    {
      items: [
        { name: "My Profile", href: "/profile", icon: UserCircle },
        { name: "Settings", href: "/dashboard/settings", icon: Settings },
      ]
    }
  ]
};

const pregnancyJourneyMenu = {
  title: "Pregnancy",
  items: [
    { 
      heading: "Weekly Insights", 
      links: [
        { name: "Baby Development", href: "/dashboard/baby", icon: Baby },
        { name: "Mom's Body Changes", href: "/dashboard/mom-changes", icon: Heart },
        { name: "Nutrition by Trimester", href: "/dashboard/nutrition", icon: Scale }
      ]
    },
    { 
      heading: "Planning", 
      links: [
        { name: "Appointments", href: "/dashboard/appointments", icon: Calendar },
        { name: "To-Do List", href: "/dashboard/todo", icon: CheckSquare },
        { name: "Birth Plan", href: "/dashboard/birth-plan", icon: PenTool }
      ]
    }
  ]
};

const wikiMenu = [
  { 
    icon: BookOpenIcon, 
    title: "Library",
    description: "Evidence-based articles and guides",
    href: "/dashboard/wiki/library"
  },
  { 
    icon: BookCopy, 
    title: "Pregnancy Book",
    description: "Comprehensive guide to your pregnancy journey",
    href: "/dashboard/wiki/chapters"
  },
  { 
    icon: MessageCircle, 
    title: "Community",
    description: "Connect with other expectant mothers",
    href: "/dashboard/wiki/community"
  },
  { 
    icon: HelpCircle, 
    title: "Ask an Expert",
    description: "Get answers from healthcare professionals",
    href: "/dashboard/wiki/expert-advice"
  },
  { 
    icon: Bookmark, 
    title: "Saved Content",
    description: "Quick access to your bookmarked resources",
    href: "/dashboard/wiki/saved"
  }
];

// Define the type for searchable items
interface NavItem {
  id: string;
  title: string;
  type: 'tool' | 'lesson' | 'page' | 'wiki';
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
}

interface TopNavbarProps {
  currentWeek?: number;
}

// Memoize the CommandKSearchOverlay component to prevent unnecessary re-renders
const MemoizedSearchOverlay = memo(({ 
  isOpen, 
  onClose,
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
  closeSearchWithoutReset,
  filterOptions,
  handleResultClick,
  searchInputRef,
  searchContainerRef,
  searchResultsRef,
  quickActions
}: {
  isOpen: boolean;
  onClose: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  showResults: boolean;
  setShowResults: (show: boolean) => void;
  searchResults: SearchItem[];
  setSearchResults: (results: SearchItem[]) => void;
  selectedResultIndex: number;
  setSelectedResultIndex: (index: number) => void;
  activeFilters: string[];
  toggleFilter: (filter: string) => void;
  closeSearchWithoutReset: () => void;
  filterOptions: any[];
  handleResultClick: (path: string) => void;
  searchInputRef: React.RefObject<HTMLInputElement>;
  searchContainerRef: React.RefObject<HTMLDivElement>;
  searchResultsRef: React.RefObject<HTMLDivElement>;
  quickActions: NavItem[];
}) => {
  // Focus management effect
  useEffect(() => {
    // Focus the input when the overlay is shown
    const focusTimer = setTimeout(() => {
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }, 50);
    
    // Prevent the page from scrolling when the overlay is open
    document.body.style.overflow = 'hidden';
    
    // Re-enable scrolling when the overlay is closed and clear timer
    return () => {
      document.body.style.overflow = '';
      clearTimeout(focusTimer);
    };
  }, []);
  
  return (
    <div 
      className="fixed inset-0 z-[100] bg-black/30 backdrop-blur-sm flex items-start justify-center pt-16 sm:pt-24"
      onClick={(e) => {
        // Close the search only if clicking directly on the backdrop
        if (e.target === e.currentTarget) {
          e.preventDefault();
          e.stopPropagation();
          onClose();
        }
      }}
    >
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.15 }}
        className="w-full max-w-2xl mx-auto p-3"
        onClick={(e) => {
          // Prevent any clicks within the container from bubbling up
          e.stopPropagation();
        }}
        ref={searchContainerRef}
      >
        <div className="bg-background rounded-xl shadow-2xl border overflow-hidden">
          {/* Search Input */}
          <div className="p-4 border-b relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (searchQuery.trim().length >= 1 && searchResults.length > 0) {
                  if (selectedResultIndex >= 0) {
                    handleResultClick(searchResults[selectedResultIndex].path);
                  } else {
                    handleResultClick(searchResults[0].path);
                  }
                }
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <Input
                ref={searchInputRef}
                value={searchQuery}
                onChange={(e) => {
                  e.stopPropagation();
                  
                  const value = e.target.value;
                  setSearchQuery(value);
                  
                  // Always show results when typing valid queries
                  // Reduced to 1 character for predictive search
                  if (value.trim().length >= 1) {
                    setShowResults(true);
                  } else {
                    setShowResults(false);
                  }
                }}
                placeholder="Type to search... (press Enter to select)"
                className="pl-10 py-6 text-lg bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                autoComplete="off"
                autoCorrect="off"
                spellCheck="false"
                autoFocus
                onClick={(e) => {
                  e.stopPropagation();
                  e.currentTarget.focus();
                }}
                onBlur={(e) => {
                  // Only prevent refocusing if clicking on a search result
                  const relatedTarget = e.relatedTarget as HTMLElement;
                  if (!relatedTarget?.closest('[data-search-result]')) {
                    // The focus interval will handle refocusing if needed
                  }
                }}
                onKeyDown={(e) => {
                  e.stopPropagation();
                  
                  switch (e.key) {
                    case 'Escape':
                      e.preventDefault();
                      onClose();
                      break;
                      
                    case 'ArrowDown':
                      e.preventDefault();
                      if (searchResults.length > 0) {
                        const newIndex = selectedResultIndex < searchResults.length - 1 ? selectedResultIndex + 1 : 0;
                        setSelectedResultIndex(newIndex);
                        setShowResults(true);
                      }
                      break;
                      
                    case 'ArrowUp':
                      e.preventDefault();
                      if (searchResults.length > 0) {
                        const newIndex = selectedResultIndex > 0 ? selectedResultIndex - 1 : searchResults.length - 1;
                        setSelectedResultIndex(newIndex);
                        setShowResults(true);
                      }
                      break;
                      
                    case 'Enter':
                      e.preventDefault();
                      if (searchQuery.trim().length >= 1 && searchResults.length > 0) {
                        if (selectedResultIndex >= 0) {
                          handleResultClick(searchResults[selectedResultIndex].path);
                        } else {
                          handleResultClick(searchResults[0].path);
                        }
                      }
                      break;
                      
                    default:
                      // Allow other keys for typing
                      break;
                  }
                }}
              />
            </form>
            {searchQuery && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="absolute right-1 top-2" 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSearchQuery('');
                }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Clear</span>
              </Button>
            )}
          </div>
          
          {/* Filter Chips */}
          {activeFilters.length > 0 || searchQuery.trim().length >= 1 ? (
            <div className="px-4 py-2 border-b flex flex-wrap gap-1.5">
              {filterOptions.map(filter => (
                <button
                  key={filter.id}
                  onClick={() => toggleFilter(filter.id)}
                  className={cn(
                    "text-xs px-2 py-1 rounded-md transition-colors",
                    activeFilters.includes(filter.id)
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  )}
                >
                  {filter.label} ({filter.count})
                </button>
              ))}
            </div>
          ) : null}
          
          {/* Search Results */}
          {searchQuery.trim().length >= 1 && showResults ? (
            <div className="max-h-[60vh] overflow-y-auto" ref={searchResultsRef}>
              {searchResults.length > 0 ? (
                <div className="p-2">
                  {searchResults.map((result, index) => (
                    <div
                      key={result.id}
                      className={cn(
                        "flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors",
                        selectedResultIndex === index 
                          ? "bg-primary text-primary-foreground" 
                          : "hover:bg-muted"
                      )}
                      onClick={() => handleResultClick(result.path)}
                      onMouseEnter={() => setSelectedResultIndex(index)}
                      data-search-result="true"
                    >
                      <div className={cn(
                        "p-2 rounded-md",
                        selectedResultIndex === index 
                          ? "bg-primary-foreground/20" 
                          : "bg-muted/50"
                      )}>
                        {result.icon && <result.icon className="h-5 w-5" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium">{result.title}</div>
                        {result.description && (
                          <div className={cn(
                            "text-sm truncate mt-0.5", 
                            selectedResultIndex === index
                              ? "text-primary-foreground/70"
                              : "text-muted-foreground"
                          )}>
                            {result.description}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
                    <Search className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-1">No results found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search or filters
                  </p>
                </div>
              )}
            </div>
          ) : searchQuery.trim().length >= 1 && !showResults ? (
            <div className="p-12 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
                <Search className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-1">Press Enter to search</h3>
              <p className="text-muted-foreground">
                Or use arrow keys to navigate results
              </p>
            </div>
          ) : (
            <div className="p-4">
              <div className="text-sm font-medium text-muted-foreground mb-2">Quick Actions</div>
              <div className="grid grid-cols-2 gap-2">
                {quickActions.map((item) => (
                  <Button
                    key={item.id}
                    variant="ghost"
                    className="justify-start h-auto py-3"
                    onClick={() => handleResultClick(item.path)}
                  >
                    <item.icon className="mr-2 h-5 w-5 text-muted-foreground" />
                    <span>{item.title}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}
          
          {/* Keyboard shortcuts hint */}
          <div className="p-3 flex flex-wrap justify-center text-xs text-muted-foreground border-t">
            <span className="inline-flex items-center mx-2">
              <kbd className="px-1.5 py-0.5 rounded border bg-muted font-mono text-xs">↑</kbd>
              <kbd className="ml-1 px-1.5 py-0.5 rounded border bg-muted font-mono text-xs">↓</kbd>
              <span className="ml-2">to navigate</span>
            </span>
            <span className="inline-flex items-center mx-2">
              <kbd className="px-1.5 py-0.5 rounded border bg-muted font-mono text-xs">Enter</kbd>
              <span className="ml-2">to select</span>
            </span>
            <span className="inline-flex items-center mx-2">
              <kbd className="px-1.5 py-0.5 rounded border bg-muted font-mono text-xs">Esc</kbd>
              <span className="ml-2">to close</span>
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
});

// Prevent unnecessary re-renders
MemoizedSearchOverlay.displayName = 'MemoizedSearchOverlay';

export default function TopNavbar({ currentWeek = 26 }: TopNavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  
  // Get search state from global store
  const { 
    searchQuery, 
    setSearchQuery,
    isSearching,
    setIsSearching,
    showResults,
    setShowResults,
    searchResults,
    setSearchResults,
    selectedResultIndex,
    setSelectedResultIndex,
    activeFilters,
    toggleFilter,
    resetSearch,
    clearSearchResults,
    closeSearchWithoutReset,
    searchMode,
    addRecentSearch,
    setSearchStage,
    setSearchTime,
    searchStage,
    searchTime
  } = useSearchStore();
  
  const { setTheme, theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchResultsRef = useRef<HTMLDivElement>(null);
  
  // Custom hook to maintain focus on search input
  useEffect(() => {
    if (isSearching && searchInputRef.current) {
      // Focus the search input when the search modal opens
      searchInputRef.current.focus();
      
      // Create an interval to check if focus is lost and refocus if needed
      // This is needed because sometimes focus can be lost when search results appear
      const focusInterval = setInterval(() => {
        if (isSearching && 
            document.activeElement !== searchInputRef.current &&
            document.activeElement?.tagName !== 'BUTTON') { // Don't steal focus from buttons
          searchInputRef.current?.focus();
        }
      }, 100);
      
      return () => clearInterval(focusInterval);
    }
  }, [isSearching]);
  
  // Calculate days left
  const daysLeft = ((40 - currentWeek) * 7);
  
  // Initialize search items for the application
  const searchableItems = useMemo<NavItem[]>(() => [
    // Dashboard section
    { id: 'dashboard', title: 'Dashboard', type: 'tool', path: '/dashboard', icon: LayoutDashboard, description: 'Your pregnancy dashboard and overview' },
    { id: 'journey', title: 'Weekly Journey', type: 'tool', path: '/dashboard/journey', icon: Baby, description: 'Week-by-week pregnancy journey' },
    { id: 'health', title: 'Health Tracker', type: 'tool', path: '/dashboard/health', icon: Heart, description: 'Track weight, symptoms and health data' },
    { id: 'todo', title: 'Todo List', type: 'tool', path: '/dashboard/todo', icon: CheckSquare, description: 'Manage your pregnancy tasks and to-dos' },
    { id: 'shopping', title: 'Shopping', type: 'tool', path: '/dashboard/shopping', icon: ShoppingBag, description: 'Baby shopping lists and recommendations' },
    { id: 'wiki', title: 'Wiki', type: 'wiki', path: '/dashboard/wiki', icon: BookCopy, description: 'Pregnancy and baby care knowledge base' },
    { id: 'calendar', title: 'Calendar', type: 'tool', path: '/dashboard/calendar', icon: Calendar, description: 'Appointments and important dates' },
    
    // Tools section
    { id: 'contraction-timer', title: 'Contraction Timer', type: 'tool', path: '/tools/contraction-timer', icon: Clock, description: 'Track contractions during labor' },
    { id: 'due-date', title: 'Due Date Calculator', type: 'tool', path: '/dashboard/due-date', icon: Calendar, description: 'Calculate your expected due date' },
    { id: 'name-finder', title: 'Baby Name Explorer', type: 'tool', path: '/tools/name-finder', icon: Sparkles, description: 'Find the perfect name for your baby' },
    { id: 'kick-counter', title: 'Kick Counter', type: 'tool', path: '/tools/kick-counter', icon: Zap, description: 'Track your baby\'s movements' },
    
    // Resources section
    { id: 'nutrition', title: 'Nutrition Guide', type: 'lesson', path: '/resources/nutrition', icon: Apple, description: 'Healthy eating during pregnancy' },
    { id: 'exercise', title: 'Safe Exercises', type: 'lesson', path: '/resources/exercise', icon: Heart, description: 'Safe workouts for each trimester' },
    { id: 'mental-health', title: 'Mental Wellbeing', type: 'lesson', path: '/resources/mental-health', icon: Brain, description: 'Managing stress and emotions' },
    { id: 'weight-gain', title: 'Weight Gain Guidance', type: 'lesson', path: '/resources/weight-gain', icon: Scale, description: 'Healthy pregnancy weight guidelines' },
    
    // Community section
    { id: 'journal', title: 'Pregnancy Journal', type: 'tool', path: '/community/journal', icon: PenTool, description: 'Document your pregnancy journey' },
    { id: 'community', title: 'Community Forums', type: 'tool', path: '/community/forums', icon: Users, description: 'Connect with other expectant parents' },
    { id: 'expert-chat', title: 'Ask an Expert', type: 'tool', path: '/community/expert-chat', icon: MessageCircle, description: 'Chat with healthcare professionals' },
    
    // Profile section
    { id: 'profile', title: 'My Profile', type: 'tool', path: '/profile', icon: UserCircle, description: 'View and edit your profile' },
    { id: 'settings', title: 'Settings', type: 'tool', path: '/settings', icon: Settings, description: 'App preferences and notifications' }
  ], []);
  
  // Add search items to the FlexSearch index on component mount
  useEffect(() => {
    // Add searchable items to the FlexSearch index
    addItemsToIndex(searchableItems);
  }, [searchableItems]);

  // Enhanced filter options with wiki content and page content
  const filterOptions = useMemo(() => [
    { id: 'tool', label: 'Tools', count: searchableItems.filter(item => item.type === 'tool').length },
    { id: 'lesson', label: 'Lessons', count: searchableItems.filter(item => item.type === 'lesson').length },
    { id: 'wiki', label: 'Wiki', count: searchableItems.filter(item => item.type === 'wiki').length || 5 },
    { id: 'page', label: 'Page Content', count: 15 }
  ], [searchableItems]);
  
  // Handle mounting for client-side theme detection
  useEffect(() => {
    setMounted(true);
  }, []);

  // Dynamic page content search - this performs both global and page-specific search
  useEffect(() => {
    const performSearch = async () => {
      if (searchQuery.trim() === '') {
        setSearchResults([]);
        setShowResults(false);
        return;
      }

      // We DO NOT set isSearching to true or false here!
      // This is a critical fix to prevent the modal from closing when typing

      // Enhanced search logic using FlexSearch
      try {
        // Start search timing
        const startTime = performance.now();
        setSearchStage('searching');
        
        // Perform combined search with FlexSearch
        // Only requires 1 character for predictive search
        const results = performCombinedSearch(searchQuery, activeFilters, pathname);
        
        // Calculate search time
        const endTime = performance.now();
        setSearchTime(endTime - startTime);
        
        console.log(`Search for "${searchQuery}" found ${results.length} results in ${endTime - startTime}ms`);
        
        setSearchResults(results);
        setSearchStage('complete');
        
        // Reset selected index when results change
        setSelectedResultIndex(results.length > 0 ? 0 : -1);
        
        // Always show results when we have valid input
        // Only requires 1 character for predictive search
        if (searchQuery.trim().length >= 1) {
          setShowResults(true);
        }
        
        // Add to recent searches when query is substantial
        if (searchQuery.trim().length >= 2) {
          addRecentSearch(searchQuery);
        }
      } catch (error) {
        console.error('Search error:', error);
        setSearchStage('idle');
      }
    };

    // Debounce the search to avoid too many requests
    const timer = setTimeout(() => {
      performSearch();
    }, 150); // Reduced debounce time for more responsive search (was 200ms)

    return () => clearTimeout(timer);
  }, [searchQuery, activeFilters, pathname, setSearchResults, setSelectedResultIndex, setShowResults, addRecentSearch, setSearchStage, setSearchTime]);
  
  // Handle navigation to search result
  const handleResultClick = useCallback((path: string) => {
    router.push(path);
    closeSearchWithoutReset(); // Changed from resetSearch to just close the modal
  }, [router, closeSearchWithoutReset]);

  // Handle search form submission
  const handleSearch = useCallback((e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (searchQuery.trim().length >= 1 && searchResults.length > 0) {
      // Only select a result when the user explicitly submits the search
      if (selectedResultIndex >= 0 && selectedResultIndex < searchResults.length) {
        // Use the currently selected result if one is selected
        handleResultClick(searchResults[selectedResultIndex].path);
      } else {
        // Otherwise use the first result
        handleResultClick(searchResults[0].path);
      }
    }
  }, [searchQuery, searchResults, selectedResultIndex, handleResultClick]);
  
  // Clear search
  const clearSearch = useCallback(() => {
    resetSearch();
    searchInputRef.current?.focus();
  }, [resetSearch]);
  
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
        setIsSearching(true);
        // Clear any previous search results when opening via keyboard shortcut
        clearSearchResults();
        // Add a small delay to ensure the DOM is updated before focusing
        setTimeout(() => {
          searchInputRef.current?.focus();
        }, 100);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [setIsSearching, isSearching, clearSearchResults]);
  
  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Only close if clicking outside and the search is open
      if (
        isSearching && 
        searchContainerRef.current && 
        !searchContainerRef.current.contains(event.target as Node) &&
        // Make sure we're not clicking on elements that trigger search
        !(event.target as HTMLElement).closest('[data-search-trigger]')
      ) {
        closeSearchWithoutReset(); // Changed from resetSearch to not reset everything
      }
    };
    
    // Use mousedown instead of click for better handling
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSearching, closeSearchWithoutReset]);

  // Scroll selected item into view
  useEffect(() => {
    if (selectedResultIndex >= 0 && searchResultsRef.current) {
      const selectedElement = searchResultsRef.current.children[0]?.children[selectedResultIndex] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedResultIndex]);
  
  // Toggle dark mode
  const toggleDarkMode = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  // Get the next appointment
  const nextAppointment = upcomingAppointments.length > 0 ? upcomingAppointments[0] : null;
  
  // Count unread notifications
  const unreadCount = notifications.filter(n => !n.read).length;

  // Total results count
  const totalResults = searchResults.length;

  // Handle focusing search input when mounting
  useEffect(() => {
    if (mounted && searchInputRef.current) {
      const handleFocusSearchInput = () => {
        setIsSearching(true);
        searchInputRef.current?.focus();
      };

      // Add event listeners to keyboard shortcut elements
      const keyboardShortcutElement = document.querySelector('.keyboard-shortcut');
      if (keyboardShortcutElement) {
        keyboardShortcutElement.addEventListener('click', handleFocusSearchInput);
      }

      return () => {
        if (keyboardShortcutElement) {
          keyboardShortcutElement.removeEventListener('click', handleFocusSearchInput);
        }
      };
    }
  }, [mounted, setIsSearching]);

  // Add this code to prepare quick actions
  const quickActions = useMemo(() => {
    const actionTitles = ['Dashboard', 'Weekly Journey', 'Todo List', 'Wiki', 'Shopping'];
    return searchableItems.filter(item => actionTitles.includes(item.title));
  }, [searchableItems]);

  // Return the component with the overlay
  return (
    <>
      {/* Command+K Search Overlay */}
      <AnimatePresence mode="wait" initial={false}>
        {isSearching && (
          <MemoizedSearchOverlay
            key="search-overlay"
            isOpen={isSearching}
            onClose={closeSearchWithoutReset}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            showResults={showResults}
            setShowResults={setShowResults}
            searchResults={searchResults}
            setSearchResults={setSearchResults}
            selectedResultIndex={selectedResultIndex}
            setSelectedResultIndex={setSelectedResultIndex}
            activeFilters={activeFilters}
            toggleFilter={toggleFilter}
            closeSearchWithoutReset={closeSearchWithoutReset}
            filterOptions={filterOptions}
            handleResultClick={handleResultClick}
            searchInputRef={searchInputRef as React.RefObject<HTMLInputElement>}
            searchContainerRef={searchContainerRef as React.RefObject<HTMLDivElement>}
            searchResultsRef={searchResultsRef as React.RefObject<HTMLDivElement>}
            quickActions={quickActions}
          />
        )}
      </AnimatePresence>
      
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur-sm">
        <div className="flex h-16 items-center justify-between px-2 md:px-4">
          {/* Left section: Mobile menu button and Logo - closer to edge */}
          <div className="flex items-center gap-2">
            {/* Mobile menu button */}
            <div className="lg:hidden">
              <Sheet open={isMobileNavOpen} onOpenChange={setIsMobileNavOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="mr-1">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0">
                  <SideNav isMobile currentWeek={currentWeek} onNavigate={() => setIsMobileNavOpen(false)} />
                </SheetContent>
              </Sheet>
            </div>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <span className="font-bold text-xl text-primary">NuMama</span>
              <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">- in {daysLeft} days</span>
            </Link>
          </div>

          {/* Center section: Search Bar */}
          <div className="flex-1 mx-4 hidden md:block">
            <div className="w-full max-w-xl mx-auto relative">
              <Button
                variant="outline"
                className="w-full justify-between text-muted-foreground"
                onClick={() => setIsSearching(true)}
                data-search-trigger="true"
              >
                <div className="flex items-center">
                  <Search className="mr-2 h-4 w-4" />
                  <span>Search...</span>
                </div>
                <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                  <span className="text-xs">⌘</span>K
                </kbd>
              </Button>
            </div>
          </div>

          {/* Right section: Actions and user dropdown */}
          <div className="flex items-center gap-1">
            {/* Theme toggle - desktop only */}
            <div className="hidden md:block">
              <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
                {resolvedTheme === 'dark' ? (
                  <Sun className="h-[1.2rem] w-[1.2rem]" />
                ) : (
                  <Moon className="h-[1.2rem] w-[1.2rem]" />
                )}
                <span className="sr-only">Toggle theme</span>
              </Button>
            </div>

            {/* Notification Bell */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary" />
                  )}
                  <span className="sr-only">Notifications</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[380px]">
                <DropdownMenuLabel className="flex items-center justify-between">
                  <span>Notifications</span>
                  <Button variant="ghost" size="sm" className="h-auto px-2 py-1 text-xs">
                    Mark all as read
                  </Button>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    No notifications
                  </div>
                ) : (
                  <div className="max-h-[300px] overflow-auto">
                    {notifications.map((notification) => (
                      <DropdownMenuItem key={notification.id} className="flex flex-col items-start p-3 focus:bg-accent">
                        <div className="flex w-full items-start justify-between gap-2">
                          <div className="flex-1 space-y-1">
                            <p className="text-sm font-medium leading-none">{notification.title}</p>
                            <p className="text-xs text-muted-foreground">{notification.message}</p>
                          </div>
                          {!notification.read && (
                            <div className="h-2 w-2 rounded-full bg-primary"></div>
                          )}
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">{notification.time}</p>
                      </DropdownMenuItem>
                    ))}
                  </div>
                )}
                <DropdownMenuSeparator />
                <Button variant="ghost" size="sm" className="w-full justify-center text-xs" asChild>
                  <Link href="/notifications">View all notifications</Link>
                </Button>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative size-9 rounded-full mr-0">
                  <Avatar className="size-9">
                    <AvatarFallback>SJ</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">Sarah Johnson</p>
                    <p className="text-xs text-muted-foreground">sarah.j@example.com</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <UserCircle className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      
      {/* Mobile Search - Now using the shared components */}
      <div className="md:hidden px-2 pb-2">
        <Button
          variant="outline"
          className="w-full justify-between text-muted-foreground"
          onClick={() => setIsSearching(true)}
          data-search-trigger="true"
        >
          <div className="flex items-center">
            <Search className="mr-2 h-4 w-4" />
            <span>Search...</span>
          </div>
          <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>
      </div>
    </>
  );
} 