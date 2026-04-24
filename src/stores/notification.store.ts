import { create } from "zustand";
import type { INotification } from "@/interfaces/notification/notification.interface";
import { notificationService } from "@/services/notification.service";

interface NotificationState {
  items: INotification[];
  nextCursor: string | null;
  unreadCount: number;
  loading: boolean;

  loadInitial: () => Promise<void>;
  loadMore: () => Promise<void>;
  refreshUnreadCount: () => Promise<void>;
  markRead: (id: string) => Promise<void>;
  markAllRead: () => Promise<void>;
  remove: (id: string) => Promise<void>;
  prependFromServer: (id: string) => Promise<void>;
  reset: () => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  items: [],
  nextCursor: null,
  unreadCount: 0,
  loading: false,

  async loadInitial() {
    set({ loading: true });
    try {
      const page = await notificationService.list({ limit: 20 });
      const count = await notificationService.unreadCount();
      set({
        items: page.items,
        nextCursor: page.nextCursor,
        unreadCount: count,
        loading: false,
      });
    } catch (err) {
      console.error("notifications loadInitial failed:", err);
      set({ loading: false });
    }
  },

  async loadMore() {
    const { nextCursor, loading } = get();
    if (!nextCursor || loading) return;
    set({ loading: true });
    try {
      const page = await notificationService.list({
        before: nextCursor,
        limit: 20,
      });
      set((state) => ({
        items: [...state.items, ...page.items],
        nextCursor: page.nextCursor,
        loading: false,
      }));
    } catch {
      set({ loading: false });
    }
  },

  async refreshUnreadCount() {
    try {
      const count = await notificationService.unreadCount();
      set({ unreadCount: count });
    } catch {
      // ignore
    }
  },

  async markRead(id) {
    const item = get().items.find((n) => n._id === id);
    if (item && !item.read) {
      set((s) => ({
        items: s.items.map((n) => (n._id === id ? { ...n, read: true } : n)),
        unreadCount: Math.max(0, s.unreadCount - 1),
      }));
    }
    try {
      await notificationService.markRead(id);
    } catch (err) {
      console.error("markRead failed:", err);
    }
  },

  async markAllRead() {
    set((s) => ({
      items: s.items.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    }));
    try {
      await notificationService.markAllRead();
    } catch (err) {
      console.error("markAllRead failed:", err);
    }
  },

  async remove(id) {
    const prev = get().items;
    set((s) => ({
      items: s.items.filter((n) => n._id !== id),
      unreadCount: prev.find((n) => n._id === id && !n.read)
        ? Math.max(0, s.unreadCount - 1)
        : s.unreadCount,
    }));
    try {
      await notificationService.remove(id);
    } catch (err) {
      console.error("remove failed:", err);
    }
  },

  async prependFromServer(id) {
    const n = await notificationService.prepend(id);
    if (!n) return;
    set((s) => ({
      items: [n, ...s.items.filter((x) => x._id !== n._id)],
      unreadCount: s.unreadCount + 1,
    }));
  },

  reset() {
    set({ items: [], nextCursor: null, unreadCount: 0, loading: false });
  },
}));
