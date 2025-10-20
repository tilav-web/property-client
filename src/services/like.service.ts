import apiInstance from "@/lib/api-instance";

class LikeService {
  async findMyLikes() {
    try {
      const res = await apiInstance.get("/likes");
      return res.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async toggleLike(id: string) {
    try {
      const res = await apiInstance.post(`/likes/${id}`);
      return res.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

export const likeService = new LikeService();
