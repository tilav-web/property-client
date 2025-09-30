import apiInstance from "@/lib/api-instance";
import { API_ENDPOINTS } from "@/utils/shared";

class UserService {
  async login({ email, password }: { email: string; password: string }) {
    try {
      const res = await apiInstance.post(API_ENDPOINTS.USER.login, {
        email,
        password,
      });
      return res.data;
    } catch (error) {
      console.error(error);
    }
  }

  async register({
    email,
    role,
    password,
  }: {
    email: string;
    role: string;
    password: string;
  }) {
    try {
      const res = await apiInstance.post(API_ENDPOINTS.USER.register, {
        email,
        role,
        password,
      });
      return res.data;
    } catch (error) {
      console.error(error);
    }
  }

  async otpConfirm({ id, code }: { id: string; code: string }) {
    try {
      const res = await apiInstance.post(API_ENDPOINTS.USER.otpConfirm, {
        id,
        code,
      });
      return res.data;
    } catch (error) {
      console.error(error);
    }
  }

  async optResend(id: string) {
    try {
      const res = await apiInstance.post(API_ENDPOINTS.USER.otpResend, { id });
      return res.data;
    } catch (error) {
      console.error(error);
    }
  }
}

export const userService = new UserService();
