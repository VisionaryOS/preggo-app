/**
 * Supabase Integration
 * 
 * This file exports the Supabase client functions and utilities.
 * It's the central entry point for Supabase functionality.
 */

// Client-side Supabase functions
export { createClient, createClientWithRetry } from './client';

// Server-side Supabase functions
export { 
  createServerClient, 
  createServerComponentSupabase, 
  createAPIRouteClient 
} from './server';

// Configuration and environment variables
export { 
  SUPABASE_URL, 
  SUPABASE_ANON_KEY,
  validateEnvVars
} from './config'; 