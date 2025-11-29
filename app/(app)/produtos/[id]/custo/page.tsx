"use client";

import { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DashboardHeader } from "@/components/home/dashboard-header";
import { ProdutoFiscal, HistoricoCompra } from "@/types/produto-fiscal";
import { ArrowLeft, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type SectionType = "historico" | "custoMedio" | "precificacao";

export default function CustoPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  // Casting para string para evitar problemas de tipagem com params
  const productId = params?.id as string;

  // Estados
  const [activeSection, setActiveSection] = useState<SectionType>("historico");
  const [baseCusto, setBaseCusto] = useState<
    "custo_medio" | "custo_ultima_compra"
  >("custo_medio");
  const [margemLucro, setMargemLucro] = useState(30);

  // --- DADOS MOCKADOS (SIMULAÇÃO) ---
  const productMock: ProdutoFiscal = {
    id: productId,
    nome:
      productId === "1"
        ? "Refrigerante Coca-Cola 2L"
        : "Arroz Branco Tipo 1 - 5kg",
    ncm: productId === "1" ? "22021000" : "10063021",
    codigoBarras: productId === "1" ? "7894900011517" : "7896036095904",
  } as ProdutoFiscal;

  const historyMock: HistoricoCompra[] = [
    {
      id: "1",
      produtoId: productId,
      fornecedorId: "1",
      nomeFornecedor: "Distribuidora Alpha",
      data: "2024-02-10",
      quantidadeTotal: 100,
      quantidadeConvertidaUnd: 100,
      valorTotalNF: 450,
      precoBrutoUnd: 4.5,
      custoLiquidoUnd: 4.25,
    },
    {
      id: "2",
      produtoId: productId,
      fornecedorId: "2",
      nomeFornecedor: "Atacado Beta",
      data: "2024-03-15",
      quantidadeTotal: 50,
      quantidadeConvertidaUnd: 50,
      valorTotalNF: 240,
      precoBrutoUnd: 4.8,
      custoLiquidoUnd: 4.6,
    },
    {
      id: "3",
      produtoId: productId,
      fornecedorId: "1",
      nomeFornecedor: "Distribuidora Alpha",
      data: "2024-04-20",
      quantidadeTotal: 200,
      quantidadeConvertidaUnd: 200,
      valorTotalNF: 920,
      precoBrutoUnd: 4.6,
      custoLiquidoUnd: 4.45,
    },
  ];
  // ----------------------------------

  // Cálculos
  const custoMedioUnd = useMemo(() => {
    const totalCusto = historyMock.reduce(
      (sum, h) => sum + h.custoLiquidoUnd * h.quantidadeConvertidaUnd,
      0
    );
    const totalQtd = historyMock.reduce(
      (sum, h) => sum + h.quantidadeConvertidaUnd,
      0
    );
    return totalQtd > 0 ? totalCusto / totalQtd : 0;
  }, [historyMock]);

  const ultimaCompra = useMemo(() => {
    return [...historyMock].sort(
      (a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()
    )[0];
  }, [historyMock]);

  const custoBase =
    baseCusto === "custo_medio"
      ? custoMedioUnd
      : ultimaCompra?.custoLiquidoUnd || 0;

  const precoVendaSugerido = useMemo(() => {
    if (custoBase === 0 || margemLucro >= 100) return 0;
    return custoBase / (1 - margemLucro / 100);
  }, [custoBase, margemLucro]);

  const handleSavePricing = () => {
    toast({
      title: "Preço Atualizado",
      description: `Novo preço de venda definido: R$ ${precoVendaSugerido.toFixed(
        2
      )}`,
    });
  };

  const sections = [
    { id: "historico" as SectionType, label: "Histórico de Compras" },
    { id: "custoMedio" as SectionType, label: "Custo Médio" },
    { id: "precificacao" as SectionType, label: "Precificação" },
  ];

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <div className="md:hidden">
        <DashboardHeader />
      </div>

      <main className="container mx-auto max-w-5xl space-y-6 p-4">
        {/* Cabeçalho do Produto */}
        <div className="flex flex-col gap-4">
          <Button
            variant="ghost"
            className="w-fit pl-0 hover:bg-transparent hover:text-primary"
            onClick={() => router.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Produtos
          </Button>

          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {productMock.nome}
            </h1>
            <p className="text-muted-foreground flex gap-4 text-sm mt-1">
              <span>
                EAN:{" "}
                <span className="font-mono">{productMock.codigoBarras}</span>
              </span>
              <span>•</span>
              <span>
                NCM: <span className="font-mono">{productMock.ncm}</span>
              </span>
            </p>
          </div>
        </div>

        <Card className="p-6">
          {/* Navegação Interna (Tabs Manuais) */}
          <div className="border-b mb-6 overflow-x-auto">
            <div className="flex gap-4 min-w-max">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`pb-3 text-sm font-medium transition-colors border-b-2 ${
                    activeSection === section.id
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {section.label}
                </button>
              ))}
            </div>
          </div>

          {/* Conteúdo: Histórico */}
          {activeSection === "historico" && (
            <div className="space-y-4">
              <div className="rounded-md border overflow-x-auto">
                <div className="min-w-[600px]">
                  <div className="grid grid-cols-5 gap-4 p-4 font-medium text-sm bg-muted/50 border-b">
                    <div>Data</div>
                    <div className="col-span-2">Fornecedor</div>
                    <div className="text-right">Qtd.</div>
                    <div className="text-right">Custo Líq. (UN)</div>
                  </div>
                  {historyMock.map((item) => (
                    <div
                      key={item.id}
                      className="grid grid-cols-5 gap-4 p-4 text-sm border-b last:border-0 items-center hover:bg-muted/30"
                    >
                      <div className="text-muted-foreground">
                        {new Date(item.data).toLocaleDateString("pt-BR")}
                      </div>
                      <div className="col-span-2 font-medium">
                        {item.nomeFornecedor}
                      </div>
                      <div className="text-right">
                        {item.quantidadeConvertidaUnd}
                      </div>
                      <div className="text-right font-medium">
                        R$ {item.custoLiquidoUnd.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Conteúdo: Custo Médio */}
          {activeSection === "custoMedio" && (
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-4 bg-blue-50/50 border-blue-100 dark:bg-blue-900/10 dark:border-blue-900">
                <p className="text-sm text-muted-foreground mb-1">
                  Custo Médio Ponderado
                </p>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  R$ {custoMedioUnd.toFixed(2)}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Baseado em todas as entradas registradas
                </p>
              </Card>

              <Card className="p-4 bg-orange-50/50 border-orange-100 dark:bg-orange-900/10 dark:border-orange-900">
                <p className="text-sm text-muted-foreground mb-1">
                  Último Custo Líquido
                </p>
                <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                  R$ {ultimaCompra.custoLiquidoUnd.toFixed(2)}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Baseado na entrada de{" "}
                  {new Date(ultimaCompra.data).toLocaleDateString("pt-BR")}
                </p>
              </Card>
            </div>
          )}

          {/* Conteúdo: Precificação */}
          {activeSection === "precificacao" && (
            <div className="space-y-6 max-w-2xl">
              <div className="grid gap-4 p-4 bg-muted/30 rounded-lg border">
                <div className="space-y-2">
                  <Label>Base de Custo para Cálculo</Label>
                  <select
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors"
                    value={baseCusto}
                    onChange={(e) => setBaseCusto(e.target.value as any)}
                  >
                    <option value="custo_medio">
                      Usar Custo Médio (R$ {custoMedioUnd.toFixed(2)})
                    </option>
                    <option value="custo_ultima_compra">
                      Usar Última Compra (R${" "}
                      {ultimaCompra.custoLiquidoUnd.toFixed(2)})
                    </option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Margem de Lucro (%)</Label>
                    <div className="relative">
                      <Input
                        type="number"
                        value={margemLucro}
                        onChange={(e) => setMargemLucro(Number(e.target.value))}
                        className="pr-8"
                      />
                      <span className="absolute right-3 top-2.5 text-xs text-muted-foreground">
                        %
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Custo Base</Label>
                    <Input
                      value={`R$ ${custoBase.toFixed(2)}`}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-6 bg-primary/5 rounded-xl border border-primary/20">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Preço de Venda Sugerido
                  </p>
                  <p className="text-4xl font-bold text-primary mt-1">
                    R$ {precoVendaSugerido.toFixed(2)}
                  </p>
                </div>
                <Button size="lg" onClick={handleSavePricing}>
                  <Save className="mr-2 h-4 w-4" />
                  Aplicar Preço
                </Button>
              </div>
            </div>
          )}
        </Card>
      </main>
    </div>
  );
}
