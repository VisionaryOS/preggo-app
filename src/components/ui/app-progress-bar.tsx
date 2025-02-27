'use client';

import { AppProgressBar as NextProgressBar } from 'next-nprogress-bar';

export function AppProgressBar() {
  return (
    <NextProgressBar
      height="2px"
      color="hsl(var(--primary))"
      options={{ showSpinner: false }}
      shallowRouting
    />
  );
} 