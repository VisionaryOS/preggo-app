import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types';

/**
 * Delay execution for a specified number of milliseconds
 */
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Cache the client instance to prevent multiple initializations
let cachedClient: SupabaseClient<Database> | null = null;
const MAX_RETRIES = 3;
const RETRY_DELAY = 500; // ms

// Add a timestamp for cache invalidation after a period
let clientCreationTime: number = 0;
const CLIENT_CACHE_DURATION = 60 * 60 * 1000; // 1 hour

/**
 * Creates a Supabase client with proper error handling
 */
export const createClient = (): SupabaseClient<Database> => {
  const now = Date.now();
  
  // Return cached client if available, valid, and not expired
  if (cachedClient && now - clientCreationTime < CLIENT_CACHE_DURATION) {
    return cachedClient;
  }
  
  try {
    // Add a console log to see how often this is being called
    console.log('Creating new Supabase client');
    // Create and cache the client - no keys needed here
    // Auth is handled via cookies set by the server
    cachedClient = createClientComponentClient<Database>();
    clientCreationTime = now;
    return cachedClient;
  } catch (error) {
    console.error(`Error creating Supabase client:`, error);
    throw new Error('Failed to create Supabase client');
  }
};

/**
 * Helper function to handle retries with proper typing
 * Optimized to fail faster in development mode
 */
export const createClientWithRetry = async (): Promise<SupabaseClient<Database>> => {
  // In development, we reduce retries to speed up feedback
  const isDev = process.env.NODE_ENV === 'development';
  const effectiveMaxRetries = isDev ? 1 : MAX_RETRIES;
  const effectiveRetryDelay = isDev ? 250 : RETRY_DELAY;
  
  let retries = 0;
  
  while (retries < effectiveMaxRetries) {
    try {
      return createClient();
    } catch (error) {
      retries++;
      console.warn(`Supabase client creation failed (attempt ${retries}/${effectiveMaxRetries})`, error);
      
      if (retries >= effectiveMaxRetries) throw error;
      await delay(effectiveRetryDelay * retries);
    }
  }
  
  throw new Error('Failed to create client after maximum retries');
};

/**
 * Tests the Supabase connection with retry logic
 */
export async function testSupabaseConnection() {
  // In development, we reduce retries to speed up feedback
  const isDev = process.env.NODE_ENV === 'development';
  const effectiveMaxRetries = isDev ? 1 : MAX_RETRIES;
  const effectiveRetryDelay = isDev ? 250 : RETRY_DELAY;
  
  let retries = 0;
  
  while (retries < effectiveMaxRetries) {
    try {
      const startTime = performance.now();
      const supabase = createClient();
      // Using a more generic approach to test connection without type issues
      const { error } = await supabase.auth.getSession();
      const endTime = performance.now();
      
      if (!error) {
        return {
          success: true,
          error: null,
          latency: `${Math.round(endTime - startTime)}ms`
        };
      }
      
      // If there's an error, retry with delay
      retries++;
      if (retries >= effectiveMaxRetries) break;
      await delay(effectiveRetryDelay * retries);
    } catch (error) {
      retries++;
      console.error(`Connection test failed (attempt ${retries}):`, error);
      
      if (retries >= effectiveMaxRetries) break;
      await delay(effectiveRetryDelay * retries);
    }
  }
  
  return {
    success: false,
    error: new Error('Connection test failed after maximum retry attempts')
  };
} 