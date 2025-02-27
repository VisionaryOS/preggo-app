import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(input: string | number | Date): string {
  const date = new Date(input);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function absoluteUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}${path}`;
}

// Format weeks from today to a due date
export function formatWeeksUntilDueDate(dueDate: string | Date | null): string {
  if (!dueDate) return "Unknown";
  
  const today = new Date();
  const due = new Date(dueDate);
  
  // Calculate the difference in milliseconds
  const diffTime = due.getTime() - today.getTime();
  
  // Calculate the difference in days
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  // Calculate weeks and remaining days
  const weeks = Math.floor(diffDays / 7);
  const days = diffDays % 7;
  
  if (weeks < 0) {
    return "Past due date";
  }
  
  return `${weeks} weeks${days > 0 ? ` and ${days} days` : ""}`;
}

// Search types
export interface SearchResult {
  id: string;
  title: string;
  type: 'tool' | 'lesson';
  path: string;
}

export interface SearchResults {
  tools: SearchResult[];
  lessons: SearchResult[];
}

// Search functionality utility
export async function searchContent(query: string): Promise<SearchResults> {
  // In a real app, this would search the database or API
  // For now, this is a simple client-side search implementation

  if (!query || query.trim().length < 2) {
    return {
      tools: [],
      lessons: []
    };
  }

  const normalizedQuery = query.toLowerCase().trim();

  // Mock search results for tools
  const toolResults: SearchResult[] = [
    { id: 'tool-1', title: 'Contraction Timer', type: 'tool' as const, path: '/tools/contraction-timer' },
    { id: 'tool-2', title: 'Due Date Calculator', type: 'tool' as const, path: '/dashboard/due-date' },
    { id: 'tool-3', title: 'Weight Tracker', type: 'tool' as const, path: '/dashboard/health' },
    { id: 'tool-4', title: 'Baby Name Finder', type: 'tool' as const, path: '/tools/name-finder' },
    { id: 'tool-5', title: 'Hospital Bag Checklist', type: 'tool' as const, path: '/dashboard/shopping' }
  ].filter(item => item.title.toLowerCase().includes(normalizedQuery));

  // Mock search results for lessons
  const lessonResults: SearchResult[] = [
    { id: 'lesson-1', title: 'First Trimester Nutrition', type: 'lesson' as const, path: '/resources/chapters/nutrition-first-trimester' },
    { id: 'lesson-2', title: 'Understanding Fetal Development', type: 'lesson' as const, path: '/resources/chapters/fetal-development' },
    { id: 'lesson-3', title: 'Managing Pregnancy Symptoms', type: 'lesson' as const, path: '/resources/chapters/managing-symptoms' },
    { id: 'lesson-4', title: 'Preparing for Labor', type: 'lesson' as const, path: '/resources/chapters/labor-prep' },
    { id: 'lesson-5', title: 'Newborn Care Basics', type: 'lesson' as const, path: '/resources/chapters/newborn-care' }
  ].filter(item => item.title.toLowerCase().includes(normalizedQuery));

  return {
    tools: toolResults,
    lessons: lessonResults
  };
} 