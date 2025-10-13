import { create } from "zustand";

interface ICreateProperty {
  // avvalgilarni o'chirma
  title?: string;
  description?: string;
  category?: string;
  location?: { type: "Point"; coordinates: [number, number] };
  address?: string;
  price?: number;
  price_type?: string;
  area?: number;
  bedrooms?: number;
  bathrooms?: number;
  floor_level?: number;
  amenities?: string[];
  construction_status?: string;
  year_built?: string;
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
}

export const useCreatePropertyStore = create<CreatePropertyState>((set) => ({
  data: null,
    updateData: (partialData) =>
    set((state) => ({
      data: { ...(state.data || {}), ...partialData },
    })),
  resetData: () => set({ data: null }),
}));
