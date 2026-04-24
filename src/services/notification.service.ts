import apiInstance from "@/lib/api-instance";
import type {
  INotification,
  INotificationsPage,
} from "@/interfaces/notification/notification.interface";

const BASE = "/notifications";

class NotificationService {
  async list(opts: {
    before?: string;
    limit?: number;
  } = {}): Promise<INotificationsPage> {
    const res = await apiInstance.get<INotificationsPage>(BASE, {
      params: opts,
    });
    return res.data;
  }

  async unreadCount(): Promise<number> {
    const res = await apiInstance.get<{ count: number }>(
      `${BASE}/unread-count`,
    );
    return res.data?.count ?? 0;
  }

  async markRead(id: string): Promise<void> {
    await apiInstance.patch(`${BASE}/${id}/read`);
  }

  async markAllRead(): Promise<void> {
    await apiInstance.patch(`${BASE}/read-all`);
  }

  async remove(id: string): Promise<void> {
    await apiInstance.delete(`${BASE}/${id}`);
  }

  // Helper: populate after receiving a socket event
  async prepend(id: string): Promise<INotification | null> {
    try {
      const page = await this.list({ limit: 1 });
      const item = page.items.find((n) => n._id === id);
      return item ?? null;
    } catch {
      return null;
    }
  }
}

export const notificationService = new NotificationService();
