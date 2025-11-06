import { useEffect, useState } from "react";
import { Eye, Users, MousePointerClick, TrendingUp, DollarSign, Target, AlertCircle } from "lucide-react";
import { KPICard } from "@/components/KPICard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useInsightsStore } from "@/store/useInsightsStore";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { toast } from "sonner";

export default function Dashboard() {
  const { kpis, series, breakdownRows, filters, loading, lastUpdated, fetchInsights, suggestAudienceShift, applyAudienceShift, setFilters } = useInsightsStore();
  const [showSuggestionDialog, setShowSuggestionDialog] = useState(false);
  const [audienceFilter, setAudienceFilter] = useState<string>("all");
  const [suggestion, setSuggestion] = useState(suggestAudienceShift());

  useEffect(() => {
    fetchInsights();
  }, [fetchInsights]);

  const handleApplySuggestion = () => {
    applyAudienceShift();
    toast.success("Proposta aplicada", {
      description: "A segmentação da campanha foi ajustada conforme a sugestão.",
    });
    setShowSuggestionDialog(false);
  };

  const filteredBreakdown = breakdownRows.filter((row) => {
    if (audienceFilter === "35-55") {
      return row.age === "35-44" || row.age === "45-54";
    }
    return true;
  });

  const topPerformingAges = breakdownRows
    .reduce((acc, row) => {
      const existing = acc.find((a) => a.age === row.age);
      if (existing) {
        existing.impressions += row.impressions;
        existing.clicks += row.clicks;
      } else {
        acc.push({ age: row.age, impressions: row.impressions, clicks: row.clicks });
      }
      return acc;
    }, [] as Array<{ age: string; impressions: number; clicks: number }>)
    .map((item) => ({ ...item, ctr: (item.clicks / item.impressions) * 100 }))
    .sort((a, b) => b.ctr - a.ctr);

  const minutesAgo = lastUpdated
    ? Math.floor((new Date().getTime() - new Date(lastUpdated).getTime()) / 60000)
    : 0;

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard de Campanhas</h1>
          <p className="text-muted-foreground">
            {filters.accountId} • Últimos 30 dias • Instagram Ads
          </p>
        </div>
        {lastUpdated && (
          <Badge variant="outline" className="text-sm">
            Dados atualizados há {minutesAgo} min (simulado)
          </Badge>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
        <KPICard
          title="Impressões"
          value={kpis.impressions.toLocaleString("pt-BR")}
          icon={Eye}
          iconColor="text-primary"
        />
        <KPICard
          title="Alcance"
          value={kpis.reach.toLocaleString("pt-BR")}
          icon={Users}
          iconColor="text-primary"
        />
        <KPICard
          title="Cliques"
          value={kpis.clicks.toLocaleString("pt-BR")}
          icon={MousePointerClick}
          iconColor="text-accent"
        />
        <KPICard
          title="CTR"
          value={`${kpis.ctr.toFixed(2)}%`}
          icon={TrendingUp}
          iconColor="text-accent"
        />
        <KPICard
          title="CPC"
          value={`R$ ${kpis.cpc.toFixed(2)}`}
          icon={DollarSign}
          iconColor="text-muted-foreground"
        />
        <KPICard
          title="Investimento"
          value={`R$ ${kpis.spend.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
          icon={Target}
          iconColor="text-muted-foreground"
        />
      </div>

      <Card className="border-accent/20 bg-gradient-to-br from-accent/5 to-primary/5">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-accent" />
                Insight de Segmentação
              </CardTitle>
              <CardDescription className="mt-1">{suggestion.msg}</CardDescription>
            </div>
            <Button onClick={() => setShowSuggestionDialog(true)} className="bg-accent hover:bg-accent/90">
              Sugerir Ajuste de Público
            </Button>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Desempenho Diário</CardTitle>
          <CardDescription>Impressões, Cliques e Conversas WhatsApp</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={series}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="impressions" stroke="hsl(214 95% 50%)" name="Impressões" />
              <Line type="monotone" dataKey="clicks" stroke="hsl(151 65% 48%)" name="Cliques" />
              <Bar dataKey="conversations" fill="hsl(45 93% 47%)" name="Conversas" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Breakdown por Público</CardTitle>
              <CardDescription>Idade, Gênero e Placement • Instagram</CardDescription>
            </div>
            <Select value={audienceFilter} onValueChange={setAudienceFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os públicos</SelectItem>
                <SelectItem value="35-55">Filtrar 35-55 anos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="age">
            <TabsList>
              <TabsTrigger value="age">Por Idade</TabsTrigger>
              <TabsTrigger value="detailed">Detalhado</TabsTrigger>
            </TabsList>
            <TabsContent value="age" className="space-y-4">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topPerformingAges}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="age" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="impressions" fill="hsl(214 95% 50%)" name="Impressões" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="clicks" fill="hsl(151 65% 48%)" name="Cliques" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </TabsContent>
            <TabsContent value="detailed">
              <div className="max-h-[400px] overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Idade</TableHead>
                      <TableHead>Gênero</TableHead>
                      <TableHead>Placement</TableHead>
                      <TableHead className="text-right">Impressões</TableHead>
                      <TableHead className="text-right">Cliques</TableHead>
                      <TableHead className="text-right">CTR</TableHead>
                      <TableHead className="text-right">CPC</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBreakdown.slice(0, 20).map((row, idx) => (
                      <TableRow key={idx}>
                        <TableCell>
                          <Badge variant={row.age === "35-44" || row.age === "45-54" ? "default" : "outline"}>
                            {row.age}
                          </Badge>
                        </TableCell>
                        <TableCell className="capitalize">{row.gender}</TableCell>
                        <TableCell className="capitalize">{row.placement}</TableCell>
                        <TableCell className="text-right">{row.impressions.toLocaleString("pt-BR")}</TableCell>
                        <TableCell className="text-right">{row.clicks.toLocaleString("pt-BR")}</TableCell>
                        <TableCell className="text-right">{row.ctr.toFixed(2)}%</TableCell>
                        <TableCell className="text-right">R$ {row.cpc.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Dialog open={showSuggestionDialog} onOpenChange={setShowSuggestionDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">Sugestão de Ajuste de Público</DialogTitle>
            <DialogDescription>
              Com base nos dados de performance das últimas campanhas
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="p-4 bg-accent/10 border border-accent/20 rounded-lg">
              <p className="font-medium mb-2">📊 Insight</p>
              <p className="text-sm text-muted-foreground">{suggestion.msg}</p>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2 text-accent">➕ Aumentar orçamento</h4>
                {suggestion.proposal.increase.map((item, idx) => (
                  <div key={idx} className="flex justify-between p-2 bg-card border rounded">
                    <span className="text-sm">{item.segment}</span>
                    <Badge className="bg-accent text-accent-foreground">+{item.pct}%</Badge>
                  </div>
                ))}
              </div>

              <div>
                <h4 className="font-medium mb-2 text-destructive">➖ Reduzir orçamento</h4>
                {suggestion.proposal.decrease.map((item, idx) => (
                  <div key={idx} className="flex justify-between p-2 bg-card border rounded">
                    <span className="text-sm">{item.segment}</span>
                    <Badge variant="destructive">{item.pct}%</Badge>
                  </div>
                ))}
              </div>
            </div>

            <Alert className="border-primary bg-primary/10">
              <AlertCircle className="h-4 w-4 text-primary" />
              <AlertDescription>
                Com base nos dados atuais, o público 35-54 anos está convertendo significativamente
                melhor. Considere aumentar o orçamento para este segmento.
              </AlertDescription>
            </Alert>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSuggestionDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleApplySuggestion} className="bg-accent hover:bg-accent/90">
              Aplicar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
