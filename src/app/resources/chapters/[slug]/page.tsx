'use client';

import React, { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getChapterBySlug, chapters } from '@/data/book-chapters';
import { ChapterViewer } from '@/components/resources/ChapterViewer';

interface ChapterPageProps {
  params: {
    slug: string;
  };
}

// We need this temporary workaround due to the missing react-markdown package
// In a real implementation, you would install the package
const Placeholder = ({ chapter }: { chapter: any }) => (
  <div className="max-w-5xl mx-auto py-6">
    <h1 className="text-3xl font-bold mb-4">{chapter.title}</h1>
    <p className="text-muted-foreground mb-8">{chapter.summary}</p>
    
    <div className="p-4 bg-muted rounded-md mb-8">
      <p className="text-center">
        To fully implement this feature, you need to install react-markdown:
        <br />
        <code className="bg-background px-2 py-1 rounded text-sm">npm install react-markdown</code>
      </p>
    </div>
    
    <div className="border p-6 rounded-md">
      <h2 className="text-xl font-semibold mb-4">Chapter Content Preview</h2>
      <p>This chapter contains {chapter.sections.length} sections:</p>
      <ul className="mt-2 space-y-1">
        {chapter.sections.map((section: any, index: number) => (
          <li key={index} className="font-medium">{section.title}</li>
        ))}
      </ul>
    </div>
  </div>
);

// Loading component
const ChapterLoading = () => (
  <div className="max-w-5xl mx-auto py-6">
    <div className="h-8 w-64 bg-muted animate-pulse rounded mb-4"></div>
    <div className="h-4 w-full bg-muted animate-pulse rounded mb-8"></div>
    
    <div className="space-y-6">
      <div className="h-6 w-48 bg-muted animate-pulse rounded"></div>
      <div className="h-24 w-full bg-muted animate-pulse rounded"></div>
      <div className="h-24 w-full bg-muted animate-pulse rounded"></div>
    </div>
  </div>
);

export default function ChapterPage({ params }: ChapterPageProps) {
  // Unwrap params using React.use()
  const unwrappedParams = React.use(params);
  const chapter = getChapterBySlug(unwrappedParams.slug);

  if (!chapter) {
    notFound();
  }

  // Use this when react-markdown is installed
  return (
    <Suspense fallback={<ChapterLoading />}>
      <ChapterViewer chapter={chapter} />
    </Suspense>
  );
  
  // For now, use the placeholder
  // return <Placeholder chapter={chapter} />;
}

// Remove generateStaticParams from this client component
// We'll create a separate file for this functionality 