import { publicApi } from "@/lib/api-instance";

export interface ICommunityFilter {
  _id: string;
  key: string;
  name: string;
  icon: string;
  order: number;
  isActive: boolean;
}

export interface ICommunity {
  _id: string;
  name: string;
  region: string;
  image: string | null;
  rating: number;
  description: string;
  badge: string | null;
  searchHref: string | null;
  filters: Array<Pick<ICommunityFilter, "_id" | "key" | "name" | "icon"> | string>;
  propertyCount: number;
  order: number;
  isActive: boolean;
}

class CommunityService {
  async listFilters() {
    const { data } = await publicApi.get<ICommunityFilter[]>(
      "/communities/filters",
    );
    return data;
  }

  async list(opts: { region?: string; filter?: string } = {}) {
    const params = new URLSearchParams();
    if (opts.region) params.set("region", opts.region);
    if (opts.filter) params.set("filter", opts.filter);
    const qs = params.toString();
    const { data } = await publicApi.get<ICommunity[]>(
      `/communities${qs ? `?${qs}` : ""}`,
    );
    return data;
  }
}

export const communityService = new CommunityService();
