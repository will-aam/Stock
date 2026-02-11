"use client";

import { useState } from "react";
import {
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Search,
  Siren,
  Filter,
  MoreHorizontal,
  ArrowUpDown,
  Archive,
  Megaphone,
} from "lucide-react";
import { DashboardHeader } from "@/components/home/dashboard-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";

// Import mock
import { lotesValidade, LoteValidade } from "@/lib/mock/validade";

export default function GestaoValidadePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("painel");

  // Cálculos rápidos para os Cards
  const vencidos = lotesValidade.filter((l) => l.status === "vencido");
  const criticos = lotesValidade.filter((l) => l.status === "critico"); // < 7 dias
  const atencao = lotesValidade.filter((l) => l.status === "atencao"); // < 30 dias

  // Cálculo de Prejuízo Potencial (Vencidos + Críticos)
  const valorEmRisco = [...vencidos, ...criticos].reduce((acc, item) => {
    return acc + item.quantidade * item.custoUnitario;
  }, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "vencido":
        return "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-900";
      case "critico":
        return "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-900";
      case "atencao":
        return "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-900";
      default:
        return "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-900";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "vencido":
        return "VENCIDO";
      case "critico":
        return "CRÍTICO (7 dias)";
      case "atencao":
        return "ATENÇÃO (30 dias)";
      default:
        return "OK";
    }
  };

  return (
    <div className="min-h-screen pb-20 md:pb-0 bg-background">
      <div className="md:hidden">
        <DashboardHeader />
      </div>

      <main className="container mx-auto max-w-7xl space-y-6 p-4 md:py-8">
        {/* Cabeçalho */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <Calendar className="h-6 w-6 text-primary" />
              Controle de Validade (FEFO)
            </h2>
            <p className="text-sm text-muted-foreground">
              Monitore lotes vencidos e próximos do vencimento para evitar
              perdas.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Archive className="mr-2 h-4 w-4" />
              Histórico de Baixas
            </Button>
            <Button>
              <Search className="mr-2 h-4 w-4" />
              Nova Auditoria
            </Button>
          </div>
        </div>

        <Separator />

        {/* KPIs de Risco */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-l-4 border-l-red-500 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Vencidos (Perda)
              </CardTitle>
              <Siren className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {vencidos.length}{" "}
                <span className="text-sm font-normal text-muted-foreground">
                  lotes
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Requer baixa imediata
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Vencem em 7 dias
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {criticos.length}{" "}
                <span className="text-sm font-normal text-muted-foreground">
                  lotes
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Ação promocional sugerida
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Valor em Risco
              </CardTitle>
              <span className="text-muted-foreground font-mono">R$</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {valorEmRisco.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Custo de itens vencidos + críticos
              </p>
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/20 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-primary">
                Saúde do Estoque
              </CardTitle>
              <CheckCircle2 className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">92%</div>
              <Progress value={92} className="h-2 mt-2" />
            </CardContent>
          </Card>
        </div>

        {/* Área Principal */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar produto, lote ou localização..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 sm:flex-none"
              >
                <Filter className="mr-2 h-4 w-4" />
                Filtros
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 sm:flex-none"
              >
                <ArrowUpDown className="mr-2 h-4 w-4" />
                Ordenar
              </Button>
            </div>
          </div>

          <Tabs defaultValue="todos" className="w-full">
            <TabsList>
              <TabsTrigger value="todos">
                Todos ({lotesValidade.length})
              </TabsTrigger>
              <TabsTrigger value="criticos" className="text-orange-600">
                Críticos ({criticos.length})
              </TabsTrigger>
              <TabsTrigger value="vencidos" className="text-red-600">
                Vencidos ({vencidos.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="todos" className="mt-4">
              <div className="rounded-md border bg-card">
                <div className="relative w-full overflow-auto">
                  <table className="w-full caption-bottom text-sm">
                    <thead className="[&_tr]:border-b">
                      <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                          Produto
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                          Lote
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                          Validade
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                          Status
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                          Local
                        </th>
                        <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                          Qtd.
                        </th>
                        <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                          Valor Total
                        </th>
                        <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody className="[&_tr:last-child]:border-0">
                      {lotesValidade.map((item) => (
                        <tr
                          key={item.id}
                          className="border-b transition-colors hover:bg-muted/50"
                        >
                          <td className="p-4 align-middle font-medium">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center overflow-hidden border">
                                <img
                                  src={item.imagem}
                                  alt=""
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div className="flex flex-col">
                                <span>{item.produto}</span>
                                <span className="text-xs text-muted-foreground hidden sm:inline">
                                  SKU: {item.id.padStart(4, "0")}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 align-middle text-muted-foreground font-mono text-xs">
                            {item.lote}
                          </td>
                          <td className="p-4 align-middle">
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {new Date(item.validade).toLocaleDateString(
                                  "pt-BR",
                                )}
                              </span>
                              <span
                                className={`text-[10px] ${item.diasParaVencer < 0 ? "text-red-500 font-bold" : "text-muted-foreground"}`}
                              >
                                {item.diasParaVencer < 0
                                  ? `Venceu há ${Math.abs(item.diasParaVencer)} dias`
                                  : `Vence em ${item.diasParaVencer} dias`}
                              </span>
                            </div>
                          </td>
                          <td className="p-4 align-middle">
                            <Badge
                              variant="outline"
                              className={getStatusColor(item.status)}
                            >
                              {getStatusLabel(item.status)}
                            </Badge>
                          </td>
                          <td className="p-4 align-middle text-muted-foreground text-xs">
                            {item.localizacao}
                          </td>
                          <td className="p-4 align-middle text-right font-medium">
                            {item.quantidade}{" "}
                            <span className="text-xs text-muted-foreground">
                              {item.unidade}
                            </span>
                          </td>
                          <td className="p-4 align-middle text-right text-muted-foreground">
                            {(
                              item.quantidade * item.custoUnitario
                            ).toLocaleString("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            })}
                          </td>
                          <td className="p-4 align-middle text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <span className="sr-only">Abrir menu</span>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                {item.status === "vencido" ? (
                                  <DropdownMenuItem className="text-red-600">
                                    <Archive className="mr-2 h-4 w-4" />
                                    Baixar (Perda)
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem className="text-blue-600">
                                    <Megaphone className="mr-2 h-4 w-4" />
                                    Criar Promoção
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                  Ver Detalhes
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  Transferir Local
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>

            {/* Outras Tabs (Criticos / Vencidos) seriam filtros dessa mesma tabela */}
            <TabsContent value="criticos" className="mt-4">
              <div className="p-8 text-center text-muted-foreground border rounded-md bg-muted/10">
                Implementar filtro visual aqui...
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
