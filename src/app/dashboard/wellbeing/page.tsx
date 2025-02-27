'use client';

import React from 'react';
import WellbeingSuite from '@/components/wellbeing/WellbeingSuite';

export default function WellbeingPage() {
  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-6">Wellbeing Suite</h1>
      <WellbeingSuite />
    </div>
  );
} 