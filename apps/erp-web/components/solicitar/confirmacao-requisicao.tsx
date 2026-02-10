"use client";

import { CheckCircle, FileText, Plus, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ItemRequisicao } from "@/lib/mock-data";

interface ConfirmacaoRequisicaoProps {
  dados: {
    funcionarioNome: string;
    setorNome: string;
    empresaNome: string;
    itens: ItemRequisicao[];
    dataHora: string;
    protocolo: string;
  };
  onNovaRequisicao: () => void;
  onSair: () => void;
}

export function ConfirmacaoRequisicao({
  dados,
  onNovaRequisicao,
  onSair,
}: ConfirmacaoRequisicaoProps) {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      {/* Header de sucesso */}
      <div className="bg-primary/10 border-b border-primary/20 px-6 py-8 text-center">
        <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-card-foreground mb-2">
          Requisição Enviada!
        </h1>
        <p className="text-muted-foreground">
          Sua solicitação foi registrada com sucesso.
        </p>
      </div>

      {/* Resumo da requisição */}
      <div className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="h-5 w-5 text-primary" />
          <h2 className="font-semibold text-card-foreground">
            Resumo da Requisição
          </h2>
        </div>

        <div className="bg-muted/30 border border-border rounded-lg p-4 space-y-3">
          <div className="flex justify-between items-center pb-3 border-b border-border">
            <span className="text-sm text-muted-foreground">Protocolo</span>
            <span className="font-mono font-semibold text-primary">
              {dados.protocolo}
            </span>
          </div>
          <div className="grid sm:grid-cols-3 gap-3 text-sm">
            <div>
              <p className="text-muted-foreground">Funcionário</p>
              <p className="font-medium text-card-foreground">
                {dados.funcionarioNome}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Setor</p>
              <p className="font-medium text-card-foreground">
                {dados.setorNome}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Empresa</p>
              <p className="font-medium text-card-foreground">
                {dados.empresaNome}
              </p>
            </div>
          </div>
          <div className="pt-3 border-t border-border">
            <p className="text-sm text-muted-foreground mb-2">Data/Hora</p>
            <p className="font-medium text-card-foreground">{dados.dataHora}</p>
          </div>
        </div>

        {/* Lista de itens */}
        <div className="mt-6">
          <h3 className="font-medium text-card-foreground mb-3">
            Itens Solicitados
          </h3>
          <div className="space-y-2">
            {dados.itens.map((item, index) => (
              <div
                key={index}
                className="bg-muted/30 border border-border rounded-lg px-4 py-3"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-card-foreground">
                      {item.nome}
                    </p>
                    {item.observacoes && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {item.observacoes}
                      </p>
                    )}
                  </div>
                  <span className="bg-primary/10 text-primary text-sm font-medium px-3 py-1 rounded-full">
                    {item.quantidade}x
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ações */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <Button onClick={onNovaRequisicao} className="flex-1">
            <Plus className="h-4 w-4 mr-2" />
            Nova Requisição
          </Button>
          <Button
            onClick={onSair}
            variant="outline"
            className="flex-1 bg-transparent"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sair do Sistema
          </Button>
        </div>
      </div>
    </div>
  );
}
