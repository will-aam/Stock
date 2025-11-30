"use client";

import { X, User, Users, Calendar, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  type Requisicao,
  statusLabels,
  statusColors,
  getFuncionarioById,
  getSetorById,
} from "@/lib/mock-data";

interface RequisicaoModalProps {
  requisicao: Requisicao;
  onClose: () => void;
}

export function RequisicaoModal({ requisicao, onClose }: RequisicaoModalProps) {
  const funcionario = getFuncionarioById(requisicao.funcionarioId);
  const setor = getSetorById(requisicao.setorId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-card border border-border rounded-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-hidden shadow-xl">
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
        <div className="p-5 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Status */}
          <div className="mb-4">
            <span
              className={`inline-flex px-3 py-1 rounded-full border text-sm font-medium ${
                statusColors[requisicao.status]
              }`}
            >
              {statusLabels[requisicao.status]}
            </span>
          </div>

          {/* Info do solicitante */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="bg-muted/30 rounded-lg p-3">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <User className="h-3 w-3" />
                <span className="text-xs">Funcionário</span>
              </div>
              <p className="font-medium text-card-foreground text-sm">
                {funcionario?.nome}
              </p>
            </div>
            <div className="bg-muted/30 rounded-lg p-3">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Users className="h-3 w-3" />
                <span className="text-xs">Setor</span>
              </div>
              <p className="font-medium text-card-foreground text-sm">
                {setor?.nome}
              </p>
            </div>
            <div className="col-span-2 bg-muted/30 rounded-lg p-3">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Calendar className="h-3 w-3" />
                <span className="text-xs">Data da Requisição</span>
              </div>
              <p className="font-medium text-card-foreground text-sm">
                {new Date(requisicao.dataCriacao).toLocaleString("pt-BR")}
              </p>
            </div>
          </div>

          {/* Itens */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Package className="h-4 w-4 text-primary" />
              <h3 className="font-semibold text-card-foreground">
                Itens Solicitados ({requisicao.itens.length})
              </h3>
            </div>
            <div className="space-y-2">
              {requisicao.itens.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-muted/30 border border-border rounded-lg p-3"
                >
                  <span className="text-card-foreground text-sm">
                    {item.nome}
                  </span>
                  <span className="bg-primary/10 text-primary text-sm font-semibold px-2.5 py-0.5 rounded-full">
                    {item.quantidade}x
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-border bg-muted/20">
          <Button
            variant="outline"
            className="w-full bg-transparent"
            onClick={onClose}
          >
            Fechar
          </Button>
        </div>
      </div>
    </div>
  );
}
