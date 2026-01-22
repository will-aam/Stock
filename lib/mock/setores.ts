// lib/mock/setores.ts

export interface Setor {
  id: string;
  nome: string;
  empresaId: string;
}

export const setores: Setor[] = [
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

export function getSetorById(id: string) {
  return setores.find((s) => s.id === id);
}

export function getSetoresByEmpresa(empresaId: string) {
  return setores.filter((s) => s.empresaId === empresaId);
}
