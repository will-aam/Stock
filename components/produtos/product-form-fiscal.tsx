"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// import { Textarea } from '@/components/ui/textarea'; // Se precisar, descomente e garanta que existe
import { Switch } from "@/components/ui/switch";
import {
  ProdutoFiscal,
  TipoItemFiscal,
  CodigoBarras,
  Fornecedor,
} from "@/types/produto-fiscal";
import { Save, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProductFormProps {
  product?: ProdutoFiscal | null;
  onSave: (product: ProdutoFiscal) => void;
  onCancel: () => void;
}

type TabType = "principal" | "fiscal" | "codigosBarras" | "fornecedores";

export function ProductFormFiscal({
  product,
  onSave,
  onCancel,
}: ProductFormProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<TabType>("principal");

  const [formData, setFormData] = useState<Partial<ProdutoFiscal>>({
    nome: "",
    grupo: "",
    marca: "",
    codigoBarras: "",
    unidadeMedidaComercial: "UN",
    unidadeTributavel: "UN",
    fatorConversao: 1,
    tipoItem: "mercadoria_revenda",
    ncm: "",
    cest: "",
    origemMercadoria: "0",
    // ... inicialização dos campos fiscais
    icmsCstEntrada: "",
    icmsCstSaida: "",
    icmsAliquota: 0,
    icmsST: false,
    codigosBarrasVinculados: [],
    fornecedores: [],
  });

  useEffect(() => {
    if (product) {
      setFormData(product);
    }
  }, [product]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nome || !formData.codigoBarras || !formData.ncm) {
      toast({
        title: "Dados incompletos",
        description: "Nome, EAN e NCM são obrigatórios.",
        variant: "destructive",
      });
      return;
    }
    // Lógica de salvamento simulada
    onSave(formData as ProdutoFiscal);
  };

  // Funções auxiliares (Adicionar EAN, Fornecedor, etc)
  const addCodigoBarras = () => {
    const novo: CodigoBarras = {
      id: crypto.randomUUID(),
      codigo: "",
      adicionadoEm: new Date().toISOString(),
    };
    setFormData((prev) => ({
      ...prev,
      codigosBarrasVinculados: [...(prev.codigosBarrasVinculados || []), novo],
    }));
  };

  const tipoItemLabels: Record<TipoItemFiscal, string> = {
    mercadoria_revenda: "Mercadoria para Revenda",
    materia_prima: "Matéria Prima",
    embalagem: "Embalagem",
    uso_consumo_essencial: "Uso e Consumo Essencial",
    uso_consumo_suplementar: "Uso e Consumo Suplementar",
    outros: "Outros",
  };

  const tabs = [
    { id: "principal" as TabType, label: "Principal" },
    { id: "fiscal" as TabType, label: "Fiscal" },
    { id: "codigosBarras" as TabType, label: "Múltiplos EANs" },
    { id: "fornecedores" as TabType, label: "Fornecedores" },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="p-6">
        {/* Navegação por Abas */}
        <div className="border-b mb-6 overflow-x-auto">
          <div className="flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Conteúdo da Aba Principal */}
        {activeTab === "principal" && (
          <div className="space-y-4">
            <div>
              <Label>Nome do Produto *</Label>
              <Input
                value={formData.nome}
                onChange={(e) =>
                  setFormData({ ...formData, nome: e.target.value })
                }
                required
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Código de Barras (Principal) *</Label>
                <Input
                  value={formData.codigoBarras}
                  onChange={(e) =>
                    setFormData({ ...formData, codigoBarras: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Marca</Label>
                <Input
                  value={formData.marca}
                  onChange={(e) =>
                    setFormData({ ...formData, marca: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
        )}

        {/* Conteúdo da Aba Fiscal */}
        {activeTab === "fiscal" && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label>NCM *</Label>
                <Input
                  value={formData.ncm}
                  onChange={(e) =>
                    setFormData({ ...formData, ncm: e.target.value })
                  }
                  maxLength={8}
                />
              </div>
              <div>
                <Label>CEST</Label>
                <Input
                  value={formData.cest}
                  onChange={(e) =>
                    setFormData({ ...formData, cest: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Origem</Label>
                <select
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                  value={formData.origemMercadoria}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      origemMercadoria: e.target.value,
                    })
                  }
                >
                  <option value="0">0 - Nacional</option>
                  <option value="1">1 - Estrangeira (Imp. Direta)</option>
                  <option value="2">2 - Estrangeira (Merc. Interno)</option>
                </select>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h4 className="font-medium mb-3">Tributação (ICMS)</h4>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label>CST Entrada</Label>
                  <Input
                    value={formData.icmsCstEntrada}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        icmsCstEntrada: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label>CST Saída</Label>
                  <Input
                    value={formData.icmsCstSaida}
                    onChange={(e) =>
                      setFormData({ ...formData, icmsCstSaida: e.target.value })
                    }
                  />
                </div>
                <div className="flex items-center gap-2 mt-6">
                  <Switch
                    checked={formData.icmsST}
                    onCheckedChange={(c) =>
                      setFormData({ ...formData, icmsST: c })
                    }
                  />
                  <Label>Sujeito a ST</Label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Aba Múltiplos EANs */}
        {activeTab === "codigosBarras" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Códigos Adicionais (Caixa, Fardo, etc)</Label>
              <Button type="button" size="sm" onClick={addCodigoBarras}>
                <Plus className="w-4 h-4 mr-2" /> Adicionar
              </Button>
            </div>
            {formData.codigosBarrasVinculados?.map((cb, idx) => (
              <div key={cb.id} className="flex gap-2">
                <Input
                  placeholder="Código EAN"
                  value={cb.codigo}
                  onChange={(e) => {
                    const list = [...(formData.codigosBarrasVinculados || [])];
                    list[idx].codigo = e.target.value;
                    setFormData({ ...formData, codigosBarrasVinculados: list });
                  }}
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => {
                    const list = formData.codigosBarrasVinculados?.filter(
                      (item) => item.id !== cb.id
                    );
                    setFormData({ ...formData, codigosBarrasVinculados: list });
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Aba Fornecedores */}
        {activeTab === "fornecedores" && (
          <div className="text-center py-8 text-muted-foreground">
            <p>Implementação similar à de Códigos de Barras.</p>
            <p>
              Permite vincular múltiplos fornecedores e seus códigos internos.
            </p>
          </div>
        )}
      </Card>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel} type="button">
          Cancelar
        </Button>
        <Button type="submit">
          <Save className="w-4 h-4 mr-2" /> Salvar Produto
        </Button>
      </div>
    </form>
  );
}
