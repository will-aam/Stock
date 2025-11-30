"use client";

import { create } from "zustand";

interface Funcionario {
  id: string;
  nome: string;
  cpf: string;
  setorId: string;
  empresaId: string;
  podeSolicitar: boolean;
}

interface FuncionarioStore {
  funcionarioLogado: Funcionario | null;
  setFuncionarioLogado: (funcionario: Funcionario | null) => void;
  logout: () => void;
}

export const useFuncionarioStore = create<FuncionarioStore>((set) => ({
  funcionarioLogado: null,
  setFuncionarioLogado: (funcionario) =>
    set({ funcionarioLogado: funcionario }),
  logout: () => set({ funcionarioLogado: null }),
}));
