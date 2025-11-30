"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DashboardHeader } from "@/components/home/dashboard-header";
import {
  ProdutoFiscal,
  HistoricoCompra,
  PrecificacaoProduto,
} from "@/types/produto-fiscal";
import {
  ArrowLeft,
  Calculator,
  Save,
  TrendingUp,
  AlertCircle,
  History,
  Building2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

type SectionType = "historico" | "custoMedio" | "precificacao";

// Mock de Lojas para identificar o contexto
const mockStores: Record<string, string> = {
  "1": "Matriz - Centro",
  "2": "Filial - Zona Sul",
};

export default function CustoPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();

  // Contexto da Página
  const productId = params?.id as string;
  const storeId = searchParams.get("storeId") || "1"; // Default para Matriz
  const storeName = mockStores[storeId] || "Loja Desconhecida";

  // Estados
  const [activeSection, setActiveSection] = useState<SectionType>("historico");
  const [product, setProduct] = useState<ProdutoFiscal | null>(null);
  const [historico, setHistorico] = useState<HistoricoCompra[]>([]);
  const [precificacao, setPrecificacao] = useState<PrecificacaoProduto | null>(
    null
  );

  // Estado do formulário de Precificação
  const [baseCusto, setBaseCusto] = useState<
    "custo_medio" | "custo_ultima_compra"
  >("custo_medio");
  const [margemLucro, setMargemLucro] = useState(0);

  // --- MOCKS E CARREGAMENTO DE DADOS ---
  useEffect(() => {
    // 1. Carregar Produto (Dados Globais)
    const mockProduct: ProdutoFiscal = {
      id: productId,
      nome:
        productId === "1"
          ? "Refrigerante Coca-Cola 2L"
          : "Arroz Branco Tipo 1 - 5kg",
      ncm: productId === "1" ? "22021000" : "10063021",
      codigoBarras: productId === "1" ? "7894900011517" : "7896036095904",
      grupo: productId === "1" ? "Bebidas" : "Alimentos",
    } as ProdutoFiscal;

    setProduct(mockProduct);

    // 2. Simulação de Histórico (Filtrado por StoreId)
    // Na vida real, isso viria de `prisma.purchaseHistory.findMany({ where: { storeId } })`
    const allHistory: HistoricoCompra[] = [
      // Compras da Loja 1 (Matriz)
      {
        id: "1",
        produtoId: "1",
        fornecedorId: "1",
        nomeFornecedor: "Distribuidora Alpha",
        data: "2024-02-10T10:00:00",
        quantidadeTotal: 100,
        quantidadeConvertidaUnd: 100,
        valorTotalNF: 425,
        precoBrutoUnd: 4.5,
        custoLiquidoUnd: 4.25,
      },
      {
        id: "2",
        produtoId: "1",
        fornecedorId: "1",
        nomeFornecedor: "Distribuidora Alpha",
        data: "2024-04-20T09:15:00",
        quantidadeTotal: 200,
        quantidadeConvertidaUnd: 200,
        valorTotalNF: 890,
        precoBrutoUnd: 4.6,
        custoLiquidoUnd: 4.45,
      },

      // Compras da Loja 2 (Filial) - Logística mais cara
      {
        id: "3",
        produtoId: "1",
        fornecedorId: "2",
        nomeFornecedor: "Atacado Beta",
        data: "2024-03-15T14:30:00",
        quantidadeTotal: 50,
        quantidadeConvertidaUnd: 50,
        valorTotalNF: 240,
        precoBrutoUnd: 5.0,
        custoLiquidoUnd: 4.8,
      },
    ];

    const storeHistory = allHistory.filter((h) => {
      if (storeId === "1") return ["1", "2"].includes(h.id);
      return ["3"].includes(h.id);
    });

    setHistorico(storeHistory);

    // 3. Simulação de Precificação Atual da Loja
    // Na vida real: `prisma.productStoreConfig.findUnique(...)`
    const mockPricing: PrecificacaoProduto = {
      produtoId: productId,
      baseCusto: "custo_medio",
      custoBase: storeId === "1" ? 4.35 : 4.8,
      margemLucroPercentual: storeId === "1" ? 30 : 35, // Margens diferentes por loja
      precoVendaUnitario: storeId === "1" ? 6.21 : 7.38,
      atualizadoEm: new Date().toISOString(),
    };

    setPrecificacao(mockPricing);
    setBaseCusto(mockPricing.baseCusto);
    setMargemLucro(mockPricing.margemLucroPercentual);
  }, [productId, storeId]);

  // --- CÁLCULOS EM TEMPO REAL ---

  // 1. Custo Médio Ponderado (Contexto da Loja)
  const custoMedioUnd = useMemo(() => {
    if (historico.length === 0) return 0;
    const totalCusto = historico.reduce(
      (sum, h) => sum + h.custoLiquidoUnd * h.quantidadeConvertidaUnd,
      0
    );
    const totalQuantidade = historico.reduce(
      (sum, h) => sum + h.quantidadeConvertidaUnd,
      0
    );
    return totalQuantidade > 0 ? totalCusto / totalQuantidade : 0;
  }, [historico]);

  // 2. Última Compra
  const ultimaCompra = useMemo(() => {
    if (historico.length === 0) return null;
    return [...historico].sort(
      (a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()
    )[0];
  }, [historico]);

  // 3. Custo Base Selecionado
  const custoBase = useMemo(() => {
    if (baseCusto === "custo_medio") {
      return custoMedioUnd;
    } else {
      return ultimaCompra?.custoLiquidoUnd || 0;
    }
  }, [baseCusto, custoMedioUnd, ultimaCompra]);

  // 4. Preço Sugerido (Fórmula)
  const precoVendaSugerido = useMemo(() => {
    if (custoBase === 0 || margemLucro >= 100) return 0;
    return custoBase / (1 - margemLucro / 100);
  }, [custoBase, margemLucro]);

  const handleAplicarPreco = () => {
    const novaPrecificacao: PrecificacaoProduto = {
      produtoId: productId,
      baseCusto,
      custoBase,
      margemLucroPercentual: margemLucro,
      precoVendaUnitario: precoVendaSugerido,
      atualizadoEm: new Date().toISOString(),
    };

    setPrecificacao(novaPrecificacao);

    toast({
      title: "Preço Salvo!",
      description: `O valor de R$ ${precoVendaSugerido.toFixed(
        2
      )} foi aplicado na ${storeName}.`,
    });
  };

  const sections = [
    {
      id: "historico" as SectionType,
      label: "Histórico de Compras",
      icon: History,
    },
    { id: "custoMedio" as SectionType, label: "Custo Médio", icon: TrendingUp },
    {
      id: "precificacao" as SectionType,
      label: "Precificação",
      icon: Calculator,
    },
  ];

  if (!product) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Carregando produto...
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <div className="md:hidden">
        <DashboardHeader />
      </div>

      <main className="container mx-auto max-w-6xl space-y-6 p-4">
        {/* Cabeçalho */}
        <div className="flex flex-col gap-4">
          <Button
            variant="ghost"
            className="w-fit pl-0 hover:bg-transparent hover:text-primary"
            onClick={() => router.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Produtos
          </Button>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                {product.nome}
              </h1>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-1">
                <span className="flex items-center gap-1">
                  <Badge variant="outline" className="font-mono text-xs">
                    EAN
                  </Badge>
                  {product.codigoBarras}
                </span>
                <span className="flex items-center gap-1">
                  <Badge variant="outline" className="font-mono text-xs">
                    NCM
                  </Badge>
                  {product.ncm}
                </span>
                {product.grupo && <span>Grupo: {product.grupo}</span>}
              </div>
            </div>

            {/* Box de Contexto de Loja */}
            <div className="flex items-center gap-3 bg-blue-50 dark:bg-blue-950/40 px-4 py-2 rounded-lg border border-blue-100 dark:border-blue-900">
              <div className="p-2 bg-white dark:bg-blue-900 rounded-full shadow-sm">
                <Building2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="text-right">
                <p className="text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider">
                  Contexto
                </p>
                <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                  {storeName}
                </p>
              </div>
            </div>
          </div>
        </div>

        <Card className="p-0 overflow-hidden border-none shadow-md">
          {/* Navegação de Abas */}
          <div className="bg-muted/30 border-b">
            <div className="flex overflow-x-auto">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all border-b-2 whitespace-nowrap hover:bg-muted/50 ${
                    activeSection === section.id
                      ? "border-primary text-primary bg-background"
                      : "border-transparent text-muted-foreground"
                  }`}
                >
                  <section.icon className="h-4 w-4" />
                  {section.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {/* SEÇÃO 1: HISTÓRICO DE COMPRAS (COMPLETA) */}
            {activeSection === "historico" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">
                    Entradas na {storeName}
                  </h3>
                  <Badge variant="secondary">
                    {historico.length} registros
                  </Badge>
                </div>

                {historico.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed rounded-lg">
                    <p className="text-muted-foreground">
                      Nenhuma compra registrada nesta loja.
                    </p>
                  </div>
                ) : (
                  <div className="rounded-md border overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-muted/50 border-b">
                        <tr>
                          <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                            Data
                          </th>
                          <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                            Fornecedor
                          </th>
                          <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                            Qtd Total
                          </th>
                          <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                            Qtd (UN)
                          </th>
                          <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                            Total NF
                          </th>
                          <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                            Custo Líq (UN)
                          </th>
                          <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                            Lucro Calc.
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {historico.map((compra) => {
                          const precoVenda =
                            precificacao?.precoVendaUnitario || 0;
                          const lucroPercentual =
                            precoVenda > 0
                              ? ((precoVenda - compra.custoLiquidoUnd) /
                                  precoVenda) *
                                100
                              : 0;

                          return (
                            <tr
                              key={compra.id}
                              className="hover:bg-muted/20 transition-colors"
                            >
                              <td className="px-4 py-3 whitespace-nowrap">
                                {new Date(compra.data).toLocaleDateString(
                                  "pt-BR"
                                )}
                              </td>
                              <td
                                className="px-4 py-3 max-w-[200px] truncate"
                                title={compra.nomeFornecedor}
                              >
                                {compra.nomeFornecedor}
                              </td>
                              <td className="px-4 py-3 text-right">
                                {compra.quantidadeTotal}
                              </td>
                              <td className="px-4 py-3 text-right">
                                {compra.quantidadeConvertidaUnd}
                              </td>
                              <td className="px-4 py-3 text-right">
                                R$ {compra.valorTotalNF.toFixed(2)}
                              </td>
                              <td className="px-4 py-3 text-right font-medium text-orange-600 dark:text-orange-400">
                                R$ {compra.custoLiquidoUnd.toFixed(2)}
                              </td>
                              <td className="px-4 py-3 text-right">
                                {lucroPercentual > 0 ? (
                                  <Badge
                                    variant="outline"
                                    className="text-green-600 border-green-200 bg-green-50"
                                  >
                                    {lucroPercentual.toFixed(1)}%
                                  </Badge>
                                ) : (
                                  "-"
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* SEÇÃO 2: CUSTO MÉDIO (COMPLETA) */}
            {activeSection === "custoMedio" && (
              <div className="space-y-8">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="p-4 bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-800">
                    <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-1">
                      Custo Médio (UN)
                    </p>
                    <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                      R$ {custoMedioUnd.toFixed(2)}
                    </p>
                  </Card>

                  <Card className="p-4 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-800">
                    <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium mb-1">
                      Total Comprado
                    </p>
                    <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
                      {historico.reduce(
                        (sum, h) => sum + h.quantidadeConvertidaUnd,
                        0
                      )}
                    </p>
                  </Card>

                  {ultimaCompra && (
                    <>
                      <Card className="p-4 bg-purple-50 border-purple-200 dark:bg-purple-950/30 dark:border-purple-800">
                        <p className="text-sm text-purple-600 dark:text-purple-400 font-medium mb-1">
                          Data Última Compra
                        </p>
                        <p className="text-lg font-semibold text-purple-700 dark:text-purple-300">
                          {new Date(ultimaCompra.data).toLocaleDateString(
                            "pt-BR"
                          )}
                        </p>
                      </Card>

                      <Card className="p-4 bg-orange-50 border-orange-200 dark:bg-orange-950/30 dark:border-orange-800">
                        <p className="text-sm text-orange-600 dark:text-orange-400 font-medium mb-1">
                          Custo Última Compra
                        </p>
                        <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">
                          R$ {ultimaCompra.custoLiquidoUnd.toFixed(2)}
                        </p>
                      </Card>
                    </>
                  )}
                </div>

                {historico.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-lg mb-4">
                      Últimas 5 Compras (Análise de Variação)
                    </h3>
                    <div className="border rounded-md overflow-hidden">
                      <table className="w-full text-sm">
                        <thead className="bg-muted/50 border-b">
                          <tr>
                            <th className="px-4 py-3 text-left">Data</th>
                            <th className="px-4 py-3 text-left">Fornecedor</th>
                            <th className="px-4 py-3 text-right">
                              Custo Líquido (UN)
                            </th>
                            <th className="px-4 py-3 text-right">
                              Variação da Média
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {[...historico]
                            .sort(
                              (a, b) =>
                                new Date(b.data).getTime() -
                                new Date(a.data).getTime()
                            )
                            .slice(0, 5)
                            .map((compra) => {
                              const variacao =
                                custoMedioUnd > 0
                                  ? ((compra.custoLiquidoUnd - custoMedioUnd) /
                                      custoMedioUnd) *
                                    100
                                  : 0;
                              return (
                                <tr
                                  key={compra.id}
                                  className="hover:bg-muted/20"
                                >
                                  <td className="px-4 py-3">
                                    {new Date(compra.data).toLocaleDateString(
                                      "pt-BR"
                                    )}
                                  </td>
                                  <td className="px-4 py-3">
                                    {compra.nomeFornecedor}
                                  </td>
                                  <td className="px-4 py-3 text-right font-medium">
                                    R$ {compra.custoLiquidoUnd.toFixed(2)}
                                  </td>
                                  <td className="px-4 py-3 text-right">
                                    <span
                                      className={`text-xs px-2 py-1 rounded-full ${
                                        variacao > 0
                                          ? "bg-red-100 text-red-700"
                                          : "bg-green-100 text-green-700"
                                      }`}
                                    >
                                      {variacao > 0 ? "+" : ""}
                                      {variacao.toFixed(1)}%
                                    </span>
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* SEÇÃO 3: PRECIFICAÇÃO (COMPLETA COM SIDEBAR) */}
            {activeSection === "precificacao" && (
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <div className="grid gap-6 p-6 border rounded-xl bg-card">
                    <div className="space-y-2">
                      <Label className="text-base">
                        1. Defina a Base de Custo
                      </Label>
                      <select
                        value={baseCusto}
                        onChange={(e) =>
                          setBaseCusto(
                            e.target.value as
                              | "custo_medio"
                              | "custo_ultima_compra"
                          )
                        }
                        className="flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        <option value="custo_medio">
                          Usar Custo Médio Local (R$ {custoMedioUnd.toFixed(2)})
                        </option>
                        <option value="custo_ultima_compra">
                          Usar Custo da Última Compra (R${" "}
                          {ultimaCompra?.custoLiquidoUnd.toFixed(2) || "0.00"})
                        </option>
                      </select>
                      <p className="text-sm text-muted-foreground">
                        O custo base será utilizado como ponto de partida para
                        aplicar a margem.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="p-4 rounded-lg bg-muted/50 border">
                        <Label className="text-muted-foreground">
                          Custo Base Selecionado
                        </Label>
                        <p className="text-3xl font-bold mt-1">
                          R$ {custoBase.toFixed(2)}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-base">
                          2. Margem de Lucro (%)
                        </Label>
                        <div className="relative">
                          <Input
                            type="number"
                            value={margemLucro}
                            onChange={(e) =>
                              setMargemLucro(parseFloat(e.target.value) || 0)
                            }
                            className="h-14 text-lg font-semibold pr-10"
                            placeholder="Ex: 30"
                          />
                          <span className="absolute right-4 top-4 text-muted-foreground font-semibold">
                            %
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {margemLucro > 0 && (
                    <Card className="p-6 bg-blue-50 border-blue-200 dark:bg-blue-900/10 dark:border-blue-800">
                      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div>
                          <Label className="text-blue-800 dark:text-blue-300 text-base">
                            3. Preço de Venda Sugerido
                          </Label>
                          <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                            Baseado no custo de R$ {custoBase.toFixed(2)} com
                            margem de {margemLucro}%
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-4xl font-bold text-blue-700 dark:text-blue-400">
                            R$ {precoVendaSugerido.toFixed(2)}
                          </p>
                          <p className="text-xs text-blue-600 mt-1">
                            Por Unidade
                          </p>
                        </div>
                      </div>
                    </Card>
                  )}

                  <Button
                    onClick={handleAplicarPreco}
                    disabled={margemLucro <= 0 || custoBase <= 0}
                    className="w-full h-12 text-base shadow-lg"
                    size="lg"
                  >
                    <Save className="w-5 h-5 mr-2" />
                    Salvar Preço na {storeName}
                  </Button>
                </div>

                {/* Sidebar da Precificação (Info) */}
                <div className="space-y-6">
                  {precificacao ? (
                    <Card className="p-6 bg-green-50 border-green-200 dark:bg-green-900/10 dark:border-green-800">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-green-100 rounded-full dark:bg-green-900">
                          <TrendingUp className="h-5 w-5 text-green-700 dark:text-green-400" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-green-900 dark:text-green-300">
                            Preço Ativo
                          </h4>
                          <p className="text-3xl font-bold text-green-700 dark:text-green-400 my-2">
                            R$ {precificacao.precoVendaUnitario.toFixed(2)}
                          </p>
                          <p className="text-xs text-green-800 dark:text-green-500">
                            Atualizado em:{" "}
                            {new Date(precificacao.atualizadoEm).toLocaleString(
                              "pt-BR"
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-green-200 dark:border-green-800 grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="block text-green-700/70">
                            Margem
                          </span>
                          <span className="font-medium text-green-900 dark:text-green-300">
                            {precificacao.margemLucroPercentual}%
                          </span>
                        </div>
                        <div>
                          <span className="block text-green-700/70">Base</span>
                          <span className="font-medium text-green-900 dark:text-green-300">
                            {precificacao.baseCusto === "custo_medio"
                              ? "Custo Médio"
                              : "Última Compra"}
                          </span>
                        </div>
                      </div>
                    </Card>
                  ) : (
                    <Card className="p-6 border-dashed bg-muted/30">
                      <div className="flex flex-col items-center text-center text-muted-foreground">
                        <AlertCircle className="h-10 w-10 mb-2 opacity-50" />
                        <p>
                          Este produto ainda não possui preço de venda definido.
                        </p>
                      </div>
                    </Card>
                  )}

                  <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-200 dark:bg-yellow-900/10 dark:border-yellow-800">
                    <h4 className="font-semibold text-yellow-900 dark:text-yellow-300 text-sm mb-2">
                      Dica de Gestão
                    </h4>
                    <p className="text-xs text-yellow-800 dark:text-yellow-400 leading-relaxed">
                      Mantenha a margem de lucro revisada sempre que houver
                      variação significativa no custo médio ou troca de
                      fornecedor.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>
      </main>
    </div>
  );
}
