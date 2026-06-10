import { adminApi } from "@/lib/api-instance";

export interface SendBroadcastPayload {
  title: string;
  body: string;
  imageUrl?: string;
  targetGroup: "all" | "premium";
}

export interface BroadcastItem {
  _id: string;
  title: string;
  body: string;
  imageUrl?: string;
  targetGroup: "all" | "premium";
  sentCount: number;
  createdAt: string;
}

class AdminPushService {
  async send(payload: SendBroadcastPayload) {
    const { data } = await adminApi.post<{
      success: boolean;
      sentCount: number;
      broadcastId: string;
    }>("/admins/push-notifications", payload);
    return data;
  }

  async list() {
    const { data } = await adminApi.get<{ items: BroadcastItem[] }>(
      "/admins/push-notifications",
    );
    return data;
  }
}

export const adminPushService = new AdminPushService();
