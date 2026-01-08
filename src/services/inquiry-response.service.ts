import apiInstance from '@/lib/api-instance';
import type { CreateInquiryResponseDto } from '@/modules/inquiry/dto/create-inquiry-response.dto';
import { API_ENDPOINTS } from '@/utils/shared';

class InquiryResponseService {
  async createInquiryResponse(dto: CreateInquiryResponseDto) {
    const response = await apiInstance.post(API_ENDPOINTS.INQUIRY_RESPONSE.base, dto);
    return response.data;
  }

  async findMyInquiryResponses() {
    const response = await apiInstance.get(API_ENDPOINTS.INQUIRY.myResponses);
    return response.data;
  }
}

export const inquiryResponseService = new InquiryResponseService();
