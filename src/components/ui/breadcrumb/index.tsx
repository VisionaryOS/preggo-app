'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

type BreadcrumbItemProps = {
  href: string;
  label: string;
  isLast?: boolean;
};

const BreadcrumbItem = ({ href, label, isLast }: BreadcrumbItemProps) => {
  return (
    <li className="flex items-center text-sm">
      {!isLast ? (
        <>
          <Link 
            href={href} 
            className="hover:text-primary transition-colors text-muted-foreground"
          >
            {label}
          </Link>
          <ChevronRight className="h-3.5 w-3.5 mx-1 text-muted-foreground" />
        </>
      ) : (
        <span className="text-foreground font-medium">{label}</span>
      )}
    </li>
  );
};

// Route to readable name mapping
const routeMapping: Record<string, string> = {
  dashboard: 'Dashboard',
  weekly: 'Weekly Journey',
  'due-date': 'Due Date',
  appointments: 'Appointments',
  todo: 'To-Do List',
  shopping: 'Shopping',
  wellbeing: 'Wellbeing',
  health: 'Health',
  nutrition: 'Nutrition',
  baby: 'Baby Development',
  wiki: 'Pregnancy Wiki',
};

export function Breadcrumb() {
  const pathname = usePathname();
  
  // Parse the path segments
  const segments = pathname
    .split('/')
    .filter(Boolean);
  
  // Create breadcrumb items - skip the dashboard segment since we add it manually
  const breadcrumbItems = segments
    .filter((segment, index) => !(index === 0 && segment === 'dashboard'))
    .map((segment, index, filteredSegments) => {
      // Reconstruct the href based on the original segments
      let segmentIndex = segments.indexOf(segment);
      const href = `/${segments.slice(0, segmentIndex + 1).join('/')}`;
      const label = routeMapping[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
      const isLast = index === filteredSegments.length - 1;
      
      return { href, label, isLast };
    });
  
  // For dashboard page, show only the Dashboard breadcrumb
  if (pathname === '/dashboard') {
    return (
      <nav className="py-2 px-4 border-b bg-muted/30">
        <ol className="flex items-center">
          <li className="flex items-center text-sm">
            <span className="text-foreground font-medium flex items-center">
              <Home className="h-3.5 w-3.5 mr-1" />
              Dashboard
            </span>
          </li>
        </ol>
      </nav>
    );
  }
  
  return (
    <nav className="py-2 px-4 border-b bg-muted/30">
      <ol className="flex items-center">
        <li className="flex items-center text-sm">
          <Link 
            href="/dashboard" 
            className="hover:text-primary transition-colors text-muted-foreground flex items-center"
          >
            <Home className="h-3.5 w-3.5 mr-1" />
            Dashboard
          </Link>
          {breadcrumbItems.length > 0 && (
            <ChevronRight className="h-3.5 w-3.5 mx-1 text-muted-foreground" />
          )}
        </li>
        
        {breadcrumbItems.map((item, index) => (
          <BreadcrumbItem 
            key={item.href} 
            href={item.href}
            label={item.label}
            isLast={item.isLast}
          />
        ))}
      </ol>
    </nav>
  );
} 