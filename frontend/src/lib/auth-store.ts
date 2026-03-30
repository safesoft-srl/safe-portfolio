import { create } from "zustand";
import Cookies from "js-cookie";
import type { User } from "@/types/users";

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  setAuthenticated: (status: boolean) => void;
  setUser: (user: User | null) => void;
  login: (token: string, expiresIn: number) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: !!Cookies.get("access_token"),
  user: null,
  setAuthenticated: (status) => set({ isAuthenticated: status }),
  setUser: (user) => set({ user }),
  login: (token: string, expiresIn: number) => {
    Cookies.set("access_token", token, {
      expires: expiresIn / 86400,
      secure: true,
      sameSite: "lax",
    });
    set({ isAuthenticated: true });
  },
  logout: () => {
    Cookies.remove("access_token");
    set({ isAuthenticated: false, user: null });
  },
}));
