'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { Menu, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Define the navigation items type
export type NavItem = {
  title: string;
  href: string;
  description?: string;
  children?: NavItem[];
};

type ResponsiveNavbarProps = {
  items: NavItem[];
  logo?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
  logoHref?: string;
};

export function ResponsiveNavbar({
  items,
  logo,
  actions,
  className,
  logoHref = '/',
}: ResponsiveNavbarProps) {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setIsScrolled(offset > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when path changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-200 border-b',
        isScrolled 
          ? 'bg-background/80 backdrop-blur-md shadow-sm' 
          : 'bg-background',
        className
      )}
    >
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link 
          href={logoHref} 
          className="flex items-center space-x-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md"
          aria-label="Home"
        >
          {logo}
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:space-x-4">
          <NavigationMenu>
            <NavigationMenuList>
              {items.map((item) => {
                // Items with children become dropdowns
                if (item.children?.length) {
                  return (
                    <NavigationMenuItem key={item.title}>
                      <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                          {item.children.map((child) => (
                            <li key={child.title}>
                              <NavigationMenuLink asChild>
                                <Link
                                  href={child.href}
                                  className={cn(
                                    "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                                    pathname === child.href
                                      ? "bg-accent/50 text-accent-foreground"
                                      : "text-foreground/70"
                                  )}
                                >
                                  <div className="text-sm font-medium leading-none">
                                    {child.title}
                                  </div>
                                  {child.description && (
                                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                      {child.description}
                                    </p>
                                  )}
                                </Link>
                              </NavigationMenuLink>
                            </li>
                          ))}
                        </ul>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  );
                }

                // Regular items are simple links
                return (
                  <NavigationMenuItem key={item.title}>
                    <Link href={item.href} legacyBehavior passHref>
                      <NavigationMenuLink
                        className={cn(
                          navigationMenuTriggerStyle(),
                          pathname === item.href
                            ? "bg-accent text-accent-foreground"
                            : "text-foreground/70 hover:text-foreground"
                        )}
                      >
                        {item.title}
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                );
              })}
            </NavigationMenuList>
          </NavigationMenu>
          {actions && <div className="ml-4">{actions}</div>}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          {actions && (
            <div className="mr-2">{actions}</div>
          )}

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Open menu"
                className="relative"
              >
                <Menu className={cn("h-5 w-5", isOpen ? "opacity-0" : "opacity-100")} />
                <X className={cn(
                  "h-5 w-5 absolute",
                  isOpen ? "opacity-100" : "opacity-0"
                )} />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:w-80 pt-12">
              <SheetHeader>
                <SheetTitle className="text-left">Navigation</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-4 mt-8">
                {items.map((item) => {
                  if (item.children?.length) {
                    return (
                      <MobileNavGroup 
                        key={item.title} 
                        item={item} 
                        pathname={pathname}
                      />
                    );
                  }
                  
                  return (
                    <Link
                      key={item.title}
                      href={item.href}
                      className={cn(
                        "px-2 py-2 text-lg font-medium rounded-md transition-colors",
                        pathname === item.href
                          ? "bg-accent text-accent-foreground"
                          : "hover:bg-accent/50"
                      )}
                      onClick={() => setIsOpen(false)}
                    >
                      {item.title}
                    </Link>
                  );
                })}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

// Helper component for mobile dropdown navigation
function MobileNavGroup({ item, pathname }: { item: NavItem; pathname: string }) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Automatically open the group if a child is active
  useEffect(() => {
    if (item.children?.some(child => child.href === pathname)) {
      setIsOpen(true);
    }
  }, [item.children, pathname]);

  return (
    <div className="space-y-2">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-2 py-2 text-lg font-medium rounded-md transition-colors hover:bg-accent/50"
        aria-expanded={isOpen}
      >
        <span>{item.title}</span>
        <ChevronDown
          className={cn(
            "ml-2 h-4 w-4 transition-transform duration-200",
            isOpen ? "rotate-180" : "rotate-0"
          )}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden pl-4"
          >
            <div className="flex flex-col gap-2 border-l border-border pl-4 pt-2 pb-2">
              {item.children?.map(child => (
                <Link
                  key={child.title}
                  href={child.href}
                  className={cn(
                    "px-2 py-2 rounded-md transition-colors text-base",
                    pathname === child.href
                      ? "bg-accent text-accent-foreground"
                      : "hover:bg-accent/50 text-foreground/70"
                  )}
                >
                  {child.title}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 