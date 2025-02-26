import React, { useState, useRef, useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Send } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface Message {
  id: string
  content: string
  role: 'user' | 'assistant' | 'system'
  createdAt: Date
}

interface ChatInterfaceProps {
  initialMessages?: Message[]
  onSendMessage: (message: string) => Promise<void>
  isLoading?: boolean
}

export function ChatInterface({
  initialMessages = [],
  onSendMessage,
  isLoading = false,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState('')
  const endOfMessagesRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  // Focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!input.trim() || isLoading) return
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: 'user',
      createdAt: new Date(),
    }
    
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    
    try {
      await onSendMessage(input)
    } catch (error) {
      console.error('Failed to send message:', error)
    }
  }

  return (
    <div className="flex h-[80vh] flex-col rounded-lg border bg-card shadow-sm">
      <div className="flex items-center border-b px-4 py-3">
        <Avatar className="h-8 w-8 mr-2">
          <AvatarImage src="/assistant-avatar.png" alt="AI Assistant" />
          <AvatarFallback>AI</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-lg font-semibold">Pregnancy Assistant</h2>
          <p className="text-xs text-muted-foreground">Powered by AI</p>
        </div>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex w-max max-w-[80%] flex-col gap-2 rounded-lg px-3 py-2 text-sm",
                message.role === 'user'
                  ? "ml-auto bg-primary text-primary-foreground"
                  : "bg-muted"
              )}
            >
              {message.content}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex w-max max-w-[80%] flex-col gap-2 rounded-lg bg-muted px-3 py-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 animate-pulse rounded-full bg-muted-foreground"></div>
                <div className="h-2 w-2 animate-pulse rounded-full bg-muted-foreground animation-delay-200"></div>
                <div className="h-2 w-2 animate-pulse rounded-full bg-muted-foreground animation-delay-400"></div>
              </div>
            </div>
          )}
          
          <div ref={endOfMessagesRef} />
        </div>
      </ScrollArea>
      
      <div className="border-t p-4">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </div>
    </div>
  )
}

export default ChatInterface 