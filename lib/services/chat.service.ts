import { dummyChats, dummyChatMessages } from "@/lib/dummy-data"
import type { ChatConversation, ChatMessage } from "@/types"

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms))

export const chatService = {
  async getConversations(): Promise<ChatConversation[]> {
    await delay(600)
    return [...dummyChats]
  },

  async getMessages(conversationId: string): Promise<ChatMessage[]> {
    await delay(400)
    void conversationId
    return [...dummyChatMessages]
  },

  async searchConversations(query: string): Promise<ChatConversation[]> {
    await delay(400)
    const q = query.toLowerCase()
    return dummyChats.filter(
      (c) =>
        c.participants.some((p) => p.name.toLowerCase().includes(q)) ||
        c.last_message.toLowerCase().includes(q)
    )
  },
}
