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
