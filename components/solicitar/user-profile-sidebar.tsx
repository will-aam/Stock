"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { LogOut, Package, Clock, Bell, User, History } from "lucide-react";

// MOCK DATA - Histórico de Requisições
const mockHistory = [
  {
    id: "REQ-091",
    date: "22/01/2026",
    status: "pending",
    items: 3,
    total: "Variados",
  },
  {
    id: "REQ-088",
    date: "15/01/2026",
    status: "approved",
    items: 12,
    total: "Material Escritório",
  },
  {
    id: "REQ-054",
    date: "10/12/2025",
    status: "rejected",
    items: 1,
    total: "Cadeira Gamer",
    reason: "Item não permitido",
  },
];

// MOCK DATA - Notificações
const mockNotifications = [
  {
    id: 1,
    title: "Requisição Aprovada",
    desc: "Seu pedido #REQ-088 foi aprovado.",
    time: "Há 2 dias",
    read: true,
  },
  {
    id: 2,
    title: "Estoque Baixo",
    desc: "O item 'Papel A4' está acabando.",
    time: "Há 1 semana",
    read: false,
  },
];

export function UserProfileSidebar() {
  const [isOpen, setIsOpen] = useState(false);

  // Função auxiliar para cor do status
  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800";
      case "rejected":
        return "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800";
      default:
        return "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "approved":
        return "Aprovado";
      case "rejected":
        return "Recusado";
      default:
        return "Pendente";
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full h-9 w-9 border bg-muted/50 hover:bg-muted ml-2"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder-user.jpg" />
            <AvatarFallback className="text-xs bg-primary/10 text-primary font-bold">
              WC
            </AvatarFallback>
          </Avatar>
        </Button>
      </SheetTrigger>

      {/* Sidebar: Removemos padding padrão (p-0) para controle total */}
      <SheetContent
        className="w-full sm:max-w-md p-0 flex flex-col bg-background"
        side="right"
      >
        {/* Cabeçalho do Perfil */}
        <div className="p-6 border-b bg-muted/10 shrink-0">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-4 border-background shadow-sm">
              <AvatarImage src="/placeholder-user.jpg" />
              <AvatarFallback className="text-xl bg-primary/10 text-primary font-bold">
                WC
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-lg font-bold leading-tight">Will Costa</h2>
              <p className="text-sm text-muted-foreground">
                Desenvolvedor FullStack
              </p>
              <div className="flex items-center gap-2 mt-1.5">
                <Badge
                  variant="outline"
                  className="text-[10px] h-5 bg-background font-normal text-muted-foreground"
                >
                  TI / Desenvolvimento
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Abas de Navegação */}
        <Tabs
          defaultValue="history"
          className="flex-1 flex flex-col overflow-hidden"
        >
          <div className="px-6 pt-4 shrink-0">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="history" className="text-xs">
                <History className="h-3.5 w-3.5 mr-2" />
                Pedidos
              </TabsTrigger>
              <TabsTrigger value="notifications" className="text-xs">
                <Bell className="h-3.5 w-3.5 mr-2" />
                Avisos
              </TabsTrigger>
              <TabsTrigger value="profile" className="text-xs">
                <User className="h-3.5 w-3.5 mr-2" />
                Perfil
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 overflow-y-auto min-h-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {/* 1. HISTÓRICO */}
            <TabsContent value="history" className="p-6 space-y-4 mt-0">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-xs text-muted-foreground uppercase tracking-wider">
                  Suas Solicitações
                </h3>
              </div>

              {mockHistory.map((req) => (
                <div
                  key={req.id}
                  className="group border rounded-lg p-4 hover:bg-muted/30 transition-colors bg-card"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-md bg-primary/10 text-primary">
                        <Package className="h-3.5 w-3.5" />
                      </div>
                      <span className="font-semibold text-sm">{req.id}</span>
                    </div>
                    <Badge
                      variant="outline"
                      className={`text-[10px] border-0 px-2 ${getStatusColor(req.status)}`}
                    >
                      {getStatusLabel(req.status)}
                    </Badge>
                  </div>

                  <div className="pl-[2.1rem]">
                    <p className="text-sm font-medium mb-1">{req.total}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <Clock className="h-3 w-3" /> {req.date}
                      <span className="text-muted-foreground/30">•</span>
                      {req.items} itens
                    </p>

                    {req.reason && (
                      <div className="mt-3 p-2.5 bg-red-50 dark:bg-red-950/10 border border-red-100 dark:border-red-900/30 rounded text-xs text-red-600 dark:text-red-400">
                        <span className="font-semibold">Motivo:</span>{" "}
                        {req.reason}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </TabsContent>

            {/* 2. NOTIFICAÇÕES */}
            <TabsContent value="notifications" className="p-6 space-y-1 mt-0">
              <h3 className="font-semibold text-xs text-muted-foreground uppercase tracking-wider mb-4">
                Central de Avisos
              </h3>
              {mockNotifications.map((notif) => (
                <div
                  key={notif.id}
                  className="flex gap-4 py-4 border-b last:border-0 hover:bg-muted/20 -mx-6 px-6 transition-colors"
                >
                  <div
                    className={`mt-1.5 h-2 w-2 rounded-full shrink-0 ${notif.read ? "bg-muted-foreground/30" : "bg-blue-500 ring-2 ring-blue-100 dark:ring-blue-900"}`}
                  />
                  <div className="space-y-1">
                    <p
                      className={`text-sm leading-none ${notif.read ? "font-medium" : "font-bold"}`}
                    >
                      {notif.title}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {notif.desc}
                    </p>
                    <p className="text-[10px] text-muted-foreground pt-1.5">
                      {notif.time}
                    </p>
                  </div>
                </div>
              ))}
            </TabsContent>

            {/* 3. PERFIL */}
            <TabsContent value="profile" className="p-6 space-y-6 mt-0">
              <div className="space-y-6">
                <div className="space-y-3">
                  <h3 className="font-semibold text-xs text-muted-foreground uppercase tracking-wider">
                    Dados Pessoais
                  </h3>
                  <div className="bg-card border rounded-lg divide-y">
                    <div className="flex justify-between p-3 text-sm">
                      <span className="text-muted-foreground">Email</span>
                      <span className="font-medium">will@empresa.com</span>
                    </div>
                    <div className="flex justify-between p-3 text-sm">
                      <span className="text-muted-foreground">Telefone</span>
                      <span className="font-medium">(79) 99999-9999</span>
                    </div>
                    <div className="flex justify-between p-3 text-sm">
                      <span className="text-muted-foreground">Matrícula</span>
                      <span className="font-medium">#4092</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-xs text-muted-foreground uppercase tracking-wider">
                    Empresa
                  </h3>
                  <div className="bg-card border rounded-lg divide-y">
                    <div className="flex justify-between p-3 text-sm">
                      <span className="text-muted-foreground">Unidade</span>
                      <span className="font-medium">Matriz Aracaju</span>
                    </div>
                    <div className="flex justify-between p-3 text-sm">
                      <span className="text-muted-foreground">
                        Centro de Custo
                      </span>
                      <span className="font-medium">TI - 001</span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>

        {/* Footer com Logout */}
        <div className="p-4 border-t bg-muted/10 shrink-0">
          <Button
            variant="outline"
            className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 h-10 border-red-100 dark:border-red-900/30"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sair do Sistema
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
