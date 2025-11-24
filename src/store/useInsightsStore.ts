import { create } from "zustand";
import { InsightsFilters, InsightMetrics, BreakdownRow, TimeSeriesData, AudienceProposal } from "@/types";
import { fetchInsights } from "@/services/metaInsights";

interface InsightsState {
  filters: InsightsFilters;
  kpis: InsightMetrics;
  series: TimeSeriesData[];
  breakdownRows: BreakdownRow[];
  loading: boolean;
  error?: string;
  lastUpdated?: string;
  setFilters: (filters: Partial<InsightsFilters>) => void;
  fetchInsights: () => Promise<void>;
  suggestAudienceShift: () => AudienceProposal;
  applyAudienceShift: () => void;
}

const thirtyDaysAgo = new Date();
thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

export const useInsightsStore = create<InsightsState>((set, get) => ({
  filters: {
    accountId: "act_123456789",
    since: thirtyDaysAgo.toISOString().split("T")[0],
    until: new Date().toISOString().split("T")[0],
    level: "adset",
    breakdowns: ["age", "gender", "publisher_platform"],
    campaignObjective: "all",
  },
  kpis: {
    impressions: 0,
    reach: 0,
    clicks: 0,
    ctr: 0,
    cpc: 0,
    spend: 0,
    conversions: 0,
    costPerConversion: 0,
    conversionRate: 0,
  },
  series: [],
  breakdownRows: [],
  loading: false,

  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    }));
  },

  fetchInsights: async () => {
    set({ loading: true, error: undefined });
    try {
      const result = await fetchInsights(get().filters);
      set({
        kpis: result.data.kpis,
        series: result.data.timeSeries,
        breakdownRows: result.data.breakdownRows,
        loading: false,
        lastUpdated: result.updated_at,
      });
    } catch (error) {
      set({ error: "Erro ao buscar insights", loading: false });
    }
  },

  suggestAudienceShift: () => {
    const { breakdownRows } = get();
    
    // Calculate average CTR
    const avgCtr = breakdownRows.reduce((sum, row) => sum + row.ctr, 0) / breakdownRows.length;
    
    // Find best performing segments (35-44, 45-54)
    const topSegments = breakdownRows
      .filter((row) => row.age === "35-44" || row.age === "45-54")
      .sort((a, b) => b.ctr - a.ctr)
      .slice(0, 2);

    const topCtr = topSegments[0]?.ctr || 0;
    const improvement = ((topCtr - avgCtr) / avgCtr) * 100;

    return {
      msg: `⚡ Detecção: Público 35-55 com +${improvement.toFixed(0)}% CTR vs. média. Ajustar segmentação?`,
      proposal: {
        increase: [
          { segment: "35-44 anos", pct: 20 },
          { segment: "45-54 anos", pct: 20 },
        ],
        decrease: [{ segment: "18-24 anos", pct: -10 }],
      },
    };
  },

  applyAudienceShift: () => {
    // Mock application - in real app would call API to adjust campaign
    set({ lastUpdated: new Date().toISOString() });
  },
}));
