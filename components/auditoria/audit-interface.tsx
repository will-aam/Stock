"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function AuditInterface() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const { toast } = useToast()

  // TODO: Buscar itens para auditoria do banco de dados
  const auditItems = [
    {
      id: 1,
      productName: "Leite Integral 1L",
      batchId: "L-2025-001",
      expirationDate: new Date("2025-02-15"),
      quantity: 24,
      location: "Prateleira A3",
      status: "warning",
    },
    {
      id: 2,
      productName: "Iogurte Natural",
      batchId: "Y-2025-012",
      expirationDate: new Date("2025-02-05"),
      quantity: 12,
      location: "Geladeira B2",
      status: "critical",
    },
  ]

  const currentItem = auditItems[currentIndex]

  const handleConfirm = () => {
    // TODO: Registrar confirmação no banco de dados
    toast({
      title: "Item confirmado",
      description: `${currentItem.productName} está presente no estoque`,
    })
    moveToNext()
  }

  const handleMarkEmpty = () => {
    // TODO: Registrar depleção no banco de dados
    toast({
      title: "Lote marcado como vazio",
      description: `${currentItem.productName} foi removido do estoque`,
    })
    moveToNext()
  }

  const moveToNext = () => {
    if (currentIndex < auditItems.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      toast({
        title: "Auditoria concluída!",
        description: "Todos os itens foram verificados",
      })
    }
  }

  if (!currentItem) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <CheckCircle className="h-16 w-16 mx-auto text-green-500 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Auditoria Completa!</h2>
          <p className="text-muted-foreground">Não há itens para auditar no momento.</p>
        </CardContent>
      </Card>
    )
  }

  const daysUntilExpiration = Math.ceil((currentItem.expirationDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Modo Auditoria</h1>
        <Badge variant="secondary">
          {currentIndex + 1} de {auditItems.length}
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Item para Verificação</CardTitle>
            <Badge className={currentItem.status === "critical" ? "bg-destructive" : "bg-yellow-500"}>
              {currentItem.status === "critical" ? (
                <>
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Crítico
                </>
              ) : (
                "Alerta"
              )}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold mb-1">{currentItem.productName}</h2>
              <p className="text-sm text-muted-foreground">Lote: {currentItem.batchId}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
              <div>
                <p className="text-sm text-muted-foreground">Validade</p>
                <p className="font-semibold">{currentItem.expirationDate.toLocaleDateString("pt-BR")}</p>
                <p className="text-xs text-muted-foreground mt-1">{daysUntilExpiration} dias restantes</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Quantidade</p>
                <p className="font-semibold">{currentItem.quantity} unidades</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-muted-foreground">Localização</p>
                <p className="font-semibold">{currentItem.location}</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <p className="font-semibold text-center">O item está presente no estoque?</p>
            <div className="grid grid-cols-2 gap-3">
              <Button onClick={handleConfirm} size="lg" className="h-16 mobile-button bg-green-600 hover:bg-green-700">
                <CheckCircle className="mr-2 h-5 w-5" />
                Confirmar Presença
              </Button>
              <Button onClick={handleMarkEmpty} size="lg" variant="destructive" className="h-16 mobile-button">
                <XCircle className="mr-2 h-5 w-5" />
                Marcar como Vazio
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
