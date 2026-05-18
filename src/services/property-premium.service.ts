import apiInstance from "@/lib/api-instance";
import { API_ENDPOINTS } from "@/utils/shared";
import type { IStartPremiumUpgradeResult } from "@/interfaces/payment/payment.interface";

class PropertyPremiumService {
  /**
   * E'lonni premium qilish uchun to'lov boshlash. Server Transaction
   * yaratadi va Payme checkout URL qaytaradi. Foydalanuvchi shu URL'ga
   * o'tib to'laydi.
   */
  async startUpgrade(propertyId: string): Promise<IStartPremiumUpgradeResult> {
    const res = await apiInstance.post(
      API_ENDPOINTS.PROPERTIES.upgradePremium(propertyId),
    );
    return res.data;
  }
}

export const propertyPremiumService = new PropertyPremiumService();
