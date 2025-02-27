import React from 'react';
import { motion } from 'framer-motion';
import { 
  Wrench, 
  FileText, 
  BookCopy, 
  Info,
  ArrowRight,
  Star
} from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { cn } from '@/lib/utils';

// Define enhanced search item interface 
interface EnhancedSearchItem {
  id: string;
  title: string;
  type: string;
  path: string;
  description?: string;
  tags?: string[];
  icon?: React.ComponentType<{ className?: string }>;
  relevanceScore?: number;
}

interface VisualSearchResultsProps {
  results: EnhancedSearchItem[];
  query: string;
  selectedIndex: number;
  onResultClick: (path: string) => void;
  onResultHover: (index: number) => void;
}

const VisualSearchResults: React.FC<VisualSearchResultsProps> = ({
  results,
  query,
  selectedIndex,
  onResultClick,
  onResultHover
}) => {
  // Group results by type for better organization
  const groupedResults = results.reduce((groups, result) => {
    const type = result.type;
    if (!groups[type]) {
      groups[type] = [];
    }
    groups[type].push(result);
    return groups;
  }, {} as Record<string, EnhancedSearchItem[]>);
  
  // Helper to get appropriate icon for result type
  const getResultIcon = (type: string) => {
    switch (type) {
      case 'tool': return Wrench;
      case 'lesson': return FileText;
      case 'wiki': return BookCopy;
      case 'page': return Info;
      default: return Info;
    }
  };
  
  // Helper to get type label
  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'tool': return 'Tools';
      case 'lesson': return 'Lessons';
      case 'wiki': return 'Wiki';
      case 'page': return 'Page Content';
      default: return 'Other';
    }
  };
  
  // Function to highlight matching text in results
  const highlightMatch = (text: string, query: string) => {
    if (!query || !text) return text;
    
    try {
      const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
      return text.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-900 rounded-sm px-0.5">$1</mark>');
    } catch (e) {
      return text;
    }
  };
  
  // Enhanced search result component with highlighting
  const SearchResult = ({ result, index }: { result: EnhancedSearchItem; index: number }) => {
    const isSelected = selectedIndex === index;
    const ResultIcon = result.icon || getResultIcon(result.type);
    const hasHighRelevance = result.relevanceScore && result.relevanceScore > 80;
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: index * 0.03 }}
        data-index={index}
        className={cn(
          "flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all",
          isSelected ? "bg-primary text-primary-foreground scale-[1.02]" : "hover:bg-muted"
        )}
        onClick={() => onResultClick(result.path)}
        onMouseEnter={() => onResultHover(index)}
      >
        <div className={cn(
          "p-2 rounded-md flex items-center justify-center",
          isSelected ? "bg-primary-foreground/20" : "bg-muted/50"
        )}>
          <ResultIcon className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <div 
              className="font-medium flex-1" 
              dangerouslySetInnerHTML={{ 
                __html: highlightMatch(result.title, query) 
              }} 
            />
            {hasHighRelevance && (
              <Badge variant="secondary" className="flex items-center gap-1 h-5 px-1.5">
                <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                <span className="text-xs">Best match</span>
              </Badge>
            )}
          </div>
          {result.description && (
            <div 
              className={cn(
                "text-sm mt-0.5 line-clamp-2", 
                isSelected
                  ? "text-primary-foreground/70"
                  : "text-muted-foreground"
              )}
              dangerouslySetInnerHTML={{ 
                __html: highlightMatch(result.description, query) 
              }}
            />
          )}
          {result.tags && result.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1.5">
              {result.tags.slice(0, 3).map((tag, i) => (
                <span 
                  key={i}
                  className={cn(
                    "text-[10px] px-1.5 py-0.5 rounded-sm",
                    isSelected 
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "bg-muted-foreground/10 text-muted-foreground"
                  )}
                >
                  {tag}
                </span>
              ))}
              {result.tags.length > 3 && (
                <span className={cn(
                  "text-[10px] px-1.5 py-0.5 rounded-sm flex items-center",
                  isSelected 
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-muted-foreground/10 text-muted-foreground"
                )}>
                  <ArrowRight className="h-2 w-2 mr-0.5" />
                  {result.tags.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>
      </motion.div>
    );
  };
  
  return (
    <div className="p-2 space-y-4">
      {Object.entries(groupedResults).map(([type, items]) => (
        <div key={type} className="space-y-1">
          <div className="text-xs font-medium text-muted-foreground pl-3 pt-2 flex items-center">
            {React.createElement(getResultIcon(type), { className: "h-3 w-3 mr-1.5" })}
            {getTypeLabel(type)} ({items.length})
          </div>
          <div className="space-y-1">
            {items.map((result, groupIndex) => {
              const globalIndex = results.findIndex(r => r.id === result.id);
              return <SearchResult key={result.id} result={result} index={globalIndex} />;
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default VisualSearchResults; 