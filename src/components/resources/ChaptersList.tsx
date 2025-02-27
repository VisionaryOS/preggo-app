'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { tableOfContents, chapters, getChapterBySlug } from '@/data/book-chapters';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  ChevronRight, 
  Clock, 
  FileText, 
  ListChecks, 
  GraduationCap,
  AlertTriangle
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function ChaptersList() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Client-side only logic
    try {
      // Verify the data is available
      if (!tableOfContents || tableOfContents.length === 0) {
        setError('No chapters found. Please check your data.');
      } else {
        setIsLoaded(true);
      }
    } catch (err) {
      console.error('Error loading chapters:', err);
      setError('Error loading chapters. Please try again later.');
    }
  }, []);
  
  // Helper function to get section count for a chapter
  const getSectionCount = (slug: string): number => {
    try {
      const chapter = getChapterBySlug(slug);
      return chapter?.sections.length || 0;
    } catch (err) {
      console.error(`Error getting section count for chapter ${slug}:`, err);
      return 0;
    }
  };

  // Error state
  if (error) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4 md:px-8">
        <div className="rounded-md bg-destructive/10 p-8 flex flex-col items-center justify-center">
          <AlertTriangle className="h-10 w-10 text-destructive mb-4" />
          <h2 className="text-xl font-semibold mb-2">Something Went Wrong</h2>
          <p className="text-center text-muted-foreground">{error}</p>
          <Button className="mt-4" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // If not loaded yet, return early
  if (!isLoaded) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4 md:px-8">
        <div className="animate-pulse space-y-6">
          <div className="h-40 bg-muted/50 rounded-xl"></div>
          <div className="h-20 bg-muted/50 rounded-xl"></div>
          <div className="h-8 w-40 bg-muted/50 rounded-md"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-64 bg-muted/50 rounded-md"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Normal render
  return (
    <div className="max-w-7xl mx-auto py-8 px-4 md:px-8">
      {/* Course Hero Section */}
      <div className="relative mb-16 overflow-hidden rounded-xl bg-gradient-to-br from-primary/10 via-secondary/10 to-background p-8 md:p-12">
        <div className="relative z-10 max-w-2xl">
          <Badge variant="secondary" className="mb-4">
            <GraduationCap className="h-3 w-3 mr-1" />
            Digital Course Material
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Your Pregnancy Journey</h1>
          <p className="text-muted-foreground md:text-lg">
            A comprehensive guide to understanding pregnancy, from conception to birth. 
            Explore our expertly curated chapters to learn more about your journey into motherhood.
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            <div className="bg-background/80 backdrop-blur-sm px-3 py-1.5 rounded-md flex items-center text-sm">
              <BookOpen className="h-4 w-4 mr-2 text-primary" />
              <span>{tableOfContents.length} Chapters</span>
            </div>
            <div className="bg-background/80 backdrop-blur-sm px-3 py-1.5 rounded-md flex items-center text-sm">
              <Clock className="h-4 w-4 mr-2 text-primary" />
              <span>25-30 mins per chapter</span>
            </div>
            <div className="bg-background/80 backdrop-blur-sm px-3 py-1.5 rounded-md flex items-center text-sm">
              <FileText className="h-4 w-4 mr-2 text-primary" />
              <span>Expert content</span>
            </div>
          </div>
        </div>
        {/* Decorative blobs */}
        <div className="absolute -top-24 -right-24 w-72 h-72 blob opacity-10"></div>
        <div className="absolute bottom-0 left-1/2 w-32 h-32 blob opacity-5 translate-y-1/2"></div>
      </div>
      
      {/* Course Progress Summary */}
      <div className="mb-10 bg-muted/30 rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
          <div className="flex-1">
            <h2 className="text-lg font-medium mb-1">Your Reading Progress</h2>
            <p className="text-sm text-muted-foreground">Continue where you left off or explore new chapters</p>
          </div>
          <div className="flex-1 flex items-center gap-3">
            <div className="h-3 flex-1 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: '10%' }}></div>
            </div>
            <span className="text-sm font-medium">10% Complete</span>
          </div>
          <Button className="md:self-end">
            <ListChecks className="h-4 w-4 mr-2" />
            Resume Learning
          </Button>
        </div>
      </div>
      
      {/* Course Content */}
      <h2 className="text-2xl font-semibold mb-6">Course Content</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tableOfContents.map((chapter) => (
          <Link key={chapter.id} href={`/resources/chapters/${chapter.slug}`} className="group">
            <Card className={cn(
              "h-full overflow-hidden transition-all duration-300 hover:shadow-md",
              // Add a left border accent on first card as it's "in progress"
              chapter.id === 1 ? "border-l-4 border-l-primary" : ""
            )}>
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <div className="bg-primary/10 rounded-full p-2 flex items-center justify-center w-8 h-8">
                    <BookOpen className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex items-center gap-2">
                    {chapter.id === 1 && (
                      <Badge variant="outline" className="text-xs bg-primary/5">
                        In Progress
                      </Badge>
                    )}
                    <span className="text-sm font-medium">Chapter {chapter.id}</span>
                  </div>
                </div>
                <CardTitle className="group-hover:text-primary transition-colors">
                  {chapter.title}
                </CardTitle>
                <CardDescription className="line-clamp-2">
                  {chapter.summary}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-0">
                <div className="flex items-center text-sm text-muted-foreground gap-3">
                  <span className="flex items-center">
                    <Clock className="h-3.5 w-3.5 mr-1" />
                    25 mins
                  </span>
                  <span className="flex items-center">
                    <FileText className="h-3.5 w-3.5 mr-1" />
                    {getSectionCount(chapter.slug)} sections
                  </span>
                </div>
              </CardContent>
              <CardFooter className="pt-4 pb-4">
                <Button 
                  variant="ghost" 
                  className="w-full justify-between group-hover:bg-primary/5 transition-colors"
                >
                  <span>{chapter.id === 1 ? "Continue Reading" : "Start Chapter"}</span>
                  <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
} 