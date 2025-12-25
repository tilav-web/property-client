import { adminApi } from '@/lib/api-instance';
import { API_ENDPOINTS } from '@/utils/shared';
import type { IAdvertise, AdvertiseStatus, PaymentStatus } from '@/interfaces/advertise/advertise.interface';
import { type IUser } from '@/interfaces/users/user.interface';
import { type IProperty } from '@/interfaces/property/property.interface';

// The backend populates author and target, so we create a more detailed interface here
export interface IAdminAdvertise extends Omit<IAdvertise, 'author' | 'target'> {
  author: IUser;
  target: IProperty;
}

class AdminAdvertiseService {
  async getAdvertises(
    params: any,
  ): Promise<{
    advertises: IAdminAdvertise[];
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  }> {
    const { data } = await adminApi.get(API_ENDPOINTS.ADMIN.advertises, { params });
    return data;
  }

  async updateStatus(
    id: string,
    data: { status?: AdvertiseStatus; paymentStatus?: PaymentStatus },
  ): Promise<IAdminAdvertise> {
    const response = await adminApi.put(`${API_ENDPOINTS.ADMIN.advertises}/${id}/status`, data);
    return response.data;
  }
}

export const adminAdvertiseService = new AdminAdvertiseService();
