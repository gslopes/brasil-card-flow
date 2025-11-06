import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MessageSquare, Eye, TrendingUp } from "lucide-react";

interface Lead {
  id: string;
  nome: string;
  telefone: string;
  campanha: string;
  segmento: string;
  anuncio: string;
  status: "novo" | "contatado" | "convertido";
  data: string;
  origem: string;
}

const mockLeads: Lead[] = [
  {
    id: "1",
    nome: "Maria Silva",
    telefone: "+55 11 98765-4321",
    campanha: "Negociação Brasil Card - Nov/2024",
    segmento: "35-44 anos, Feminino, SP",
    anuncio: "Orientação Financeira Gratuita",
    status: "novo",
    data: "2024-11-06 14:23",
    origem: "Instagram Stories"
  },
  {
    id: "2",
    nome: "João Santos",
    telefone: "+55 21 97654-3210",
    campanha: "Negociação Brasil Card - Nov/2024",
    segmento: "45-54 anos, Masculino, RJ",
    anuncio: "Renegociação de Dívidas",
    status: "contatado",
    data: "2024-11-06 13:45",
    origem: "Instagram Feed"
  },
  {
    id: "3",
    nome: "Ana Costa",
    telefone: "+55 11 96543-2109",
    campanha: "Negociação Brasil Card - Nov/2024",
    segmento: "35-44 anos, Feminino, SP",
    anuncio: "Orientação Financeira Gratuita",
    status: "novo",
    data: "2024-11-06 12:10",
    origem: "Instagram Reels"
  },
  {
    id: "4",
    nome: "Carlos Oliveira",
    telefone: "+55 31 95432-1098",
    campanha: "Negociação Brasil Card - Nov/2024",
    segmento: "25-34 anos, Masculino, MG",
    anuncio: "Condições Especiais de Pagamento",
    status: "convertido",
    data: "2024-11-06 11:30",
    origem: "Instagram Feed"
  },
  {
    id: "5",
    nome: "Patricia Lima",
    telefone: "+55 85 94321-0987",
    campanha: "Negociação Brasil Card - Nov/2024",
    segmento: "35-44 anos, Feminino, CE",
    anuncio: "Orientação Financeira Gratuita",
    status: "novo",
    data: "2024-11-06 10:15",
    origem: "Instagram Stories"
  },
];

export const LeadsTable = () => {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const getStatusBadge = (status: Lead["status"]) => {
    const variants = {
      novo: "default",
      contatado: "secondary",
      convertido: "default"
    } as const;

    const colors = {
      novo: "bg-primary text-primary-foreground",
      contatado: "bg-warning text-warning-foreground",
      convertido: "bg-accent text-accent-foreground"
    };

    return (
      <Badge className={colors[status]}>
        {status === "novo" ? "Novo" : status === "contatado" ? "Contatado" : "Convertido"}
      </Badge>
    );
  };

  return (
    <>
      <Card className="border-border/50 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                Leads do WhatsApp
              </CardTitle>
              <CardDescription>Leads gerados pelas campanhas Instagram Ads</CardDescription>
            </div>
            <Badge variant="outline" className="text-lg px-4 py-2">
              {mockLeads.filter(l => l.status === "novo").length} novos
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-border/50">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead>Nome</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Campanha</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockLeads.map((lead) => (
                  <TableRow key={lead.id} className="hover:bg-muted/20">
                    <TableCell className="font-medium">{lead.nome}</TableCell>
                    <TableCell>{lead.telefone}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{lead.campanha}</TableCell>
                    <TableCell>{getStatusBadge(lead.status)}</TableCell>
                    <TableCell className="text-muted-foreground">{lead.data}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedLead(lead)}
                        className="hover:bg-primary/10"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Ver Detalhes
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selectedLead} onOpenChange={() => setSelectedLead(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">Detalhes do Lead</DialogTitle>
            <DialogDescription>
              Informações completas sobre a origem e perfil do lead
            </DialogDescription>
          </DialogHeader>
          {selectedLead && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Nome</p>
                  <p className="text-lg font-semibold">{selectedLead.nome}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Telefone</p>
                  <p className="text-lg font-semibold">{selectedLead.telefone}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  {getStatusBadge(selectedLead.status)}
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Data de Contato</p>
                  <p className="text-base">{selectedLead.data}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  Origem da Campanha
                </h4>
                <div className="space-y-3 bg-muted/30 p-4 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Campanha</p>
                    <p className="text-base font-medium">{selectedLead.campanha}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Anúncio</p>
                    <p className="text-base font-medium">{selectedLead.anuncio}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Segmentação</p>
                    <p className="text-base font-medium">{selectedLead.segmento}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Origem</p>
                    <Badge variant="outline">{selectedLead.origem}</Badge>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button className="flex-1 bg-accent hover:bg-accent/90">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Abrir no WhatsApp
                </Button>
                <Button variant="outline" className="flex-1">
                  Marcar como Contatado
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
