import React from 'react';
import { Loader, Database, ArrowRight, Check } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { cn } from '@/lib/utils';

interface SearchProgressProps {
  isSearching: boolean;
  progress: number;
  searchStage: 'indexing' | 'searching' | 'processing' | 'complete' | 'idle';
  totalResults: number;
  searchTime: number;
}

const SearchProgress = ({
  isSearching,
  progress,
  searchStage,
  totalResults,
  searchTime
}: SearchProgressProps) => {
  if (!isSearching && searchStage === 'idle') return null;
  
  return (
    <div className="px-4 py-2 border-t text-xs">
      {searchStage !== 'complete' ? (
        <div className="space-y-1.5">
          <Progress value={progress} className="h-1" />
          <div className="flex justify-between text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Loader className="h-3 w-3 animate-spin" />
              <span>
                {searchStage === 'indexing' && 'Preparing search index...'}
                {searchStage === 'searching' && 'Searching content...'}
                {searchStage === 'processing' && 'Processing results...'}
              </span>
            </div>
            <span>{progress}%</span>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Check className="h-3 w-3 text-green-500" />
            <span>Found {totalResults} results in {searchTime}ms</span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Sources:</span>
            <div className="flex items-center gap-1">
              <div 
                className={cn(
                  "w-2 h-2 rounded-full",
                  totalResults > 0 ? "bg-green-500" : "bg-muted"
                )}
              />
              <span className={totalResults > 0 ? "text-foreground" : "text-muted-foreground"}>
                Main
              </span>
            </div>
            <ArrowRight className="h-3 w-3 text-muted-foreground" />
            <div className="flex items-center gap-1">
              <div 
                className={cn(
                  "w-2 h-2 rounded-full",
                  totalResults > 5 ? "bg-green-500" : "bg-muted"
                )}
              />
              <span className={totalResults > 5 ? "text-foreground" : "text-muted-foreground"}>
                Wiki
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchProgress; 