import { create } from "zustand";

interface UIState {
  features: {
    whatsappCLID: boolean;
  };
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  features: {
    whatsappCLID: true,
  },
  sidebarOpen: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
}));
