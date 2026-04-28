import apiInstance, { publicApi } from "@/lib/api-instance";
import type {
  IDeveloper,
  IDeveloperListResponse,
} from "@/interfaces/developer/developer.interface";

class DeveloperService {
  async list(params: { page?: number; limit?: number; search?: string } = {}) {
    const res = await publicApi.get<IDeveloperListResponse>("/developers", {
      params,
    });
    return res.data;
  }

  async findById(id: string) {
    const res = await publicApi.get<IDeveloper>(`/developers/${id}`);
    return res.data;
  }

  // Admin operations
  async create(data: FormData) {
    const res = await apiInstance.post<IDeveloper>("/developers", data);
    return res.data;
  }

  async update(id: string, data: FormData) {
    const res = await apiInstance.patch<IDeveloper>(`/developers/${id}`, data);
    return res.data;
  }

  async remove(id: string) {
    const res = await apiInstance.delete<{ ok: true }>(`/developers/${id}`);
    return res.data;
  }
}

export const developerService = new DeveloperService();
