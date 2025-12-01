import type { ISeller } from "@/interfaces/users/seller.interface";
import { create } from "zustand";

interface SellerState {
  seller: undefined | null | ISeller;
  loading: boolean;
  setSeller: (user: ISeller) => void;
  logout: () => void;
  handleLoading: (bool: boolean) => void;
}

export const useSellerStore = create<SellerState>((set) => ({
  seller: undefined,
  loading: false,
  setSeller: (seller) => set({ seller }),
  logout: () => set({ seller: null }),
  handleLoading: (bool) => set({ loading: bool }),
}));
