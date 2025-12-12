"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Save, Package, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Tipo mockado para o exemplo
type SystemProduct = {
  id: string;
  name: string;
  category: string;
  code: string;
  isAllowed: boolean; // O campo que controla se aparece no Ordi
};

export function AllowedItems() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Dados Mockados (Simulando o banco de dados do sistema principal)
  const [products, setProducts] = useState<SystemProduct[]>([
    {
      id: "1",
      name: "Papel A4 (Resma)",
      category: "Escritório",
      code: "MAT-001",
      isAllowed: true,
    },
    {
      id: "2",
      name: "Caneta Esferográfica Azul",
      category: "Escritório",
      code: "MAT-002",
      isAllowed: true,
    },
    {
      id: "3",
      name: "Mouse Óptico USB",
      category: "TI",
      code: "TEC-055",
      isAllowed: true,
    },
    {
      id: "4",
      name: "Teclado ABNT2",
      category: "TI",
      code: "TEC-056",
      isAllowed: false,
    },
    {
      id: "5",
      name: "Cadeira de Escritório",
      category: "Mobiliário",
      code: "MOV-100",
      isAllowed: false,
    },
    {
      id: "6",
      name: "Detergente Neutro",
      category: "Limpeza",
      code: "LIM-010",
      isAllowed: true,
    },
    {
      id: "7",
      name: "Café em Pó 500g",
      category: "Copa",
      code: "ALI-005",
      isAllowed: true,
    },
    {
      id: "8",
      name: "Biscoito Cream Cracker",
      category: "Copa",
      code: "ALI-008",
      isAllowed: false,
    },
    {
      id: "9",
      name: "Monitor 24 Polegadas",
      category: "TI",
      code: "TEC-099",
      isAllowed: false,
    },
    {
      id: "10",
      name: "Grampeador Médio",
      category: "Escritório",
      code: "MAT-015",
      isAllowed: true,
    },
  ]);

  // Filtragem local
  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggle = (id: string) => {
    setProducts(
      products.map((p) => (p.id === id ? { ...p, isAllowed: !p.isAllowed } : p))
    );
  };

  const handleSave = () => {
    setIsLoading(true);
    const allowedCount = products.filter((p) => p.isAllowed).length;

    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Catálogo atualizado",
        description: `${allowedCount} itens estão visíveis para solicitação.`,
      });
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-lg font-medium">Catálogo de Disponibilidade</h2>
          <p className="text-sm text-muted-foreground">
            Selecione quais itens do estoque geral podem ser solicitados pelos
            funcionários.
          </p>
        </div>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, código ou categoria..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-background"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            title="Filtros avançados (Demo)"
          >
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden border-muted">
        <div className="bg-muted/40 p-3 border-b flex justify-between items-center text-xs font-medium text-muted-foreground px-6">
          <span className="w-1/2">PRODUTO</span>
          <span className="hidden sm:block w-1/4 text-center">CATEGORIA</span>
          <span className="w-auto">DISPONÍVEL</span>
        </div>

        <ScrollArea className="h-[400px]">
          <CardContent className="p-0">
            {filteredProducts.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                Nenhum item encontrado.
              </div>
            ) : (
              <div className="divide-y">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-4 hover:bg-muted/20 transition-colors"
                  >
                    <div className="flex items-center gap-3 w-1/2 overflow-hidden">
                      <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                        <Package className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">
                          {product.name}
                        </p>
                        <p className="text-xs text-muted-foreground font-mono">
                          {product.code}
                        </p>
                      </div>
                    </div>

                    <div className="hidden sm:flex w-1/4 justify-center">
                      <Badge
                        variant="outline"
                        className="font-normal text-muted-foreground"
                      >
                        {product.category}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2">
                      <Switch
                        checked={product.isAllowed}
                        onCheckedChange={() => handleToggle(product.id)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </ScrollArea>
      </Card>

      <div className="flex items-center justify-between p-4 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900 rounded-lg">
        <div className="text-sm">
          <span className="font-semibold text-blue-700 dark:text-blue-400">
            {products.filter((p) => p.isAllowed).length}
          </span>
          <span className="text-muted-foreground"> itens habilitados de </span>
          <span className="text-muted-foreground">{products.length} total</span>
        </div>
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? (
            "Salvando..."
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Salvar Alterações
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
