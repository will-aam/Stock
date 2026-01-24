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
  MapPin,
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
      {/* 1. SELETOR DE CONTEXTO */}
      <div className="bg-muted/30 p-4 rounded-lg border border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-sm font-medium flex items-center gap-2">
            <Store className="h-4 w-4 text-primary" />
            Contexto Operacional
          </h3>
          <p className="text-xs text-muted-foreground">
            Visualizando preços e estoques da unidade selecionada.
          </p>
        </div>
        <div className="w-full sm:w-[300px]">
          <Select
            value={selectedEmpresaId}
            onValueChange={setSelectedEmpresaId}
          >
            <SelectTrigger className="bg-background h-9">
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
      </div>

      {/* 2. BARRA DE AÇÕES */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, EAN, referência..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-10"
          />
        </div>
        <Button onClick={onCreate} className="w-full sm:w-auto h-10">
          <Package className="w-4 h-4 mr-2" /> Novo Produto
        </Button>
      </div>

      {/* 3. LISTAGEM */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16 bg-muted/10 rounded-lg border border-dashed">
          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <p className="text-muted-foreground">
            {searchTerm
              ? "Nenhum produto encontrado para sua busca."
              : "Nenhum produto cadastrado ainda."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
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
                className="p-4 hover:border-primary/40 transition-all duration-200 group"
              >
                <div className="flex flex-col sm:flex-row gap-5">
                  {/* Imagem */}
                  <div className="shrink-0 relative">
                    {mainImage ? (
                      <img
                        src={mainImage}
                        alt={product.nome}
                        className="h-24 w-24 object-cover rounded-md border bg-white"
                      />
                    ) : (
                      <div className="h-24 w-24 bg-muted rounded-md flex items-center justify-center border">
                        <Package className="h-8 w-8 text-muted-foreground/30" />
                      </div>
                    )}
                    {!product.ativo && (
                      <Badge
                        variant="destructive"
                        className="absolute -top-2 -left-2 text-[10px] px-1.5 h-5"
                      >
                        Inativo
                      </Badge>
                    )}
                  </div>

                  {/* Informações Principais */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                    <div>
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-bold text-base truncate pr-2 text-foreground/90">
                          {product.nome}
                        </h3>
                        {/* Preço no Topo (Mobile) */}
                        <div className="sm:hidden font-bold text-green-700">
                          {precoVenda ? `R$ ${precoVenda.toFixed(2)}` : "R$ --"}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground mb-2">
                        <span className="flex items-center gap-1 bg-muted/50 px-1.5 rounded">
                          <Barcode className="h-3 w-3" /> {product.codigoBarras}
                        </span>
                        <span className="flex items-center gap-1">
                          Ref: {product.referencia || "-"}
                        </span>
                        <span className="flex items-center gap-1">
                          SKU: {product.codigoInterno}
                        </span>
                      </div>

                      {product.descricaoAuxiliar && (
                        <p className="text-xs text-muted-foreground/80 truncate mb-2">
                          {product.descricaoAuxiliar}
                        </p>
                      )}

                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          variant="outline"
                          className="text-[10px] h-5 font-normal"
                        >
                          {product.unidade}
                        </Badge>
                        {grupoTributario && (
                          <Badge
                            variant="secondary"
                            className="text-[10px] h-5 font-normal bg-blue-50 text-blue-700 hover:bg-blue-100"
                          >
                            <Layers className="h-3 w-3 mr-1" />
                            {/* CORREÇÃO: Usando .descricao em vez de .nome */}
                            {grupoTributario.descricao.split("-")[0].trim()}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Coluna Dinâmica */}
                  <div className="sm:w-48 shrink-0 flex flex-row sm:flex-col justify-between sm:justify-center items-center sm:items-end gap-2 border-t sm:border-t-0 sm:border-l pt-3 sm:pt-0 sm:pl-5 mt-2 sm:mt-0 bg-muted/5 sm:bg-transparent rounded sm:rounded-none px-3 sm:px-0">
                    <div className="hidden sm:flex items-center text-[10px] text-muted-foreground mb-1">
                      <MapPin className="h-3 w-3 mr-1" />
                      {currentStore?.nomeFantasia}
                    </div>

                    <div className="text-left sm:text-right">
                      <div className="text-[10px] uppercase text-muted-foreground font-semibold">
                        Preço Venda
                      </div>
                      <div className="font-bold text-lg text-green-700 leading-none">
                        {precoVenda ? (
                          `R$ ${precoVenda.toFixed(2)}`
                        ) : (
                          <span className="text-muted-foreground text-sm">
                            Não definido
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-[10px] uppercase text-muted-foreground font-semibold">
                        Estoque Atual
                      </div>
                      <div
                        className={`font-bold text-sm flex items-center justify-end gap-1 ${estoque && estoque.atual <= estoque.minimo ? "text-red-600" : "text-foreground"}`}
                      >
                        {estoque && estoque.atual <= estoque.minimo && (
                          <AlertTriangle className="h-3 w-3" />
                        )}
                        {estoque ? estoque.atual : "-"} {product.unidade}
                      </div>
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="flex sm:flex-col gap-2 justify-end sm:justify-center items-center sm:border-l sm:pl-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-primary"
                      onClick={() => onEdit(product)}
                      title="Editar Produto"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => {}}
                      title="Excluir"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
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
