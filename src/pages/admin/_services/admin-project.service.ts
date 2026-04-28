import { adminApi } from "@/lib/api-instance";
import type {
  IProject,
  IProjectListResponse,
  TProjectStatus,
} from "@/interfaces/project/project.interface";

class AdminProjectService {
  async list(
    params: {
      page?: number;
      limit?: number;
      developer?: string;
      status?: TProjectStatus;
      search?: string;
    } = {},
  ) {
    const { data } = await adminApi.get<IProjectListResponse>("/projects", {
      params,
    });
    return data;
  }

  async findById(id: string) {
    const { data } = await adminApi.get<IProject>(`/projects/${id}`);
    return data;
  }

  async create(formData: FormData) {
    const { data } = await adminApi.post<IProject>("/projects", formData);
    return data;
  }

  async update(id: string, formData: FormData) {
    const { data } = await adminApi.patch<IProject>(
      `/projects/${id}`,
      formData,
    );
    return data;
  }

  async remove(id: string) {
    const { data } = await adminApi.delete<{ ok: true }>(`/projects/${id}`);
    return data;
  }

  async removePhoto(id: string, url: string) {
    const { data } = await adminApi.delete<IProject>(
      `/projects/${id}/photo`,
      { params: { url } },
    );
    return data;
  }
}

export const adminProjectService = new AdminProjectService();
