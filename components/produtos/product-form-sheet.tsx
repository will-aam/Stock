"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils"; // Importante para o Combobox
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Save,
  Loader2,
  Package,
  Barcode,
  Scale,
  Truck,
  Layers,
  Image as ImageIcon,
  Plus,
  Trash2,
  MapPin,
  DollarSign,
  Check,
  ChevronsUpDown,
  Copy,
  History,
  Clock,
  User,
  Search,
} from "lucide-react";

import {
  Produto,
  PrecificacaoPorLoja,
  EstoquePorLoja,
} from "@/lib/mock/produtos/index";
import { gruposTributarios } from "@/lib/mock/produtos/grupos-tributarios";
import { categorias, subcategorias } from "@/lib/mock/produtos/categorias";
import { marcas } from "@/lib/mock/produtos/marcas";
import { unidades } from "@/lib/mock/produtos/unidades";
import { empresas } from "@/lib/mock/empresas";

// --- COMPONENTE REUTILIZÁVEL DE SELECT COM BUSCA (COMBOBOX) ---
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
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
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

// --- INTERFACE E CONSTANTES ---
interface ProductFormSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Produto | null;
  onSave: (data: Partial<Produto>) => void;
}

const emptyProduct: Partial<Produto> = {
  ativo: true,
  controlaEstoque: true,
  nome: "",
  codigoInterno: "",
  codigoBarras: "",
  codigosBarrasAdicionais: [],
  tipoItem: "00",
  unidade: "UN",
  casasDecimais: 0,
  imagens: [],
  tipo: "simples",
  tipoControle: "unitario",
  pesoBruto: 0,
  pesoLiquido: 0,
  catalogo: { publicar: false, destaque: false, ordem: 99 },
  fornecedores: [],
  estoque: [],
  precos: [],
};

// Mock de histórico
const mockHistorico = [
  {
    data: "25/01/2026 14:30",
    usuario: "Will Santos",
    acao: "Alterou preço de venda (Matriz)",
    detalhe: "R$ 10,00 -> R$ 12,00",
  },
  {
    data: "20/01/2026 09:15",
    usuario: "Ana Paula",
    acao: "Alterou Grupo Tributário",
    detalhe: "001 -> 002",
  },
  {
    data: "15/01/2026 10:00",
    usuario: "Sistema",
    acao: "Criação do Produto",
    detalhe: "Importação XML",
  },
];

export function ProductFormSheet({
  open,
  onOpenChange,
  initialData,
  onSave,
}: ProductFormSheetProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("principal");
  const [formData, setFormData] = useState<Partial<Produto>>(emptyProduct);

  const [tempBarcode, setTempBarcode] = useState("");
  const [tempImageUrl, setTempImageUrl] = useState("");

  const isEditing = !!initialData;

  useEffect(() => {
    if (open) {
      if (initialData) {
        setFormData(JSON.parse(JSON.stringify(initialData)));
      } else {
        setFormData(JSON.parse(JSON.stringify(emptyProduct)));
      }
      setActiveTab("principal");
    }
  }, [open, initialData]);

  const handleSave = () => {
    if (!formData.nome || !formData.codigoBarras) {
      alert("Por favor, preencha Nome e Código de Barras Principal.");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      onSave(formData);
      setIsLoading(false);
      onOpenChange(false);
    }, 800);
  };

  const updateField = (field: keyof Produto, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // --- LÓGICA DE CATEGORIA INTELIGENTE ---
  const handleSubcategoriaChange = (subId: string) => {
    const sub = subcategorias.find((s) => s.id === subId);
    if (sub) {
      setFormData((prev) => ({
        ...prev,
        subcategoriaId: subId,
        categoriaId: sub.categoriaId,
      }));
    }
  };

  // --- LÓGICA DE LOJAS (PREÇO E ESTOQUE) ---
  const updateLojaPreco = (empresaId: string, valor: number) => {
    setFormData((prev) => {
      const newPrecos = [...(prev.precos || [])];
      const index = newPrecos.findIndex((p) => p.empresaId === empresaId);

      if (index >= 0) {
        const tabelas = [...newPrecos[index].tabelas];
        const tabIndex = tabelas.findIndex((t) => t.id === "tab-1");
        if (tabIndex >= 0) {
          tabelas[tabIndex] = { ...tabelas[tabIndex], valor };
        } else {
          tabelas.push({ id: "tab-1", nome: "Varejo", valor });
        }
        newPrecos[index] = { ...newPrecos[index], tabelas };
      } else {
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
      return { ...prev, precos: newPrecos };
    });
  };

  const updateLojaEstoque = (
    empresaId: string,
    field: keyof EstoquePorLoja,
    value: number,
  ) => {
    setFormData((prev) => {
      const newEstoque = [...(prev.estoque || [])];
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
      return { ...prev, estoque: newEstoque };
    });
  };

  // --- LÓGICA DE REPLICAÇÃO DE PREÇO ---
  const replicatePriceToAll = (sourceEmpresaId: string) => {
    const sourcePreco = formData.precos
      ?.find((p) => p.empresaId === sourceEmpresaId)
      ?.tabelas.find((t) => t.id === "tab-1")?.valor;

    if (!sourcePreco) return;

    setFormData((prev) => {
      const newPrecos = [...(prev.precos || [])];
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
      return { ...prev, precos: newPrecos };
    });
  };

  // --- LÓGICA DE ARRAYS SIMPLES ---
  const addBarcode = () => {
    if (!tempBarcode) return;
    setFormData((prev) => ({
      ...prev,
      codigosBarrasAdicionais: [
        ...(prev.codigosBarrasAdicionais || []),
        tempBarcode,
      ],
    }));
    setTempBarcode("");
  };

  const removeBarcode = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      codigosBarrasAdicionais: prev.codigosBarrasAdicionais?.filter(
        (_, i) => i !== index,
      ),
    }));
  };

  const addImage = () => {
    if (!tempImageUrl) return;
    setFormData((prev) => ({
      ...prev,
      imagens: [...(prev.imagens || []), tempImageUrl],
    }));
    setTempImageUrl("");
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      imagens: prev.imagens?.filter((_, i) => i !== index),
    }));
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        className="w-full sm:max-w-[850px] p-0 flex flex-col bg-background border-l shadow-2xl h-full"
        side="right"
      >
        {/* HEADER - *** REVERTIDO *** - Switch de ativo/inativo volta para o header */}
        <SheetHeader className="p-5 border-b shrink-0 bg-muted/5">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <SheetTitle className="text-xl font-bold flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                {isEditing
                  ? `Editar: ${initialData?.nome}`
                  : "Novo Produto Global"}
              </SheetTitle>
              <SheetDescription className="text-xs">
                Gerencie as informações mestras, fiscais e logística do item.
              </SheetDescription>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground">
                Status:
              </span>
              <Switch
                checked={formData.ativo}
                onCheckedChange={(v) => updateField("ativo", v)}
              />
              <Badge
                variant={formData.ativo ? "default" : "destructive"}
                className="text-[10px] w-14 justify-center"
              >
                {formData.ativo ? "ATIVO" : "INATIVO"}
              </Badge>
            </div>
          </div>
        </SheetHeader>

        {/* CONTEÚDO */}
        <div className="flex-1 overflow-hidden flex flex-col ">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="flex-1 flex flex-col h-full"
          >
            {/* Abas Fixas */}
            <div className="px-5 pt-1 z-10">
              <TabsList className="grid w-full grid-cols-6 h-10 mb-2">
                <TabsTrigger value="principal">Principal</TabsTrigger>
                <TabsTrigger value="fiscal">Fiscal</TabsTrigger>
                <TabsTrigger value="lojas">Lojas</TabsTrigger>
                <TabsTrigger value="logistica">Logística</TabsTrigger>
                <TabsTrigger value="extras">Extras</TabsTrigger>
                <TabsTrigger value="historico">Histórico</TabsTrigger>
              </TabsList>
            </div>

            {/* Área de Scroll */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {/* --- ABA PRINCIPAL --- */}
              <TabsContent value="principal" className="space-y-6 mt-0 h-auto">
                <div className="grid gap-5">
                  <div className="grid gap-2">
                    <Label className="text-foreground">Nome do Produto *</Label>
                    <Input
                      value={formData.nome || ""}
                      onChange={(e) => updateField("nome", e.target.value)}
                      placeholder="Ex: Coca-Cola Original 2L"
                      className="font-medium text-base h-11"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label>Código de Barras *</Label>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Barcode className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            value={formData.codigoBarras || ""}
                            onChange={(e) =>
                              updateField("codigoBarras", e.target.value)
                            }
                            placeholder="789..."
                            className="pl-9 font-mono"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          title="Puxar dados via API (Em breve)"
                        >
                          <Search className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Referência</Label>
                      <Input
                        value={formData.referencia || ""}
                        onChange={(e) =>
                          updateField("referencia", e.target.value)
                        }
                        placeholder="REF-1234"
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="col-span-2 md:col-span-2 space-y-2">
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
                    </div>
                    <div className="col-span-2 md:col-span-2 space-y-2">
                      <Label>Categoria / Departamento</Label>
                      <SearchableSelect
                        value={formData.categoriaId || ""}
                        onChange={(v) => updateField("categoriaId", v)}
                        options={categorias.map((cat) => ({
                          value: cat.id,
                          label: cat.nome,
                        }))}
                        placeholder="Selecione categoria..."
                      />
                    </div>
                    <div className="col-span-2 md:col-span-2 space-y-2">
                      <Label>Marca</Label>
                      <SearchableSelect
                        value={formData.marcaId || ""}
                        onChange={(v) => updateField("marcaId", v)}
                        options={marcas.map((m) => ({
                          value: m.id,
                          label: m.nome,
                        }))}
                        placeholder="Selecione marca..."
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Unidade de Medida</Label>
                      <SearchableSelect
                        value={formData.unidade || ""}
                        onChange={(v) => updateField("unidade", v)}
                        options={unidades.map((u) => ({
                          value: u.sigla,
                          label: `${u.sigla} - ${u.descricao}`,
                        }))}
                        placeholder="Selecione unidade..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Tipo do Item (SPED)</Label>
                      <Select
                        value={formData.tipoItem}
                        onValueChange={(v) => updateField("tipoItem", v)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="00">
                            00 - Mercadoria Revenda
                          </SelectItem>
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
                      onChange={(e) =>
                        updateField("descricaoAuxiliar", e.target.value)
                      }
                      placeholder="Detalhes técnicos, cor, sabor..."
                      className="resize-none h-20"
                    />
                  </div>
                </div>
              </TabsContent>

              {/* --- ABA FISCAL --- */}
              <TabsContent value="fiscal" className="space-y-6 mt-0 h-auto">
                <div className="bg-blue-50/50 dark:bg-blue-900/10 p-4 rounded-lg border border-blue-100 dark:border-blue-900 flex gap-3">
                  <Layers className="h-5 w-5 text-blue-600 mt-1 shrink-0" />
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-200">
                      Grupo Tributário Inteligente
                    </h4>
                    <p className="text-xs text-blue-700 dark:text-blue-300">
                      Ao selecionar um grupo, o sistema aplica automaticamente
                      as regras de ICMS, PIS e COFINS.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-primary font-semibold">
                      Grupo Tributário *
                    </Label>
                    <SearchableSelect
                      value={formData.grupoTributarioId || ""}
                      onChange={(v) => updateField("grupoTributarioId", v)}
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label>NCM (Nomenclatura Comum) *</Label>
                      <Input
                        value={formData.ncm || ""}
                        onChange={(e) => updateField("ncm", e.target.value)}
                        placeholder="0000.00.00"
                        className="font-mono"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>CEST (Substituição Tributária)</Label>
                      <Input
                        value={formData.cest || ""}
                        onChange={(e) => updateField("cest", e.target.value)}
                        placeholder="00.000.00"
                        className="font-mono"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Origem da Mercadoria</Label>
                    <Select
                      value={String(formData.origem)}
                      onValueChange={(v) => updateField("origem", parseInt(v))}
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
              </TabsContent>

              {/* --- ABA LOJAS --- */}
              <TabsContent value="lojas" className="space-y-6 mt-0 h-auto">
                <div className="space-y-4">
                  {empresas.map((empresa) => {
                    const dadosPreco = formData.precos?.find(
                      (p) => p.empresaId === empresa.id,
                    );
                    const dadosEstoque = formData.estoque?.find(
                      (e) => e.empresaId === empresa.id,
                    );
                    const precoVarejo =
                      dadosPreco?.tabelas?.find((t) => t.id === "tab-1")
                        ?.valor || 0;
                    const estoqueAtual = dadosEstoque?.atual || 0;
                    const valorEmEstoque = precoVarejo * estoqueAtual;

                    return (
                      <div
                        key={empresa.id}
                        className="border rounded-lg p-4 bg-background shadow-sm"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
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
                                  updateLojaPreco(
                                    empresa.id,
                                    parseFloat(e.target.value),
                                  )
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
                              disabled
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
              </TabsContent>

              {/* --- ABA LOGÍSTICA --- */}
              <TabsContent value="logistica" className="space-y-6 mt-0 h-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-muted/30 p-4 rounded-lg border space-y-4">
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
                            updateField("pesoBruto", parseFloat(e.target.value))
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
                            updateField(
                              "pesoLiquido",
                              parseFloat(e.target.value),
                            )
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted/30 p-4 rounded-lg border space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Truck className="h-4 w-4 text-muted-foreground" />
                      <h4 className="font-medium text-sm">Controle WMS</h4>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs">Controlar Estoque?</Label>
                        <Switch
                          checked={formData.controlaEstoque}
                          onCheckedChange={(v) =>
                            updateField("controlaEstoque", v)
                          }
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs">Tipo de Controle</Label>
                        <Select
                          value={formData.tipoControle}
                          onValueChange={(v) => updateField("tipoControle", v)}
                        >
                          <SelectTrigger className="h-9 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="unitario">
                              Unitário (Padrão)
                            </SelectItem>
                            <SelectItem value="lote">
                              Controle de Lote/Validade
                            </SelectItem>
                            <SelectItem value="serie">
                              Número de Série (IMEI/Serial)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* --- ABA EXTRAS --- */}
              <TabsContent value="extras" className="space-y-8 mt-0 h-auto">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2">
                      <ImageIcon className="h-4 w-4" /> Galeria de Imagens
                    </Label>
                    <div className="flex gap-2 w-full max-w-sm">
                      <Input
                        value={tempImageUrl}
                        onChange={(e) => setTempImageUrl(e.target.value)}
                        placeholder="Cole a URL da imagem..."
                        className="h-8 text-xs"
                      />
                      <Button
                        onClick={addImage}
                        size="sm"
                        variant="secondary"
                        className="h-8"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-3">
                    {formData.imagens?.map((url, idx) => (
                      <div
                        key={idx}
                        className="relative group aspect-square rounded-md border bg-background overflow-hidden"
                      >
                        <img
                          src={url}
                          alt={`Img ${idx}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={() => removeImage(idx)}
                          className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                    {(!formData.imagens || formData.imagens.length === 0) && (
                      <div className="col-span-4 py-8 text-center text-xs text-muted-foreground border border-dashed rounded-md">
                        Nenhuma imagem adicionada.
                      </div>
                    )}
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2">
                      <Barcode className="h-4 w-4" /> Códigos de Barras
                      Vinculados
                    </Label>
                    <div className="flex gap-2 w-full max-w-xs">
                      <Input
                        value={tempBarcode}
                        onChange={(e) => setTempBarcode(e.target.value)}
                        placeholder="Novo EAN..."
                        className="h-8 text-xs font-mono"
                      />
                      <Button
                        onClick={addBarcode}
                        size="sm"
                        variant="secondary"
                        className="h-8"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {formData.codigosBarrasAdicionais?.map((code, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2 bg-muted/20 rounded border text-sm font-mono"
                      >
                        {code}
                        <Button
                          onClick={() => removeBarcode(idx)}
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                    {(!formData.codigosBarrasAdicionais ||
                      formData.codigosBarrasAdicionais.length === 0) && (
                      <div className="py-4 text-center text-xs text-muted-foreground border border-dashed rounded-md">
                        Nenhum código extra vinculado.
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              {/* --- ABA HISTÓRICO --- */}
              <TabsContent value="historico" className="space-y-6 mt-0 h-auto">
                {isEditing ? (
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold flex items-center gap-2">
                      <History className="h-4 w-4" />
                      Log de Alterações
                    </h3>
                    <div className="relative border-l-2 border-muted ml-2 space-y-6 pl-6 py-2">
                      {mockHistorico.map((log, idx) => (
                        <div key={idx} className="relative">
                          <span className="absolute -left-[31px] top-1 h-3 w-3 rounded-full bg-muted-foreground/30 border-2 border-background" />
                          <div className="flex flex-col gap-1">
                            <span className="text-xs font-semibold text-foreground">
                              {log.acao}
                            </span>
                            <span className="text-xs text-muted-foreground italic">
                              {log.detalhe}
                            </span>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="text-[10px] flex items-center gap-1 text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                                <Clock className="h-3 w-3" /> {log.data}
                              </span>
                              <span className="text-[10px] flex items-center gap-1 text-muted-foreground">
                                <User className="h-3 w-3" /> {log.usuario}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <History className="h-12 w-12 text-muted-foreground/30 mb-4" />
                    <h3 className="text-lg font-semibold text-muted-foreground mb-1">
                      Sem Histórico Ainda
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-sm">
                      O histórico de alterações será exibido aqui após você
                      salvar o produto pela primeira vez.
                    </p>
                  </div>
                )}
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* FOOTER */}
        <SheetFooter className="p-5 border-t bg-background shrink-0 flex flex-row justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Salvar Produto
              </>
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
