import { useEffect, useRef } from "react";
import { io, type Socket } from "socket.io-client";
import { useQueryClient } from "@tanstack/react-query";
import { useAdminStore } from "@/stores/admin.store";

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

interface NotificationNewPayload {
  type: string;
  title: string;
  body: string;
  link?: string;
  payload?: Record<string, unknown>;
}

/**
 * Admin tomonidan ulanadigan real-time notification socket.
 *
 * - Namespace: `/admin-notifications`
 * - Auth: admin_access_token bilan
 * - Event 'notification:new' kelganda:
 *   * unread-count query'sini invalidate qiladi (badge yangilanadi)
 *   * pending payments query'sini invalidate qiladi (list yangilanadi)
 *   * ixtiyoriy onNew callback chaqiriladi (toast ko'rsatish uchun)
 *
 * Adminstore'da admin_access_token bo'lmasa ulanmaydi.
 */
export function useAdminNotificationSocket(opts?: {
  onNew?: (payload: NotificationNewPayload) => void;
}) {
  const queryClient = useQueryClient();
  const socketRef = useRef<Socket | null>(null);
  const onNewRef = useRef(opts?.onNew);

  // onNew ni ref orqali saqlaymiz — har render'da socket qayta ulanmasin
  useEffect(() => {
    onNewRef.current = opts?.onNew;
  }, [opts?.onNew]);

  const adminAccessToken = useAdminStore((s) => s.adminAccessToken);

  useEffect(() => {
    if (!adminAccessToken) {
      socketRef.current?.disconnect();
      socketRef.current = null;
      return;
    }

    const socket = io(`${BASE_URL}/admin-notifications`, {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      transports: ["websocket"],
      withCredentials: true,
      auth: { token: adminAccessToken },
    });

    socketRef.current = socket;

    socket.on("notification:new", (payload: NotificationNewPayload) => {
      // Badge va list query'larini invalidate qilamiz
      queryClient.invalidateQueries({
        queryKey: ["admin-notifications-unread-count"],
      });
      queryClient.invalidateQueries({ queryKey: ["admin-notifications"] });
      queryClient.invalidateQueries({ queryKey: ["admin-payments-awaiting"] });
      onNewRef.current?.(payload);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [adminAccessToken, queryClient]);
}
