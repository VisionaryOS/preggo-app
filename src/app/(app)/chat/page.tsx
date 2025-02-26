import React from 'react'
import { ChatInterface } from '@/components/chat/chat-interface'
import { useToast } from '@/components/ui/use-toast'

// Sample initial messages - in a real app, these would be fetched from the database
const initialMessages = [
  {
    id: '1',
    content: "Hello! I'm your pregnancy assistant. How can I help you today?",
    role: 'assistant' as const,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
  }
]

export default function ChatPage() {
  // This is a client component mock - in a real app, this would use React Query and server actions
  const handleSendMessage = async (message: string) => {
    // Mock AI response with a delay
    await new Promise((resolve) => setTimeout(resolve, 1000))
    
    console.log('Sent message:', message)
    
    // In a real app, we'd call our AI service here
    return
  }

  return (
    <div className="container py-6">
      <h1 className="text-3xl font-bold mb-4">Your AI Pregnancy Assistant</h1>
      <p className="text-muted-foreground mb-6">
        Ask questions about your pregnancy, symptoms, or baby development. Your assistant is here to help.
      </p>
      
      <ChatInterface
        initialMessages={initialMessages}
        onSendMessage={handleSendMessage}
      />
    </div>
  )
} 