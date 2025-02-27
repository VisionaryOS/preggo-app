'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Chapter } from '@/data/book-chapter-template';
import { getAdjacentChapters } from '@/data/book-chapters';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  ChevronLeft, 
  ChevronRight, 
  ExternalLink, 
  BookOpen, 
  Menu,
  Bookmark,
  Share2,
  ListChecks
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { EnhancedMarkdown } from './EnhancedMarkdown';

interface ChapterViewerProps {
  chapter: Chapter;
}

export function ChapterViewer({ chapter }: ChapterViewerProps) {
  const [activeSection, setActiveSection] = useState<string>(chapter.sections[0].key);
  const [readingProgress, setReadingProgress] = useState(0);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const { prev, next } = getAdjacentChapters(chapter.id);
  
  const activeContent = chapter.sections.find(section => section.key === activeSection);

  // Handle scroll for reading progress
  useEffect(() => {
    const updateReadingProgress = () => {
      if (contentRef.current) {
        const element = contentRef.current;
        const totalHeight = element.scrollHeight - element.clientHeight;
        const windowScrollTop = element.scrollTop;
        if (totalHeight) {
          setReadingProgress(Number((windowScrollTop / totalHeight).toFixed(2)) * 100);
        }
      }
    };

    const contentElement = contentRef.current;
    if (contentElement) {
      contentElement.addEventListener('scroll', updateReadingProgress);
      return () => {
        contentElement.removeEventListener('scroll', updateReadingProgress);
      };
    }
  }, []);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Top Progress Bar */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm">
        <Progress value={readingProgress} className="h-1 w-full" />
      </div>

      {/* Chapter Header - Desktop */}
      <div className="px-4 py-4 border-b hidden md:block">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">{chapter.title}</h1>
            <p className="text-muted-foreground text-sm mt-1">Chapter {chapter.id}</p>
          </div>
          
          <div className="flex space-x-3">
            <Button variant="outline" size="icon" title="Save bookmark">
              <Bookmark className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" title="Share chapter">
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" title="Mark as complete">
              <ListChecks className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="px-4 py-3 border-b md:hidden bg-background/80 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}>
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold truncate">{chapter.title}</h1>
          <Button variant="outline" size="icon">
            <Bookmark className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Section Navigation Sidebar - Desktop */}
        <div className="w-72 border-r hidden md:block overflow-y-auto thin-scrollbar">
          <div className="p-4">
            <h3 className="font-medium mb-3 flex items-center gap-2 text-sm">
              <BookOpen className="h-4 w-4" />
              Chapter Sections
            </h3>
            <div className="space-y-1">
              {chapter.sections.map((section) => (
                <button
                  key={section.key}
                  onClick={() => setActiveSection(section.key)}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
                    activeSection === section.key
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  )}
                >
                  {section.title}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Sidebar (slide out) */}
        {mobileSidebarOpen && (
          <motion.div 
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileSidebarOpen(false)}
          >
            <motion.div 
              className="fixed inset-y-0 left-0 w-3/4 max-w-xs bg-background border-r shadow-lg"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b flex items-center justify-between">
                <h3 className="font-medium">Chapter Sections</h3>
                <Button variant="ghost" size="sm" onClick={() => setMobileSidebarOpen(false)}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </div>
              <div className="p-4 space-y-1">
                {chapter.sections.map((section) => (
                  <button
                    key={section.key}
                    onClick={() => {
                      setActiveSection(section.key);
                      setMobileSidebarOpen(false);
                    }}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
                      activeSection === section.key
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    )}
                  >
                    {section.title}
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
        
        {/* Main Content */}
        <div 
          ref={contentRef} 
          className="flex-1 overflow-y-auto thin-scrollbar pb-20"
        >
          {activeContent && (
            <div className="max-w-4xl mx-auto px-4 md:px-8 py-6 md:py-10">
              <h2 className="text-2xl font-semibold mb-6">{activeContent.title}</h2>
              <EnhancedMarkdown content={activeContent.content.trim()} />
              
              {/* Images */}
              {chapter.images && chapter.images.length > 0 && (
                <div className="mt-10 space-y-6">
                  <h3 className="text-xl font-semibold border-b pb-2">Illustrations</h3>
                  <div className="grid grid-cols-1 gap-8">
                    {chapter.images.map((image, index) => {
                      // Choose an appropriate emoji based on the image alt text or description
                      let emoji = '📷'; // Default camera emoji
                      
                      // Determine better emoji based on alt text
                      const alt = image.alt.toLowerCase();
                      if (alt.includes('baby') || alt.includes('infant')) emoji = '👶';
                      else if (alt.includes('food') || alt.includes('nutrition')) emoji = '🥗';
                      else if (alt.includes('exercise') || alt.includes('fitness')) emoji = '🏃‍♀️';
                      else if (alt.includes('sleep')) emoji = '😴';
                      else if (alt.includes('heart') || alt.includes('health')) emoji = '❤️';
                      else if (alt.includes('mother') || alt.includes('pregnant')) emoji = '🤰';
                      else if (alt.includes('diagram') || alt.includes('chart')) emoji = '📊';
                      
                      return (
                        <Card key={index} className="overflow-hidden bg-secondary/5 border-0 shadow-sm">
                          <div className="relative h-64 md:h-80 w-full">
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted/30">
                              <div className="text-[80px] mb-4">{emoji}</div>
                              <p className="text-sm text-muted-foreground px-4 text-center">
                                {image.alt}
                              </p>
                            </div>
                          </div>
                          {image.caption && (
                            <CardContent className="py-3 bg-secondary/5">
                              <p className="text-sm text-muted-foreground">{image.caption}</p>
                            </CardContent>
                          )}
                        </Card>
                      );
                    })}
                  </div>
                </div>
              )}
              
              {/* Related Resources */}
              {chapter.relatedResources && chapter.relatedResources.length > 0 && (
                <div className="mt-10 bg-muted/30 rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-4">Related Resources</h3>
                  <ul className="space-y-3">
                    {chapter.relatedResources.map((resource, index) => (
                      <li key={index} className="bg-background rounded-md p-3 shadow-sm">
                        <Link 
                          href={resource.url}
                          className="flex items-center gap-2 text-primary hover:underline font-medium"
                          target={resource.type === 'external' ? '_blank' : undefined}
                          rel={resource.type === 'external' ? 'noopener noreferrer' : undefined}
                        >
                          {resource.title}
                          {resource.type === 'external' && <ExternalLink className="h-3 w-3" />}
                        </Link>
                        <span className="text-xs text-muted-foreground block mt-1 capitalize">
                          {resource.type}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Chapter Navigation */}
              <div className="flex justify-between mt-14 pt-6 border-t">
                {prev ? (
                  <Link href={`/resources/chapters/${prev.slug}`}>
                    <Button variant="outline" className="gap-1">
                      <ChevronLeft className="h-4 w-4" />
                      <span className="hidden sm:inline">Previous:</span> {prev.title}
                    </Button>
                  </Link>
                ) : (
                  <div></div>
                )}
                
                {next ? (
                  <Link href={`/resources/chapters/${next.slug}`}>
                    <Button variant="outline" className="gap-1">
                      <span className="hidden sm:inline">Next:</span> {next.title}
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Link>
                ) : (
                  <div></div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 