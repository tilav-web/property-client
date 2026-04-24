import { create } from "zustand";
import type { PropertyType } from "@/interfaces/property/property.interface";

const TTL_MS = 2 * 60 * 1000;

interface AreaEntry {
  data: PropertyType[];
  ts: number;
}

interface MapState {
  filterSig: string;
  areaMap: Record<string, AreaEntry>;
  mergedProperties: PropertyType[];
  getFresh: (areaKey: string) => PropertyType[] | null;
  addProperties: (areaKey: string, properties: PropertyType[]) => void;
  setFilterSig: (sig: string) => void;
  clear: () => void;
}

const recomputeMerged = (areaMap: Record<string, AreaEntry>) => {
  const mergedMap = new Map<string, PropertyType>();
  Object.values(areaMap).forEach((entry) =>
    entry.data.forEach((p) => mergedMap.set(p._id, p)),
  );
  return Array.from(mergedMap.values());
};

export const useMapStore = create<MapState>((set, get) => ({
  filterSig: "",
  areaMap: {},
  mergedProperties: [],

  getFresh: (areaKey) => {
    const entry = get().areaMap[areaKey];
    if (!entry) return null;
    if (Date.now() - entry.ts > TTL_MS) return null;
    return entry.data;
  },

  addProperties: (areaKey, properties) => {
    if (!areaKey) return;
    set((state) => {
      const current = state.areaMap[areaKey]?.data || [];
      const dedup = new Map<string, PropertyType>();
      current.forEach((p) => dedup.set(p._id, p));
      properties.forEach((p) => dedup.set(p._id, p));

      const newAreaMap = {
        ...state.areaMap,
        [areaKey]: { data: Array.from(dedup.values()), ts: Date.now() },
      };

      return {
        areaMap: newAreaMap,
        mergedProperties: recomputeMerged(newAreaMap),
      };
    });
  },

  setFilterSig: (sig) => {
    if (get().filterSig === sig) return;
    set({ filterSig: sig, areaMap: {}, mergedProperties: [] });
  },

  clear: () => set({ areaMap: {}, mergedProperties: [] }),
}));

export default useMapStore;
