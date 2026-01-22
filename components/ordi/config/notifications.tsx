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
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Save,
  RotateCcw,
  Mail,
  Smartphone,
  BellRing,
  AlertTriangle,
  Info,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function NotificationsSettings() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Estados
  const [emailNewRequest, setEmailNewRequest] = useState(true);
  const [emailLowStock, setEmailLowStock] = useState(true);
  const [emailStatusChange, setEmailStatusChange] = useState(true);

  const handleSave = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Preferências salvas",
        description: "Suas configurações de notificação foram atualizadas.",
      });
    }, 800);
  };

  const handleReset = () => {
    setEmailNewRequest(true);
    setEmailLowStock(true);
    setEmailStatusChange(true);
    toast({
      title: "Restaurado",
      description: "Configurações padrão aplicadas.",
    });
  };

  return (
    <div className="space-y-6 w-full">
      {/* Cabeçalho da Seção */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-medium">Canais de Notificação</h3>
          <p className="text-sm text-muted-foreground">
            Escolha como e quando você deseja ser alertado pelo sistema.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            disabled={isLoading}
            className="text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="mr-2 h-3.5 w-3.5" />
            Restaurar
          </Button>
          <Button size="sm" onClick={handleSave} disabled={isLoading}>
            {isLoading ? (
              "Salvando..."
            ) : (
              <>
                <Save className="mr-2 h-3.5 w-3.5" />
                Salvar Alterações
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Card 1: E-mails (Ativo) */}
        <Card className="border shadow-sm">
          <CardHeader className="pb-1">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base">E-mail</CardTitle>
                <CardDescription>
                  Alertas enviados para seu endereço cadastrado.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <Separator />
          <CardContent className="pt-6 space-y-6">
            {/* Item 1 */}
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-0.5">
                <Label htmlFor="new-req" className="text-base font-medium">
                  Nova Requisição
                </Label>
                <p className="text-sm text-muted-foreground">
                  Receba um aviso sempre que um funcionário criar um novo
                  pedido.
                </p>
              </div>
              <Switch
                id="new-req"
                checked={emailNewRequest}
                onCheckedChange={setEmailNewRequest}
              />
            </div>

            {/* Item 2 */}
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-0.5">
                <Label
                  htmlFor="low-stock"
                  className="text-base font-medium flex items-center gap-2"
                >
                  Estoque Crítico
                </Label>
                <p className="text-sm text-muted-foreground">
                  Alerta automático quando um item solicitado estiver com saldo
                  baixo.
                </p>
              </div>
              <Switch
                id="low-stock"
                checked={emailLowStock}
                onCheckedChange={setEmailLowStock}
              />
            </div>

            {/* Item 3 */}
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-0.5">
                <Label
                  htmlFor="status-change"
                  className="text-base font-medium"
                >
                  Atualizações de Status
                </Label>
                <p className="text-sm text-muted-foreground">
                  Notificar o solicitante quando o pedido for Aprovado ou
                  Entregue.
                </p>
              </div>
              <Switch
                id="status-change"
                checked={emailStatusChange}
                onCheckedChange={setEmailStatusChange}
              />
            </div>
          </CardContent>
        </Card>

        {/* Card 2: App Mobile (Em Breve) */}
        <Card className="border shadow-sm bg-muted/20 relative overflow-hidden">
          {/* Faixa decorativa "Em Breve" */}
          <div className="absolute top-0 right-0 p-4">
            <Badge
              variant="outline"
              className="bg-background/80 backdrop-blur text-muted-foreground border-dashed"
            >
              Em desenvolvimento
            </Badge>
          </div>

          <CardHeader className="pb-1 opacity-75">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-muted rounded-lg border">
                <Smartphone className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <CardTitle className="text-base text-muted-foreground">
                  Aplicativo Mobile
                </CardTitle>
                <CardDescription>
                  Notificações Push direto no celular.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <Separator className="opacity-50" />
          <CardContent className="pt-6 space-y-6 opacity-60">
            {/* Item Mockado */}
            <div className="flex items-start justify-between gap-4 pointer-events-none grayscale">
              <div className="space-y-0.5">
                <Label className="text-base font-medium">
                  Notificações Push
                </Label>
                <p className="text-sm text-muted-foreground">
                  Alertas em tempo real sobre movimentações e aprovações.
                </p>
              </div>
              <Switch disabled checked={false} />
            </div>

            {/* Banner Informativo */}
            <div className="rounded-lg border border-dashed p-4 bg-background/50 flex gap-3 items-start">
              <Info className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground/80">
                  Recurso em Produção
                </p>
                <p className="text-xs text-muted-foreground">
                  Estamos desenvolvendo o aplicativo oficial do Stock System. Em
                  breve você poderá gerenciar tudo pelo celular.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
