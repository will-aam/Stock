// app/components/ordi/kanban-board.tsx
"use client";

import { useState } from "react";
import {
  Eye,
  ArrowRight,
  X,
  Calendar,
  Package,
  Trash2,
  Archive,
  Building2,
  ShoppingCart,
  Box,
  CheckSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRequisicoesStore } from "@/lib/requisicoes-store";
import { RequisicaoSheet } from "./requisicao-sheet"; // Certifique-se de que este arquivo existe
import { TrashSheet } from "@/components/ordi/trash/trash-sheet";
import { useToast } from "@/hooks/use-toast";
import {
  type Requisicao,
  type StatusRequisicao,
  statusLabels,
  getSetorById,
} from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface KanbanBoardProps {
  requisicoes: Requisicao[];
}

const columns: {
  status: StatusRequisicao;
  label: string;
  color: string;
  bgHeader: string;
  textColor: string;
}[] = [
  {
    status: "nova",
    label: "Novas",
    color: "border-blue-500",
    bgHeader: "bg-blue-500/10",
    textColor: "text-blue-700 dark:text-blue-400",
  },
  {
    status: "em_atendimento",
    label: "Em Atendimento",
    color: "border-yellow-500",
    bgHeader: "bg-yellow-500/10",
    textColor: "text-yellow-700 dark:text-yellow-400",
  },
  {
    status: "concluida",
    label: "Concluídas",
    color: "border-green-500",
    bgHeader: "bg-green-500/10",
    textColor: "text-green-700 dark:text-green-400",
  },
  {
    status: "negada",
    label: "Negadas",
    color: "border-red-500",
    bgHeader: "bg-red-500/10",
    textColor: "text-red-700 dark:text-red-400",
  },
];

export function KanbanBoard({ requisicoes }: KanbanBoardProps) {
  const { updateStatus } = useRequisicoesStore();
  const [selectedRequisicao, setSelectedRequisicao] =
    useState<Requisicao | null>(null);
  const [isTrashOpen, setIsTrashOpen] = useState(false);
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const { toast } = useToast();

  const handleNextStatus = (
    req: Requisicao,
    currentStatus: StatusRequisicao,
  ) => {
    // Status Lock Validation
    if (currentStatus === "nova") {
      const allItemsTagged = req.itens.every(
        (item) => item.tag === "separar" || item.tag === "comprar",
      );

      if (!allItemsTagged) {
        toast({
          title: "Ação Bloqueada",
          description:
            "Todos os itens devem ser classificados como 'Separar' ou 'Comprar' antes de mover para Em Atendimento.",
          variant: "destructive",
        });
        return;
      }
    }

    let next: StatusRequisicao = "nova";
    if (currentStatus === "nova") next = "em_atendimento";
    else if (currentStatus === "em_atendimento") next = "concluida";

    updateStatus(req.id, next);
    toast({
      title: "Status atualizado",
      description: `Pedido movido para ${statusLabels[next]}.`,
    });
  };

  const handleBatchMove = () => {
    // For simplicity, we only assume moving forward one step for all selected
    // In a real app we might need to check individual status compatibility
    // But usually batch actions apply when they are in the same column?
    // The requirement says: "show a floating action bar to move them all to the next status at once."

    // We should only move those that are valid.

    const processed = [];
    const failed = [];

    selectedCards.forEach((id) => {
      const req = requisicoes.find((r) => r.id === id);
      if (!req) return;

      // Logic for next status
      let next: StatusRequisicao | null = null;
      if (req.status === "nova") {
        const allItemsTagged = req.itens.every(
          (item) => item.tag === "separar" || item.tag === "comprar",
        );
        if (allItemsTagged) next = "em_atendimento";
        else failed.push(id);
      } else if (req.status === "em_atendimento") next = "concluida";

      if (next) {
        updateStatus(id, next);
        processed.push(id);
      }
    });

    if (processed.length > 0) {
      toast({
        title: "Lote processado",
        description: `${processed.length} itens movidos com sucesso.`,
      });
      setSelectedCards([]);
    }

    if (failed.length > 0) {
      toast({
        title: "Alguns itens não foram movidos",
        description: `${failed.length} itens precisam ser classificados primeiro.`,
        variant: "destructive",
      });
    }
  };

  const toggleSelectCard = (id: string) => {
    setSelectedCards((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
  };

  const handleCardClick = (e: React.MouseEvent, req: Requisicao) => {
    if (e.shiftKey) {
      e.preventDefault();
      toggleSelectCard(req.id);
    }
  };

  const handleDeny = (id: string) => {
    updateStatus(id, "negada");
    toast({
      title: "Pedido Negado",
      description: "O setor será notificado.",
      variant: "destructive",
    });
  };

  const handleArchive = (id: string) => {
    // Simulação de arquivamento
    toast({
      title: "Arquivado",
      description: "Item movido para o histórico.",
    });
  };

  const handleMoveToTrash = (id: string) => {
    // Simulação de lixeira
    toast({
      title: "Lixeira",
      description: "Item movido para a lixeira.",
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Grid do Kanban - Ocupa 100% da largura sem scroll lateral */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 h-full min-h-0">
        {columns.map((col) => (
          <div
            key={col.status}
            className="flex flex-col h-full min-h-0 rounded-xl border bg-card shadow-sm"
          >
            {/* Header da Coluna */}
            <div
              className={`p-4 rounded-t-xl border-t-4 ${col.color} ${col.bgHeader} flex justify-between items-center shrink-0`}
            >
              <h3 className={cn("font-semibold", col.textColor)}>
                {col.label}
              </h3>
              <Badge
                variant="secondary"
                className="bg-background/80 font-mono text-xs"
              >
                {requisicoes.filter((r) => r.status === col.status).length}
              </Badge>
            </div>

            {/* Área de Cards (sem scroll) */}
            <div className="flex-1 p-3 space-y-3 min-h-0">
              {requisicoes
                .filter((r) => r.status === col.status)
                .map((req) => {
                  const setor = getSetorById(req.setorId);
                  const isSelected = selectedCards.includes(req.id);
                  const hasComprar = req.itens.some((i) => i.tag === "comprar");
                  const allSeparar =
                    req.itens.length > 0 &&
                    req.itens.every((i) => i.tag === "separar");

                  return (
                    <div
                      key={req.id}
                      onClick={(e) => handleCardClick(e, req)}
                      className={`bg-background p-3 rounded-lg border shadow-sm hover:shadow-md transition-all group relative cursor-pointer ${
                        isSelected ? "ring-2 ring-primary border-primary" : ""
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full p-0.5 shadow-sm z-10">
                          <CheckSquare className="h-4 w-4" />
                        </div>
                      )}

                      {/* Topo: Setor e Data */}
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center text-sm font-semibold text-primary">
                          <Building2 className="h-4 w-4 mr-1.5" />
                          <span className="truncate max-w-[120px]">
                            {setor?.nome || "Geral"}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground whitespace-nowrap flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(req.dataCriacao).toLocaleDateString(
                            "pt-BR",
                          )}
                        </span>
                      </div>

                      {/* Meio: Prévia dos Itens */}
                      <div className="bg-muted/30 rounded-md p-2 mb-3">
                        <p className="text-xs text-muted-foreground mb-1.5">
                          Itens ({req.itens.length})
                        </p>
                        <div className="text-xs text-card-foreground space-y-0.5">
                          {req.itens.slice(0, 2).map((item, i) => (
                            <div key={i} className="truncate">
                              • {item.quantidade}x {item.nome}
                            </div>
                          ))}
                          {req.itens.length > 2 && (
                            <span className="text-muted-foreground">
                              +{req.itens.length - 2} mais...
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Rodapé: Botões de Ação */}
                      <div className="flex gap-1.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex-1 h-7 text-xs"
                          onClick={() => setSelectedRequisicao(req)}
                          title="Ver Detalhes"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          Detalhes
                        </Button>

                        {/* Visual Indicators */}
                        <div className="flex items-center gap-1.5 ml-auto">
                          {hasComprar && (
                            <div
                              title="Itens para Comprar"
                              className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 p-1 rounded-md"
                            >
                              <ShoppingCart className="h-3 w-3" />
                            </div>
                          )}
                          {allSeparar && (
                            <div
                              title="Todos itens em Estoque"
                              className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 p-1 rounded-md"
                            >
                              <Box className="h-3 w-3" />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Botões de Ação Condicionais */}
                      <div className="flex gap-1.5 mt-2">
                        {(col.status === "nova" ||
                          col.status === "em_atendimento") && (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 rounded-md hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-950/20"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleNextStatus(req, col.status);
                              }}
                              title={`Mover para ${
                                statusLabels[
                                  col.status === "nova"
                                    ? "em_atendimento"
                                    : "concluida"
                                ]
                              }`}
                            >
                              <ArrowRight className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 rounded-md hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeny(req.id);
                              }}
                              title="Negar Requisição"
                            >
                              <X className="h-3.5 w-3.5" />
                            </Button>
                          </>
                        )}

                        {col.status === "concluida" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 rounded-md hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/20"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleArchive(req.id);
                            }}
                            title="Arquivar"
                          >
                            <Archive className="h-3.5 w-3.5" />
                          </Button>
                        )}

                        {(col.status === "negada" || col.status === "nova") && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 rounded-md hover:text-destructive hover:bg-destructive/10"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMoveToTrash(req.id);
                            }}
                            title="Excluir"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}

              {requisicoes.filter((r) => r.status === col.status).length ===
                0 && (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground/50 py-8">
                  <div className="h-12 w-12 border-2 border-dashed rounded-full flex items-center justify-center mb-2">
                    <Package className="h-5 w-5" />
                  </div>
                  <p className="text-xs">Sem pedidos</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <RequisicaoSheet
        requisicao={selectedRequisicao}
        open={!!selectedRequisicao}
        onOpenChange={(open: boolean) => !open && setSelectedRequisicao(null)}
      />

      <TrashSheet open={isTrashOpen} onOpenChange={setIsTrashOpen} />

      {/* Floating Action Bar for Batch Selection */}
      {selectedCards.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-foreground text-background px-6 py-3 rounded-full shadow-xl z-50 flex items-center gap-4 animate-in slide-in-from-bottom-4">
          <span className="text-sm font-medium">
            {selectedCards.length} selecionado(s)
          </span>
          <div className="h-4 w-px bg-background/20" />
          <Button
            size="sm"
            variant="secondary"
            onClick={handleBatchMove}
            className="h-8 text-xs font-semibold"
          >
            Mover para Próxima Etapa
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setSelectedCards([])}
            className="h-8 w-8 p-0 rounded-full hover:bg-background/20 text-background hover:text-background"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
