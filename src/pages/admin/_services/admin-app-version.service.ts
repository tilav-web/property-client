import { adminApi } from "@/lib/api-instance";

export type AppPlatform = "ios" | "android";

export interface AppVersionRecord {
  _id?: string;
  platform: AppPlatform;
  version: string;
  store_url: string;
  is_force_update: boolean;
  release_notes: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpsertAppVersionDto {
  platform: AppPlatform;
  version: string;
  store_url: string;
  is_force_update: boolean;
  release_notes?: string | null;
}

class AdminAppVersionService {
  async getAll(): Promise<AppVersionRecord[]> {
    const { data } = await adminApi.get<AppVersionRecord[]>("/admins/app-version");
    return data;
  }

  async upsert(dto: UpsertAppVersionDto): Promise<AppVersionRecord> {
    const { data } = await adminApi.put<AppVersionRecord>("/admins/app-version", dto);
    return data;
  }
}

export const adminAppVersionService = new AdminAppVersionService();
