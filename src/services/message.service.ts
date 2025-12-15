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

  async findMessageStatus() {
    try {
      const res = await apiInstance.get(API_ENDPOINTS.MESSAGE.status.base);
      return res.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async findMessageByProperty(id: string, page = 1, limit = 15) {
    try {
      const res = await apiInstance.get(
        `${API_ENDPOINTS.MESSAGE.findMessageByProperty(
          id,
        )}?page=${page}&limit=${limit}`,
      );
      return res.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async findMessageUnread() {
    try {
      const res = await apiInstance.get(API_ENDPOINTS.MESSAGE.status.readCount);
      return res.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async deleteStatusMessageById(id: string) {
    try {
      const res = await apiInstance.delete(
        `${API_ENDPOINTS.MESSAGE.status.deleteOne}/${id}`
      );
      return res.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async deleteStatusMessageAll() {
    try {
      const res = await apiInstance.delete(
        API_ENDPOINTS.MESSAGE.status.deleteAll
      );
      return res.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async readMessageStatus(id: string) {
    try {
      const res = await apiInstance.get(
        `${API_ENDPOINTS.MESSAGE.status.readOne}/${id}`
      );
      return res.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async readMessageStatusAll() {
    try {
      const res = await apiInstance.get(API_ENDPOINTS.MESSAGE.status.readAll);
      return res.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
export const messageService = new MessageService();
