import { adminApi } from '@/lib/api-instance';
import { API_ENDPOINTS } from '@/utils/shared';
import type { IProperty } from '@/interfaces/property/property.interface';

class AdminPropertyService {
  async getProperties(
    params: any,
  ): Promise<{
    properties: IProperty[];
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  }> {
    const { data } = await adminApi.get(API_ENDPOINTS.ADMIN.properties, { params });
    return data;
  }

  async updateProperty(
    id: string,
    payload: Partial<IProperty>,
  ): Promise<IProperty> {
    const { data } = await adminApi.patch(
      `${API_ENDPOINTS.ADMIN.properties}/${id}`,
      payload,
    );
    return data;
  }
}

export const adminPropertyService = new AdminPropertyService();