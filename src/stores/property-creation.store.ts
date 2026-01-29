import { create } from "zustand";
import type { CategoryType } from "@/interfaces/types/category.type";
import { type CurrencyType } from "@/interfaces/types/currency.type";

interface PhotoFile {
  file: File;
  preview: string;
}

interface VideoFile {
  file: File;
  preview: string;
}

interface CommonData {
  title: string;
  description: string;
  address: string;
  price: string | number;
  currency: CurrencyType; // Updated type
}

interface LocationData {
  lat: number;
  lng: number;
}

interface PropertyCreationState {
  // Step management
  step: number;
  nextStep: () => void;
  prevStep: () => void;
  setStep: (step: number) => void;

  // Media
  photos: PhotoFile[];
  videos: VideoFile[];
  setPhotos: (photos: PhotoFile[]) => void;
  setVideos: (videos: VideoFile[]) => void;
  addPhoto: (photo: PhotoFile) => void;
  addVideo: (video: VideoFile) => void;
  removePhoto: (preview: string) => void;
  removeVideo: (preview: string) => void;

  // Basic Info
  category: CategoryType | "";
  commonData: CommonData;
  setCategory: (category: CategoryType | "") => void;
  setCommonData: (data: CommonData) => void;

  // Category Specific Data (dynamic)
  categoryData: Record<string, any>;
  setCategoryData: (data: Record<string, any>) => void;

  // Location
  location: LocationData;
  setLocation: (location: LocationData) => void;

  // Reset all state
  reset: () => void;
}

const initialCommonData: CommonData = {
  title: "",
  description: "",
  address: "",
  price: "",
  currency: "uzs", // Updated default value
};

const initialLocationData: LocationData = {
  lat: 41.2995, // Default latitude for Tashkent, Uzbekistan
  lng: 69.2401, // Default longitude for Tashkent, Uzbekistan
};

export const usePropertyCreationStore = create<PropertyCreationState>((set) => ({
  step: 1,
  photos: [],
  videos: [],
  category: "",
  commonData: initialCommonData,
  categoryData: {},
  location: initialLocationData,

  nextStep: () => set((state) => ({ step: state.step + 1 })),
  prevStep: () => set((state) => ({ step: state.step - 1 })),
  setStep: (step: number) => set({ step }),

  setPhotos: (photos) => set({ photos }),
  setVideos: (videos) => set({ videos }),
  addPhoto: (photo) => set((state) => ({ photos: [...state.photos, photo] })),
  addVideo: (video) => set((state) => ({ videos: [...state.videos, video] })),
  removePhoto: (preview) =>
    set((state) => ({
      photos: state.photos.filter((p) => p.preview !== preview),
    })),
  removeVideo: (preview) =>
    set((state) => ({
      videos: state.videos.filter((v) => v.preview !== preview),
    })),

  setCategory: (category) => set({ category }),
  setCommonData: (data) => set({ commonData: data }),

  setCategoryData: (data) => set({ categoryData: data }),

  setLocation: (location) => set({ location }),

  reset: () =>
    set({
      step: 1,
      photos: [],
      videos: [],
      category: "",
      commonData: initialCommonData,
      categoryData: {},
      location: initialLocationData,
    }),
}));
