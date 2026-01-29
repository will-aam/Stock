"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Barcode, Search, Store } from "lucide-react";
import { SearchableSelect } from "@/components/ui/searchable-select";

// Mocks e Tipos
import { Produto } from "@/lib/mock/produtos/index";
import { categorias, subcategorias } from "@/lib/mock/produtos/categorias";
import { marcas } from "@/lib/mock/produtos/marcas";
import { unidades } from "@/lib/mock/produtos/unidades";

interface TabMainProps {
  formData: Partial<Produto>;
  onChange: (field: string, value: any) => void;
}

export function TabMain({ formData, onChange }: TabMainProps) {
  // Lógica de atualização em cadeia (Subcategoria -> Categoria)
  const handleSubcategoriaChange = (subId: string) => {
    const sub = subcategorias.find((s) => s.id === subId);
    if (sub) {
      // Atualiza a subcategoria
      onChange("subcategoriaId", subId);
      // E força a atualização da categoria pai
      onChange("categoriaId", sub.categoriaId);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-5">
        {/* Nome */}
        <div className="grid gap-2">
          <Label className="text-foreground">Nome do Produto *</Label>
          <Input
            value={formData.nome || ""}
            onChange={(e) => onChange("nome", e.target.value)}
            placeholder="Ex: Coca-Cola Original 2L"
            className="font-medium text-base h-11"
          />
        </div>

        {/* Códigos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label>Código de Barras *</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Barcode className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={formData.codigoBarras || ""}
                  onChange={(e) => onChange("codigoBarras", e.target.value)}
                  placeholder="789..."
                  className="pl-9 font-mono"
                />
              </div>
              <Button
                type="button"
                variant="outline"
                size="icon"
                title="Gerar ou Buscar (Em breve)"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Referência</Label>
            <Input
              value={formData.referencia || ""}
              onChange={(e) => onChange("referencia", e.target.value)}
              placeholder="REF-1234"
            />
          </div>
        </div>

        {/* Novo Campo: Aparece no Cupom */}
        <div className="bg-muted/20 p-3 rounded-lg border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-full text-primary">
              <Store className="h-4 w-4" />
            </div>
            <div className="space-y-0.5">
              <Label className="text-sm font-medium">
                Disponível no PDV / Cupom
              </Label>
              <p className="text-[10px] text-muted-foreground">
                Se desmarcado, o produto fica oculto na tela de vendas.
              </p>
            </div>
          </div>
          <Switch
            checked={formData.catalogo?.publicar}
            onCheckedChange={(v) =>
              onChange("catalogo", { ...formData.catalogo, publicar: v })
            }
          />
        </div>

        <Separator />

        {/* Categorização */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Subcategoria</Label>
            <SearchableSelect
              value={formData.subcategoriaId || ""}
              onChange={handleSubcategoriaChange}
              options={subcategorias.map((sub) => ({
                value: sub.id,
                label: sub.nome,
              }))}
              placeholder="Selecione subcategoria..."
            />
            <p className="text-[10px] text-muted-foreground">
              Preenche a categoria automaticamente.
            </p>
          </div>
          <div className="space-y-2">
            <Label>Categoria / Departamento</Label>
            <SearchableSelect
              value={formData.categoriaId || ""}
              onChange={(v) => onChange("categoriaId", v)}
              options={categorias.map((cat) => ({
                value: cat.id,
                label: cat.nome,
              }))}
              placeholder="Selecione categoria..."
            />
          </div>
        </div>

        {/* Marca e Unidade */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="col-span-2 space-y-2">
            <Label>Marca</Label>
            <SearchableSelect
              value={formData.marcaId || ""}
              onChange={(v) => onChange("marcaId", v)}
              options={marcas.map((m) => ({
                value: m.id,
                label: m.nome,
              }))}
              placeholder="Selecione marca..."
            />
          </div>

          <div className="space-y-2">
            <Label>Unidade</Label>
            <SearchableSelect
              value={formData.unidade || ""}
              onChange={(v) => onChange("unidade", v)}
              options={unidades.map((u) => ({
                value: u.sigla,
                label: `${u.sigla} - ${u.descricao}`,
              }))}
              placeholder="UN..."
            />
          </div>

          <div className="space-y-2">
            <Label>Tipo do Item</Label>
            <Select
              value={formData.tipoItem}
              onValueChange={(v) => onChange("tipoItem", v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="00">00 - Mercadoria</SelectItem>
                <SelectItem value="01">01 - Matéria Prima</SelectItem>
                <SelectItem value="09">09 - Serviço</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Descrição Auxiliar (Detalhes)</Label>
          <Textarea
            value={formData.descricaoAuxiliar || ""}
            onChange={(e) => onChange("descricaoAuxiliar", e.target.value)}
            placeholder="Detalhes técnicos, cor, sabor..."
            className="resize-none h-20"
          />
        </div>
      </div>
    </div>
  );
}
