"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, AlertTriangle, AlertCircle, CheckCircle } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function InventoryList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  // TODO: Buscar dados do banco de dados
  const items = [
    {
      id: 1,
      productName: "Leite Integral 1L",
      category: "Laticínios",
      batches: 3,
      totalQuantity: 72,
      nearestExpiration: new Date("2025-02-15"),
      status: "warning",
    },
    {
      id: 2,
      productName: "Iogurte Natural",
      category: "Laticínios",
      batches: 2,
      totalQuantity: 48,
      nearestExpiration: new Date("2025-02-05"),
      status: "critical",
    },
    {
      id: 3,
      productName: "Arroz Branco 5kg",
      category: "Cereais",
      batches: 1,
      totalQuantity: 120,
      nearestExpiration: new Date("2025-06-20"),
      status: "safe",
    },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "critical":
        return <AlertTriangle className="h-4 w-4" />
      case "warning":
        return <AlertCircle className="h-4 w-4" />
      default:
        return <CheckCircle className="h-4 w-4" />
    }
  }

  const getStatusClass = (status: string) => {
    switch (status) {
      case "critical":
        return "status-critical"
      case "warning":
        return "status-warning"
      default:
        return "status-safe"
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Inventário de Lotes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar produto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="critical">Críticos</SelectItem>
                <SelectItem value="warning">Em Alerta</SelectItem>
                <SelectItem value="safe">Seguros</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            {items.map((item) => (
              <Card key={item.id} className={`border-l-4 ${getStatusClass(item.status)}`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(item.status)}
                        <h3 className="font-semibold">{item.productName}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">{item.category}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge variant="secondary">
                          {item.batches} {item.batches === 1 ? "lote" : "lotes"}
                        </Badge>
                        <Badge variant="secondary">{item.totalQuantity} unidades</Badge>
                      </div>
                    </div>
                    <div className="text-right text-sm">
                      <p className="text-muted-foreground">Vence em</p>
                      <p className="font-semibold">
                        {Math.ceil((item.nearestExpiration.getTime() - Date.now()) / (1000 * 60 * 60 * 24))} dias
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
