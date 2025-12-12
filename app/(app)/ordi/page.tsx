"use client";

import { useState, useMemo } from "react";
import { Package, Filter, Download, RefreshCw, Search, X } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatsCards } from "@/components/admin/stats-cards";
import { KanbanBoard } from "@/components/admin/kanban-board";
import { useRequisicoesStore } from "@/lib/requisicoes-store";
import {
  empresas,
  setores,
  funcionarios,
  getSetoresByEmpresa,
  getFuncionariosBySetor,
} from "@/lib/mock-data";

type PeriodoFilter = "todos" | "hoje" | "semana" | "mes";

export default function AdminRequisicoesPage() {
  const { requisicoes } = useRequisicoesStore();
  const [empresaFilter, setEmpresaFilter] = useState<string>("todas");
  const [setorFilter, setSetorFilter] = useState<string>("todos");
  const [funcionarioFilter, setFuncionarioFilter] = useState<string>("todos");
  const [periodoFilter, setPeriodoFilter] = useState<PeriodoFilter>("todos");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showFilters, setShowFilters] = useState<boolean>(false);

  // Setores filtrados por empresa
  const setoresFiltrados = useMemo(() => {
    if (empresaFilter === "todas") return setores;
    return getSetoresByEmpresa(empresaFilter);
  }, [empresaFilter]);

  // Funcionários filtrados por setor
  const funcionariosFiltrados = useMemo(() => {
    if (setorFilter === "todos") {
      if (empresaFilter === "todas") return funcionarios;
      return funcionarios.filter((f) => f.empresaId === empresaFilter);
    }
    return getFuncionariosBySetor(setorFilter);
  }, [empresaFilter, setorFilter]);

  // Requisições filtradas
  const requisicoesFiltradas = useMemo(() => {
    let filtered = [...requisicoes];

    // Filtros de select
    if (empresaFilter !== "todas") {
      filtered = filtered.filter((r) => r.empresaId === empresaFilter);
    }

    if (setorFilter !== "todos") {
      filtered = filtered.filter((r) => r.setorId === setorFilter);
    }

    if (funcionarioFilter !== "todos") {
      filtered = filtered.filter((r) => r.funcionarioId === funcionarioFilter);
    }

    if (periodoFilter !== "todos") {
      const now = new Date();
      const startOfDay = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
      );

      filtered = filtered.filter((r) => {
        const dataReq = new Date(r.dataCriacao);

        switch (periodoFilter) {
          case "hoje":
            return dataReq >= startOfDay;
          case "semana":
            const startOfWeek = new Date(startOfDay);
            startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
            return dataReq >= startOfWeek;
          case "mes":
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            return dataReq >= startOfMonth;
          default:
            return true;
        }
      });
    }

    // Filtro de busca geral
    if (searchQuery.trim() !== "") {
      const lowerCaseQuery = searchQuery.toLowerCase();
      filtered = filtered.filter((r) => {
        const funcionario = funcionarios.find((f) => f.id === r.funcionarioId);
        const nomeFuncionario = funcionario?.nome.toLowerCase() || "";

        // CORREÇÃO: Troquei 'materiais' por 'itens'
        const materiaisMatch =
          r.itens?.some((m: { nome: string }) =>
            m.nome.toLowerCase().includes(lowerCaseQuery)
          ) || false;

        // CORREÇÃO: Troquei 'descricao' por 'observacoesGerais'
        const descricaoMatch =
          r.observacoesGerais?.toLowerCase().includes(lowerCaseQuery) || false;

        return (
          materiaisMatch ||
          nomeFuncionario.includes(lowerCaseQuery) ||
          descricaoMatch
        );
      });
    }

    return filtered;
  }, [
    requisicoes,
    empresaFilter,
    setorFilter,
    funcionarioFilter,
    periodoFilter,
    searchQuery,
    funcionarios,
  ]);

  // Reset setor quando empresa muda
  const handleEmpresaChange = (value: string) => {
    setEmpresaFilter(value);
    setSetorFilter("todos");
    setFuncionarioFilter("todos");
  };

  // Reset funcionário quando setor muda
  const handleSetorChange = (value: string) => {
    setSetorFilter(value);
    setFuncionarioFilter("todos");
  };

  const limparFiltros = () => {
    setEmpresaFilter("todas");
    setSetorFilter("todos");
    setFuncionarioFilter("todos");
    setPeriodoFilter("todos");
    setSearchQuery("");
  };

  // Função para baixar relatório PDF
  const baixarRelatorioPDF = () => {
    const link = document.createElement("a");
    link.href = "/relatorio-requisicoes.pdf";
    link.download = "relatorio-requisicoes.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Verifica se há algum filtro ativo
  const hasActiveFilters =
    empresaFilter !== "todas" ||
    setorFilter !== "todos" ||
    funcionarioFilter !== "todos" ||
    periodoFilter !== "todos" ||
    searchQuery !== "";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Package className="h-6 w-6 text-primary" />
            <span className="font-bold text-foreground">Stock</span>
            <span className="text-muted-foreground text-sm hidden sm:inline">
              — Painel de Requisições
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/solicitar">
              <Button
                variant="outline"
                size="sm"
                className="hidden sm:flex bg-transparent"
              >
                Portal do Funcionário
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Título e controles de visualização */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Requisições de Materiais
            </h1>
            <p className="text-muted-foreground text-sm">
              Gerencie e acompanhe todas as requisições
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={baixarRelatorioPDF}>
              <Download className="h-4 w-4 mr-1" />
              Baixar Relatório PDF
            </Button>
          </div>
        </div>

        {/* Barra de busca e filtros minimalista */}
        <div className="flex items-center gap-2 mb-6">
          {/* Campo de busca geral */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              // MELHORIA: Placeholder mais preciso
              placeholder="Buscar por material, funcionário ou observações..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchQuery("")}
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>

          {/* Botão de filtro */}
          <Button
            variant={showFilters ? "default" : "outline"}
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="relative"
          >
            <Filter className="h-4 w-4" />
            {hasActiveFilters && (
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full"></span>
            )}
          </Button>

          {/* Botão limpar filtros */}
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={limparFiltros}>
              <RefreshCw className="h-4 w-4 mr-1" />
              Limpar
            </Button>
          )}
        </div>

        {/* Painel de filtros expansível */}
        {showFilters && (
          <div className="bg-card border border-border rounded-xl p-4 mb-6 animate-in slide-in-from-top-2 duration-200">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Select value={empresaFilter} onValueChange={handleEmpresaChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Empresa" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas as empresas</SelectItem>
                  {empresas.map((emp) => (
                    <SelectItem key={emp.id} value={emp.id}>
                      {emp.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={setorFilter} onValueChange={handleSetorChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Setor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os setores</SelectItem>
                  {setoresFiltrados.map((setor) => (
                    <SelectItem key={setor.id} value={setor.id}>
                      {setor.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={funcionarioFilter}
                onValueChange={setFuncionarioFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Funcionário" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os funcionários</SelectItem>
                  {funcionariosFiltrados.map((func) => (
                    <SelectItem key={func.id} value={func.id}>
                      {func.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={periodoFilter}
                onValueChange={(v) => setPeriodoFilter(v as PeriodoFilter)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todo período</SelectItem>
                  <SelectItem value="hoje">Hoje</SelectItem>
                  <SelectItem value="semana">Esta semana</SelectItem>
                  <SelectItem value="mes">Este mês</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <StatsCards requisicoes={requisicoesFiltradas} />

        {/* Visualização - Apenas Kanban */}
        <div className="mt-6">
          <KanbanBoard requisicoes={requisicoesFiltradas} />
        </div>
      </main>
    </div>
  );
}
