import { create } from "zustand";

interface AuthState {
  isAuthenticated: boolean;
  user?: {
    name: string;
    email: string;
    role: "admin" | "marketing" | "agent";
  };
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: true, // For prototype, auto-authenticated
  user: {
    name: "Admin User",
    email: "admin@brasilcard.com",
    role: "admin",
  },
  login: async (email, password) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    set({
      isAuthenticated: true,
      user: {
        name: "Admin User",
        email,
        role: "admin",
      },
    });
  },
  logout: () => {
    set({ isAuthenticated: false, user: undefined });
  },
}));
