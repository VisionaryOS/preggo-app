'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
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
  Smile
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Navigation groups and items - simplified labels
const navGroups = [
  {
    id: 'journey',
    label: 'Journey',
    items: [
      { name: 'Weekly', href: '/dashboard/weekly', icon: Calendar },
      { name: 'Due Date', href: '/dashboard/due-date', icon: CalendarCheck },
      { name: 'Baby', href: '/dashboard/baby', icon: Baby }
    ]
  },
  {
    id: 'tasks',
    label: 'Tasks',
    items: [
      { name: 'Todo', href: '/dashboard/todo', icon: CheckSquare },
      { name: 'Calendar', href: '/dashboard/appointments', icon: Clock },
      { name: 'Shopping', href: '/dashboard/shopping', icon: ShoppingBag }
    ]
  },
  {
    id: 'health',
    label: 'Health',
    items: [
      { name: 'Tracker', href: '/dashboard/health', icon: Heart },
      { name: 'Nutrition', href: '/dashboard/nutrition', icon: BarChart3 },
      { name: 'Wellbeing', href: '/dashboard', icon: Smile }
    ]
  },
  {
    id: 'resources',
    label: 'Learn',
    items: [
      { name: 'Resources', href: '/dashboard/resources', icon: BookOpen }
    ]
  }
];

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
  38: '👶',
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
    health: true,
    resources: true
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

        {/* Profile section at the top */}
        <div className="p-3 border-b">
          <div className="flex items-center space-x-3 mb-2">
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-primary/10 text-primary">SJ</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-sm font-medium leading-none">Sarah Johnson</p>
              <p className="text-xs text-muted-foreground mt-1">Week {currentWeek}</p>
            </div>
          </div>
        </div>

        {/* Dashboard link */}
        <div className="px-3 py-2 border-b">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start py-1.5 h-8 text-sm",
              pathname === '/dashboard' 
                ? "bg-accent text-accent-foreground" 
                : "text-muted-foreground"
            )}
            onClick={() => handleLinkClick('/dashboard')}
          >
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
        </div>

        <nav className="flex-1 py-1 overflow-auto thin-scrollbar">
          {navGroups.map((group) => (
            <div key={group.id} className="mb-1">
              <Button
                variant="ghost"
                className="w-full justify-between px-3 py-1.5 h-7 text-xs font-medium text-muted-foreground"
                onClick={() => toggleGroup(group.id)}
              >
                {group.label}
                {expandedGroups[group.id] ? (
                  <ChevronUp size={14} />
                ) : (
                  <ChevronDown size={14} />
                )}
              </Button>
              
              {expandedGroups[group.id] && (
                <motion.ul 
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
                  className="mt-1 border-l-2 border-muted ml-3"
                >
                  {group.items.map((item) => (
                    <motion.li key={item.name} variants={itemVariants}>
                      <Button
                        variant="ghost"
                        className={cn(
                          "w-full justify-start pl-3 py-1 h-7 text-sm",
                          pathname === item.href 
                            ? "bg-accent text-accent-foreground" 
                            : "text-muted-foreground"
                        )}
                        onClick={() => handleLinkClick(item.href)}
                      >
                        <item.icon className="mr-2 h-4 w-4" />
                        {item.name}
                      </Button>
                    </motion.li>
                  ))}
                </motion.ul>
              )}
            </div>
          ))}
        </nav>

        {/* Sign Out button */}
        <div className="p-3 border-t">
          <Button 
            variant="ghost" 
            className="w-full flex items-center gap-2 h-8 text-sm text-muted-foreground"
            onClick={handleSignOut}
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider delayDuration={300}>
      <div className="h-screen border-r flex flex-col bg-background w-[220px] overflow-hidden">
        {/* Profile section at the top with baby size emoji */}
        <div className="p-3 border-b">
          <div className="flex items-center space-x-3 mb-2">
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-primary/10 text-primary">SJ</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-sm font-medium leading-none">Sarah Johnson</p>
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                <span>Week {currentWeek}</span>
                <span className="ml-2">{babyEmoji}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard link */}
        <div className="p-2 border-b">
          <Link 
            href="/dashboard"
            className={cn(
              "flex items-center gap-2 py-1.5 px-3 rounded-md transition-colors",
              "hover:bg-accent hover:text-accent-foreground font-medium",
              pathname === '/dashboard' 
                ? "bg-accent text-accent-foreground" 
                : "text-foreground"
            )}
          >
            <LayoutDashboard size={16} />
            <span>Dashboard</span>
          </Link>
        </div>

        <nav className="flex-1 py-2 overflow-auto thin-scrollbar">
          <div className="px-2">
            {navGroups.map((group) => (
              <div key={group.id} className="mb-3">
                <Button
                  variant="ghost"
                  className="w-full justify-between px-3 py-1 h-7 text-xs font-medium text-muted-foreground hover:text-foreground"
                  onClick={() => toggleGroup(group.id)}
                >
                  {group.label}
                  {expandedGroups[group.id] ? (
                    <ChevronUp size={14} />
                  ) : (
                    <ChevronDown size={14} />
                  )}
                </Button>
                
                {expandedGroups[group.id] && (
                  <motion.ul 
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
                    className="mt-1 border-l-2 border-muted ml-2"
                  >
                    {group.items.map((item) => (
                      <motion.li key={item.name} variants={itemVariants}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Link 
                              href={item.href}
                              className={cn(
                                "flex items-center gap-2 py-1 px-2 rounded-md transition-colors text-sm ml-2",
                                "hover:bg-accent hover:text-accent-foreground",
                                pathname === item.href 
                                  ? "bg-accent text-accent-foreground" 
                                  : "text-muted-foreground"
                              )}
                            >
                              <item.icon size={15} />
                              <span className="truncate">{item.name}</span>
                            </Link>
                          </TooltipTrigger>
                          <TooltipContent side="right" align="center" className="text-xs">
                            {item.name === 'Weekly' ? 'Weekly Journey' : 
                             item.name === 'Due Date' ? 'Due Date Planning' :
                             item.name === 'Baby' ? 'Baby Development' :
                             item.name === 'Todo' ? 'To-Do List' :
                             item.name === 'Calendar' ? 'Appointments' :
                             item.name === 'Tracker' ? 'Health Tracker' : item.name}
                          </TooltipContent>
                        </Tooltip>
                      </motion.li>
                    ))}
                  </motion.ul>
                )}
              </div>
            ))}
          </div>
        </nav>

        {/* Sign Out button */}
        <div className="p-3 border-t mt-auto">
          <Button 
            variant="ghost" 
            className="w-full flex items-center gap-2 h-8 text-sm text-muted-foreground hover:text-foreground"
            onClick={handleSignOut}
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </Button>
        </div>
      </div>
    </TooltipProvider>
  );
} 