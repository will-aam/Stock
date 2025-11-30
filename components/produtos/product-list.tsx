"use client";

import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Pencil,
  Trash2,
  Search,
  Package,
  Calculator,
  Store,
  MapPin,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock de Lojas (simulando o banco de dados)
const mockStores = [
  { id: "1", name: "Matriz - Centro", regime: "Lucro Real" },
  { id: "2", name: "Filial - Zona Sul", regime: "Simples Nacional" },
];

export function ProductList() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStore, setSelectedStore] = useState<string>("1"); // Default para Matriz
  const router = useRouter();

  // Dados mockados com informações específicas por loja (StoreData)
  const [products, setProducts] = useState<any[]>([
    {
      id: "1",
      nome: "Refrigerante Coca-Cola 2L",
      codigoBarras: "7894900011517",
      unidadeMedidaComercial: "UN",
      tipoItem: "mercadoria_revenda",
      ncm: "22021000",
      icmsAliquota: 18, // Padrão Global
      grupo: "Bebidas",
      imagemUrl:
        "https://fortatacadista.vteximg.com.br/arquivos/ids/299392-800-800/2301822_7894900027013_BEB-REFRIG.COCA-COLA-2L-PET..jpg?v=637764859239570000",
      // Simulação de dados que variam por filial
      storeData: {
        "1": { price: 8.5, stock: 120 }, // Matriz
        "2": { price: 9.0, stock: 45 }, // Filial
      },
    },
    {
      id: "2",
      nome: "Arroz Branco Tipo 1 - 5kg",
      codigoBarras: "7896036095904",
      unidadeMedidaComercial: "PCT",
      tipoItem: "mercadoria_revenda",
      ncm: "10063021",
      icmsAliquota: 12, // Padrão Global
      grupo: "Alimentos",
      imagemUrl:
        "https://prezunic.vtexassets.com/arquivos/ids/180742/65678a821ef3739680761582.jpg?v=638368812869870000",
      storeData: {
        "1": { price: 24.9, stock: 300 },
        "2": { price: 25.5, stock: 80 },
      },
    },
  ]);

  const filteredProducts = useMemo(() => {
    if (!searchTerm) return products;
    const term = searchTerm.toLowerCase();
    return products.filter(
      (p) =>
        p.nome.toLowerCase().includes(term) ||
        p.codigoBarras.includes(term) ||
        p.ncm.includes(term)
    );
  }, [products, searchTerm]);

  const tipoItemLabels: Record<string, string> = {
    mercadoria_revenda: "Revenda",
    materia_prima: "Insumo",
    uso_consumo: "Uso e Consumo",
    ativo: "Ativo",
    brinde: "Brinde",
  };

  const handleDelete = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    toast({
      title: "Produto removido",
      description: "Item excluído da lista visual.",
    });
  };

  const handleEdit = (product: any) => {
    // Ao editar, editamos o produto GLOBAL
    router.push(`/produtos/cadastro?id=${product.id}`);
  };

  const handleCost = (product: any) => {
    // Ao ver custo, passamos o contexto da LOJA selecionada na URL
    router.push(`/produtos/${product.id}/custo?storeId=${selectedStore}`);
  };

  const currentStore = mockStores.find((s) => s.id === selectedStore);

  return (
    <div className="space-y-6">
      {/* Seletor de Contexto (Loja Ativa) */}
      <Card className="p-4 bg-muted/30 border-l-4 border-l-primary">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
              <Store className="h-4 w-4" />
              Contexto Operacional
            </h3>
            <p className="text-xs text-muted-foreground">
              Selecione a loja para visualizar preços, estoques e custos
              específicos da unidade.
            </p>
          </div>
          <div className="w-full sm:w-[300px]">
            <Select value={selectedStore} onValueChange={setSelectedStore}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Selecione a Loja" />
              </SelectTrigger>
              <SelectContent>
                {mockStores.map((store) => (
                  <SelectItem key={store.id} value={store.id}>
                    {store.name}{" "}
                    <span className="text-muted-foreground text-xs">
                      ({store.regime})
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        {/* Barra de Busca */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar no catálogo global (Nome, EAN, NCM)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 mobile-optimized"
          />
        </div>

        <p className="text-sm text-muted-foreground mb-4">
          {filteredProducts.length}{" "}
          {filteredProducts.length === 1 ? "produto" : "produtos"} no catálogo
          global
        </p>

        {/* Lista de Cards */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">
              {searchTerm
                ? "Nenhum produto encontrado"
                : "Nenhum produto cadastrado ainda"}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredProducts.map((product) => {
              // Extrai dados específicos da loja selecionada (mock)
              const storeInfo = product.storeData?.[selectedStore];

              return (
                <Card
                  key={product.id}
                  className="p-4 hover:border-primary/50 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Imagem */}
                    <div className="shrink-0">
                      {product.imagemUrl ? (
                        <img
                          src={product.imagemUrl}
                          alt={product.nome}
                          className="h-16 w-16 object-cover rounded-md border"
                        />
                      ) : (
                        <div className="h-16 w-16 bg-muted rounded-md flex items-center justify-center border">
                          <Package className="h-8 w-8 text-muted-foreground/50" />
                        </div>
                      )}
                    </div>

                    {/* Informações */}
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-base truncate pr-2">
                          {product.nome}
                        </h3>
                        {/* Indicador visual de qual loja estamos vendo */}
                        {storeInfo && (
                          <Badge
                            variant="secondary"
                            className="hidden sm:flex shrink-0 bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-100"
                          >
                            <MapPin className="h-3 w-3 mr-1" />
                            {currentStore?.name}
                          </Badge>
                        )}
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-1 text-sm text-muted-foreground">
                        <div>
                          <span className="font-medium text-foreground">
                            EAN:
                          </span>{" "}
                          {product.codigoBarras}
                        </div>
                        <div>
                          <span className="font-medium text-foreground">
                            NCM:
                          </span>{" "}
                          {product.ncm}
                        </div>
                        <div>
                          <span className="font-medium text-foreground">
                            Tipo:
                          </span>{" "}
                          {tipoItemLabels[product.tipoItem] || product.tipoItem}
                        </div>

                        {/* COLUNA DINÂMICA: Muda conforme o Select do Topo */}
                        <div className="col-span-2 md:col-span-1 mt-2 md:mt-0 p-2 bg-muted/20 rounded border border-dashed border-muted-foreground/20">
                          {storeInfo ? (
                            <div className="flex flex-col">
                              <span className="text-[10px] uppercase font-bold text-muted-foreground">
                                Preço Local
                              </span>
                              <span className="font-bold text-green-600">
                                R$ {storeInfo.price.toFixed(2)}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                Estoque: {storeInfo.stock}
                              </span>
                            </div>
                          ) : (
                            <span className="text-xs italic text-muted-foreground">
                              Sem dados para esta loja
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Ações */}
                    <div className="flex sm:flex-col gap-2 justify-end sm:justify-start pt-2 sm:pt-0 border-t sm:border-t-0 mt-2 sm:mt-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(product)}
                        className="h-8 px-2 justify-start"
                      >
                        <Pencil className="h-4 w-4 mr-2" />
                        <span className="sm:hidden">Editar Global</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 justify-start text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        onClick={() => handleCost(product)}
                      >
                        <Calculator className="h-4 w-4 mr-2" />
                        <span className="sm:hidden">Custos & Preço</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(product.id)}
                        className="h-8 px-2 justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        <span className="sm:hidden">Excluir</span>
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
