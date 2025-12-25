import { adminApi } from "@/lib/api-instance";
import { API_ENDPOINTS } from "@/utils/shared";

class AdminService {
  async login({ email, password }: { email: string; password: string }) {
    try {
      const res = await adminApi.post(API_ENDPOINTS.ADMIN.login, {
        email,
        password,
      });
      return res.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getProfile() {
    try {
      const res = await adminApi.get(API_ENDPOINTS.ADMIN.profile);
      return res.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async logout() {
    try {
      const res = await adminApi.post(API_ENDPOINTS.ADMIN.logout);
      return res.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

export const adminService = new AdminService();
