import apiInstance from "@/lib/api-instance";
import { API_ENDPOINTS } from "@/utils/shared";
import type { TInquiryType } from "@/interfaces/inquiry/inquiry.interface";

export interface CreateInquiryDto {
  property: string;
  type: TInquiryType;
  comment: string;
  offered_price?: number;
  rental_period?: { from: Date; to: Date };
}

class InquiryService {
  async create(dto: CreateInquiryDto) {
    try {
      const res = await apiInstance.post(API_ENDPOINTS.INQUIRY.base, dto);
      return res.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async findSellerInquiries() {
    try {
      const res = await apiInstance.get(API_ENDPOINTS.INQUIRY.base);
      return res.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async findMySentInquiries() {
    try {
      const res = await apiInstance.get(API_ENDPOINTS.INQUIRY.mySent);
      return res.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

export const inquiryService = new InquiryService();
