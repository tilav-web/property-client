import { adminApi } from "@/lib/api-instance";

export type TProjectInquiryStatus =
  | "new"
  | "seen"
  | "contacted"
  | "closed";

export interface IAdminProjectInquiry {
  _id: string;
  project: { _id: string; name: string };
  user?: string;
  full_name: string;
  email?: string;
  phone?: string;
  contact_method: "chat" | "email" | "phone" | "whatsapp" | "telegram";
  message?: string;
  status: TProjectInquiryStatus;
  createdAt: string;
}

interface ListResponse {
  items: IAdminProjectInquiry[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

class AdminProjectInquiryService {
  async list(
    params: {
      page?: number;
      limit?: number;
      status?: TProjectInquiryStatus;
    } = {},
  ) {
    const { data } = await adminApi.get<ListResponse>(
      "/project-inquiries",
      { params },
    );
    return data;
  }

  async updateStatus(id: string, status: TProjectInquiryStatus) {
    const { data } = await adminApi.patch<IAdminProjectInquiry>(
      `/project-inquiries/${id}/status`,
      { status },
    );
    return data;
  }
}

export const adminProjectInquiryService = new AdminProjectInquiryService();
