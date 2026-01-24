"use client";

import { useState, useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
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
  Store,
  MapPin,
  DollarSign,
} from "lucide-react";

import {
  Produto,
  PrecificacaoPorLoja,
  EstoquePorLoja,
} from "@/lib/mock/produtos/index";
import { gruposTributarios } from "@/lib/mock/produtos/grupos-tributarios";
import { categorias } from "@/lib/mock/produtos/categorias";
import { marcas } from "@/lib/mock/produtos/marcas";
import { unidades } from "@/lib/mock/produtos/unidades";
import { empresas } from "@/lib/mock/empresas"; // Importando as empresas

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

  // --- LÓGICA DE LOJAS (PREÇO E ESTOQUE) ---

  // Atualiza o Preço de Venda (Tabela "Varejo") para uma loja específica
  const updateLojaPreco = (empresaId: string, valor: number) => {
    setFormData((prev) => {
      const newPrecos = [...(prev.precos || [])];
      const index = newPrecos.findIndex((p) => p.empresaId === empresaId);

      if (index >= 0) {
        // Atualiza existente
        const tabelas = [...newPrecos[index].tabelas];
        const tabIndex = tabelas.findIndex((t) => t.id === "tab-1"); // Assumindo tab-1 como Varejo padrão

        if (tabIndex >= 0) {
          tabelas[tabIndex] = { ...tabelas[tabIndex], valor };
        } else {
          tabelas.push({ id: "tab-1", nome: "Varejo", valor });
        }
        newPrecos[index] = { ...newPrecos[index], tabelas };
      } else {
        // Cria novo registro de preço para essa loja
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

  // Atualiza campos de estoque (Atual, Mínimo, Máximo)
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
        // Inicializa objeto de estoque se não existir
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
        className="w-full sm:max-w-[800px] p-0 flex flex-col bg-background border-l shadow-2xl h-full"
        side="right"
      >
        {/* HEADER */}
        <SheetHeader className="p-5 border-b shrink-0 bg-muted/5">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <SheetTitle className="text-xl font-bold flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                {initialData ? "Editar Produto" : "Novo Produto Global"}
              </SheetTitle>
              <SheetDescription className="text-xs">
                Gerencie as informações mestras do item.
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
        <div className="flex-1 overflow-hidden flex flex-col bg-slate-50/50 dark:bg-slate-950/20">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="flex-1 flex flex-col h-full"
          >
            {/* Abas Fixas */}
            <div className="px-5 pt-4 bg-background border-b shadow-sm z-10 shrink-0">
              <TabsList className="grid w-full grid-cols-5 h-10 mb-2">
                <TabsTrigger value="principal">Principal</TabsTrigger>
                <TabsTrigger value="fiscal">Fiscal</TabsTrigger>
                <TabsTrigger value="lojas">Lojas</TabsTrigger>
                <TabsTrigger value="logistica">Logística</TabsTrigger>
                <TabsTrigger value="extras">Extras</TabsTrigger>
              </TabsList>
            </div>

            {/* Área de Scroll (Com scroll invisível) */}
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
                      <Label>Código de Barras (EAN Principal) *</Label>
                      <div className="relative">
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
                    </div>
                    <div className="space-y-2">
                      <Label>Referência de Fábrica</Label>
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
                      <Label>Categoria / Departamento</Label>
                      <Select
                        value={formData.categoriaId}
                        onValueChange={(v) => updateField("categoriaId", v)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                        <SelectContent>
                          {categorias.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                              {cat.nome}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="col-span-2 md:col-span-2 space-y-2">
                      <Label>Marca</Label>
                      <Select
                        value={formData.marcaId}
                        onValueChange={(v) => updateField("marcaId", v)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                        <SelectContent>
                          {marcas.map((m) => (
                            <SelectItem key={m.id} value={m.id}>
                              {m.nome}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Unidade de Medida</Label>
                      <Select
                        value={formData.unidade}
                        onValueChange={(v) => updateField("unidade", v)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="UN/KG..." />
                        </SelectTrigger>
                        <SelectContent>
                          {unidades.map((u) => (
                            <SelectItem key={u.sigla} value={u.sigla}>
                              {u.sigla} - {u.descricao}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                    <Select
                      value={formData.grupoTributarioId}
                      onValueChange={(v) => updateField("grupoTributarioId", v)}
                    >
                      <SelectTrigger className="h-11 bg-background border-primary/20">
                        <SelectValue placeholder="Selecione a regra fiscal..." />
                      </SelectTrigger>
                      <SelectContent>
                        {gruposTributarios.map((gt) => (
                          <SelectItem key={gt.id} value={gt.id}>
                            <span className="font-medium">{gt.descricao}</span>
                            <span className="ml-2 text-xs text-muted-foreground">
                              ({gt.codigoInterno})
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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

              {/* --- ABA LOJAS (NOVO) --- */}
              <TabsContent value="lojas" className="space-y-6 mt-0 h-auto">
                <div className="space-y-4">
                  {empresas.map((empresa) => {
                    const dadosPreco = formData.precos?.find(
                      (p) => p.empresaId === empresa.id,
                    );
                    const dadosEstoque = formData.estoque?.find(
                      (e) => e.empresaId === empresa.id,
                    );
                    // Pega o valor da tabela 'tab-1' (Varejo)
                    const precoVarejo =
                      dadosPreco?.tabelas?.find((t) => t.id === "tab-1")
                        ?.valor || 0;

                    return (
                      <div
                        key={empresa.id}
                        className="border rounded-lg p-4 bg-background shadow-sm"
                      >
                        <div className="flex items-center gap-2 mb-4">
                          <MapPin className="h-4 w-4 text-primary" />
                          <h4 className="font-semibold text-sm">
                            {empresa.nomeFantasia}
                          </h4>
                          <Badge
                            variant="outline"
                            className="ml-auto text-[10px]"
                          >
                            {empresa.regimeTributario}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
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
                              className="h-9"
                              value={dadosEstoque?.atual || 0}
                              onChange={(e) =>
                                updateLojaEstoque(
                                  empresa.id,
                                  "atual",
                                  parseFloat(e.target.value),
                                )
                              }
                            />
                          </div>

                          <div className="space-y-1.5">
                            <Label className="text-xs text-muted-foreground">
                              Estoque Mínimo
                            </Label>
                            <Input
                              type="number"
                              className="h-9"
                              value={dadosEstoque?.minimo || 0}
                              onChange={(e) =>
                                updateLojaEstoque(
                                  empresa.id,
                                  "minimo",
                                  parseFloat(e.target.value),
                                )
                              }
                            />
                          </div>

                          <div className="space-y-1.5">
                            <Label className="text-xs text-muted-foreground">
                              Localização
                            </Label>
                            <Input
                              className="h-9"
                              placeholder="Corredor..."
                              // Nota: Aqui simplifiquei, na prática precisaria atualizar o objeto todo se mudar string
                              // Para o MVP visual, deixamos assim ou implementamos updateString depois.
                            />
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
                {/* Imagens */}
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

                {/* Códigos Adicionais */}
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
            </div>
          </Tabs>
        </div>

        {/* FOOTER (Fixo) */}
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
