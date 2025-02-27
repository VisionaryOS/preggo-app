/**
 * BOOK CHAPTERS INDEX FILE
 * 
 * This file serves as the central registry for all book chapters.
 * 
 * Instructions for AI agent:
 * 1. After creating your chapter file(s) based on the template,
 *    import them below and add them to the `chapters` array
 * 2. Maintain the existing imports and structure
 * 3. Export any helper functions for filtering and organizing chapters
 */

import { Chapter } from './book-chapter-template';

// Import all chapter files here
import chapter1 from './chapter-1';
// import chapter2 from './chapter-2';
// Add more imports as needed...

/**
 * The complete collection of book chapters
 * 
 * Note for AI agent: Add your chapter imports to this array
 */
export const chapters: Chapter[] = [
  chapter1,
  // chapter2,
  // Add more chapters here...
];

/**
 * Helper functions for working with chapters
 */

// Get a chapter by ID
export const getChapterById = (id: number): Chapter | undefined => {
  return chapters.find(chapter => chapter.id === id);
};

// Get a chapter by slug
export const getChapterBySlug = (slug: string): Chapter | undefined => {
  return chapters.find(chapter => chapter.slug === slug);
};

// Get chapters by trimester
export const getChaptersByTrimester = (trimester: 1 | 2 | 3 | 'postpartum'): Chapter[] => {
  return chapters.filter(chapter => chapter.trimester === trimester);
};

// Get chapters by week
export const getChaptersByWeek = (week: number): Chapter[] => {
  return chapters.filter(chapter => 
    typeof chapter.week === 'number' 
      ? chapter.week === week 
      : Array.isArray(chapter.week) && chapter.week.includes(week)
  );
};

// Get chapters by tag
export const getChaptersByTag = (tag: string): Chapter[] => {
  return chapters.filter(chapter => chapter.tags.includes(tag));
};

// Search chapters by keyword (searches in title, summary, and sections)
export const searchChapters = (keyword: string): Chapter[] => {
  const lowercaseKeyword = keyword.toLowerCase();
  return chapters.filter(chapter => 
    chapter.title.toLowerCase().includes(lowercaseKeyword) ||
    chapter.summary.toLowerCase().includes(lowercaseKeyword) ||
    chapter.sections.some(section => 
      section.title.toLowerCase().includes(lowercaseKeyword) ||
      section.content.toLowerCase().includes(lowercaseKeyword)
    )
  );
};

// Get next and previous chapters (for navigation)
export const getAdjacentChapters = (currentId: number): { prev?: Chapter; next?: Chapter } => {
  const currentIndex = chapters.findIndex(chapter => chapter.id === currentId);
  if (currentIndex === -1) return {};
  
  return {
    prev: currentIndex > 0 ? chapters[currentIndex - 1] : undefined,
    next: currentIndex < chapters.length - 1 ? chapters[currentIndex + 1] : undefined
  };
};

// Export a simple table of contents
export const tableOfContents = chapters.map(chapter => ({
  id: chapter.id,
  title: chapter.title,
  slug: chapter.slug,
  summary: chapter.summary
}));

export default chapters; 