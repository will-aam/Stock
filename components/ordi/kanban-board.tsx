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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRequisicoesStore } from "@/lib/requisicoes-store";
import { RequisicaoModal } from "./requisicao-modal";
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
  const { toast } = useToast();

  const handleNextStatus = (id: string, currentStatus: StatusRequisicao) => {
    let next: StatusRequisicao = "nova";
    if (currentStatus === "nova") next = "em_atendimento";
    else if (currentStatus === "em_atendimento") next = "concluida";

    updateStatus(id, next);
    toast({
      title: "Status atualizado",
      description: `Pedido movido para ${statusLabels[next]}.`,
    });
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

            {/* Área de Cards (Scroll APENAS vertical aqui dentro) */}
            <div className="flex-1 p-3 space-y-3 overflow-y-auto min-h-0 scrollbar-thin max-h-[calc(100vh-280px)]">
              {requisicoes
                .filter((r) => r.status === col.status)
                .map((req) => {
                  const setor = getSetorById(req.setorId);

                  return (
                    <div
                      key={req.id}
                      className="bg-background p-3 rounded-lg border shadow-sm hover:shadow-md transition-all group"
                    >
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
                            "pt-BR"
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

                        {/* Botões de Ação Condicionais */}
                        {(col.status === "nova" ||
                          col.status === "em_atendimento") && (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 rounded-md hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-950/20"
                              onClick={() =>
                                handleNextStatus(req.id, col.status)
                              }
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
                              onClick={() => handleDeny(req.id)}
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
                            onClick={() => handleArchive(req.id)}
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
                            onClick={() => handleMoveToTrash(req.id)}
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

      {selectedRequisicao && (
        <RequisicaoModal
          requisicao={selectedRequisicao}
          onClose={() => setSelectedRequisicao(null)}
        />
      )}

      <TrashSheet open={isTrashOpen} onOpenChange={setIsTrashOpen} />
    </div>
  );
}
