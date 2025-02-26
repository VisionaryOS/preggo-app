import { create } from 'zustand';
import { createClient } from '@/lib/supabase/client';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { useEffect, useCallback, useRef } from 'react';
import { handleAuthError, logAuthError } from '@/lib/utils/error-handler';
import { runSupabaseDiagnostics, logDiagnosticResults, getDiagnosticSummary } from '@/lib/supabase/diagnostics';

// Circuit breaker configuration
const CIRCUIT_BREAKER = {
  MAX_FAILURES: 3,
  RESET_TIMEOUT: 60000, // 1 minute before resetting the circuit breaker
  BACKOFF_BASE: 2, // Base for exponential backoff
};

// Global circuit state to prevent multiple instances from causing multiple retries
interface CircuitState {
  failures: number;
  lastFailure: number;
  isOpen: boolean;
}

// Create a global circuit state (outside component lifecycle)
const circuitState: CircuitState = {
  failures: 0,
  lastFailure: 0,
  isOpen: false,
};

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: { message: string; severity: 'error' | 'warning' | 'info' } | null;
  signIn: (email: string, password: string) => Promise<{
    error: AuthError | null;
    data: { user: User | null; session: Session | null } | null;
  }>;
  signUp: (email: string, password: string, meta?: { [key: string]: unknown }) => Promise<{
    error: AuthError | null;
    data: { user: User | null; session: Session | null } | null;
  }>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
  clearError: () => void;
  runDiagnostics: () => Promise<void>;
  resetCircuitBreaker: () => void;
  circuitBreakerStatus: {
    isOpen: boolean;
    failures: number;
    canRetry: boolean;
  };
}

function checkCircuitBreaker(): boolean {
  // If circuit is open, check if it's time to try again
  if (circuitState.isOpen) {
    const now = Date.now();
    const timeSinceLastFailure = now - circuitState.lastFailure;
    
    // Reset circuit after timeout period
    if (timeSinceLastFailure > CIRCUIT_BREAKER.RESET_TIMEOUT) {
      circuitState.failures = 0;
      circuitState.isOpen = false;
      console.info('Auth circuit breaker reset after timeout period');
      return true;
    }
    
    return false; // Circuit still open
  }
  
  return true; // Circuit closed, can proceed
}

function recordFailure(): void {
  circuitState.failures += 1;
  circuitState.lastFailure = Date.now();
  
  if (circuitState.failures >= CIRCUIT_BREAKER.MAX_FAILURES) {
    circuitState.isOpen = true;
    console.warn(`Auth circuit breaker opened after ${CIRCUIT_BREAKER.MAX_FAILURES} failures`);
  }
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  user: null,
  session: null,
  isLoading: true,
  isAuthenticated: false,
  error: null,
  
  clearError: () => set({ error: null }),
  
  resetCircuitBreaker: () => {
    circuitState.failures = 0;
    circuitState.isOpen = false;
    circuitState.lastFailure = 0;
    set({ error: null });
    console.info('Auth circuit breaker manually reset');
  },
  
  circuitBreakerStatus: {
    get isOpen() { return circuitState.isOpen; },
    get failures() { return circuitState.failures; },
    get canRetry() { return checkCircuitBreaker(); }
  },
  
  signIn: async (email, password) => {
    try {
      set({ isLoading: true, error: null });
      
      // Check circuit breaker before proceeding
      if (!checkCircuitBreaker()) {
        const cooldownRemaining = Math.ceil((CIRCUIT_BREAKER.RESET_TIMEOUT - (Date.now() - circuitState.lastFailure)) / 1000);
        throw new Error(`Too many authentication failures. Please try again in ${cooldownRemaining} seconds.`);
      }
      
      const supabase = createClient();
      
      // Run quick diagnostics before attempting sign in
      const diagnostics = await runSupabaseDiagnostics();
      const { status, issues } = getDiagnosticSummary(diagnostics);
      
      if (status === 'error') {
        recordFailure();
        throw new Error(`Authentication service unavailable: ${issues.join(', ')}`);
      }
      
      const response = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (response.error) {
        // Only record certain types of failures that indicate service issues
        if (response.error.message.includes('network') || 
            response.error.message.includes('unavailable') ||
            response.error.message.includes('configuration')) {
          recordFailure();
        }
        
        const { message, severity } = handleAuthError(response.error, { email });
        set({ error: { message, severity } });
        return response;
      }
      
      // Reset failures on success
      circuitState.failures = 0;
      
      if (response.data?.session) {
        set({
          user: response.data.user,
          session: response.data.session,
          isAuthenticated: true,
          error: null,
        });
      }
      
      return response;
    } catch (error) {
      const { message, severity } = handleAuthError(error as Error, { email });
      set({ error: { message, severity } });
      return {
        error: error as AuthError,
        data: { user: null, session: null }
      };
    } finally {
      set({ isLoading: false });
    }
  },
  
  signUp: async (email, password, meta = {}) => {
    try {
      set({ isLoading: true, error: null });
      
      // Check circuit breaker
      if (!checkCircuitBreaker()) {
        const cooldownRemaining = Math.ceil((CIRCUIT_BREAKER.RESET_TIMEOUT - (Date.now() - circuitState.lastFailure)) / 1000);
        throw new Error(`Too many authentication failures. Please try again in ${cooldownRemaining} seconds.`);
      }
      
      // Run diagnostics before signup attempt
      const diagnostics = await runSupabaseDiagnostics();
      const { status, issues, recommendations } = getDiagnosticSummary(diagnostics);
      
      if (status === 'error') {
        recordFailure();
        throw new Error(`Cannot create account: ${issues.join(', ')}. ${recommendations.join('. ')}`);
      }
      
      const supabase = createClient();
      if (!supabase) {
        recordFailure();
        throw new Error('Failed to initialize authentication service');
      }
      
      // Log signup attempt for debugging
      if (process.env.NODE_ENV === 'development') {
        console.log('Attempting signup:', { email, metaFields: Object.keys(meta) });
      }
      
      const response = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: meta,
          emailRedirectTo: `${window.location.origin}/login?verified=true`,
        },
      });
      
      if (response.error) {
        // Record infrastructure failures only
        if (response.error.message.includes('network') || 
            response.error.message.includes('unavailable') ||
            response.error.message.includes('configuration')) {
          recordFailure();
        }
        
        const { message, severity } = handleAuthError(response.error, { email });
        set({ error: { message, severity } });
        return response;
      }
      
      // Reset failures on success
      circuitState.failures = 0;
      
      if (response.data?.session) {
        set({
          user: response.data.user,
          session: response.data.session,
          isAuthenticated: true,
          error: null,
        });
      }
      
      return response;
    } catch (error) {
      const { message, severity } = handleAuthError(error as Error, { email });
      set({ error: { message, severity } });
      return {
        error: error as AuthError,
        data: { user: null, session: null }
      };
    } finally {
      set({ isLoading: false });
    }
  },
  
  signOut: async () => {
    try {
      set({ isLoading: true, error: null });
      const supabase = createClient();
      await supabase.auth.signOut();
      set({
        user: null,
        session: null,
        isAuthenticated: false,
      });
    } catch (error) {
      const { message, severity } = handleAuthError(error as Error);
      set({ error: { message, severity } });
    } finally {
      set({ isLoading: false });
    }
  },
  
  refreshSession: async () => {
    try {
      // Don't attempt to refresh if circuit breaker is open
      if (!checkCircuitBreaker()) {
        console.warn('Auth circuit breaker open, skipping session refresh');
        return;
      }
      
      set({ isLoading: true });
      const supabase = createClient();
      
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        // Record infrastructure failures only
        if (error.message.includes('network') || 
            error.message.includes('unavailable') ||
            error.message.includes('configuration')) {
          recordFailure();
        }
        
        const { message, severity } = handleAuthError(error);
        set({ error: { message, severity } });
        return;
      }
      
      // Reset failures on success
      circuitState.failures = 0;
      
      if (data?.session) {
        set({
          user: data.session.user,
          session: data.session,
          isAuthenticated: true,
          error: null,
        });
      } else {
        set({
          user: null,
          session: null,
          isAuthenticated: false,
          error: null,
        });
      }
    } catch (error) {
      // Only record certain failures
      if ((error as Error).message.includes('network') || 
          (error as Error).message.includes('unavailable') ||
          (error as Error).message.includes('configuration')) {
        recordFailure();
      }
      
      const { message, severity } = handleAuthError(error as Error);
      set({ error: { message, severity } });
    } finally {
      set({ isLoading: false });
    }
  },
  
  runDiagnostics: async () => {
    try {
      set({ isLoading: true });
      const results = await runSupabaseDiagnostics();
      
      if (process.env.NODE_ENV === 'development') {
        logDiagnosticResults(results);
      }
      
      const { status, issues, recommendations } = getDiagnosticSummary(results);
      
      if (status !== 'healthy') {
        set({
          error: {
            message: `Authentication service issues detected: ${issues.join(', ')}. ${recommendations.join('. ')}`,
            severity: status === 'error' ? 'error' : 'warning'
          }
        });
      }
    } catch (error) {
      const { message, severity } = handleAuthError(error as Error);
      set({ error: { message, severity } });
    } finally {
      set({ isLoading: false });
    }
  },
}));

export const useAuth = () => {
  const auth = useAuthStore();
  const retryCountRef = useRef(0);
  const maxRetries = 3;
  
  const initializeAuth = useCallback(async () => {
    try {
      // Check if we've already hit retry limits
      if (retryCountRef.current >= maxRetries) {
        console.warn(`Max auth initialization retries (${maxRetries}) reached`);
        return;
      }
      
      // Don't proceed if circuit breaker is open
      if (!checkCircuitBreaker()) {
        console.warn('Auth circuit breaker open, skipping initialization');
        auth.error = {
          message: `Authentication temporarily disabled after multiple failures. Please try again in ${Math.ceil(CIRCUIT_BREAKER.RESET_TIMEOUT / 1000)} seconds.`,
          severity: 'error'
        };
        return;
      }
      
      // Run diagnostics with exponential backoff on failure
      await auth.runDiagnostics().catch(error => {
        // Increment retry counter
        retryCountRef.current++;
        
        // Schedule retry with exponential backoff
        const backoffTime = Math.pow(CIRCUIT_BREAKER.BACKOFF_BASE, retryCountRef.current) * 1000;
        console.warn(`Auth initialization failed, retrying in ${backoffTime}ms (attempt ${retryCountRef.current}/${maxRetries})`);
        
        setTimeout(() => {
          initializeAuth();
        }, backoffTime);
        
        throw error;
      });
      
      // Only proceed with session refresh if diagnostics were OK
      if (!auth.error || auth.error.severity !== 'error') {
        await auth.refreshSession();
        // Reset retry counter on success
        retryCountRef.current = 0;
      }
    } catch (error) {
      const { message, severity } = handleAuthError(error as Error);
      auth.error = { message, severity };
    }
  }, [auth]);
  
  useEffect(() => {
    const initAuth = async () => {
      // Only initialize if we haven't hit retry limits
      if (retryCountRef.current < maxRetries) {
        await initializeAuth();
      }
    };
    
    initAuth();
    
    // Set up auth state change listener with retry protection
    let subscription: { unsubscribe: () => void } | null = null;
    
    try {
      const supabase = createClient();
      
      if (supabase) {
        const { data } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            // Don't process events if circuit breaker is open
            if (!checkCircuitBreaker()) {
              console.warn('Auth circuit breaker open, ignoring auth state change event:', event);
              return;
            }
            
            try {
              if (event === 'SIGNED_IN' && session) {
                await auth.refreshSession();
              }
              
              if (event === 'SIGNED_OUT') {
                await auth.refreshSession();
              }
              
              if (event === 'USER_UPDATED') {
                await auth.refreshSession();
              }
            } catch (error) {
              console.error('Error handling auth state change:', error);
              // Don't retry here - just log the error
            }
          }
        );
        
        subscription = data.subscription;
      }
    } catch (error) {
      console.error('Failed to set up auth state change listener:', error);
    }
    
    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [auth, initializeAuth]);
  
  return auth;
}; 