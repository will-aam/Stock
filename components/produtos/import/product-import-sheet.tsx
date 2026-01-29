"use client";

import { useState, useRef } from "react";
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
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Upload, FileText, Loader2, PackagePlus } from "lucide-react";
import { cn } from "@/lib/utils";

// Importamos a lógica que criámos
import { parseNFeXML, NFeData, NFeItem } from "@/lib/nfe-parser";
import { useToast } from "@/hooks/use-toast";

interface ProductImportSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (produtos: any[]) => void;
}

export function ProductImportSheet({
  open,
  onOpenChange,
  onImport,
}: ProductImportSheetProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Estados do Fluxo
  const [step, setStep] = useState<"upload" | "preview" | "finish">("upload");
  const [isParsing, setIsParsing] = useState(false);

  // Dados
  const [nfeData, setNfeData] = useState<NFeData | null>(null);
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".xml")) {
      toast({
        variant: "destructive",
        title: "Arquivo inválido",
        description: "Por favor, envie um arquivo XML de Nota Fiscal.",
      });
      return;
    }

    try {
      setIsParsing(true);
      const data = await parseNFeXML(file);
      setNfeData(data);

      // Seleciona todos os itens por padrão
      // CORREÇÃO: data.itens (em vez de data.items)
      const allIndexes = new Set(data.itens.map((i) => i.index));
      setSelectedItems(allIndexes);

      setStep("preview");
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Erro ao ler XML",
        description:
          "O arquivo parece estar corrompido ou não é uma NFe válida.",
      });
    } finally {
      setIsParsing(false);
    }
  };

  const toggleItem = (index: number) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedItems(newSelected);
  };

  const handleFinalize = () => {
    if (!nfeData) return;

    // Filtra apenas os selecionados e converte para o formato do sistema
    // CORREÇÃO: nfeData.itens
    const produtosParaImportar = nfeData.itens
      .filter((item) => selectedItems.has(item.index))
      .map((item) => {
        // Mapeamento XML -> Sistema Interno (Produto)
        return {
          // Dados Básicos
          nome: item.nome,
          codigoInterno: item.codigoProduto,
          codigoBarras: item.eanComercial || "",
          unidade: item.sugerido.unidade,

          // Categorização Básica
          tipoItem: "00", // Mercadoria

          // Fiscal (A mágica acontece aqui)
          ncm: item.ncm,
          cest: item.cest,
          origem: 0, // Assumindo nacional por padrão, mas poderia ler do XML
          grupoTributarioId: "", // Será preenchido manualmente depois ou via regra

          // Lógica sugerida pelo parser
          role: item.sugerido.grupoTributario, // 'revenda', 'uso_interno', etc.

          // Estoque Inicial (Opcional - alguns preferem só cadastrar, outros já dar entrada)
          estoqueMinimo: 0,
          controlaEstoque: item.sugerido.grupoTributario !== "uso_interno",

          // Preços
          custoUltimaCompra: item.sugerido.precoCusto,
          precoVenda: 0, // A definir pelo usuário depois

          // Extra
          fornecedor: {
            cnpj: nfeData.emitente.cnpj,
            nome: nfeData.emitente.nome,
          },
        };
      });

    onImport(produtosParaImportar);

    // Reset e fecha
    setStep("upload");
    setNfeData(null);
    onOpenChange(false);
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case "revenda":
        return "bg-blue-100 text-blue-700 hover:bg-blue-200";
      case "uso_interno":
        return "bg-slate-100 text-slate-700 hover:bg-slate-200";
      default:
        return "bg-amber-100 text-amber-700 hover:bg-amber-200";
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        className="w-full sm:max-w-[900px] p-0 flex flex-col bg-background"
        side="right"
      >
        {/* HEADER */}
        <SheetHeader className="px-6 py-5 border-b shrink-0 bg-muted/5">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-xl font-bold flex items-center gap-2">
              <span className="bg-primary/10 p-1.5 rounded-md">
                <FileText className="h-5 w-5 text-primary" />
              </span>
              Importar XML de NFe
            </SheetTitle>
          </div>
          <SheetDescription>
            Cadastre produtos automaticamente a partir das suas notas fiscais de
            compra.
          </SheetDescription>
        </SheetHeader>

        {/* CORPO */}
        <div className="flex-1 overflow-hidden relative">
          {/* STEP 1: UPLOAD */}
          {step === "upload" && (
            <div className="h-full flex flex-col items-center justify-center p-8 animate-in fade-in zoom-in-95 duration-300">
              <div
                className="border-2 border-dashed border-muted-foreground/25 rounded-xl p-12 text-center hover:bg-muted/5 transition-colors cursor-pointer w-full max-w-lg"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="bg-primary/5 p-4 rounded-full w-fit mx-auto mb-4">
                  {isParsing ? (
                    <Loader2 className="h-8 w-8 text-primary animate-spin" />
                  ) : (
                    <Upload className="h-8 w-8 text-primary" />
                  )}
                </div>
                <h3 className="text-lg font-semibold mb-1">
                  {isParsing ? "Analisando..." : "Clique para selecionar o XML"}
                </h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Ou arraste o arquivo aqui. Suportamos NFe modelo 55.
                </p>
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept=".xml"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <Button variant="outline" disabled={isParsing}>
                  Selecionar Arquivo
                </Button>
              </div>
            </div>
          )}

          {/* STEP 2: PREVIEW */}
          {step === "preview" && nfeData && (
            <div className="h-full flex flex-col animate-in slide-in-from-right-4 duration-300">
              {/* Resumo da Nota */}
              <div className="px-6 py-4 bg-muted/10 border-b flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">
                    NF
                  </div>
                  <div>
                    <p className="text-sm font-semibold">
                      {nfeData.emitente.nome}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Nota: {nfeData.numero} • Série: {nfeData.serie}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className="font-mono">
                    {selectedItems.size} itens selecionados
                  </Badge>
                </div>
              </div>

              {/* Tabela de Itens */}
              <ScrollArea className="flex-1">
                <div className="p-6">
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-muted text-muted-foreground font-medium">
                        <tr>
                          <th className="p-3 w-10">
                            <Checkbox
                              // CORREÇÃO: nfeData.itens
                              checked={
                                selectedItems.size === nfeData.itens.length
                              }
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  // CORREÇÃO: nfeData.itens
                                  setSelectedItems(
                                    new Set(nfeData.itens.map((i) => i.index)),
                                  );
                                } else {
                                  setSelectedItems(new Set());
                                }
                              }}
                            />
                          </th>
                          <th className="p-3">Produto (XML)</th>
                          <th className="p-3">Detalhes</th>
                          <th className="p-3">Conversão</th>
                          <th className="p-3 text-right">Custo Un.</th>
                          <th className="p-3">Sugestão</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {/* CORREÇÃO: nfeData.itens */}
                        {nfeData.itens.map((item) => (
                          <tr
                            key={item.index}
                            className={cn(
                              "hover:bg-muted/5 transition-colors",
                              !selectedItems.has(item.index) &&
                                "opacity-50 grayscale",
                            )}
                          >
                            <td className="p-3">
                              <Checkbox
                                checked={selectedItems.has(item.index)}
                                onCheckedChange={() => toggleItem(item.index)}
                              />
                            </td>
                            <td className="p-3 max-w-[200px]">
                              <p
                                className="font-medium truncate"
                                title={item.nome}
                              >
                                {item.nome}
                              </p>
                              <div className="flex gap-2 text-xs text-muted-foreground mt-1">
                                <span className="font-mono bg-muted px-1 rounded">
                                  {item.codigoProduto}
                                </span>
                                {item.eanComercial && (
                                  <span className="flex items-center gap-1">
                                    GTIN: {item.eanComercial}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="p-3 text-xs text-muted-foreground">
                              <div>NCM: {item.ncm}</div>
                              <div>CEST: {item.cest || "-"}</div>
                              <div>CFOP: {item.cfop}</div>
                            </td>
                            <td className="p-3">
                              {item.fatorConversao > 1 ? (
                                <div className="text-xs">
                                  <div className="font-semibold text-amber-600">
                                    1 {item.unidadeComercial} ={" "}
                                    {item.fatorConversao}{" "}
                                    {item.unidadeTributavel}
                                  </div>
                                  <div className="text-muted-foreground">
                                    Entra como: {item.sugerido.unidade}
                                  </div>
                                </div>
                              ) : (
                                <Badge
                                  variant="secondary"
                                  className="text-[10px]"
                                >
                                  {item.unidadeComercial}
                                </Badge>
                              )}
                            </td>
                            <td className="p-3 text-right font-mono">
                              R$ {item.sugerido.precoCusto.toFixed(2)}
                            </td>
                            <td className="p-3">
                              <Badge
                                className={cn(
                                  "text-[10px] uppercase",
                                  getBadgeColor(item.sugerido.grupoTributario),
                                )}
                              >
                                {item.sugerido.grupoTributario.replace(
                                  "_",
                                  " ",
                                )}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </ScrollArea>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <SheetFooter className="p-5 border-t bg-background shrink-0 flex justify-between sm:justify-between">
          <Button
            variant="ghost"
            onClick={() => {
              if (step === "preview") setStep("upload");
              else onOpenChange(false);
            }}
          >
            {step === "preview" ? "Voltar (Upload)" : "Cancelar"}
          </Button>

          {step === "preview" && (
            <Button
              onClick={handleFinalize}
              disabled={selectedItems.size === 0}
              className="bg-green-600 hover:bg-green-700"
            >
              <PackagePlus className="mr-2 h-4 w-4" />
              Importar {selectedItems.size} Produtos
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
