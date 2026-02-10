"use client";

import { useState } from "react";
import { useWizardStore } from "../use-wizard-store";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Barcode, ChevronsUpDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

// Mocks
import { unidades } from "@/lib/mock/produtos/unidades";
import { categorias, subcategorias } from "@/lib/mock/produtos/categorias";
import { marcas } from "@/lib/mock/produtos/marcas";

// Componentes UI do Shadcn necessários para o Select pesquisável
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

// --- COMPONENTE INTERNO DE SELECT PESQUISÁVEL ---
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
      <PopoverContent className="w-[300px] p-0" align="start">
        <Command>
          <CommandInput
            placeholder={`Buscar ${placeholder.toLowerCase()}...`}
          />
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

// --- COMPONENTE DA ETAPA ---
export function StepBasicData() {
  const { data, updateData } = useWizardStore();

  const handleSubcategoriaChange = (subId: string) => {
    const sub = subcategorias.find((s) => s.id === subId);
    if (sub) {
      updateData({
        subcategoriaId: subId,
        categoriaId: sub.categoriaId, // Preenche categoria pai automaticamente
      });
    }
  };

  return (
    <div className="space-y-6 py-4 animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="text-center space-y-2 mb-6">
        <h2 className="text-2xl font-bold tracking-tight">
          Informações Básicas
        </h2>
        <p className="text-muted-foreground text-sm">
          Identifique o produto para que ele seja encontrado no sistema.
        </p>
      </div>

      <div className="grid gap-5 max-w-xl mx-auto">
        {/* Nome */}
        <div className="space-y-2">
          <Label className="text-foreground">
            Nome do Produto <span className="text-red-500">*</span>
          </Label>
          <Input
            value={data.nome || ""}
            onChange={(e) => updateData({ nome: e.target.value })}
            placeholder="Ex: Coca-Cola Original 2L"
            className="font-medium text-base h-11"
            autoFocus
          />
        </div>

        {/* Códigos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Código de Barras (EAN)</Label>
            <div className="relative">
              <Barcode className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={data.codigoBarras || ""}
                onChange={(e) => updateData({ codigoBarras: e.target.value })}
                placeholder="Escaneie ou digite..."
                className="pl-9 font-mono"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Código Interno (Opcional)</Label>
            <Input
              value={data.codigoInterno || ""}
              onChange={(e) => updateData({ codigoInterno: e.target.value })}
              placeholder="Ex: SKU-123"
              className="font-mono"
            />
          </div>
        </div>

        <Separator />

        {/* Unidade e Marca */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>
              Unidade <span className="text-red-500">*</span>
            </Label>
            <SearchableSelect
              value={data.unidade || "UN"}
              onChange={(v) => updateData({ unidade: v })}
              options={unidades.map((u) => ({
                value: u.sigla,
                label: `${u.sigla} - ${u.descricao}`,
              }))}
              placeholder="UN..."
            />
          </div>
          <div className="space-y-2">
            <Label>Marca</Label>
            <SearchableSelect
              value={data.marcaId || ""}
              onChange={(v) => updateData({ marcaId: v })}
              options={marcas.map((m) => ({ value: m.id, label: m.nome }))}
              placeholder="Selecionar marca..."
            />
          </div>
        </div>

        {/* Categorização Inteligente */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Subcategoria</Label>
            <SearchableSelect
              value={data.subcategoriaId || ""}
              onChange={handleSubcategoriaChange}
              options={subcategorias.map((sub) => ({
                value: sub.id,
                label: sub.nome,
              }))}
              placeholder="Ex: Mouse, Papel A4..."
            />
            <p className="text-[10px] text-muted-foreground">
              Define a categoria automaticamente
            </p>
          </div>

          <div className="space-y-2">
            <Label>Categoria Principal</Label>
            <SearchableSelect
              value={data.categoriaId || ""}
              onChange={(v) => updateData({ categoriaId: v })}
              options={categorias.map((cat) => ({
                value: cat.id,
                label: cat.nome,
              }))}
              placeholder="Selecionar categoria..."
              className={data.subcategoriaId ? "bg-muted/50" : ""}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
