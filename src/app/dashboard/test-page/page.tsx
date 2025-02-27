'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TestPage() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Test Page</h1>
          <p className="text-muted-foreground mt-2">
            This is a test page to verify the layout structure
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Layout Test</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              This page should be displayed within the dashboard layout, with the navbar menu on the left 
              and the chatbot on the right still visible. Only this main content area should change when 
              navigating between pages.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 