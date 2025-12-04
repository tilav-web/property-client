import type { PropertyType } from "@/interfaces/property/property.interface";
import apiInstance from "@/lib/api-instance";
import { API_ENDPOINTS } from "@/utils/shared";

interface PaginatedPropertiesResponse {
  totalItems: number;
  totalPages: number;
  page: number;
  limit: number;
  properties: PropertyType[];
}

class AiPropertyService {
  async findPropertWithPrompt(
    prompt: string,
    page: number = 1,
    limit: number = 5
  ): Promise<PaginatedPropertiesResponse> {
    const res = await apiInstance.post(
      API_ENDPOINTS.AI_PROPERTY.searchProperty,
      {
        prompt,
        page,
        limit,
      }
    );
    return res.data;
  }
}

export const aiPropertyService = new AiPropertyService();
