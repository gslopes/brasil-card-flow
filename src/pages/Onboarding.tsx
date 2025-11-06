import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { validateCredentials, testWebhook, saveConfig } from "@/services/config";
import { toast } from "sonner";

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Step 1: Credentials
  const [adAccountId, setAdAccountId] = useState("act_123456789");
  const [metaToken, setMetaToken] = useState("EAAxxxxxxxxxx");
  const [whatsappToken, setWhatsappToken] = useState("EABxxxxxxxxxx");
  const [credentialsValid, setCredentialsValid] = useState<boolean | null>(null);
  const [validationError, setValidationError] = useState<string>("");
  
  // Step 2: Webhook
  const [webhookUrl, setWebhookUrl] = useState("https://f-engage.app/webhook");
  const [webhookSecret, setWebhookSecret] = useState("my_secret_key_123");
  const [webhookTested, setWebhookTested] = useState<boolean | null>(null);

  const handleValidateCredentials = async () => {
    setLoading(true);
    setValidationError("");
    
    const result = await validateCredentials(adAccountId, metaToken);
    
    if (result.valid) {
      setCredentialsValid(true);
      toast.success("Credenciais validadas com sucesso!");
    } else {
      setCredentialsValid(false);
      setValidationError(result.error || "Erro desconhecido");
      toast.error(result.error);
    }
    
    setLoading(false);
  };

  const handleSaveCredentials = async () => {
    setLoading(true);
    await saveConfig({
      adAccountId,
      metaAccessToken: metaToken,
      whatsappToken,
    });
    setLoading(false);
    setStep(2);
  };

  const handleTestWebhook = async () => {
    setLoading(true);
    const result = await testWebhook(webhookUrl);
    
    if (result.success) {
      setWebhookTested(true);
      toast.success("Webhook testado com sucesso! Resposta: 200 OK");
    } else {
      setWebhookTested(false);
      toast.error(result.error);
    }
    
    setLoading(false);
  };

  const handleSaveWebhook = async () => {
    setLoading(true);
    await saveConfig({
      webhookUrl,
      webhookSecret,
    });
    setLoading(false);
    setStep(3);
  };

  const handleFinish = async () => {
    setLoading(true);
    await saveConfig({ mappings: { strategy: "ad_id_match", fallback: "utm" } });
    setLoading(false);
    toast.success("Configuração concluída!");
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5">
      <div className="container max-w-4xl mx-auto py-12 px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 text-foreground">F-Engage</h1>
          <p className="text-muted-foreground">Ads → WhatsApp Lead Bridge</p>
        </div>

        <div className="flex justify-center gap-4 mb-8">
          <Badge variant={step >= 1 ? "default" : "outline"}>1. Credenciais</Badge>
          <Badge variant={step >= 2 ? "default" : "outline"}>2. Webhook</Badge>
          <Badge variant={step >= 3 ? "default" : "outline"}>3. Mapeamentos</Badge>
        </div>

        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Conectar Conta Meta & WhatsApp</CardTitle>
              <CardDescription>
                Configure suas credenciais de API para começar a rastrear campanhas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="adAccountId">Ad Account ID</Label>
                <Input
                  id="adAccountId"
                  placeholder="act_XXXX"
                  value={adAccountId}
                  onChange={(e) => setAdAccountId(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  Encontre em Meta Business Manager → Gerenciador de Anúncios
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="metaToken">Meta Access Token</Label>
                <Input
                  id="metaToken"
                  type="password"
                  placeholder="EAAXXXXXXXXXX..."
                  value={metaToken}
                  onChange={(e) => setMetaToken(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  Necessário escopos: ads_read, business_management
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="whatsappToken">WhatsApp Business Token</Label>
                <Input
                  id="whatsappToken"
                  type="password"
                  placeholder="EABXXXXXXXXXX..."
                  value={whatsappToken}
                  onChange={(e) => setWhatsappToken(e.target.value)}
                />
              </div>

              {credentialsValid === false && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{validationError}</AlertDescription>
                </Alert>
              )}

              {credentialsValid === true && (
                <Alert className="border-accent bg-accent/10">
                  <CheckCircle2 className="h-4 w-4 text-accent" />
                  <AlertDescription>Credenciais validadas com sucesso!</AlertDescription>
                </Alert>
              )}

              <div className="flex gap-3">
                <Button
                  onClick={handleValidateCredentials}
                  disabled={loading || !adAccountId || !metaToken}
                  variant="outline"
                  className="flex-1"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Validar Credenciais"}
                </Button>
                <Button
                  onClick={handleSaveCredentials}
                  disabled={!credentialsValid || loading}
                  className="flex-1"
                >
                  Salvar e Continuar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Configurar Webhook WhatsApp</CardTitle>
              <CardDescription>
                Configure o webhook para receber notificações de novas mensagens
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="webhookUrl">Webhook URL</Label>
                <Input
                  id="webhookUrl"
                  placeholder="https://..."
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">Deve usar HTTPS</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="webhookSecret">Webhook Secret</Label>
                <Input
                  id="webhookSecret"
                  type="password"
                  value={webhookSecret}
                  onChange={(e) => setWebhookSecret(e.target.value)}
                />
              </div>

              {webhookTested === true && (
                <Alert className="border-accent bg-accent/10">
                  <CheckCircle2 className="h-4 w-4 text-accent" />
                  <AlertDescription>Webhook testado: 200 OK</AlertDescription>
                </Alert>
              )}

              {webhookTested === false && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>Falha ao testar webhook</AlertDescription>
                </Alert>
              )}

              <div className="flex gap-3">
                <Button onClick={() => setStep(1)} variant="outline">
                  Voltar
                </Button>
                <Button
                  onClick={handleTestWebhook}
                  disabled={loading || !webhookUrl}
                  variant="outline"
                  className="flex-1"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Testar Webhook"}
                </Button>
                <Button onClick={handleSaveWebhook} disabled={loading} className="flex-1">
                  Salvar e Continuar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Mapeamentos e Estratégias</CardTitle>
              <CardDescription>
                Configure como resolver source_id (ad_id) para campanhas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert className="border-primary bg-primary/10">
                <AlertCircle className="h-4 w-4 text-primary" />
                <AlertDescription>
                  O sistema tentará resolver referral.source_id diretamente para Ad ID. Se não
                  disponível, usará parâmetros UTM ou ref como fallback.
                </AlertDescription>
              </Alert>

              <Tabs defaultValue="primary" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="primary">Estratégia Principal</TabsTrigger>
                  <TabsTrigger value="fallback">Fallback</TabsTrigger>
                </TabsList>
                <TabsContent value="primary" className="space-y-4">
                  <div className="p-4 border rounded-lg bg-card">
                    <h4 className="font-medium mb-2">Mapeamento direto de Ad ID</h4>
                    <p className="text-sm text-muted-foreground">
                      Usa referral.source_id do payload do WhatsApp para identificar o anúncio de
                      origem
                    </p>
                  </div>
                </TabsContent>
                <TabsContent value="fallback" className="space-y-4">
                  <div className="p-4 border rounded-lg bg-card">
                    <h4 className="font-medium mb-2">Parâmetros UTM e ref</h4>
                    <p className="text-sm text-muted-foreground">
                      Quando source_id não disponível, analisa utm_campaign, utm_content, ou
                      parâmetro ref da URL
                    </p>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex gap-3">
                <Button onClick={() => setStep(2)} variant="outline">
                  Voltar
                </Button>
                <Button onClick={handleFinish} disabled={loading} className="flex-1">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Concluir Configuração"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
