import type { IAdmin } from "@/interfaces/admin/admin.interface";
import { adminApi } from "@/lib/api-instance";
import { API_ENDPOINTS } from "@/utils/shared";

class AdminService {
  async getAdmins(): Promise<IAdmin[]> {
    const { data } = await adminApi.get<IAdmin[]>(API_ENDPOINTS.ADMIN.admins);
    return data;
  }

  async createAdmin(dto: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
  }): Promise<IAdmin> {
    const { data } = await adminApi.post<IAdmin>(API_ENDPOINTS.ADMIN.admins, dto);
    return data;
  }

  async updateAdmin(id: string, dto: {
    first_name?: string;
    last_name?: string;
    email?: string;
    password?: string;
  }): Promise<IAdmin> {
    const { data } = await adminApi.patch<IAdmin>(`${API_ENDPOINTS.ADMIN.admins}/${id}`, dto);
    return data;
  }

  async deleteAdmin(id: string): Promise<void> {
    await adminApi.delete(`${API_ENDPOINTS.ADMIN.admins}/${id}`);
  }

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

  async getDashboardStatistics() {
    try {
      const res = await adminApi.get(API_ENDPOINTS.ADMIN.statistics.dashboard);
      return res.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async changePassword({
    oldPassword,
    newPassword,
  }: {
    oldPassword: string;
    newPassword: string;
  }) {
    try {
      const res = await adminApi.post(API_ENDPOINTS.ADMIN.changePassword, {
        oldPassword,
        newPassword,
      });
      return res.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

export const adminService = new AdminService();