// lib/mock/requisicoes.ts

export type StatusRequisicao =
  | "nova"
  | "em_atendimento"
  | "concluida"
  | "negada";
export type ItemTag = "separar" | "comprar" | null;

export interface ItemRequisicao {
  nome: string;
  quantidade: number;
  observacoes?: string;
  funcionarioId?: string;
  tag?: ItemTag;
}

export interface Requisicao {
  id: string;
  funcionarioId: string;
  setorId: string;
  empresaId: string;
  status: StatusRequisicao;
  itens: ItemRequisicao[];
  dataCriacao: string;
  dataAtualizacao: string;
  observacoesGerais?: string;
}

export const statusLabels: Record<StatusRequisicao, string> = {
  nova: "Nova",
  em_atendimento: "Em Atendimento",
  concluida: "Concluída",
  negada: "Negada",
};

export const statusColors: Record<StatusRequisicao, string> = {
  nova: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  em_atendimento: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  concluida: "bg-green-500/20 text-green-400 border-green-500/30",
  negada: "bg-red-500/20 text-red-400 border-red-500/30",
};

export const requisicoesIniciais: Requisicao[] = [
  {
    id: "req-001",
    funcionarioId: "func-1",
    setorId: "set-3",
    empresaId: "emp-1",
    status: "nova",
    itens: [
      {
        nome: "Canetas azuis",
        quantidade: 6,
        observacoes: "Preferência BIC",
        funcionarioId: "func-1",
      },
      { nome: "Mouse sem fio", quantidade: 1, funcionarioId: "func-1" },
      { nome: "Pilha AA para mouse", quantidade: 2, funcionarioId: "func-1" },
    ],
    dataCriacao: "2025-11-29T10:30:00",
    dataAtualizacao: "2025-11-29T10:30:00",
  },
  {
    id: "req-002",
    funcionarioId: "func-2",
    setorId: "set-6",
    empresaId: "emp-2",
    status: "nova",
    itens: [
      { nome: "Resma de papel A4", quantidade: 5, funcionarioId: "func-2" },
      { nome: "Grampeador", quantidade: 1, funcionarioId: "func-2" },
      {
        nome: "Grampos",
        quantidade: 2,
        observacoes: "Caixa com 5000 unid.",
        funcionarioId: "func-2",
      },
    ],
    dataCriacao: "2025-11-29T14:15:00",
    dataAtualizacao: "2025-11-29T14:15:00",
  },
  {
    id: "req-003",
    funcionarioId: "func-3",
    setorId: "set-1",
    empresaId: "emp-1",
    status: "em_atendimento",
    itens: [
      {
        nome: "Calculadora financeira",
        quantidade: 1,
        funcionarioId: "func-3",
      },
      { nome: "Caderno grande", quantidade: 2, funcionarioId: "func-3" },
    ],
    dataCriacao: "2025-11-28T09:00:00",
    dataAtualizacao: "2025-11-29T08:00:00",
  },
  {
    id: "req-004",
    funcionarioId: "func-4",
    setorId: "set-4",
    empresaId: "emp-2",
    status: "em_atendimento",
    itens: [
      { nome: "Suporte para notebook", quantidade: 1, funcionarioId: "func-4" },
      { nome: "Hub USB", quantidade: 1, funcionarioId: "func-4" },
    ],
    dataCriacao: "2025-11-27T16:45:00",
    dataAtualizacao: "2025-11-28T11:30:00",
  },
  {
    id: "req-005",
    funcionarioId: "func-5",
    setorId: "set-7",
    empresaId: "emp-3",
    status: "concluida",
    itens: [
      { nome: "Teclado mecânico", quantidade: 1, funcionarioId: "func-5" },
      { nome: "Mouse pad grande", quantidade: 1, funcionarioId: "func-5" },
      { nome: "Cabo HDMI 2m", quantidade: 2, funcionarioId: "func-5" },
    ],
    dataCriacao: "2025-11-25T10:00:00",
    dataAtualizacao: "2025-11-27T14:00:00",
  },
  {
    id: "req-006",
    funcionarioId: "func-6",
    setorId: "set-2",
    empresaId: "emp-1",
    status: "concluida",
    itens: [
      { nome: "Pastas suspensas", quantidade: 20, funcionarioId: "func-6" },
      {
        nome: "Etiquetas adesivas",
        quantidade: 5,
        observacoes: "Folha A4",
        funcionarioId: "func-6",
      },
    ],
    dataCriacao: "2025-11-24T11:20:00",
    dataAtualizacao: "2025-11-26T09:00:00",
  },
  {
    id: "req-007",
    funcionarioId: "func-7",
    setorId: "set-5",
    empresaId: "emp-2",
    status: "negada",
    itens: [
      {
        nome: "Cadeira gamer",
        quantidade: 1,
        observacoes: "Cor preta",
        funcionarioId: "func-7",
      },
    ],
    dataCriacao: "2025-11-23T15:30:00",
    dataAtualizacao: "2025-11-24T10:00:00",
    observacoesGerais: "Item fora do catálogo de materiais permitidos.",
  },
  {
    id: "req-008",
    funcionarioId: "func-8",
    setorId: "set-9",
    empresaId: "emp-3",
    status: "nova",
    itens: [
      {
        nome: "Tinta para carimbo",
        quantidade: 2,
        observacoes: "Azul",
        funcionarioId: "func-8",
      },
      { nome: "Carimbo personalizado", quantidade: 1, funcionarioId: "func-8" },
      {
        nome: "Bloco de notas adesivas",
        quantidade: 10,
        funcionarioId: "func-8",
      },
    ],
    dataCriacao: "2025-11-30T08:00:00",
    dataAtualizacao: "2025-11-30T08:00:00",
  },
  {
    id: "req-009",
    funcionarioId: "func-1",
    setorId: "set-3",
    empresaId: "emp-1",
    status: "negada",
    itens: [
      { nome: 'Monitor ultrawide 34"', quantidade: 1, funcionarioId: "func-1" },
    ],
    dataCriacao: "2025-11-20T14:00:00",
    dataAtualizacao: "2025-11-21T16:00:00",
    observacoesGerais:
      "Equipamento precisa de aprovação especial da diretoria.",
  },
  {
    id: "req-010",
    funcionarioId: "func-3",
    setorId: "set-1",
    empresaId: "emp-1",
    status: "concluida",
    itens: [
      { nome: "Envelopes A4", quantidade: 50, funcionarioId: "func-3" },
      {
        nome: "Clipes de papel",
        quantidade: 5,
        observacoes: "Caixa 100 unid.",
        funcionarioId: "func-3",
      },
    ],
    dataCriacao: "2025-11-15T09:30:00",
    dataAtualizacao: "2025-11-18T11:00:00",
  },
];
