import apiInstance from "@/lib/api-instance";
import { API_ENDPOINTS } from "@/utils/shared";

class MessageService {
  async create(dto: { property: string; comment: string; rating: number }) {
    try {
      const res = await apiInstance.post(API_ENDPOINTS.PROPERTIES.message, dto);
      return res.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async findMessageStatus(is_read: boolean) {
    try {
      const res = await apiInstance.get(API_ENDPOINTS.MESSAGE.status, {
        params: {
          is_read,
        },
      });
      return res.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
export const messageService = new MessageService();
