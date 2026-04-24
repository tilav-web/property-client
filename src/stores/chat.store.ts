import { create } from "zustand";
import type { IConversation } from "@/interfaces/chat/conversation.interface";
import type { IChatMessage } from "@/interfaces/chat/chat-message.interface";
import { chatService } from "@/services/chat.service";

interface ConversationMessages {
  items: IChatMessage[];
  nextCursor: string | null;
  loading: boolean;
}

interface ChatState {
  conversations: IConversation[];
  loadingConversations: boolean;
  activeConversationId: string | null;
  messagesByConversation: Record<string, ConversationMessages>;
  typingByConversation: Record<string, Set<string>>;
  unreadTotal: number;

  loadConversations: () => Promise<void>;
  refreshUnreadTotal: () => Promise<void>;
  setActive: (id: string | null) => void;
  loadInitialMessages: (id: string) => Promise<void>;
  loadOlderMessages: (id: string) => Promise<void>;
  upsertConversation: (conv: IConversation) => void;
  appendLocalMessage: (msg: IChatMessage) => void;
  setTyping: (conversationId: string, userId: string, typing: boolean) => void;
  markReadLocal: (conversationId: string, userId: string) => void;
  reset: () => void;
}

function sortByLastMessage(list: IConversation[]): IConversation[] {
  return [...list].sort(
    (a, b) =>
      new Date(b.lastMessageAt).getTime() -
      new Date(a.lastMessageAt).getTime(),
  );
}

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: [],
  loadingConversations: false,
  activeConversationId: null,
  messagesByConversation: {},
  typingByConversation: {},
  unreadTotal: 0,

  async loadConversations() {
    set({ loadingConversations: true });
    try {
      const list = await chatService.listConversations();
      set({
        conversations: sortByLastMessage(list),
        loadingConversations: false,
      });
      await get().refreshUnreadTotal();
    } catch (err) {
      console.error("loadConversations failed:", err);
      set({ loadingConversations: false });
    }
  },

  async refreshUnreadTotal() {
    try {
      const count = await chatService.unreadCount();
      set({ unreadTotal: count });
    } catch {
      // ignore
    }
  },

  setActive(id) {
    set({ activeConversationId: id });
  },

  async loadInitialMessages(id) {
    const existing = get().messagesByConversation[id];
    if (existing && existing.items.length > 0) return;
    set((state) => ({
      messagesByConversation: {
        ...state.messagesByConversation,
        [id]: { items: [], nextCursor: null, loading: true },
      },
    }));
    try {
      const page = await chatService.listMessages(id, { limit: 30 });
      set((state) => ({
        messagesByConversation: {
          ...state.messagesByConversation,
          [id]: {
            items: page.items,
            nextCursor: page.nextCursor,
            loading: false,
          },
        },
      }));
    } catch (err) {
      console.error("loadInitialMessages failed:", err);
      set((state) => ({
        messagesByConversation: {
          ...state.messagesByConversation,
          [id]: { items: [], nextCursor: null, loading: false },
        },
      }));
    }
  },

  async loadOlderMessages(id) {
    const current = get().messagesByConversation[id];
    if (!current || !current.nextCursor || current.loading) return;
    set((state) => ({
      messagesByConversation: {
        ...state.messagesByConversation,
        [id]: { ...current, loading: true },
      },
    }));
    try {
      const page = await chatService.listMessages(id, {
        before: current.nextCursor,
        limit: 30,
      });
      set((state) => ({
        messagesByConversation: {
          ...state.messagesByConversation,
          [id]: {
            items: [...page.items, ...current.items],
            nextCursor: page.nextCursor,
            loading: false,
          },
        },
      }));
    } catch (err) {
      console.error("loadOlderMessages failed:", err);
      set((state) => ({
        messagesByConversation: {
          ...state.messagesByConversation,
          [id]: { ...current, loading: false },
        },
      }));
    }
  },

  upsertConversation(conv) {
    set((state) => {
      const others = state.conversations.filter((c) => c._id !== conv._id);
      return {
        conversations: sortByLastMessage([conv, ...others]),
      };
    });
  },

  appendLocalMessage(msg) {
    const convId = msg.conversation;
    set((state) => {
      const bucket = state.messagesByConversation[convId];
      if (!bucket) {
        return {
          messagesByConversation: {
            ...state.messagesByConversation,
            [convId]: {
              items: [msg],
              nextCursor: null,
              loading: false,
            },
          },
        };
      }
      if (bucket.items.some((m) => m._id === msg._id)) return state;
      return {
        messagesByConversation: {
          ...state.messagesByConversation,
          [convId]: {
            ...bucket,
            items: [...bucket.items, msg],
          },
        },
      };
    });
  },

  setTyping(conversationId, userId, typing) {
    set((state) => {
      const set1 = new Set(state.typingByConversation[conversationId] ?? []);
      if (typing) set1.add(userId);
      else set1.delete(userId);
      return {
        typingByConversation: {
          ...state.typingByConversation,
          [conversationId]: set1,
        },
      };
    });
  },

  markReadLocal(conversationId, userId) {
    set((state) => {
      const bucket = state.messagesByConversation[conversationId];
      if (!bucket) return state;
      let changed = false;
      const items = bucket.items.map((m) => {
        if (m.readBy.includes(userId)) return m;
        changed = true;
        return { ...m, readBy: [...m.readBy, userId] };
      });
      if (!changed) return state;
      return {
        messagesByConversation: {
          ...state.messagesByConversation,
          [conversationId]: { ...bucket, items },
        },
      };
    });
  },

  reset() {
    set({
      conversations: [],
      loadingConversations: false,
      activeConversationId: null,
      messagesByConversation: {},
      typingByConversation: {},
      unreadTotal: 0,
    });
  },
}));
