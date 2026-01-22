"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Search,
  Save,
  Package,
  MoreHorizontal,
  Edit,
  Copy,
  Trash2,
  CheckCircle2,
  XCircle,
  Filter,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Tipo mockado
type SystemProduct = {
  id: string;
  name: string;
  code: string;
  isAllowed: boolean;
};

export function AllowedItems() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  // Dados Mockados
  const [products, setProducts] = useState<SystemProduct[]>([
    { id: "1", name: "Papel A4 (Resma)", code: "MAT-001", isAllowed: true },
    {
      id: "2",
      name: "Caneta Esferográfica Azul",
      code: "MAT-002",
      isAllowed: true,
    },
    { id: "3", name: "Mouse Óptico USB", code: "TEC-055", isAllowed: true },
    { id: "4", name: "Teclado ABNT2", code: "TEC-056", isAllowed: false },
    {
      id: "5",
      name: "Cadeira de Escritório",
      code: "MOV-100",
      isAllowed: false,
    },
    { id: "6", name: "Detergente Neutro", code: "LIM-010", isAllowed: true },
    { id: "7", name: "Café em Pó 500g", code: "ALI-005", isAllowed: true },
    {
      id: "8",
      name: "Biscoito Cream Cracker",
      code: "ALI-008",
      isAllowed: false,
    },
    {
      id: "9",
      name: "Monitor 24 Polegadas",
      code: "TEC-099",
      isAllowed: false,
    },
    { id: "10", name: "Grampeador Médio", code: "MAT-015", isAllowed: true },
  ]);

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.code.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleToggle = (id: string) => {
    setProducts(
      products.map((p) =>
        p.id === id ? { ...p, isAllowed: !p.isAllowed } : p,
      ),
    );
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(filteredProducts.map((p) => p.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (id: string) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((item) => item !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const handleBulkAction = (action: "enable" | "disable") => {
    if (selectedItems.length === 0) return;

    setProducts(
      products.map((p) =>
        selectedItems.includes(p.id)
          ? { ...p, isAllowed: action === "enable" }
          : p,
      ),
    );

    toast({
      title: "Atualização em massa",
      description: `${selectedItems.length} itens foram ${action === "enable" ? "habilitados" : "desabilitados"}.`,
    });

    setSelectedItems([]);
  };

  const handleCopyBarcode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Copiado",
      description: `Código ${code} copiado.`,
    });
  };

  const handleSave = () => {
    setIsLoading(true);
    const allowedCount = products.filter((p) => p.isAllowed).length;

    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Salvo com sucesso",
        description: `Configurações de ${allowedCount} itens atualizadas.`,
      });
    }, 1000);
  };

  const isAllSelected =
    filteredProducts.length > 0 &&
    selectedItems.length === filteredProducts.length;

  const isIndeterminate =
    selectedItems.length > 0 && selectedItems.length < filteredProducts.length;

  return (
    <div className="space-y-4">
      {/* Cabeçalho e Barra de Ferramentas */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h2 className="text-lg font-medium tracking-tight">
            Catálogo de Disponibilidade
          </h2>
          <p className="text-sm text-muted-foreground">
            Gerencie quais itens estão visíveis para solicitação.
          </p>
        </div>

        {/* Ações Globais */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {selectedItems.length > 0 ? (
            <div className="flex items-center gap-2 w-full sm:w-auto animate-in fade-in slide-in-from-right-5">
              <div className="hidden sm:block text-xs text-muted-foreground mr-2 border-r pr-3">
                <span className="font-medium text-foreground">
                  {selectedItems.length}
                </span>{" "}
                selecionados
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleBulkAction("enable")}
                className="flex-1 sm:flex-none text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/30"
              >
                <CheckCircle2 className="mr-2 h-3.5 w-3.5" />
                Ativar
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleBulkAction("disable")}
                className="flex-1 sm:flex-none text-muted-foreground hover:text-destructive hover:bg-red-50 dark:hover:bg-red-950/30"
              >
                <XCircle className="mr-2 h-3.5 w-3.5" />
                Desativar
              </Button>
            </div>
          ) : (
            <Button
              size="sm"
              onClick={handleSave}
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              {isLoading ? (
                "Salvando..."
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Alterações
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Barra de Filtros */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou código..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-background"
          />
        </div>
      </div>

      {/* Tabela Minimalista */}
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-10 px-4">
                <Checkbox
                  checked={isAllSelected}
                  onCheckedChange={handleSelectAll}
                  ref={(ref) => {
                    if (ref)
                      (ref as HTMLInputElement).indeterminate = isIndeterminate;
                  }}
                />
              </TableHead>
              <TableHead>Produto</TableHead>
              <TableHead className="w-[150px] text-center">
                Disponibilidade
              </TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="h-24 text-center text-muted-foreground"
                >
                  Nenhum item encontrado.
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product) => (
                <TableRow
                  key={product.id}
                  data-state={
                    selectedItems.includes(product.id) ? "selected" : undefined
                  }
                  className="group"
                >
                  <TableCell className="px-4 py-3">
                    <Checkbox
                      checked={selectedItems.includes(product.id)}
                      onCheckedChange={() => handleSelectItem(product.id)}
                    />
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-md border bg-muted/40 text-muted-foreground transition-colors group-hover:bg-background group-hover:text-primary">
                        <Package className="h-4 w-4" />
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="font-medium text-sm leading-none">
                          {product.name}
                        </span>
                        <span className="font-mono text-[10px] text-muted-foreground">
                          {product.code}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center py-3">
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex"
                    >
                      <Switch
                        checked={product.isAllowed}
                        onCheckedChange={() => handleToggle(product.id)}
                        className="data-[state=checked]:bg-blue-600"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="py-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Ações</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() =>
                            toast({ description: "Funcionalidade de edição" })
                          }
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleCopyBarcode(product.code)}
                        >
                          <Copy className="mr-2 h-4 w-4" />
                          Copiar Código
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/20">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="text-xs text-muted-foreground text-center">
        Mostrando {filteredProducts.length} de {products.length} itens
        cadastrados
      </div>
    </div>
  );
}
