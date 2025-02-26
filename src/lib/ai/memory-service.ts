import { Message } from '@/types/chat'

/**
 * A service to manage memory/context for the AI chat
 * This is a simple implementation that could be expanded with vector database
 * capabilities for more advanced context management
 */
export class MemoryService {
  private messages: Message[] = []
  private userInsights: Record<string, string[]> = {
    symptoms: [],
    concerns: [],
    preferences: [],
    questions: []
  }

  constructor(initialMessages: Message[] = []) {
    this.messages = [...initialMessages]
    
    // Extract insights from initial messages if any
    this.processMessagesForInsights(initialMessages)
  }

  /**
   * Add a new message to memory
   */
  addMessage(message: Message): void {
    this.messages.push(message)
    
    // Process user messages for insights
    if (message.role === 'user') {
      this.extractInsightsFromMessage(message.content)
    }
  }

  /**
   * Get recent conversation history up to a limit
   */
  getRecentMessages(limit: number = 10): Message[] {
    return this.messages.slice(-limit)
  }

  /**
   * Get all stored messages
   */
  getAllMessages(): Message[] {
    return [...this.messages]
  }

  /**
   * Clear conversation history
   */
  clearMessages(): void {
    this.messages = []
  }

  /**
   * Get user insights by category
   */
  getInsights(category?: keyof typeof this.userInsights): Record<string, string[]> {
    if (category) {
      return { [category]: this.userInsights[category] }
    }
    return { ...this.userInsights }
  }

  /**
   * Add a specific user insight manually
   */
  addInsight(category: keyof typeof this.userInsights, insight: string): void {
    if (!this.userInsights[category].includes(insight)) {
      this.userInsights[category].push(insight)
    }
  }

  /**
   * Process a batch of messages to extract insights
   */
  private processMessagesForInsights(messages: Message[]): void {
    const userMessages = messages.filter(m => m.role === 'user')
    userMessages.forEach(m => this.extractInsightsFromMessage(m.content))
  }

  /**
   * Extract potential insights from a user message
   * This is a simple keyword-based approach that could be enhanced with NLP
   */
  private extractInsightsFromMessage(message: string): void {
    const lowerMessage = message.toLowerCase()
    
    // Simple keyword matching - could be replaced with more sophisticated NLP
    const symptomKeywords = ['pain', 'ache', 'nausea', 'sick', 'tired', 'fatigue', 'cramping', 'spotting', 'swelling']
    const concernKeywords = ['worried', 'concerned', 'fear', 'afraid', 'anxiety', 'stress', 'risk', 'danger']
    const preferenceKeywords = ['prefer', 'want', 'like', 'don\'t like', 'don\'t want', 'hope']
    
    // Check for symptoms
    symptomKeywords.forEach(keyword => {
      if (lowerMessage.includes(keyword) && !this.userInsights.symptoms.some(s => s.includes(keyword))) {
        // Extract the sentence containing the symptom
        const sentences = message.split(/[.!?]+/)
        const relevantSentence = sentences.find(s => s.toLowerCase().includes(keyword))
        if (relevantSentence) {
          this.userInsights.symptoms.push(relevantSentence.trim())
        }
      }
    })
    
    // Check for concerns
    concernKeywords.forEach(keyword => {
      if (lowerMessage.includes(keyword) && !this.userInsights.concerns.some(c => c.includes(keyword))) {
        const sentences = message.split(/[.!?]+/)
        const relevantSentence = sentences.find(s => s.toLowerCase().includes(keyword))
        if (relevantSentence) {
          this.userInsights.concerns.push(relevantSentence.trim())
        }
      }
    })
    
    // Check for preferences
    preferenceKeywords.forEach(keyword => {
      if (lowerMessage.includes(keyword) && !this.userInsights.preferences.some(p => p.includes(keyword))) {
        const sentences = message.split(/[.!?]+/)
        const relevantSentence = sentences.find(s => s.toLowerCase().includes(keyword))
        if (relevantSentence) {
          this.userInsights.preferences.push(relevantSentence.trim())
        }
      }
    })
    
    // Check if it's a question
    if (message.includes('?')) {
      const questions = message.split(/[.!]+/).filter(s => s.includes('?'))
      questions.forEach(q => {
        if (!this.userInsights.questions.includes(q.trim())) {
          this.userInsights.questions.push(q.trim())
        }
      })
    }
  }
}

export default MemoryService 