import { useEffect, useState } from "react";
import { useLeadsStore } from "@/store/useLeadsStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { MessageSquare, Phone, TrendingUp, AlertCircle, User, Calendar, CheckCircle2, Tag } from "lucide-react";
import { Lead } from "@/types";
import { toast } from "sonner";

export default function Leads() {
  const { list, selected, loading, fetchLeads, fetchLead, assignLead, setStatus } = useLeadsStore();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [newOwner, setNewOwner] = useState("");
  const [conversionValue, setConversionValue] = useState("");

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  useEffect(() => {
    if (selectedLeadId) {
      fetchLead(selectedLeadId);
    }
  }, [selectedLeadId, fetchLead]);

  const handleOpenLead = (leadId: string) => {
    setSelectedLeadId(leadId);
  };

  const handleCloseLead = () => {
    setSelectedLeadId(null);
  };

  const handleAssign = async () => {
    if (selected && newOwner) {
      await assignLead(selected.id, newOwner);
      toast.success("Lead atribuído com sucesso!");
      setNewOwner("");
    }
  };

  const handleMarkConverted = async () => {
    if (selected && conversionValue) {
      await setStatus(selected.id, "won", parseFloat(conversionValue));
      toast.success("Lead marcado como convertido!");
      setConversionValue("");
      handleCloseLead();
    }
  };

  const filteredLeads = statusFilter === "all" ? list : list.filter((l) => l.status === statusFilter);

  const getStatusBadge = (status: Lead["status"]) => {
    const variants = {
      new: { variant: "default" as const, label: "Novo", className: "bg-cyan-500 hover:bg-cyan-600" },
      open: { variant: "default" as const, label: "Em atendimento", className: "bg-amber-500 hover:bg-amber-600" },
      won: { variant: "default" as const, label: "Convertido", className: "bg-emerald-500 hover:bg-emerald-600" },
    };
    const config = variants[status];
    return (
      <Badge variant={config.variant} className={config.className}>
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Leads do WhatsApp</h1>
          <p className="text-muted-foreground">Origem das campanhas Instagram Ads → CTWA</p>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            <SelectItem value="new">Novos</SelectItem>
            <SelectItem value="open">Em atendimento</SelectItem>
            <SelectItem value="won">Convertidos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total de Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{list.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Novos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-cyan-600">
              {list.filter((l) => l.status === "new").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Em atendimento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              {list.filter((l) => l.status === "open").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Convertidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              {list.filter((l) => l.status === "won").length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Leads</CardTitle>
          <CardDescription>Clique em um lead para ver detalhes e origem da campanha</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Telefone</TableHead>
                <TableHead>Primeira Mensagem</TableHead>
                <TableHead>Campanha/Ad</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Responsável</TableHead>
                <TableHead>Data</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeads.map((lead) => (
                <TableRow key={lead.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell className="font-medium">{lead.wa_phone}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{lead.first_message}</TableCell>
                  <TableCell>
                    {lead.referral ? (
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium">{lead.referral.headline}</span>
                        <span className="text-xs text-muted-foreground">Ad {lead.ad_id}</span>
                      </div>
                    ) : (
                      <Badge variant="outline" className="text-xs">
                        Origem desconhecida
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-accent"
                          style={{ width: `${lead.score}%` }}
                        />
                      </div>
                      <span className="text-sm">{lead.score}</span>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(lead.status)}</TableCell>
                  <TableCell>{lead.owner || "—"}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(lead.created_time).toLocaleDateString("pt-BR")}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleOpenLead(lead.id)}
                    >
                      Ver detalhes
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!selectedLeadId} onOpenChange={(open) => !open && handleCloseLead()}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Detalhes do Lead</DialogTitle>
            <DialogDescription>
              {selected?.wa_phone} • Recebido em{" "}
              {selected && new Date(selected.created_time).toLocaleString("pt-BR")}
            </DialogDescription>
          </DialogHeader>

          {selected && (
            <Tabs defaultValue="origin" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="origin">Origem</TabsTrigger>
                <TabsTrigger value="context">Contexto</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
              </TabsList>

              <TabsContent value="origin" className="space-y-4">
                {selected.referral ? (
                  <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5 text-primary" />
                        Origem do Lead: Instagram Ad
                      </CardTitle>
                      <CardDescription>
                        Origem do lead: Anúncio Instagram "{selected.referral.headline}" (Ad{" "}
                        {selected.ad_id})
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {selected.referral.image_url && (
                        <img
                          src={selected.referral.image_url}
                          alt="Ad preview"
                          className="w-full rounded-lg border"
                        />
                      )}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Headline</p>
                          <p className="font-medium">{selected.referral.headline}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Body</p>
                          <p className="text-sm">{selected.referral.body}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Source ID</p>
                          <p className="text-sm font-mono">{selected.referral.source_id}</p>
                        </div>
                        {selected.ctwa_clid && (
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">CTWA Click ID</p>
                            <p className="text-sm font-mono">{selected.ctwa_clid}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="border-destructive/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-destructive" />
                        Origem Desconhecida
                      </CardTitle>
                      <CardDescription>
                        Este lead não possui informações de referral. Considere melhorar o tracking.
                      </CardDescription>
                    </CardHeader>
                  </Card>
                )}

                <div className="space-y-2">
                  <Label>Primeira mensagem</Label>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm">{selected.first_message}</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="context" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Contexto da Campanha</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {selected.referral && (
                      <>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="p-3 bg-card border rounded-lg text-center">
                            <p className="text-xs text-muted-foreground mb-1">CTR Médio</p>
                            <p className="text-lg font-bold text-primary">3.8%</p>
                          </div>
                          <div className="p-3 bg-card border rounded-lg text-center">
                            <p className="text-xs text-muted-foreground mb-1">CPC</p>
                            <p className="text-lg font-bold text-primary">R$ 0.85</p>
                          </div>
                          <div className="p-3 bg-card border rounded-lg text-center">
                            <p className="text-xs text-muted-foreground mb-1">Público-alvo</p>
                            <p className="text-sm font-bold">35-54 anos</p>
                          </div>
                        </div>

                        <div className="p-4 bg-accent/10 border border-accent/20 rounded-lg">
                          <p className="text-sm font-medium mb-2">🎯 Roteiro de Abordagem</p>
                          <ul className="text-sm space-y-1 text-muted-foreground">
                            <li>• Agradecer o interesse no evento de negociação</li>
                            <li>• Destacar benefícios: orientação financeira gratuita</li>
                            <li>• Mencionar vagas limitadas (senso de urgência)</li>
                            <li>• Oferecer agendamento imediato</li>
                          </ul>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="timeline" className="space-y-4">
                <div className="space-y-4">
                  <div className="flex gap-4 items-start">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                      <MessageSquare className="h-4 w-4 text-primary-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Clique no anúncio</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(selected.created_time).toLocaleString("pt-BR")}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start">
                    <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                      <Phone className="h-4 w-4 text-accent-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Início da conversa WhatsApp</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(selected.created_time).toLocaleString("pt-BR")}
                      </p>
                      <div className="mt-2 p-3 bg-muted rounded-lg">
                        <p className="text-sm">{selected.first_message}</p>
                      </div>
                    </div>
                  </div>
                  {selected.owner && (
                    <div className="flex gap-4 items-start">
                      <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center">
                        <User className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Atribuído a {selected.owner}</p>
                        <p className="text-xs text-muted-foreground">Status: {selected.status}</p>
                      </div>
                    </div>
                  )}
                  {selected.status === "won" && (
                    <div className="flex gap-4 items-start">
                      <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
                        <CheckCircle2 className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Lead convertido</p>
                        {selected.conversion_value && (
                          <p className="text-xs text-muted-foreground">
                            Valor: R$ {selected.conversion_value.toLocaleString("pt-BR")}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          )}

          <DialogFooter className="flex-col sm:flex-row gap-4">
            <div className="flex-1 space-y-2">
              <Label>Atribuir a</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Nome do responsável"
                  value={newOwner}
                  onChange={(e) => setNewOwner(e.target.value)}
                />
                <Button onClick={handleAssign} disabled={!newOwner}>
                  Atribuir
                </Button>
              </div>
            </div>

            {selected?.status !== "won" && (
              <div className="flex-1 space-y-2">
                <Label>Marcar como convertido</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Valor (R$)"
                    value={conversionValue}
                    onChange={(e) => setConversionValue(e.target.value)}
                  />
                  <Button
                    onClick={handleMarkConverted}
                    disabled={!conversionValue}
                    className="bg-emerald-500 hover:bg-emerald-600"
                  >
                    Converter
                  </Button>
                </div>
              </div>
            )}

            <Button variant="outline" onClick={handleCloseLead}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
