import type { IUser } from "@/interfaces/users/user.interface";
import { create } from "zustand";

interface UserState {
  user: undefined | null | IUser;
  loading: boolean;
  setUser: (user: IUser) => void;
  logout: () => void;
  handleLoading: (bool: boolean) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: undefined,
  loading: false,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
  handleLoading: (bool) => set({ loading: bool }),
}));
