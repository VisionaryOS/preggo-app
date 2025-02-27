'use client';

import { ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useJourney } from '@/context/JourneyContext';
import { JourneyStage } from '@/types/journey.types';

interface ProgressiveDisclosureProps {
  children: ReactNode;
  minWeek?: number;
  maxWeek?: number;
  stages?: JourneyStage[];
  fallback?: ReactNode;
  animation?: 'fade' | 'slide' | 'scale' | 'none';
}

/**
 * A component that conditionally renders content based on the user's journey stage.
 * Content can be shown or hidden based on pregnancy week and journey stage.
 */
export function ProgressiveDisclosure({
  children,
  minWeek,
  maxWeek,
  stages,
  fallback,
  animation = 'fade',
}: ProgressiveDisclosureProps) {
  const { currentWeek, stage } = useJourney();
  
  // Determine if content should be shown based on stage and week
  const shouldShow = (): boolean => {
    // Check stage first if specified
    if (stages && !stages.includes(stage)) {
      return false;
    }
    
    // Check week range if specified
    if (minWeek !== undefined && currentWeek < minWeek) {
      return false;
    }
    
    if (maxWeek !== undefined && currentWeek > maxWeek) {
      return false;
    }
    
    return true;
  };
  
  // Define animation variants based on animation type
  const getVariants = () => {
    switch (animation) {
      case 'fade':
        return {
          hidden: { opacity: 0 },
          visible: { opacity: 1 },
        };
      case 'slide':
        return {
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0 },
        };
      case 'scale':
        return {
          hidden: { opacity: 0, scale: 0.8 },
          visible: { opacity: 1, scale: 1 },
        };
      case 'none':
        return {
          hidden: {},
          visible: {},
        };
    }
  };
  
  // If content should not be shown and there's a fallback, show the fallback
  if (!shouldShow() && fallback) {
    return <>{fallback}</>;
  }
  
  // If animation is disabled or content shouldn't be shown, render directly
  if (animation === 'none') {
    return shouldShow() ? <>{children}</> : null;
  }
  
  // Otherwise, render with animation
  return (
    <AnimatePresence>
      {shouldShow() && (
        <motion.div
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={getVariants()}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
} 