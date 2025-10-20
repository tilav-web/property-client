import { create } from "zustand";
import type { IProperty } from "@/interfaces/property.interface";
import { saveService } from "@/services/save.service";

interface SaveState {
  savedProperties: IProperty[];
  isLoading: boolean;
  fetchSavedProperties: () => Promise<void>;
  toggleSaveProperty: (propertyId: string) => Promise<void>;
  isSaved: (propertyId: string) => boolean;
}

export const useSaveStore = create<SaveState>((set, get) => ({
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
      const updatedProperty = await saveService.toggleSave(id);
      set((state) => {
        const isSaved = state.savedProperties.some((p) => p._id === id);
        if (isSaved) {
          // Remove from list
          return {
            savedProperties: state.savedProperties.filter(
              (p) => p._id !== id
            ),
          };
        } else {
          // Add to list
          return {
            savedProperties: [...state.savedProperties, updatedProperty],
          };
        }
      });
    } catch (error) {
      console.error("Failed to toggle save status", error);
    }
  },
  isSaved: (id: string) => {
    return get().savedProperties.some((p) => p._id === id);
  },
}));
