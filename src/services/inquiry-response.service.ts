import apiInstance from "@/lib/api-instance";
import { API_ENDPOINTS } from "@/utils/shared";
import type { TInquiryResponseStatus } from "@/interfaces/inquiry/inquiry-response.interface";

export interface CreateInquiryResponseDto {
  status: TInquiryResponseStatus;
  description: string;
  user: string;
  inquiry: string;
  property: string;
}

class InquiryResponseService {
  async createInquiryResponse(dto: CreateInquiryResponseDto) {
    const response = await apiInstance.post(
      API_ENDPOINTS.INQUIRY_RESPONSE.base,
      dto
    );
    return response.data;
  }

  async findMyInquiryResponses() {
    const response = await apiInstance.get(API_ENDPOINTS.INQUIRY.myResponses);
    return response.data;
  }
}

export const inquiryResponseService = new InquiryResponseService();
