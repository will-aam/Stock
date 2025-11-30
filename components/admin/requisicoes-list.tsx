"use client";

import { useState } from "react";
import { Eye, ArrowRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRequisicoesStore } from "@/lib/requisicoes-store";
import { RequisicaoModal } from "./requisicao-modal";
import {
  type Requisicao,
  type StatusRequisicao,
  statusLabels,
  statusColors,
  getFuncionarioById,
  getSetorById,
} from "@/lib/mock-data";

interface RequisicoesListProps {
  requisicoes: Requisicao[];
}

export function RequisicoesList({ requisicoes }: RequisicoesListProps) {
  const { updateStatus } = useRequisicoesStore();
  const [selectedRequisicao, setSelectedRequisicao] =
    useState<Requisicao | null>(null);

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

  if (requisicoes.length === 0) {
    return (
      <div className="bg-card border border-border rounded-xl p-12 text-center">
        <p className="text-muted-foreground">
          Nenhuma requisição encontrada com os filtros selecionados.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="hidden md:grid grid-cols-[1fr_120px_1fr_100px_100px_120px] gap-4 px-4 py-3 bg-muted/50 border-b border-border text-sm font-medium text-muted-foreground">
          <span>Funcionário</span>
          <span>Setor</span>
          <span>Itens</span>
          <span>Data</span>
          <span>Status</span>
          <span>Ações</span>
        </div>

        {/* Lista */}
        <div className="divide-y divide-border">
          {requisicoes.map((req) => {
            const funcionario = getFuncionarioById(req.funcionarioId);
            const setor = getSetorById(req.setorId);
            const nextStatus = getNextStatus(req.status);

            return (
              <div
                key={req.id}
                className="md:grid md:grid-cols-[1fr_120px_1fr_100px_100px_120px] gap-4 px-4 py-4 hover:bg-muted/30 transition-colors"
              >
                {/* Mobile view */}
                <div className="md:hidden space-y-3 mb-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-card-foreground">
                      {funcionario?.nome}
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full border ${
                        statusColors[req.status]
                      }`}
                    >
                      {statusLabels[req.status]}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {setor?.nome}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {req.itens.length}{" "}
                    {req.itens.length === 1 ? "item" : "itens"} •{" "}
                    {new Date(req.dataCriacao).toLocaleDateString("pt-BR")}
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
                      >
                        <ArrowRight className="h-3 w-3" />
                      </Button>
                    )}
                    {canDeny(req.status) && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => updateStatus(req.id, "negada")}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>

                {/* Desktop view - Removido empresa */}
                <div className="hidden md:flex items-center">
                  <span className="font-medium text-card-foreground">
                    {funcionario?.nome}
                  </span>
                </div>
                <div className="hidden md:flex items-center text-sm text-muted-foreground">
                  {setor?.nome}
                </div>
                <div className="hidden md:flex items-center text-sm text-muted-foreground">
                  {req.itens.slice(0, 2).map((item, i) => (
                    <span key={i}>
                      {item.quantidade}x {item.nome}
                      {i < Math.min(req.itens.length, 2) - 1 && ", "}
                    </span>
                  ))}
                  {req.itens.length > 2 && (
                    <span> +{req.itens.length - 2}</span>
                  )}
                </div>
                <div className="hidden md:flex items-center text-sm text-muted-foreground">
                  {new Date(req.dataCriacao).toLocaleDateString("pt-BR")}
                </div>
                <div className="hidden md:flex items-center">
                  <span
                    className={`text-xs px-2 py-1 rounded-full border ${
                      statusColors[req.status]
                    }`}
                  >
                    {statusLabels[req.status]}
                  </span>
                </div>
                <div className="hidden md:flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedRequisicao(req)}
                    title="Ver detalhes"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  {nextStatus && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => updateStatus(req.id, nextStatus)}
                      title={`Mover para ${statusLabels[nextStatus]}`}
                    >
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  )}
                  {canDeny(req.status) && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => updateStatus(req.id, "negada")}
                      title="Negar requisição"
                      className="text-destructive hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal de detalhes */}
      {selectedRequisicao && (
        <RequisicaoModal
          requisicao={selectedRequisicao}
          onClose={() => setSelectedRequisicao(null)}
        />
      )}
    </>
  );
}
