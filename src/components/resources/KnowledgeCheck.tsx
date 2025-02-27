import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, Lightbulb, RotateCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Option {
  text: string;
  isCorrect: boolean;
  explanation?: string;
}

interface KnowledgeCheckProps {
  question: string;
  options: Option[];
  explanation?: string;
  className?: string;
}

export function KnowledgeCheck({ 
  question, 
  options, 
  explanation, 
  className 
}: KnowledgeCheckProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleOptionSelect = (index: number) => {
    setSelectedOption(index);
    setShowFeedback(true);
  };

  const handleReset = () => {
    setSelectedOption(null);
    setShowFeedback(false);
    setShowExplanation(false);
  };

  const isCorrect = selectedOption !== null && options[selectedOption].isCorrect;

  return (
    <div 
      className={cn(
        "my-8 border rounded-lg overflow-hidden bg-muted/20",
        className
      )}
    >
      {/* Header */}
      <div className="bg-primary/10 p-4 border-b">
        <h3 className="font-medium text-lg flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-primary" />
          Knowledge Check
        </h3>
      </div>
      
      {/* Question */}
      <div className="p-4">
        <p className="font-medium text-base mb-4">{question}</p>
        
        {/* Options */}
        <div className="space-y-2">
          {options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleOptionSelect(index)}
              disabled={showFeedback}
              className={cn(
                "w-full text-left p-3 rounded-md border transition-colors flex items-start gap-3",
                selectedOption === index 
                  ? isCorrect 
                    ? "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900" 
                    : "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900"
                  : "hover:bg-muted focus:bg-muted hover:border-muted-foreground/20 focus:border-muted-foreground/20",
                showFeedback && "cursor-default"
              )}
            >
              {showFeedback && selectedOption === index && (
                isCorrect 
                  ? <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-500 mt-0.5 flex-shrink-0" /> 
                  : <XCircle className="h-5 w-5 text-red-600 dark:text-red-500 mt-0.5 flex-shrink-0" />
              )}
              
              <span className={cn(
                "flex-1",
                selectedOption === index && isCorrect && "text-green-700 dark:text-green-400",
                selectedOption === index && !isCorrect && "text-red-700 dark:text-red-400"
              )}>
                {option.text}
                
                {showFeedback && selectedOption === index && option.explanation && (
                  <span className="block mt-2 text-sm opacity-90">{option.explanation}</span>
                )}
              </span>
            </button>
          ))}
        </div>
        
        {/* Feedback and Actions */}
        {showFeedback && (
          <div className="mt-6 space-y-4">
            {!showExplanation && explanation && (
              <Button 
                variant="outline" 
                onClick={() => setShowExplanation(true)}
                className="text-primary"
              >
                Show Explanation
              </Button>
            )}
            
            {showExplanation && explanation && (
              <div className="bg-muted/30 p-4 rounded-md text-sm">
                <h4 className="font-medium mb-2">Explanation:</h4>
                <p>{explanation}</p>
              </div>
            )}
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleReset}
              className="flex items-center gap-1"
            >
              <RotateCw className="h-4 w-4" />
              Try Again
            </Button>
          </div>
        )}
      </div>
    </div>
  );
} 