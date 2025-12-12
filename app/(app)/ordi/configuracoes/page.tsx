"use client";

import { DashboardHeader } from "@/components/home/dashboard-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AutomationRules } from "@/components/ordi/config/automation-rules";
import { AllowedItems } from "@/components/ordi/config/allowed-items";
import { NotificationsSettings } from "@/components/ordi/config/notifications";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function OrdiConfigPage() {
  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <div className="md:hidden">
        <DashboardHeader />
      </div>

      <main className="container mx-auto max-w-5xl space-y-8 p-4">
        {/* Cabeçalho com botão de voltar */}
        <div className="flex flex-col gap-2">
          <Link href="/ordi">
            <Button
              variant="ghost"
              className="pl-0 hover:bg-transparent hover:text-primary w-fit"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para o Quadro
            </Button>
          </Link>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Configurações do Sistema Ordi
            </h2>
            <p className="text-muted-foreground">
              Gerencie regras de automação, catálogo de itens e notificações.
            </p>
          </div>
        </div>

        {/* Abas de Configuração */}
        <Tabs defaultValue="regras" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="regras">Regras</TabsTrigger>
            <TabsTrigger value="catalogo">Catálogo</TabsTrigger>
            <TabsTrigger value="notificacoes">Notificações</TabsTrigger>
          </TabsList>

          <TabsContent
            value="regras"
            className="space-y-4 animate-in fade-in-50"
          >
            <AutomationRules />
          </TabsContent>

          <TabsContent
            value="catalogo"
            className="space-y-4 animate-in fade-in-50"
          >
            <AllowedItems />
          </TabsContent>

          <TabsContent
            value="notificacoes"
            className="space-y-4 animate-in fade-in-50"
          >
            <NotificationsSettings />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
