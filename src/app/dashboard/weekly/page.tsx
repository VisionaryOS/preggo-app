'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

// Components
import Dashboard from '@/components/dashboard/Dashboard';
import { Loader2 } from 'lucide-react';

export default function WeeklyJourneyPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [currentWeek, setCurrentWeek] = useState<number>(12);

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
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return <Dashboard currentWeek={currentWeek} />;
} 