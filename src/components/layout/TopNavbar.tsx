'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn, formatDate } from '@/lib/utils';
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
  Bell
} from 'lucide-react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SideNav } from '@/components/dashboard/SideNav';
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
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const { setTheme, theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  // Calculate days left
  const daysLeft = ((40 - currentWeek) * 7);
  
  // Handle mounting for client-side theme detection
  useEffect(() => {
    setMounted(true);
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  // Get the next appointment
  const nextAppointment = upcomingAppointments.length > 0 ? upcomingAppointments[0] : null;
  
  // Count unread notifications
  const unreadCount = notifications.filter(n => !n.read).length;

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

        {/* Center section: Mega menus - Desktop only */}
        <div className="hidden md:flex items-center gap-1">
          <NavigationMenu>
            <NavigationMenuList>
              {/* Dashboard mega menu - Feature focused layout */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent px-3">
                  Dashboard
                </NavigationMenuTrigger>
                <NavigationMenuContent className="w-[500px] lg:w-[600px]">
                  <div className="grid gap-3 p-6">
                    <div className="flex flex-col gap-2">
                      <h3 className="text-lg font-medium">{dashboardMenu.title}</h3>
                      <p className="text-sm text-muted-foreground">{dashboardMenu.description}</p>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      {dashboardMenu.featured.map((item) => (
                        <Link 
                          key={item.name} 
                          href={item.href}
                          className={cn(
                            "flex flex-col gap-2 rounded-lg p-4 hover:bg-accent",
                            pathname === item.href ? "bg-accent" : ""
                          )}
                        >
                          <div className="flex items-center gap-2">
                            <item.icon className="h-5 w-5 text-primary" />
                            <h3 className="font-medium">{item.name}</h3>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {item.description}
                          </p>
                        </Link>
                      ))}
                    </div>
                    <Separator className="my-2" />
                    <div className="grid grid-cols-2 gap-3">
                      {dashboardMenu.sections[0].items.map((item) => (
                        <Link 
                          key={item.name} 
                          href={item.href}
                          className={cn(
                            "flex items-center gap-2 text-sm p-2 rounded-md hover:bg-accent",
                            pathname === item.href ? "bg-accent" : ""
                          )}
                        >
                          <item.icon className="h-4 w-4" />
                          <span>{item.name}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Pregnancy Journey mega menu - Column layout */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent px-3">
                  Pregnancy
                </NavigationMenuTrigger>
                <NavigationMenuContent className="w-[500px] lg:w-[600px]">
                  <div className="grid grid-cols-2 gap-6 p-6">
                    {pregnancyJourneyMenu.items.map((section, index) => (
                      <div key={index} className="space-y-3">
                        <h3 className="text-sm font-medium">{section.heading}</h3>
                        <ul className="space-y-2">
                          {section.links.map((link) => (
                            <li key={link.name}>
                              <Link
                                href={link.href}
                                className={cn(
                                  "flex items-center gap-2 text-sm p-2 rounded-md",
                                  pathname === link.href 
                                    ? "bg-accent text-accent-foreground" 
                                    : "hover:bg-accent hover:text-accent-foreground"
                                )}
                              >
                                <link.icon className="h-4 w-4" />
                                <span>{link.name}</span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Resources mega menu - Card layout */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent px-3">
                  Resources
                </NavigationMenuTrigger>
                <NavigationMenuContent className="w-[500px] lg:w-[600px]">
                  <div className="grid grid-cols-2 gap-3 p-4">
                    {resourcesMenu.map((item) => (
                      <Link
                        key={item.title}
                        href={item.href}
                        className="group flex flex-col space-y-2 rounded-md p-3 hover:bg-accent"
                      >
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                            <item.icon className="h-5 w-5" />
                          </div>
                          <h3 className="font-medium group-hover:text-accent-foreground">
                            {item.title}
                          </h3>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {item.description}
                        </p>
                      </Link>
                    ))}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
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

          {/* Days Left Counter */}
          <div className="hidden md:flex flex-col items-end">
            <p className="text-sm font-medium">{daysLeft}</p>
            <p className="text-xs text-muted-foreground">days left</p>
          </div>

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
    </header>
  );
} 