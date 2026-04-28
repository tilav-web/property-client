import apiInstance, { publicApi } from "@/lib/api-instance";
import type { IConversation } from "@/interfaces/chat/conversation.interface";
import type { IChatMessagesPage } from "@/interfaces/chat/chat-message.interface";

const BASE = "/chat";

export interface AiCompactProperty {
  _id: string;
  title: string;
  address?: string;
  category?: string;
  price?: number;
  currency?: string;
  photo?: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
}

export interface AnonymousAiHistoryItem {
  role: "user" | "assistant";
  content: string;
}

export interface AnonymousAiReply {
  body: string;
  properties?: AiCompactProperty[];
  searchQuery?: string;
  noResults?: boolean;
}

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

  async askAiAnonymous(
    history: AnonymousAiHistoryItem[],
  ): Promise<AnonymousAiReply> {
    const res = await publicApi.post<AnonymousAiReply>(
      `${BASE}/ai-anonymous`,
      { history },
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
