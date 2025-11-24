export interface Lead {
  id: string;
  wa_phone: string;
  first_message: string;
  referral?: {
    source_type: string;
    source_id: string;
    headline: string;
    body: string;
    image_url?: string;
  };
  ctwa_clid?: string;
  campaign_id?: string;
  adset_id?: string;
  ad_id?: string;
  score: number;
  status: "new" | "open" | "won";
  owner?: string;
  created_time: string;
  conversion_value?: number;
}

export interface InsightMetrics {
  impressions: number;
  reach: number;
  clicks: number;
  ctr: number;
  cpc: number;
  spend: number;
  conversions?: number;
  costPerConversion?: number;
  conversionRate?: number;
}

export interface BreakdownRow extends InsightMetrics {
  age: string;
  gender: string;
  placement: string;
}

export interface TimeSeriesData {
  date: string;
  impressions: number;
  clicks: number;
  conversations: number;
}

export interface InsightsFilters {
  accountId: string;
  since: string;
  until: string;
  level: "campaign" | "adset" | "ad";
  breakdowns: string[];
  campaignObjective?: "all" | "conversions" | "messages" | "traffic" | "awareness" | "app_installs";
}

export interface AudienceProposal {
  msg: string;
  proposal: {
    increase: Array<{ segment: string; pct: number }>;
    decrease: Array<{ segment: string; pct: number }>;
  };
}

export interface Config {
  adAccountId?: string;
  metaAccessToken?: string;
  whatsappToken?: string;
  webhookUrl?: string;
  webhookSecret?: string;
  mappings?: Record<string, any>;
}
