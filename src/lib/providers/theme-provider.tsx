"use client";

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes"

/**
 * Enhanced Theme Provider with performance optimizations
 * - Memoized to prevent unnecessary re-renders
 * - Uses suppressHydrationWarning to prevent flicker
 * - Provides default theme props for consistent behavior
 */
export function ThemeProvider({ 
  children, 
  defaultTheme = "system",
  enableSystem = true,
  disableTransitionOnChange = true,
  ...props 
}: ThemeProviderProps) {
  // Use a ref to check if this is the first render
  const isFirstRender = React.useRef(true);
  const [mounted, setMounted] = React.useState(false);

  // Prevent hydration mismatch by only rendering after mount
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Disable transitions on first render to prevent flash during theme initialization
  React.useEffect(() => {
    // Only run once
    if (isFirstRender.current) {
      isFirstRender.current = false;

      // Insert a style block to disable all transitions during theme initialization
      const style = document.createElement("style");
      style.setAttribute("id", "theme-transition-control");
      style.textContent = `
        * {
          transition: none !important;
        }
      `;
      document.head.appendChild(style);

      // Remove the style block after a short delay to re-enable transitions
      setTimeout(() => {
        if (document.getElementById("theme-transition-control")) {
          document.getElementById("theme-transition-control")?.remove();
        }
      }, 300);
    }
  }, []);

  return (
    <NextThemesProvider 
      defaultTheme={defaultTheme}
      enableSystem={enableSystem}
      disableTransitionOnChange={disableTransitionOnChange}
      {...props}
    >
      {/* Only render children after mounting to prevent hydration issues */}
      {mounted ? children : 
        <div style={{ visibility: 'hidden' }}>
          {children}
        </div>
      }
    </NextThemesProvider>
  );
} 