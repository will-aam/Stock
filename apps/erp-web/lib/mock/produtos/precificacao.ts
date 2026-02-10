// TABELAS DINÂMICAS (Substitui Preço A, B, C, D...)
export interface TabelaPreco {
  id: string;
  nome: string; // "Varejo", "Atacado", "Promoção"
  valor: number;
}

// AGENDAMENTO DE PREÇO (Miscibilidade)
export interface AgendamentoPreco {
  id: string;
  dataInicio: Date;
  tabelaId: string; // Qual tabela vai mudar?
  novoValor: number;
  status: "pendente" | "aplicado" | "cancelado";
  usuarioId: string; // Quem agendou
}

// O MOTOR DE REGRAS (A parte complexa simplificada)
// Ex: Se FormaPagamento == iFood -> Preço A + 12%
// Ex: Se Cliente == VIP -> Preço A - 10%
export interface RegraPrecificacao {
  id: string;
  nome: string; // "Taxa iFood" ou "Desconto Cliente VIP"
  ativo: boolean;

  // Condições (Gatilhos)
  aplicarEm: "forma_pagamento" | "cliente" | "grupo_cliente";
  alvoId: string; // ID do iFood ou ID do Cliente

  // Ação
  baseCalculo: string; // ID da tabela base (ex: Tabela "Varejo")
  tipoAjuste: "acrescimo" | "desconto" | "fixo";
  valorAjuste: number; // Ex: 10 (se for %, aumenta 10%. Se for fixo, vira R$ 10,00)
  modoAjuste: "percentual" | "valor_real";

  // Validade (Opcional)
  dataInicio?: Date;
  dataFim?: Date;
}
