import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, TrendingUp, Eye, MousePointerClick, MessageSquare, CheckCircle2 } from "lucide-react";
import { useInsightsStore } from "@/store/useInsightsStore";
import { useLeadsStore } from "@/store/useLeadsStore";
import { toast } from "sonner";

export default function Reports() {
  const { kpis, fetchInsights } = useInsightsStore();
  const { list, fetchLeads } = useLeadsStore();

  useEffect(() => {
    fetchInsights();
    fetchLeads();
  }, [fetchInsights, fetchLeads]);

  const conversationRate = kpis.clicks > 0 ? (list.length / kpis.clicks) * 100 : 0;
  const conversionRate = list.length > 0 ? (list.filter((l) => l.status === "won").length / list.length) * 100 : 0;

  const handleExportCSV = () => {
    toast.success("Relatório exportado", {
      description: "O arquivo CSV foi baixado com sucesso (simulado).",
    });
  };

  // Mock data for top ad sets
  const topAdSets = [
    { adset: "Workshop 35-54 | Feed", conversations: 45, clicks: 820, rate: 5.49 },
    { adset: "Orientação Feminino | Stories", conversations: 38, clicks: 710, rate: 5.35 },
    { adset: "Evento Premium | Reels", conversations: 32, clicks: 650, rate: 4.92 },
    { adset: "Negociação 45+ | Feed", conversations: 28, clicks: 580, rate: 4.83 },
    { adset: "Brasil Card Geral | Stories", conversations: 22, clicks: 520, rate: 4.23 },
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Relatórios</h1>
          <p className="text-muted-foreground">Funil completo: Impressões → Conversões</p>
        </div>
        <Button onClick={handleExportCSV} className="gap-2">
          <Download className="h-4 w-4" />
          Exportar CSV
        </Button>
      </div>

      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Funil de Conversão
          </CardTitle>
          <CardDescription>Jornada completa do usuário</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                <Eye className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Impressões</p>
                <p className="text-2xl font-bold">{kpis.impressions.toLocaleString("pt-BR")}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">100%</p>
              </div>
            </div>

            <div className="pl-16 border-l-2 border-primary/20">
              <div className="flex items-center gap-4 -ml-[49px]">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-accent/10">
                  <MousePointerClick className="h-6 w-6 text-accent" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">Cliques</p>
                  <p className="text-2xl font-bold">{kpis.clicks.toLocaleString("pt-BR")}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">{kpis.ctr.toFixed(2)}%</p>
                </div>
              </div>
            </div>

            <div className="pl-16 border-l-2 border-accent/20">
              <div className="flex items-center gap-4 -ml-[49px]">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-cyan-500/10">
                  <MessageSquare className="h-6 w-6 text-cyan-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">Conversas WhatsApp</p>
                  <p className="text-2xl font-bold">{list.length}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">{conversationRate.toFixed(2)}%</p>
                </div>
              </div>
            </div>

            <div className="pl-16 border-l-2 border-cyan-500/20">
              <div className="flex items-center gap-4 -ml-[49px]">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-emerald-500/10">
                  <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">Conversões</p>
                  <p className="text-2xl font-bold">
                    {list.filter((l) => l.status === "won").length}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">{conversionRate.toFixed(2)}%</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top Ad Sets por Conversas</CardTitle>
          <CardDescription>Os conjuntos de anúncios com melhor taxa de conversa</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ad Set</TableHead>
                <TableHead className="text-right">Conversas</TableHead>
                <TableHead className="text-right">Cliques</TableHead>
                <TableHead className="text-right">Taxa Conversa/Clique</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topAdSets.map((adset, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-medium">{adset.adset}</TableCell>
                  <TableCell className="text-right">{adset.conversations}</TableCell>
                  <TableCell className="text-right">{adset.clicks}</TableCell>
                  <TableCell className="text-right font-medium text-accent">
                    {adset.rate.toFixed(2)}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Valor Médio de Conversão</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-emerald-600">
              R${" "}
              {list
                .filter((l) => l.conversion_value)
                .reduce((sum, l) => sum + (l.conversion_value || 0), 0) /
                (list.filter((l) => l.conversion_value).length || 1) || 0}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Custo por Conversa</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">
              R$ {list.length > 0 ? (kpis.spend / list.length).toFixed(2) : "0.00"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">ROI Estimado</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-accent">
              {((list.filter((l) => l.conversion_value).reduce((sum, l) => sum + (l.conversion_value || 0), 0) /
                kpis.spend -
                1) *
                100).toFixed(0)}
              %
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
