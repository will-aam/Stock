import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package, ClipboardCheck } from "lucide-react"

export function ActivityFeed() {
  // TODO: Buscar atividades recentes do banco de dados
  const activities = [
    {
      id: 1,
      type: "entry",
      user: "João Silva",
      action: "Adicionou lote de Leite Integral 1L",
      quantity: 24,
      time: "Há 5 minutos",
    },
    {
      id: 2,
      type: "audit",
      user: "Maria Santos",
      action: "Completou auditoria da seção Laticínios",
      time: "Há 23 minutos",
    },
    {
      id: 3,
      type: "entry",
      user: "Pedro Costa",
      action: "Adicionou lote de Iogurte Natural",
      quantity: 48,
      time: "Há 1 hora",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Atividades Recentes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-4 pb-4 border-b last:border-0 last:pb-0">
              <div className={`p-2 rounded-lg ${activity.type === "entry" ? "bg-primary/10" : "bg-secondary"}`}>
                {activity.type === "entry" ? (
                  <Package className="h-4 w-4 text-primary" />
                ) : (
                  <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">{activity.action}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{activity.user}</span>
                  <span>•</span>
                  <span>{activity.time}</span>
                </div>
                {activity.quantity && (
                  <Badge variant="secondary" className="text-xs">
                    {activity.quantity} unidades
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
