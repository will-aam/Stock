"use client";

import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ProdutoFiscal } from "@/types/produto-fiscal";
import { Pencil, Trash2, Search, Package, Calculator } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export function ProductList() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  // Dados mockados para visualização estática (simulando DB)
  const [products, setProducts] = useState<ProdutoFiscal[]>([
    {
      id: "1",
      nome: "Refrigerante Coca-Cola 2L",
      codigoBarras: "7894900011517",
      unidadeMedidaComercial: "UN",
      fatorConversao: 1,
      tipoItem: "mercadoria_revenda",
      ncm: "22021000",
      origemMercadoria: "0",
      icmsCstEntrada: "060",
      icmsCstSaida: "060",
      icmsAliquota: 18,
      icmsST: true,
      icmsGeraCredito: false,
      pisCstEntrada: "73",
      pisCstSaida: "01",
      pisAliquota: 1.65,
      cofinsCstEntrada: "73",
      cofinsCstSaida: "01",
      cofinsAliquota: 7.6,
      pisCofinsGeraCredito: false,
      ipiAliquota: 0,
      ipiGeraCredito: false,
      grupo: "Bebidas",
      criadoEm: new Date().toISOString(),
    } as unknown as ProdutoFiscal,
    {
      id: "2",
      nome: "Arroz Branco Tipo 1 - 5kg",
      codigoBarras: "7896036095904",
      unidadeMedidaComercial: "PCT",
      fatorConversao: 5,
      tipoItem: "mercadoria_revenda",
      ncm: "10063021",
      origemMercadoria: "0",
      icmsCstEntrada: "000",
      icmsCstSaida: "000",
      icmsAliquota: 12,
      icmsST: false,
      icmsGeraCredito: true,
      pisCstEntrada: "50",
      pisCstSaida: "01",
      pisAliquota: 1.65,
      cofinsCstEntrada: "50",
      cofinsCstSaida: "01",
      cofinsAliquota: 7.6,
      pisCofinsGeraCredito: true,
      ipiAliquota: 0,
      ipiGeraCredito: false,
      grupo: "Alimentos",
      criadoEm: new Date().toISOString(),
    } as unknown as ProdutoFiscal,
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

  const handleEdit = (product: ProdutoFiscal) => {
    toast({
      title: "Editar",
      description: `Abrindo edição para: ${product.nome}`,
    });
  };

  return (
    <div className="space-y-6">
      <Card className="p-4">
        {/* Barra de Busca */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, código de barras ou NCM..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 mobile-optimized"
          />
        </div>

        <p className="text-sm text-muted-foreground mb-4">
          {filteredProducts.length}{" "}
          {filteredProducts.length === 1 ? "produto" : "produtos"} encontrado(s)
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
            {filteredProducts.map((product) => (
              <Card
                key={product.id}
                className="p-4 hover:border-primary/50 transition-colors"
              >
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Imagem (Placeholder se não houver) */}
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
                    <h3 className="font-semibold text-base truncate">
                      {product.nome}
                    </h3>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1 text-sm text-muted-foreground">
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
                      {product.grupo && (
                        <div>
                          <span className="font-medium text-foreground">
                            Grupo:
                          </span>{" "}
                          {product.grupo}
                        </div>
                      )}
                      <div>
                        <span className="font-medium text-foreground">
                          Tipo:
                        </span>{" "}
                        {tipoItemLabels[product.tipoItem] || product.tipoItem}
                      </div>
                      <div>
                        <span className="font-medium text-foreground">
                          ICMS:
                        </span>{" "}
                        {product.icmsAliquota}%
                      </div>
                    </div>

                    {/* Badges Fiscais */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      {product.icmsGeraCredito && (
                        <Badge
                          variant="outline"
                          className="text-green-600 border-green-200 bg-green-50 dark:bg-green-900/20"
                        >
                          Cred. ICMS
                        </Badge>
                      )}
                      {product.pisCofinsGeraCredito && (
                        <Badge
                          variant="outline"
                          className="text-blue-600 border-blue-200 bg-blue-50 dark:bg-blue-900/20"
                        >
                          Cred. PIS/COF
                        </Badge>
                      )}
                      {product.icmsST && (
                        <Badge
                          variant="outline"
                          className="text-orange-600 border-orange-200 bg-orange-50 dark:bg-orange-900/20"
                        >
                          ICMS ST
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="flex sm:flex-col gap-2 justify-end sm:justify-start">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(product)}
                      className="h-8 px-2"
                    >
                      <Pencil className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2"
                      onClick={() =>
                        router.push(`/produtos/${product.id}/custo`)
                      } // Atualize esta linha
                    >
                      <Calculator className="h-4 w-4 mr-2" />
                      Custo
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(product.id)}
                      className="h-8 px-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Excluir
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
