import { adminApi, publicApi } from "@/lib/api-instance";

export interface ISiteSettings {
  _id?: string;
  hero_image?: string | null;
  hero_image_srcset?: string | null;
  hero_title_override?: string | null;
  hero_subtitle_override?: string | null;
  hero_image_buy?: string | null;
  hero_image_buy_srcset?: string | null;
  hero_image_rent?: string | null;
  hero_image_rent_srcset?: string | null;
}

export type HeroSlot = "main" | "buy" | "rent";

class AdminSiteSettingsService {
  async getPublic() {
    const { data } = await publicApi.get<ISiteSettings>("/site-settings");
    return data;
  }

  async update(formData: FormData) {
    const { data } = await adminApi.patch<ISiteSettings>(
      "/site-settings",
      formData,
    );
    return data;
  }

  async clearHero(slot: HeroSlot = "main") {
    const { data } = await adminApi.delete<ISiteSettings>(
      `/site-settings/hero-image/${slot}`,
    );
    return data;
  }
}

export const adminSiteSettingsService = new AdminSiteSettingsService();
