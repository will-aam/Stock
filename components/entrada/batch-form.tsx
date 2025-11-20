"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Plus, Minus } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useToast } from "@/hooks/use-toast"

interface BatchFormProps {
  productId: number
  onSuccess: () => void
}

export function BatchForm({ productId, onSuccess }: BatchFormProps) {
  const [expirationDate, setExpirationDate] = useState<Date>()
  const [quantity, setQuantity] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async () => {
    if (!expirationDate) {
      toast({
        title: "Data obrigatória",
        description: "Selecione a data de validade",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    // TODO: Salvar lote no banco de dados
    console.log("Salvando lote:", { productId, expirationDate, quantity })

    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Lote registrado!",
        description: `${quantity} unidades adicionadas ao estoque`,
      })
      onSuccess()
    }, 500)
  }

  return (
    <div className="space-y-4 pt-4 border-t">
      <h4 className="font-semibold">Detalhes do Lote</h4>

      <div className="space-y-2">
        <Label>Data de Validade</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal mobile-button bg-transparent"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {expirationDate ? format(expirationDate, "PPP", { locale: ptBR }) : "Selecione a data"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={expirationDate}
              onSelect={setExpirationDate}
              disabled={(date) => date < new Date()}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <Label>Quantidade</Label>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="shrink-0"
          >
            <Minus className="h-4 w-4" />
          </Button>
          <Input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, Number.parseInt(e.target.value) || 1))}
            className="text-center font-semibold mobile-optimized"
            min="1"
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => setQuantity(quantity + 1)}
            className="shrink-0"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Button onClick={handleSubmit} className="w-full mobile-button" disabled={isLoading} size="lg">
        {isLoading ? "Salvando..." : "Confirmar Entrada"}
      </Button>
    </div>
  )
}
