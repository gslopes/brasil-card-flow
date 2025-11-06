import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Settings2, TrendingUp, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export const SegmentationAdjuster = () => {
  const [open, setOpen] = useState(false);
  const [ageRange, setAgeRange] = useState([35, 54]);
  const [budget, setBudget] = useState([5000]);
  const [region, setRegion] = useState("sudeste");
  const [gender, setGender] = useState("all");

  const handleApplyChanges = () => {
    toast.success("Segmentação atualizada com sucesso!", {
      description: `A campanha foi ajustada para o público: ${ageRange[0]}-${ageRange[1]} anos, ${gender === "all" ? "todos os gêneros" : gender}, região ${region}.`
    });
    setOpen(false);
  };

  return (
    <Card className="border-border/50 shadow-sm bg-gradient-to-br from-primary/5 to-accent/5">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Insights de Segmentação
            </CardTitle>
            <CardDescription>Público de melhor desempenho</CardDescription>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Settings2 className="h-4 w-4 mr-2" />
                Ajustar Segmentação
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-2xl">Ajustar Segmentação da Campanha</DialogTitle>
                <DialogDescription>
                  Configure o público-alvo para otimizar o desempenho da campanha
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6 py-4">
                <div className="space-y-3">
                  <Label className="text-base font-medium">Faixa Etária: {ageRange[0]} - {ageRange[1]} anos</Label>
                  <Slider
                    value={ageRange}
                    onValueChange={setAgeRange}
                    min={18}
                    max={65}
                    step={1}
                    className="w-full"
                  />
                  <p className="text-sm text-muted-foreground">
                    Ajuste a faixa etária do público-alvo
                  </p>
                </div>

                <div className="space-y-3">
                  <Label className="text-base font-medium">Orçamento Diário: R$ {budget[0].toLocaleString('pt-BR')}</Label>
                  <Slider
                    value={budget}
                    onValueChange={setBudget}
                    min={1000}
                    max={20000}
                    step={500}
                    className="w-full"
                  />
                  <p className="text-sm text-muted-foreground">
                    Defina o investimento diário na campanha
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-base font-medium">Região</Label>
                    <Select value={region} onValueChange={setRegion}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sudeste">Sudeste</SelectItem>
                        <SelectItem value="sul">Sul</SelectItem>
                        <SelectItem value="nordeste">Nordeste</SelectItem>
                        <SelectItem value="norte">Norte</SelectItem>
                        <SelectItem value="centro-oeste">Centro-Oeste</SelectItem>
                        <SelectItem value="all">Todas as Regiões</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-base font-medium">Gênero</Label>
                    <Select value={gender} onValueChange={setGender}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="feminino">Feminino</SelectItem>
                        <SelectItem value="masculino">Masculino</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Recomendação do Sistema</p>
                      <p className="text-sm text-muted-foreground">
                        Com base nos dados atuais, o público 35-54 anos na região Sudeste está convertendo 45% melhor. 
                        Considere aumentar o orçamento para este segmento.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleApplyChanges} className="bg-primary hover:bg-primary/90">
                  Aplicar Alterações
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-background/60 rounded-lg border border-border/30">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Público de Melhor Performance</p>
              <p className="text-lg font-bold text-foreground mt-1">35-54 anos, Feminino, Sudeste</p>
            </div>
            <Badge className="bg-accent text-accent-foreground text-base px-3 py-1">
              +45% conversão
            </Badge>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-background/60 rounded-lg border border-border/30 text-center">
              <p className="text-xs text-muted-foreground mb-1">Taxa Engajamento</p>
              <p className="text-lg font-bold text-primary">8.7%</p>
            </div>
            <div className="p-3 bg-background/60 rounded-lg border border-border/30 text-center">
              <p className="text-xs text-muted-foreground mb-1">CTR</p>
              <p className="text-lg font-bold text-primary">4.2%</p>
            </div>
            <div className="p-3 bg-background/60 rounded-lg border border-border/30 text-center">
              <p className="text-xs text-muted-foreground mb-1">CPA</p>
              <p className="text-lg font-bold text-accent">R$ 12,50</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
