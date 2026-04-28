import apiInstance from "@/lib/api-instance";
import { API_ENDPOINTS } from "@/utils/shared";

class UserService {
  async login({
    identifier,
    password,
  }: {
    identifier: string;
    password: string;
  }) {
    try {
      const res = await apiInstance.post(API_ENDPOINTS.USER.login, {
        identifier,
        password,
      });
      return res.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async register({
    email,
    phone,
    role,
    password,
  }: {
    email?: string;
    phone?: string;
    role: string;
    password: string;
  }) {
    try {
      const payload: Record<string, string> = { role, password };
      if (email) payload.email = email;
      if (phone) payload.phone = phone;
      const res = await apiInstance.post(API_ENDPOINTS.USER.register, payload);
      return res.data;
    } catch (error) {
      console.error(error);
      throw error;
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
      throw error;
    }
  }

  async optResend(id: string) {
    try {
      const res = await apiInstance.post(API_ENDPOINTS.USER.otpResend, { id });
      return res.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async findMe() {
    try {
      const res = await apiInstance.get(API_ENDPOINTS.USER.me);
      return res.data;
    } catch (error) {
      throw error;
    }
  }

  async refreshToken() {
    try {
      const res = await apiInstance.post(API_ENDPOINTS.USER.refreshToken);
      return res.data;
    } catch (error) {
      throw error;
    }
  }

  async update(dto: FormData) {
    try {
      const res = await apiInstance.put(API_ENDPOINTS.USER.base, dto);
      return res.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async logout() {
    try {
      const res = await apiInstance.post(API_ENDPOINTS.USER.logout);
      return res.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async forgotPassword(identifier: string) {
    try {
      const res = await apiInstance.post(
        `${API_ENDPOINTS.USER.base}/forgot-password`,
        { identifier }
      );
      return res.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async resetPassword({
    userId,
    code,
    newPassword,
  }: {
    userId: string;
    code: string;
    newPassword: string;
  }) {
    try {
      const res = await apiInstance.post(
        `${API_ENDPOINTS.USER.base}/reset-password`,
        { userId, code, newPassword }
      );
      return res.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async changePassword({
    currentPassword,
    newPassword,
  }: {
    currentPassword: string;
    newPassword: string;
  }) {
    const res = await apiInstance.post(
      `${API_ENDPOINTS.USER.base}/change-password`,
      { currentPassword, newPassword }
    );
    return res.data;
  }

  googleLogin() {
    window.location.href = API_ENDPOINTS.USER.auth.google;
  }

  facebookLogin() {
    window.location.href = API_ENDPOINTS.USER.auth.facebook;
  }

  appleLogin() {
    window.location.href = API_ENDPOINTS.USER.auth.apple;
  }
}

export const userService = new UserService();
