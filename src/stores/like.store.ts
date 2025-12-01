import { create } from "zustand";
import type { IProperty } from "@/interfaces/property/property.interface";
import { likeService } from "@/services/like.service";

interface LikeState {
  likedProperties: {
    _id: string;
    user: string;
    property: IProperty;
  }[];
  isLoading: boolean;
  fetchLikedProperties: () => Promise<void>;
  toggleLikeProperty: (propertyId: string) => Promise<void>;
}

export const useLikeStore = create<LikeState>((set) => ({
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
      const data = await likeService.toggleLike(id);
      set((state) => {
        if (data.action === "unlike") {
          return {
            likedProperties: state.likedProperties.filter(
              (item) => item?.property?._id !== data.property?._id
            ),
          };
        }

        if (data.action === "like") {
          return {
            likedProperties: [...state.likedProperties, data],
          };
        }

        // fallback (agar action bo‘lmasa)
        return state;
      });
    } catch (error) {
      console.error("Failed to toggle like status", error);
    }
  },
}));
