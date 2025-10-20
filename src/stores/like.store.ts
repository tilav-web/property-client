import { create } from "zustand";
import type { IProperty } from "@/interfaces/property.interface";
import { likeService } from "@/services/like.service";

interface LikeState {
  likedProperties: IProperty[];
  isLoading: boolean;
  fetchLikedProperties: () => Promise<void>;
  toggleLikeProperty: (propertyId: string) => Promise<void>;
  isLiked: (propertyId: string) => boolean;
}

export const useLikeStore = create<LikeState>((set, get) => ({
  likedProperties: [],
  isLoading: false,
  fetchLikedProperties: async () => {
    set({ isLoading: true });
    try {
      const properties = await likeService.findMyLikes();
      set({ likedProperties: properties });
    } catch (error) {
      console.error("Failed to fetch liked properties", error);
    } finally {
      set({ isLoading: false });
    }
  },
  toggleLikeProperty: async (id: string) => {
    try {
      const updatedProperty = await likeService.toggleLike(id);
      set((state) => {
        const isLiked = state.likedProperties.some((p) => p._id === id);
        if (isLiked) {
          // Remove from list
          return {
            likedProperties: state.likedProperties.filter((p) => p._id !== id),
          };
        } else {
          // Add to list
          return {
            likedProperties: [...state.likedProperties, updatedProperty],
          };
        }
      });
    } catch (error) {
      console.error("Failed to toggle like status", error);
    }
  },
  isLiked: (id: string) => {
    return get().likedProperties.some((p) => p._id === id);
  },
}));
