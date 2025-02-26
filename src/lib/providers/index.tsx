'use client';

import React from 'react';
import { ThemeProvider } from './theme-provider';
import { QueryClientProvider } from './query-client-provider';

interface ProvidersProps {
  children: React.ReactNode;
}

/**
 * Central Providers component that organizes all context providers
 * This helps with:
 * 1. Proper provider nesting order
 * 2. Performance optimizations
 * 3. Code organization
 * 
 * Add any new global providers here in the correct order
 */
export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <QueryClientProvider>
        {children}
      </QueryClientProvider>
    </ThemeProvider>
  );
} 