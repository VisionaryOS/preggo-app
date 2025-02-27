'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { cn, formatDate, searchContent, type SearchResult, type SearchResults } from '@/lib/utils';
import { useTheme } from 'next-themes';
import {
  Calendar,
  Baby,
  Heart,
  CheckSquare,
  ShoppingBag,
  BookOpen,
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
  BookOpen as BookOpenIcon,
  X
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

const resourcesMenu = [
  { 
    icon: BookOpen, 
    title: "Library",
    description: "Evidence-based articles and guides",
    href: "/resources/library"
  },
  { 
    icon: BookCopy, 
    title: "Pregnancy Book",
    description: "Comprehensive guide to your pregnancy journey",
    href: "/resources/chapters"
  },
  { 
    icon: MessageCircle, 
    title: "Community",
    description: "Connect with other expectant mothers",
    href: "/resources/community"
  },
  { 
    icon: HelpCircle, 
    title: "Ask an Expert",
    description: "Get answers from healthcare professionals",
    href: "/resources/expert-advice"
  },
  { 
    icon: Bookmark, 
    title: "Saved Content",
    description: "Quick access to your bookmarked resources",
    href: "/resources/saved"
  }
];

interface TopNavbarProps {
  currentWeek?: number;
}

export function TopNavbar({ currentWeek = 26 }: TopNavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResults>({ tools: [], lessons: [] });
  const { setTheme, theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  
  // Calculate days left
  const daysLeft = ((40 - currentWeek) * 7);
  
  // Handle mounting for client-side theme detection
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Command/Ctrl + K to focus search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      
      // Escape to clear search
      if (e.key === 'Escape') {
        setSearchQuery('');
        setShowResults(false);
        searchInputRef.current?.blur();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current && 
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search handler
  const handleSearch = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (searchQuery.trim().length < 2) {
      setSearchResults({ tools: [], lessons: [] });
      return;
    }
    
    setIsSearching(true);
    
    try {
      const results = await searchContent(searchQuery);
      setSearchResults(results);
      setShowResults(true);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  }, [searchQuery]);
  
  // Search on input change with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        handleSearch();
      }
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [searchQuery, handleSearch]);

  // Handle navigation to search result
  const handleResultClick = (path: string) => {
    router.push(path);
    setSearchQuery('');
    setShowResults(false);
  };
  
  // Clear search
  const clearSearch = () => {
    setSearchQuery('');
    setShowResults(false);
    searchInputRef.current?.focus();
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  // Get the next appointment
  const nextAppointment = upcomingAppointments.length > 0 ? upcomingAppointments[0] : null;
  
  // Count unread notifications
  const unreadCount = notifications.filter(n => !n.read).length;

  // Total results count
  const totalResults = searchResults.tools.length + searchResults.lessons.length;

  return (
    <header className="sticky top-0 z-40 border-b bg-background">
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
          <div ref={searchContainerRef} className="w-full max-w-3xl mx-auto relative">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  {isSearching ? (
                    <Loader2 className="h-5 w-5 text-muted-foreground/70 animate-spin" />
                  ) : (
                    <Search className="h-5 w-5 text-muted-foreground/70 group-hover:text-primary transition-colors duration-200" />
                  )}
                </div>
                <Input
                  type="search"
                  placeholder="Search tools and online course lessons..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchQuery.trim().length >= 2 && setShowResults(true)}
                  className="block w-full h-12 pl-12 pr-20 rounded-xl text-base focus-visible:ring-primary dark:shadow-soft border-input/50 transition-all duration-300"
                  ref={searchInputRef}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  {searchQuery.length > 0 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={clearSearch}
                      className="h-8 w-8 mr-1 hover:bg-accent"
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Clear search</span>
                    </Button>
                  )}
                  <kbd className="hidden sm:inline-flex h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs font-medium text-muted-foreground opacity-100">
                    <span className="text-xs">⌘</span>K
                  </kbd>
                </div>
              </div>
            </form>
            
            {/* Search Results Dropdown */}
            <AnimatePresence>
              {showResults && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.15 }}
                  className="absolute w-full mt-2 rounded-lg border bg-card shadow-lg dark:shadow-soft overflow-hidden z-50"
                >
                  <div className="p-4">
                    {isSearching ? (
                      <div className="flex justify-center items-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-primary/70" />
                      </div>
                    ) : totalResults > 0 ? (
                      <div className="divide-y">
                        {/* Tools section */}
                        {searchResults.tools.length > 0 && (
                          <div className="pb-3">
                            <div className="flex items-center mb-2">
                              <LayoutGrid className="h-4 w-4 mr-2 text-primary" />
                              <h3 className="text-sm font-medium">Tools</h3>
                            </div>
                            <ul className="space-y-1">
                              {searchResults.tools.map((result) => (
                                <li key={result.id}>
                                  <button
                                    onClick={() => handleResultClick(result.path)}
                                    className="w-full text-left px-3 py-2 rounded-md hover:bg-accent flex items-center"
                                  >
                                    <span className="text-sm">{result.title}</span>
                                  </button>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {/* Lessons section */}
                        {searchResults.lessons.length > 0 && (
                          <div className={searchResults.tools.length > 0 ? "pt-3" : ""}>
                            <div className="flex items-center mb-2">
                              <BookOpenIcon className="h-4 w-4 mr-2 text-primary" />
                              <h3 className="text-sm font-medium">Lessons</h3>
                            </div>
                            <ul className="space-y-1">
                              {searchResults.lessons.map((result) => (
                                <li key={result.id}>
                                  <button
                                    onClick={() => handleResultClick(result.path)}
                                    className="w-full text-left px-3 py-2 rounded-md hover:bg-accent flex items-center"
                                  >
                                    <span className="text-sm">{result.title}</span>
                                  </button>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ) : searchQuery.trim().length >= 2 ? (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">No results found for "{searchQuery}"</p>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">Enter at least 2 characters to search</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right section: Next appointment, notifications, dark mode toggle, and profile */}
        <div className="flex items-center gap-3 pr-0">
          {/* Next Appointment */}
          {nextAppointment && (
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-md bg-accent/50">
              <Calendar className="h-4 w-4 text-primary" />
              <div className="flex flex-col">
                <p className="text-xs font-medium">{nextAppointment.title}</p>
                <p className="text-xs text-muted-foreground">{formatDate(nextAppointment.date.toString())}</p>
              </div>
            </div>
          )}

          {/* Notifications Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative size-9 rounded-full">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
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

          {/* Dark Mode Toggle */}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleDarkMode} 
            className="size-9 rounded-full"
            aria-label="Toggle dark mode"
          >
            {mounted && resolvedTheme === 'dark' ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-sun"
              >
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2" />
                <path d="M12 20v2" />
                <path d="m4.93 4.93 1.41 1.41" />
                <path d="m17.66 17.66 1.41 1.41" />
                <path d="M2 12h2" />
                <path d="M20 12h2" />
                <path d="m6.34 17.66-1.41 1.41" />
                <path d="m19.07 4.93-1.41 1.41" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-moon"
              >
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
              </svg>
            )}
          </Button>

          {/* User Profile Menu */}
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
      
      {/* Mobile Search */}
      <div className="md:hidden px-2 pb-2">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            {isSearching ? (
              <Loader2 className="h-4 w-4 text-muted-foreground animate-spin" />
            ) : (
              <Search className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
          <Input
            type="search"
            placeholder="Search tools and lessons..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full h-10 pl-10 pr-10 rounded-lg text-sm dark:shadow-soft border-input/50"
          />
          {searchQuery.length > 0 && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={clearSearch}
              className="absolute inset-y-0 right-0 flex items-center justify-center h-10 w-10"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Clear search</span>
            </Button>
          )}
        </div>
        
        {/* Mobile Search Results */}
        <AnimatePresence>
          {showResults && searchQuery.trim().length >= 2 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-1 p-2 rounded-lg border bg-card shadow-md max-h-[60vh] overflow-auto"
            >
              {isSearching ? (
                <div className="flex justify-center items-center py-6">
                  <Loader2 className="h-6 w-6 animate-spin text-primary/70" />
                </div>
              ) : totalResults > 0 ? (
                <div className="divide-y">
                  {/* Tools section */}
                  {searchResults.tools.length > 0 && (
                    <div className="pb-2">
                      <div className="flex items-center mb-1">
                        <LayoutGrid className="h-3 w-3 mr-1 text-primary" />
                        <h3 className="text-xs font-medium">Tools</h3>
                      </div>
                      <ul className="space-y-1">
                        {searchResults.tools.map((result) => (
                          <li key={result.id}>
                            <button
                              onClick={() => handleResultClick(result.path)}
                              className="w-full text-left px-2 py-1.5 rounded-md hover:bg-accent flex items-center"
                            >
                              <span className="text-xs">{result.title}</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {/* Lessons section */}
                  {searchResults.lessons.length > 0 && (
                    <div className={searchResults.tools.length > 0 ? "pt-2" : ""}>
                      <div className="flex items-center mb-1">
                        <BookOpenIcon className="h-3 w-3 mr-1 text-primary" />
                        <h3 className="text-xs font-medium">Lessons</h3>
                      </div>
                      <ul className="space-y-1">
                        {searchResults.lessons.map((result) => (
                          <li key={result.id}>
                            <button
                              onClick={() => handleResultClick(result.path)}
                              className="w-full text-left px-2 py-1.5 rounded-md hover:bg-accent flex items-center"
                            >
                              <span className="text-xs">{result.title}</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-xs text-muted-foreground">No results found</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
} 