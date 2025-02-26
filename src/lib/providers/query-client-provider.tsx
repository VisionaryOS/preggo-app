'use client';

import { QueryClient, QueryClientProvider as TanStackQueryProvider } from '@tanstack/react-query';
import { useState, type ReactNode } from 'react';

export function QueryClientProvider({ children }: { children: ReactNode }) {
  // Create a new QueryClient instance for each session to avoid shared state across users
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime in v4)
        retry: 1, // Retry failed requests only once
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
      },
    },
  }));

  return (
    <TanStackQueryProvider client={queryClient}>
      {children}
    </TanStackQueryProvider>
  );
} 