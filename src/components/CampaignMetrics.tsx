import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

const ageData = [
  { age: "18-24", engajamento: 2400, conversoes: 240 },
  { age: "25-34", engajamento: 4200, conversoes: 520 },
  { age: "35-44", engajamento: 5800, conversoes: 780 },
  { age: "45-54", engajamento: 4100, conversoes: 610 },
  { age: "55+", engajamento: 2100, conversoes: 180 },
];

const genderData = [
  { name: "Feminino", value: 5800 },
  { name: "Masculino", value: 4200 },
];

const regionData = [
  { regiao: "Sul", leads: 1200 },
  { regiao: "Sudeste", leads: 3400 },
  { regiao: "Centro-Oeste", leads: 800 },
  { regiao: "Nordeste", leads: 2100 },
  { regiao: "Norte", leads: 500 },
];

const COLORS = ['hsl(214 95% 50%)', 'hsl(151 65% 48%)'];

export const CampaignMetrics = () => {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle>Desempenho por Faixa Etária</CardTitle>
          <CardDescription>Engajamento e conversões por idade</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ageData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="age" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Bar dataKey="engajamento" fill="hsl(214 95% 50%)" radius={[8, 8, 0, 0]} />
              <Bar dataKey="conversoes" fill="hsl(151 65% 48%)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle>Distribuição por Gênero</CardTitle>
          <CardDescription>Público alcançado</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={genderData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {genderData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="border-border/50 shadow-sm md:col-span-2">
        <CardHeader>
          <CardTitle>Leads por Região</CardTitle>
          <CardDescription>Distribuição geográfica dos leads gerados</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={regionData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
              <YAxis dataKey="regiao" type="category" stroke="hsl(var(--muted-foreground))" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="leads" fill="hsl(214 95% 50%)" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
