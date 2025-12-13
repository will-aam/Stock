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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
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
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [initialItemsState, setInitialItemsState] = useState<SheetItemState[]>(
    []
  );

  const setor = requisicao ? getSetorById(requisicao.setorId) : undefined;

  // Initialize state when requisicao changes
  useEffect(() => {
    if (requisicao) {
      const state = requisicao.itens.map((item) => ({
        ...item,
        isApproved: true,
        quantidadeAprovada: item.quantidade,
      }));
      setItemsState(state);
      setInitialItemsState(state);
    }
  }, [requisicao]);

  // Check for changes
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

  const handleQuantityChange = (index: number, value: string) => {
    const newQuantity = parseInt(value, 10) || 0;
    setItemsState((current) =>
      current.map((item, i) =>
        i === index ? { ...item, quantidadeAprovada: newQuantity } : item
      )
    );
  };

  const handleTagChange = (index: number, value: ItemTag) => {
    setItemsState((current) =>
      current.map((item, i) => (i === index ? { ...item, tag: value } : item))
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

      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    }, 1000);
  };

  if (!requisicao) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-xl w-full flex flex-col h-full overflow-hidden">
        <SheetHeader className="border-b pb-4 shrink-0">
          <SheetTitle>Detalhes da Requisição</SheetTitle>
          <SheetDescription>#{requisicao.id.toUpperCase()}</SheetDescription>
        </SheetHeader>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto py-4 min-h-0">
          {/* Main Info */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="bg-muted/30 rounded-lg p-3">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Users className="h-3 w-3" />
                <span className="text-xs">Setor</span>
              </div>
              <p className="font-medium text-foreground text-sm">
                {setor?.nome}
              </p>
            </div>
            <div className="bg-muted/30 rounded-lg p-3">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Calendar className="h-3 w-3" />
                <span className="text-xs">Data</span>
              </div>
              <p className="font-medium text-foreground text-sm">
                {new Date(requisicao.dataCriacao).toLocaleString("pt-BR")}
              </p>
            </div>
          </div>

          {/* Items */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2 sticky top-0 bg-background pb-2 z-10">
              <Package className="h-4 w-4 text-primary" />
              <h3 className="font-semibold">Itens ({itemsState.length})</h3>
            </div>

            {itemsState.map((item, index) => {
              const itemFuncionario = getFuncionarioById(
                item.funcionarioId || requisicao.funcionarioId
              );
              return (
                <div
                  key={index}
                  className={`bg-card border rounded-lg p-4 shadow-sm transition-all ${
                    !item.isApproved ? "opacity-60" : ""
                  }`}
                >
                  <div className="flex flex-col gap-3">
                    {/* Item Header */}
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-foreground">
                          {item.nome}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Solicitado por: {itemFuncionario?.nome}
                        </p>
                      </div>
                      <div className="flex flex-col items-end">
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
                          className="w-16 h-8 text-center"
                        />
                      </div>
                    </div>

                    {/* Tagging Section */}
                    <div className="flex flex-col gap-1.5 pt-2 border-t mt-1">
                      <span className="text-xs text-muted-foreground font-medium">
                        Ação Necessária:
                      </span>
                      <ToggleGroup
                        type="single"
                        value={item.tag || ""}
                        onValueChange={(val) => handleTagChange(index, val as ItemTag || null)}
                        className="justify-start"
                      >
                        <ToggleGroupItem
                          value="separar"
                          aria-label="Separar"
                          className={`h-8 px-3 text-xs gap-1.5 border ${
                            item.tag === "separar"
                              ? "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800"
                              : "hover:bg-muted"
                          }`}
                        >
                          <Box className="h-3.5 w-3.5" />
                          Separar
                        </ToggleGroupItem>
                        <ToggleGroupItem
                          value="comprar"
                          aria-label="Comprar"
                          className={`h-8 px-3 text-xs gap-1.5 border ${
                             item.tag === "comprar"
                              ? "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800"
                              : "hover:bg-muted"
                          }`}
                        >
                          <ShoppingCart className="h-3.5 w-3.5" />
                          Comprar
                        </ToggleGroupItem>
                      </ToggleGroup>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Observations */}
          {requisicao.observacoesGerais && (
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                Observações gerais
              </h3>
              <div className="bg-muted/30 border rounded-lg p-3">
                <p className="text-sm">{requisicao.observacoesGerais}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <SheetFooter className="border-t pt-4 bg-background shrink-0">
          <Button
            onClick={handleConfirmChanges}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
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
                Confirmar Alterações
              </>
            )}
          </Button>
          {showSuccess && (
            <div className="w-full text-center mt-2 text-sm text-green-600 font-medium animate-in fade-in slide-in-from-bottom-2">
              Alterações salvas com sucesso!
            </div>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
