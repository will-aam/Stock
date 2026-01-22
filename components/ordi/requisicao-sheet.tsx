// app/components/ordi/requisicao-sheet.tsx
"use client";

import { useState, useEffect } from "react";
import {
  X,
  Users,
  Calendar,
  Package,
  Check,
  Loader2,
  ShoppingCart,
  Box,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox"; // RE-IMPORTANDO O CHECKBOX
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  type Requisicao,
  type ItemRequisicao,
  type ItemTag,
  getFuncionarioById,
  getSetorById,
} from "@/lib/mock-data";
import { useRequisicoesStore } from "@/lib/requisicoes-store";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface RequisicaoSheetProps {
  requisicao: Requisicao | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface SheetItemState extends ItemRequisicao {
  isApproved: boolean;
  quantidadeAprovada: number;
}

export function RequisicaoSheet({
  requisicao,
  open,
  onOpenChange,
}: RequisicaoSheetProps) {
  const { updateItens } = useRequisicoesStore();

  const [itemsState, setItemsState] = useState<SheetItemState[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [initialItemsState, setInitialItemsState] = useState<SheetItemState[]>(
    [],
  );

  const setor = requisicao ? getSetorById(requisicao.setorId) : undefined;

  useEffect(() => {
    if (requisicao) {
      const state = requisicao.itens.map((item) => ({
        ...item,
        isApproved: true,
        quantidadeAprovada: item.quantidade,
      }));
      setItemsState(state);
      setInitialItemsState(state);
      setSelectedItems([]);
    }
  }, [requisicao]);

  useEffect(() => {
    if (!requisicao) return;

    const hasItemChanges = itemsState.some((item, index) => {
      const originalItem = initialItemsState[index];
      if (!originalItem) return true;

      return (
        item.isApproved !== originalItem.isApproved ||
        item.quantidadeAprovada !== originalItem.quantidadeAprovada ||
        item.tag !== originalItem.tag
      );
    });
    setHasChanges(hasItemChanges);
  }, [itemsState, initialItemsState, requisicao]);

  const toggleSelectAll = () => {
    if (selectedItems.length === itemsState.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(itemsState.map((_, index) => index));
    }
  };

  const applyBatchAction = (tag: ItemTag) => {
    setItemsState((current) =>
      current.map((item, index) =>
        selectedItems.includes(index) ? { ...item, tag } : item,
      ),
    );
  };

  const handleQuantityChange = (index: number, value: string) => {
    const newQuantity = parseInt(value, 10) || 0;
    setItemsState((current) =>
      current.map((item, i) =>
        i === index ? { ...item, quantidadeAprovada: newQuantity } : item,
      ),
    );
  };

  const handleTagChange = (index: number, value: ItemTag) => {
    setItemsState((current) =>
      current.map((item, i) => (i === index ? { ...item, tag: value } : item)),
    );
  };

  const handleConfirmChanges = () => {
    if (!requisicao) return;
    setIsLoading(true);

    setTimeout(() => {
      const finalItems = itemsState
        .filter((item) => item.isApproved && item.quantidadeAprovada > 0)
        .map(({ isApproved, quantidadeAprovada, ...rest }) => ({
          ...rest,
          quantidade: quantidadeAprovada,
        }));

      updateItens(requisicao.id, finalItems);

      const newInitialState = itemsState.map((item) => ({
        ...item,
        quantidade: item.quantidadeAprovada,
      }));
      setInitialItemsState(newInitialState);

      setIsLoading(false);
      setShowSuccess(true);
      setSelectedItems([]);

      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    }, 1000);
  };

  if (!requisicao) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-xl w-full flex flex-col h-full p-0 gap-0 bg-background">
        <SheetHeader className="p-6 border-b shrink-0">
          <SheetTitle>Detalhes da Requisição</SheetTitle>
          <SheetDescription>#{requisicao.id.toUpperCase()}</SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto min-h-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted/30 border rounded-lg p-3 flex flex-col justify-center">
                <div className="flex items-center gap-2 text-muted-foreground mb-1.5">
                  <Users className="h-3.5 w-3.5" />
                  <span className="text-xs font-medium uppercase tracking-wider">
                    Setor
                  </span>
                </div>
                <p
                  className="font-semibold text-foreground text-sm truncate"
                  title={setor?.nome}
                >
                  {setor?.nome || "N/A"}
                </p>
              </div>
              <div className="bg-muted/30 border rounded-lg p-3 flex flex-col justify-center">
                <div className="flex items-center gap-2 text-muted-foreground mb-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  <span className="text-xs font-medium uppercase tracking-wider">
                    Data
                  </span>
                </div>
                <p className="font-semibold text-foreground text-sm">
                  {new Date(requisicao.dataCriacao).toLocaleDateString("pt-BR")}
                  <span className="text-muted-foreground font-normal ml-1">
                    {new Date(requisicao.dataCriacao).toLocaleTimeString(
                      "pt-BR",
                      { hour: "2-digit", minute: "2-digit" },
                    )}
                  </span>
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="sticky top-0 bg-background z-20 -mx-6 px-6 pb-3 border-b mb-4 pt-1">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {/* READICIONADO: Checkbox no cabeçalho */}
                      <Checkbox
                        checked={
                          selectedItems.length === itemsState.length &&
                          itemsState.length > 0
                        }
                        onCheckedChange={toggleSelectAll}
                        id="select-all"
                      />
                      <label
                        htmlFor="select-all"
                        className="font-semibold text-sm cursor-pointer select-none flex items-center gap-2"
                      >
                        {selectedItems.length > 0
                          ? `${selectedItems.length} selecionado(s)`
                          : `Itens (${itemsState.length})`}
                      </label>
                    </div>

                    {selectedItems.length > 0 && (
                      <div className="flex items-center gap-2 animate-in slide-in-from-right-2 fade-in">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100 hover:text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800"
                          onClick={() => applyBatchAction("separar")}
                        >
                          <Box className="h-3 w-3 mr-1.5" />
                          Separar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs border-amber-200 text-amber-700 bg-amber-50 hover:bg-amber-100 hover:text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800"
                          onClick={() => applyBatchAction("comprar")}
                        >
                          <ShoppingCart className="h-3 w-3 mr-1.5" />
                          Comprar
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {itemsState.map((item, index) => {
                const itemFuncionario = getFuncionarioById(
                  item.funcionarioId || requisicao.funcionarioId,
                );

                return (
                  <div
                    key={index}
                    className={`bg-card border rounded-lg p-4 shadow-sm transition-all ${
                      !item.isApproved ? "opacity-60 grayscale" : ""
                    } hover:border-primary/50`}
                  >
                    <div className="flex gap-4">
                      {/* AQUI NÃO TEM MAIS O CHECKBOX INDIVIDUAL */}
                      <div className="flex-1 flex flex-col gap-4">
                        <div className="flex justify-between items-start gap-4">
                          <div className="min-w-0">
                            <p className="font-medium text-foreground text-sm leading-tight">
                              {item.nome}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1 truncate">
                              Solicitante: {itemFuncionario?.nome}
                            </p>
                          </div>

                          <div className="flex flex-col items-end shrink-0">
                            <label className="text-[10px] text-muted-foreground mb-1 uppercase tracking-wider font-semibold">
                              Qtd.
                            </label>
                            <Input
                              type="number"
                              min="0"
                              value={item.quantidadeAprovada}
                              onChange={(e) =>
                                handleQuantityChange(index, e.target.value)
                              }
                              disabled={!item.isApproved}
                              className="w-20 h-9 text-center font-mono bg-background"
                            />
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 pt-3 border-t border-dashed">
                          <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                            Classificação
                          </span>
                          <ToggleGroup
                            type="single"
                            value={item.tag || ""}
                            onValueChange={(val) =>
                              handleTagChange(index, (val as ItemTag) || null)
                            }
                            className="justify-start w-full"
                          >
                            <ToggleGroupItem
                              value="separar"
                              aria-label="Separar"
                              className={`flex-1 h-9 px-3 text-xs gap-2 border shadow-sm transition-all ${
                                item.tag === "separar"
                                  ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800 ring-1 ring-blue-200 dark:ring-blue-800"
                                  : "hover:bg-muted bg-background text-muted-foreground"
                              }`}
                            >
                              <Box className="h-3.5 w-3.5" />
                              Separar
                            </ToggleGroupItem>
                            <ToggleGroupItem
                              value="comprar"
                              aria-label="Comprar"
                              className={`flex-1 h-9 px-3 text-xs gap-2 border shadow-sm transition-all ${
                                item.tag === "comprar"
                                  ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800 ring-1 ring-amber-200 dark:ring-amber-800"
                                  : "hover:bg-muted bg-background text-muted-foreground"
                              }`}
                            >
                              <ShoppingCart className="h-3.5 w-3.5" />
                              Comprar
                            </ToggleGroupItem>
                          </ToggleGroup>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {requisicao.observacoesGerais && (
              <div className="pt-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  Observações Gerais
                </h3>
                <div className="bg-muted/50 border rounded-lg p-3 text-sm text-muted-foreground italic">
                  "{requisicao.observacoesGerais}"
                </div>
              </div>
            )}
          </div>
        </div>

        <SheetFooter className="p-6 border-t bg-background shrink-0 gap-2 sm:gap-0">
          <Button
            onClick={handleConfirmChanges}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-11"
            disabled={!hasChanges || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processando...
              </>
            ) : (
              <>
                <Check className="h-4 w-4 mr-2" />
                Salvar Alterações
              </>
            )}
          </Button>
          {showSuccess && (
            <div className="absolute -top-12 left-0 right-0 flex justify-center">
              <div className="bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300 text-xs px-3 py-1.5 rounded-full font-medium shadow-sm animate-in fade-in slide-in-from-bottom-2">
                Alterações salvas!
              </div>
            </div>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
