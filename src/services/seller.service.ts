import type { SellerBusinessType } from "@/interfaces/users/seller.interface";
import type { UserLan } from "@/interfaces/users/user.interface";
import apiInstance from "@/lib/api-instance";
import { API_ENDPOINTS } from "@/utils/shared";

class SellerService {
  async createSeller(dto: {
    first_name: string;
    last_name: string;
    phone: string;
    lan: UserLan;
    passport: string;
    business_type: SellerBusinessType;
  }) {
    try {
      const res = await apiInstance.post(API_ENDPOINTS.SELLER.base, dto);
      return res.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async findAll({ page, limit }: { page: number; limit: number }) {
    try {
      const res = await apiInstance.get(API_ENDPOINTS.SELLER.base, {
        params: { page, limit },
      });
      return res.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async findOne(id: string, language: string) {
    try {
      const res = await apiInstance.get(`${API_ENDPOINTS.SELLER.base}/${id}`, {
        params: { language },
      });
      return res.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async findSeller() {
    try {
      const res = await apiInstance.get(API_ENDPOINTS.SELLER.me);
      return res.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async createYttSeller(dto: FormData) {
    try {
      const res = await apiInstance.post(API_ENDPOINTS.SELLER.create_ytt, dto);
      return res.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  async createMchjSeller(dto: FormData) {
    try {
      const res = await apiInstance.post(API_ENDPOINTS.SELLER.create_mchj, dto);
      return res.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  async createSelfEmployedSeller(dto: FormData) {
    try {
      const res = await apiInstance.post(
        API_ENDPOINTS.SELLER.create_self_employed,
        dto
      );
      return res.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async createPhysicalSeller(dto: FormData) {
    try {
      const res = await apiInstance.post(
        API_ENDPOINTS.SELLER.create_physical,
        dto
      );
      return res.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

export const sellerService = new SellerService();
