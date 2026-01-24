"use client";

import { DashboardHeader } from "@/components/home/dashboard-header";
import { TaxGroupsManager } from "@/components/fiscal/tax-groups-manager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Layers, Globe, FileType, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Mocks simples para visualização das tabelas estáticas
const origens = [
  { cod: "0", desc: "Nacional" },
  { cod: "1", desc: "Estrangeira - Importação direta" },
  { cod: "2", desc: "Estrangeira - Adquirida no mercado interno" },
  { cod: "3", desc: "Nacional - Conteúdo de Importação > 40%" },
  { cod: "5", desc: "Nacional - Conteúdo de Importação <= 40%" },
];

const tiposItem = [
  { cod: "00", desc: "Mercadoria para Revenda" },
  { cod: "01", desc: "Matéria-Prima" },
  { cod: "02", desc: "Embalagem" },
  { cod: "03", desc: "Produto em Processo" },
  { cod: "04", desc: "Produto Acabado" },
  { cod: "09", desc: "Serviços" },
  { cod: "99", desc: "Outros" },
];

export default function FiscalPage() {
  return (
    <div className="min-h-screen pb-20 md:pb-0 bg-background">
      <div className="md:hidden">
        <DashboardHeader />
      </div>

      <main className="container mx-auto max-w-6xl space-y-6 p-4 md:py-8">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">
            Gestão Fiscal & Tributária
          </h2>
          <p className="text-sm text-muted-foreground">
            Configure as regras de impostos (ICMS, PIS, COFINS) e tabelas
            padronizadas do SPED.
          </p>
        </div>

        <Separator />

        <Tabs defaultValue="grupos" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 md:w-[800px]">
            <TabsTrigger value="grupos" className="flex gap-2">
              <Layers className="h-4 w-4" /> Grupos Tributários
            </TabsTrigger>
            <TabsTrigger value="origem" className="flex gap-2">
              <Globe className="h-4 w-4" /> Origens
            </TabsTrigger>
            <TabsTrigger value="tipos" className="flex gap-2">
              <FileType className="h-4 w-4" /> Tipos de Item
            </TabsTrigger>
            {/* <TabsTrigger value="ncm" className="flex gap-2">
              <FileText className="h-4 w-4" /> NCMs
            </TabsTrigger> */}
          </TabsList>

          {/* GRUPOS TRIBUTÁRIOS (O Principal) */}
          <TabsContent value="grupos" className="space-y-4">
            <div className="bg-blue-50/50 dark:bg-blue-900/10 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
              <h3 className="font-semibold flex items-center gap-2 text-blue-800 dark:text-blue-300">
                <Layers className="h-4 w-4" /> Inteligência Fiscal
              </h3>
              <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
                Crie perfis que agrupam regras de impostos. Ao vincular um
                produto a um grupo, ele herda automaticamente CSTs, Alíquotas e
                CFOPs, evitando erros no cadastro.
              </p>
            </div>
            <TaxGroupsManager />
          </TabsContent>

          {/* ORIGENS (Tabela Informativa) */}
          <TabsContent value="origem" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Tabela A - Origem da Mercadoria (CST ICMS)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="p-3 text-left font-medium w-16">Cód</th>
                        <th className="p-3 text-left font-medium">Descrição</th>
                      </tr>
                    </thead>
                    <tbody>
                      {origens.map((o) => (
                        <tr key={o.cod} className="border-b last:border-0">
                          <td className="p-3 font-mono">{o.cod}</td>
                          <td className="p-3">{o.desc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TIPOS DE ITEM (Tabela Informativa) */}
          <TabsContent value="tipos" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Tabela SPED - Tipos de Item
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="p-3 text-left font-medium w-16">Cód</th>
                        <th className="p-3 text-left font-medium">
                          Classificação
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {tiposItem.map((t) => (
                        <tr key={t.cod} className="border-b last:border-0">
                          <td className="p-3 font-mono">{t.cod}</td>
                          <td className="p-3">{t.desc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
