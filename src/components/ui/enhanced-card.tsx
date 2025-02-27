'use client';

import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { VariantProps, cva } from "class-variance-authority";
import { Loader2, AlertCircle } from "lucide-react";
import { motion, HTMLMotionProps } from "framer-motion";
import { ReactNode, forwardRef } from "react";

const cardVariants = cva(
  "transition-all duration-200",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground",
        outline: "bg-transparent border border-border",
        ghost: "border-none shadow-none bg-transparent",
        elevated: "shadow-lg hover:shadow-xl",
        interactive: "hover:shadow-md cursor-pointer",
      },
      size: {
        sm: "p-2",
        md: "p-4",
        lg: "p-6",
      },
      state: {
        default: "",
        loading: "opacity-80 pointer-events-none",
        error: "border-destructive",
        success: "border-green-500",
        disabled: "opacity-60 pointer-events-none",
      },
      rounded: {
        default: "rounded-lg",
        md: "rounded-md",
        lg: "rounded-xl",
        full: "rounded-full",
        none: "rounded-none",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      state: "default",
      rounded: "default",
    },
  }
);

export type EnhancedCardBaseProps = {
  children: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  footer?: ReactNode;
  headerClassName?: string;
  contentClassName?: string;
  footerClassName?: string;
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
  animate?: boolean;
};

export type EnhancedCardProps = 
  EnhancedCardBaseProps & 
  VariantProps<typeof cardVariants> & 
  Omit<React.HTMLAttributes<HTMLDivElement>, keyof EnhancedCardBaseProps>;

type CardComponentProps = EnhancedCardProps & { ref: React.ForwardedRef<HTMLDivElement> };

const EnhancedCard = forwardRef<HTMLDivElement, EnhancedCardProps>(
  ({
    className,
    variant,
    size,
    rounded,
    children,
    title,
    description,
    footer,
    headerClassName,
    contentClassName,
    footerClassName,
    isLoading = false,
    isError = false,
    errorMessage = "An error occurred",
    animate = false,
    state,
    ...props
  }, ref) => {
    // Determine the card state
    const cardState = isLoading
      ? "loading"
      : isError
      ? "error"
      : state || "default";

    const cardClassName = cn(
      cardVariants({ variant, size, state: cardState, rounded }), 
      className
    );

    if (animate) {
      return (
        <motion.div
          ref={ref}
          className={cardClassName}
          whileHover={{ y: -4 }}
          transition={{ duration: 0.2 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          {...props as HTMLMotionProps<"div">}
        >
          {(title || description) && (
            <CardHeader className={cn("gap-1.5", headerClassName)}>
              {title && <CardTitle>{title}</CardTitle>}
              {description && <CardDescription>{description}</CardDescription>}
            </CardHeader>
          )}
          <CardContent
            className={cn(
              "relative",
              title || description ? "" : "pt-6",
              contentClassName
            )}
          >
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm rounded-lg z-10">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}
            {isError && (
              <div className="mb-4 bg-destructive/10 p-3 rounded-md flex items-center gap-2 text-destructive">
                <AlertCircle className="h-4 w-4" />
                <p className="text-sm">{errorMessage}</p>
              </div>
            )}
            {children}
          </CardContent>
          {footer && <CardFooter className={cn("flex gap-2", footerClassName)}>{footer}</CardFooter>}
        </motion.div>
      );
    }

    return (
      <Card
        ref={ref}
        className={cardClassName}
        {...props}
      >
        {(title || description) && (
          <CardHeader className={cn("gap-1.5", headerClassName)}>
            {title && <CardTitle>{title}</CardTitle>}
            {description && <CardDescription>{description}</CardDescription>}
          </CardHeader>
        )}
        <CardContent
          className={cn(
            "relative",
            title || description ? "" : "pt-6",
            contentClassName
          )}
        >
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm rounded-lg z-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
          {isError && (
            <div className="mb-4 bg-destructive/10 p-3 rounded-md flex items-center gap-2 text-destructive">
              <AlertCircle className="h-4 w-4" />
              <p className="text-sm">{errorMessage}</p>
            </div>
          )}
          {children}
        </CardContent>
        {footer && <CardFooter className={cn("flex gap-2", footerClassName)}>{footer}</CardFooter>}
      </Card>
    );
  }
);

EnhancedCard.displayName = "EnhancedCard";

export { EnhancedCard };
export { 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
}; 