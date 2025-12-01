"use client";

import { useState, useMemo } from "react";
import { Eye, ArrowRight, X, User, Calendar, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRequisicoesStore } from "@/lib/requisicoes-store";
import { RequisicaoModal } from "./requisicao-modal";
import {
  type Requisicao,
  type StatusRequisicao,
  statusLabels,
  getFuncionarioById,
  getSetorById,
} from "@/lib/mock-data";

interface KanbanBoardProps {
  requisicoes: Requisicao[];
}

const columns: {
  status: StatusRequisicao;
  label: string;
  color: string;
  bgHeader: string;
}[] = [
  {
    status: "nova",
    label: "Novas",
    color: "border-blue-500",
    bgHeader: "bg-blue-500/10",
  },
  {
    status: "em_atendimento",
    label: "Em Atendimento",
    color: "border-yellow-500",
    bgHeader: "bg-yellow-500/10",
  },
  {
    status: "concluida",
    label: "Concluídas",
    color: "border-primary",
    bgHeader: "bg-primary/10",
  },
  {
    status: "negada",
    label: "Negadas",
    color: "border-red-500",
    bgHeader: "bg-red-500/10",
  },
];

export function KanbanBoard({ requisicoes }: KanbanBoardProps) {
  const { updateStatus } = useRequisicoesStore();
  const [selectedRequisicao, setSelectedRequisicao] =
    useState<Requisicao | null>(null);

  const requisicoesByStatus = useMemo(() => {
    const grouped: Record<StatusRequisicao, Requisicao[]> = {
      nova: [],
      em_atendimento: [],
      concluida: [],
      negada: [],
    };

    requisicoes.forEach((req) => {
      grouped[req.status].push(req);
    });

    return grouped;
  }, [requisicoes]);

  const getNextStatus = (
    current: StatusRequisicao
  ): StatusRequisicao | null => {
    const flow: Record<StatusRequisicao, StatusRequisicao | null> = {
      nova: "em_atendimento",
      em_atendimento: "concluida",
      concluida: null,
      negada: null,
    };
    return flow[current];
  };

  const canDeny = (current: StatusRequisicao): boolean => {
    return current === "nova" || current === "em_atendimento";
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {columns.map((column) => (
          <div
            key={column.status}
            className="bg-card border border-border rounded-xl overflow-hidden"
          >
            {/* Header da coluna */}
            <div
              className={`${column.bgHeader} border-b ${column.color} border-b-2 px-4 py-3`}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-card-foreground">
                  {column.label}
                </h3>
                <span className="bg-background/50 text-card-foreground text-sm font-medium px-2 py-0.5 rounded-full">
                  {requisicoesByStatus[column.status].length}
                </span>
              </div>
            </div>

            {/* Cards */}
            <div className="p-3 space-y-3 max-h-[600px] overflow-y-auto">
              {requisicoesByStatus[column.status].length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  Nenhuma requisição
                </div>
              ) : (
                requisicoesByStatus[column.status].map((req) => {
                  const funcionario = getFuncionarioById(req.funcionarioId);
                  const setor = getSetorById(req.setorId);
                  const nextStatus = getNextStatus(req.status);

                  return (
                    <div
                      key={req.id}
                      className="bg-muted/30 border border-border rounded-lg p-4 hover:border-primary/50 transition-colors"
                    >
                      {/* Cabeçalho do card */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium text-card-foreground text-sm">
                            {funcionario?.nome}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2 text-xs text-muted-foreground mb-3">
                        <div className="flex items-center gap-2">
                          <Package className="h-3 w-3" />
                          <span>{setor?.nome}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3 w-3" />
                          <span>
                            {new Date(req.dataCriacao).toLocaleDateString(
                              "pt-BR"
                            )}
                          </span>
                        </div>
                      </div>

                      {/* Itens */}
                      <div className="bg-background/50 rounded-md p-2 mb-3">
                        <p className="text-xs text-muted-foreground mb-1">
                          Itens ({req.itens.length})
                        </p>
                        <div className="text-xs text-card-foreground">
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

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 bg-transparent"
                          onClick={() => setSelectedRequisicao(req)}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          Detalhes
                        </Button>
                        {nextStatus && (
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => updateStatus(req.id, nextStatus)}
                            title={`Mover para ${statusLabels[nextStatus]}`}
                          >
                            <ArrowRight className="h-3 w-3" />
                          </Button>
                        )}
                        {canDeny(req.status) && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => updateStatus(req.id, "negada")}
                            title="Negar requisição"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })
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
    </>
  );
}
