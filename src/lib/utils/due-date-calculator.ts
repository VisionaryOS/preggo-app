/**
 * Utility functions for calculating pregnancy due dates
 */

// Standard pregnancy duration is 40 weeks (280 days) from LMP
const PREGNANCY_DURATION_DAYS = 280;

// Average cycle length - used when calculating from conception date
const AVG_CYCLE_LENGTH_DAYS = 28;

// Ovulation typically occurs 14 days before the next period in a 28-day cycle
const AVG_OVULATION_DAY = 14;

/**
 * Calculate estimated due date based on last menstrual period (LMP)
 * Uses Naegele's rule: EDD = LMP + 280 days (or 40 weeks)
 * 
 * @param lmpDate Date of the first day of the last menstrual period
 * @returns Estimated due date
 */
export function calculateDueDateFromLMP(lmpDate: Date): Date {
  const dueDate = new Date(lmpDate);
  dueDate.setDate(lmpDate.getDate() + PREGNANCY_DURATION_DAYS);
  return dueDate;
}

/**
 * Calculate estimated due date based on conception date
 * Typically 266 days (38 weeks) from conception date
 * 
 * @param conceptionDate Estimated date of conception
 * @returns Estimated due date
 */
export function calculateDueDateFromConception(conceptionDate: Date): Date {
  const dueDate = new Date(conceptionDate);
  // Pregnancy is typically 266 days from conception (280 - 14)
  dueDate.setDate(conceptionDate.getDate() + (PREGNANCY_DURATION_DAYS - AVG_OVULATION_DAY));
  return dueDate;
}

/**
 * Calculate estimated due date based on ultrasound measurements and gestational age
 * 
 * @param ultrasoundDate Date of the ultrasound
 * @param gestationalAgeDays Gestational age in days determined by ultrasound
 * @returns Estimated due date
 */
export function calculateDueDateFromUltrasound(
  ultrasoundDate: Date,
  gestationalAgeDays: number
): Date {
  const dueDate = new Date(ultrasoundDate);
  dueDate.setDate(ultrasoundDate.getDate() + (PREGNANCY_DURATION_DAYS - gestationalAgeDays));
  return dueDate;
}

/**
 * Calculate current gestational age based on LMP
 * 
 * @param lmpDate Date of the first day of the last menstrual period
 * @returns Object containing weeks and days of gestational age
 */
export function calculateGestationalAge(lmpDate: Date): { weeks: number; days: number } {
  const today = new Date();
  const diffTime = today.getTime() - lmpDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  const weeks = Math.floor(diffDays / 7);
  const days = diffDays % 7;
  
  return { weeks, days };
}

/**
 * Calculate trimester based on gestational age in weeks
 * 
 * @param gestationalAgeWeeks Gestational age in weeks
 * @returns Trimester number (1, 2, or 3)
 */
export function calculateTrimester(gestationalAgeWeeks: number): 1 | 2 | 3 {
  if (gestationalAgeWeeks < 13) {
    return 1;
  } else if (gestationalAgeWeeks < 27) {
    return 2;
  } else {
    return 3;
  }
}

/**
 * Format a date to a human-readable string (e.g., "January 1, 2023")
 * 
 * @param date The date to format
 * @returns Formatted date string
 */
export function formatDateToString(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Calculate pregnancy milestones based on due date
 * 
 * @param dueDate Estimated due date
 * @returns Object containing milestone dates
 */
export function calculateMilestones(dueDate: Date): Record<string, Date> {
  const lmpDate = new Date(dueDate);
  lmpDate.setDate(dueDate.getDate() - PREGNANCY_DURATION_DAYS);
  
  const firstTrimesterEnd = new Date(lmpDate);
  firstTrimesterEnd.setDate(lmpDate.getDate() + 7 * 13);
  
  const secondTrimesterEnd = new Date(lmpDate);
  secondTrimesterEnd.setDate(lmpDate.getDate() + 7 * 26);
  
  const viabilityDate = new Date(lmpDate);
  viabilityDate.setDate(lmpDate.getDate() + 7 * 24); // 24 weeks
  
  const fullTermDate = new Date(lmpDate);
  fullTermDate.setDate(lmpDate.getDate() + 7 * 37); // 37 weeks
  
  return {
    lmpDate,
    firstTrimesterEnd,
    secondTrimesterEnd,
    viabilityDate,
    fullTermDate,
    dueDate
  };
}

/**
 * Calculate current pregnancy week based on due date
 * Assumes standard 40-week pregnancy
 * 
 * @param dueDate The estimated due date
 * @returns Current pregnancy week (1-40, or 0 if not yet pregnant)
 */
export function calculatePregnancyWeek(dueDate: Date): number {
  const today = new Date();
  
  // Calculate time difference between due date and today
  const timeDiffToDueDate = dueDate.getTime() - today.getTime();
  const daysToDueDate = Math.ceil(timeDiffToDueDate / (1000 * 60 * 60 * 24));
  
  // Calculate pregnancy week (40 weeks total)
  const pregnancyWeek = 40 - Math.floor(daysToDueDate / 7);
  
  // Return week number, ensuring it's within valid range
  return Math.max(0, Math.min(pregnancyWeek, 40));
} 