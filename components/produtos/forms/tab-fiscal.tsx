"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Layers } from "lucide-react";
import { SearchableSelect } from "@/components/ui/searchable-select";

// Mocks e Tipos
import { Produto } from "@/lib/mock/produtos/index";
import { gruposTributarios } from "@/lib/mock/produtos/grupos-tributarios";

interface TabFiscalProps {
  formData: Partial<Produto>;
  onChange: (field: string, value: any) => void;
}

export function TabFiscal({ formData, onChange }: TabFiscalProps) {
  return (
    <div className="space-y-6">
      {/* Card Informativo */}
      <div className="bg-blue-50/50 dark:bg-blue-900/10 p-4 rounded-lg border border-blue-100 dark:border-blue-900 flex gap-3">
        <Layers className="h-5 w-5 text-blue-600 mt-1 shrink-0" />
        <div className="space-y-1">
          <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-200">
            Grupo Tributário Inteligente
          </h4>
          <p className="text-xs text-blue-700 dark:text-blue-300">
            Ao selecionar um grupo, o sistema aplica automaticamente as regras
            de ICMS, PIS e COFINS.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Grupo Tributário */}
        <div className="space-y-2">
          <Label className="text-primary font-semibold">
            Grupo Tributário *
          </Label>
          <SearchableSelect
            value={formData.grupoTributarioId || ""}
            onChange={(v) => onChange("grupoTributarioId", v)}
            options={gruposTributarios.map((gt) => ({
              value: gt.id,
              label: gt.descricao,
              info: `Cód: ${gt.codigoInterno}`,
            }))}
            placeholder="Pesquisar regra fiscal..."
            className="h-11 border-primary/20"
          />
        </div>

        <Separator />

        {/* NCM e CEST */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label>NCM (Nomenclatura Comum) *</Label>
            <Input
              value={formData.ncm || ""}
              onChange={(e) => onChange("ncm", e.target.value)}
              placeholder="0000.00.00"
              className="font-mono"
            />
          </div>
          <div className="space-y-2">
            <Label>CEST (Substituição Tributária)</Label>
            <Input
              value={formData.cest || ""}
              onChange={(e) => onChange("cest", e.target.value)}
              placeholder="00.000.00"
              className="font-mono"
            />
          </div>
        </div>

        {/* Origem */}
        <div className="space-y-2">
          <Label>Origem da Mercadoria</Label>
          <Select
            value={String(formData.origem ?? "")}
            onValueChange={(v) => onChange("origem", parseInt(v))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">0 - Nacional</SelectItem>
              <SelectItem value="1">
                1 - Estrangeira (Importação direta)
              </SelectItem>
              <SelectItem value="2">
                2 - Estrangeira (Adq. mercado interno)
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
