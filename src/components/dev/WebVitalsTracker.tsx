'use client';

import { useEffect } from 'react';
import { reportWebVitals, sendVitalsToAnalytics } from '@/lib/utils/web-vitals';

export function WebVitalsTracker() {
  useEffect(() => {
    // Register web vitals tracking
    reportWebVitals(sendVitalsToAnalytics);
  }, []);
  
  // This component doesn't render anything
  return null;
} 