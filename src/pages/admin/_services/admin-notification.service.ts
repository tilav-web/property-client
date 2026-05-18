import { adminApi } from "@/lib/api-instance";
import { API_ENDPOINTS } from "@/utils/shared";
import type {
  INotification,
  INotificationsPage,
} from "@/interfaces/notification/notification.interface";

class AdminNotificationService {
  async list(params: { before?: string; limit?: number } = {}): Promise<
    INotificationsPage
  > {
    const { data } = await adminApi.get<INotificationsPage>(
      API_ENDPOINTS.ADMIN.notifications.base,
      { params },
    );
    return data;
  }

  async unreadCount(): Promise<{ count: number }> {
    const { data } = await adminApi.get<{ count: number }>(
      API_ENDPOINTS.ADMIN.notifications.unreadCount,
    );
    return data;
  }

  async markAllRead(): Promise<{ ok: true }> {
    const { data } = await adminApi.patch<{ ok: true }>(
      API_ENDPOINTS.ADMIN.notifications.readAll,
    );
    return data;
  }

  async markRead(id: string): Promise<{ ok: true }> {
    const { data } = await adminApi.patch<{ ok: true }>(
      API_ENDPOINTS.ADMIN.notifications.readOne(id),
    );
    return data;
  }

  async remove(id: string): Promise<{ ok: true }> {
    const { data } = await adminApi.delete<{ ok: true }>(
      API_ENDPOINTS.ADMIN.notifications.remove(id),
    );
    return data;
  }
}

export const adminNotificationService = new AdminNotificationService();
export type { INotification };
