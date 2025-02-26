/**
 * Supabase Configuration
 * 
 * This file contains configuration values for Supabase connections.
 * It handles environment variables and provides default values where appropriate.
 */

// Public environment variables (client-side)
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Server-only environment variables
export const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Connection configuration
export const DEFAULT_RETRY_COUNT = 3;
export const DEFAULT_RETRY_DELAY = 500; // ms

// Validate that required environment variables are set
export const validateEnvVars = () => {
  const missing = [];
  
  if (!SUPABASE_URL) missing.push('NEXT_PUBLIC_SUPABASE_URL');
  if (!SUPABASE_ANON_KEY) missing.push('NEXT_PUBLIC_SUPABASE_ANON_KEY');
  
  return {
    valid: missing.length === 0,
    missing
  };
};

// Public app configuration
// No sensitive keys are stored here

// App URL for redirects
export const appConfig = {
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
}; 