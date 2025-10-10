import apiInstance from "@/lib/api-instance";
import { API_ENDPOINTS } from "@/utils/shared";

class BankAccountService {
  async create(dto: {
    account_number: string;
    bank_name: string;
    mfo: string;
    owner_full_name: string;
    swift_code: string;
  }) {
    try {
      const res = await apiInstance.post(API_ENDPOINTS.BANK_ACCOUNT.base, dto);
      return res.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
export const bankAccountService = new BankAccountService();
