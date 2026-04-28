import apiInstance, { publicApi } from "@/lib/api-instance";
import type {
  IProject,
  IProjectListResponse,
  ICreateProjectInquiry,
  TProjectStatus,
} from "@/interfaces/project/project.interface";

interface ListParams {
  page?: number;
  limit?: number;
  search?: string;
  developer?: string;
  city?: string;
  status?: TProjectStatus;
  is_featured?: boolean;
  sort?: "newest" | "oldest" | "price_asc" | "price_desc" | "popular";
}

class ProjectService {
  async list(params: ListParams = {}) {
    const res = await publicApi.get<IProjectListResponse>("/projects", {
      params,
    });
    return res.data;
  }

  async findById(id: string) {
    const res = await publicApi.get<IProject>(`/projects/${id}`);
    return res.data;
  }

  async submitInquiry(dto: ICreateProjectInquiry) {
    // Foydalanuvchi login bo'lsa apiInstance, bo'lmasa publicApi.
    // Backend authent talab qilmaydi — ikkalasi ham ishlaydi.
    const res = await publicApi.post(`/project-inquiries`, dto);
    return res.data;
  }

  // Admin
  async create(data: FormData) {
    const res = await apiInstance.post<IProject>("/projects", data);
    return res.data;
  }

  async update(id: string, data: FormData) {
    const res = await apiInstance.patch<IProject>(`/projects/${id}`, data);
    return res.data;
  }

  async remove(id: string) {
    const res = await apiInstance.delete<{ ok: true }>(`/projects/${id}`);
    return res.data;
  }
}

export const projectService = new ProjectService();
