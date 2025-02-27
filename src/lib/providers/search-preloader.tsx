'use client';

import React from 'react';
import { useSearchPreload } from '@/hooks/useSearchPreload';

/**
 * Component that preloads the search index during application initialization
 * It doesn't render anything visible, just initializes search functionality
 */
export function SearchPreloader() {
  // Use the preload hook to initialize the search index
  useSearchPreload();
  
  // This component doesn't render anything
  return null;
} 