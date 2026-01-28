"use client";

import { useWizardStore } from "../use-wizard-store";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DollarSign, MapPin, AlertTriangle } from "lucide-react";

export function StepStockDetails() {
  const { data, flags, updateData } = useWizardStore();

  return (
    <div className="space-y-6 py-4 animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="text-center space-y-2 mb-6">
        <h2 className="text-2xl font-bold tracking-tight">Gestão de Estoque</h2>
        <p className="text-muted-foreground text-sm">
          Defina os parâmetros de controle e precificação inicial.
        </p>
      </div>

      <div className="grid gap-6 max-w-lg mx-auto">
        {/* Bloco de Preço (Só aparece se venda for habilitada) */}
        {flags.vendaHabilitada && (
          <div className="bg-green-50/50 dark:bg-green-900/10 p-4 rounded-xl border border-green-100 dark:border-green-900/20 space-y-3">
            <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
              <DollarSign className="h-5 w-5" />
              <h3 className="font-semibold text-sm">Preço de Venda</h3>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">
                Valor de Venda (Varejo)
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold text-sm">
                  R$
                </span>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0,00"
                  className="pl-9 font-bold text-lg h-12"
                  value={data.precoVenda || ""}
                  onChange={(e) =>
                    updateData({ precoVenda: parseFloat(e.target.value) })
                  }
                />
              </div>
            </div>
          </div>
        )}

        {/* Bloco de Estoque */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Estoque Mínimo */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                Estoque Mínimo
                <span
                  className="text-muted-foreground cursor-help"
                  title="Quantidade mínima para alerta de reposição"
                >
                  <AlertTriangle className="h-3 w-3" />
                </span>
              </Label>
              <Input
                type="number"
                min="0"
                placeholder="Ex: 10"
                value={data.estoqueMinimo || ""}
                onChange={(e) =>
                  updateData({ estoqueMinimo: parseFloat(e.target.value) })
                }
              />
              <p className="text-[10px] text-muted-foreground">
                Alerta para repor mercadoria.
              </p>
            </div>

            {/* Localização */}
            {flags.requerLocalEstoque && (
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  Localização
                  <MapPin className="h-3 w-3 text-muted-foreground" />
                </Label>
                <Input
                  placeholder="Corredor A, Prateleira 2..."
                  value={data.localizacao || ""}
                  onChange={(e) => updateData({ localizacao: e.target.value })}
                />
                <p className="text-[10px] text-muted-foreground">
                  Onde encontrar no depósito.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
