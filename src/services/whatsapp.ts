import { Lead } from "@/types";

/**
 * WhatsApp Business CTWA - MOCK Service
 * 
 * Real webhook payload includes:
 * - referral: { source_type, source_id (ad_id), headline, body, image_url }
 * - ctwa_clid: Click ID for attribution
 * - from: Phone number
 * - message: First message content
 */

const mockLeads: Lead[] = [
  {
    id: "lead_901",
    wa_phone: "+55 11 99999-0000",
    first_message: "Olá! Quero saber sobre o evento de negociação.",
    referral: {
      source_type: "ads",
      source_id: "3201",
      headline: "Workshop Brasil Card",
      body: "Negociação e orientação financeira — vagas limitadas",
      image_url: "https://picsum.photos/seed/cta1/600/400",
    },
    ctwa_clid: "CLID-abc-123",
    campaign_id: "1200",
    adset_id: "2200",
    ad_id: "3201",
    score: 78,
    status: "new",
    owner: undefined,
    created_time: "2025-11-05T14:21:00Z",
  },
  {
    id: "lead_902",
    wa_phone: "+55 11 98888-1111",
    first_message: "Gostaria de participar do workshop",
    referral: {
      source_type: "ads",
      source_id: "3202",
      headline: "Orientação Financeira Gratuita",
      body: "Aprenda a organizar suas finanças",
      image_url: "https://picsum.photos/seed/cta2/600/400",
    },
    ctwa_clid: "CLID-def-456",
    campaign_id: "1200",
    adset_id: "2201",
    ad_id: "3202",
    score: 85,
    status: "open",
    owner: "Ana Silva",
    created_time: "2025-11-05T15:30:00Z",
  },
  {
    id: "lead_903",
    wa_phone: "+55 11 97777-2222",
    first_message: "Oi, vi o anúncio e tenho interesse",
    referral: {
      source_type: "ads",
      source_id: "3203",
      headline: "Brasil Card - Evento Especial",
      body: "Exclusivo para clientes premium",
      image_url: "https://picsum.photos/seed/cta3/600/400",
    },
    campaign_id: "1201",
    adset_id: "2202",
    ad_id: "3203",
    score: 92,
    status: "won",
    owner: "Carlos Santos",
    created_time: "2025-11-04T10:15:00Z",
    conversion_value: 1500,
  },
  {
    id: "lead_904",
    wa_phone: "+55 11 96666-3333",
    first_message: "Olá, preciso de ajuda financeira",
    score: 65,
    status: "new",
    created_time: "2025-11-05T16:45:00Z",
  },
  {
    id: "lead_905",
    wa_phone: "+55 11 95555-4444",
    first_message: "Tenho interesse no evento",
    referral: {
      source_type: "ads",
      source_id: "3204",
      headline: "Workshop Brasil Card",
      body: "Negociação e orientação financeira — vagas limitadas",
      image_url: "https://picsum.photos/seed/cta4/600/400",
    },
    ctwa_clid: "CLID-ghi-789",
    campaign_id: "1200",
    adset_id: "2200",
    ad_id: "3204",
    score: 71,
    status: "new",
    created_time: "2025-11-05T17:00:00Z",
  },
  {
    id: "lead_906",
    wa_phone: "+55 11 94444-5555",
    first_message: "Vi no Instagram e gostei",
    referral: {
      source_type: "ads",
      source_id: "3205",
      headline: "Aprenda a Negociar Dívidas",
      body: "Workshop gratuito - Brasil Card",
      image_url: "https://picsum.photos/seed/cta5/600/400",
    },
    campaign_id: "1200",
    adset_id: "2200",
    ad_id: "3205",
    score: 88,
    status: "open",
    owner: "Ana Silva",
    created_time: "2025-11-05T09:30:00Z",
  },
  {
    id: "lead_907",
    wa_phone: "+55 11 93333-6666",
    first_message: "Quero mais informações",
    score: 55,
    status: "new",
    created_time: "2025-11-05T18:20:00Z",
  },
  {
    id: "lead_908",
    wa_phone: "+55 11 92222-7777",
    first_message: "Estou interessado no workshop",
    referral: {
      source_type: "ads",
      source_id: "3206",
      headline: "Brasil Card Premium",
      body: "Benefícios exclusivos para você",
      image_url: "https://picsum.photos/seed/cta6/600/400",
    },
    ctwa_clid: "CLID-jkl-012",
    campaign_id: "1201",
    adset_id: "2203",
    ad_id: "3206",
    score: 82,
    status: "open",
    owner: "Carlos Santos",
    created_time: "2025-11-04T14:50:00Z",
  },
];

export const fetchLeads = async (status?: string): Promise<Lead[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  if (status) {
    return mockLeads.filter((lead) => lead.status === status);
  }
  return mockLeads;
};

export const fetchLead = async (id: string): Promise<Lead | undefined> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return mockLeads.find((lead) => lead.id === id);
};

export const assignLead = async (id: string, owner: string): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 400));
  const lead = mockLeads.find((l) => l.id === id);
  if (lead) {
    lead.owner = owner;
  }
};

export const setLeadStatus = async (
  id: string,
  status: "new" | "open" | "won",
  conversionValue?: number
): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 400));
  const lead = mockLeads.find((l) => l.id === id);
  if (lead) {
    lead.status = status;
    if (status === "won" && conversionValue) {
      lead.conversion_value = conversionValue;
    }
  }
};
