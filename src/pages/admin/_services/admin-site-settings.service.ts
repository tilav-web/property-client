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
  voice_daily_free_limit?: number;
  free_property_limit?: number;
  premium_price?: number;
  premium_duration_days?: number;
  premium_property_discount_percent?: number;
  /** @deprecated premium_price bilan birlashtirilgan */
  voice_premium_price?: number;
  /** @deprecated premium_duration_days bilan birlashtirilgan */
  voice_premium_duration_days?: number;
  app_store_url?: string | null;
  play_store_url?: string | null;
  qr_code_image?: string | null;
  /** Payme fiskal — MXIK kodlari + VAT (tasnif.soliq.uz) */
  premium_mxik?: string;
  premium_package_code?: string;
  property_premium_mxik?: string;
  property_premium_package_code?: string;
  advertise_mxik?: string;
  advertise_package_code?: string;
  vat_percent?: number;
  contact_phones?: string[];
  default_map_lat?: number;
  default_map_lng?: number;
  /** Telegram admin bot — faqat admin GET'da keladi */
  telegram_bot_token?: string | null;
  telegram_admin_chat_ids?: string[];
}

export type HeroSlot = "main" | "buy" | "rent";

class AdminSiteSettingsService {
  async getPublic() {
    const { data } = await publicApi.get<ISiteSettings>("/site-settings");
    return data;
  }

  /** To'liq sozlamalar (telegram bot token bilan) — faqat admin. */
  async getForAdmin() {
    const { data } = await adminApi.get<ISiteSettings>("/site-settings/admin");
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
