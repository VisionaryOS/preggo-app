import { chapters } from '@/data/book-chapters';

// Generate static params for all known chapters
export async function generateStaticParams() {
  return chapters.map((chapter) => ({
    slug: chapter.slug,
  }));
} 