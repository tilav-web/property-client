import { adminApi } from '@/lib/api-instance';
import { API_ENDPOINTS } from '@/utils/shared';
import type { IAdminProperty } from '@/interfaces/admin/property/admin-property.interface'; // Import IAdminProperty

class AdminPropertyService {
  async getProperties(
    params: any,
  ): Promise<{
    properties: IAdminProperty[]; // Changed to IAdminProperty[]
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  }> {
    const { data } = await adminApi.get(API_ENDPOINTS.ADMIN.properties, { params });
    return data;
  }

  async findByUser(userId: string): Promise<IAdminProperty[]> {
    const { data } = await adminApi.get(
      `${API_ENDPOINTS.ADMIN.properties}/user/${userId}`,
    );
    return data;
  }

  async findOne(id: string): Promise<IAdminProperty> {
    const { data } = await adminApi.get(
      `${API_ENDPOINTS.ADMIN.properties}/${id}`,
    );
    return data;
  }

  async updateProperty(
    id: string,
    payload: Partial<IAdminProperty>,
  ): Promise<IAdminProperty> {
    const { data } = await adminApi.put(
      `${API_ENDPOINTS.ADMIN.properties}/${id}`,
      payload,
    );
    return data;
  }

  async updateStatus(
    id: string,
    status: 'APPROVED' | 'REJECTED' | 'PENDING',
  ): Promise<IAdminProperty> {
    const { data } = await adminApi.put(
      `${API_ENDPOINTS.ADMIN.properties}/${id}`,
      { status },
    );
    return data;
  }
}

export const adminPropertyService = new AdminPropertyService();