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
      throw error;
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
      console.error(error);
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

