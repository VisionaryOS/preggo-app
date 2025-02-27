import React from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  Filter,
  Check,
  X,
  Crown,
  BookOpen,
  Tag,
  Hash,
  Settings
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { cn } from '@/lib/utils';

interface FilterOption {
  id: string;
  label: string;
  count: number;
  icon?: React.ComponentType<{ className?: string }>;
}

interface FilterGroup {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  filters: FilterOption[];
}

interface SearchFiltersProps {
  activeFilters: string[];
  toggleFilter: (filter: string) => void;
  clearFilters: () => void;
  filterGroups: FilterGroup[];
  totalResults: number;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  activeFilters,
  toggleFilter,
  clearFilters,
  filterGroups,
  totalResults
}) => {
  const hasActiveFilters = activeFilters.length > 0;
  
  return (
    <div className="border-t mb-1">
      <div className="p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filters</span>
          {totalResults > 0 && (
            <Badge variant="outline" className="h-5 px-1.5 text-xs">
              {totalResults} results
            </Badge>
          )}
        </div>
        
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs hover:bg-muted flex items-center gap-1"
            onClick={clearFilters}
          >
            <X className="h-3 w-3" />
            Clear all
          </Button>
        )}
      </div>
      
      <div className="pb-2 px-3">
        <div className="grid grid-cols-2 gap-3">
          {filterGroups.map((group) => (
            <div key={group.title} className="bg-muted/50 rounded-lg p-2 space-y-1.5">
              <div className="flex items-center gap-1.5 pl-1 pb-1">
                <group.icon className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs font-medium">{group.title}</span>
              </div>
              
              <div className="grid grid-cols-1 gap-1">
                {group.filters.map(filter => (
                  <Badge
                    key={filter.id}
                    variant={activeFilters.includes(filter.id) ? "default" : "outline"}
                    className={cn(
                      "cursor-pointer flex items-center justify-between px-2 py-1 h-auto",
                      filter.count === 0 && "opacity-50 pointer-events-none"
                    )}
                    onClick={() => filter.count > 0 && toggleFilter(filter.id)}
                  >
                    <div className="flex items-center gap-1.5">
                      {filter.icon && <filter.icon className="h-3 w-3" />}
                      <span>{filter.label}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs opacity-70">{filter.count}</span>
                      {activeFilters.includes(filter.id) && (
                        <Check className="h-3 w-3" />
                      )}
                    </div>
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mx-3 py-2 border-t border-dashed flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Settings className="h-3 w-3" />
          <span>Advanced search options</span>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-7 px-2 text-xs"
        >
          Configure
        </Button>
      </div>
    </div>
  );
};

export default SearchFilters; 