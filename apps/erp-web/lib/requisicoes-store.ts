"use client";

import { create } from "zustand";
import {
  requisicoesIniciais,
  type Requisicao,
  type ItemRequisicao,
  type StatusRequisicao,
} from "./mock-data";

// Interface atualizada: removeu `updateRequisicao` e adicionou `updateItens`
interface RequisicoesStore {
  requisicoes: Requisicao[];
  addRequisicao: (requisicao: Requisicao) => void;
  updateStatus: (id: string, status: StatusRequisicao) => void;
  updateItens: (id: string, newItems: ItemRequisicao[]) => void; // Nova função para salvar itens
  getRequisicaoById: (id: string) => Requisicao | undefined;
}

export const useRequisicoesStore = create<RequisicoesStore>((set, get) => ({
  requisicoes: requisicoesIniciais,

  addRequisicao: (requisicao) =>
    set((state) => ({
      requisicoes: [requisicao, ...state.requisicoes],
    })),

  // Função para atualizar apenas o status da requisição
  updateStatus: (id, status) =>
    set((state) => ({
      requisicoes: state.requisicoes.map((req) =>
        req.id === id
          ? { ...req, status, dataAtualizacao: new Date().toISOString() }
          : req
      ),
    })),

  // NOVA FUNÇÃO: Atualiza apenas os itens de uma requisição
  updateItens: (id, newItems) => {
    set((state) => ({
      requisicoes: state.requisicoes.map((req) =>
        req.id === id
          ? {
              ...req,
              itens: newItems,
              dataAtualizacao: new Date().toISOString(),
            }
          : req
      ),
    }));
  },

  getRequisicaoById: (id) => get().requisicoes.find((req) => req.id === id),
}));
