'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useMediaQuery } from '@/hooks/use-media-query';
import { cn } from '@/lib/utils';

// Components
import { Loader2 } from 'lucide-react';
import { SideNav } from '@/components/dashboard/SideNav';
import TopNavbar from '@/components/layout/TopNavbar';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import EnhancedSearch from '@/components/search/EnhancedSearch';

// Define the searchable items array outside the component to avoid recreating on each render
import {
  LayoutDashboard, 
  Baby, 
  Heart, 
  CheckSquare, 
  ShoppingBag, 
  BookCopy, 
  Calendar,
  Clock,
  Sparkles,
  Zap,
  Apple,
  Brain,
  Scale,
  PenTool,
  Users,
  MessageCircle,
  UserCircle,
  Settings
} from 'lucide-react';

const globalSearchableItems = [
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
];

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [currentWeek, setCurrentWeek] = useState<number>(12);
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  useEffect(() => {
    checkAuth();
    calculateCurrentWeek();
  }, []);

  // Function to check authentication and user metadata
  const checkAuth = async () => {
    try {
      const supabase = createClient();
      
      // Get the user
      const { data, error } = await supabase.auth.getUser();
      
      if (error) {
        console.error('❌ Auth error:', error.message);
        setIsLoading(false);
        return;
      }
      
      if (data.user) {
        setUser(data.user);
      }
      
      setIsLoading(false);
    } catch (err) {
      console.error('Error checking auth:', err);
      setIsLoading(false);
    }
  };

  // Calculate current week of pregnancy based on due date
  const calculateCurrentWeek = () => {
    // This would typically come from the user's profile/database
    // For now, we'll use a fixed due date for demonstration
    const dueDate = new Date('2024-10-15');
    const today = new Date();
    
    // Pregnancy is approximately 40 weeks
    // Calculate backward from due date
    const daysUntilDue = Math.floor((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    const weeksUntilDue = Math.floor(daysUntilDue / 7);
    const currentWeek = 40 - weeksUntilDue;
    
    // Ensure the week is between 1 and 40
    const clampedWeek = Math.max(1, Math.min(40, currentWeek));
    setCurrentWeek(clampedWeek);
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      {/* Top Navigation Bar */}
      <TopNavbar currentWeek={currentWeek} />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar Navigation */}
        {isDesktop && (
          <SideNav currentWeek={currentWeek} />
        )}
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Breadcrumb */}
          <Breadcrumb />
          
          <main className="flex-1 overflow-hidden">
            <div className="h-full overflow-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
      
      {/* Add the EnhancedSearch component */}
      <EnhancedSearch searchableItems={globalSearchableItems} />
    </div>
  );
} 