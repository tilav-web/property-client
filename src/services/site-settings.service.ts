import { publicApi } from "@/lib/api-instance";

export interface ISiteSettings {
  hero_image?: string | null;
  hero_image_srcset?: string | null;
  hero_title_override?: string | null;
  hero_subtitle_override?: string | null;
  hero_image_buy?: string | null;
  hero_image_buy_srcset?: string | null;
  hero_image_rent?: string | null;
  hero_image_rent_srcset?: string | null;
}

class SiteSettingsService {
  async get() {
    const res = await publicApi.get<ISiteSettings>("/site-settings");
    return res.data;
  }
}

export const siteSettingsService = new SiteSettingsService();
