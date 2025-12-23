import apiInstance from "@/lib/api-instance";
import { API_ENDPOINTS } from "@/utils/shared";

class AdminService {
  async login({ email, password }: { email: string; password: string }) {
    try {
      const res = await apiInstance.post(API_ENDPOINTS.ADMIN.login, {
        email,
        password,
      });
      return res.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

export const adminService = new AdminService();
