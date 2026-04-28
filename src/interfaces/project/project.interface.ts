import type { IDeveloper } from "../developer/developer.interface";

export type TProjectStatus =
  | "pre_launch"
  | "on_sale"
  | "sold_out"
  | "completed";

export type TProjectUnitCategory =
  | "apartment"
  | "townhouse"
  | "villa"
  | "penthouse"
  | "studio"
  | "office";

export interface IProjectUnitType {
  category: TProjectUnitCategory;
  bedrooms_min?: number;
  bedrooms_max?: number;
  area_min?: number;
  area_max?: number;
  price_from?: number;
  count?: number;
}

export interface IProjectPaymentPlan {
  name: string;
  deposit_percent?: number;
  description?: string;
}

export interface IProject {
  _id: string;
  // After populate(developer): full IDeveloper. List view: only {_id, name, logo}
  developer:
    | IDeveloper
    | { _id: string; name: string; logo?: string };
  name: string;
  description?: string;
  address?: string;
  country?: string;
  city?: string;
  location?: { type: string; coordinates: [number, number] };
  delivery_date?: string;
  status: TProjectStatus;
  launch_price?: number;
  currency?: string;
  unit_types: IProjectUnitType[];
  payment_plans: IProjectPaymentPlan[];
  photos: string[];
  brochure?: string;
  video_url?: string;
  is_featured: boolean;
  views: number;
  createdAt: string;
  updatedAt: string;
}

export interface IProjectListResponse {
  items: IProject[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type TContactMethod =
  | "chat"
  | "email"
  | "phone"
  | "whatsapp"
  | "telegram";

export interface ICreateProjectInquiry {
  project: string;
  full_name: string;
  contact_method: TContactMethod;
  email?: string;
  phone?: string;
  message?: string;
}
