// Empresas
export const empresas = [
  { id: "emp-1", nome: "TechVision LTDA" },
  { id: "emp-2", nome: "Alpha Distribuidora" },
  { id: "emp-3", nome: "Mundo Office" },
];

// Setores por empresa
export const setores = [
  { id: "set-1", nome: "Financeiro", empresaId: "emp-1" },
  { id: "set-2", nome: "RH", empresaId: "emp-1" },
  { id: "set-3", nome: "TI", empresaId: "emp-1" },
  { id: "set-4", nome: "Comercial", empresaId: "emp-2" },
  { id: "set-5", nome: "Recepção", empresaId: "emp-2" },
  { id: "set-6", nome: "Financeiro", empresaId: "emp-2" },
  { id: "set-7", nome: "TI", empresaId: "emp-3" },
  { id: "set-8", nome: "RH", empresaId: "emp-3" },
  { id: "set-9", nome: "Comercial", empresaId: "emp-3" },
];

// Funcionários
export const funcionarios = [
  {
    id: "func-1",
    nome: "Will Santos",
    cpf: "123.456.789-00",
    setorId: "set-3",
    empresaId: "emp-1",
    podeSolicitar: true,
  },
  {
    id: "func-2",
    nome: "Milene Andrade",
    cpf: "987.654.321-00",
    setorId: "set-6",
    empresaId: "emp-2",
    podeSolicitar: true,
  },
  {
    id: "func-3",
    nome: "Carlos Oliveira",
    cpf: "111.222.333-44",
    setorId: "set-1",
    empresaId: "emp-1",
    podeSolicitar: true,
  },
  {
    id: "func-4",
    nome: "Ana Paula Costa",
    cpf: "555.666.777-88",
    setorId: "set-4",
    empresaId: "emp-2",
    podeSolicitar: true,
  },
  {
    id: "func-5",
    nome: "Roberto Lima",
    cpf: "999.888.777-66",
    setorId: "set-7",
    empresaId: "emp-3",
    podeSolicitar: true,
  },
  {
    id: "func-6",
    nome: "Juliana Mendes",
    cpf: "444.333.222-11",
    setorId: "set-2",
    empresaId: "emp-1",
    podeSolicitar: true,
  },
  {
    id: "func-7",
    nome: "Fernando Souza",
    cpf: "777.888.999-00",
    setorId: "set-5",
    empresaId: "emp-2",
    podeSolicitar: true,
  },
  {
    id: "func-8",
    nome: "Patrícia Alves",
    cpf: "222.111.333-55",
    setorId: "set-9",
    empresaId: "emp-3",
    podeSolicitar: true,
  },
];

export type StatusRequisicao =
  | "nova"
  | "em_atendimento"
  | "concluida"
  | "negada";

export interface ItemRequisicao {
  nome: string;
  quantidade: number;
  observacoes?: string;
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

// Requisições mockadas
export const requisicoesIniciais: Requisicao[] = [
  {
    id: "req-001",
    funcionarioId: "func-1",
    setorId: "set-3",
    empresaId: "emp-1",
    status: "nova",
    itens: [
      { nome: "Canetas azuis", quantidade: 6, observacoes: "Preferência BIC" },
      { nome: "Mouse sem fio", quantidade: 1 },
      { nome: "Pilha AA para mouse", quantidade: 2 },
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
      { nome: "Resma de papel A4", quantidade: 5 },
      { nome: "Grampeador", quantidade: 1 },
      { nome: "Grampos", quantidade: 2, observacoes: "Caixa com 5000 unid." },
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
      { nome: "Calculadora financeira", quantidade: 1 },
      { nome: "Caderno grande", quantidade: 2 },
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
      { nome: "Suporte para notebook", quantidade: 1 },
      { nome: "Hub USB", quantidade: 1 },
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
      { nome: "Teclado mecânico", quantidade: 1 },
      { nome: "Mouse pad grande", quantidade: 1 },
      { nome: "Cabo HDMI 2m", quantidade: 2 },
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
      { nome: "Pastas suspensas", quantidade: 20 },
      { nome: "Etiquetas adesivas", quantidade: 5, observacoes: "Folha A4" },
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
    itens: [{ nome: "Cadeira gamer", quantidade: 1, observacoes: "Cor preta" }],
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
      { nome: "Tinta para carimbo", quantidade: 2, observacoes: "Azul" },
      { nome: "Carimbo personalizado", quantidade: 1 },
      { nome: "Bloco de notas adesivas", quantidade: 10 },
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
    itens: [{ nome: 'Monitor ultrawide 34"', quantidade: 1 }],
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
      { nome: "Envelopes A4", quantidade: 50 },
      {
        nome: "Clipes de papel",
        quantidade: 5,
        observacoes: "Caixa 100 unid.",
      },
    ],
    dataCriacao: "2025-11-15T09:30:00",
    dataAtualizacao: "2025-11-18T11:00:00",
  },
];

// Funções auxiliares
export function getFuncionarioByCpf(cpf: string) {
  return funcionarios.find((f) => f.cpf === cpf);
}

export function getFuncionarioById(id: string) {
  return funcionarios.find((f) => f.id === id);
}

export function getSetorById(id: string) {
  return setores.find((s) => s.id === id);
}

export function getEmpresaById(id: string) {
  return empresas.find((e) => e.id === id);
}

export function getSetoresByEmpresa(empresaId: string) {
  return setores.filter((s) => s.empresaId === empresaId);
}

export function getFuncionariosByEmpresa(empresaId: string) {
  return funcionarios.filter((f) => f.empresaId === empresaId);
}

export function getFuncionariosBySetor(setorId: string) {
  return funcionarios.filter((f) => f.setorId === setorId);
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
  concluida: "bg-primary/20 text-primary border-primary/30",
  negada: "bg-red-500/20 text-red-400 border-red-500/30",
};
