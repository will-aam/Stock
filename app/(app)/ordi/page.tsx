"use client";

import { useState, useMemo } from "react";
import { Package, Filter, LayoutGrid, List, RefreshCw } from "lucide-react";
import Link from "next/link";
// import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatsCards } from "@/components/admin/stats-cards";
import { KanbanBoard } from "@/components/admin/kanban-board";
import { RequisicoesList } from "@/components/admin/requisicoes-list";
import { useRequisicoesStore } from "@/lib/requisicoes-store";
import {
  empresas,
  setores,
  funcionarios,
  getSetoresByEmpresa,
  getFuncionariosBySetor,
} from "@/lib/mock-data";

type ViewMode = "kanban" | "list";
type PeriodoFilter = "todos" | "hoje" | "semana" | "mes";

export default function AdminRequisicoesPage() {
  const { requisicoes } = useRequisicoesStore();
  const [viewMode, setViewMode] = useState<ViewMode>("kanban");
  const [empresaFilter, setEmpresaFilter] = useState<string>("todas");
  const [setorFilter, setSetorFilter] = useState<string>("todos");
  const [funcionarioFilter, setFuncionarioFilter] = useState<string>("todos");
  const [periodoFilter, setPeriodoFilter] = useState<PeriodoFilter>("todos");

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

    return filtered;
  }, [
    requisicoes,
    empresaFilter,
    setorFilter,
    funcionarioFilter,
    periodoFilter,
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
  };

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
            <Button
              variant={viewMode === "kanban" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("kanban")}
            >
              <LayoutGrid className="h-4 w-4 mr-1" />
              Kanban
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4 mr-1" />
              Lista
            </Button>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-card border border-border rounded-xl p-4 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-card-foreground">
              Filtros
            </span>
          </div>
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
          {(empresaFilter !== "todas" ||
            setorFilter !== "todos" ||
            funcionarioFilter !== "todos" ||
            periodoFilter !== "todos") && (
            <div className="mt-3 pt-3 border-t border-border">
              <Button variant="ghost" size="sm" onClick={limparFiltros}>
                <RefreshCw className="h-3 w-3 mr-1" />
                Limpar filtros
              </Button>
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <StatsCards requisicoes={requisicoesFiltradas} />

        {/* Visualização */}
        <div className="mt-6">
          {viewMode === "kanban" ? (
            <KanbanBoard requisicoes={requisicoesFiltradas} />
          ) : (
            <RequisicoesList requisicoes={requisicoesFiltradas} />
          )}
        </div>
      </main>
    </div>
  );
}
