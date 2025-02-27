'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell, 
  TableCaption 
} from '@/components/ui/table';
import { 
  InfoBox, 
  WarningBox, 
  TipBox, 
  SuccessBox, 
  QuestionBox, 
  DefinitionBox 
} from './InfoBoxes';
import { KnowledgeCheck } from './KnowledgeCheck';

interface EnhancedMarkdownProps {
  content: string;
  className?: string;
}

// Custom parser for info boxes
const processInfoBoxes = (content: string) => {
  // Match patterns like:
  // [!INFO] This is an info box
  // [!WARNING] This is a warning
  // [!TIP] This is a tip
  // [!SUCCESS] This is a success message
  // [!QUESTION] This is a question
  // [!DEFINITION] Term: This is a definition

  const boxTypes = ['INFO', 'WARNING', 'TIP', 'SUCCESS', 'QUESTION', 'DEFINITION'];
  
  let processedContent = content;
  
  boxTypes.forEach(type => {
    const regex = new RegExp(`\\[!${type}\\]([\\s\\S]*?)(?=\\[!(?:${boxTypes.join('|')})\\]|$)`, 'g');
    
    processedContent = processedContent.replace(regex, (match, boxContent) => {
      // Extract title if present (format: Title: Content)
      const titleMatch = boxContent.match(/^(.*?):([\s\S]*)$/);
      let title = type.charAt(0) + type.slice(1).toLowerCase();
      let cleanContent = boxContent.trim();
      
      if (titleMatch) {
        title = titleMatch[1].trim();
        cleanContent = titleMatch[2].trim();
      }
      
      // Return the React component as a special marker that we'll process later
      return `:::${type.toLowerCase()}:::${title}:::${cleanContent}:::`;
    });
  });
  
  return processedContent;
};

// Custom parser for knowledge checks
const processKnowledgeChecks = (content: string) => {
  const regex = /\[!QUIZ\]([\s\S]*?)(?=\[!QUIZ\]|$)/g;
  
  let processedContent = content;
  
  processedContent = processedContent.replace(regex, (match, quizContent) => {
    try {
      // Extract question
      const questionMatch = quizContent.match(/Question:([\s\S]*?)(?=Options:|$)/);
      if (!questionMatch) return match;
      
      const question = questionMatch[1].trim();
      
      // Extract options
      const optionsMatch = quizContent.match(/Options:([\s\S]*?)(?=Explanation:|$)/);
      if (!optionsMatch) return match;
      
      const optionsText = optionsMatch[1].trim();
      const optionLines = optionsText.split('\n')
        .map((line: string) => line.trim())
        .filter(Boolean);
      
      const options = optionLines.map((line: string) => {
        const isCorrect = line.includes('(correct)');
        
        // Simple sanitization - just remove the (correct) marker
        const text = line.replace(/\(correct\)/i, '').trim();
        
        return { text, isCorrect };
      });
      
      // Extract explanation (optional)
      const explanationMatch = quizContent.match(/Explanation:([\s\S]*)/);
      const explanation = explanationMatch ? explanationMatch[1].trim() : undefined;
      
      // Create a quiz object with sanitized properties
      const quizObject = {
        question,
        options,
        explanation
      };
      
      // Instead of manually constructing JSON, use a custom serialization function
      const serializedQuiz = serializeToSafeJson(quizObject);
      
      return `:::quiz:::${serializedQuiz}:::`;
    } catch (e) {
      console.error('Error processing quiz:', e);
      // Return a failsafe JSON object
      return `:::quiz:::${serializeToSafeJson({
        question: "Quiz question (error occurred)",
        options: [{ text: "Option 1", isCorrect: true }],
        explanation: "An error occurred while processing this quiz."
      })}:::`;
    }
  });
  
  return processedContent;
};

// Specialized JSON serializer that handles problematic characters
function serializeToSafeJson(obj: any): string {
  // Deep clone the object
  const processedObject = { ...obj };
  
  // Use base64 encoding for string values to avoid all JSON escaping issues
  if (typeof processedObject.question === 'string') {
    processedObject.question = btoa(encodeURIComponent(processedObject.question));
    processedObject._base64 = true; // Mark that we're using base64
  }
  
  if (typeof processedObject.explanation === 'string') {
    processedObject.explanation = btoa(encodeURIComponent(processedObject.explanation));
  }
  
  if (Array.isArray(processedObject.options)) {
    processedObject.options = processedObject.options.map((option: any) => {
      if (typeof option.text === 'string') {
        return {
          ...option,
          text: btoa(encodeURIComponent(option.text))
        };
      }
      return option;
    });
  }
  
  // Use standard JSON.stringify for the sanitized object
  return JSON.stringify(processedObject);
}

// Helper function to decode base64 encoded fields in quiz data
function decodeBase64Fields(data: any): any {
  const decodedData = { ...data };
  
  // Determine if we need to decode (if _base64 flag is set)
  const needsDecode = decodedData._base64 === true;
  if (needsDecode) {
    delete decodedData._base64; // Remove the flag
  } else {
    return decodedData; // Return as is if not base64 encoded
  }
  
  try {
    // Decode the question
    if (typeof decodedData.question === 'string') {
      try {
        decodedData.question = decodeURIComponent(atob(decodedData.question));
      } catch (e) {
        console.error('Error decoding question:', e);
        // Fall back to original value if decoding fails
      }
    }
    
    // Decode the explanation
    if (typeof decodedData.explanation === 'string') {
      try {
        decodedData.explanation = decodeURIComponent(atob(decodedData.explanation));
      } catch (e) {
        console.error('Error decoding explanation:', e);
        // Fall back to original value if decoding fails
      }
    }
    
    // Decode the options
    if (Array.isArray(decodedData.options)) {
      decodedData.options = decodedData.options.map((option: any) => {
        if (typeof option.text === 'string') {
          try {
            return {
              ...option,
              text: decodeURIComponent(atob(option.text))
            };
          } catch (e) {
            console.error('Error decoding option text:', e);
            return option; // Fall back to original option if decoding fails
          }
        }
        return option;
      });
    }
  } catch (e) {
    console.error('Error during base64 decoding:', e);
  }
  
  return decodedData;
}

export function EnhancedMarkdown({ content, className }: EnhancedMarkdownProps) {
  // Process the content for info boxes and knowledge checks
  const processedWithInfoBoxes = processInfoBoxes(content);
  const processedContent = processKnowledgeChecks(processedWithInfoBoxes);
  
  return (
    <div className={cn("prose prose-sm md:prose-base dark:prose-invert max-w-none", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Custom Heading Components with proper spacing and styling
          h1: ({ className, ...props }) => (
            <h1 
              className={cn(
                "text-3xl font-bold tracking-tight mt-8 mb-4 text-primary first:mt-0", 
                className
              )} 
              {...props} 
            />
          ),
          h2: ({ className, ...props }) => (
            <h2 
              className={cn(
                "text-2xl font-semibold tracking-tight mt-8 mb-3 text-primary/90", 
                className
              )} 
              {...props} 
            />
          ),
          h3: ({ className, ...props }) => (
            <h3 
              className={cn(
                "text-xl font-medium tracking-tight mt-6 mb-2 text-primary/80", 
                className
              )} 
              {...props} 
            />
          ),
          h4: ({ className, ...props }) => (
            <h4 
              className={cn(
                "text-lg font-medium tracking-tight mt-4 mb-2 text-primary/70", 
                className
              )} 
              {...props} 
            />
          ),
          
          // Enhanced Paragraph with better spacing
          p: ({ className, children, ...props }) => {
            // Check if this paragraph contains our custom syntax
            if (typeof children === 'string') {
              // Process info boxes
              if (children.startsWith(':::') && children.includes(':::')) {
                const parts = children.split(':::');
                
                // Handle InfoBoxes
                if (parts.length >= 5 && ['info', 'warning', 'tip', 'success', 'question', 'definition'].includes(parts[1])) {
                  const [_, type, title, boxContent] = parts;
                  
                  switch (type) {
                    case 'info':
                      return <InfoBox title={title}>{boxContent}</InfoBox>;
                    case 'warning':
                      return <WarningBox title={title}>{boxContent}</WarningBox>;
                    case 'tip':
                      return <TipBox title={title}>{boxContent}</TipBox>;
                    case 'success':
                      return <SuccessBox title={title}>{boxContent}</SuccessBox>;
                    case 'question':
                      return <QuestionBox title={title}>{boxContent}</QuestionBox>;
                    case 'definition':
                      return <DefinitionBox title={title}>{boxContent}</DefinitionBox>;
                  }
                }
                
                // Handle Knowledge Check
                if (parts.length >= 3 && parts[1] === 'quiz') {
                  try {
                    const jsonStr = parts[2];
                    
                    // Parse the JSON with a custom safer parse function
                    const rawData = safeJsonParse(jsonStr);
                    
                    // Validate required properties
                    if (!rawData || !rawData.question || !Array.isArray(rawData.options)) {
                      throw new Error('Invalid quiz data structure');
                    }
                    
                    // Decode base64 encoded values if needed
                    const quizData = decodeBase64Fields(rawData);
                    
                    return <KnowledgeCheck {...quizData} />;
                  } catch (e) {
                    console.error('Error parsing quiz data:', e);
                    console.error('Problematic JSON string:', parts[2]);
                    
                    // Fallback to showing a simplified version of the quiz
                    return (
                      <div className="bg-muted/30 p-4 rounded-md border border-primary/20 my-4">
                        <p className="text-foreground font-medium">Knowledge Check</p>
                        <p className="text-foreground/80 text-sm mt-2">
                          (There was an error loading this quiz. Please contact support.)
                        </p>
                      </div>
                    );
                  }
                }
              }
            }
            
            return (
              <p 
                className={cn(
                  "leading-7 mb-4 text-foreground/90",
                  className
                )} 
                {...props}
              >
                {children}
              </p>
            );
          },
          
          // Enhanced Lists
          ul: ({ className, ...props }) => (
            <ul 
              className={cn(
                "my-6 ml-6 list-disc space-y-2", 
                className
              )} 
              {...props} 
            />
          ),
          ol: ({ className, ...props }) => (
            <ol 
              className={cn(
                "my-6 ml-6 list-decimal space-y-2", 
                className
              )} 
              {...props} 
            />
          ),
          li: ({ className, ...props }) => (
            <li 
              className={cn(
                "mt-2",
                className
              )} 
              {...props} 
            />
          ),
          
          // Blockquote with better styling
          blockquote: ({ className, ...props }) => (
            <blockquote 
              className={cn(
                "mt-6 mb-6 border-l-4 border-primary pl-6 italic text-foreground/80 bg-muted/30 py-3 pr-4 rounded-r-md", 
                className
              )} 
              {...props} 
            />
          ),
          
          // Enhanced Table Components using shadcn/ui
          table: ({ className, ...props }) => (
            <Table className={cn("my-6", className)}>
              {props.children}
            </Table>
          ),
          thead: ({ className, ...props }) => (
            <TableHeader className={cn(className)}>
              {props.children}
            </TableHeader>
          ),
          tbody: ({ className, ...props }) => (
            <TableBody className={cn(className)}>
              {props.children}
            </TableBody>
          ),
          tr: ({ className, ...props }) => (
            <TableRow className={cn(className)}>
              {props.children}
            </TableRow>
          ),
          th: ({ className, ...props }) => (
            <TableHead className={cn("font-semibold", className)}>
              {props.children}
            </TableHead>
          ),
          td: ({ className, ...props }) => (
            <TableCell className={cn(className)}>
              {props.children}
            </TableCell>
          ),
          
          // Code blocks with better styling
          code: ({ className, children, ...props }) => {
            // Check if this is an inline code block
            const isInline = typeof children === 'string' && !children.includes('\n');
            
            if (isInline) {
              return (
                <code
                  className={cn(
                    "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
                    className
                  )}
                  {...props}
                >
                  {children}
                </code>
              );
            }
            
            return (
              <div className="relative my-6">
                <div className="absolute top-0 right-0 bg-primary/10 text-primary text-xs px-2 py-1 rounded-bl font-mono">
                  Code
                </div>
                <pre className="overflow-x-auto bg-muted/50 p-4 rounded-md border text-sm">
                  <code className={cn("font-mono", className)} {...props}>
                    {children}
                  </code>
                </pre>
              </div>
            );
          },
          
          // Horizontal rule with better styling
          hr: () => <hr className="my-8 border-muted" />,
          
          // Enhanced link styling
          a: ({ className, ...props }) => (
            <a 
              className={cn(
                "text-primary font-medium underline underline-offset-4 hover:text-primary/80 transition-colors", 
                className
              )} 
              {...props} 
            />
          ),
          
          // Enhanced strong and em
          strong: ({ className, ...props }) => (
            <strong 
              className={cn(
                "font-bold text-primary/90", 
                className
              )} 
              {...props} 
            />
          ),
          em: ({ className, ...props }) => (
            <em 
              className={cn(
                "italic text-primary/80", 
                className
              )} 
              {...props} 
            />
          ),
        }}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  );
}

// Helper function for safer JSON parsing with proper error handling
function safeJsonParse(jsonString: string): any {
  try {
    // Simple case - just try to parse it directly
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('JSON parse error, attempting cleanup:', error);
    
    try {
      // Try to clean up the JSON string
      let cleaned = jsonString
        // Fix common JSON issues
        .replace(/,\s*}/g, '}') // Remove trailing commas
        .replace(/,\s*]/g, ']') // Remove trailing commas in arrays
        .replace(/\\/g, '\\\\') // Ensure backslashes are escaped
        .replace(/\\"/g, '\\\\"') // Fix double escaped quotes
        .replace(/'/g, '"'); // Replace single quotes with double quotes
      
      // Check if JSON is properly terminated with a closing brace
      if (!cleaned.trim().endsWith('}')) {
        // Add a closing brace if it's missing
        cleaned = cleaned.trim() + (cleaned.includes('"explanation"') ? '"}' : '}');
      }
      
      // Handle potentially unclosed strings by counting quotes
      const quoteCount = (cleaned.match(/"/g) || []).length;
      if (quoteCount % 2 !== 0) {
        console.error('Detected odd number of quotes:', quoteCount);
        
        // Look for the last property value without a closing quote
        const lastQuotePos = cleaned.lastIndexOf('"');
        const lastBracePos = cleaned.lastIndexOf('}');
        
        if (lastQuotePos > lastBracePos) {
          // If the last quote is after the last brace, we need to add a closing quote and possibly a brace
          cleaned = cleaned + '"';
          
          // Also ensure we have a closing brace
          if (!cleaned.trim().endsWith('}')) {
            cleaned = cleaned + '}';
          }
        } else {
          // Otherwise, add a quote before the last brace
          cleaned = cleaned.substring(0, lastBracePos) + '"' + cleaned.substring(lastBracePos);
        }
      }
      
      // Ensure we have balanced curly braces
      const openBraces = (cleaned.match(/\{/g) || []).length;
      const closeBraces = (cleaned.match(/\}/g) || []).length;
      
      if (openBraces > closeBraces) {
        // Add missing closing braces
        cleaned = cleaned + '}'.repeat(openBraces - closeBraces);
      }
      
      // Try parsing again after cleanup
      try {
        return JSON.parse(cleaned);
      } catch (parseError) {
        console.error('Failed parsing after cleanup, trying more aggressive cleanup:', parseError);
        
        // If we're still having issues, try a more aggressive approach
        // This is a last resort for badly malformed JSON
        if (cleaned.includes('"explanation"')) {
          const explanationStart = cleaned.indexOf('"explanation"');
          const beforeExplanation = cleaned.substring(0, explanationStart + 14); // 14 is length of "explanation":
          let explanationContent = cleaned.substring(explanationStart + 14);
          
          // Find where the explanation content should end
          if (!explanationContent.trim().startsWith('"')) {
            explanationContent = '"' + explanationContent;
          }
          
          // Make sure explanation has a closing quote and the object has a closing brace
          if (!explanationContent.includes('"}')) {
            explanationContent = explanationContent.replace(/"\s*$/, '');
            explanationContent = explanationContent + '"}';
          }
          
          cleaned = beforeExplanation + explanationContent;
        }
        
        return JSON.parse(cleaned);
      }
    } catch (secondError) {
      // Last resort - try a regex-based fix for the most common issue - unterminated strings
      try {
        console.error('Attempting last-resort fix for:', jsonString);
        
        // First fix for unclosed quotes in property values
        let fixedJson = jsonString.replace(/("[^"\\]*(?:\\.[^"\\]*)*)\s*(?=,|\}|$)/g, '$1"');
        
        // Fix for missing closing brace
        if (!fixedJson.trim().endsWith('}')) {
          fixedJson = fixedJson.trim() + '}';
        }
        
        // Balance quotes if needed
        const quoteCount = (fixedJson.match(/"/g) || []).length;
        if (quoteCount % 2 !== 0) {
          fixedJson = fixedJson + '"';
        }
        
        // Try one more approach specific to the explanation field issue
        if (fixedJson.includes('"explanation"')) {
          const parts = fixedJson.split('"explanation":');
          if (parts.length > 1) {
            const explanationValue = parts[1].trim();
            
            // If the explanation value is not properly quoted and terminated
            if (!explanationValue.startsWith('"')) {
              parts[1] = '"' + explanationValue;
            }
            
            if (!parts[1].endsWith('"}') && !parts[1].endsWith('"}]}')) {
              parts[1] = parts[1] + '"}';
            }
            
            fixedJson = parts[0] + '"explanation":' + parts[1];
          }
        }
        
        console.log('Last resort fixed JSON:', fixedJson);
        return JSON.parse(fixedJson);
      } catch (thirdError) {
        console.error('All JSON parsing attempts failed:', thirdError);
        
        // Final fallback - create a default valid object
        return {
          question: "Error loading quiz question",
          options: [
            { text: "This quiz couldn't be loaded correctly", isCorrect: true }
          ],
          explanation: "There was an error parsing the quiz data. Please contact support."
        };
      }
    }
  }
} 