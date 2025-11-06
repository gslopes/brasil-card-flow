import { KPICard } from "@/components/KPICard";
import { CampaignMetrics } from "@/components/CampaignMetrics";
import { LeadsTable } from "@/components/LeadsTable";
import { SegmentationAdjuster } from "@/components/SegmentationAdjuster";
import { TrendingUp, Users, MousePointerClick, DollarSign, Instagram, Activity } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
                <Instagram className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Brasil Card</h1>
                <p className="text-sm text-muted-foreground">Dashboard de Marketing Digital</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-accent animate-pulse" />
              <span className="text-sm font-medium text-muted-foreground">Atualização em tempo real</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Campaign Info Banner */}
        <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-xl p-6 border border-border/50">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Campanha: Negociação Brasil Card - Novembro 2024
              </h2>
              <p className="text-muted-foreground">
                Evento de negociação e orientação financeira • Instagram Ads
              </p>
            </div>
            <div className="flex gap-2">
              <span className="px-4 py-2 bg-accent/20 text-accent-foreground rounded-lg font-medium border border-accent/30">
                Ativa
              </span>
              <span className="px-4 py-2 bg-background rounded-lg text-muted-foreground border border-border/50">
                Iniciada: 01/11/2024
              </span>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <KPICard
            title="Impressões"
            value="234.5K"
            change="+12.3% vs. semana anterior"
            changeType="positive"
            icon={TrendingUp}
            iconColor="text-primary"
          />
          <KPICard
            title="Alcance"
            value="156.2K"
            change="+8.5% vs. semana anterior"
            changeType="positive"
            icon={Users}
            iconColor="text-primary"
          />
          <KPICard
            title="Cliques"
            value="9.8K"
            change="4.2% CTR (+0.3%)"
            changeType="positive"
            icon={MousePointerClick}
            iconColor="text-accent"
          />
          <KPICard
            title="Conversões"
            value="2.3K"
            change="R$ 15.20 CPA (-12%)"
            changeType="positive"
            icon={DollarSign}
            iconColor="text-accent"
          />
        </div>

        {/* Segmentation Adjuster */}
        <SegmentationAdjuster />

        {/* Campaign Metrics Charts */}
        <CampaignMetrics />

        {/* Leads Table */}
        <LeadsTable />
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/30 mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <p>© 2024 Brasil Card - Todos os direitos reservados</p>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-accent animate-pulse"></span>
              <span>Conectado à Meta Marketing API</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
