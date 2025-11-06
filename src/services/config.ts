import { Config } from "@/types";

/**
 * Configuration Service - MOCK
 * Handles Meta/WhatsApp credentials and webhook setup
 */

let mockConfig: Config = {
  adAccountId: "act_123456789",
  metaAccessToken: "EAAxxxxxxxxxx",
  whatsappToken: "EABxxxxxxxxxx",
  webhookUrl: "https://f-engage.app/webhook",
  webhookSecret: "my_secret_key_123",
  mappings: {},
};

export const fetchConfig = async (): Promise<Config> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return {
    ...mockConfig,
    metaAccessToken: mockConfig.metaAccessToken ? "••••••••" : undefined,
    whatsappToken: mockConfig.whatsappToken ? "••••••••" : undefined,
    webhookSecret: mockConfig.webhookSecret ? "••••••••" : undefined,
  };
};

export const saveConfig = async (config: Partial<Config>): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  mockConfig = { ...mockConfig, ...config };
};

export const validateCredentials = async (
  adAccountId: string,
  token: string
): Promise<{ valid: boolean; error?: string }> => {
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Mock validation logic
  if (!adAccountId.startsWith("act_")) {
    return { valid: false, error: "Ad Account ID deve começar com 'act_'" };
  }

  if (token.length < 20) {
    return { valid: false, error: "Token inválido ou expirado" };
  }

  if (!token.startsWith("EAA")) {
    return {
      valid: false,
      error: "Token sem escopo suficiente. Necessário: ads_read, business_management",
    };
  }

  return { valid: true };
};

export const testWebhook = async (url: string): Promise<{ success: boolean; error?: string }> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  if (!url.startsWith("https://")) {
    return { success: false, error: "URL deve usar HTTPS" };
  }

  // Simulate successful webhook test
  return { success: true };
};
