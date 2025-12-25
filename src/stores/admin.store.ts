import { create } from "zustand";

interface IAdmin {
  _id: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface AdminState {
  admin: undefined | null | IAdmin;
  adminAccessToken: string | null;
  loading: boolean;
  setAdmin: (admin: IAdmin, adminAccessToken: string) => void;
  setAdminAccessToken: (token: string) => void;
  setProfile: (admin: IAdmin) => void;
  logout: () => void;
  handleLoading: (bool: boolean) => void;
  getAdminAccessToken: () => string | null;
  clearAdminAccessToken: () => void;
}

const ADMIN_ACCESS_TOKEN_KEY = "admin_access_token";

export const useAdminStore = create<AdminState>((set, get) => ({
  admin: undefined,
  adminAccessToken:
    typeof window !== "undefined"
      ? localStorage.getItem(ADMIN_ACCESS_TOKEN_KEY)
      : null,
  loading: false,

  setAdmin: (admin, adminAccessToken) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(ADMIN_ACCESS_TOKEN_KEY, adminAccessToken);
    }
    set({ admin, adminAccessToken });
  },

  setAdminAccessToken: (token: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(ADMIN_ACCESS_TOKEN_KEY, token);
    }
    set({ adminAccessToken: token });
  },

  setProfile: (admin: IAdmin) => {
    set({ admin });
  },

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(ADMIN_ACCESS_TOKEN_KEY);
    }
    set({ admin: null, adminAccessToken: null });
  },

  handleLoading: (bool) => set({ loading: bool }),

  getAdminAccessToken: () => {
    return (
      get().adminAccessToken ||
      (typeof window !== "undefined"
        ? localStorage.getItem(ADMIN_ACCESS_TOKEN_KEY)
        : null)
    );
  },

  clearAdminAccessToken: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(ADMIN_ACCESS_TOKEN_KEY);
    }
    set({ adminAccessToken: null });
  },
}));
