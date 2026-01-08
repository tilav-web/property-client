import apiInstance from "@/lib/api-instance";
import { API_ENDPOINTS } from "@/utils/shared";

class InquiryResponseService {
  async createInquiryResponse(dto: any) {
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
