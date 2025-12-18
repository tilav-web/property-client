import { create } from "zustand";
import type { PropertyType } from "@/interfaces/property/property.interface";

interface MapState {
  areaMap: Record<string, PropertyType[]>;
  mergedProperties: PropertyType[];
  addProperties: (areaKey: string | null, properties: PropertyType[]) => void;
  clear: () => void;
}

export const useMapStore = create<MapState>((set) => ({
  areaMap: {},
  mergedProperties: [],
  addProperties: (areaKey, properties) => {
    if (!areaKey) return;

    set((state) => {
      const current = state.areaMap[areaKey] || [];

      // Merge without duplicates by _id
      const map = new Map<string, PropertyType>();
      current.forEach((p) => map.set(p._id, p));
      properties.forEach((p) => map.set(p._id, p));

      const newAreaMap = { ...state.areaMap, [areaKey]: Array.from(map.values()) };

      // Recompute mergedProperties across all areas
      const mergedMap = new Map<string, PropertyType>();
      Object.values(newAreaMap).forEach((arr) => arr.forEach((p) => mergedMap.set(p._id, p)));

      return {
        areaMap: newAreaMap,
        mergedProperties: Array.from(mergedMap.values()),
      };
    });
  },
  clear: () => set({ areaMap: {}, mergedProperties: [] }),
}));

export default useMapStore;
