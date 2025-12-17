import apiInstance from "@/lib/api-instance";
import { API_ENDPOINTS } from "@/utils/shared";

class TagService {
  async findTags() {
    try {
      const res = await apiInstance.get(API_ENDPOINTS.PROPERTIES.tags.findTags);
      return res.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
export const tagService = new TagService();
