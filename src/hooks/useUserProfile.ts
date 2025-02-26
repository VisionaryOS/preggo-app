'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClientWithRetry } from '@/lib/supabase/client';
import { useAuth } from './useAuth';

export interface UserProfile {
  id: string;
  full_name?: string | null;
  due_date?: string | null;
  email?: string | null;
  created_at: string;
  // The updated_at field might not exist, make it optional
  updated_at?: string | null;
}

// Query key factory for consistent cache management
const userProfileKeys = {
  all: ['userProfile'] as const,
  detail: (userId: string) => [...userProfileKeys.all, userId] as const,
};

export function useUserProfile() {
  const { user, isAuthenticated } = useAuth();
  const userId = user?.id;
  const queryClient = useQueryClient();
  
  // Fetch user profile data with React Query
  const profileQuery = useQuery({
    queryKey: userProfileKeys.detail(userId || ''),
    queryFn: async (): Promise<UserProfile | null> => {
      if (!userId) return null;
      
      try {
        const supabase = await createClientWithRetry();
        // Only select fields that exist in the users table
        const { data, error } = await supabase
          .from('users')
          .select('id, full_name, due_date, email, created_at')
          .eq('id', userId)
          .single();
        
        if (error) {
          throw error;
        }
        
        // Type assertion with unknown as intermediate step to avoid direct casting errors
        return data as unknown as UserProfile;
      } catch (error) {
        // Log error but with structured info for easier debugging
        console.error('Failed to fetch profile:', { userId, error });
        throw error;
      }
    },
    // Only run the query if the user is authenticated
    enabled: !!userId && isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2, // Retry failed requests twice
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  });
  
  // Update user profile data
  const updateProfile = useMutation({
    mutationFn: async (profileData: Partial<UserProfile>) => {
      if (!userId) throw new Error('User not authenticated');
      
      try {
        const supabase = await createClientWithRetry();
        const { data, error } = await supabase
          .from('users')
          .update(profileData as any) // Use type assertion to avoid TypeScript errors
          .eq('id', userId)
          .select('id, full_name, due_date, email, created_at')
          .single();
        
        if (error) {
          throw error;
        }
        
        return data as unknown as UserProfile;
      } catch (error) {
        console.error('Failed to update profile:', { userId, profileData, error });
        throw error;
      }
    },
    // Optimistic update for better UX
    onMutate: async (newProfile) => {
      if (!userId) return { previousProfile: null };
      
      // Cancel outgoing refetches to avoid overwriting optimistic update
      await queryClient.cancelQueries({
        queryKey: userProfileKeys.detail(userId),
      });
      
      // Save the previous profile value
      const previousProfile = queryClient.getQueryData<UserProfile>(
        userProfileKeys.detail(userId)
      );
      
      // Optimistically update the profile in cache
      queryClient.setQueryData<UserProfile | null>(
        userProfileKeys.detail(userId),
        (old) => old ? { ...old, ...newProfile } : null
      );
      
      // Return previous profile for rollback in case of error
      return { previousProfile };
    },
    onError: (_err, _newProfile, context) => {
      // If the mutation fails, roll back to the previous value
      if (context?.previousProfile && userId) {
        queryClient.setQueryData(
          userProfileKeys.detail(userId),
          context.previousProfile
        );
      }
    },
    onSettled: () => {
      // Refetch after mutation completes
      if (userId) {
        queryClient.invalidateQueries({
          queryKey: userProfileKeys.detail(userId),
        });
      }
    },
  });
  
  return {
    profile: profileQuery.data,
    isLoading: profileQuery.isLoading,
    isError: profileQuery.isError,
    error: profileQuery.error,
    updateProfile,
  };
} 