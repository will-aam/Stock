"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Clock, ShieldAlert, Save, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function AutomationRules() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Estados com dados mockados
  const [maxQuantity, setMaxQuantity] = useState(50);
  const [requireJustification, setRequireJustification] = useState(true);
  const [enableDelayAlert, setEnableDelayAlert] = useState(false);
  const [delayHours, setDelayHours] = useState(24);

  const handleSave = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Regras atualizadas",
        description: "As políticas de automação foram salvas com sucesso.",
      });
    }, 1000);
  };

  return (
    <div className="space-y-6 w-full">
      {/* Cabeçalho simples (opcional, apenas para contexto se necessário) */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Regras de Negócio</h3>
          <p className="text-sm text-muted-foreground">
            Defina os limites operacionais e SLAs do sistema.
          </p>
        </div>
        <Button onClick={handleSave} disabled={isLoading} size="sm">
          {isLoading ? (
            "Salvando..."
          ) : (
            <>
              <Save className="mr-2 h-3.5 w-3.5" />
              Salvar Regras
            </>
          )}
        </Button>
      </div>

      {/* Grid Layout: Lado a Lado em telas médias+ */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Bloco 1: Limites */}
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <ShieldAlert className="h-4 w-4 text-primary" />
              Limites e Restrições
            </CardTitle>
            <CardDescription>
              Evite pedidos excessivos ou fora do padrão.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Limite de Quantidade */}
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <Label htmlFor="max-qty" className="text-sm font-medium">
                  Limite de itens
                </Label>
                <p className="text-xs text-muted-foreground">
                  Máximo permitido por requisição.
                </p>
              </div>
              <Input
                id="max-qty"
                type="number"
                min="1"
                value={maxQuantity}
                onChange={(e) => setMaxQuantity(Number(e.target.value))}
                className="w-20 text-center h-8"
              />
            </div>

            <Separator />

            {/* Justificativa Obrigatória */}
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <Label htmlFor="justification" className="text-sm font-medium">
                  Justificativa de Urgência
                </Label>
                <p className="text-xs text-muted-foreground">
                  Exigir motivo ao marcar "Urgente".
                </p>
              </div>
              <Switch
                id="justification"
                checked={requireJustification}
                onCheckedChange={setRequireJustification}
              />
            </div>
          </CardContent>
        </Card>

        {/* Bloco 2: SLA */}
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Clock className="h-4 w-4 text-primary" />
              SLA e Prazos
            </CardTitle>
            <CardDescription>
              Alertas visuais para pedidos parados.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Alerta de Atraso */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <Label htmlFor="delay-alert" className="text-sm font-medium">
                    Destacar atrasos
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Cards "Novos" ficam vermelhos se expirarem.
                  </p>
                </div>
                <Switch
                  id="delay-alert"
                  checked={enableDelayAlert}
                  onCheckedChange={setEnableDelayAlert}
                />
              </div>

              {/* Configuração de horas (Condicional) */}
              {enableDelayAlert && (
                <div className="flex items-center gap-3 p-3 border border-dashed rounded-lg bg-muted/30 animate-in fade-in slide-in-from-top-1">
                  <AlertTriangle className="h-4 w-4 text-yellow-500 shrink-0" />
                  <div className="flex-1 flex items-center justify-between gap-2">
                    <Label
                      htmlFor="hours"
                      className="text-xs font-medium whitespace-nowrap"
                    >
                      Horas limite:
                    </Label>
                    <Input
                      id="hours"
                      type="number"
                      min="1"
                      value={delayHours}
                      onChange={(e) => setDelayHours(Number(e.target.value))}
                      className="w-16 h-7 text-center text-xs"
                    />
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
