import { adminApi } from "@/lib/api-instance";
import type {
  IDeveloper,
  IDeveloperListResponse,
} from "@/interfaces/developer/developer.interface";

class AdminDeveloperService {
  async list(params: { page?: number; limit?: number; search?: string } = {}) {
    const { data } = await adminApi.get<IDeveloperListResponse>(
      "/developers",
      { params },
    );
    return data;
  }

  async findById(id: string) {
    const { data } = await adminApi.get<IDeveloper>(`/developers/${id}`);
    return data;
  }

  async create(formData: FormData) {
    const { data } = await adminApi.post<IDeveloper>("/developers", formData);
    return data;
  }

  async update(id: string, formData: FormData) {
    const { data } = await adminApi.patch<IDeveloper>(
      `/developers/${id}`,
      formData,
    );
    return data;
  }

  async remove(id: string) {
    const { data } = await adminApi.delete<{ ok: true }>(`/developers/${id}`);
    return data;
  }
}

export const adminDeveloperService = new AdminDeveloperService();
