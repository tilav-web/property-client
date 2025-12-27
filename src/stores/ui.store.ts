import { create } from "zustand";

interface UiState {
  isLoginDialogOpen: boolean;
  openLoginDialog: () => void;
  closeLoginDialog: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  isLoginDialogOpen: false,
  openLoginDialog: () => set({ isLoginDialogOpen: true }),
  closeLoginDialog: () => set({ isLoginDialogOpen: false }),
}));
