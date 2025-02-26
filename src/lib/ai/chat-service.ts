import { OpenAI } from 'openai'
import { Message, MessageRole } from '@/types/chat'
import { User } from '@/types/user'
import { WeekData } from '@/types/pregnancy'
import { PREGNANCY_SYSTEM_PROMPT, INITIAL_AI_MESSAGE } from './prompts'

// Initialize OpenAI client
const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY || ''
const openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true })

export interface ChatServiceOptions {
  user: User | null
  weekData: WeekData | null
  previousMessages: Message[]
}

export class ChatService {
  private user: User | null
  private weekData: WeekData | null
  private messages: { role: MessageRole; content: string }[]

  constructor({ user, weekData, previousMessages }: ChatServiceOptions) {
    this.user = user
    this.weekData = weekData
    
    // Initialize with system prompt
    this.messages = [{
      role: 'system',
      content: this.buildSystemPrompt()
    }]

    // Add previous messages
    previousMessages.forEach(msg => {
      this.messages.push({
        role: msg.role,
        content: msg.content
      })
    })

    // If this is a new conversation, add the initial AI message
    if (previousMessages.length === 0) {
      this.messages.push({
        role: 'assistant',
        content: INITIAL_AI_MESSAGE
      })
    }
  }

  private buildSystemPrompt(): string {
    let prompt = PREGNANCY_SYSTEM_PROMPT

    // Add user context if available
    if (this.user?.profile) {
      const profile = this.user.profile
      prompt += `\n\nUser Information:
- Name: ${profile.full_name || 'Unknown'}
- Due Date: ${profile.due_date || 'Unknown'}
- First Pregnancy: ${profile.first_pregnancy ? 'Yes' : 'No'}`
    }

    // Add pregnancy week context if available
    if (this.weekData) {
      const week = this.weekData
      prompt += `\n\nCurrent Pregnancy Week: ${week.week}
- Baby Size: Like a ${week.babySize.fruit} (${week.babySize.lengthCm} cm, ${week.babySize.weightG} g)
- Common Symptoms: ${week.commonSymptoms.join(', ')}
- Key Development: ${week.babyDevelopment[0]}`
    }

    return prompt
  }

  async sendMessage(userMessage: string): Promise<string> {
    // Add user message
    this.messages.push({
      role: 'user',
      content: userMessage
    })

    try {
      // Call OpenAI API
      const response = await openai.chat.completions.create({
        model: 'gpt-4-turbo',
        messages: this.messages,
        temperature: 0.7,
        max_tokens: 500
      })

      const aiMessage = response.choices[0]?.message?.content || 'Sorry, I could not generate a response.'
      
      // Add AI response to conversation history
      this.messages.push({
        role: 'assistant',
        content: aiMessage
      })

      return aiMessage
    } catch (error) {
      console.error('Error calling OpenAI:', error)
      return 'Sorry, I encountered an error while processing your message. Please try again later.'
    }
  }

  getMessages(): { role: MessageRole; content: string }[] {
    // Return all messages except the system prompt
    return this.messages.slice(1)
  }
}

export default ChatService 