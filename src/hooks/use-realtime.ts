import { useEffect } from "react";
import { socketManager } from "@/lib/socket";
import { useUserStore } from "@/stores/user.store";
import { useChatStore } from "@/stores/chat.store";
import { useNotificationStore } from "@/stores/notification.store";
import type { IChatMessage } from "@/interfaces/chat/chat-message.interface";

/**
 * Root'da bir marta mount qilinadi (RootLayout ichida).
 * User login bo'lsa socket ulanadi, logout bo'lsa uziladi.
 * Chat + notification event'lari markaziy joyda store'larga yo'naltiriladi.
 */
export function useRealtime() {
  const user = useUserStore((s) => s.user);
  const { upsertConversation, appendLocalMessage, setTyping, markReadLocal } =
    useChatStore();
  const prependFromServer = useNotificationStore((s) => s.prependFromServer);
  const refreshUnreadCount = useNotificationStore((s) => s.refreshUnreadCount);
  const refreshChatUnread = useChatStore((s) => s.refreshUnreadTotal);
  const loadConversations = useChatStore((s) => s.loadConversations);

  useEffect(() => {
    if (!user?._id) {
      socketManager.disconnect();
      useChatStore.getState().reset();
      useNotificationStore.getState().reset();
      return;
    }

    const socket = socketManager.connect();

    const onNewMessage = (msg: IChatMessage) => {
      appendLocalMessage(msg);
      // Conversation list'ni yangilash uchun: unread va snippet'ni qayta olish
      refreshChatUnread();
      loadConversations();
    };

    const onTyping = (data: {
      conversationId: string;
      userId: string;
      typing: boolean;
    }) => {
      if (data.userId === user._id) return;
      setTyping(data.conversationId, data.userId, data.typing);
    };

    const onReadReceipt = (data: {
      conversationId: string;
      userId: string;
    }) => {
      markReadLocal(data.conversationId, data.userId);
      if (data.userId === user._id) refreshChatUnread();
    };

    const onNewNotification = async (data: { notificationId?: string }) => {
      if (data?.notificationId) {
        await prependFromServer(data.notificationId);
      } else {
        refreshUnreadCount();
      }
    };

    socket.on("chat:new_message", onNewMessage);
    socket.on("chat:typing", onTyping);
    socket.on("chat:read_receipt", onReadReceipt);
    socket.on("notification:new", onNewNotification);

    return () => {
      socket.off("chat:new_message", onNewMessage);
      socket.off("chat:typing", onTyping);
      socket.off("chat:read_receipt", onReadReceipt);
      socket.off("notification:new", onNewNotification);
    };
  }, [
    user?._id,
    appendLocalMessage,
    loadConversations,
    markReadLocal,
    prependFromServer,
    refreshChatUnread,
    refreshUnreadCount,
    setTyping,
    upsertConversation,
  ]);
}

/**
 * Chat sahifasida subscribe/unsubscribe: conversation room'ga qo'shilish.
 */
export function useConversationSubscription(conversationId: string | null) {
  useEffect(() => {
    if (!conversationId) return;
    const socket = socketManager.instance;
    if (!socket) return;

    const join = () => socket.emit("chat:subscribe", { conversationId });
    if (socket.connected) join();
    socket.on("connect", join);

    return () => {
      socket.off("connect", join);
      socket.emit("chat:unsubscribe", { conversationId });
    };
  }, [conversationId]);
}
