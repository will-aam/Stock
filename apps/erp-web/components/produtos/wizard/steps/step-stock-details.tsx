"use client";

import { useWizardStore } from "../use-wizard-store";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  DollarSign,
  MapPin,
  AlertTriangle,
  CalendarClock,
  QrCode,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function StepStockDetails() {
  const { data, flags, updateData } = useWizardStore();

  return (
    <div className="space-y-6 py-4 animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="text-center space-y-2 mb-6">
        <h2 className="text-2xl font-bold tracking-tight">Gestão de Estoque</h2>
        <p className="text-muted-foreground text-sm">
          Defina os parâmetros de controle, rastreabilidade e precificação.
        </p>
      </div>

      <div className="grid gap-6 max-w-lg mx-auto">
        {/* --- AVISOS INTELIGENTES (WARNINGS) --- */}

        {/* Aviso: Venda sem estoque */}
        {flags.vendaHabilitada && !flags.geraEstoque && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex gap-3 items-start">
            <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-amber-800">
                Atenção: Venda sem controle
              </h4>
              <p className="text-xs text-amber-700 leading-relaxed">
                Este item será vendido, mas o sistema{" "}
                <strong>não descontará do saldo</strong>. Ideal para serviços ou
                itens digitais. Se for um produto físico, recomendamos ativar o
                controle de estoque.
              </p>
            </div>
          </div>
        )}

        {/* Aviso: Estoque sem local (aparece se gera estoque mas não preencheu local) */}
        {flags.geraEstoque && !data.localizacao && (
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 flex gap-3 items-center">
            <Info className="h-5 w-5 text-blue-600 shrink-0" />
            <p className="text-xs text-blue-700">
              Dica: Defina uma <strong>localização</strong> (ex: Prateleira A)
              para facilitar o inventário e a separação de pedidos.
            </p>
          </div>
        )}

        {/* --- BLOCO DE PREÇO --- */}
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
              {!data.precoVenda && (
                <p className="text-[10px] text-amber-600 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  Você ainda não definiu o preço de venda.
                </p>
              )}
            </div>
          </div>
        )}

        {/* --- BLOCO DE ESTOQUE E RASTREABILIDADE --- */}
        {flags.geraEstoque && (
          <div className="space-y-5 border rounded-xl p-4 bg-card">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <MapPin className="h-4 w-4" /> Logística Interna
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs">Estoque Mínimo</Label>
                <Input
                  type="number"
                  min="0"
                  placeholder="Ex: 10"
                  value={data.estoqueMinimo || ""}
                  onChange={(e) =>
                    updateData({ estoqueMinimo: parseFloat(e.target.value) })
                  }
                />
              </div>

              {flags.requerLocalEstoque && (
                <div className="space-y-2">
                  <Label className="text-xs">Localização</Label>
                  <Input
                    placeholder="Corredor A..."
                    value={data.localizacao || ""}
                    onChange={(e) =>
                      updateData({ localizacao: e.target.value })
                    }
                  />
                </div>
              )}
            </div>

            <div className="space-y-3 pt-2">
              <Label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                Rastreabilidade Avançada
              </Label>

              <div className="flex items-center justify-between border p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium flex items-center gap-2 cursor-pointer">
                    <QrCode className="h-4 w-4 text-muted-foreground" />
                    Controlar Lote
                  </Label>
                  <p className="text-[10px] text-muted-foreground">
                    Exige número de lote na entrada/saída.
                  </p>
                </div>
                <Switch
                  checked={data.controlaLote}
                  onCheckedChange={(v) => updateData({ controlaLote: v })}
                />
              </div>

              <div className="flex items-center justify-between border p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium flex items-center gap-2 cursor-pointer">
                    <CalendarClock className="h-4 w-4 text-muted-foreground" />
                    Controlar Validade
                  </Label>
                  <p className="text-[10px] text-muted-foreground">
                    Exige data de vencimento (FEFO).
                  </p>
                </div>
                <Switch
                  checked={data.controlaValidade}
                  onCheckedChange={(v) => updateData({ controlaValidade: v })}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
