import { create } from "zustand";
import type { IProperty } from "@/interfaces/property.interface";
import { saveService } from "@/services/save.service";

interface SaveState {
  savedProperties: {
    _id: string;
    user: string;
    property: IProperty;
  }[];
  isLoading: boolean;
  fetchSavedProperties: () => Promise<void>;
  toggleSaveProperty: (propertyId: string) => Promise<void>;
}

export const useSaveStore = create<SaveState>((set) => ({
  savedProperties: [],
  isLoading: false,
  fetchSavedProperties: async () => {
    set({ isLoading: true });
    try {
      const properties = await saveService.findMySaves();
      set({ savedProperties: properties });
    } catch (error) {
      console.error("Failed to fetch saved properties", error);
    } finally {
      set({ isLoading: false });
    }
  },
  toggleSaveProperty: async (id: string) => {
    try {
      const data = await saveService.toggleSave(id);

      set((state) => {
        if (data.action === "unsave") {
          return {
            savedProperties: state.savedProperties.filter(
              (item) => item?.property?._id !== data.property?._id
            ),
          };
        }

        if (data.action === "save") {
          return {
            savedProperties: [...state.savedProperties, data],
          };
        }

        // fallback (agar action bo‘lmasa)
        return state;
      });
    } catch (error) {
      console.error("Failed to toggle save status", error);
    }
  },
}));
