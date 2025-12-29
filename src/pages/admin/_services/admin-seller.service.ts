import { adminApi } from '@/lib/api-instance';
import { API_ENDPOINTS } from '@/utils/shared';
import type { ISeller } from '@/interfaces/users/seller.interface';

class AdminSellerService {
  async getSellers(
    params: any,
  ): Promise<{
    sellers: ISeller[];
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  }> {
    const { data } = await adminApi.get(API_ENDPOINTS.ADMIN.sellers, { params });
    return data;
  }

  async findOne(id: string): Promise<ISeller> {
    const { data } = await adminApi.get(
      `${API_ENDPOINTS.ADMIN.sellers}/${id}`,
    );
    return data;
  }

  async updateSeller(
    id: string,
    payload: Partial<ISeller>,
  ): Promise<ISeller> {
    const { data } = await adminApi.patch(
      `${API_ENDPOINTS.ADMIN.sellers}/${id}`,
      payload,
    );
    return data;
  }
}

export const adminSellerService = new AdminSellerService();
