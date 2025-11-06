import { create } from "zustand";
import { Lead } from "@/types";
import { fetchLeads, fetchLead, assignLead, setLeadStatus } from "@/services/whatsapp";

interface LeadsState {
  list: Lead[];
  selected?: Lead;
  loading: boolean;
  error?: string;
  fetchLeads: (status?: string) => Promise<void>;
  fetchLead: (id: string) => Promise<void>;
  assignLead: (id: string, owner: string) => Promise<void>;
  setStatus: (id: string, status: "new" | "open" | "won", conversionValue?: number) => Promise<void>;
}

export const useLeadsStore = create<LeadsState>((set) => ({
  list: [],
  loading: false,

  fetchLeads: async (status) => {
    set({ loading: true, error: undefined });
    try {
      const leads = await fetchLeads(status);
      set({ list: leads, loading: false });
    } catch (error) {
      set({ error: "Erro ao buscar leads", loading: false });
    }
  },

  fetchLead: async (id) => {
    set({ loading: true, error: undefined });
    try {
      const lead = await fetchLead(id);
      set({ selected: lead, loading: false });
    } catch (error) {
      set({ error: "Erro ao buscar lead", loading: false });
    }
  },

  assignLead: async (id, owner) => {
    try {
      await assignLead(id, owner);
      set((state) => ({
        list: state.list.map((l) => (l.id === id ? { ...l, owner } : l)),
        selected: state.selected?.id === id ? { ...state.selected, owner } : state.selected,
      }));
    } catch (error) {
      set({ error: "Erro ao atribuir lead" });
    }
  },

  setStatus: async (id, status, conversionValue) => {
    try {
      await setLeadStatus(id, status, conversionValue);
      set((state) => ({
        list: state.list.map((l) =>
          l.id === id ? { ...l, status, conversion_value: conversionValue } : l
        ),
        selected:
          state.selected?.id === id
            ? { ...state.selected, status, conversion_value: conversionValue }
            : state.selected,
      }));
    } catch (error) {
      set({ error: "Erro ao atualizar status" });
    }
  },
}));
