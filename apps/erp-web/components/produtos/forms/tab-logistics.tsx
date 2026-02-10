"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Scale, Truck, QrCode, CalendarClock } from "lucide-react";
import { Produto } from "@/lib/mock/produtos/index";

interface TabLogisticsProps {
  // Usamos Partial<Produto> e estendemos com os novos campos caso o mock ainda não os tenha
  formData: Partial<Produto> & {
    controlaLote?: boolean;
    controlaValidade?: boolean;
  };
  onChange: (field: string, value: any) => void;
}

export function TabLogistics({ formData, onChange }: TabLogisticsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Coluna 1: Pesos e Dimensões */}
      <div className="bg-muted/30 p-4 rounded-lg border space-y-4 h-fit">
        <div className="flex items-center gap-2 mb-2">
          <Scale className="h-4 w-4 text-muted-foreground" />
          <h4 className="font-medium text-sm">Pesos e Dimensões</h4>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs">Peso Bruto (KG)</Label>
            <Input
              type="number"
              step="0.001"
              value={formData.pesoBruto}
              onChange={(e) =>
                onChange("pesoBruto", parseFloat(e.target.value))
              }
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Peso Líquido (KG)</Label>
            <Input
              type="number"
              step="0.001"
              value={formData.pesoLiquido}
              onChange={(e) =>
                onChange("pesoLiquido", parseFloat(e.target.value))
              }
            />
          </div>
        </div>
      </div>

      {/* Coluna 2: Controle WMS e Rastreabilidade */}
      <div className="bg-muted/30 p-4 rounded-lg border space-y-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Truck className="h-4 w-4 text-muted-foreground" />
            <h4 className="font-medium text-sm">Controle WMS</h4>
          </div>

          <div className="flex items-center justify-between">
            <Label className="text-xs">Controlar Estoque?</Label>
            <Switch
              checked={formData.controlaEstoque}
              onCheckedChange={(v) => onChange("controlaEstoque", v)}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Tipo de Controle</Label>
            <Select
              value={formData.tipoControle}
              onValueChange={(v) => onChange("tipoControle", v)}
            >
              <SelectTrigger className="h-9 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unitario">Unitário (Padrão)</SelectItem>
                <SelectItem value="lote">Controle de Lote/Validade</SelectItem>
                <SelectItem value="serie">
                  Número de Série (IMEI/Serial)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Rastreabilidade Avançada (Novos Campos) */}
        {/* Só mostramos se o estoque estiver ativado para não poluir */}
        {formData.controlaEstoque && (
          <div className="space-y-3 pt-4 border-t border-dashed border-slate-300 dark:border-slate-700">
            <Label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
              Rastreabilidade Avançada
            </Label>

            <div className="flex items-center justify-between border bg-background p-3 rounded-lg">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <QrCode className="h-4 w-4 text-muted-foreground" />
                  Controlar Lote
                </Label>
                <p className="text-[10px] text-muted-foreground">
                  Exige número de lote na entrada/saída.
                </p>
              </div>
              <Switch
                checked={formData.controlaLote}
                onCheckedChange={(v) => onChange("controlaLote", v)}
              />
            </div>

            <div className="flex items-center justify-between border bg-background p-3 rounded-lg">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <CalendarClock className="h-4 w-4 text-muted-foreground" />
                  Controlar Validade
                </Label>
                <p className="text-[10px] text-muted-foreground">
                  Exige data de vencimento (FEFO).
                </p>
              </div>
              <Switch
                checked={formData.controlaValidade}
                onCheckedChange={(v) => onChange("controlaValidade", v)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
