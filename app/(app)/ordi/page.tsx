// app/(app)/ordi/page.tsx
"use client";

import { useState, useMemo } from "react";
import {
  Package,
  Filter,
  RefreshCw,
  Search,
  X,
  Settings,
  Trash2,
  Copy,
  Send,
  Check,
  Link as LinkIcon,
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { StatsCards } from "@/components/ordi/stats-cards";
import { KanbanBoard } from "@/components/ordi/kanban-board";
import { useRequisicoesStore } from "@/lib/requisicoes-store";
import { TrashSheet } from "@/components/ordi/trash/trash-sheet";
import {
  empresas,
  setores,
  funcionarios,
  getSetoresByEmpresa,
  getFuncionariosBySetor,
} from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";

type PeriodoFilter = "todos" | "hoje" | "semana" | "mes";

export default function AdminRequisicoesPage() {
  const { requisicoes } = useRequisicoesStore();
  const { toast } = useToast();

  const [empresaFilter, setEmpresaFilter] = useState<string>("todas");
  const [setorFilter, setSetorFilter] = useState<string>("todos");
  const [funcionarioFilter, setFuncionarioFilter] = useState<string>("todos");
  const [periodoFilter, setPeriodoFilter] = useState<PeriodoFilter>("todos");
  const [searchQuery, setSearchQuery] = useState<string>("");
  // const [showHelpModal, setShowHelpModal] = useState<boolean>(false); // Removido conforme solicitado
  const [isTrashOpen, setIsTrashOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Link de Exemplo (Estático)
  const SHARE_LINK = "http://localhost:3000/solicitar";

  // --- Funções de Compartilhamento ---
  const handleCopyLink = () => {
    navigator.clipboard.writeText(SHARE_LINK);
    setIsCopied(true);
    toast({
      title: "Link copiado!",
      description: "O link de solicitação está na sua área de transferência.",
    });

    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSendEmail = () => {
    toast({
      title: "E-mails enviados",
      description:
        "O link de acesso foi disparado para todos os funcionários ativos.",
    });
  };

  // --- Lógica de Filtros (Mantida) ---
  const setoresFiltrados = useMemo(() => {
    if (empresaFilter === "todas") return setores;
    return getSetoresByEmpresa(empresaFilter);
  }, [empresaFilter]);

  const funcionariosFiltrados = useMemo(() => {
    if (setorFilter === "todos") {
      if (empresaFilter === "todas") return funcionarios;
      return funcionarios.filter((f) => f.empresaId === empresaFilter);
    }
    return getFuncionariosBySetor(setorFilter);
  }, [empresaFilter, setorFilter]);

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
        now.getDate(),
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

    if (searchQuery.trim() !== "") {
      const lowerCaseQuery = searchQuery.toLowerCase();
      filtered = filtered.filter((r) => {
        const setor = setores.find((s) => s.id === r.setorId);
        const nomeSetor = setor?.nome.toLowerCase() || "";
        const materiaisMatch =
          r.itens?.some((m: { nome: string }) =>
            m.nome.toLowerCase().includes(lowerCaseQuery),
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

  const handleEmpresaChange = (value: string) => {
    setEmpresaFilter(value);
    setSetorFilter("todos");
    setFuncionarioFilter("todos");
  };

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

  const hasActiveFilters =
    empresaFilter !== "todas" ||
    setorFilter !== "todos" ||
    funcionarioFilter !== "todos" ||
    periodoFilter !== "todos" ||
    searchQuery !== "";

  return (
    <div className="h-full flex flex-col bg-background overflow-hidden">
      {/* Header */}
      <header className="border-b border-border bg-card shrink-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Package className="h-6 w-6 text-primary" />
            <span className="font-bold text-foreground">Stock</span>
            <span className="text-muted-foreground text-sm hidden sm:inline">
              — Painel de Requisições
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <TooltipProvider>
              <div className="flex items-center border rounded-md bg-muted/40 p-0.5 mr-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="link"
                      size="icon"
                      className="h-8 w-8 hover:bg-background"
                      onClick={handleCopyLink}
                    >
                      {isCopied ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>Copiar link de acesso</p>
                  </TooltipContent>
                </Tooltip>
              </div>

              {/* LIXEIRA (Apenas Ícone) */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => setIsTrashOpen(true)}
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Lixeira</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* CONFIGURAÇÕES */}
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

            {/* Ajuda removida conforme solicitado */}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 flex-1 flex flex-col min-h-0">
        {/* Container para Título, Busca e Stats (partes que NÃO devem rolar) */}
        <div className="shrink-0 flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Requisições de Materiais
              </h1>
              <p className="text-muted-foreground text-sm">
                Gerencie e acompanhe todas as requisições
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
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
                      <SelectItem value="todos">
                        Todos os funcionários
                      </SelectItem>
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

          <StatsCards requisicoes={requisicoesFiltradas} />
        </div>

        <div className="flex-1 mt-6 min-h-0 pb-2">
          <KanbanBoard requisicoes={requisicoesFiltradas} />
        </div>
      </main>

      <TrashSheet open={isTrashOpen} onOpenChange={setIsTrashOpen} />
    </div>
  );
}
