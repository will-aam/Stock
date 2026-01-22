// lib/mock/funcionarios.ts

export interface Funcionario {
  id: string;
  nome: string;
  cpf: string;
  setorId: string;
  empresaId: string;
  podeSolicitar: boolean;
}

export const funcionarios: Funcionario[] = [
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

export function getFuncionarioByCpf(cpf: string) {
  return funcionarios.find((f) => f.cpf === cpf);
}

export function getFuncionarioById(id: string) {
  return funcionarios.find((f) => f.id === id);
}

export function getFuncionariosByEmpresa(empresaId: string) {
  return funcionarios.filter((f) => f.empresaId === empresaId);
}

export function getFuncionariosBySetor(setorId: string) {
  return funcionarios.filter((f) => f.setorId === setorId);
}
