import apiInstance from "@/lib/api-instance";

class SaveService {
  async findMySaves() {
    try {
      const res = await apiInstance.get("/saves");
      return res.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async toggleSave(id: string) {
    try {
      const res = await apiInstance.post(`/saves/${id}`);
      return res.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

export const saveService = new SaveService();
