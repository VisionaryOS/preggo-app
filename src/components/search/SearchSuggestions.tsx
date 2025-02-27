import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, History, Clock } from 'lucide-react';
import { SearchItem } from '@/store/search-store';
import { cn } from '@/lib/utils';

interface SearchSuggestionsProps {
  recentSearches: string[];
  trendingSearches: string[];
  onSuggestionClick: (query: string) => void;
  onClearRecent: () => void;
}

const SearchSuggestions = ({
  recentSearches,
  trendingSearches,
  onSuggestionClick,
  onClearRecent
}: SearchSuggestionsProps) => {
  return (
    <div className="p-4 space-y-4">
      {recentSearches.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium text-muted-foreground flex items-center">
              <History className="h-3.5 w-3.5 mr-1.5" />
              Recent Searches
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs hover:bg-muted"
              onClick={onClearRecent}
            >
              Clear
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((query, index) => (
              <Badge
                key={`recent-${index}`}
                variant="secondary"
                className="cursor-pointer hover:bg-secondary/80 flex items-center"
                onClick={() => onSuggestionClick(query)}
              >
                <Clock className="h-3 w-3 mr-1.5 opacity-70" />
                {query}
              </Badge>
            ))}
          </div>
        </div>
      )}
      
      {trendingSearches.length > 0 && (
        <div>
          <div className="text-sm font-medium text-muted-foreground flex items-center mb-2">
            <Sparkles className="h-3.5 w-3.5 mr-1.5" />
            Trending Searches
          </div>
          <div className="flex flex-wrap gap-2">
            {trendingSearches.map((query, index) => (
              <Badge
                key={`trending-${index}`}
                variant="outline"
                className={cn(
                  "cursor-pointer hover:bg-accent flex items-center",
                  index === 0 && "bg-primary/10 border-primary/20"
                )}
                onClick={() => onSuggestionClick(query)}
              >
                {index === 0 && <Sparkles className="h-3 w-3 mr-1.5 text-primary" />}
                {query}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchSuggestions; 