"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { DollarSign, Copy, MapPin } from "lucide-react";

// Mocks e Tipos
import { Produto, EstoquePorLoja } from "@/lib/mock/produtos/index";
import { empresas } from "@/lib/mock/empresas";

interface TabLojasProps {
  formData: Partial<Produto>;
  onChange: (field: string, value: any) => void;
}

export function TabLojas({ formData, onChange }: TabLojasProps) {
  // Atualiza o Preço de Venda (Tabela "Varejo") para uma loja específica
  const updateLojaPreco = (empresaId: string, valor: number) => {
    const newPrecos = [...(formData.precos || [])];
    const index = newPrecos.findIndex((p) => p.empresaId === empresaId);

    if (index >= 0) {
      // Atualiza existente
      const tabelas = [...newPrecos[index].tabelas];
      const tabIndex = tabelas.findIndex((t) => t.id === "tab-1");

      if (tabIndex >= 0) {
        tabelas[tabIndex] = { ...tabelas[tabIndex], valor };
      } else {
        tabelas.push({ id: "tab-1", nome: "Varejo", valor });
      }
      newPrecos[index] = { ...newPrecos[index], tabelas };
    } else {
      // Cria novo registo de preço para essa loja
      newPrecos.push({
        empresaId,
        precoCusto: 0,
        custoMedio: 0,
        margemLucroAlvo: 0,
        markupAlvo: 0,
        precoAberto: false,
        tabelas: [{ id: "tab-1", nome: "Varejo", valor }],
      });
    }

    onChange("precos", newPrecos);
  };

  // Atualiza campos de stock (Atual, Mínimo, Máximo)
  const updateLojaEstoque = (
    empresaId: string,
    field: keyof EstoquePorLoja,
    value: number,
  ) => {
    const newEstoque = [...(formData.estoque || [])];
    const index = newEstoque.findIndex((e) => e.empresaId === empresaId);

    if (index >= 0) {
      newEstoque[index] = { ...newEstoque[index], [field]: value };
    } else {
      const novoEstoque: any = {
        empresaId,
        atual: 0,
        minimo: 0,
        maximo: 0,
        seguranca: 0,
        pontoReposicao: 0,
        tempoReposicao: 0,
        loteEconomicoCompra: 0,
      };
      novoEstoque[field] = value;
      newEstoque.push(novoEstoque);
    }

    onChange("estoque", newEstoque);
  };

  // Replica o preço da loja de origem para todas as outras
  const replicatePriceToAll = (sourceEmpresaId: string) => {
    const sourcePreco = formData.precos
      ?.find((p) => p.empresaId === sourceEmpresaId)
      ?.tabelas.find((t) => t.id === "tab-1")?.valor;

    if (!sourcePreco) return;

    const newPrecos = [...(formData.precos || [])];

    empresas.forEach((emp) => {
      if (emp.id !== sourceEmpresaId) {
        const existingIndex = newPrecos.findIndex(
          (p) => p.empresaId === emp.id,
        );
        if (existingIndex >= 0) {
          const tabs = [...newPrecos[existingIndex].tabelas];
          const tabIndex = tabs.findIndex((t) => t.id === "tab-1");
          if (tabIndex >= 0) tabs[tabIndex].valor = sourcePreco;
          else tabs.push({ id: "tab-1", nome: "Varejo", valor: sourcePreco });
          newPrecos[existingIndex].tabelas = tabs;
        } else {
          newPrecos.push({
            empresaId: emp.id,
            tabelas: [{ id: "tab-1", nome: "Varejo", valor: sourcePreco }],
            precoCusto: 0,
            custoMedio: 0,
            margemLucroAlvo: 0,
            markupAlvo: 0,
            precoAberto: false,
          });
        }
      }
    });

    onChange("precos", newPrecos);
  };

  return (
    <div className="space-y-4">
      {empresas.map((empresa) => {
        const dadosPreco = formData.precos?.find(
          (p) => p.empresaId === empresa.id,
        );
        const dadosEstoque = formData.estoque?.find(
          (e) => e.empresaId === empresa.id,
        );
        const precoVarejo =
          dadosPreco?.tabelas?.find((t) => t.id === "tab-1")?.valor || 0;
        const estoqueAtual = dadosEstoque?.atual || 0;
        const valorEmEstoque = precoVarejo * estoqueAtual;

        return (
          <div
            key={empresa.id}
            className="border rounded-lg p-4 bg-background shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <h4 className="font-semibold text-sm">
                  {empresa.nomeFantasia}
                </h4>
              </div>
              <Button
                variant="secondary"
                size="sm"
                className="h-6 text-[10px] gap-1"
                onClick={() => replicatePriceToAll(empresa.id)}
                title="Copiar este preço para todas as lojas"
              >
                <Copy className="h-3 w-3" />
                Replicar
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">
                  Preço Venda (Varejo)
                </Label>
                <div className="relative">
                  <DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-green-600" />
                  <Input
                    type="number"
                    className="pl-7 h-9 font-bold text-green-700"
                    value={precoVarejo}
                    onChange={(e) =>
                      updateLojaPreco(empresa.id, parseFloat(e.target.value))
                    }
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">
                  Estoque Atual
                </Label>
                <Input
                  type="number"
                  className="h-9 bg-muted/50"
                  value={estoqueAtual}
                  disabled // Stock usually updated via movement, not direct edit
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">
                  Valor em Estoque
                </Label>
                <div className="relative">
                  <DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                  <Input
                    type="text"
                    className="pl-7 h-9 font-semibold text-muted-foreground bg-muted/50"
                    value={new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(valorEmEstoque)}
                    disabled
                  />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
