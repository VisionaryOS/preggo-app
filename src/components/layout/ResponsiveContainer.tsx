'use client';

import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, HTMLMotionProps } from "framer-motion";
import { ReactNode } from "react";

const containerVariants = cva(
  "w-full mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-300",
  {
    variants: {
      width: {
        default: "max-w-7xl",
        sm: "max-w-screen-sm",
        md: "max-w-screen-md",
        lg: "max-w-screen-lg",
        xl: "max-w-screen-xl",
        full: "max-w-full",
      },
      padding: {
        none: "px-0 sm:px-0 lg:px-0",
        sm: "px-2 sm:px-3 lg:px-4",
        default: "px-4 sm:px-6 lg:px-8",
        lg: "px-6 sm:px-8 lg:px-10",
      },
      spacing: {
        none: "py-0",
        sm: "py-2",
        default: "py-4 sm:py-6 lg:py-8",
        lg: "py-8 sm:py-12 lg:py-16",
        xl: "py-12 sm:py-16 lg:py-24",
      },
    },
    defaultVariants: {
      width: "default",
      padding: "default",
      spacing: "default",
    },
  }
);

type ContainerBaseProps = {
  children: ReactNode;
  animate?: boolean;
  id?: string;
}

export type ResponsiveContainerProps = ContainerBaseProps & 
  VariantProps<typeof containerVariants> & 
  Omit<React.HTMLAttributes<HTMLDivElement>, keyof ContainerBaseProps>;

export function ResponsiveContainer({
  className,
  width,
  padding,
  spacing,
  children,
  animate = false,
  id,
  ...props
}: ResponsiveContainerProps) {
  const containerClasses = cn(containerVariants({ width, padding, spacing }), className);
  
  if (animate) {
    return (
      <motion.div 
        id={id}
        className={containerClasses}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        {...props as HTMLMotionProps<"div">}
      >
        {children}
      </motion.div>
    );
  }
  
  return (
    <div id={id} className={containerClasses} {...props}>
      {children}
    </div>
  );
}

export default ResponsiveContainer; 