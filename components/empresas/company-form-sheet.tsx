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
import {
  Building2,
  MapPin,
  FileText,
  Settings2,
  Plus,
  Trash2,
  Save,
  Loader2,
  Receipt,
  Users, // Ícone para Setores
} from "lucide-react";
import { Empresa, FiscalSeries } from "@/lib/mock/empresas";
import { setores as mockSetores } from "@/lib/mock/setores"; // Importando mock para simular carga
import { Badge } from "@/components/ui/badge";

interface CompanyFormSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Empresa | null;
  onSave: (data: Partial<Empresa> & { setores?: string[] }) => void; // Atualizado para aceitar setores
}

const emptyEmpresa: Partial<Empresa> = {
  ativa: true,
  principal: false,
  isentoIE: false,
  regimeTributario: "simples",
  endereco: {
    cep: "",
    logradouro: "",
    numero: "",
    bairro: "",
    cidade: "",
    uf: "",
    complemento: "",
  },
  contato: { telefone: "", email: "", site: "" },
  fiscal: { series: [] },
  integracoes: {},
};

export function CompanyFormSheet({
  open,
  onOpenChange,
  initialData,
  onSave,
}: CompanyFormSheetProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Empresa>>(emptyEmpresa);

  // Estado para Séries Fiscais
  const [newSeries, setNewSeries] = useState<Partial<FiscalSeries>>({
    tipo: "NFCe",
    ativo: true,
  });

  // NOVO: Estado para Setores
  const [sectors, setSectors] = useState<string[]>([]);
  const [newSectorName, setNewSectorName] = useState("");

  useEffect(() => {
    if (open) {
      if (initialData) {
        setFormData(JSON.parse(JSON.stringify(initialData)));
        // Simulação: Carregar setores dessa empresa (no real viria do backend junto com a empresa)
        const currentSectors = mockSetores
          .filter((s) => s.empresaId === initialData.id)
          .map((s) => s.nome);
        setSectors(
          currentSectors.length > 0
            ? currentSectors
            : ["Administrativo", "Comercial"],
        );
      } else {
        setFormData(JSON.parse(JSON.stringify(emptyEmpresa)));
        setSectors(["Administrativo", "Financeiro", "Comercial"]); // Sugestão padrão
      }
    }
  }, [open, initialData]);

  const handleSave = () => {
    setIsLoading(true);
    setTimeout(() => {
      // Enviamos os dados da empresa + a lista de setores
      onSave({ ...formData, setores: sectors });
      setIsLoading(false);
      onOpenChange(false);
    }, 1000);
  };

  const updateField = (field: keyof Empresa, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateNested = (
    parent: "endereco" | "contato" | "fiscal",
    field: string,
    value: any,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value,
      },
    }));
  };

  // Lógica Fiscal
  const addSeries = () => {
    if (!newSeries.serie || !newSeries.pdv) return;
    const seriesToAdd: FiscalSeries = {
      id: Math.random().toString(36).substr(2, 9),
      serie: newSeries.serie,
      pdv: newSeries.pdv,
      numInicial: Number(newSeries.numInicial) || 1,
      tipo: newSeries.tipo as "NFe" | "NFCe" | "MDFe",
      ativo: newSeries.ativo || true,
    };
    setFormData((prev) => ({
      ...prev,
      fiscal: {
        ...prev.fiscal!,
        series: [...(prev.fiscal?.series || []), seriesToAdd],
      },
    }));
    setNewSeries({
      tipo: "NFCe",
      ativo: true,
      serie: "",
      pdv: "",
      numInicial: 1,
    });
  };

  const removeSeries = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      fiscal: {
        ...prev.fiscal!,
        series: prev.fiscal?.series.filter((s) => s.id !== id) || [],
      },
    }));
  };

  // Lógica de Setores (NOVA)
  const addSector = () => {
    if (!newSectorName.trim()) return;
    if (sectors.includes(newSectorName.trim())) return; // Evita duplicados

    setSectors((prev) => [...prev, newSectorName.trim()]);
    setNewSectorName("");
  };

  const removeSector = (indexToRemove: number) => {
    setSectors((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        className="w-full sm:max-w-[700px] p-0 flex flex-col bg-background border-l shadow-xl"
        side="right"
      >
        {/* HEADER */}
        <SheetHeader className="p-5 border-b shrink-0 bg-muted/5">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <SheetTitle className="text-lg font-bold flex items-center gap-2">
                {initialData ? (
                  <Settings2 className="h-5 w-5 text-primary" />
                ) : (
                  <Building2 className="h-5 w-5 text-primary" />
                )}
                {initialData ? "Editar Empresa" : "Nova Empresa"}
              </SheetTitle>
              <SheetDescription className="text-xs">
                {initialData
                  ? "Atualize os dados cadastrais da unidade."
                  : "Preencha as informações da nova unidade."}
              </SheetDescription>
            </div>
            {initialData && (
              <Badge
                variant={initialData.ativa ? "default" : "secondary"}
                className="uppercase text-[10px]"
              >
                {initialData.ativa ? "Ativa" : "Inativa"}
              </Badge>
            )}
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-hidden flex flex-col">
          <Tabs defaultValue="geral" className="flex-1 flex flex-col h-full">
            {/* LISTA DE ABAS - 4 Colunas agora */}
            <div className="px-5 py-3 border-b shrink-0 bg-background">
              <TabsList className="grid w-full grid-cols-4 h-9">
                <TabsTrigger value="geral" className="text-xs">
                  Geral
                </TabsTrigger>
                <TabsTrigger value="endereco" className="text-xs">
                  Endereço
                </TabsTrigger>
                <TabsTrigger value="setores" className="text-xs">
                  Setores
                </TabsTrigger>
                <TabsTrigger value="fiscal" className="text-xs">
                  Fiscal
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1 overflow-y-auto min-h-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] p-5">
              {/* ABA GERAL */}
              <TabsContent value="geral" className="space-y-5 mt-0">
                {/* ... (Conteúdo Geral mantido igual) ... */}
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase">
                      Identificação
                    </Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label>Razão Social</Label>
                        <Input
                          value={formData.razaoSocial || ""}
                          onChange={(e) =>
                            updateField("razaoSocial", e.target.value)
                          }
                          placeholder="Razão Social LTDA"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label>Nome Fantasia</Label>
                        <Input
                          value={formData.nomeFantasia || ""}
                          onChange={(e) =>
                            updateField("nomeFantasia", e.target.value)
                          }
                          placeholder="Nome da Loja"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase">
                      Documentação
                    </Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label>CNPJ</Label>
                        <Input
                          value={formData.cnpj || ""}
                          onChange={(e) => updateField("cnpj", e.target.value)}
                          placeholder="00.000.000/0000-00"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label>Regime Tributário</Label>
                        <Select
                          value={formData.regimeTributario}
                          onValueChange={(v) =>
                            updateField("regimeTributario", v)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="simples">
                              Simples Nacional
                            </SelectItem>
                            <SelectItem value="lucro_presumido">
                              Lucro Presumido
                            </SelectItem>
                            <SelectItem value="lucro_real">
                              Lucro Real
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <Label>Inscrição Estadual</Label>
                        <div className="flex gap-2">
                          <Input
                            value={formData.ie || ""}
                            onChange={(e) => updateField("ie", e.target.value)}
                            disabled={formData.isentoIE}
                            className="flex-1"
                          />
                          <div className="flex items-center space-x-2 border rounded px-2 bg-muted/10">
                            <Switch
                              checked={formData.isentoIE}
                              onCheckedChange={(v) =>
                                updateField("isentoIE", v)
                              }
                              id="isento-ie"
                              className="scale-75"
                            />
                            <Label
                              htmlFor="isento-ie"
                              className="text-[10px] text-muted-foreground cursor-pointer whitespace-nowrap"
                            >
                              Isento
                            </Label>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <Label>Centro de Custo</Label>
                        <Input
                          value={formData.centroCusto || ""}
                          onChange={(e) =>
                            updateField("centroCusto", e.target.value)
                          }
                          placeholder="Ex: 1.01.001"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center justify-between bg-muted/20 p-3 rounded-md border">
                    <div className="space-y-0.5">
                      <Label className="text-sm">Empresa Ativa</Label>
                    </div>
                    <Switch
                      checked={formData.ativa}
                      onCheckedChange={(v) => updateField("ativa", v)}
                    />
                  </div>
                  <div className="flex items-center justify-between bg-blue-50/50 dark:bg-blue-950/20 p-3 rounded-md border border-blue-100 dark:border-blue-900">
                    <div className="space-y-0.5">
                      <Label className="text-sm text-blue-900 dark:text-blue-100">
                        Matriz (Principal)
                      </Label>
                    </div>
                    <Switch
                      checked={formData.principal}
                      onCheckedChange={(v) => updateField("principal", v)}
                    />
                  </div>
                </div>
              </TabsContent>

              {/* ABA ENDEREÇO */}
              <TabsContent value="endereco" className="space-y-5 mt-0">
                {/* ... (Conteúdo Endereço mantido igual) ... */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <h3 className="text-sm font-medium">Endereço Comercial</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-1 space-y-1.5">
                      <Label>CEP</Label>
                      <Input
                        value={formData.endereco?.cep || ""}
                        onChange={(e) =>
                          updateNested("endereco", "cep", e.target.value)
                        }
                      />
                    </div>
                    <div className="md:col-span-3 space-y-1.5">
                      <Label>Logradouro</Label>
                      <Input
                        value={formData.endereco?.logradouro || ""}
                        onChange={(e) =>
                          updateNested("endereco", "logradouro", e.target.value)
                        }
                      />
                    </div>
                    <div className="md:col-span-1 space-y-1.5">
                      <Label>Número</Label>
                      <Input
                        value={formData.endereco?.numero || ""}
                        onChange={(e) =>
                          updateNested("endereco", "numero", e.target.value)
                        }
                      />
                    </div>
                    <div className="md:col-span-3 space-y-1.5">
                      <Label>Bairro</Label>
                      <Input
                        value={formData.endereco?.bairro || ""}
                        onChange={(e) =>
                          updateNested("endereco", "bairro", e.target.value)
                        }
                      />
                    </div>
                    <div className="md:col-span-3 space-y-1.5">
                      <Label>Cidade</Label>
                      <Input
                        value={formData.endereco?.cidade || ""}
                        onChange={(e) =>
                          updateNested("endereco", "cidade", e.target.value)
                        }
                      />
                    </div>
                    <div className="md:col-span-1 space-y-1.5">
                      <Label>UF</Label>
                      <Input
                        value={formData.endereco?.uf || ""}
                        onChange={(e) =>
                          updateNested("endereco", "uf", e.target.value)
                        }
                        maxLength={2}
                      />
                    </div>
                    <div className="md:col-span-4 space-y-1.5">
                      <Label>Complemento</Label>
                      <Input
                        value={formData.endereco?.complemento || ""}
                        onChange={(e) =>
                          updateNested(
                            "endereco",
                            "complemento",
                            e.target.value,
                          )
                        }
                        placeholder="Ex: Sala 104, Galpão B"
                      />
                    </div>
                  </div>
                </div>
                <Separator />
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <FileText className="h-4 w-4" />
                    <h3 className="text-sm font-medium">Contatos</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label>Telefone</Label>
                      <Input
                        value={formData.contato?.telefone || ""}
                        onChange={(e) =>
                          updateNested("contato", "telefone", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>E-mail</Label>
                      <Input
                        value={formData.contato?.email || ""}
                        onChange={(e) =>
                          updateNested("contato", "email", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* ABA SETORES (NOVA) */}
              <TabsContent value="setores" className="space-y-5 mt-0">
                <div className="bg-blue-50/50 dark:bg-blue-950/10 p-4 rounded-lg border border-blue-100 dark:border-blue-900 mb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="h-4 w-4 text-blue-700" />
                    <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-200">
                      Departamentos e Setores
                    </h4>
                  </div>
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    Cadastre aqui os setores desta unidade (ex: RH, Financeiro,
                    Estoque). Eles estarão disponíveis ao cadastrar
                    funcionários.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex gap-2 items-end">
                    <div className="space-y-1 flex-1">
                      <Label className="text-xs">Novo Setor</Label>
                      <Input
                        value={newSectorName}
                        onChange={(e) => setNewSectorName(e.target.value)}
                        className="h-9 text-sm"
                        placeholder="Nome do departamento..."
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addSector();
                          }
                        }}
                      />
                    </div>
                    <Button className="h-9" onClick={addSector}>
                      <Plus className="h-4 w-4 mr-2" /> Adicionar
                    </Button>
                  </div>

                  {/* Lista de Setores */}
                  <div className="border rounded-md overflow-hidden">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-muted text-muted-foreground text-[10px] uppercase font-semibold">
                        <tr>
                          <th className="px-4 py-2 w-full">Nome do Setor</th>
                          <th className="px-4 py-2 text-right">Ação</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {sectors.length === 0 && (
                          <tr>
                            <td
                              colSpan={2}
                              className="px-4 py-8 text-center text-muted-foreground text-xs"
                            >
                              Nenhum setor cadastrado. Adicione o primeiro
                              acima.
                            </td>
                          </tr>
                        )}
                        {sectors.map((sector, index) => (
                          <tr
                            key={index}
                            className="bg-card hover:bg-muted/50 transition-colors"
                          >
                            <td className="px-4 py-3 font-medium">{sector}</td>
                            <td className="px-4 py-3 text-right">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                                onClick={() => removeSector(index)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </TabsContent>

              {/* ABA FISCAL */}
              <TabsContent value="fiscal" className="space-y-5 mt-0">
                {/* ... (Conteúdo Fiscal mantido igual) ... */}
                <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Receipt className="h-4 w-4 text-amber-700" />
                    <h4 className="text-sm font-semibold text-amber-800 dark:text-amber-200">
                      Credenciais NFC-e
                    </h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2 space-y-1.5">
                      <Label className="text-amber-900 dark:text-amber-100 text-xs">
                        CSC (Token)
                      </Label>
                      <Input
                        value={formData.fiscal?.csc || ""}
                        onChange={(e) =>
                          updateNested("fiscal", "csc", e.target.value)
                        }
                        className="bg-white dark:bg-black/20 h-8"
                        placeholder="Ex: A1B2C3..."
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-amber-900 dark:text-amber-100 text-xs">
                        ID do CSC
                      </Label>
                      <Input
                        value={formData.fiscal?.cscId || ""}
                        onChange={(e) =>
                          updateNested("fiscal", "cscId", e.target.value)
                        }
                        className="bg-white dark:bg-black/20 h-8"
                        placeholder="Ex: 000001"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-medium">Séries Fiscais</h3>
                  <div className="flex gap-2 items-end bg-muted/30 p-3 rounded-lg border">
                    <div className="space-y-1 w-20">
                      <Label className="text-[10px] uppercase text-muted-foreground">
                        Série
                      </Label>
                      <Input
                        value={newSeries.serie || ""}
                        onChange={(e) =>
                          setNewSeries((p) => ({ ...p, serie: e.target.value }))
                        }
                        className="h-8 text-xs"
                        placeholder="1"
                      />
                    </div>
                    <div className="space-y-1 w-24">
                      <Label className="text-[10px] uppercase text-muted-foreground">
                        PDV
                      </Label>
                      <Input
                        value={newSeries.pdv || ""}
                        onChange={(e) =>
                          setNewSeries((p) => ({ ...p, pdv: e.target.value }))
                        }
                        className="h-8 text-xs"
                        placeholder="01"
                      />
                    </div>
                    <div className="space-y-1 flex-1">
                      <Label className="text-[10px] uppercase text-muted-foreground">
                        Último Num.
                      </Label>
                      <Input
                        type="number"
                        value={newSeries.numInicial || ""}
                        onChange={(e) =>
                          setNewSeries((p) => ({
                            ...p,
                            numInicial: Number(e.target.value),
                          }))
                        }
                        className="h-8 text-xs"
                      />
                    </div>
                    <div className="space-y-1 w-28">
                      <Label className="text-[10px] uppercase text-muted-foreground">
                        Tipo
                      </Label>
                      <Select
                        value={newSeries.tipo}
                        onValueChange={(v) =>
                          setNewSeries((p) => ({ ...p, tipo: v as any }))
                        }
                      >
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="NFCe">NFC-e</SelectItem>
                          <SelectItem value="NFe">NF-e</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      size="sm"
                      className="h-8 w-8 p-0 shrink-0"
                      onClick={addSeries}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="border rounded-md overflow-hidden">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-muted text-muted-foreground text-[10px] uppercase font-semibold">
                        <tr>
                          <th className="px-3 py-2">Série</th>
                          <th className="px-3 py-2">PDV</th>
                          <th className="px-3 py-2">Tipo</th>
                          <th className="px-3 py-2 text-right">Ação</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {formData.fiscal?.series?.length === 0 && (
                          <tr>
                            <td
                              colSpan={4}
                              className="px-3 py-6 text-center text-muted-foreground text-xs"
                            >
                              Nenhuma série cadastrada.
                            </td>
                          </tr>
                        )}
                        {formData.fiscal?.series?.map((s) => (
                          <tr
                            key={s.id}
                            className="bg-card hover:bg-muted/50 transition-colors"
                          >
                            <td className="px-3 py-2 font-medium">{s.serie}</td>
                            <td className="px-3 py-2">{s.pdv}</td>
                            <td className="px-3 py-2">
                              <Badge
                                variant="outline"
                                className="text-[10px] h-5 px-1"
                              >
                                {s.tipo}
                              </Badge>
                            </td>
                            <td className="px-3 py-2 text-right">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-red-500 hover:text-red-700 hover:bg-red-50"
                                onClick={() => removeSeries(s.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
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
                Salvar Empresa
              </>
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
