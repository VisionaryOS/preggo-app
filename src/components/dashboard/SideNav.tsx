'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  CalendarDays, 
  ListTodo, 
  Settings, 
  UserCircle, 
  FileText, 
  ChevronLeft, 
  ChevronRight, 
  Home,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Appointments', href: '/dashboard/appointments', icon: CalendarDays },
  { name: 'Tasks', href: '/dashboard/tasks', icon: ListTodo },
  { name: 'Notes', href: '/dashboard/notes', icon: FileText },
  { name: 'Profile', href: '/profile', icon: UserCircle },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export function SideNav() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const { signOut } = useAuth();

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <motion.div 
      className={cn(
        "h-screen border-r flex flex-col bg-background transition-width duration-300",
        collapsed ? "w-[80px]" : "w-[240px]"
      )}
      animate={{ width: collapsed ? 80 : 240 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between p-4 border-b">
        {!collapsed && (
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">👶</span>
            <span className="font-bold text-xl text-primary">PregnancyPlus</span>
          </Link>
        )}
        {collapsed && (
          <Link href="/" className="flex items-center justify-center w-full">
            <span className="text-2xl">👶</span>
          </Link>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          className={cn("ml-auto", collapsed && "mx-auto")}
          onClick={toggleCollapsed}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </div>

      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link 
                href={item.href}
                className={cn(
                  "flex items-center gap-2 p-2 rounded-md transition-colors",
                  "hover:bg-accent hover:text-accent-foreground",
                  pathname === item.href ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                  collapsed && "justify-center"
                )}
              >
                <item.icon size={20} />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t mt-auto">
        <Button 
          variant="ghost" 
          className={cn(
            "w-full flex items-center gap-2 text-muted-foreground",
            collapsed && "justify-center"
          )}
          onClick={handleSignOut}
        >
          <LogOut size={20} />
          {!collapsed && <span>Sign Out</span>}
        </Button>
      </div>
    </motion.div>
  );
} 