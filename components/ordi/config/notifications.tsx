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
import { Separator } from "@/components/ui/separator";
import { Bell, Mail, MessageSquare, Save, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function NotificationsSettings() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Estados das notificações (Mockados)
  const [adminNewRequest, setAdminNewRequest] = useState(true);
  const [adminLowStock, setAdminLowStock] = useState(true);
  const [adminDailyDigest, setAdminDailyDigest] = useState(false);

  const [userStatusChange, setUserStatusChange] = useState(true);
  const [userCommentAlert, setUserCommentAlert] = useState(true);

  const [slackIntegration, setSlackIntegration] = useState(false);

  const handleSave = () => {
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Preferências salvas",
        description: "Suas configurações de notificação foram atualizadas.",
      });
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Notificações para o Gestor */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Mail className="h-4 w-4 text-primary" />
              Para o Gestor (Você)
            </CardTitle>
            <CardDescription>
              Quando você quer ser avisado sobre atividades no sistema.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="admin-new" className="flex flex-col space-y-1">
                <span>Nova Requisição</span>
                <span className="font-normal text-xs text-muted-foreground">
                  Receber e-mail imediato quando alguém abrir um pedido.
                </span>
              </Label>
              <Switch
                id="admin-new"
                checked={adminNewRequest}
                onCheckedChange={setAdminNewRequest}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="admin-stock" className="flex flex-col space-y-1">
                <span>Alerta de Estoque Baixo</span>
                <span className="font-normal text-xs text-muted-foreground">
                  Avisar se um item solicitado atingir o nível crítico.
                </span>
              </Label>
              <Switch
                id="admin-stock"
                checked={adminLowStock}
                onCheckedChange={setAdminLowStock}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="admin-digest" className="flex flex-col space-y-1">
                <span>Resumo Diário</span>
                <span className="font-normal text-xs text-muted-foreground">
                  Um único e-mail às 18h com o balanço do dia.
                </span>
              </Label>
              <Switch
                id="admin-digest"
                checked={adminDailyDigest}
                onCheckedChange={setAdminDailyDigest}
              />
            </div>
          </CardContent>
        </Card>

        {/* Notificações para o Solicitante */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Bell className="h-4 w-4 text-primary" />
              Para o Solicitante
            </CardTitle>
            <CardDescription>
              Feedback automático enviado ao funcionário que fez o pedido.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="user-status" className="flex flex-col space-y-1">
                <span>Mudança de Status</span>
                <span className="font-normal text-xs text-muted-foreground">
                  Avisar quando o pedido for "Aprovado" ou "Entregue".
                </span>
              </Label>
              <Switch
                id="user-status"
                checked={userStatusChange}
                onCheckedChange={setUserStatusChange}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="user-comment" className="flex flex-col space-y-1">
                <span>Novos Comentários</span>
                <span className="font-normal text-xs text-muted-foreground">
                  Avisar se você adicionar uma observação no card.
                </span>
              </Label>
              <Switch
                id="user-comment"
                checked={userCommentAlert}
                onCheckedChange={setUserCommentAlert}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Integrações Externas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <MessageSquare className="h-4 w-4 text-primary" />
            Integrações
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between space-x-2">
            <div className="flex flex-col space-y-1">
              <Label htmlFor="slack" className="text-base">
                Notificações no Slack / Teams
              </Label>
              <p className="text-sm text-muted-foreground">
                Enviar alertas de "Novos Pedidos Urgentes" para um canal
                específico.
              </p>
            </div>
            <Switch
              id="slack"
              checked={slackIntegration}
              onCheckedChange={setSlackIntegration}
            />
          </div>

          {slackIntegration && (
            <div className="mt-4 p-3 bg-muted rounded-md text-sm border border-dashed flex items-center gap-2 text-muted-foreground">
              <Zap className="h-4 w-4" />
              Configuração de Webhook simulada (ativo).
            </div>
          )}
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
              Salvar Preferências
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
