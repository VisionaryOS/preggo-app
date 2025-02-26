// Supabase configuration with proper validation
// This ensures authentication setup is robust against missing environment variables

// Default project URL (only used if environment variables are missing)
const DEFAULT_SUPABASE_URL = 'https://meyxbudeqvtwfqpcrwpb.supabase.co';
const DEFAULT_SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1leXhidWRlcXZ0d2ZxcGNyd3BiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA1MzgwNzksImV4cCI6MjA1NjExNDA3OX0.gFku0By08Eju6ZAGS-RPXk72HzRPv42J38nEwjpgq3o';

// Validate environment variables or use defaults with clear logging
export const supabaseConfig = {
  supabaseUrl: validateUrl(process.env.NEXT_PUBLIC_SUPABASE_URL) || DEFAULT_SUPABASE_URL,
  supabaseKey: validateKey(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) || DEFAULT_SUPABASE_KEY
};

// Helper function to validate URL
function validateUrl(url?: string): string | null {
  if (!url) {
    console.warn('NEXT_PUBLIC_SUPABASE_URL is not defined in environment variables');
    return null;
  }
  
  try {
    new URL(url); // Check if valid URL format
    return url;
  } catch {
    console.error('Invalid NEXT_PUBLIC_SUPABASE_URL format:', url);
    return null;
  }
}

// Helper function to validate API key
function validateKey(key?: string): string | null {
  if (!key) {
    console.warn('NEXT_PUBLIC_SUPABASE_ANON_KEY is not defined in environment variables');
    return null;
  }
  
  // Simple validation - should be JWT format (contain at least two periods)
  if (!key.includes('.') || key.split('.').length < 3) {
    console.error('Invalid NEXT_PUBLIC_SUPABASE_ANON_KEY format');
    return null;
  }
  
  return key;
} 