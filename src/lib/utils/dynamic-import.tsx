"use client";

import dynamic from 'next/dynamic';
import { ComponentType, ReactNode, useState, useEffect } from 'react';

interface DynamicImportOptions {
  /**
   * Loading component to show while the dynamic component is being loaded
   */
  loadingComponent?: ReactNode;

  /**
   * Whether to use server-side rendering for this component
   * Set to false for components that don't need SSR to improve performance
   */
  ssr?: boolean;

  /**
   * Time in milliseconds to wait before showing the loading component
   * Set this to prevent flashes of loading states for fast connections
   */
  delay?: number;
}

const defaultOptions: DynamicImportOptions = {
  loadingComponent: <div className="animate-pulse p-4 bg-gray-100 rounded-md min-h-[100px]" />,
  ssr: true,
  delay: 200,
};

/**
 * Creates a dynamically imported component with consistent loading behavior
 * 
 * @param importFunc - Dynamic import function for the component
 * @param options - Configuration options for the dynamic import
 * @returns A dynamically imported component
 * 
 * @example
 * ```tsx
 * const DynamicHeroSection = dynamicImport(() => import('@/components/ui/HeroSection'), {
 *   ssr: false, // Client-side only component
 * });
 * ```
 */
export function dynamicImport<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  options?: DynamicImportOptions
): ComponentType<any> {
  const { loadingComponent, ssr, delay } = { ...defaultOptions, ...options };
  
  return dynamic(importFunc, {
    ssr,
    loading: delay && delay > 0 
      ? () => <DelayedLoader delay={delay}>{loadingComponent}</DelayedLoader> 
      : () => <>{loadingComponent}</>,
  });
}

/**
 * Component that delays showing its children for a specific time
 * to prevent loading flashes for fast-loading components
 */
function DelayedLoader({ 
  children, 
  delay = 200 
}: { 
  children: ReactNode; 
  delay?: number 
}) {
  const [shouldShow, setShouldShow] = useState(false);
  
  useEffect(() => {
    // Set a timeout to show the loading state after the delay
    const timer = setTimeout(() => {
      setShouldShow(true);
    }, delay);
    
    // Clean up the timeout if the component unmounts
    return () => clearTimeout(timer);
  }, [delay]);
  
  // Don't show anything until the delay has passed
  if (!shouldShow) {
    return null;
  }
  
  // After delay, show the loading component
  return <>{children}</>;
} 