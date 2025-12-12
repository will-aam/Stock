"use client";

import { useState, useMemo } from "react";
import {
  Package,
  Filter,
  RefreshCw,
  Search,
  X,
  Settings,
  HelpCircle,
  Trash2, // Importando o ícone de lixeira
} from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StatsCards } from "@/components/ordi/stats-cards";
import { KanbanBoard } from "@/components/ordi/kanban-board";
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
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);

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
        const setor = setores.find((s) => s.id === r.setorId);
        const nomeSetor = setor?.nome.toLowerCase() || "";

        const materiaisMatch =
          r.itens?.some((m: { nome: string }) =>
            m.nome.toLowerCase().includes(lowerCaseQuery)
          ) || false;

        const descricaoMatch =
          r.observacoesGerais?.toLowerCase().includes(lowerCaseQuery) || false;

        return (
          materiaisMatch || nomeSetor.includes(lowerCaseQuery) || descricaoMatch
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
    setores,
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
            <Link href="/lixeira">
              <Button
                variant="outline"
                size="sm"
                className="hidden sm:flex bg-transparent"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Lixeira
              </Button>
            </Link>
            <Link href="/ordi/configuracoes">
              <Button
                variant="outline"
                size="sm"
                className="hidden sm:flex bg-transparent"
              >
                <Settings className="h-4 w-4 mr-1" />
                Configurações
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowHelpModal(true)}
              aria-label="Ajuda sobre a página"
            >
              <HelpCircle className="h-4 w-4" />
            </Button>
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
        </div>

        {/* Barra de busca e filtros minimalista */}
        <div className="flex items-center gap-2 mb-6">
          {/* Campo de busca geral */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por material, setor ou observações..."
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

          {/* Botão de filtro dropdown com bolinha indicadora */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant={hasActiveFilters ? "default" : "outline"}
                size="sm"
                className="relative"
              >
                <Filter className="h-4 w-4" />
                {hasActiveFilters && (
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full"></span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-96">
              <DropdownMenuLabel>Filtrar Requisições</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="p-4 space-y-3">
                <Select
                  value={empresaFilter}
                  onValueChange={handleEmpresaChange}
                >
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
              <DropdownMenuSeparator />
              <div className="p-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={limparFiltros}
                  className="w-full justify-start"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Limpar todos os filtros
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Stats Cards */}
        <StatsCards requisicoes={requisicoesFiltradas} />

        {/* Visualização - Apenas Kanban */}
        <div className="mt-6">
          <KanbanBoard requisicoes={requisicoesFiltradas} />
        </div>
      </main>

      {/* Modal de Ajuda */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card rounded-lg shadow-lg max-w-md w-full p-6 relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4"
              onClick={() => setShowHelpModal(false)}
              aria-label="Fechar modal de ajuda"
            >
              <X className="h-4 w-4" />
            </Button>

            <h2 className="text-lg font-semibold mb-3">Sobre esta página</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Esta página é dedicada à gestão de requisições de materiais de
              escritório. É um sistema simples para adicionar e acompanhar
              pedidos de itens como canetas, papéis e outros suprimentos.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
