'use client';

import { create } from 'zustand';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<{
    error: AuthError | null;
    data: { user: User | null; session: Session | null } | null;
  }>;
  signUp: (email: string, password: string, meta?: { [key: string]: unknown }) => Promise<{
    error: AuthError | null;
    data: { user: User | null; session: Session | null } | null;
  }>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  session: null,
  isLoading: true,
  isAuthenticated: false,
  error: null,
  
  clearError: () => set({ error: null }),
  
  signIn: async (email, password) => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        set({ error: result.error || 'Login failed. Please try again.' });
        return {
          error: { message: result.error } as AuthError,
          data: { user: null, session: null }
        };
      }
      
      // Atomic update to minimize re-renders
      set(state => ({
        ...state,
        user: result.user,
        session: result.session,
        isAuthenticated: !!result.session,
        error: null,
      }));
      
      return {
        error: null,
        data: { 
          user: result.user, 
          session: result.session 
        }
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unexpected error occurred';
      set({ error: message });
      return {
        error: { message } as AuthError,
        data: { user: null, session: null }
      };
    } finally {
      set(state => ({ ...state, isLoading: false }));
    }
  },
  
  signUp: async (email, password, meta = {}) => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, meta }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        set({ error: result.error || 'Signup failed. Please try again.' });
        return {
          error: { message: result.error } as AuthError,
          data: { user: null, session: null }
        };
      }
      
      // Atomic update to minimize re-renders
      set(state => ({
        ...state,
        user: result.user,
        session: result.session,
        isAuthenticated: !!result.session,
        error: null,
      }));
      
      return {
        error: null,
        data: { 
          user: result.user, 
          session: result.session 
        }
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unexpected error occurred';
      set({ error: message });
      return {
        error: { message } as AuthError,
        data: { user: null, session: null }
      };
    } finally {
      set(state => ({ ...state, isLoading: false }));
    }
  },
  
  signOut: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await fetch('/api/auth/signout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (!response.ok) {
        const result = await response.json();
        console.error('Sign out error:', result.error);
        set({ error: result.error || 'Failed to sign out' });
        return;
      }
      
      set({ 
        user: null, 
        session: null, 
        isAuthenticated: false,
        error: null
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unexpected error occurred';
      console.error('Error signing out:', message);
      set({ error: 'Failed to sign out. Please try again.' });
    } finally {
      set(state => ({ ...state, isLoading: false }));
    }
  },
}));

// Selectors to help with memoization
const userSelector = (state: AuthState) => state.user;
const sessionSelector = (state: AuthState) => state.session;
const loadingSelector = (state: AuthState) => state.isLoading;
const authenticatedSelector = (state: AuthState) => state.isAuthenticated;
const errorSelector = (state: AuthState) => state.error;
const signInSelector = (state: AuthState) => state.signIn;
const signUpSelector = (state: AuthState) => state.signUp;
const signOutSelector = (state: AuthState) => state.signOut;
const clearErrorSelector = (state: AuthState) => state.clearError;

export function useAuth() {
  const [mounted, setMounted] = useState(false);
  
  // Use individual selectors to minimize rerenders
  const user = useAuthStore(userSelector);
  const session = useAuthStore(sessionSelector);
  const isLoading = useAuthStore(loadingSelector);
  const isAuthenticated = useAuthStore(authenticatedSelector);
  const error = useAuthStore(errorSelector);
  const signIn = useAuthStore(signInSelector);
  const signUp = useAuthStore(signUpSelector);
  const signOut = useAuthStore(signOutSelector);
  const clearError = useAuthStore(clearErrorSelector);
  
  useEffect(() => {
    // Only run this effect on the client
    if (typeof window === 'undefined') return;
    
    const initAuth = async () => {
      try {
        const response = await fetch('/api/auth/session');
        const result = await response.json();
        
        if (response.ok && result.session) {
          useAuthStore.setState(state => ({
            ...state,
            user: result.session.user,
            session: result.session,
            isAuthenticated: true,
            isLoading: false
          }));
        } else {
          useAuthStore.setState(state => ({ ...state, isLoading: false }));
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        useAuthStore.setState(state => ({ ...state, isLoading: false }));
      }
    };
    
    initAuth();
    setMounted(true);
  }, []);
  
  // Don't expose store state until client-side hydration is complete
  return {
    user: mounted ? user : null,
    session: mounted ? session : null,
    isLoading: mounted ? isLoading : true,
    isAuthenticated: mounted ? isAuthenticated : false,
    error: mounted ? error : null,
    signIn,
    signUp,
    signOut,
    clearError
  };
} 