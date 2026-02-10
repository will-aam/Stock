"use client";

import { useState } from "react";
import { useWizardStore } from "../use-wizard-store";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Layers, ChevronsUpDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

// Mocks
import { gruposTributarios } from "@/lib/mock/produtos/grupos-tributarios";

// UI Components para o Combobox
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Reutilizando o componente SearchableSelect localmente
// (Idealmente, num projeto real, moveria isto para @/components/ui/searchable-select)
interface SearchableSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string; info?: string }[];
  placeholder: string;
  emptyMessage?: string;
  className?: string;
}

function SearchableSelect({
  value,
  onChange,
  options,
  placeholder,
  emptyMessage = "Nenhum resultado.",
  className,
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false);
  const selectedLabel = options.find((opt) => opt.value === value)?.label;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between font-normal",
            !value && "text-muted-foreground",
            className,
          )}
        >
          {selectedLabel || placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[350px] p-0" align="start">
        <Command>
          <CommandInput placeholder={`Buscar...`} />
          <CommandList>
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup>
              {options.map((opt) => (
                <CommandItem
                  key={opt.value}
                  value={opt.label}
                  onSelect={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === opt.value ? "opacity-100" : "opacity-0",
                    )}
                  />
                  <div className="flex flex-col">
                    <span>{opt.label}</span>
                    {opt.info && (
                      <span className="text-[10px] text-muted-foreground">
                        {opt.info}
                      </span>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export function StepFiscal() {
  const { data, updateData } = useWizardStore();

  return (
    <div className="space-y-6 py-4 animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="text-center space-y-2 mb-6">
        <h2 className="text-2xl font-bold tracking-tight">
          Fiscal e Tributário
        </h2>
        <p className="text-muted-foreground text-sm">
          Configure como este produto será tributado nas vendas.
        </p>
      </div>

      <div className="max-w-xl mx-auto space-y-6">
        {/* Card Informativo */}
        <div className="bg-blue-50/50 dark:bg-blue-900/10 p-4 rounded-lg border border-blue-100 dark:border-blue-900 flex gap-3">
          <Layers className="h-5 w-5 text-blue-600 mt-1 shrink-0" />
          <div className="space-y-1">
            <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-200">
              Grupo Tributário Inteligente
            </h4>
            <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
              Selecionar um grupo preenche automaticamente as regras de ICMS,
              PIS e COFINS para cada estado, poupando tempo e evitando erros.
            </p>
          </div>
        </div>

        {/* Campos */}
        <div className="space-y-5">
          <div className="space-y-2">
            <Label className="text-primary font-semibold">
              Grupo Tributário <span className="text-red-500">*</span>
            </Label>
            <SearchableSelect
              value={data.grupoTributarioId || ""}
              onChange={(v) => updateData({ grupoTributarioId: v })}
              options={gruposTributarios.map((gt) => ({
                value: gt.id,
                label: gt.descricao,
                info: `Cód: ${gt.codigoInterno}`,
              }))}
              placeholder="Selecione a regra fiscal..."
              className="h-11"
            />
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>
                NCM{" "}
                <span className="text-xs text-muted-foreground">
                  (Obrigatório na NF-e)
                </span>
              </Label>
              <Input
                value={data.ncm || ""}
                onChange={(e) => updateData({ ncm: e.target.value })}
                placeholder="0000.00.00"
                className="font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label>
                CEST{" "}
                <span className="text-xs text-muted-foreground">
                  (Subst. Tributária)
                </span>
              </Label>
              <Input
                value={data.cest || ""}
                onChange={(e) => updateData({ cest: e.target.value })}
                placeholder="00.000.00"
                className="font-mono"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Origem da Mercadoria</Label>
            <Select
              value={String(data.origem ?? "")}
              onValueChange={(v) => updateData({ origem: parseInt(v) })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a origem..." />
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
    </div>
  );
}
