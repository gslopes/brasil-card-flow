import { InsightsFilters, InsightMetrics, BreakdownRow, TimeSeriesData } from "@/types";

/**
 * Meta Marketing API Insights - MOCK Service
 * 
 * Real API call reference:
 * GET https://graph.facebook.com/v19.0/act_{AD_ACCOUNT_ID}/insights
 *   ?fields=impressions,reach,clicks,ctr,cpc,spend,ad_id,adset_id,campaign_id
 *   &level=adset
 *   &time_range[since]={YYYY-MM-DD}&time_range[until]={YYYY-MM-DD}
 *   &time_increment=1
 *   &breakdowns=age,gender,publisher_platform
 *   &filtering=[{"field":"publisher_platform","operator":"IN","value":["instagram"]}]
 */

export const fetchInsights = async (filters: InsightsFilters) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Mock data generation
  const days = Math.ceil(
    (new Date(filters.until).getTime() - new Date(filters.since).getTime()) / (1000 * 60 * 60 * 24)
  );

  const timeSeries: TimeSeriesData[] = [];
  for (let i = 0; i < days; i++) {
    const date = new Date(filters.since);
    date.setDate(date.getDate() + i);
    timeSeries.push({
      date: date.toISOString().split("T")[0],
      impressions: Math.floor(20000 + Math.random() * 10000),
      clicks: Math.floor(600 + Math.random() * 400),
      conversations: Math.floor(40 + Math.random() * 30),
    });
  }

  const kpis: InsightMetrics = {
    impressions: timeSeries.reduce((sum, d) => sum + d.impressions, 0),
    reach: Math.floor(timeSeries.reduce((sum, d) => sum + d.impressions, 0) * 0.75),
    clicks: timeSeries.reduce((sum, d) => sum + d.clicks, 0),
    ctr: 0,
    cpc: 0,
    spend: 0,
  };
  kpis.ctr = (kpis.clicks / kpis.impressions) * 100;
  kpis.cpc = Math.random() * 1 + 0.5;
  kpis.spend = kpis.clicks * kpis.cpc;

  const ageGroups = ["18-24", "25-34", "35-44", "45-54", "55-64", "65+"];
  const genders = ["male", "female"];
  const placements = ["feed", "story", "reels"];

  const breakdownRows: BreakdownRow[] = [];
  ageGroups.forEach((age) => {
    genders.forEach((gender) => {
      placements.forEach((placement) => {
        const impressions = Math.floor(Math.random() * 5000 + 1000);
        const clicks = Math.floor(impressions * (Math.random() * 0.05 + 0.02));
        const ctr = (clicks / impressions) * 100;
        const cpc = Math.random() * 1.5 + 0.4;
        const spend = clicks * cpc;

        // Boost 35-44 and 45-54 performance
        const boost = age === "35-44" || age === "45-54" ? 1.5 : 1;

        breakdownRows.push({
          age,
          gender,
          placement,
          impressions: Math.floor(impressions * boost),
          reach: Math.floor(impressions * boost * 0.75),
          clicks: Math.floor(clicks * boost),
          ctr: parseFloat((ctr * boost).toFixed(2)),
          cpc: parseFloat((cpc / boost).toFixed(2)),
          spend: parseFloat((spend).toFixed(2)),
        });
      });
    });
  });

  return {
    data: {
      kpis,
      timeSeries,
      breakdownRows,
    },
    updated_at: new Date().toISOString(),
  };
};
