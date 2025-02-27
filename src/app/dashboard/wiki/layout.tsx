'use client';

import { useState, useEffect, Suspense } from 'react';
import { createClient } from '@/lib/supabase/client';

// Components
import { Loader2 } from 'lucide-react';

// Loading component
const WikiLoading = () => (
  <div className="h-full flex items-center justify-center">
    <Loader2 className="h-12 w-12 animate-spin text-primary" />
  </div>
);

export default function WikiLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  
  useEffect(() => {
    // Wrap in a try/catch to prevent client errors
    try {
      checkAuth();
    } catch (error) {
      console.error('Error initializing wiki page:', error);
      setIsLoading(false);
    }
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

  if (isLoading) {
    return <WikiLoading />;
  }

  return (
    <Suspense fallback={<WikiLoading />}>
      {children}
    </Suspense>
  );
} 