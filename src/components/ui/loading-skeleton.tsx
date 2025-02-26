'use client';

import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function LoadingSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="w-full py-10">
      <div className="h-8 w-1/3 mx-auto bg-muted/60 rounded-lg animate-pulse mb-8" />
      <div className="h-4 w-1/2 mx-auto bg-muted/60 rounded-lg animate-pulse mb-12" />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array(count).fill(0).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <CardHeader className="p-0">
              <div className="h-28 bg-muted/40 animate-pulse" />
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div className="h-4 bg-muted/60 rounded animate-pulse" />
              <div className="h-4 bg-muted/60 rounded animate-pulse w-2/3" />
              <div className="h-4 bg-muted/60 rounded animate-pulse w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 