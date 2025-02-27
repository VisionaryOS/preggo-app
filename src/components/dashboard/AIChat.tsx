'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SendIcon, Trash2 } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface AIChatProps {
  currentWeek: number;
}

export default function AIChat({ currentWeek }: AIChatProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load messages from localStorage on component mount
  useEffect(() => {
    const savedMessages = localStorage.getItem('pregnancyAiChatMessages');
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages));
      } catch (e) {
        console.error('Error parsing saved messages:', e);
      }
    } else {
      // Add welcome message if no previous messages
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `Welcome to your pregnancy assistant! I'm here to help with any questions about your pregnancy. You're currently in Week ${currentWeek}. How can I help you today?`,
        timestamp: Date.now(),
      };
      setMessages([welcomeMessage]);
      localStorage.setItem('pregnancyAiChatMessages', JSON.stringify([welcomeMessage]));
    }
  }, [currentWeek]);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('pregnancyAiChatMessages', JSON.stringify(messages));
    }
  }, [messages]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // Add user message to chat
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // This would normally call an API endpoint for AI processing
      // For now we'll simulate a response
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create a simple response based on user input
      let responseText = '';
      if (inputValue.toLowerCase().includes('week')) {
        responseText = `You're currently in Week ${currentWeek}. `;
        if (currentWeek <= 13) {
          responseText += 'You\'re in the first trimester. This is a time of rapid development for your baby. Take care of yourself by getting plenty of rest and taking prenatal vitamins.';
        } else if (currentWeek <= 26) {
          responseText += 'You\'re in the second trimester. Many women feel more energetic during this period. Your baby is growing rapidly and you might start feeling movements.';
        } else {
          responseText += 'You\'re in the third trimester. Your baby is putting on weight and preparing for birth. Make sure to prepare your hospital bag and finalize your birth plan.';
        }
      } else if (inputValue.toLowerCase().includes('symptom') || inputValue.toLowerCase().includes('feel')) {
        responseText = 'Common symptoms vary by trimester. If you\'re experiencing severe symptoms like intense pain, heavy bleeding, or severe headaches, please contact your healthcare provider immediately.';
      } else {
        responseText = `I'd be happy to help with your question about "${inputValue}". At Week ${currentWeek}, it's important to stay in regular contact with your healthcare provider. Is there anything specific you'd like to know about this stage of your pregnancy?`;
      }

      // Add assistant response
      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: responseText,
        timestamp: Date.now(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error processing message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearConversation = () => {
    const welcomeMessage: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content: `I've cleared our conversation history. You're currently in Week ${currentWeek}. How can I help you today?`,
      timestamp: Date.now(),
    };
    setMessages([welcomeMessage]);
    localStorage.setItem('pregnancyAiChatMessages', JSON.stringify([welcomeMessage]));
  };

  return (
    <div 
      className={`border-l h-screen transition-all duration-300 flex flex-col ${
        isExpanded ? 'w-80' : 'w-16'
      }`}
    >
      <div className="p-2 border-b flex justify-between items-center">
        <CardTitle className={`text-sm ${!isExpanded && 'hidden'}`}>Pregnancy Assistant</CardTitle>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? '→' : '←'}
        </Button>
      </div>

      {isExpanded && (
        <>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-3 py-2 ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-lg px-3 py-2 bg-muted">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="p-4 border-t">
            <div className="flex justify-between items-center mb-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 text-xs text-muted-foreground"
                onClick={clearConversation}
              >
                <Trash2 size={14} className="mr-1" /> Clear conversation
              </Button>
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Ask a question..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1"
              />
              <Button size="icon" onClick={handleSendMessage} disabled={isLoading || !inputValue.trim()}>
                <SendIcon size={16} />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
} 