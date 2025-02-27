'use client';

import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Fuse from 'fuse.js';
import { 
  LayoutDashboard, 
  Calendar, 
  UserCircle,
  ChevronLeft, 
  LogOut,
  Baby,
  BookOpen,
  Heart,
  CheckSquare,
  ShoppingBag,
  Clock,
  ChevronDown,
  ChevronUp,
  BarChart3,
  CalendarCheck,
  Smile,
  BookOpenCheck,
  Apple,
  UtensilsCrossed,
  Moon,
  Dumbbell,
  Pill,
  Bell,
  Users,
  LineChart,
  Settings,
  Home,
  FileText,
  X,
  AlertCircle,
  BarChart
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Badge } from '@/components/ui/badge';

// Quick Access Items - most frequently used
const quickAccessItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard }
];

// Navigation groups and items - simplified labels
const navGroups = [
  {
    id: 'journey',
    label: 'Journey',
    items: [
      { name: 'Roadmap', href: '/dashboard/weekly', icon: Calendar },
      { name: 'Due Date', href: '/dashboard/due-date', icon: CalendarCheck },
      { name: 'Baby Planner', href: '/dashboard/baby', icon: Baby },
      { name: 'Wiki', href: '/dashboard/wiki', icon: BookOpen }
    ]
  },
  {
    id: 'tasks',
    label: 'Tasks',
    items: [
      { name: 'Todo', href: '/dashboard/todo', icon: CheckSquare },
      { name: 'Appointments', href: '/dashboard/appointments', icon: Clock },
      { name: 'Shopping', href: '/dashboard/shopping', icon: ShoppingBag }
    ]
  },
  {
    id: 'tracker',
    label: 'Tracker',
    items: [
      { name: 'Nutrition', href: '/dashboard/tracker/nutrition', icon: Apple },
      { name: 'Diet', href: '/dashboard/tracker/diet', icon: UtensilsCrossed },
      { name: 'Sleep', href: '/dashboard/tracker/sleep', icon: Moon },
      { name: 'Reading', href: '/dashboard/tracker/reading', icon: BookOpenCheck },
      { name: 'Exercises', href: '/dashboard/tracker/exercises', icon: Dumbbell },
      { name: 'Supplements', href: '/dashboard/tracker/supplements', icon: Pill }
    ]
  }
];

// Flatten all navigation items for search
const allNavigationItems = [
  ...quickAccessItems,
  ...navGroups.flatMap(group => 
    group.items.map(item => ({ 
      ...item, 
      groupId: group.id,
      groupLabel: group.label 
    }))
  )
];

// Define a type for navigation items with optional group properties
interface NavItem {
  name: string;
  href: string;
  icon: any; // Icon component
  groupId?: string;
  groupLabel?: string;
}

// Baby size by week (sample data)
const babySizeEmojis: Record<number, string> = {
  1: '🫐', // Blueberry
  2: '🫐',
  3: '🫐',
  4: '🌱',
  5: '🌱',
  6: '🌱',
  7: '🫑', // Peapod
  8: '🫑',
  9: '🫑',
  10: '🍓', // Strawberry
  11: '🍓',
  12: '🍋', // Lemon
  13: '🍋',
  14: '🍊', // Orange
  15: '🍊',
  16: '🥑', // Avocado
  17: '🥑',
  18: '🥒', // Cucumber
  19: '🥒',
  20: '🍌', // Banana
  21: '🍌',
  22: '🥕', // Carrot
  23: '🥕',
  24: '🌽', // Corn
  25: '🌽',
  26: '🥬', // Lettuce
  27: '🥬',
  28: '🥦', // Broccoli
  29: '🥦',
  30: '🍍', // Pineapple
  31: '🍍',
  32: '🍉', // Watermelon
  33: '🍉',
  34: '🎃', // Pumpkin
  35: '🎃',
  36: '🎃',
  37: '👶', // Baby
  38: '��',
  39: '👶',
  40: '👶'
};

export interface SideNavProps {
  isMobile?: boolean;
  onNavigate?: () => void;
  currentWeek?: number;
}

export function SideNav({ isMobile = false, onNavigate, currentWeek = 26 }: SideNavProps) {
  // Set all menu groups to be expanded by default
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    journey: true,
    tasks: true,
    tracker: true
  });
  
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useAuth();

  // Calculate baby health score (sample calculation)
  const healthScore = useMemo(() => Math.min(95, Math.round(75 + Math.random() * 20)), []);
  
  // Calculate days left instead of sleep count
  const daysLeft = useMemo(() => {
    // Based on current week (40 - currentWeek) * 7
    return ((40 - currentWeek) * 7);
  }, [currentWeek]);

  // Determine color based on health score
  const getHealthScoreColor = (score: number) => {
    if (score < 70) return 'text-red-500 from-red-500 to-red-500';
    if (score < 80) return 'text-amber-500 from-amber-500 to-amber-500';
    if (score < 90) return 'text-green-400 from-green-400 to-green-400';
    return 'text-green-600 from-green-600 to-green-600';
  };

  const healthScoreColor = useMemo(() => getHealthScoreColor(healthScore), [healthScore]);
  const babyEmoji = babySizeEmojis[currentWeek] || '👶';

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  const handleLinkClick = (href: string) => {
    if (isMobile && onNavigate) {
      onNavigate();
    }
    router.push(href);
  };

  // Animation variants for menu items
  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  };

  // Sidebar component for both mobile and desktop
  const sidebarContent = (
    <div className={cn(
      "flex flex-col h-full bg-background",
      isMobile ? "" : "w-[250px] border-r"
    )}>
      {/* Quick Access */}
      <div className="py-1">
        {quickAccessItems.map((item) => (
          <Button
            key={item.name}
            variant="ghost"
            className={cn(
              "w-full justify-start px-3 py-2 h-10 text-sm",
              pathname.includes(item.href)
                ? "text-foreground" 
                : "text-muted-foreground"
            )}
            onClick={() => handleLinkClick(item.href)}
          >
            <item.icon className="mr-3 h-4 w-4" />
            {item.name}
          </Button>
        ))}
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto thin-scrollbar">
        {navGroups.map((group) => (
          <div key={group.id} className="py-1">
            <div className="flex items-center justify-between px-3 py-2">
              <span className="text-xs font-medium text-muted-foreground">
                {group.label}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 p-0"
                onClick={() => toggleGroup(group.id)}
              >
                {expandedGroups[group.id] ? (
                  <ChevronUp size={14} className="text-muted-foreground" />
                ) : (
                  <ChevronDown size={14} className="text-muted-foreground" />
                )}
              </Button>
            </div>
            
            {expandedGroups[group.id] && (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  visible: { 
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.05
                    }
                  },
                  hidden: { opacity: 0 }
                }}
              >
                {group.items.map((item) => (
                  <motion.div key={item.name} variants={itemVariants}>
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-start px-3 py-2 h-10 text-sm",
                        pathname === item.href 
                          ? "text-foreground" 
                          : "text-muted-foreground"
                      )}
                      onClick={() => handleLinkClick(item.href)}
                    >
                      <item.icon className="mr-3 h-4 w-4" />
                      {item.name}
                    </Button>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <div className="flex flex-col h-full bg-background">
        <div className="flex items-center justify-end p-3 border-b">
          <Button 
            variant="ghost" 
            size="icon"
            className="h-8 w-8"
            onClick={() => onNavigate && onNavigate()}
          >
            <ChevronLeft size={18} />
          </Button>
        </div>
        {sidebarContent}
      </div>
    );
  }

  return (
    <TooltipProvider delayDuration={300}>
      {sidebarContent}
    </TooltipProvider>
  );
} 