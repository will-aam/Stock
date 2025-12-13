// app/components/ordi/requisicoes-list.tsx
"use client";

import { useState, useMemo } from "react";
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

/**
 * Agora a lista é renderizada por setor:
 * - Um card por setor com resumo (nome do setor, qtd de requisições, qtd de itens)
 * - Cada card pode ser expandido para ver as requisições daquele setor.
 * - Dentro da requisição, o setor é a informação principal e o funcionário é um detalhe.
 */
export function RequisicoesList({ requisicoes }: RequisicoesListProps) {
  const { updateStatus } = useRequisicoesStore();
  const [selectedRequisicao, setSelectedRequisicao] =
    useState<Requisicao | null>(null);

  // Controla quais setores estão expandidos (usando um Record para eficiência)
  const [expandedSetores, setExpandedSetores] = useState<
    Record<string, boolean>
  >({});

  const toggleSetor = (setorId: string) =>
    setExpandedSetores((s) => ({ ...s, [setorId]: !s[setorId] }));

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

  // Agrupa requisições por setor para a nova visualização
  const groupedBySetor = useMemo(() => {
    const map: Record<string, Requisicao[]> = {};
    requisicoes.forEach((req) => {
      if (!map[req.setorId]) map[req.setorId] = [];
      map[req.setorId].push(req);
    });
    return map;
  }, [requisicoes]);

  // Ordena os setores alfabeticamente para uma exibição consistente
  const setoresOrdenados = useMemo(() => {
    return Object.keys(groupedBySetor).sort((a, b) => {
      const sa = getSetorById(a)?.nome ?? a;
      const sb = getSetorById(b)?.nome ?? b;
      return sa.localeCompare(sb);
    });
  }, [groupedBySetor]);

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
      {/* Exibe um card por setor */}
      <div className="space-y-4">
        {setoresOrdenados.map((setorId) => {
          const reqs = groupedBySetor[setorId] || [];
          const setor = getSetorById(setorId);
          const totalItens = reqs.reduce((acc, r) => acc + r.itens.length, 0);
          const allStatuses = Array.from(new Set(reqs.map((r) => r.status)));

          const isExpanded = !!expandedSetores[setorId];

          return (
            <div
              key={setorId}
              className="bg-card border border-border rounded-xl overflow-hidden"
            >
              {/* Header do card do setor */}
              <div className="flex items-center justify-between px-4 py-3 gap-4">
                <div className="flex items-center gap-4">
                  <div className="rounded-md bg-muted/20 px-3 py-2 text-sm font-semibold">
                    {setor?.nome ?? "Setor desconhecido"}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {reqs.length} requisição{reqs.length > 1 ? "es" : ""} •{" "}
                    {totalItens} item{totalItens > 1 ? "s" : ""}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    {allStatuses.map((st) => (
                      <span
                        key={st}
                        className={`text-xs px-2 py-1 rounded-full border ${statusColors[st]}`}
                      >
                        {statusLabels[st]}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    onClick={() => toggleSetor(setorId)}
                    size="sm"
                  >
                    {isExpanded ? "Recolher" : "Ver requisições"}
                  </Button>
                </div>
              </div>

              {/* Conteúdo expandido: lista de requisições daquele setor */}
              {isExpanded && (
                <div className="divide-y divide-border">
                  {reqs.map((req) => {
                    const funcionario = getFuncionarioById(req.funcionarioId);
                    const nextStatus = getNextStatus(req.status);

                    return (
                      <div
                        key={req.id}
                        className="px-4 py-4 hover:bg-muted/30 transition-colors space-y-2 md:space-y-0 md:grid md:grid-cols-[1fr_120px_1fr_100px_100px_120px] md:gap-4 md:items-center"
                      >
                        {/* Mobile view */}
                        <div className="md:hidden space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-card-foreground">
                              {setor?.nome}
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
                            Solicitante: {funcionario?.nome}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {req.itens.length} item
                            {req.itens.length > 1 ? "s" : ""} •{" "}
                            {new Date(req.dataCriacao).toLocaleDateString(
                              "pt-BR"
                            )}
                          </div>
                          <div className="flex gap-2 pt-2">
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
                                {statusLabels[nextStatus]}
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

                        {/* Desktop view */}
                        <div className="hidden md:block">
                          <span className="font-medium text-card-foreground">
                            {setor?.nome}
                          </span>
                          <div className="text-sm text-muted-foreground">
                            Solicitante: {funcionario?.nome}
                          </div>
                        </div>
                        <div className="hidden md:flex items-center text-sm text-muted-foreground">
                          {req.itens.length} item
                          {req.itens.length > 1 ? "s" : ""}
                        </div>
                        <div className="hidden md:flex items-center text-sm text-muted-foreground">
                          {new Date(req.dataCriacao).toLocaleDateString(
                            "pt-BR"
                          )}
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
                        <div className="hidden md:flex items-center justify-end gap-1">
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
              )}
            </div>
          );
        })}
      </div>

      {/* Modal de detalhes (sem alterações) */}
      {selectedRequisicao && (
        <RequisicaoModal
          requisicao={selectedRequisicao}
          onClose={() => setSelectedRequisicao(null)}
        />
      )}
    </>
  );
}
