"use client";

import { create } from "zustand";
import {
  requisicoesIniciais,
  type Requisicao,
  type StatusRequisicao,
} from "./mock-data";

interface RequisicoesStore {
  requisicoes: Requisicao[];
  addRequisicao: (requisicao: Requisicao) => void;
  updateStatus: (id: string, status: StatusRequisicao) => void;
  getRequisicaoById: (id: string) => Requisicao | undefined;
}

export const useRequisicoesStore = create<RequisicoesStore>((set, get) => ({
  requisicoes: requisicoesIniciais,
  addRequisicao: (requisicao) =>
    set((state) => ({
      requisicoes: [requisicao, ...state.requisicoes],
    })),
  updateStatus: (id, status) =>
    set((state) => ({
      requisicoes: state.requisicoes.map((req) =>
        req.id === id
          ? { ...req, status, dataAtualizacao: new Date().toISOString() }
          : req
      ),
    })),
  getRequisicaoById: (id) => get().requisicoes.find((req) => req.id === id),
}));
