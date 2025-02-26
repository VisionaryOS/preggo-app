import { addDays, addWeeks, differenceInDays, differenceInWeeks, parseISO } from 'date-fns'
import { Trimester } from '@/types/pregnancy'

// Standard pregnancy length in weeks
export const PREGNANCY_LENGTH_WEEKS = 40

/**
 * Calculate the due date based on last menstrual period date
 */
export function calculateDueDate(lastPeriodDate: Date | string): Date {
  const lmpDate = typeof lastPeriodDate === 'string' ? parseISO(lastPeriodDate) : lastPeriodDate
  return addDays(addWeeks(lmpDate, PREGNANCY_LENGTH_WEEKS), -7)
}

/**
 * Calculate the current pregnancy week based on last menstrual period date
 */
export function calculateCurrentWeek(lastPeriodDate: Date | string): number {
  const lmpDate = typeof lastPeriodDate === 'string' ? parseISO(lastPeriodDate) : lastPeriodDate
  const currentWeek = differenceInWeeks(new Date(), lmpDate) + 1
  
  // Ensure the week is between 1 and 42 (include post-term)
  return Math.max(1, Math.min(42, currentWeek))
}

/**
 * Calculate the current trimester based on the pregnancy week
 */
export function calculateTrimester(week: number): Trimester {
  if (week <= 13) {
    return 'first'
  } else if (week <= 26) {
    return 'second'
  } else {
    return 'third'
  }
}

/**
 * Calculate the days passed since the first day of the last period
 */
export function calculateDaysPassed(lastPeriodDate: Date | string): number {
  const lmpDate = typeof lastPeriodDate === 'string' ? parseISO(lastPeriodDate) : lastPeriodDate
  return differenceInDays(new Date(), lmpDate)
}

/**
 * Calculate the days remaining until the due date
 */
export function calculateDaysRemaining(dueDate: Date | string): number {
  const dueDateObj = typeof dueDate === 'string' ? parseISO(dueDate) : dueDate
  return differenceInDays(dueDateObj, new Date())
}

/**
 * Convert a due date to the first day of the last menstrual period
 */
export function dueDateToLMP(dueDate: Date | string): Date {
  const dueDateObj = typeof dueDate === 'string' ? parseISO(dueDate) : dueDate
  return addDays(addWeeks(dueDateObj, -PREGNANCY_LENGTH_WEEKS), 7)
}

/**
 * Format a date as YYYY-MM-DD
 */
export function formatDateForDatabase(date: Date): string {
  return date.toISOString().split('T')[0]
} 