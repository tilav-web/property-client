import { adminApi } from '@/lib/api-instance';
import type { ITag } from '@/interfaces/tag/tag.interface';

class AdminTagService {
  async getAll(params: { page: number; limit: number; q?: string }) {
    const { data } = await adminApi.get('/admins/tags', { params });
    return data;
  }

  async create(value: string): Promise<ITag> {
    const { data } = await adminApi.post<ITag>('/admins/tags', { value });
    return data;
  }

  async remove(id: string): Promise<{ message: string }> {
    const { data } = await adminApi.delete<{ message: string }>(`/admins/tags/${id}`);
    return data;
  }
}

export const adminTagService = new AdminTagService();
