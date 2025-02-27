import React from 'react';
import { Sliders, Calendar, Search, Info } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SearchOptionsProps {
  relevanceThreshold: number;
  setRelevanceThreshold: (value: number) => void;
  fuzzyMatching: boolean;
  setFuzzyMatching: (value: boolean) => void;
  searchScope: 'all' | 'current' | 'recent';
  setSearchScope: (scope: 'all' | 'current' | 'recent') => void;
  searchTimeframe: 'anytime' | 'today' | 'week' | 'month';
  setSearchTimeframe: (timeframe: 'anytime' | 'today' | 'week' | 'month') => void;
}

const SearchOptions = ({
  relevanceThreshold,
  setRelevanceThreshold,
  fuzzyMatching,
  setFuzzyMatching,
  searchScope,
  setSearchScope,
  searchTimeframe,
  setSearchTimeframe
}: SearchOptionsProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8 gap-1.5 px-2.5 flex-shrink-0 bg-background hover:bg-muted"
        >
          <Sliders className="h-3.5 w-3.5" />
          <span className="text-xs">Advanced</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent side="bottom" align="end" className="w-80 p-4">
        <div className="space-y-4">
          <h4 className="font-medium text-sm">Search Options</h4>
          
          <div className="space-y-3">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="relevance" className="text-xs">Relevance Threshold</Label>
                <span className="text-xs text-muted-foreground">{relevanceThreshold}%</span>
              </div>
              <Slider 
                id="relevance"
                min={0} 
                max={100} 
                step={10}
                value={[relevanceThreshold]} 
                onValueChange={(value) => setRelevanceThreshold(value[0])} 
              />
              <div className="flex justify-between text-[10px] text-muted-foreground pt-1">
                <span>Broader results</span>
                <span>Exact matches</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="fuzzy-matching" className="text-xs">Fuzzy Matching</Label>
                <p className="text-[10px] text-muted-foreground">Allow for slight spelling errors</p>
              </div>
              <Switch 
                id="fuzzy-matching" 
                checked={fuzzyMatching}
                onCheckedChange={setFuzzyMatching}
              />
            </div>
            
            <div className="space-y-1.5">
              <Label htmlFor="search-scope" className="text-xs">Search Scope</Label>
              <Select value={searchScope} onValueChange={(value: any) => setSearchScope(value)}>
                <SelectTrigger id="search-scope" className="text-xs h-8">
                  <SelectValue placeholder="Select scope" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="text-xs">
                    <div className="flex items-center gap-2">
                      <Search className="h-3.5 w-3.5" />
                      <span>All content</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="current" className="text-xs">
                    <div className="flex items-center gap-2">
                      <Info className="h-3.5 w-3.5" />
                      <span>Current page</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="recent" className="text-xs">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>Recently viewed</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-1.5">
              <Label htmlFor="search-timeframe" className="text-xs">Timeframe</Label>
              <Select value={searchTimeframe} onValueChange={(value: any) => setSearchTimeframe(value)}>
                <SelectTrigger id="search-timeframe" className="text-xs h-8">
                  <SelectValue placeholder="Select timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="anytime" className="text-xs">Anytime</SelectItem>
                  <SelectItem value="today" className="text-xs">Today</SelectItem>
                  <SelectItem value="week" className="text-xs">Past week</SelectItem>
                  <SelectItem value="month" className="text-xs">Past month</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default SearchOptions; 