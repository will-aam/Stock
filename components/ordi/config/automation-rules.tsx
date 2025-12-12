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
import { Clock, AlertTriangle, ShieldAlert, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function AutomationRules() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Estados com dados mockados (falsos) iniciais
  const [maxQuantity, setMaxQuantity] = useState(50);
  const [requireJustification, setRequireJustification] = useState(true);
  const [enableDelayAlert, setEnableDelayAlert] = useState(false);
  const [delayHours, setDelayHours] = useState(24);

  const handleSave = () => {
    setIsLoading(true);

    // Simulação de salvamento no backend
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Regras atualizadas",
        description: "As políticas de automação foram salvas com sucesso.",
      });
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-primary" />
            Limites e Restrições
          </CardTitle>
          <CardDescription>
            Defina limites para evitar pedidos excessivos ou fora do padrão.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Limite de Quantidade */}
          <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div className="space-y-0.5">
              <Label htmlFor="max-qty" className="text-base">
                Limite de itens por pedido
              </Label>
              <p className="text-sm text-muted-foreground">
                Quantidade máxima permitida em uma única requisição.
              </p>
            </div>
            <div className="w-full sm:w-32">
              <Input
                id="max-qty"
                type="number"
                min="1"
                value={maxQuantity}
                onChange={(e) => setMaxQuantity(Number(e.target.value))}
                className="text-right"
              />
            </div>
          </div>

          <Separator />

          {/* Justificativa Obrigatória */}
          <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div className="space-y-0.5">
              <Label htmlFor="justification" className="text-base">
                Exigir Justificativa em Alta Prioridade
              </Label>
              <p className="text-sm text-muted-foreground">
                Se ativado, o usuário deve escrever o motivo ao marcar
                "Urgente".
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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            SLA e Prazos
          </CardTitle>
          <CardDescription>
            Configurações visuais para alertar sobre pedidos parados.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Alerta de Atraso */}
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="delay-alert" className="text-base">
                  Destacar pedidos atrasados
                </Label>
                <p className="text-sm text-muted-foreground">
                  Cards na coluna "Novos" ficarão vermelhos após um tempo
                  limite.
                </p>
              </div>
              <Switch
                id="delay-alert"
                checked={enableDelayAlert}
                onCheckedChange={setEnableDelayAlert}
              />
            </div>

            {/* Configuração condicional do tempo (só aparece se o switch estiver ligado) */}
            {enableDelayAlert && (
              <div className="flex items-center gap-4 p-4 border rounded-md bg-muted/30 animate-in fade-in slide-in-from-top-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500 shrink-0" />
                <div className="flex-1 space-y-1">
                  <Label htmlFor="hours" className="text-sm font-medium">
                    Tempo limite (horas)
                  </Label>
                  <Input
                    id="hours"
                    type="number"
                    min="1"
                    value={delayHours}
                    onChange={(e) => setDelayHours(Number(e.target.value))}
                    className="w-full sm:w-32"
                  />
                </div>
                <p className="text-xs text-muted-foreground max-w-[200px]">
                  Após {delayHours} horas sem movimentação, o card receberá
                  destaque visual.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={isLoading}
          className="w-full sm:w-auto"
        >
          {isLoading ? (
            "Salvando..."
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Salvar Regras
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
