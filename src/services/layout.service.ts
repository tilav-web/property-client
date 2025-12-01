import apiInstance from '@/lib/api-instance';
import type { IAdvertise } from '@/interfaces/advertise/advertise.interface';
import type {
  IProperty,
  PropertyCategory,
  PropertyPriceType,
  PropertyPurpose,
} from '@/interfaces/property/property.interface';
import { API_ENDPOINTS } from '@/utils/shared';
import type { IPagination } from '@/interfaces/pagination.interface';

interface MainPageLayout {
  properties: IProperty[];
  asideAds: IAdvertise[];
  bannerAds: IAdvertise[];
}

interface FilterNavLayout {
  properties: IProperty[];
  imageAds: IAdvertise[];
  bannerAds: IAdvertise[];
}

interface CategoryPageLayout {
  properties: IProperty[];
  pagination: IPagination;
  imageAd: IAdvertise | null;
  bannerAd: IAdvertise | null;
}

class LayoutService {
  async getMainPageLayout(category?: PropertyCategory | null) {
    const { data } = await apiInstance.get<MainPageLayout>(
      API_ENDPOINTS.LAYOUT.mainPage,
      {
        params: { category },
      },
    );
    return data;
  }

  async getFilterNavLayout(params: {
    purpose?: PropertyPurpose | null;
    category?: PropertyCategory | null;
    price_type?: PropertyPriceType | null;
  }) {
    const { data } = await apiInstance.get<FilterNavLayout>(
      API_ENDPOINTS.LAYOUT.filterNav,
      { params },
    );
    return data;
  }

  async getCategoryPageLayout(params: {
    category?: PropertyCategory | null;
    page?: number;
  }) {
    const { data } = await apiInstance.get<CategoryPageLayout>(
      API_ENDPOINTS.LAYOUT.categoryPage,
      { params },
    );
    return data;
  }
}

export const layoutService = new LayoutService();
