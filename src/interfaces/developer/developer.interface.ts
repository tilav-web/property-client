export interface IDeveloper {
  _id: string;
  name: string;
  description?: string;
  logo?: string;
  cover?: string;
  website?: string;
  email?: string;
  phone?: string;
  telegram?: string;
  whatsapp?: string;
  country?: string;
  city?: string;
  projects_count: number;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IDeveloperListResponse {
  items: IDeveloper[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
