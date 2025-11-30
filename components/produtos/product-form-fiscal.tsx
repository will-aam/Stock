"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  ProdutoFiscal,
  TipoItemFiscal,
  CodigoBarras,
  Fornecedor,
} from "@/types/produto-fiscal";
import { Save, Plus, Trash2, Globe, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

interface ProductFormProps {
  product?: ProdutoFiscal | null;
  onSave: (product: ProdutoFiscal) => void;
  onCancel: () => void;
}

type TabType = "principal" | "classificacao" | "extras";

export function ProductFormFiscal({
  product,
  onSave,
  onCancel,
}: ProductFormProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<TabType>("principal");

  // Estado limpo: Apenas dados globais (sem alíquotas específicas)
  const [formData, setFormData] = useState<Partial<ProdutoFiscal>>({
    nome: "",
    grupo: "",
    marca: "",
    codigoBarras: "",
    unidadeMedidaComercial: "UN",
    unidadeTributavel: "UN",
    fatorConversao: 1,
    imagemUrl: "",

    // Classificação Fiscal (Dados fixos intrínsecos ao produto)
    tipoItem: "mercadoria_revenda",
    ncm: "",
    cest: "",
    origemMercadoria: "0",

    // Obs: As regras de tributação (CST, Alíquotas, MVA) foram removidas daqui.
    // Elas serão geridas em "Regras Fiscais por Loja" (ProductStoreConfig).

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
        title: "Campos obrigatórios",
        description: "Preencha Nome, Código de Barras e NCM",
        variant: "destructive",
      });
      return;
    }

    const productToSave: ProdutoFiscal = {
      ...(formData as ProdutoFiscal),
      id: product?.id || crypto.randomUUID(),
      criadoEm: product?.criadoEm || new Date().toISOString(),
    };

    onSave(productToSave);

    toast({
      title: product ? "Produto Global Atualizado" : "Produto Global Criado",
      description: `${productToSave.nome} salvo no catálogo mestre.`,
    });
  };

  // Funções auxiliares para Arrays (Barcodes e Fornecedores)
  const addCodigoBarras = () => {
    const newCodigo: CodigoBarras = {
      id: crypto.randomUUID(),
      codigo: "",
      adicionadoEm: new Date().toISOString(),
    };
    setFormData({
      ...formData,
      codigosBarrasVinculados: [
        ...(formData.codigosBarrasVinculados || []),
        newCodigo,
      ],
    });
  };

  const removeCodigoBarras = (id: string) => {
    setFormData({
      ...formData,
      codigosBarrasVinculados: formData.codigosBarrasVinculados?.filter(
        (c) => c.id !== id
      ),
    });
  };

  const updateCodigoBarras = (id: string, codigo: string) => {
    setFormData({
      ...formData,
      codigosBarrasVinculados: formData.codigosBarrasVinculados?.map((c) =>
        c.id === id ? { ...c, codigo } : c
      ),
    });
  };

  const addFornecedor = () => {
    const newFornecedor: Fornecedor = {
      id: crypto.randomUUID(),
      codigoFornecedor: "",
      nomeFornecedor: "",
      unidadeMedida: "UN",
      codigoReferenciaItem: "",
    };
    setFormData({
      ...formData,
      fornecedores: [...(formData.fornecedores || []), newFornecedor],
    });
  };

  const removeFornecedor = (id: string) => {
    setFormData({
      ...formData,
      fornecedores: formData.fornecedores?.filter((f) => f.id !== id),
    });
  };

  const updateFornecedor = (
    id: string,
    field: keyof Fornecedor,
    value: string
  ) => {
    setFormData({
      ...formData,
      fornecedores: formData.fornecedores?.map((f) =>
        f.id === id ? { ...f, [field]: value } : f
      ),
    });
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
    { id: "principal" as TabType, label: "Dados Principais" },
    { id: "classificacao" as TabType, label: "Classificação Fiscal" },
    { id: "extras" as TabType, label: "Códigos & Fornecedores" },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Aviso de Contexto Global */}
      <Alert className="bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300">
        <Globe className="h-4 w-4" />
        <AlertTitle>Cadastro Global de Produto</AlertTitle>
        <AlertDescription>
          As informações alteradas aqui refletem em todas as empresas. Regras
          específicas de tributação (ICMS, CST) devem ser configuradas na tela
          de contexto da loja.
        </AlertDescription>
      </Alert>

      <Card className="p-6">
        {/* Navegação de Abas */}
        <div className="border-b border-border mb-6">
          <div className="flex gap-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 font-medium text-sm whitespace-nowrap transition-colors border-b-2 ${
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

        {/* --- ABA PRINCIPAL --- */}
        {activeTab === "principal" && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="nome">Descrição do Produto *</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) =>
                  setFormData({ ...formData, nome: e.target.value })
                }
                placeholder="Ex: Coca-Cola 2L Original"
                required
                className="mobile-optimized"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="codigoBarras">EAN / Código de Barras *</Label>
                <Input
                  id="codigoBarras"
                  value={formData.codigoBarras}
                  onChange={(e) =>
                    setFormData({ ...formData, codigoBarras: e.target.value })
                  }
                  placeholder="789..."
                  required
                  className="mobile-optimized font-mono"
                />
              </div>

              <div>
                <Label htmlFor="grupo">Grupo / Categoria</Label>
                <Input
                  id="grupo"
                  value={formData.grupo}
                  onChange={(e) =>
                    setFormData({ ...formData, grupo: e.target.value })
                  }
                  placeholder="Ex: Bebidas"
                  className="mobile-optimized"
                />
              </div>

              <div>
                <Label htmlFor="marca">Marca</Label>
                <Input
                  id="marca"
                  value={formData.marca}
                  onChange={(e) =>
                    setFormData({ ...formData, marca: e.target.value })
                  }
                  className="mobile-optimized"
                />
              </div>

              <div>
                <Label htmlFor="imagemUrl">URL da Imagem</Label>
                <Input
                  id="imagemUrl"
                  value={formData.imagemUrl || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, imagemUrl: e.target.value })
                  }
                  placeholder="https://..."
                  className="mobile-optimized"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4 pt-2">
              <div>
                <Label htmlFor="unidadeMedidaComercial">Unid. Comercial</Label>
                <select
                  id="unidadeMedidaComercial"
                  value={formData.unidadeMedidaComercial}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      unidadeMedidaComercial: e.target.value,
                    })
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="UN">UN - Unidade</option>
                  <option value="CX">CX - Caixa</option>
                  <option value="KG">KG - Quilo</option>
                  <option value="L">L - Litro</option>
                  <option value="PCT">PCT - Pacote</option>
                </select>
              </div>

              <div>
                <Label htmlFor="unidadeTributavel">Unid. Tributável</Label>
                <select
                  id="unidadeTributavel"
                  value={formData.unidadeTributavel}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      unidadeTributavel: e.target.value,
                    })
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="UN">UN - Unidade</option>
                  <option value="KG">KG - Quilo</option>
                  <option value="L">L - Litro</option>
                  <option value="PCT">PCT - Pacote</option>
                </select>
              </div>

              <div>
                <Label htmlFor="fatorConversao">Fator Conversão</Label>
                <Input
                  id="fatorConversao"
                  type="number"
                  step="0.0001"
                  value={formData.fatorConversao}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      fatorConversao: parseFloat(e.target.value) || 1,
                    })
                  }
                  className="mobile-optimized"
                />
              </div>
            </div>
          </div>
        )}

        {/* --- ABA CLASSIFICAÇÃO FISCAL --- */}
        {activeTab === "classificacao" && (
          <div className="space-y-6">
            <div className="bg-muted/30 p-4 rounded-lg border">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-blue-500 mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  Estes dados definem <strong>o que é o produto</strong> para o
                  fisco. As alíquotas e regras de cálculo (ICMS, PIS, COFINS)
                  serão aplicadas automaticamente com base no regime tributário
                  da loja que estiver vendendo.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="tipoItem">Tipo do Item (Sped)</Label>
                <select
                  id="tipoItem"
                  value={formData.tipoItem}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      tipoItem: e.target.value as TipoItemFiscal,
                    })
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
                >
                  {Object.entries(tipoItemLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="origemMercadoria">Origem da Mercadoria</Label>
                <select
                  id="origemMercadoria"
                  value={formData.origemMercadoria}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      origemMercadoria: e.target.value,
                    })
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
                >
                  <option value="0">0 - Nacional</option>
                  <option value="1">1 - Estrangeira (Imp. Direta)</option>
                  <option value="2">
                    2 - Estrangeira (Adq. no mercado interno)
                  </option>
                  <option value="3">
                    3 - Nacional (Conteúdo Imp. &gt; 40%)
                  </option>
                  <option value="5">
                    5 - Nacional (Conteúdo Imp. &le; 40%)
                  </option>
                </select>
              </div>

              <div>
                <Label htmlFor="ncm">NCM (Nomenclatura Comum Mercosul) *</Label>
                <Input
                  id="ncm"
                  value={formData.ncm}
                  onChange={(e) =>
                    setFormData({ ...formData, ncm: e.target.value })
                  }
                  placeholder="0000.00.00"
                  maxLength={10}
                  required
                  className="mobile-optimized font-mono mt-1"
                />
              </div>

              <div>
                <Label htmlFor="cest">CEST (Código Especificador)</Label>
                <Input
                  id="cest"
                  value={formData.cest}
                  onChange={(e) =>
                    setFormData({ ...formData, cest: e.target.value })
                  }
                  placeholder="00.000.00"
                  className="mobile-optimized font-mono mt-1"
                />
              </div>
            </div>
          </div>
        )}

        {/* --- ABA EXTRAS (CÓDIGOS E FORNECEDORES) --- */}
        {activeTab === "extras" && (
          <div className="space-y-8">
            {/* Códigos de Barras */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground">
                  Códigos de Barras Adicionais
                </h3>
                <Button
                  type="button"
                  onClick={addCodigoBarras}
                  size="sm"
                  variant="outline"
                >
                  <Plus className="w-4 h-4 mr-2" /> Adicionar EAN
                </Button>
              </div>

              {formData.codigosBarrasVinculados?.length === 0 ? (
                <div className="text-center py-6 border border-dashed rounded-md text-sm text-muted-foreground">
                  Nenhum código adicional (Caixa, Fardo, Antigo) vinculado.
                </div>
              ) : (
                <div className="space-y-2">
                  {formData.codigosBarrasVinculados?.map((codigo) => (
                    <div key={codigo.id} className="flex gap-2">
                      <Input
                        value={codigo.codigo}
                        onChange={(e) =>
                          updateCodigoBarras(codigo.id, e.target.value)
                        }
                        placeholder="GTIN / EAN"
                        className="font-mono"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeCodigoBarras(codigo.id)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Separator />

            {/* Fornecedores */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground">
                  Fornecedores Vinculados
                </h3>
                <Button
                  type="button"
                  onClick={addFornecedor}
                  size="sm"
                  variant="outline"
                >
                  <Plus className="w-4 h-4 mr-2" /> Adicionar
                </Button>
              </div>

              {formData.fornecedores?.length === 0 ? (
                <div className="text-center py-6 border border-dashed rounded-md text-sm text-muted-foreground">
                  Nenhum fornecedor vinculado a este produto.
                </div>
              ) : (
                <div className="space-y-4">
                  {formData.fornecedores?.map((fornecedor) => (
                    <Card key={fornecedor.id} className="p-4 bg-muted/20">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-xs text-muted-foreground">
                            Nome do Fornecedor
                          </Label>
                          <Input
                            value={fornecedor.nomeFornecedor}
                            onChange={(e) =>
                              updateFornecedor(
                                fornecedor.id,
                                "nomeFornecedor",
                                e.target.value
                              )
                            }
                            className="h-8"
                          />
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">
                            Cód. no Fornecedor
                          </Label>
                          <Input
                            value={fornecedor.codigoFornecedor}
                            onChange={(e) =>
                              updateFornecedor(
                                fornecedor.id,
                                "codigoFornecedor",
                                e.target.value
                              )
                            }
                            className="h-8"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end mt-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-destructive h-8 text-xs hover:bg-destructive/10"
                          onClick={() => removeFornecedor(fornecedor.id)}
                        >
                          Remover Vinculação
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </Card>

      {/* Ações do Formulário */}
      <div className="flex gap-3 justify-end pt-4">
        <Button type="button" variant="outline" size="lg" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" size="lg">
          <Save className="w-4 h-4 mr-2" />
          {product ? "Salvar Alterações Globais" : "Cadastrar Produto Global"}
        </Button>
      </div>
    </form>
  );
}
