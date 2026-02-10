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
  Store,
  Barcode,
  Layers,
  AlertTriangle,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Produto } from "@/lib/mock/produtos/index";
import { empresas } from "@/lib/mock/empresas";
import { getGrupoTributarioById } from "@/lib/mock/produtos/grupos-tributarios";

interface ProductListProps {
  produtos: Produto[];
  onEdit: (produto: Produto) => void;
  onCreate: () => void;
}

export function ProductList({ produtos, onEdit, onCreate }: ProductListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmpresaId, setSelectedEmpresaId] = useState<string>(
    empresas[0]?.id || "",
  );

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

  // Helper para buscar dados da loja selecionada e o preço principal
  const getDadosLoja = (produto: Produto) => {
    const dadosPreco = produto.precos.find(
      (p) => p.empresaId === selectedEmpresaId,
    );
    const dadosEstoque = produto.estoque.find(
      (e) => e.empresaId === selectedEmpresaId,
    );

    // CORREÇÃO: Pegamos o valor da primeira tabela de preço (Geralmente "Varejo")
    const precoVenda = dadosPreco?.tabelas?.[0]?.valor;

    return { precoVenda, estoque: dadosEstoque };
  };

  const currentStore = empresas.find((s) => s.id === selectedEmpresaId);

  return (
    <div className="space-y-6">
      {/* 1. SELETOR DE CONTEXTO COM BARRA DE PESQUISA INTEGRADA */}
      <div className="bg-muted/30 p-4 rounded-sm border  flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-sm font-medium flex items-center gap-2">
            <Store className="h-4 w-4 text-primary" />
            Contexto Operacional
          </h3>
          <p className="text-xs text-muted-foreground">
            Visualizando preços e estoques da unidade selecionada.
          </p>
        </div>

        <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-3 items-stretch">
          {/* Select loja */}
          <div className="w-full sm:w-[280px]">
            <Select
              value={selectedEmpresaId}
              onValueChange={setSelectedEmpresaId}
            >
              <SelectTrigger className="bg-background h-10">
                <SelectValue placeholder="Selecione a Loja" />
              </SelectTrigger>
              <SelectContent>
                {empresas.map((emp) => (
                  <SelectItem key={emp.id} value={emp.id}>
                    {emp.nomeFantasia}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-[360px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, EAN, referência..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-10 bg-background dark:bg-background"
            />
          </div>
        </div>
      </div>

      {/* 2. LISTAGEM */}
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
        <div className="grid grid-cols-1 gap-2">
          {filteredProducts.map((product) => {
            const { precoVenda, estoque } = getDadosLoja(product);
            const grupoTributario = product.grupoTributarioId
              ? getGrupoTributarioById(product.grupoTributarioId)
              : null;

            const mainImage =
              product.imagens && product.imagens.length > 0
                ? product.imagens[0]
                : null;

            return (
              <Card
                key={product.id}
                className="p-0 py-0 gap-0 overflow-hidden hover:border-primary/40 transition-all duration-200 group sm:h-20"
              >
                <div className="flex flex-col sm:flex-row h-full">
                  <div className="relative shrink-0 w-full sm:w-20 h-20 sm:h-full">
                    {mainImage ? (
                      <div className="h-full w-full flex items-center justify-center">
                        <img
                          src={mainImage}
                          alt={product.nome}
                          className="
     max-w-full 
      object-cover
    "
                        />
                      </div>
                    ) : (
                      <div className="h-full w-full bg-muted flex items-center justify-center border-r">
                        <Package className="h-6 w-6 text-muted-foreground/40" />
                      </div>
                    )}

                    {!product.ativo && (
                      <Badge
                        variant="destructive"
                        className="absolute top-1 left-1 text-[9px] px-1 h-4"
                      >
                        Inativo
                      </Badge>
                    )}
                  </div>

                  {/* CONTEÚDO */}
                  <div className="flex-1 px-4 py-2 flex items-center">
                    <div className="flex flex-col sm:flex-row gap-4 w-full">
                      {/* Informações Principais */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h3 className="font-semibold text-sm truncate pr-2 text-foreground/90">
                            {product.nome}
                          </h3>
                        </div>

                        <div className="flex gap-x-4 gap-y-1 text-xs text-muted-foreground mt-1">
                          <span className="flex items-center gap-1">
                            <Barcode className="h-3 w-3" />{" "}
                            {product.codigoBarras}
                          </span>

                          <span className="flex items-center gap-1">
                            SKU: {product.codigoInterno}
                          </span>
                        </div>
                      </div>

                      {/* PREÇO E ESTOQUE MINIMALISTA */}
                      <div className="flex items-center gap-4 sm:gap-6 text-xs">
                        {/* Preço */}
                        <div className="flex flex-col items-center sm:items-end">
                          <span className="text-muted-foreground font-medium uppercase tracking-wide">
                            Preço
                          </span>
                          <span className="font-semibold text-sm text-foreground">
                            {precoVenda ? `R$ ${precoVenda.toFixed(2)}` : "--"}
                          </span>
                        </div>

                        {/* Estoque */}
                        <div className="flex flex-col items-center sm:items-end">
                          <span className="text-muted-foreground font-medium uppercase tracking-wide">
                            Estoque
                          </span>
                          <span
                            className={`font-semibold text-sm flex items-center gap-1 ${
                              estoque && estoque.atual <= estoque.minimo
                                ? "text-red-600"
                                : "text-foreground"
                            }`}
                          >
                            {estoque && estoque.atual <= estoque.minimo && (
                              <AlertTriangle className="h-3 w-3" />
                            )}
                            {estoque
                              ? `${estoque.atual} ${product.unidade}`
                              : "--"}
                          </span>
                        </div>
                      </div>

                      {/* Ações */}
                      <div className="flex gap-1 items-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-primary"
                          onClick={() => onEdit(product)}
                          title="Editar Produto"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-destructive"
                          onClick={() => {}}
                          title="Excluir"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
