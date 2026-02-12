// apps/erp-web/components/produtos/product-list.tsx
"use client";
import { useEffect, useMemo, useState } from "react";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
  HeaderContext,
  CellContext,
} from "@tanstack/react-table";

// Componentes UI (Shadcn)
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Ícones
import {
  Pencil,
  Trash2,
  Search,
  Package,
  AlertTriangle,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Plus,
  Upload,
  ChevronLeft,
  ChevronRight,
  Check,
} from "lucide-react";

// Tipos e Mocks
import { Produto } from "@/lib/mock/produtos/index";
import { empresas } from "@/lib/mock/empresas";

interface ProductListProps {
  produtos: Produto[];
  onEdit: (produto: Produto) => void;
  onCreate: () => void;
  onImport?: () => void;
}

// Tipo auxiliar para tipagem correta
type ProductRowData = Produto & {
  displayPreco: number;
  displayEstoqueAtual: number;
  displayEstoqueMinimo: number;
};

export function ProductList({
  produtos,
  onEdit,
  onCreate,
  onImport,
}: ProductListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmpresaId, setSelectedEmpresaId] = useState<string>(
    empresas[0]?.id || "",
  );
  const [sorting, setSorting] = useState<SortingState>([]);

  // Estado para o Popover de "Ver todas"
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [popoverSearch, setPopoverSearch] = useState("");

  const [ativoById, setAtivoById] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setAtivoById(Object.fromEntries(produtos.map((p) => [p.id, p.ativo])));
  }, [produtos]);

  // --- LÓGICA DE DADOS (MANTIDA) ---
  const filteredProducts = useMemo(() => {
    if (!searchTerm) return produtos;
    const term = searchTerm.toLowerCase();
    return produtos.filter(
      (p) =>
        p.nome.toLowerCase().includes(term) ||
        p.codigoBarras.includes(term) ||
        p.codigoInterno.includes(term) ||
        (p.referencia && p.referencia.toLowerCase().includes(term)),
    );
  }, [produtos, searchTerm]);

  const getTableData = useMemo<ProductRowData[]>(() => {
    return filteredProducts.map((p) => {
      const dadosPreco = p.precos.find(
        (x) => x.empresaId === selectedEmpresaId,
      );
      const dadosEstoque = p.estoque.find(
        (x) => x.empresaId === selectedEmpresaId,
      );

      return {
        ...p,
        displayPreco: dadosPreco?.tabelas?.[0]?.valor || 0,
        displayEstoqueAtual: dadosEstoque?.atual ?? 0,
        displayEstoqueMinimo: dadosEstoque?.minimo ?? 0,
      };
    });
  }, [filteredProducts, selectedEmpresaId]);

  // --- LÓGICA DO COMPANY SWITCHER ---
  const currentEmpresa = empresas.find((e) => e.id === selectedEmpresaId);
  const currentEmpresaIndex = empresas.findIndex(
    (e) => e.id === selectedEmpresaId,
  );

  const filteredEmpresas = popoverSearch
    ? empresas.filter((e) =>
        e.nomeFantasia.toLowerCase().includes(popoverSearch.toLowerCase()),
      )
    : empresas;

  const handleNextEmpresa = () => {
    if (empresas.length === 0) return;
    const nextIndex = (currentEmpresaIndex + 1) % empresas.length;
    setSelectedEmpresaId(empresas[nextIndex].id);
  };

  const handlePrevEmpresa = () => {
    if (empresas.length === 0) return;
    const prevIndex =
      (currentEmpresaIndex - 1 + empresas.length) % empresas.length;
    setSelectedEmpresaId(empresas[prevIndex].id);
  };

  const handleSelectEmpresa = (id: string) => {
    setSelectedEmpresaId(id);
    setIsPopoverOpen(false);
    setPopoverSearch("");
  };

  // --- DEFINIÇÃO DAS COLUNAS ---
  const columns = useMemo<ColumnDef<ProductRowData>[]>(
    () => [
      {
        accessorKey: "codigoInterno",
        header: ({ column }: HeaderContext<ProductRowData, unknown>) => (
          <div className="flex items-center justify-between w-full pr-2">
            <span>Código</span>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 hover:bg-muted"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              {column.getIsSorted() === "asc" ? (
                <ArrowUp className="h-3 w-3 text-primary" />
              ) : column.getIsSorted() === "desc" ? (
                <ArrowDown className="h-3 w-3 text-primary" />
              ) : (
                <ArrowUpDown className="h-3 w-3 opacity-20" />
              )}
            </Button>
          </div>
        ),
        cell: ({ row }: CellContext<ProductRowData, unknown>) => (
          <span className="text-xs text-foreground">
            {row.getValue("codigoInterno")}
          </span>
        ),
        size: 100,
      },
      {
        accessorKey: "codigoBarras",
        header: "Cód. Barras",
        cell: ({ row }: CellContext<ProductRowData, unknown>) => (
          <span className="text-xs text-muted-foreground">
            {row.getValue("codigoBarras")}
          </span>
        ),
        size: 130,
      },
      {
        accessorKey: "nome",
        header: ({ column }: HeaderContext<ProductRowData, unknown>) => (
          <div className="flex items-center justify-between w-full pr-2">
            <span>Descrição</span>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 hover:bg-muted"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              {column.getIsSorted() === "asc" ? (
                <ArrowUp className="h-3 w-3 text-primary" />
              ) : column.getIsSorted() === "desc" ? (
                <ArrowDown className="h-3 w-3 text-primary" />
              ) : (
                <ArrowUpDown className="h-3 w-3 opacity-20" />
              )}
            </Button>
          </div>
        ),
        cell: ({ row }: CellContext<ProductRowData, unknown>) => (
          <div className="flex flex-col justify-center">
            <span className="text-xs font-medium text-foreground truncate block max-w-[300px]">
              {row.getValue("nome")}
            </span>
          </div>
        ),
        size: 300,
      },
      {
        accessorKey: "displayPreco",
        header: ({ column }: HeaderContext<ProductRowData, unknown>) => (
          <div className="flex items-center justify-between w-full pr-2">
            <span>Preço (R$)</span>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 hover:bg-muted"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              {column.getIsSorted() === "asc" ? (
                <ArrowUp className="h-3 w-3 text-primary" />
              ) : column.getIsSorted() === "desc" ? (
                <ArrowDown className="h-3 w-3 text-primary" />
              ) : (
                <ArrowUpDown className="h-3 w-3 opacity-20" />
              )}
            </Button>
          </div>
        ),
        cell: ({ row }: CellContext<ProductRowData, unknown>) => {
          const val = row.getValue("displayPreco") as number;
          return (
            <div className="text-xs font-semibold text-right">
              {val ? `R$ ${val.toFixed(2)}` : "0,00"}
            </div>
          );
        },
        size: 100,
      },
      {
        accessorKey: "displayEstoqueAtual",
        header: "Estoque",
        cell: ({ row }: CellContext<ProductRowData, unknown>) => {
          const atual = row.getValue("displayEstoqueAtual") as number;
          const minimo = row.original.displayEstoqueMinimo;
          const unidade = row.original.unidade;
          const isLow = minimo > 0 && atual <= minimo;

          return (
            <div className="flex items-center justify-end gap-1.5">
              {isLow && (
                <AlertTriangle className="h-3 w-3 text-red-500 shrink-0" />
              )}
              <span
                className={`text-xs font-semibold ${isLow ? "text-red-600" : "text-foreground"}`}
              >
                {atual} {unidade}
              </span>
            </div>
          );
        },
        size: 100,
      },
      {
        id: "acoes",
        header: "Ações",
        cell: ({ row }: CellContext<ProductRowData, unknown>) => {
          const isAtivo = !!ativoById[row.original.id];

          return (
            <div className="flex items-center justify-end gap-2">
              <div className="flex items-center gap-0.5">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 bg-transparent hover:bg-transparent! focus:bg-transparent! active:bg-transparent! focus-visible:ring-0! focus-visible:ring-offset-0! text-muted-foreground hover:text-primary transition-colors"
                  onClick={() => onEdit(row.original)}
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 bg-transparent hover:bg-transparent! focus:bg-transparent! active:bg-transparent! focus-visible:ring-0! focus-visible:ring-offset-0! text-muted-foreground hover:text-destructive transition-colors"
                  onClick={() => {}}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
              <div className="h-5 w-px bg-border mx-1" />

              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center">
                    <Switch
                      checked={isAtivo}
                      onCheckedChange={(checked) => {
                        setAtivoById((prev) => ({
                          ...prev,
                          [row.original.id]: checked,
                        }));
                      }}
                      className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-muted-foreground/30"
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top">
                  {isAtivo ? "Desativar produto" : "Ativar produto"}
                </TooltipContent>
              </Tooltip>
            </div>
          );
        },
        size: 130,
      },
    ],
    [onEdit, ativoById],
  );

  const table = useReactTable({
    data: getTableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: { sorting },
    onSortingChange: setSorting,
  });

  return (
    <TooltipProvider delayDuration={150}>
      <div className="space-y-6">
        {/* 1. TOOLBAR UNIFICADA (DUAS LINHAS) */}
        <div className="flex flex-col gap-3">
          {/* LINHA 1: COMPANY SWITCHER CUSTOMIZADO */}
          <div className="flex items-center gap-2 p-2 border rounded-md bg-muted/30 w-[340px] shrink-0">
            {" "}
            {/* Botão Anterior */}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0 text-muted-foreground hover:text-foreground"
              onClick={handlePrevEmpresa}
              disabled={empresas.length <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {/* Chip da Empresa Atual */}
            <div className="flex-1 min-w-0 flex items-center justify-center">
              <div className="flex items-center gap-2 px-3 py-1.5 ">
                <span className="text-sm font-semibold truncate block">
                  {currentEmpresa?.nomeFantasia || "Selecione..."}
                </span>
              </div>
            </div>
            {/* Botão Próximo */}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0 text-muted-foreground hover:text-foreground"
              onClick={handleNextEmpresa}
              disabled={empresas.length <= 1}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            {/* Separador Vertical */}
            <div className="h-6 w-px bg-border mx-1 hidden sm:block" />
            {/* Botão Ver Todas com Popover */}
            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 px-3 text-xs shrink-0"
                >
                  Ver todas
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0" align="end">
                <div className="p-2 border-b">
                  <Input
                    placeholder="Buscar empresa..."
                    value={popoverSearch}
                    onChange={(e) => setPopoverSearch(e.target.value)}
                    className="h-9"
                  />
                </div>
                <div className="max-h-[280px] overflow-auto p-1">
                  {filteredEmpresas.length === 0 ? (
                    <div className="text-center text-sm text-muted-foreground py-4">
                      Nenhuma empresa encontrada.
                    </div>
                  ) : (
                    filteredEmpresas.map((empresa) => (
                      <div
                        key={empresa.id}
                        className={`flex items-center gap-2 px-2 py-2 rounded-md cursor-pointer hover:bg-muted transition-colors ${empresa.id === selectedEmpresaId ? "bg-muted/70" : ""}`}
                        onClick={() => handleSelectEmpresa(empresa.id)}
                      >
                        <span className="flex-1 text-sm truncate font-medium">
                          {empresa.nomeFantasia}
                        </span>
                        {empresa.id === selectedEmpresaId && (
                          <Check className="h-4 w-4 text-primary shrink-0" />
                        )}
                      </div>
                    ))
                  )}
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* LINHA 2: BUSCA + AÇÕES */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Busca */}
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, EAN, referência..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-10 bg-background w-full"
              />
            </div>

            {/* Ações */}
            <div className="flex items-center gap-2 shrink-0 justify-end">
              <Button variant="outline" onClick={() => onImport?.()}>
                <Upload className="mr-2 h-4 w-4" />
                Importar XML
              </Button>

              <Button onClick={onCreate}>
                <Plus className="mr-2 h-4 w-4" />
                Novo Produto
              </Button>
            </div>
          </div>
        </div>

        {/* 2. LISTAGEM EM TABELA */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-muted/10 rounded-sm border border-dashed">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">
              {searchTerm
                ? "Nenhum produto encontrado para sua busca."
                : "Nenhum produto cadastrado ainda."}
            </p>
          </div>
        ) : (
          <div className="border rounded-md bg-background max-h-[400px] overflow-auto shadow-sm">
            <Table className="border-separate border-spacing-0">
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow
                    key={headerGroup.id}
                    className="bg-muted hover:bg-muted"
                  >
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        className="sticky top-0 z-30 bg-muted border-b shadow-sm text-[11px] font-bold text-muted-foreground uppercase h-9 px-3 border-r last:border-r-0 whitespace-nowrap"
                        style={{ width: header.getSize() }}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>

              <TableBody>
                {table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} className="border-b last:border-0 h-9">
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="p-1 px-3 text-xs border-r last:border-r-0 align-middle"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}
