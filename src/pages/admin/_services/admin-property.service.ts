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

  async findBySeller(sellerId: string): Promise<IAdminProperty[]> {
    const { data } = await adminApi.get(
      `${API_ENDPOINTS.ADMIN.properties}/seller/${sellerId}`,
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
    payload: Partial<IAdminProperty>, // Changed to Partial<IAdminProperty>
  ): Promise<IAdminProperty> { // Changed to IAdminProperty
    const { data } = await adminApi.put( // Changed from patch to put
      `${API_ENDPOINTS.ADMIN.properties}/${id}`,
      payload,
    );
    return data;
  }
}

export const adminPropertyService = new AdminPropertyService();