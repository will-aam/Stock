"use client";

import { History, Clock, User } from "lucide-react";

interface TabHistoricoProps {
  isEditing: boolean;
}

// Mock de histórico (Movido do ficheiro original)
const mockHistorico = [
  {
    data: "25/01/2026 14:30",
    usuario: "Will Santos",
    acao: "Alterou preço de venda (Matriz)",
    detalhe: "R$ 10,00 -> R$ 12,00",
  },
  {
    data: "20/01/2026 09:15",
    usuario: "Ana Paula",
    acao: "Alterou Grupo Tributário",
    detalhe: "001 -> 002",
  },
  {
    data: "15/01/2026 10:00",
    usuario: "Sistema",
    acao: "Criação do Produto",
    detalhe: "Importação XML",
  },
];

export function TabHistorico({ isEditing }: TabHistoricoProps) {
  if (!isEditing) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <History className="h-12 w-12 text-muted-foreground/30 mb-4" />
        <h3 className="text-lg font-semibold text-muted-foreground mb-1">
          Sem Histórico Ainda
        </h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          O histórico de alterações será exibido aqui após você salvar o produto
          pela primeira vez.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold flex items-center gap-2">
        <History className="h-4 w-4" />
        Log de Alterações
      </h3>
      <div className="relative border-l-2 border-muted ml-2 space-y-6 pl-6 py-2">
        {mockHistorico.map((log, idx) => (
          <div key={idx} className="relative">
            <span className="absolute -left-[31px] top-1 h-3 w-3 rounded-full bg-muted-foreground/30 border-2 border-background" />
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-foreground">
                {log.acao}
              </span>
              <span className="text-xs text-muted-foreground italic">
                {log.detalhe}
              </span>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-[10px] flex items-center gap-1 text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                  <Clock className="h-3 w-3" /> {log.data}
                </span>
                <span className="text-[10px] flex items-center gap-1 text-muted-foreground">
                  <User className="h-3 w-3" /> {log.usuario}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
