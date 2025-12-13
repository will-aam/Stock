// app/components/ordi/requisicao-modal.tsx
"use client";

import { useState, useEffect } from "react";
import { X, Users, Calendar, Package, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  type Requisicao,
  type ItemRequisicao,
  getFuncionarioById,
  getSetorById,
} from "@/lib/mock-data";
import { useRequisicoesStore } from "@/lib/requisicoes-store";

interface RequisicaoModalProps {
  requisicao: Requisicao;
  onClose: () => void;
}

interface ModalItemState extends ItemRequisicao {
  isApproved: boolean;
  quantidadeAprovada: number;
}

export function RequisicaoModal({ requisicao, onClose }: RequisicaoModalProps) {
  // Usando a nova ação updateItens
  const { updateItens } = useRequisicoesStore();
  const setor = getSetorById(requisicao.setorId);

  // Estado inicial dos itens
  let initialItemsState = requisicao.itens.map((item) => ({
    ...item,
    isApproved: true,
    quantidadeAprovada: item.quantidade,
  }));

  const [itemsState, setItemsState] =
    useState<ModalItemState[]>(initialItemsState);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Verifica se há alterações nos itens
  useEffect(() => {
    const hasItemChanges = itemsState.some((item, index) => {
      const originalItem = initialItemsState[index];
      return (
        item.isApproved !== originalItem.isApproved ||
        item.quantidadeAprovada !== originalItem.quantidadeAprovada
      );
    });
    setHasChanges(hasItemChanges);
  }, [itemsState, initialItemsState]);

  // Adiciona suporte à tecla ESC para fechar o modal
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleQuantityChange = (index: number, value: string) => {
    const newQuantity = parseInt(value, 10) || 0;
    setItemsState((current) =>
      current.map((item, i) =>
        i === index ? { ...item, quantidadeAprovada: newQuantity } : item
      )
    );
  };

  const handleDoubleClick = (index: number) => {
    setItemsState((current) =>
      current.map((item, i) =>
        i === index ? { ...item, isApproved: !item.isApproved } : item
      )
    );
  };

  // NOVA FUNÇÃO: Apenas confirma e salva os itens, sem mudar o status
  const handleConfirmChanges = () => {
    setIsLoading(true);

    // Simula um tempo de processamento
    setTimeout(() => {
      const finalItems = itemsState
        .filter((item) => item.isApproved && item.quantidadeAprovada > 0)
        .map(({ isApproved, quantidadeAprovada, ...rest }) => ({
          ...rest,
          quantidade: quantidadeAprovada,
        }));

      // Chama a nova ação do store para atualizar apenas os itens
      updateItens(requisicao.id, finalItems);

      // Atualiza o estado inicial para refletir as alterações salvas
      const newInitialState = itemsState.map((item) => ({
        ...item,
        quantidade: item.quantidadeAprovada,
      }));
      initialItemsState = newInitialState;

      setIsLoading(false);
      setShowSuccess(true);

      // Esconde a mensagem de sucesso após 3 segundos
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-card border border-border rounded-xl w-full max-w-lg max-h-[90vh] overflow-hidden shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div>
            <h2 className="text-lg font-semibold text-card-foreground">
              Detalhes da Requisição
            </h2>
            <p className="text-sm text-muted-foreground">
              #{requisicao.id.toUpperCase()}
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto max-h-[calc(90vh-180px)]">
          {/* Informações Principais */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="bg-muted/30 rounded-lg p-3">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Users className="h-3 w-3" />
                <span className="text-xs">Setor que requisitou</span>
              </div>
              <p className="font-medium text-card-foreground text-sm">
                {setor?.nome}
              </p>
            </div>
            <div className="bg-muted/30 rounded-lg p-3">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Calendar className="h-3 w-3" />
                <span className="text-xs">Data da Requisição</span>
              </div>
              <p className="font-medium text-card-foreground text-sm">
                {new Date(requisicao.dataCriacao).toLocaleString("pt-BR")}
              </p>
            </div>
          </div>

          {/* Itens com Controle */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-3">
              <Package className="h-4 w-4 text-primary" />
              <h3 className="font-semibold text-card-foreground">
                Aprovar Itens ({itemsState.filter((i) => i.isApproved).length}{" "}
                de {requisicao.itens.length})
              </h3>
            </div>
            {itemsState.map((item, index) => {
              const itemFuncionario = getFuncionarioById(
                item.funcionarioId || requisicao.funcionarioId
              );
              return (
                <div
                  key={index}
                  title="Dê duplo clique para marcar como 'Indisponível'"
                  className={`bg-muted/30 border rounded-lg p-3 transition-all cursor-pointer hover:bg-muted/50 ${
                    !item.isApproved
                      ? "border-red-500/50 opacity-60"
                      : "border-border"
                  }`}
                  onDoubleClick={() => handleDoubleClick(index)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p
                        className={`font-medium text-card-foreground ${
                          !item.isApproved ? "line-through" : ""
                        }`}
                      >
                        {item.nome}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Solicitado por: {itemFuncionario?.nome}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="flex flex-col items-end gap-1">
                        <label className="text-xs text-muted-foreground">
                          Aprovar Qtd.
                        </label>
                        <Input
                          type="number"
                          min="0"
                          value={item.quantidadeAprovada}
                          onChange={(e) =>
                            handleQuantityChange(index, e.target.value)
                          }
                          disabled={!item.isApproved}
                          className="w-20 h-8 text-center"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Observações gerais */}
          {requisicao.observacoesGerais && (
            <div className="mt-4">
              <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                Observações gerais
              </h3>
              <div className="bg-muted/30 border border-border rounded-lg p-3">
                <p className="text-sm text-card-foreground">
                  {requisicao.observacoesGerais}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer com o Botão Confirmar */}
        <div className="px-5 py-4 border-t border-border bg-muted/20">
          <div className="flex items-center justify-center">
            <Button
              onClick={handleConfirmChanges}
              className="w-full max-w-xs bg-green-600 hover:bg-green-700 text-white"
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
          </div>

          {/* Mensagem de sucesso */}
          {showSuccess && (
            <div className="mt-3 p-2 bg-green-100 border border-green-300 rounded-md text-green-800 text-sm text-center">
              Alterações salvas com sucesso!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
