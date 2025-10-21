import { create } from "zustand";

interface ILanguage {
  uz: string;
  ru: string;
  en: string;
}

interface ICreateProperty {
  // Tillar uchun yangi interfeys
  title?: ILanguage;
  description?: ILanguage;
  address?: ILanguage;
  
  // Qolgan maydonlar
  category?: string;
  location?: { type: "Point"; coordinates: [number, number] };
  price?: number;
  price_type?: string;
  purpose?: string;
  area?: number;
  bedrooms?: number;
  bathrooms?: number;
  floor_level?: number;
  amenities?: string[];
  construction_status?: string;
  year_built?: number; // string emas, number
  parking_spaces?: number;
  logo?: string;
  delivery_date?: string;
  sales_date?: string;
  payment_plans?: number;
  region?: string;
  district?: string;

  /** ✅ yangi qiymatlar: media fayllar */
  banner?: File | null;
  photos?: File[];
  video?: File | null;
}

interface CreatePropertyState {
  data: ICreateProperty | null;
  updateData: (partialData: Partial<ICreateProperty>) => void;
  resetData: () => void;
  
  // Til maydonlarini yangilash uchun helper funksiyalar
  updateTitle: (lang: keyof ILanguage, value: string) => void;
  updateDescription: (lang: keyof ILanguage, value: string) => void;
  updateAddress: (lang: keyof ILanguage, value: string) => void;
}

export const useCreatePropertyStore = create<CreatePropertyState>((set) => ({
  data: null,
  
  updateData: (partialData) =>
    set((state) => ({
      data: { ...(state.data || {}), ...partialData },
    })),
    
  resetData: () => set({ data: null }),
  
  // Title ni yangilash
  updateTitle: (lang, value) =>
    set((state) => ({
      data: {
        ...(state.data || {}),
        title: {
          ...(state.data?.title || { uz: "", ru: "", en: "" }),
          [lang]: value,
        },
      },
    })),
  
  // Description ni yangilash
  updateDescription: (lang, value) =>
    set((state) => ({
      data: {
        ...(state.data || {}),
        description: {
          ...(state.data?.description || { uz: "", ru: "", en: "" }),
          [lang]: value,
        },
      },
    })),
  
  // Address ni yangilash
  updateAddress: (lang, value) =>
    set((state) => ({
      data: {
        ...(state.data || {}),
        address: {
          ...(state.data?.address || { uz: "", ru: "", en: "" }),
          [lang]: value,
        },
      },
    })),
}));