import type { UserRole } from "@/interfaces/users/user.interface";
import { adminApi } from "@/lib/api-instance";
import { API_ENDPOINTS } from "@/utils/shared";

class AdminUserService {
  async findUsers(params: {
    page?: number;
    limit?: number;
    role?: UserRole;
    search?: string;
  }) {
    try {
      const res = await adminApi.get(API_ENDPOINTS.ADMIN.users.base, {
        params,
      });
      return res.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

export const adminUserService = new AdminUserService();
