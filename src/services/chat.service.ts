import apiInstance from "@/lib/api-instance";
import type { IConversation } from "@/interfaces/chat/conversation.interface";
import type { IChatMessagesPage } from "@/interfaces/chat/chat-message.interface";

const BASE = "/chat";

class ChatService {
  async listConversations(): Promise<IConversation[]> {
    const res = await apiInstance.get<IConversation[]>(`${BASE}/conversations`);
    return res.data;
  }

  async unreadCount(): Promise<number> {
    const res = await apiInstance.get<{ count: number }>(
      `${BASE}/unread-count`,
    );
    return res.data?.count ?? 0;
  }

  async openConversation(params: {
    peerUserId: string;
    propertyId?: string;
    initialMessage?: string;
  }): Promise<IConversation> {
    const res = await apiInstance.post<IConversation>(
      `${BASE}/conversations`,
      params,
    );
    return res.data;
  }

  async openAiConversation(): Promise<IConversation> {
    const res = await apiInstance.get<IConversation>(
      `${BASE}/ai-conversation`,
    );
    return res.data;
  }

  async getConversation(id: string): Promise<IConversation> {
    const res = await apiInstance.get<IConversation>(
      `${BASE}/conversations/${id}`,
    );
    return res.data;
  }

  async listMessages(
    conversationId: string,
    opts: { before?: string; limit?: number } = {},
  ): Promise<IChatMessagesPage> {
    const res = await apiInstance.get<IChatMessagesPage>(
      `${BASE}/conversations/${conversationId}/messages`,
      { params: opts },
    );
    return res.data;
  }

  async sendText(
    conversationId: string,
    body: string,
  ): Promise<{ _id: string; ok: true }> {
    const res = await apiInstance.post<{ _id: string; ok: true }>(
      `${BASE}/messages`,
      { conversationId, body },
    );
    return res.data;
  }

  async markRead(conversationId: string): Promise<void> {
    await apiInstance.patch(`${BASE}/conversations/${conversationId}/read`);
  }
}

export const chatService = new ChatService();
