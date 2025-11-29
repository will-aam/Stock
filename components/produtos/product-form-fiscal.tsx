"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
    imagemUrl: "",

    // Fiscal - Geral
    tipoItem: "mercadoria_revenda",
    ncm: "",
    cest: "",
    origemMercadoria: "0",

    // ICMS
    icmsCstEntrada: "",
    icmsCstSaida: "",
    icmsAliquota: 0,
    icmsModalidadeBC: "",
    icmsReducaoBC: 0,
    icmsST: false,
    icmsGeraCredito: false,
    icmsMvaOriginal: 0,
    icmsMvaAjustado: 0,

    // PIS/COFINS
    pisCstEntrada: "",
    pisCstSaida: "",
    pisAliquota: 0,
    cofinsCstEntrada: "",
    cofinsCstSaida: "",
    cofinsAliquota: 0,
    pisCofinsGeraCredito: false,

    // IPI
    ipiEnquadramento: "",
    ipiCst: "",
    ipiAliquota: 0,
    ipiGeraCredito: false,

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
      title: product ? "Produto atualizado" : "Produto cadastrado",
      description: `${productToSave.nome} foi salvo com sucesso.`,
    });
  };

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
    { id: "principal" as TabType, label: "Principal" },
    { id: "fiscal" as TabType, label: "Fiscal" },
    { id: "codigosBarras" as TabType, label: "Vincular Código de Barras" },
    { id: "fornecedores" as TabType, label: "Fornecedores" },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="p-6">
        {/* Tabs Navigation */}
        <div className="border-b border-slate-200 mb-6">
          <div className="flex gap-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 font-medium text-sm whitespace-nowrap transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-slate-600 hover:text-slate-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "principal" && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="nome">Nome *</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) =>
                  setFormData({ ...formData, nome: e.target.value })
                }
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="grupo">Grupo/Categoria</Label>
                <Input
                  id="grupo"
                  value={formData.grupo}
                  onChange={(e) =>
                    setFormData({ ...formData, grupo: e.target.value })
                  }
                  placeholder="Ex: Alimentos, Bebidas..."
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
                />
              </div>

              <div>
                <Label htmlFor="codigoBarras">Código de Barras *</Label>
                <Input
                  id="codigoBarras"
                  value={formData.codigoBarras}
                  onChange={(e) =>
                    setFormData({ ...formData, codigoBarras: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="unidadeMedidaComercial">
                  Unidade de Medida Comercial
                </Label>
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
                  <option value="KG">KG - Quilograma</option>
                  <option value="L">L - Litro</option>
                  <option value="PCT">PCT - Pacote</option>
                  <option value="M">M - Metro</option>
                </select>
              </div>

              <div>
                <Label htmlFor="unidadeTributavel">Unidade Tributável</Label>
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
                  <option value="CX">CX - Caixa</option>
                  <option value="KG">KG - Quilograma</option>
                  <option value="L">L - Litro</option>
                  <option value="PCT">PCT - Pacote</option>
                  <option value="M">M - Metro</option>
                </select>
                <p className="text-xs text-slate-500 mt-1">
                  Unidade usada para cálculo de impostos (pode ser diferente da
                  comercial)
                </p>
              </div>

              <div>
                <Label htmlFor="fatorConversao">Fator de Conversão</Label>
                <Input
                  id="fatorConversao"
                  type="number"
                  step="0.01"
                  value={formData.fatorConversao}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      fatorConversao: parseFloat(e.target.value) || 1,
                    })
                  }
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
                  placeholder="https://exemplo.com/imagem.jpg"
                />
              </div>
            </div>

            {formData.imagemUrl && (
              <div className="pt-4">
                <Label>Preview da Imagem</Label>
                <div
                  className="mt-2 border rounded-lg overflow-hidden bg-slate-50 flex items-center justify-center"
                  style={{ height: "200px" }}
                >
                  <img
                    src={formData.imagemUrl || "/placeholder.svg"}
                    alt={formData.nome || "Preview"}
                    className="max-h-full max-w-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                      const parent = (e.target as HTMLImageElement)
                        .parentElement;
                      if (parent) {
                        parent.innerHTML =
                          '<p class="text-sm text-slate-500">Não foi possível carregar a imagem</p>';
                      }
                    }}
                  />
                </div>
              </div>
            )}

            <div className="pt-4 border-t">
              <Label>Tipo do Item (definido na aba Fiscal)</Label>
              <Input
                value={tipoItemLabels[formData.tipoItem as TipoItemFiscal]}
                disabled
                className="bg-slate-100 cursor-not-allowed"
              />
            </div>
          </div>
        )}

        {activeTab === "fiscal" && (
          <div className="space-y-6">
            {/* Tipo do Item */}
            <div>
              <Label htmlFor="tipoItem">Tipo do Item</Label>
              <select
                id="tipoItem"
                value={formData.tipoItem}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    tipoItem: e.target.value as TipoItemFiscal,
                  })
                }
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                {Object.entries(tipoItemLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            {/* Classificação Fiscal */}
            <div>
              <h3 className="font-semibold text-slate-900 mb-3">
                Classificação Fiscal
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="ncm">NCM *</Label>
                  <Input
                    id="ncm"
                    value={formData.ncm}
                    onChange={(e) =>
                      setFormData({ ...formData, ncm: e.target.value })
                    }
                    placeholder="00000000"
                    maxLength={8}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="cest">CEST</Label>
                  <Input
                    id="cest"
                    value={formData.cest}
                    onChange={(e) =>
                      setFormData({ ...formData, cest: e.target.value })
                    }
                  />
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
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="0">
                      0 - Nacional, exceto as indicadas nos códigos 3 a 5
                    </option>
                    <option value="1">
                      1 - Estrangeira - Importação direta, exceto a indicada no
                      código 6
                    </option>
                    <option value="2">
                      2 - Estrangeira - Adquirida no mercado interno, exceto a
                      indicada no código 7
                    </option>
                    <option value="3">
                      3 - Nacional, mercadoria ou bem com Conteúdo de Importação
                      superior a 40%
                    </option>
                    <option value="4">
                      4 - Nacional, cuja produção tenha sido feita em
                      conformidade com os processos produtivos básicos
                    </option>
                    <option value="5">
                      5 - Nacional, mercadoria ou bem com Conteúdo de Importação
                      inferior ou igual a 40%
                    </option>
                    <option value="6">
                      6 - Estrangeira - Importação direta, sem similar nacional,
                      constante em lista de Resolução CAMEX
                    </option>
                    <option value="7">
                      7 - Estrangeira - Adquirida no mercado interno, sem
                      similar nacional, constante em lista de Resolução CAMEX
                    </option>
                    <option value="8">
                      8 - Nacional, mercadoria ou bem com Conteúdo de Importação
                      superior a 70%
                    </option>
                  </select>
                </div>
              </div>
            </div>

            {/* ICMS */}
            <div>
              <h3 className="font-semibold text-slate-900 mb-3">ICMS</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="icmsCstEntrada">CST ICMS Entrada</Label>
                  <Input
                    id="icmsCstEntrada"
                    value={formData.icmsCstEntrada}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        icmsCstEntrada: e.target.value,
                      })
                    }
                    placeholder="Ex: 000, 010, 020..."
                  />
                </div>

                <div>
                  <Label htmlFor="icmsCstSaida">CST ICMS Saída</Label>
                  <Input
                    id="icmsCstSaida"
                    value={formData.icmsCstSaida}
                    onChange={(e) =>
                      setFormData({ ...formData, icmsCstSaida: e.target.value })
                    }
                    placeholder="Ex: 000, 010, 020..."
                  />
                </div>

                <div>
                  <Label htmlFor="icmsAliquota">Alíquota ICMS (%)</Label>
                  <Input
                    id="icmsAliquota"
                    type="number"
                    step="0.01"
                    value={formData.icmsAliquota}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        icmsAliquota: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="icmsModalidadeBC">
                    Modalidade Base de Cálculo
                  </Label>
                  <select
                    id="icmsModalidadeBC"
                    value={formData.icmsModalidadeBC}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        icmsModalidadeBC: e.target.value,
                      })
                    }
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="">Selecione...</option>
                    <option value="0">0 - Margem Valor Agregado (%)</option>
                    <option value="1">1 - Pauta (Valor)</option>
                    <option value="2">2 - Preço Tabelado Máx. (Valor)</option>
                    <option value="3">3 - Valor da Operação</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="icmsReducaoBC">
                    Redução Base de Cálculo (%)
                  </Label>
                  <Input
                    id="icmsReducaoBC"
                    type="number"
                    step="0.01"
                    value={formData.icmsReducaoBC}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        icmsReducaoBC: parseFloat(e.target.value) || 0,
                      })
                    }
                    placeholder="0.00"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="icmsGeraCredito"
                    checked={formData.icmsGeraCredito}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, icmsGeraCredito: checked })
                    }
                  />
                  <Label htmlFor="icmsGeraCredito">
                    Gera crédito de ICMS na entrada
                  </Label>
                </div>

                <div className="flex items-center space-x-2 md:col-span-3">
                  <Switch
                    id="icmsST"
                    checked={formData.icmsST}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, icmsST: checked })
                    }
                  />
                  <Label htmlFor="icmsST">
                    Sujeito à Substituição Tributária (ST)
                  </Label>
                </div>

                {formData.icmsST && (
                  <>
                    <div>
                      <Label htmlFor="icmsMvaOriginal">MVA Original (%)</Label>
                      <Input
                        id="icmsMvaOriginal"
                        type="number"
                        step="0.01"
                        value={formData.icmsMvaOriginal}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            icmsMvaOriginal: parseFloat(e.target.value) || 0,
                          })
                        }
                        placeholder="0.00"
                      />
                    </div>

                    <div>
                      <Label htmlFor="icmsMvaAjustado">MVA Ajustado (%)</Label>
                      <Input
                        id="icmsMvaAjustado"
                        type="number"
                        step="0.01"
                        value={formData.icmsMvaAjustado}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            icmsMvaAjustado: parseFloat(e.target.value) || 0,
                          })
                        }
                        placeholder="0.00"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* PIS/COFINS */}
            <div>
              <h3 className="font-semibold text-slate-900 mb-3">
                PIS / COFINS
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="pisCstEntrada">CST PIS Entrada</Label>
                  <Input
                    id="pisCstEntrada"
                    value={formData.pisCstEntrada}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        pisCstEntrada: e.target.value,
                      })
                    }
                    placeholder="Ex: 01, 02, 50..."
                  />
                </div>

                <div>
                  <Label htmlFor="pisCstSaida">CST PIS Saída</Label>
                  <Input
                    id="pisCstSaida"
                    value={formData.pisCstSaida}
                    onChange={(e) =>
                      setFormData({ ...formData, pisCstSaida: e.target.value })
                    }
                    placeholder="Ex: 01, 02, 50..."
                  />
                </div>

                <div>
                  <Label htmlFor="pisAliquota">Alíquota PIS (%)</Label>
                  <Input
                    id="pisAliquota"
                    type="number"
                    step="0.01"
                    value={formData.pisAliquota}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        pisAliquota: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="cofinsCstEntrada">CST COFINS Entrada</Label>
                  <Input
                    id="cofinsCstEntrada"
                    value={formData.cofinsCstEntrada}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        cofinsCstEntrada: e.target.value,
                      })
                    }
                    placeholder="Ex: 01, 02, 50..."
                  />
                </div>

                <div>
                  <Label htmlFor="cofinsCstSaida">CST COFINS Saída</Label>
                  <Input
                    id="cofinsCstSaida"
                    value={formData.cofinsCstSaida}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        cofinsCstSaida: e.target.value,
                      })
                    }
                    placeholder="Ex: 01, 02, 50..."
                  />
                </div>

                <div>
                  <Label htmlFor="cofinsAliquota">Alíquota COFINS (%)</Label>
                  <Input
                    id="cofinsAliquota"
                    type="number"
                    step="0.01"
                    value={formData.cofinsAliquota}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        cofinsAliquota: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                </div>

                <div className="flex items-center space-x-2 md:col-span-3">
                  <Switch
                    id="pisCofinsGeraCredito"
                    checked={formData.pisCofinsGeraCredito}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        pisCofinsGeraCredito: checked,
                      })
                    }
                  />
                  <Label htmlFor="pisCofinsGeraCredito">
                    Gera crédito PIS/COFINS
                  </Label>
                </div>
              </div>
            </div>

            {/* IPI */}
            <div>
              <h3 className="font-semibold text-slate-900 mb-3">IPI</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="ipiEnquadramento">Enquadramento IPI</Label>
                  <Input
                    id="ipiEnquadramento"
                    value={formData.ipiEnquadramento}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        ipiEnquadramento: e.target.value,
                      })
                    }
                    placeholder="Ex: 999"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Código de enquadramento legal (geralmente para indústria)
                  </p>
                </div>

                <div>
                  <Label htmlFor="ipiCst">CST IPI</Label>
                  <Input
                    id="ipiCst"
                    value={formData.ipiCst}
                    onChange={(e) =>
                      setFormData({ ...formData, ipiCst: e.target.value })
                    }
                    placeholder="Ex: 00, 49, 50..."
                  />
                </div>

                <div>
                  <Label htmlFor="ipiAliquota">Alíquota IPI (%)</Label>
                  <Input
                    id="ipiAliquota"
                    type="number"
                    step="0.01"
                    value={formData.ipiAliquota}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        ipiAliquota: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                </div>

                <div className="flex items-center space-x-2 md:col-span-3">
                  <Switch
                    id="ipiGeraCredito"
                    checked={formData.ipiGeraCredito}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, ipiGeraCredito: checked })
                    }
                  />
                  <Label htmlFor="ipiGeraCredito">Gera crédito IPI</Label>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "codigosBarras" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-900">
                Códigos de Barras Vinculados
              </h3>
              <Button type="button" onClick={addCodigoBarras} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar
              </Button>
            </div>

            {formData.codigosBarrasVinculados?.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-8">
                Nenhum código de barras adicional vinculado
              </p>
            ) : (
              <div className="space-y-3">
                {formData.codigosBarrasVinculados?.map((codigo) => (
                  <div key={codigo.id} className="flex gap-2">
                    <Input
                      value={codigo.codigo}
                      onChange={(e) =>
                        updateCodigoBarras(codigo.id, e.target.value)
                      }
                      placeholder="Digite o código de barras"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeCodigoBarras(codigo.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "fornecedores" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-900">Fornecedores</h3>
              <Button type="button" onClick={addFornecedor} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Fornecedor
              </Button>
            </div>

            {formData.fornecedores?.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-8">
                Nenhum fornecedor vinculado
              </p>
            ) : (
              <div className="space-y-4">
                {formData.fornecedores?.map((fornecedor) => (
                  <Card key={fornecedor.id} className="p-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label>Código do Fornecedor</Label>
                        <Input
                          value={fornecedor.codigoFornecedor}
                          onChange={(e) =>
                            updateFornecedor(
                              fornecedor.id,
                              "codigoFornecedor",
                              e.target.value
                            )
                          }
                        />
                      </div>

                      <div>
                        <Label>Nome do Fornecedor</Label>
                        <Input
                          value={fornecedor.nomeFornecedor}
                          onChange={(e) =>
                            updateFornecedor(
                              fornecedor.id,
                              "nomeFornecedor",
                              e.target.value
                            )
                          }
                        />
                      </div>

                      <div>
                        <Label>Unidade de Medida</Label>
                        <select
                          value={fornecedor.unidadeMedida}
                          onChange={(e) =>
                            updateFornecedor(
                              fornecedor.id,
                              "unidadeMedida",
                              e.target.value
                            )
                          }
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        >
                          <option value="UN">UN - Unidade</option>
                          <option value="CX">CX - Caixa</option>
                          <option value="KG">KG - Quilograma</option>
                          <option value="L">L - Litro</option>
                          <option value="PCT">PCT - Pacote</option>
                          <option value="M">M - Metro</option>
                        </select>
                      </div>

                      <div>
                        <Label>Código Ref. do Item</Label>
                        <Input
                          value={fornecedor.codigoReferenciaItem}
                          onChange={(e) =>
                            updateFornecedor(
                              fornecedor.id,
                              "codigoReferenciaItem",
                              e.target.value
                            )
                          }
                        />
                      </div>
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-4"
                      onClick={() => removeFornecedor(fornecedor.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remover Fornecedor
                    </Button>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Form Actions */}
      <div className="flex gap-3 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          <Save className="w-4 h-4 mr-2" />
          {product ? "Atualizar" : "Cadastrar"} Produto
        </Button>
      </div>
    </form>
  );
}
