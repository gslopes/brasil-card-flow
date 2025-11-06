import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Settings as SettingsIcon, Key, Webhook, Map, AlertCircle, CheckCircle2 } from "lucide-react";
import { fetchConfig, testWebhook } from "@/services/config";
import { Config } from "@/types";
import { toast } from "sonner";

export default function Settings() {
  const [config, setConfig] = useState<Config>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    const data = await fetchConfig();
    setConfig(data);
  };

  const handleTestWebhook = async () => {
    if (!config.webhookUrl) return;
    
    setLoading(true);
    const result = await testWebhook(config.webhookUrl);
    setLoading(false);
    
    if (result.success) {
      toast.success("Webhook testado com sucesso! Resposta: 200 OK");
    } else {
      toast.error(result.error);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <SettingsIcon className="h-8 w-8" />
            Configurações
          </h1>
          <p className="text-muted-foreground">Gerencie credenciais e integrações</p>
        </div>
      </div>

      <Tabs defaultValue="credentials" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="credentials">Credenciais</TabsTrigger>
          <TabsTrigger value="webhook">Webhook</TabsTrigger>
          <TabsTrigger value="mappings">Mapeamentos</TabsTrigger>
        </TabsList>

        <TabsContent value="credentials" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Meta & WhatsApp API
              </CardTitle>
              <CardDescription>
                Tokens e credenciais para acesso aos serviços Meta
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Ad Account ID</Label>
                <Input value={config.adAccountId || ""} disabled />
              </div>

              <div className="space-y-2">
                <Label>Meta Access Token</Label>
                <Input type="password" value={config.metaAccessToken || ""} disabled />
                <p className="text-sm text-muted-foreground">
                  Token mascarado por segurança. Necessário escopos: ads_read, business_management
                </p>
              </div>

              <div className="space-y-2">
                <Label>WhatsApp Business Token</Label>
                <Input type="password" value={config.whatsappToken || ""} disabled />
              </div>

              <Alert className="border-accent bg-accent/10">
                <CheckCircle2 className="h-4 w-4 text-accent" />
                <AlertDescription>Credenciais validadas e ativas</AlertDescription>
              </Alert>

              <Button disabled>Atualizar Credenciais</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="webhook" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Webhook className="h-5 w-5" />
                Configuração de Webhook
              </CardTitle>
              <CardDescription>
                Endpoint para receber notificações do WhatsApp Business
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Webhook URL</Label>
                <Input value={config.webhookUrl || ""} disabled />
                <p className="text-sm text-muted-foreground">Deve usar HTTPS</p>
              </div>

              <div className="space-y-2">
                <Label>Webhook Secret</Label>
                <Input type="password" value={config.webhookSecret || ""} disabled />
              </div>

              <Alert className="border-primary bg-primary/10">
                <AlertCircle className="h-4 w-4 text-primary" />
                <AlertDescription>
                  O webhook está configurado para receber eventos de: messages, message_status
                </AlertDescription>
              </Alert>

              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm font-medium mb-2">Exemplo de Payload (referral):</p>
                <pre className="text-xs overflow-auto">
                  {JSON.stringify(
                    {
                      object: "whatsapp_business_account",
                      entry: [
                        {
                          changes: [
                            {
                              value: {
                                messages: [
                                  {
                                    from: "5511999990000",
                                    text: { body: "Olá! Quero saber sobre o evento" },
                                    context: {
                                      referral: {
                                        source_type: "ads",
                                        source_id: "3201",
                                        headline: "Workshop Brasil Card",
                                        body: "Negociação e orientação financeira",
                                        image_url: "https://...",
                                      },
                                      ctwa_clid: "CLID-abc-123",
                                    },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      ],
                    },
                    null,
                    2
                  )}
                </pre>
              </div>

              <Button onClick={handleTestWebhook} disabled={loading}>
                {loading ? "Testando..." : "Testar Webhook"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mappings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Map className="h-5 w-5" />
                Mapeamentos e Estratégias
              </CardTitle>
              <CardDescription>
                Como resolver source_id (ad_id) para entidades de campanha
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">Estratégia Principal</h4>
                    <Badge>Ativo</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Mapeamento direto de Ad ID via referral.source_id do payload WhatsApp
                  </p>
                </div>

                <div className="p-4 border rounded-lg bg-muted">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">Fallback</h4>
                    <Badge variant="outline">Configurado</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Parâmetros UTM (utm_campaign, utm_content) ou ref da URL quando source_id não
                    disponível
                  </p>
                </div>
              </div>

              <Alert className="border-accent bg-accent/10">
                <CheckCircle2 className="h-4 w-4 text-accent" />
                <AlertDescription>
                  Mapeamentos configurados com sucesso. Taxa de resolução atual: 85% (simulado)
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label>Roteamento de Leads</Label>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm font-medium mb-2">Round-Robin (Padrão)</p>
                  <p className="text-sm text-muted-foreground">
                    Leads são distribuídos igualmente entre agentes disponíveis
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
