import { adminApi } from "@/lib/api-instance";
import type {
  ICommunity,
  ICommunityFilter,
} from "@/services/community.service";

const BASE = "/communities/admin";

class AdminCommunityService {
  // Filters
  async listFilters() {
    const { data } = await adminApi.get<ICommunityFilter[]>(`${BASE}/filters`);
    return data;
  }

  async createFilter(payload: Partial<ICommunityFilter>) {
    const { data } = await adminApi.post<ICommunityFilter>(
      `${BASE}/filters`,
      payload,
    );
    return data;
  }

  async updateFilter(id: string, payload: Partial<ICommunityFilter>) {
    const { data } = await adminApi.patch<ICommunityFilter>(
      `${BASE}/filters/${id}`,
      payload,
    );
    return data;
  }

  async deleteFilter(id: string) {
    await adminApi.delete(`${BASE}/filters/${id}`);
  }

  // Communities
  async list() {
    const { data } = await adminApi.get<ICommunity[]>(`${BASE}`);
    return data;
  }

  async getOne(id: string) {
    const { data } = await adminApi.get<ICommunity>(`${BASE}/${id}`);
    return data;
  }

  async create(formData: FormData) {
    const { data } = await adminApi.post<ICommunity>(`${BASE}`, formData);
    return data;
  }

  async update(id: string, formData: FormData) {
    const { data } = await adminApi.patch<ICommunity>(
      `${BASE}/${id}`,
      formData,
    );
    return data;
  }

  async delete(id: string) {
    await adminApi.delete(`${BASE}/${id}`);
  }
}

export const adminCommunityService = new AdminCommunityService();
