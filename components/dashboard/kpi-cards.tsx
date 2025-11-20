import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, AlertCircle, Package } from "lucide-react"

export function KPICards() {
  // TODO: Buscar dados reais do banco de dados
  const kpis = [
    {
      title: "Itens Críticos",
      value: 12,
      subtitle: "Vencem em < 15 dias",
      icon: AlertTriangle,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
    },
    {
      title: "Itens em Alerta",
      value: 34,
      subtitle: "Vencem em < 45 dias",
      icon: AlertCircle,
      color: "text-yellow-600 dark:text-yellow-400",
      bgColor: "bg-yellow-500/10",
    },
    {
      title: "Valor em Estoque",
      value: "R$ 45.320",
      subtitle: "Total de produtos",
      icon: Package,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {kpis.map((kpi) => (
        <Card key={kpi.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
            <div className={`p-2 rounded-lg ${kpi.bgColor}`}>
              <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpi.value}</div>
            <p className="text-xs text-muted-foreground mt-1">{kpi.subtitle}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
