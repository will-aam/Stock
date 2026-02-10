// app/components/ordi/kanban-board.tsx
"use client";

import { useState } from "react";
import {
  ArrowRight,
  X,
  Calendar,
  Package,
  Trash2,
  Archive,
  Building2,
  CheckSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRequisicoesStore } from "@/lib/requisicoes-store";
import { RequisicaoSheet } from "./requisicao-sheet";
import { TrashSheet } from "@/components/ordi/trash/trash-sheet";
import { useToast } from "@/hooks/use-toast";
import {
  type Requisicao,
  type StatusRequisicao,
  statusLabels,
  getSetorById,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
    const processed = [];
    const failed = [];

    selectedCards.forEach((id) => {
      const req = requisicoes.find((r) => r.id === id);
      if (!req) return;

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
    } else {
      setSelectedRequisicao(req);
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
    toast({
      title: "Arquivado",
      description: "Item movido para o histórico.",
    });
  };

  const handleMoveToTrash = (id: string) => {
    toast({
      title: "Lixeira",
      description: "Item movido para a lixeira.",
    });
  };

  return (
    <TooltipProvider>
      <div className="flex flex-col h-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 h-full min-h-0">
          {columns.map((col) => (
            <div
              key={col.status}
              className="flex flex-col h-full min-h-0 rounded-xl border bg-card shadow-sm"
            >
              <div
                className={`p-4 rounded-t-xl border-t-4 ${col.color} ${col.bgHeader} flex justify-between items-center shrink-0`}
              >
                <h3 className={cn("font-semibold", col.textColor)}>
                  {col.label}
                </h3>
              </div>

              <div className="flex-1 p-3 space-y-2 overflow-y-auto min-h-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {requisicoes
                  .filter((r) => r.status === col.status)
                  .map((req) => {
                    const setor = getSetorById(req.setorId);
                    const isSelected = selectedCards.includes(req.id);

                    // AJUSTE: Adicionando "..." ao final da string de prévia
                    const itensPreview = `${req.itens
                      .map((item) => `${item.quantidade}x ${item.nome}`)
                      .join("; ")}...`;

                    return (
                      <div
                        key={req.id}
                        onClick={(e) => handleCardClick(e, req)}
                        className={cn(
                          "group relative bg-background p-3 rounded-lg border shadow-sm hover:shadow-md transition-all cursor-pointer h-32 overflow-hidden",
                          isSelected && "ring-2 ring-primary border-primary",
                        )}
                      >
                        {isSelected && (
                          <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full p-0.5 shadow-sm z-10">
                            <CheckSquare className="h-4 w-4" />
                          </div>
                        )}

                        <div className="flex flex-col h-full">
                          <div className="flex justify-between items-start mb-2 gap-2">
                            <div className="flex items-center text-sm font-semibold text-primary">
                              <Building2 className="h-4 w-4 mr-1.5 shrink-0" />
                              <span className="truncate">
                                {setor?.nome || "Geral"}
                              </span>
                            </div>
                            <span className="text-xs text-muted-foreground whitespace-nowrap flex items-center shrink-0 ml-2">
                              <Calendar className="h-3 w-3 mr-1" />
                              {new Date(req.dataCriacao).toLocaleDateString(
                                "pt-BR",
                              )}
                            </span>
                          </div>

                          <div className="grow">
                            <p
                              className="text-sm text-muted-foreground wrap-break-word"
                              style={{
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                              }}
                            >
                              {itensPreview}
                            </p>
                          </div>
                        </div>

                        <div className="absolute bottom-1.5 right-1.5 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-background/80 backdrop-blur-sm p-1 rounded-md shadow-md">
                          {(col.status === "nova" ||
                            col.status === "em_atendimento") && (
                            <>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-950/20"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleNextStatus(req, col.status);
                                    }}
                                  >
                                    <ArrowRight className="h-3.5 w-3.5" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>
                                    Mover para{" "}
                                    {
                                      statusLabels[
                                        col.status === "nova"
                                          ? "em_atendimento"
                                          : "concluida"
                                      ]
                                    }
                                  </p>
                                </TooltipContent>
                              </Tooltip>

                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeny(req.id);
                                    }}
                                  >
                                    <X className="h-3.5 w-3.5" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Negar Requisição</p>
                                </TooltipContent>
                              </Tooltip>
                            </>
                          )}

                          {col.status === "concluida" && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/20"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleArchive(req.id);
                                  }}
                                >
                                  <Archive className="h-3.5 w-3.5" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Arquivar</p>
                              </TooltipContent>
                            </Tooltip>
                          )}

                          {(col.status === "negada" ||
                            col.status === "nova") && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 hover:text-destructive hover:bg-destructive/10"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleMoveToTrash(req.id);
                                  }}
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Excluir</p>
                              </TooltipContent>
                            </Tooltip>
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
    </TooltipProvider>
  );
}
