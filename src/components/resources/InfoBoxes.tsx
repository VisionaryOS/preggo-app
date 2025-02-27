import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { 
  Info, 
  AlertTriangle, 
  Lightbulb, 
  CheckCircle, 
  HelpCircle,
  BookOpen
} from 'lucide-react';

interface InfoBoxProps {
  children: ReactNode;
  title?: string;
  className?: string;
  icon?: ReactNode;
}

export function InfoBox({ 
  children, 
  title = "Information", 
  className, 
  icon = <Info className="h-5 w-5" />
}: InfoBoxProps) {
  return (
    <div className={cn(
      "my-6 p-4 border rounded-md bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900",
      className
    )}>
      <div className="flex items-center gap-2 font-medium text-blue-700 dark:text-blue-400 mb-2">
        {icon}
        <h4 className="text-base">{title}</h4>
      </div>
      <div className="text-blue-700/90 dark:text-blue-400/90 text-sm">
        {children}
      </div>
    </div>
  );
}

export function WarningBox({ 
  children, 
  title = "Warning", 
  className 
}: InfoBoxProps) {
  return (
    <InfoBox
      title={title}
      className={cn(
        "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900",
        className
      )}
      icon={<AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-500" />}
    >
      <div className="text-amber-700/90 dark:text-amber-400/90 text-sm">
        {children}
      </div>
    </InfoBox>
  );
}

export function TipBox({ 
  children, 
  title = "Tip", 
  className 
}: InfoBoxProps) {
  return (
    <InfoBox
      title={title}
      className={cn(
        "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900",
        className
      )}
      icon={<Lightbulb className="h-5 w-5 text-green-600 dark:text-green-500" />}
    >
      <div className="text-green-700/90 dark:text-green-400/90 text-sm">
        {children}
      </div>
    </InfoBox>
  );
}

export function SuccessBox({ 
  children, 
  title = "Success", 
  className 
}: InfoBoxProps) {
  return (
    <InfoBox
      title={title}
      className={cn(
        "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900",
        className
      )}
      icon={<CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-500" />}
    >
      <div className="text-emerald-700/90 dark:text-emerald-400/90 text-sm">
        {children}
      </div>
    </InfoBox>
  );
}

export function QuestionBox({ 
  children, 
  title = "Question", 
  className 
}: InfoBoxProps) {
  return (
    <InfoBox
      title={title}
      className={cn(
        "bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-900",
        className
      )}
      icon={<HelpCircle className="h-5 w-5 text-purple-600 dark:text-purple-500" />}
    >
      <div className="text-purple-700/90 dark:text-purple-400/90 text-sm">
        {children}
      </div>
    </InfoBox>
  );
}

export function DefinitionBox({ 
  children, 
  title = "Definition", 
  className 
}: InfoBoxProps) {
  return (
    <InfoBox
      title={title}
      className={cn(
        "bg-indigo-50 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-900",
        className
      )}
      icon={<BookOpen className="h-5 w-5 text-indigo-600 dark:text-indigo-500" />}
    >
      <div className="text-indigo-700/90 dark:text-indigo-400/90 text-sm">
        {children}
      </div>
    </InfoBox>
  );
} 