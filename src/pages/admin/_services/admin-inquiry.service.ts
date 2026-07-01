import { adminApi } from '@/lib/api-instance';
import { API_ENDPOINTS } from '@/utils/shared';

export interface IAdminInquiry {
  _id: string;
  type: 'purchase' | 'rent' | 'mortgage';
  status: 'pending' | 'viewed' | 'responded' | 'accepted' | 'rejected' | 'canceled';
  offered_price?: number;
  rental_period?: { from: string; to: string };
  comment: string;
  createdAt: string;
  updatedAt: string;
  user: { _id: string; first_name: string; last_name: string; avatar?: string };
  seller: { _id: string; first_name: string; last_name: string; avatar?: string };
  property: { _id: string; title: string; photos?: string[] };
  response?: {
    _id: string;
    status: 'approved' | 'rejected';
    description: string;
    createdAt: string;
  };
}

class AdminInquiryService {
  async findAll(params: {
    page?: number;
    limit?: number;
    status?: string;
    type?: string;
  }): Promise<{ items: IAdminInquiry[]; total: number; page: number; limit: number; hasMore: boolean }> {
    const { data } = await adminApi.get(API_ENDPOINTS.ADMIN.inquiries, { params });
    return data;
  }
}

export const adminInquiryService = new AdminInquiryService();
