import type { UserRole } from "@/interfaces/users/user.interface";
import { adminApi } from "@/lib/api-instance";
import { API_ENDPOINTS } from "@/utils/shared";

// Inline type definition for the update payload
interface UpdateUserPayload {
  first_name?: string;
  last_name?: string;
  phone?: { value?: string; isVerified?: boolean };
  email?: { isVerified?: boolean }; // Only allow updating isVerified for email
  avatar?: string | null;
  role?: UserRole;
  lan?: string; // Assuming EnumLanguage is a string
}

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

  async update({
    userId,
    dto,
    avatarFile,
  }: {
    userId: string;
    dto: UpdateUserPayload;
    avatarFile?: File;
  }) {
    try {
      const formData = new FormData();

      if (avatarFile) {
        formData.append("avatar", avatarFile);
      } else if (dto.avatar === null) {
        // Explicitly send null to remove avatar
        formData.append("avatar", "null");
      }

      for (const key in dto) {
        if (Object.prototype.hasOwnProperty.call(dto, key) && key !== "avatar") {
          const value = dto[key as keyof UpdateUserPayload];
          if (value !== undefined) {
            if (typeof value === "object" && value !== null) {
              // For nested objects like phone/email identifiers, stringify them
              formData.append(key, JSON.stringify(value));
            } else {
              formData.append(key, String(value));
            }
          }
        }
      }

      const res = await adminApi.patch(
        `${API_ENDPOINTS.ADMIN.users.base}/${userId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return res.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

export const adminUserService = new AdminUserService();
