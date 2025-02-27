'use client';

import React, { Suspense } from 'react';
import { ChaptersList } from '@/components/resources/ChaptersList';

export default function ChaptersPage() {
  return (
    <div>
      <Suspense fallback={<div className="p-8 text-center">Loading chapters...</div>}>
        <ChaptersList />
      </Suspense>
    </div>
  );
} 