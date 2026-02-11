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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Save, Loader2, Package } from "lucide-react";

import { Produto } from "@/lib/mock/produtos/index";

// --- IMPORTAÇÃO DOS COMPONENTES REFATORADOS ---
import { TabMain } from "./forms/tab-main";
import { TabFiscal } from "./forms/tab-fiscal";
import { TabLojas } from "./forms/tab-lojas";
import { TabLogistics } from "./forms/tab-logistics";
import { TabExtras } from "./forms/tab-extras";
import { TabHistorico } from "./forms/tab-historico";

interface ProductFormSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Produto | null;
  onSave: (data: Partial<Produto>) => void;
}

// Objeto vazio inicial (Atualizado com novos campos)
const emptyProduct: any = {
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

  // Novos campos padrão
  controlaLote: false,
  controlaValidade: false,
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

  // Estado do formulário
  const [formData, setFormData] = useState<Partial<Produto>>(emptyProduct);

  const isEditing = !!initialData;

  // Carregar dados ao abrir
  useEffect(() => {
    if (open) {
      if (initialData) {
        // Deep copy simples para evitar mutação direta da prop
        setFormData(JSON.parse(JSON.stringify(initialData)));
      } else {
        setFormData(JSON.parse(JSON.stringify(emptyProduct)));
      }
      setActiveTab("principal");
    }
  }, [open, initialData]);

  // Função centralizada de atualização de campos
  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!formData.nome || !formData.codigoBarras) {
      alert("Por favor, preencha Nome e Código de Barras Principal.");
      return;
    }
    setIsLoading(true);

    // Simula delay de rede
    setTimeout(() => {
      onSave(formData);
      setIsLoading(false);
      onOpenChange(false);
    }, 800);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        className="w-full sm:max-w-[850px] p-0 flex flex-col bg-background border-l shadow-2xl h-full"
        side="right"
      >
        {/* --- HEADER --- */}
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
          </div>
        </SheetHeader>

        {/* --- CONTEÚDO (TABS) --- */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="flex-1 flex flex-col h-full"
          >
            {/* Barra de Abas */}
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

            {/* Área de Conteúdo com Scroll */}
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50 dark:bg-slate-950/20 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              <TabsContent value="principal" className="mt-0 h-auto">
                <TabMain formData={formData} onChange={updateField} />
              </TabsContent>

              <TabsContent value="fiscal" className="mt-0 h-auto">
                <TabFiscal formData={formData} onChange={updateField} />
              </TabsContent>

              <TabsContent value="lojas" className="mt-0 h-auto">
                <TabLojas formData={formData} onChange={updateField} />
              </TabsContent>

              <TabsContent value="logistica" className="mt-0 h-auto">
                <TabLogistics formData={formData} onChange={updateField} />
              </TabsContent>

              <TabsContent value="extras" className="mt-0 h-auto">
                <TabExtras formData={formData} onChange={updateField} />
              </TabsContent>

              <TabsContent value="historico" className="mt-0 h-auto">
                <TabHistorico isEditing={isEditing} />
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* --- FOOTER --- */}
        <SheetFooter className="p-5 border-t bg-background shrink-0 flex flex-row justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isLoading} className="w-40">
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
