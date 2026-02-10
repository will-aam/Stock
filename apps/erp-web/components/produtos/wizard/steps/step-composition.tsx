"use client";

import { useState } from "react";
import { useWizardStore } from "../use-wizard-store";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Plus, Trash2, ChefHat, Scale } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock de insumos para simular a busca
const insumosDisponiveis = [
  { id: "1", nome: "Pão de Hambúrguer", unidade: "UN", custo: 0.8 },
  { id: "2", nome: "Carne Moída", unidade: "KG", custo: 25.0 },
  { id: "3", nome: "Queijo Cheddar", unidade: "KG", custo: 45.0 },
  { id: "4", nome: "Embalagem", unidade: "UN", custo: 0.5 },
];

interface ItemComposicao {
  id: string;
  nome: string;
  quantidade: number;
  unidade: string;
  custoUnitario: number;
}

export function StepComposition() {
  // Nota: Num cenário real, salvaríamos isso no store.
  // Aqui uso estado local para prototipar a lista.
  const [items, setItems] = useState<ItemComposicao[]>([]);
  const [tempQtd, setTempQtd] = useState("");
  const [selectedInsumoId, setSelectedInsumoId] = useState("");

  const handleAdd = () => {
    const insumo = insumosDisponiveis.find((i) => i.id === selectedInsumoId);
    if (!insumo || !tempQtd) return;

    const newItem: ItemComposicao = {
      id: Math.random().toString(), // ID temporário
      nome: insumo.nome,
      quantidade: parseFloat(tempQtd),
      unidade: insumo.unidade,
      custoUnitario: insumo.custo,
    };

    setItems([...items, newItem]);
    setTempQtd("");
    setSelectedInsumoId("");
  };

  const handleRemove = (id: string) => {
    setItems(items.filter((i) => i.id !== id));
  };

  const custoTotal = items.reduce(
    (acc, item) => acc + item.quantidade * item.custoUnitario,
    0,
  );

  return (
    <div className="space-y-6 py-4 animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="text-center space-y-2 mb-6">
        <h2 className="text-2xl font-bold tracking-tight">Ficha Técnica</h2>
        <p className="text-muted-foreground text-sm">
          Defina os ingredientes ou materiais usados para produzir 1 unidade.
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Adicionar Insumo */}
        <div className="bg-muted/30 p-4 rounded-xl border space-y-3">
          <Label>Adicionar Insumo / Matéria-Prima</Label>
          <div className="flex gap-2">
            <select
              className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={selectedInsumoId}
              onChange={(e) => setSelectedInsumoId(e.target.value)}
            >
              <option value="" disabled>
                Selecione um ingrediente...
              </option>
              {insumosDisponiveis.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.nome} ({i.unidade})
                </option>
              ))}
            </select>

            <Input
              type="number"
              placeholder="Qtd"
              className="w-24"
              value={tempQtd}
              onChange={(e) => setTempQtd(e.target.value)}
            />

            <Button
              onClick={handleAdd}
              disabled={!selectedInsumoId || !tempQtd}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Lista de Itens */}
        <div className="border rounded-xl overflow-hidden bg-background">
          <div className="grid grid-cols-12 gap-2 bg-muted/50 p-3 text-xs font-semibold text-muted-foreground">
            <div className="col-span-6">ITEM</div>
            <div className="col-span-2 text-right">QTD</div>
            <div className="col-span-3 text-right">CUSTO APROX.</div>
            <div className="col-span-1"></div>
          </div>

          <div className="divide-y max-h-[200px] overflow-y-auto">
            {items.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground text-sm flex flex-col items-center gap-2">
                <ChefHat className="h-8 w-8 opacity-20" />
                Nenhum item adicionado à receita.
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-12 gap-2 p-3 items-center text-sm hover:bg-muted/10 transition-colors"
                >
                  <div className="col-span-6 font-medium truncate">
                    {item.nome}
                  </div>
                  <div className="col-span-2 text-right font-mono text-xs">
                    {item.quantidade}{" "}
                    <span className="text-muted-foreground">
                      {item.unidade}
                    </span>
                  </div>
                  <div className="col-span-3 text-right font-mono text-xs text-muted-foreground">
                    R$ {(item.quantidade * item.custoUnitario).toFixed(2)}
                  </div>
                  <div className="col-span-1 flex justify-end">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-muted-foreground hover:text-destructive"
                      onClick={() => handleRemove(item.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Rodapé de totais */}
          <div className="bg-muted/20 p-4 border-t flex justify-between items-center">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Scale className="h-4 w-4" />
              <span>Custo Base Estimado:</span>
            </div>
            <div className="text-lg font-bold text-foreground">
              R$ {custoTotal.toFixed(2)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
