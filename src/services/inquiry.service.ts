import apiInstance from "@/lib/api-instance";
import type { IInquiry, TInquiryType } from "@/interfaces/inquiry.interface";

export interface CreateInquiryDto {
  property: string; // The property ID
  type: TInquiryType;
  comment: string;
  offered_price?: number;
  rental_period?: { from: Date; to: Date };
}

class InquiryService {
  async create(dto: CreateInquiryDto) {
    try {
      const res = await apiInstance.post("/inquiry", dto);
      return res.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async findSellerInquiries(
    page: number = 1,
    limit: number = 10
  ): Promise<{ inquiries: IInquiry[]; total: number }> {
    try {
      const res = await apiInstance.get("/inquiry", {
        params: { page, limit },
      });
      return res.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

export const inquiryService = new InquiryService();
