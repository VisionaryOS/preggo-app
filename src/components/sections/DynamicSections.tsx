"use client";

import { Suspense } from 'react';
import { LoadingSkeleton } from '@/components/ui/loading-skeleton';
import { dynamicImport } from '@/lib/utils/dynamic-import';

// Use our optimized dynamic import utility
// These components aren't needed for the initial page view
// so we can defer their loading
const FeaturesSection = dynamicImport(() => import('@/components/sections/FeaturesSection'), {
  ssr: false, // Client-side only component, doesn't need SSR
  delay: 300, // Only show loading state after 300ms
});

const TestimonialsSection = dynamicImport(() => import('@/components/sections/TestimonialsSection'), {
  ssr: false,
  delay: 400,
});

const CTASection = dynamicImport(() => import('@/components/sections/CTASection'), {
  ssr: false,
  delay: 500,
});

export function DynamicSections() {
  return (
    <div className="space-y-12">
      {/* Each section in its own Suspense boundary to enable progressive loading */}
      <Suspense fallback={<div className="py-8"><LoadingSkeleton count={4} /></div>}>
        <FeaturesSection />
      </Suspense>
      
      <Suspense fallback={<div className="py-8"><LoadingSkeleton count={3} /></div>}>
        <TestimonialsSection />
      </Suspense>
      
      <Suspense fallback={<div className="py-8"><LoadingSkeleton count={1} /></div>}>
        <CTASection />
      </Suspense>
    </div>
  );
} 