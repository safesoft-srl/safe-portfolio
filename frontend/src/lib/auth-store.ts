import { create } from "zustand";
import Cookies from "js-cookie";

interface AuthState {
  isAuthenticated: boolean;
  setAuthenticated: (status: boolean) => void;
  login: (token: string, expiresIn: number) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: !!Cookies.get("access_token"),
  setAuthenticated: (status) => set({ isAuthenticated: status }),
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
    set({ isAuthenticated: false });
  },
}));
